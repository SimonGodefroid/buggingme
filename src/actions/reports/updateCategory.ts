'use server';

import { ReportCategory } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import db from '@/db';
import { authMiddleware, validationMiddleware } from '@/middlewares';
import { CATEGORY_STATUS_MAPPER } from './helpers';
import { isAdmin } from '@/helpers';

const updateReportCategorySchema = z.object({
  id: z.string(),
  category: z.nativeEnum(ReportCategory),
});

interface UpdateReportCategoryFormState {
  errors: {
    category?: string[];
    _form?: string[];
  };
  success?: boolean;
}

async function updateUserReputation(
  userId: string,
  newCategory: ReportCategory,
  oldCategory: ReportCategory
) {
  let reputationChange = 0;

  // Calculate the reputation change based on the new category
  switch (newCategory) {
    case 'Resolved':
      reputationChange += 10;
      break;
    case 'Informative':
      reputationChange += 5;
      break;
    case 'Spam':
      reputationChange -= 5;
      break;
    default:
      break;
  }

  // Revert the reputation impact of the old category, if applicable
  switch (oldCategory) {
    case 'Resolved':
      reputationChange -= 10;
      break;
    case 'Informative':
      reputationChange -= 5;
      break;
    case 'Spam':
      reputationChange += 5;
      break;
    default:
      break;
  }

  // Update the user's reputation in the database
  await db.user.update({
    where: { id: userId },
    data: { reputation: { increment: reputationChange } },
  });
}

export async function updateReportCategory(
  { id }: { id: string },
  formState: UpdateReportCategoryFormState = { errors: {} },
  formData: FormData
): Promise<UpdateReportCategoryFormState> {
  const result = updateReportCategorySchema.safeParse({
    id,
    category: formData.get('category') as ReportCategory,
  });

  /* assert valid data */
  const validation = validationMiddleware(result);
  if (validation.errors) {
    return {
      ...formState,
      errors: validation.errors,
    };
  }

  if (!result.success) {
    const errors = Object.entries(result.error.flatten().fieldErrors)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
    throw new Error(errors);
  }

  /* assert authn */
  const auth = await authMiddleware();
  if (auth.errors) {
    return auth;
  }

  /* assert authz */
  const session = auth.session;
  const user = await db.user.findUnique({ where: { id: session?.user?.id }, include: { companies: true } });
  if (!user) {
    return {
      errors: {
        _form: ["User not found"],
      },
    };
  }

  /* assert ownership */
  const reportToUpdate = await db.report.findUnique({ where: { id } });
  if (!reportToUpdate || (!isAdmin(user) && !user.companies.map(c => c.id).includes(reportToUpdate.companyId))) {
    return {
      errors: {
        _form: ["Report not found or unauthorized"],
      },
    };
  }
  /* assert category transition */
  // if (!assertCategoryTransition(reportToUpdate.category, result.data.category, user.userTypes[0])) {
  //   return {
  //     success: false,
  //     errors: {
  //       _form: [`You are trying to perform a forbidden status change from ${reportToUpdate.category} to ${result.data.category}`],
  //     }
  //   }
  // }
  try {
    const [updatedReport] = await db.$transaction([
      db.report.update({
        where: { id },
        data: {
          category: result.data.category,
          status: CATEGORY_STATUS_MAPPER[result.data.category],
        },
      }),
      db.statusHistory.create({
        data: {
          reportId: id,
          oldStatus: reportToUpdate.status,
          newStatus: CATEGORY_STATUS_MAPPER[result.data.category],
          oldCategory: reportToUpdate.category,
          newCategory: result.data.category,
          changedAt: new Date(),
          changedBy: session?.user?.id!,
        },
      }),
    ]);

    // Update the user's reputation based on the category change
    await updateUserReputation(reportToUpdate.userId, result.data.category, reportToUpdate.category);

    revalidatePath(`/reports/${id}`); // Update cached reports
    revalidatePath(`/reports`); // Update cached reports
    return {
      errors: {},
      success: true,
    };
  } catch (err: unknown) {
    console.error('>'.repeat(200), err);
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ['Something went wrong'],
        },
      };
    }
  }
}
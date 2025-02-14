'use server';

import { Impact, ReportCategory, ReportVisibility, Severity, User, UserType, type Report } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import db from '@/db';
import { authMiddleware, validationMiddleware } from '@/middlewares';

const createGuestReportSchema = z.object({
  title: z.string().min(10),
  url: z.string().refine(value => /^([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?$/.test(value), {
    message: "Please provide a valid URL without the protocol",
  }),
  steps: z.string().min(10),
  suggestions: z.string().optional().nullable(),
  snippets: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  impact: z.nativeEnum(Impact).optional().nullable(),
  email: z.string().email(),
  severity: z.nativeEnum(Severity).optional().nullable(),
  tags: z.string().array(),
  category: z.nativeEnum(ReportCategory).optional().nullable(),
})
  .refine((data) => {
    return true;
    // if (data.companyId) {
    //   // return !data.companyName && !data.companyLogo && !data.companyDomain;
    // } else {
    //   // return data.companyName;
    // }
  }, {
    message: "Please select a company from the list of existing companies or provide a new company name.",
    path: ["companyId", "companyName", "companyDomain", "companyLogo"],
  });

interface CreateReportGuestFormState {
  errors: {
    title?: string[],
    url?: string[],
    steps?: string[],
    suggestions?: string[],
    snippets?: string[],
    language?: string[],
    email?: string[],
    _form?: string[],
  };
  success?: boolean
}

export async function createReportGuest(
  formState: CreateReportGuestFormState,
  formData: FormData
): Promise<CreateReportGuestFormState> {

  const result = createGuestReportSchema.safeParse({
    title: formData.get('title'),
    companyId: formData.get('companyId'),
    url: formData.get('url'),
    steps: formData.get('steps'),
    suggestions: formData.get('suggestions'),
    snippets: formData.get('snippets'),
    email: formData.get('email'),
    language: formData.get('language'),
    impact: formData.get('impact'),
    severity: formData.get('severity'),
    tags: formData.getAll('tags'),
    visibility: formData.get('visibility') || ReportVisibility.Public,
    category: formData.get('category') || ReportCategory.New,
  });

  const validation = validationMiddleware(result);
  if (validation.errors) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  // const auth = await authMiddleware();
  // if (auth.errors) {
  //   return auth;
  // }

  // const session = auth.session;

  let report: Report;
  const tagIds = validation.data?.tags.map(tagId => ({ id: tagId }));
  try {
    report = await db.$transaction(async (tx) => {
      let user: User | null;
      if (validation?.data?.email) {
        user = await tx.user.findFirst({
          where: {
            email: validation.data.email,
          }
        });

        if (!user) {
          user = await tx.user.create({
            data: {
              email: validation.data?.email,
              userTypes: [UserType.GUEST],
            }
          });
        }

        if (!user) {
          throw new Error('User not found.');
        }

        const newReport = await tx.report.create({
          data: {
            title: validation.data?.title ?? '',
            companyId: `${process.env.BUG_BUSTERS_COMPANY_ID}`,
            url: validation.data?.url,
            steps: validation.data?.steps,
            suggestions: validation.data?.suggestions,
            userId: user.id,
            snippets: validation.data?.snippets,
            language: validation.data?.language,
            impact: validation.data?.impact!,
            severity: validation.data?.severity!,
            tags: {
              connect: tagIds,
            },
            category: validation.data?.category || ReportCategory.New,
          }
        });

        const attachments = JSON.parse(formData.get('attachments') as string) as { url: string; filename: string }[];
        if (attachments.length > 0) {
          await tx.attachment.createMany({
            data: attachments.map(({ url, filename }) => ({
              url,
              reportId: newReport.id,
              userId: user?.id!,
              filename
            })),
          });
        }

        return newReport;
      }
    });

    revalidatePath('/reports');
    return {
      errors: {},
      success: true,
    };
  } catch (err: unknown) {
    console.error('error' + '>'.repeat(200), err)
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
        success: false
      };
    } else {
      return {
        errors: {
          _form: ['Something went wrong'],
        },
        success: false
      };
    }
  }
}

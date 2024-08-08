'use server';

import { Impact, ReportCategory, ReportVisibility, Severity, UserType, type Report } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import db from '@/db';
import { authMiddleware, validationMiddleware } from '@/middlewares';

const createReportSchema = z.object({
  title: z.string().min(10),
  url: z.string().refine(value => /^([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?$/.test(value), {
    message: "Please provide a valid URL without the protocol",
  }),
  steps: z.string().min(10),
  currentBehavior: z.string().min(10),
  expectedBehavior: z.string().min(10),
  suggestions: z.string().optional().nullable(),
  snippets: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  impact: z.nativeEnum(Impact).optional().nullable(),
  severity: z.nativeEnum(Severity).optional().nullable(),
  companyId: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  companyLogo: z.string().optional().nullable(),
  companyDomain: z.string().optional().nullable(),
  tags: z.string().array(),
  visibility: z.nativeEnum(ReportVisibility).optional().nullable(),
  category: z.nativeEnum(ReportCategory).optional().nullable(),
}).refine((data) => {
  if (data.companyId) {
    return !data.companyName && !data.companyLogo && !data.companyDomain;
  } else {
    return data.companyName;
  }
}, {
  message: "Provide either companyId or (companyName, companyDomain, and optionally companyLogo).",
  path: ["companyId", "companyName", "companyDomain", "companyLogo"],
});

interface CreateReportFormState {
  errors: {
    title?: string[],
    company?: string[],
    url?: string[],
    steps?: string[],
    currentBehavior?: string[],
    expectedBehavior?: string[],
    suggestions?: string[],
    snippets?: string[],
    language?: string[],
    _form?: string[],
  };
  success?: boolean
}

export async function createReport(
  formState: CreateReportFormState,
  formData: FormData
): Promise<CreateReportFormState> {

  const result = createReportSchema.safeParse({
    title: formData.get('title'),
    companyId: formData.get('companyId'),
    url: formData.get('url'),
    steps: formData.get('steps'),
    currentBehavior: formData.get('currentBehavior'),
    expectedBehavior: formData.get('expectedBehavior'),
    suggestions: formData.get('suggestions'),
    snippets: formData.get('snippets'),
    language: formData.get('language'),
    impact: formData.get('impact'),
    severity: formData.get('severity'),
    companyName: formData.get('companyName'),
    companyLogo: formData.get('companyLogo'),
    companyDomain: formData.get('companyDomain'),
    tags: formData.getAll('tags'),
    visibility: formData.get('visibility') || ReportVisibility.Public,
    category: formData.get('category') || ReportCategory.New,
  });

  const validation = validationMiddleware(result);
  if (validation.errors) {
    return {
      ...formState,
      errors: validation.errors,
    };
  }

  const auth = await authMiddleware();
  if (auth.errors) {
    return auth;
  }

  const session = auth.session;

  let report: Report;
  const tagIds = validation.data?.tags.map(tagId => ({ id: tagId }));
  try {
    report = await db.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: session.user?.id! },
      });

      if (!user) {
        throw new Error('User not found.');
      }

      const isEngineer =
        user?.userTypes.includes(UserType.ENGINEER) ||
        user?.userTypes.includes(UserType.GOD);

      if (!isEngineer) {
        throw new Error('Only engineers can report bugs.');
      }

      if (validation.data?.visibility === ReportVisibility.Private && user.validPublicReportsCount < 5) {
        throw new Error('You must have at least 5 valid public reports to submit private reports.');
      }

      let companyId = validation.data?.companyId;
      if (!companyId) {
        const company = await tx.company.create({
          data: {
            name: validation.data?.companyName!,
            logo: validation.data?.companyLogo,
            domain: validation.data?.companyDomain,
          },
        });
        companyId = company.id;
      }

      const newReport = await tx.report.create({
        data: {
          title: validation.data?.title ?? '',
          companyId: `${companyId}`,
          url: validation.data?.url,
          steps: validation.data?.steps,
          currentBehavior: validation.data?.currentBehavior,
          expectedBehavior: validation.data?.expectedBehavior,
          suggestions: validation.data?.suggestions,
          userId: session?.user?.id!,
          snippets: validation.data?.snippets,
          language: validation.data?.language,
          impact: validation.data?.impact!,
          severity: validation.data?.severity!,
          tags: {
            connect: tagIds,
          },
          visibility: validation.data?.visibility || ReportVisibility.Public,
          category: validation.data?.category || ReportCategory.New
        }
      });

      // if (validation.data?.visibility === 'PUBLIC' && validation.data?.category === 'Valid') {
      //   await tx.user.update({
      //     where: { id: userId },
      //     data: { validPublicReportsCount: { increment: 1 } }
      //   });
      // }

      return newReport;
    });
    console.log('report', report);
  } catch (err: unknown) {
    console.error('error' + '>'.repeat(200), err)
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
  } finally {
    revalidatePath('/reports');
    return {
      errors: {},
      success: true,
    };
  }
}

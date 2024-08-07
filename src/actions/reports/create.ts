'use server';

import { Impact, Severity, type Report } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/auth';
import db from '@/db';

// const createReportSchema = z.object({
//   title: z.string().min(10),
//   // company: z.string().min(3),
//   companyId: z.string(),
//   url: z.string().refine(value => /^([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?$/.test(value), {
//     message: "Please provide a valid URL without the protocol",
//   }),
//   steps: z.string().min(10),
//   currentBehavior: z.string().min(10),
//   expectedBehavior: z.string().min(10),
//   suggestions: z.string().optional().nullable(),
//   snippets: z.string().optional().nullable(),
//   language: z.string().optional().nullable(),
//   impact: z.nativeEnum(Impact).optional().nullable(),
//   severity: z.nativeEnum(Severity).optional().nullable(),
// });

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
  tags: z.string().array()
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
    // company: formData.get('company'),
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
    tags: formData.getAll('tags')
  });

  // console.log('result', {
  //   companyId: formData.get('companyId'),
  //   companyName: formData.get('companyName'),
  //   companyLogo: formData.get('companyLogo'),
  //   companyDomain: formData.get('companyDomain'),
  // })


  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.error('errrors', errors)
    return {
      errors
    };
  }

  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ['You must be signed in to do this.'],
      },
    };
  }
  let report: Report;
  const tagIds = result.data.tags.map(tagId => ({ id: tagId }));
  try {
    await db.$transaction(async (tx) => {
      let companyId = result.data.companyId;
      if (!result.data.companyId) {

        const company = await tx.company.create({
          data: {
            name: result.data.companyName!,
            logo: result.data.companyLogo,
            domain: result.data.companyDomain,
          },
        });
        companyId = company.id;
      }
      const report = await tx.report.create({
        data: {
          title: result.data.title,
          companyId: `${companyId}`,
          url: result.data.url,
          steps: result.data.steps,
          currentBehavior: result.data.currentBehavior,
          expectedBehavior: result.data.expectedBehavior,
          suggestions: result.data.suggestions,
          userId: session?.user?.id!,
          snippets: result.data.snippets,
          language: result.data.language,
          impact: result.data.impact!,
          severity: result.data.severity!,
          tags: {
            connect: tagIds,
          }
        }
      });
    });
    // report = await db.report.create({
    //   data: {
    //     title: result.data.title,
    //     company: result.data.company,
    //     url: result.data.url,
    //     steps: result.data.steps,
    //     currentBehavior: result.data.currentBehavior,
    //     expectedBehavior: result.data.expectedBehavior,
    //     suggestions: result.data.suggestions,
    //     userId: session.user.id!,
    //     snippets: result.data.snippets,
    //     language: result.data.language,
    //     impact: result.data.impact!,
    //     severity: result.data.severity!
    //   },
    // });
  } catch (err: unknown) {
    console.error('>'.repeat(200), err)
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      console.error('lol'.repeat(200))
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

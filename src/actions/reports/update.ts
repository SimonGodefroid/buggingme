'use server';

import type { Report } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/auth';
import db from '@/db';

const updateReportSchema = z.object({
  title: z.string().min(10),
  company: z.string().min(10),
  url: z.string().refine(value => /^([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?$/.test(value), {
    message: "Please provide a valid URL without the protocol",
  }),
  steps: z.string().min(10),
  currentBehavior: z.string().min(10),
  expectedBehavior: z.string().min(10),
  suggestions: z.string().optional().nullable(),
  snippets: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
});

interface UpdateReportFormState {
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

export async function updateReport(
  { id }: { id: string },
  formState: UpdateReportFormState,
  formData: FormData
): Promise<UpdateReportFormState> {




  const result = updateReportSchema.safeParse({
    title: formData.get('title'),
    company: formData.get('company'),
    url: formData.get('url'),
    steps: formData.get('steps'),
    currentBehavior: formData.get('currentBehavior'),
    expectedBehavior: formData.get('expectedBehavior'),
    suggestions: formData.get('suggestions'),
    snippets: formData.get('snippets'),
    language: formData.get('language'),
  });


  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
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

  try {
    report = await db.report.update({
      where: { id },
      data: {
        title: result.data.title,
        company: result.data.company,
        url: result.data.url,
        steps: result.data.steps,
        currentBehavior: result.data.currentBehavior,
        expectedBehavior: result.data.expectedBehavior,
        suggestions: result.data.suggestions,
        userId: session.user.id!,
        snippets: result.data.snippets,
        language: result.data.language
      }
    });
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
    revalidatePath(`/reports/${id}`); // Update cached reports
    revalidatePath(`/reports`); // Update cached reports
    return {
      errors: {},
      success: true,
    };
  }
}



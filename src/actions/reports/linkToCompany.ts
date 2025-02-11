'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/auth';
import db from '@/db';

const linkReportSchema = z.object({
  companyId: z.string().min(10),
});


interface LinkReportFormState {
  errors: {
    companyId?: string[],
    _form?: string[],
  };
  success?: boolean
}

export async function linkReport(

  { id }: { id: string },
  formState: LinkReportFormState,
  formData: FormData
): Promise<LinkReportFormState> {

  const result = linkReportSchema.safeParse({
    companyId: formData.get('companyId'),
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.error('result' + '>'.repeat(200), errors)
    return {
      errors,
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
    report = await db.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: session.user?.id! },
      });

      if (!user) {
        throw new Error('User not found.');
      }
      const updatedReport = await db.report.update({
        where: { id },
        data: {
          companyId: result.data.companyId,
        }
      });
      return updatedReport;
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
      console.error('>'.repeat(200))
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



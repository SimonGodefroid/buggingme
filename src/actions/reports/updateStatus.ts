'use server';

import { ReportStatus, type Report } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/auth';
import db from '@/db';

const updateReportStatusSchema = z.object({
  status: z.nativeEnum(ReportStatus),
});

interface UpdateReportStatusFormState {
  errors: {
    status?: string[],
    _form?: string[],
  };
  success?: boolean
}

export async function updateReport(
  { id }: { id: string },
  formState: UpdateReportStatusFormState,
  formData: FormData
): Promise<UpdateReportStatusFormState> {




  const result = updateReportStatusSchema.safeParse({
    status: formData.get('status'),
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
        status: result.data.status,
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



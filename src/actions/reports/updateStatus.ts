'use server';

import { ReportStatus, UserType, type Report } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/auth';
import db from '@/db';
import { assertStatusTransition } from './helpers/reportStatus';

const updateReportStatusSchema = z.object({
  id: z.string(),
  oldStatus: z.nativeEnum(ReportStatus),
  newStatus: z.nativeEnum(ReportStatus),
});

interface UpdateReportStatusFormState {
  errors: {
    oldStatus?: string[],
    newStatus?: string[]
    _form?: string[],
  };
  success?: boolean
}

export async function updateReportStatus(
  { id, oldStatus, newStatus }: { id: string, oldStatus: ReportStatus, newStatus: ReportStatus },
  formState: UpdateReportStatusFormState = { errors: {} },
): Promise<UpdateReportStatusFormState> {

  const result = updateReportStatusSchema.safeParse({
    id,
    oldStatus,
    newStatus
  });

  if (!result.success) {
    const errors = Object.entries(result.error.flatten().fieldErrors).map(([k, v]) => `${k}: ${v}`).join(', ');
    throw new Error(
      errors
    )
  }

  if (!assertStatusTransition(oldStatus, newStatus, UserType.ENGINEER)) {
    throw new Error('You are trying to perform a forbidden status change');
  }

  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ['You must be signed in to do this.'],
      },
    };
  }

  const reportToUpdate: Report | null = await db.report.findUnique({ where: { id } });

  if (!reportToUpdate) {
    return {
      errors: {
        _form: ['Report not found'],
      },
    };
  }


  let report: Report;

  try {
    const [report, statusHistory] = await db.$transaction([
      db.report.update({
        where: { id },
        data: {
          status: result.data.newStatus,
        },
      }),
      db.statusHistory.create({
        data: {
          reportId: id,
          oldStatus: result.data.oldStatus,
          newStatus: result.data.newStatus,
          oldCategory: reportToUpdate.category,
          newCategory: reportToUpdate.category,
          changedAt: new Date(),
          changedBy: session?.user?.id!
        },
      }),
    ]);
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



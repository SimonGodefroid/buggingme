'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/auth';
import db from '@/db';
import { Company, IssueTracker } from '@prisma/client';
import { isAdmin, } from '@/helpers';

const updateCompanySchema = z.object({
  name: z.string().min(3),
  domain: z.string().url(),
  logo: z.union([z.string().url(), z.literal('')]).optional(),
  issueTracker: z.nativeEnum(IssueTracker),
});

interface UpdateCompanyFormState {
  errors: {
    name?: string[],
    domain?: string[],
    logo?: string[],
    _form?: string[],
  };
  success?: boolean
  company?: Company
}

export async function updateCompany(
  { companyId }: { companyId: string },
  formState: UpdateCompanyFormState,
  formData: FormData
): Promise<UpdateCompanyFormState> {
  const result = updateCompanySchema.safeParse({
    name: formData.get('name'),
    domain: formData.get('domain'),
    logo: formData.get('logo'),
    issueTracker: formData.get('issueTracker'),
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.error('Validation error', errors);
    return {
      errors
    };
  }
  const session = await auth();
  const user = await db.user.findUnique({ where: { id: session?.user?.id }, include: { companies: true } });
  if (!session || !session.user || !user || user && !isAdmin(user)) {
    return {
      errors: {
        _form: ['You must be signed in to do this.'],
      },
    };
  }

  let company: Company;
  try {
    company = await db.company.update({
      data: {
        name: result.data.name,
        logo: result.data.logo,
        domain: result.data.domain,
        issueTracker: result.data.issueTracker, // Ensure this is updated
      },
      where: { id: companyId },
    });
    revalidatePath('/admin');
    return {
      success: true,
      company,
      errors: {}
    };
  } catch (err: unknown) {
    console.error('error', err)
    if (err instanceof Error) {
      return {
        success: false,
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
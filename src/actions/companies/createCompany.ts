'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/auth';
import db from '@/db';
import { Company } from '@prisma/client';

const createCompanySchema = z.object({
  name: z.string().min(3),
  domain: z.string().url(),
  logo: z.union([z.string().url(), z.literal('')]).optional(),
});
interface CreateCompanyFormState {
  errors: {
    name?: string[],
    domain?: string[],
    logo?: string[],
    _form?: string[],
  };
  success?: boolean
  company?: Company
}

export async function createCompany(
  formState: CreateCompanyFormState,
  formData: FormData
): Promise<CreateCompanyFormState> {
  const result = createCompanySchema.safeParse({
    name: formData.get('name'),
    domain: formData.get('domain'),
    logo: formData.get('logo'),
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.error('Validation error', errors);
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

  let company: Company;
  try {
    company = await db.company.create({
      data: {
        name: result.data.name,
        logo: result.data.logo,
        domain: result.data.domain,
      },
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
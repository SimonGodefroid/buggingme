'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/auth';
import db from '@/db';
import { UserWithCompanies } from '@/types';

const linkUserToCompaniesSchema = z.object({
  id: z.string(),
  companyIds: z.string().array()
});

interface LinkUserToCompaniesFormState {
  errors: {
    id?: string[],
    companyIds?: string[],
    _form?: string[],
  };
  success?: boolean
  user?: UserWithCompanies
}

export async function linkUserToCompanies(
  formState: LinkUserToCompaniesFormState,
  formData: FormData
): Promise<LinkUserToCompaniesFormState> {
  const result = linkUserToCompaniesSchema.safeParse({
    id: formData.get('id'),
    companyIds: formData.getAll('companyIds'),
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

  let user: UserWithCompanies | undefined;
  try {
    // Update the user to associate with the specified companies
    const ids = result.data.companyIds.filter(Boolean).map(id => ({ id }));
    const updatedUser = await db.user.update({
      where: { id: result.data.id },
      data: {
        companies: {
          set: ids.length > 0 ? ids : []
        }
      },
      include: { companies: true } // To return the user with associated companies
    });

    user = updatedUser;
    return {
      success: true,
      user,
      errors: {}
    };
  } catch (err: unknown) {
    console.error('error', err)
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
    revalidatePath('/admin');
    return {
      errors: {},
      success: true,
      user,
    };
  }
}
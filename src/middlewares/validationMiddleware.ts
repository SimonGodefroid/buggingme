import { ZodError } from 'zod';

interface ValidationResult<T> {
  data?: T;
  errors?: { [key: string]: string[] | undefined };
}

export function validationMiddleware<T>(result: { success: boolean; data?: T; error?: ZodError }): ValidationResult<T> {
  if (!result.success) {
    const errors = result.error?.flatten().fieldErrors || {};
    return {
      errors
    };
  }
  return { data: result.data! };
}
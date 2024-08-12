import { auth } from '@/auth';

export async function authMiddleware() {
  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ['You must be signed in to do this.'],
      },
    };
  }
  return { session };
}
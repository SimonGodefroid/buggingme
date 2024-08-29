'use server';
import db from '@/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';


interface EditCommentFormState {
  errors: {
    content?: string[],
    _form?: string[],
  };
  success?: boolean
}

export async function editComment(
  formState: EditCommentFormState,
  formData: FormData
): Promise<EditCommentFormState> {

  const session = await auth();
  const commentId = `${formData.get('commentId')}`;
  const content = `${formData.get('content')}`;

  if (!session) {
    throw new Error('You must be logged in to delete a comment.');
  }

  const comment = await db.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    return {
      success: false, errors: { _form: ['Comment not found.'] }
    }
  }

  // Check if the logged-in user is the author of the comment
  if (comment.userId !== session?.user?.id) {
    return {
      success: false, errors: { _form: ['You are not authorized to delete this comment.'] }
    }
  }
  await db.comment.update({
    data: { content },
    where: { id: commentId },
  });
  revalidatePath(`/reports/${comment.reportId}`);
  return { success: true, errors: {} }
}
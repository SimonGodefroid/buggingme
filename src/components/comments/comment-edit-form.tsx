'use client';

import { useEffect, useRef, useState } from 'react';

import { editComment } from '@/actions/comments';
import { Button, Textarea } from '@nextui-org/react';
import { Comment } from '@prisma/client';
import { useFormState } from 'react-dom';

import FormButton from '@/components/common/form-button';

interface CommentEditFormProps {
  comment: Comment;
  onClose: () => void;
}

export default function CommentEditForm({
  comment,
  onClose,
}: CommentEditFormProps) {
  const ref = useRef<HTMLFormElement | null>(null);

  const [formState, action] = useFormState(editComment, {
    errors: {},
  });

  useEffect(() => {
    if (formState.success) {
      ref.current?.reset(); // Reset the form after successful submission
      if (onClose) {
        onClose();
      } // Close the form if it wasn't initially open
    }
  }, [formState, onClose]);

  return (
    <div className="comment-form">
      <form action={action} ref={ref} className="space-y-2 px-1">
        <input type="hidden" name="commentId" value={comment.id} />
        <Textarea
          name="content"
          label={'Edit comment'}
          defaultValue={comment.content}
          isInvalid={!!formState.errors.content}
          errorMessage={formState.errors.content?.join(', ')}
        />

        {formState.errors._form && (
          <div className="p-2 bg-red-200 border rounded border-red-400">
            {formState.errors._form.join(', ')}
          </div>
        )}

        <div className="flex gap-4">
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <FormButton>Update</FormButton>
        </div>
      </form>
    </div>
  );
}

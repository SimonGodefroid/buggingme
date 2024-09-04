'use client';

import { useEffect, useRef, useState } from 'react';

import { createComment } from '@/actions/comments/create-comment';
import { Button, Textarea } from '@nextui-org/react';
import { useFormState } from 'react-dom';

import FormButton from '@/components/common/form-button';

interface CommentCreateFormProps {
  reportId: string;
  parentId?: string;
  startOpen?: boolean;
}

export default function CommentCreateForm({
  reportId,
  parentId,
  startOpen,
}: CommentCreateFormProps) {
  const [open, setOpen] = useState(startOpen || false);
  const ref = useRef<HTMLFormElement | null>(null);
  const [formState, action] = useFormState(
    createComment.bind(null, { reportId, parentId }),
    {
      errors: {},
    },
  );

  useEffect(() => {
    if (formState.success) {
      ref.current?.reset(); // Reset the form after successful submission
      if (!startOpen) setOpen(false); // Close the form if it wasn't initially open
    }
  }, [formState, startOpen]);

  return (
    <div className="comment-form">
      {open ? (
        <form action={action} ref={ref} className="space-y-2 px-1">
          <Textarea
            name="content"
            label={parentId ? 'Reply' : 'Leave a Comment'}
            placeholder={parentId ? 'Enter your reply' : 'Enter your comment'}
            isInvalid={!!formState.errors.content}
            errorMessage={formState.errors.content?.join(', ')}
          />

          {formState.errors._form && (
            <div className="p-2 bg-red-200 border rounded border-red-400">
              {formState.errors._form.join(', ')}
            </div>
          )}

          <div className="flex gap-4 justify-between md:justify-start">
            <Button variant="light" onPress={() => setOpen(false)}>
              Cancel
            </Button>
            <FormButton>{parentId ? 'Reply' : 'Submit'}</FormButton>
          </div>
        </form>
      ) : (
        <Button size="sm" variant="light" onClick={() => setOpen(true)}>
          {parentId ? 'Reply' : 'Leave a Comment'}
        </Button>
      )}
    </div>
  );
}

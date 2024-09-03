'use client';

import { useState } from 'react';

import Image from 'next/image';

import { deleteComment } from '@/actions/comments/delete-comment';
import { auth } from '@/auth';
import { CommentWithAuthor } from '@/db/queries/comments';
import { Button, Chip, Tooltip } from '@nextui-org/react';
import { useSession } from 'next-auth/react';

import CommentCreateForm from '@/components/comments/comment-create-form';

import CommentEditForm from './comment-edit-form';

interface CommentShowProps {
  commentId: string;
  reportId: string;
  comments: CommentWithAuthor[];
}

export default function CommentShow({
  commentId,
  reportId,
  comments,
}: CommentShowProps) {
  enum FormName {
    CREATE = 'create',
    EDIT = 'edit',
  }
  const [formName, setForm] = useState<FormName | undefined>(FormName.CREATE);
  const comment = comments.find((c) => c.id === commentId);

  if (!comment) return null;

  const children = comments.filter((c) => c.parentId === commentId);
  const renderedChildren = children.map((child) => (
    <CommentShow
      key={child.id}
      commentId={child.id}
      reportId={reportId}
      comments={comments}
    />
  ));

  const session = useSession();
  return (
    <div className="p-4 border mt-2 mb-1 relative rounded-md">
      {session?.data?.user?.id === comment.userId && (
        <div className="absolute top-4 right-4 flex gap-4">
          <Button
            color="primary"
            size="sm"
            variant="ghost"
            onClick={() => setForm(FormName.EDIT)}
          >
            Edit
          </Button>
          <form action={deleteComment}>
            <input type="hidden" name="commentId" value={comment.id} />

            <Button color="danger" size="sm" type="submit" variant="ghost">
              Delete
            </Button>
          </form>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-3">
        <Image
          src={comment.user.image || ''}
          alt="user image"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1 space-y-3">
          <p className="text-sm font-medium text-gray-500">
            {comment.user.name} | {comment.createdAt.toLocaleString('fr-FR')}
            <span>
              &nbsp;
              {comment.createdAt.toString() !== comment.updatedAt.toString() ? (
                <Tooltip
                  as="span"
                  content={`
              updated comment on ${comment.updatedAt.toLocaleString('fr-FR')}`}
                >
                  <Chip color="default" size="sm">
                    i
                  </Chip>
                </Tooltip>
              ) : null}
            </span>
          </p>
          <p className="text-foreground">{comment.content}</p>
          {formName === FormName.CREATE && (
            <CommentCreateForm
              reportId={comment.reportId}
              parentId={comment.id}
            />
          )}
          {formName === FormName.EDIT && (
            <CommentEditForm
              comment={comment}
              onClose={() => setForm(FormName.CREATE)}
            />
          )}
        </div>
      </div>
      <div className="pl-4">{renderedChildren}</div>
    </div>
  );
}

import {
  fetchCommentsByReportId,
  // type CommentWithAuthor,
} from '@/db/queries/comments';
import { Comment } from '@prisma/client';

import CommentShow from '@/components/comments/comment-show';

interface Props {
  // fetchData: () => Promise<CommentWithAuthor[]>;
  reportId: string;
}

// TODO: Get a list of comments from somewhere
export default async function CommentList({
  // fetchData
  reportId,
}: Props) {
  // const comments = await fetchData(); // best way
  const comments = await fetchCommentsByReportId(reportId); // to showcase memoization
  const topLevelComments = comments.filter(
    (comment) => comment.parentId === null,
  );
  const renderedComments = topLevelComments.map((comment) => {
    return (
      <CommentShow
        key={comment.id}
        commentId={comment.id}
        reportId={reportId}
        comments={comments}
      />
    );
  });

  return <div className='max-h-[400px] overflow-auto'>{renderedComments}</div>;
}

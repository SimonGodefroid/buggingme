import { Prisma, } from '@prisma/client';
import db from "@/db";
import { cache } from "react";

export type CommentWithAuthor = Prisma.CommentGetPayload<{ include: { user: true } }>;



export const fetchCommentsByReportId = cache((reportId: string): Promise<CommentWithAuthor[]> => {
  return db.comment.findMany({
    where: { reportId },
    include: {
      user: true
    }
  })
});
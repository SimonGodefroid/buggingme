"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import db from "@/db";
import paths from "@/paths";

const createCommentSchema = z.object({
  content: z.string().min(3),
});

interface CreateCommentFormState {
  errors: {
    content?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function createComment(
  { reportId, parentId }: { reportId: string; parentId?: string },
  formState: CreateCommentFormState,
  formData: FormData
): Promise<CreateCommentFormState> {
  const result = createCommentSchema.safeParse({
    content: formData.get("content"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must sign in to do this."],
      },
    };
  }

  try {
    await db.comment.create({
      data: {
        content: result.data.content,
        reportId,
        parentId,
        userId: session.user.id!,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong..."],
        },
      };
    }
  }

  // const topic = await db.report.findFirst({
  //   where: { posts: { some: { id: postId } } },
  // });

  // if (!topic) {
  //   return {
  //     errors: {
  //       _form: ["Failed to revalidate topic"],
  //     },
  //   };
  // }

  revalidatePath(paths.reportShow(reportId));
  return {
    errors: {},
    success: true,
  };
}

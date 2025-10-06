import { Response, Request } from "express";
import prisma from "../../prismaClient";
import { sanitizeQuizForClient } from "../../utils/utils";
import { findQuizById } from "../../lib/quiz/findQuizById";

export const getQuizById = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.id;
    if (!quizId) {
      return res.status(400).json({ error: "Quiz id is required" });
    }

    const doesQuizExist = await findQuizById(quizId);

    if (!doesQuizExist) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const attempt = await prisma.result.findFirst({
      where: {
        quizId,
        userId: req.user?.id!,
      },
      select: { id: true },
    });

    const quiz = await prisma.quiz.findUniqueOrThrow({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
    // Sanitize: remove answers before sending to client
    const sanitized = sanitizeQuizForClient(quiz);
    return res.status(200).json({ ...sanitized, isAttempted: !!attempt });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

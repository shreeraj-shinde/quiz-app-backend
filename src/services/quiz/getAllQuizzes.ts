import { Request, Response } from "express";
import prisma from "../../prismaClient";
import { getAllQuizzesWithQuestionsAndOptions } from "../../lib/quiz/getAllQuizzes";

export const getAllQuizzes = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    // Fetch basic quiz info (omit questions/options for list view)
    const quizzes = await getAllQuizzesWithQuestionsAndOptions();
    
    if (!quizzes) {
      return res.status(404).json({ error: "Quizzes not found" });
    }

    // Fetch all quizIds the current user has attempted
    const attempted = userId
      ? await prisma.result.findMany({
          where: { userId },
          select: { quizId: true },
        })
      : [];

    const attemptedSet = new Set(attempted.map((r) => r.quizId));
    const data = quizzes.map((q) => ({
      ...q,
      isAttempted: attemptedSet.has(q.id),
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

import prisma from "../../prismaClient";
import {
  createQuestionsWithOptions,
  sanitizeQuizForClient,
  type IncomingQuestion,
} from "../../utils/utils";
import { Request, Response } from "express";

export const UpdateQuiz = async (req: Request, res: Response) => {
  try {
    const quizId = req.params?.id;

    if (!quizId) {
      return res.status(400).json({ error: "Quiz id is required" });
    }

    const { questions, title, description } = req.body as {
      questions?: IncomingQuestion[];
      title?: string;
      description?: string;
    };

    const doesQuizExist = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: { id: true },
    });

    if (!doesQuizExist) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const list = Array.isArray(questions) ? questions : [];

    const hasTitle = typeof title !== "undefined";
    const hasDescription = typeof description !== "undefined";
    const hasQuestions = list.length > 0;

    if (!hasTitle && !hasDescription && !hasQuestions) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const data: any = {};
    if (hasTitle) data.title = title;
    if (hasDescription) data.description = description;
    if (hasQuestions) {
      data.questions = {
        create: createQuestionsWithOptions(list),
      };
    }

    const updated = await prisma.quiz.update({
      where: { id: quizId },
      data,
      include: {
        questions: {
          include: { options: true },
        },
      },
    });

    const sanitized = sanitizeQuizForClient(updated);
    return res.status(200).json(sanitized);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

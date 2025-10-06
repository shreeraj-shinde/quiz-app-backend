import { Response, Request } from "express";
import prisma from "../../prismaClient";
import { removeAnswersFromTheQuestion } from "../../utils/questionUtils";
import { findQuizById } from "../../lib/quiz/findQuizById";
import { findQuestionsByQuizId } from "../../lib/questions/findQuestions";

export const getQuestionsByQuiz = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.id;
    if (!quizId) {
      return res.status(400).json({ error: "Quiz id is required" });
    }

    const doesQuizExist = await findQuizById(quizId);
    if (!doesQuizExist) {
      return res.status(404).json({ error: "Quiz not found" });
    }
      const questions = await findQuestionsByQuizId(quizId);
    if (!questions) {
      return res.status(404).json({ error: "Questions not found" });
    }
    const sanitizedQuestions = questions.map((q) => ({
      ...q,
      options: removeAnswersFromTheQuestion(q.options),
    }));

    return res.status(200).json(sanitizedQuestions);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

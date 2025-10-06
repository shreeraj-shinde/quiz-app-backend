import { Request, Response } from "express";
import { deleteQuiz } from "../../lib/quiz/deleteQuiz";
import { findQuizById } from "../../lib/quiz/findQuizById";

export const deleteQuizService = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.id;
    if (!quizId) {
      return res.status(400).json({ error: "Quiz id is required" });
    }
    const quiz = await findQuizById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    await deleteQuiz(quizId);
    return res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

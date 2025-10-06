import { Request, Response } from "express";
import { createQuiz } from "../../lib/quiz/createQuiz";
import { createQuestionsWithOptions } from "../../utils/utils";

//Controller to create quiz ✅
export const createQuizService = async (req: Request, res: Response) => {
  try {
    const { title, description, questions } = req.body;
    
    const quizData = {
      title,
      description,
      questions: {
        create: createQuestionsWithOptions(questions),
      },
      author: {
        connect: {
          id: req.user?.id!,
        },
      },
    }
    const quiz = await createQuiz(quizData);
    
    return res.json(quiz).status(201);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

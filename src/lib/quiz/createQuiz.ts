import { Prisma } from "@prisma/client";
import prisma from "../../prismaClient";

export const createQuiz = async (quizData: Prisma.QuizCreateInput) => {
  try {
    const quiz = await prisma.quiz.create({
      data: quizData,
    });
    return quiz;
  } catch (error) {
    return null;
  }
};  
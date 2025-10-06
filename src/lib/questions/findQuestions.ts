import prisma from "../../prismaClient";

export const findQuestionsByQuizId = async (quizId: string) => {
  try {
    const questions = await prisma.question.findMany({
      where: { quizId },
      include: { options: true },
    });
    return questions;
  } catch (error) {
    return null;
  }
};

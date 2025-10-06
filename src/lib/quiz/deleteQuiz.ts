import prisma from "../../prismaClient";

export const deleteQuiz = async (quizId: string) => {
  try {
    const quiz = await prisma.quiz.delete({
      where: {
        id: quizId,
      },
    });
    return quiz;
  } catch (error) {
    return null;
  }
};
import prisma from "../../prismaClient";

export const findQuizById = async (id: string) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: {
        id,
      },
    });
    return quiz;
  } catch (error) {
    return null;
  }
};

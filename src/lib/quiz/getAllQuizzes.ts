import prisma from "../../prismaClient";

export const getAllQuizzesWithQuestionsAndOptions = async () => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: {
          include: {
            options: {
                select: {
                    id: true,
                    text: true,
                },
            },
          },
        },
      },
    });
    return quizzes;
  } catch (error) {
    return null;
  }
};
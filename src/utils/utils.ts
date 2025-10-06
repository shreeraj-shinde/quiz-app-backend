import type {
  Option,
  Prisma,
  Question,
  QuestionType,
  Quiz,
} from "@prisma/client";

export type IncomingOption = {
  text: string;
  isCorrect: boolean;
};

export type IncomingQuestion = {
  text: string;
  type: QuestionType | "MCQ" | "TRUE_FALSE" | "FILL_BLANK";
  options?: IncomingOption[];
  timeLimit: number;
};

/**
 * Transforms an array of incoming questions into Prisma nested create inputs
 */
export function createQuestionsWithOptions(
  questions: IncomingQuestion[] | undefined
): Prisma.QuestionCreateWithoutQuizInput[] {
  const list = Array.isArray(questions) ? questions : [];
  return list.map((q) => ({
    text: q.text,
    timeLimit: q.timeLimit,
    // Cast to Prisma enum type to satisfy typings
    type: q.type as QuestionType,
    ...(q.options && q.options.length
      ? {
          options: {
            create: q.options.map((o) => ({
              text: o.text,
              isCorrect: !!o.isCorrect,
            })),
          },
        }
      : {}),
  }));
}
// -----------------------------
// Sanitizers (hide correct answers)
// -----------------------------

type QuestionWithOptions = Question & { options: Option[] };

export function sanitizeQuestionForClient(q: QuestionWithOptions) {
  const type = q.type as QuestionType;
  return {
    id: q.id,
    text: q.text,
    type: q.type,
    // Use any cast as Prisma types may not be regenerated yet
    timeLimit: q.timeLimit ?? undefined,
    options:
      type === "FILL_BLANK"
        ? []
        : q.options.map((o) => ({ id: o.id, text: o.text })),
  };
}

export function sanitizeQuizForClient(
  quiz: Quiz & { questions: QuestionWithOptions[] }
) {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    createdAt: quiz.createdAt,
    questions: quiz.questions.map(sanitizeQuestionForClient),
  };
}

export function sanitizeQuizListForClient(
  quizzes: (Quiz & { questions: QuestionWithOptions[] })[]
) {
  return quizzes.map(sanitizeQuizForClient);
}

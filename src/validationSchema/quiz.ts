import { QuestionType } from "@prisma/client";
import { z } from "zod";
// Quiz creation schema
// Matches Prisma models in `prisma/schema.prisma`:
// Quiz -> questions[] -> options[] with conditional requirements per question type
const optionSchema = z.object({
  text: z.string().trim().min(1, { message: "Option text is required" }),
  isCorrect: z.boolean(),
});

const questionSchemaBase = z.object({
  text: z.string().trim().min(1, { message: "Question text is required" }),
  type: z.enum([
    QuestionType.FILL_BLANK,
    QuestionType.MCQ,
    QuestionType.TRUE_FALSE,
    QuestionType.MCQ_MULTIPLE,
    QuestionType.DESCRIPTIVE, 
  ] as const),
  timeLimit: z
    .number()
    .min(1, { message: "Time limit must be at least 1 second" })
    .max(3600, { message: "Time limit must be at most 1 hour" }),
  options: z.array(optionSchema).default([]),
});

const questionSchema = questionSchemaBase.superRefine((val, ctx) => {
  const { type, options } = val;

  if (type === QuestionType.MCQ) {
    if (options.length < 2) {
      ctx.addIssue({ code: "custom", path: ["options"], message: "MCQ must have at least 2 options" });
    }
    const hasCorrect = options.some((o) => o.isCorrect);
    if (!hasCorrect) {
      ctx.addIssue({ code: "custom", path: ["options"], message: "MCQ must have at least one correct option" });
    }
  }

  if (type === QuestionType.TRUE_FALSE) {
    if (options.length !== 2) {
      ctx.addIssue({ code: "custom", path: ["options"], message: "TRUE_FALSE must have exactly 2 options" });
    }
    const correctCount = options.filter((o) => o.isCorrect).length;
    if (correctCount !== 1) {
      ctx.addIssue({ code: "custom", path: ["options"], message: "TRUE_FALSE must have exactly one correct option" });
    }
  }

  if (type === QuestionType.MCQ_MULTIPLE) {
    if (options.length < 2) {
      ctx.addIssue({ code: "custom", path: ["options"], message: "MCQ_MULTIPLE must have at least 2 options" });
    }
    const correctCount = options.filter((o) => o.isCorrect).length;
    if (correctCount < 2) {
      ctx.addIssue({ code: "custom", path: ["options"], message: "MCQ_MULTIPLE requires at least two correct options" });
    }
  }
  if (type === QuestionType.FILL_BLANK) {
    // Options are optional for fill-in-the-blank. If provided, enforce exactly one correct answer.
    if (options.length > 0) {
      const correctCount = options.filter((o) => o.isCorrect).length;
      if (correctCount !== 1) {
        ctx.addIssue({ code: "custom", path: ["options"], message: "FILL_BLANK options (if provided) must include exactly one correct answer" });
      }
    }
  }
  if (type === QuestionType.DESCRIPTIVE) {
    if (options.length > 0) {
      ctx.addIssue({ code: "custom", path: ["options"], message: "DESCRIPTIVE must not have options" });
    }
  }
});

export const createQuizSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(200, { message: "Title must be at most 200 characters" }),
  description: z
    .string()
    .trim()
    .max(1000, { message: "Description must be at most 1000 characters" })
    .optional(),
  questions: z
    .array(questionSchema)
    .min(1, { message: "At least one question is required" })
    .optional(),
});

export const updateQuizSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(200, { message: "Title must be at most 200 characters" })
    .optional(),
  description: z
    .string()
    .trim()
    .max(1000, { message: "Description must be at most 1000 characters" })
    .optional(),
  questions: z
    .array(questionSchema)
    .min(1, { message: "At least one question is required" })
    .optional(),
});


// Attempt quiz schema: expects answers per question.
// Route will pass quiz id as URL param; body contains only answers.
const answerByOptionSchema = z.object({
  questionId: z.string({ message: "Invalid question id" }),
  selectedOptionId: z.string({ message: "Invalid option id" }), // id is string
});

const answerByOptionsSchema = z.object({
  questionId: z.string({ message: "Invalid question id" }),
  selectedOptionIds: z.array(z.string({ message: "Invalid option id" })).min(1, { message: "Select at least one option" }),
});

const answerByTextSchema = z.object({
  questionId: z.string({ message: "Invalid question id" }),
  answer: z.string().trim().min(1, { message: "Answer is required" }),
});

const answerByDescriptiveSchema = z.object({
  questionId: z.string({ message: "Invalid question id" }),
  answer: z.string().trim().min(1, { message: "Answer is required" }).max(300, { message: "Answer must be at most 300 characters" }),
});

export const attemptQuizSchema = z.object({
  answers: z
    .array(z.union([answerByOptionSchema, answerByOptionsSchema, answerByTextSchema, answerByDescriptiveSchema]))
    .min(1, { message: "At least one answer is required" }),
});

// Add one or more questions to an existing quiz
export const addQuestionsSchema = z.object({
  quizId: z.string({ message: "Invalid quiz id" }),
  questions: z.array(questionSchema).min(1, {
    message: "At least one question is required",
  }),
});

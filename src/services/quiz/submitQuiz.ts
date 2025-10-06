import { Request, Response } from "express";
import prisma from "../../prismaClient";
import type { Option, Question, QuestionType } from "@prisma/client";

export const submitQuiz = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.id;
    if (!quizId) {
      return res.status(400).json({ error: "Quiz id is required" });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Load quiz with questions and options for evaluation
    const quiz = await prisma.quiz.findUniqueOrThrow({
      where: { id: quizId },
      include: { questions: { include: { options: true } } },
    });

    const answers: Array<
      | { questionId: string; selectedOptionId: string }
      | { questionId: string; selectedOptionIds: string[] }
      | { questionId: string; answer: string }
    > = Array.isArray(req.body?.answers) ? req.body.answers : [];

    // Index answers by questionId for quick lookup
    const answersByQ = new Map(answers.map((a) => [a.questionId, a]));

    let score = 0;
    const details: Array<{
      questionId: string;
      correct: boolean;
      expected?: string;
      received?: string;
    }> = [];

    const questions = quiz.questions as (Question & { options: Option[] })[];
    for (const q of questions) {
      const ans = answersByQ.get(q.id);
      let correct = false;
  
      if (!ans) {
        details.push({ questionId: q.id, correct: false });
        continue;
      }
  
      if (q.type === ("FILL_BLANK" as QuestionType)) {
        const correctOption = q.options.find((o) => o.isCorrect);
        const expected = correctOption?.text?.trim() ?? "";
        const received = ("answer" in ans ? ans.answer : "").trim();
        correct = expected.length > 0 && expected.toLowerCase() === received.toLowerCase();
        details.push({ questionId: q.id, correct, expected, received });
      } else if (q.type === ("MCQ_MULTIPLE" as QuestionType)) {
        const selectedIds = "selectedOptionIds" in ans ? ans.selectedOptionIds : undefined;
        const correctIds = q.options.filter((o) => o.isCorrect).map((o) => o.id);
  
        if (!selectedIds || selectedIds.length === 0) {
          details.push({ questionId: q.id, correct: false });
        } else {
          const selectedSet = new Set(selectedIds);
          const correctSet = new Set(correctIds);
          // full credit only if sets match exactly
          correct =
            selectedSet.size === correctSet.size &&
            [...selectedSet].every((id) => correctSet.has(id));
          details.push({
            questionId: q.id,
            correct,
            expected: JSON.stringify(correctIds),
            received: JSON.stringify(selectedIds),
          });
        }
      } else {
        // MCQ / TRUE_FALSE: single selection
        const selectedId = "selectedOptionId" in ans ? ans.selectedOptionId : undefined;
        const selected = q.options.find((o) => o.id === selectedId);
        correct = !!selected?.isCorrect;
        if (!selectedId) {
          details.push({ questionId: q.id, correct: false });
        } else {
          details.push({ questionId: q.id, correct, received: selectedId });
        }
      }
  
      if (correct) score += 1;
    }
    // Persist result
    const result = await prisma.result.create({
      data: {
        userId: userId,
        quizId: quizId,
        score,
      },
    });

    return res.status(200).json({
      quizId: quizId,
      userId: userId,
      score,
      total: questions.length,
      resultId: result.id,
      details,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

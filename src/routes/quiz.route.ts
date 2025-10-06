import express from "express";
import { quizService } from "../controllers/quiz.controller";
import {
  createQuizSchema,
  updateQuizSchema,
  attemptQuizSchema,
} from "../validationSchema/quiz";
import { validate } from "../validationSchema/validate";
import {
  authenticate,
  requireAdmin,
  requireUser,
} from "../middleware/auth.middleware";

const quizRouter = express.Router();

// Create Quiz ✅
quizRouter.post(
  "/create",
  authenticate,
  requireAdmin,
  validate(createQuizSchema),
  quizService.create
);

// Update Quiz ✅
quizRouter.patch(
  "/:id",
  authenticate,
  requireAdmin,
  validate(updateQuizSchema),
  quizService.update
);

// Delete Quiz ✅
quizRouter.delete(
  "/:id",
  authenticate,
  requireAdmin,
  quizService.delete
);

//Get Questions by QuizID✅
quizRouter.get(
  "/getQuestions/:id",
  authenticate,
  quizService.getQuestionsByQuiz
);

//Get all quizzes ✅
quizRouter.get("/all", authenticate, quizService.getAllQuizzes);

//Get quiz by id ✅
quizRouter.get("/:id", authenticate, quizService.quizByID);

// Attempt Quiz ✅ (users)
quizRouter.post(
  "/submit/:id",
  authenticate,
  requireUser,
  validate(attemptQuizSchema),
  quizService.submit
);

export { quizRouter as quizRoutes };

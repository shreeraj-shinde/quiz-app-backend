import prisma from "../prismaClient";
import { Request, Response } from "express";

import {
  createQuestionsWithOptions,
  sanitizeQuizForClient,
} from "../utils/utils";

import { removeAnswersFromTheQuestion } from "../utils/questionUtils";
import { getAllQuizzes as getAllQuizzesService } from "../services/quiz/getAllQuizzes";
import {  createQuizService } from "../services/quiz/createQuiz";
import { submitQuiz } from "../services/quiz/submitQuiz";
import { UpdateQuiz } from "../services/quiz/updateQuiz";
import { getQuizById } from "../services/quiz/getQuizById";
import { getQuestionsByQuiz } from "../services/quiz/getQuestionByQuiz";
import { deleteQuizService } from "../services/quiz/deleteQuiz";

export const quizService = {
  getAllQuizzes: getAllQuizzesService,  
  create: createQuizService,
  submit: submitQuiz,
  update: UpdateQuiz,
  delete: deleteQuizService,
  quizByID: getQuizById,
  getQuestionsByQuiz: getQuestionsByQuiz,
};



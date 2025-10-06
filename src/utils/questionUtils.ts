import { Option } from "@prisma/client";

// Remove Options form The Question
export const removeAnswersFromTheQuestion = (options: Option[]) => {
  return options.map((o) => ({
    id: o.id,
    questionId: o.questionId,
    text: o.text
  }));
};  

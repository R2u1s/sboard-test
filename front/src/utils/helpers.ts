import { IApiResponseAnswer, IQuestion, TAnswer, TId, TInputElement, TInputValues, TVotes } from "../types/types";
import { INPUT_ANSWER_NAME, INPUT_QUESTION_NAME } from "./constants";

export function isQuestionAnswered(obj: IQuestion): TId | null {

  const idKey = 'res_ans';

  if (
    obj.hasOwnProperty(idKey) &&
    obj[idKey] !== null &&
    obj[idKey] !== undefined &&
    typeof obj[idKey] === 'string'
  ) { return obj[idKey] }
  else {
    return null;
  }

}

export function transformArrayToObject(arr: TInputElement[]): Record<string, string> {
  return arr.reduce((acc, item) => {
    acc[item.name] = item.text;
    return acc;
  }, {} as Record<string, string>);
}

//проверяем, что что-то введено в инпут вопроса и в два инпута ответов
export function checkQuestionAnswersNotEmpty(data: Record<string, string>): boolean {
  const answers = Object.keys(data)
    .filter(key => key.startsWith(INPUT_ANSWER_NAME) && data[key].length > 0);

  return data[INPUT_QUESTION_NAME].length > 0 && answers.length >= 2;
}

//проверяем ответ сервера - что в списке вопросов есть тот, на который ответили и у него
//сохранен id ответа
export function isAnswerCorrect(questions: IQuestion[], id_q: TId, id: TId): boolean {
  const foundQuestion = questions.find(question => question.id_q === id_q);
  return foundQuestion ? foundQuestion.res_ans === id : false;
}

export function extractAnswers(input: TInputValues): string[] {
  const answers: string[] = [];

  for (const key in input) {
    if (key.startsWith(INPUT_ANSWER_NAME)) {
      const answer = input[key];
      // Проверяем, что строка непустая
      if (answer && answer.trim() !== '') {
        answers.push(answer);
      }
    }
  }

  return answers.reverse();
}

export function transformAnswerResponse(inputArray: IApiResponseAnswer[]): TAnswer[] {
  return inputArray.map(item => ({
      id_a: item.id,
      text_a: item.text_a
  }));
}

//
export function filterVotesByAns<T>(ans: TAnswer[], votes: TVotes): TVotes {
  const ids = ans.map(item => item.id_a);
  
  return Object.keys(votes)
    .filter(key => ids.includes(key))
    .reduce((acc, key) => {
      acc[key] = votes[key];
      return acc;
    }, {} as TVotes);
}
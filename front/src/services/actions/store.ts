import { AppDispatch, IApiResponseQuestion, TGetVotes, TPostAnswerBody, TVotes } from "../../types/types";
import axios from "axios";
import { API, URL_GET_API } from "../../utils/constants";
import { IpResponse, TId, TCreateQuestionBody, TMessage } from "../../types/types";

//Запрос списка вопросов
export const QUESTIONS_REQUEST: 'QUESTIONS_REQUEST' = 'QUESTIONS_REQUEST';
export const QUESTIONS_SUCCESS: 'QUESTIONS_SUCCESS' = 'QUESTIONS_SUCCESS';
export const QUESTIONS_FAILED: 'QUESTIONS_FAILED' = 'QUESTIONS_FAILED';
//Отправка выбранного ответа
export const ANSWER_REQUEST: 'ANSWER_REQUEST' = 'ANSWER_REQUEST';
export const ANSWER_SUCCESS: 'ANSWER_SUCCESS' = 'ANSWER_SUCCESS';
export const ANSWER_FAILED: 'ANSWER_FAILED' = 'ANSWER_FAILED';
//Запрос IP пользователя
export const IP_REQUEST: 'IP_REQUEST' = 'IP_REQUEST';
export const IP_SUCCESS: 'IP_SUCCESS' = 'IP_SUCCESS';
export const IP_FAILED: 'IP_FAILED' = 'IP_FAILED';
//Изменение id выбранного ответа на вопрос
export const CHOSEN_CHANGE: 'CHOSEN_CHANGE' = 'CHOSEN_CHANGE';
//Изменение id выбранного ответа на вопрос
export const CHOSEN_CLEAR: 'CHOSEN_CLEAR' = 'CHOSEN_CLEAR';
//Удаление вопроса
export const DELETE_REQUEST: 'DELETE_REQUEST' = 'DELETE_REQUEST';
export const DELETE_SUCCESS: 'DELETE_SUCCESS' = 'DELETE_SUCCESS';
export const DELETE_FAILED: 'DELETE_FAILED' = 'DELETE_FAILED';
//Создание вопроса
export const CREATE_REQUEST: 'CREATE_REQUEST' = 'CREATE_REQUEST';
export const CREATE_SUCCESS: 'CREATE_SUCCESS' = 'CREATE_SUCCESS';
export const CREATE_FAILED: 'CREATE_FAILED' = 'CREATE_FAILED';
//Изменение текста уведомления
export const WRITE_MESSAGE: 'WRITE_MESSAGE' = 'WRITE_MESSAGE';
//Очистка уведомления 
export const CLEAR_MESSAGE: 'CLEAR_MESSAGE' = 'CLEAR_MESSAGE';
//Запрос количества голосов
export const VOTES_REQUEST: 'VOTES_REQUEST' = 'VOTES_REQUEST';
export const VOTES_SUCCESS: 'VOTES_SUCCESS' = 'VOTES_SUCCESS';
export const VOTES_FAILED: 'VOTES_FAILED' = 'VOTES_FAILED';
//Пополнение списка id ответов для запроса голосов 
export const ANSWER_IDS_ADD: 'ANSWER_IDS_ADD' = 'ANSWER_IDS_ADD';
//Удаление из списка id ответов
export const ANSWER_IDS_REMOVE: 'ANSWER_IDS_REMOVE' = 'ANSWER_IDS_REMOVE';
//Очистка уведомления 
export const CLEAR_HIGHLIGHT: 'CLEAR_HIGHLIGHT' = 'CLEAR_HIGHLIGHT';

//Запрос списка вопросов
export interface IQuestionsRequestAction { readonly type: typeof QUESTIONS_REQUEST }
export interface IQuestionsSuccessAction {
  readonly type: typeof QUESTIONS_SUCCESS,
  readonly data: {
    questions:Array<IApiResponseQuestion>,
    total: number,
    votes:TVotes
  }
}
export interface IQuestionsErrorAction { readonly type: typeof QUESTIONS_FAILED }
//Отправка выбранного ответа
export interface IAnswerRequestAction {
  readonly type: typeof ANSWER_REQUEST,
  readonly data: TId
}
export interface IAnswerSuccessAction {
  readonly type: typeof ANSWER_SUCCESS,
  readonly data: {
    votes: TVotes,
    question: IApiResponseQuestion
  }
}
export interface IAnswerErrorAction { readonly type: typeof ANSWER_FAILED }
//Запрос IP пользователя
export interface IIpRequestAction { readonly type: typeof IP_REQUEST }
export interface IIpSuccessAction {
  readonly type: typeof IP_SUCCESS,
  readonly data: string
}
export interface IIpErrorAction { readonly type: typeof IP_FAILED }
//Изменение id выбранного ответа на вопрос
export interface IChosenChangeAction {
  readonly type: typeof CHOSEN_CHANGE,
  readonly data: TId
}
//Очистка значения выбранного id
export interface IChosenClearAction {
  readonly type: typeof CHOSEN_CLEAR,
  readonly data: TId
}
//Удаление вопроса
export interface IDeleteRequestAction { 
  readonly type: typeof DELETE_REQUEST,
  readonly data: TId
 }
export interface IDeleteSuccessAction {
  readonly type: typeof DELETE_SUCCESS,
  readonly data: TId
}
export interface IDeleteErrorAction { readonly type: typeof DELETE_FAILED }
//Создание вопроса
export interface ICreateRequestAction { readonly type: typeof CREATE_REQUEST }
export interface ICreateSuccessAction {
  readonly type: typeof CREATE_SUCCESS,
  readonly data: IApiResponseQuestion
}
export interface ICreateErrorAction { readonly type: typeof CREATE_FAILED }
//Запись текста уведомления
export interface IWriteMessageAction {
  readonly type: typeof WRITE_MESSAGE,
  readonly data: TMessage
}
//Очистить текст уведомления
export interface IClearMessageAction {
  readonly type: typeof CLEAR_MESSAGE
}
//Запрос обновления подсчета голосов
export interface IVotesRequestAction { readonly type: typeof VOTES_REQUEST }
export interface IVotesSuccessAction {
  readonly type: typeof VOTES_SUCCESS,
  readonly data: TVotes
}
export interface IVotesErrorAction { readonly type: typeof VOTES_FAILED }
//Пополнение списка id ответов для запроса голосов 
export interface IAnswerIdsAddAction {
  readonly type: typeof ANSWER_IDS_ADD,
  readonly data: TId[]
}
//Удаление из списка id ответов
export interface IAnswerIdsRemoveAction {
  readonly type: typeof ANSWER_IDS_REMOVE,
  readonly data: TId[]
}
//Очистить массив изменившихся голосов
export interface IClearHighlightAction {
  readonly type: typeof CLEAR_HIGHLIGHT
}

export type TStoreActions =
  IQuestionsRequestAction |
  IQuestionsSuccessAction |
  IQuestionsErrorAction |
  IIpRequestAction |
  IIpSuccessAction |
  IIpErrorAction |
  IAnswerRequestAction |
  IAnswerSuccessAction |
  IAnswerErrorAction |
  IChosenChangeAction |
  IChosenClearAction |
  IDeleteRequestAction |
  IDeleteSuccessAction |
  IDeleteErrorAction |
  ICreateRequestAction |
  ICreateSuccessAction |
  ICreateErrorAction |
  IWriteMessageAction |
  IClearMessageAction |
  IVotesRequestAction |
  IVotesSuccessAction |
  IVotesErrorAction |
  IAnswerIdsAddAction |
  IAnswerIdsRemoveAction |
  IClearHighlightAction;

//получение списка вопросов
export const getQuestionsAndIp = (page:number,offset:number) => {
  return function (dispatch: AppDispatch) {
    //Перед запросом к серверу нужно определить ip пользователя
    dispatch({
      type: QUESTIONS_REQUEST
    });
    dispatch({
      type: IP_REQUEST
    });
    axios.get<IpResponse>(URL_GET_API)
      .then(ipRes => {
        const ip = ipRes.data.ip;
        dispatch({
          type: IP_SUCCESS,
          data: ip
        });
        return ipRes.data.ip;
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: IP_FAILED
        });
        return '';
      }) // В случае ошибки возвращаем пустую строку
      .then(userIp => {
        // Выполняем запрос к серверу с полученным IP
        return axios.get(`${API}/polls/${page}/${offset}`, {
          headers: {
            'X-custom-ipuser': userIp
          }
        });
      })
      .then(questionsResponse => {
        if (questionsResponse.status === 200) {
          dispatch({
            type: QUESTIONS_SUCCESS,
            data: questionsResponse.data
          });
        } else {
          dispatch({
            type: QUESTIONS_FAILED
          });
        }
      })
      .catch(error => {
        dispatch({
          type: QUESTIONS_FAILED
        });
        console.log(error);
      });
  };
}

//отправка ответа на вопрос
export const postAnswer = (body: TPostAnswerBody) => {
  return function (dispatch: AppDispatch) {
    dispatch({
      type: ANSWER_REQUEST,
      data: body.id_a
    });
    axios.post(`${API}/polls/${body.id_q}/vote`, {
      id_a: body.id_a,
      ipUser: body.ipUser
    })
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: ANSWER_SUCCESS,
            data: res.data
          });
        } else {
          dispatch({
            type: ANSWER_FAILED
          });
        }
      })
      .catch(error => {
        dispatch({
          type: ANSWER_FAILED
        });
        console.log(error);
      });
  };
}

//сохранение выбранного ответа на вопрос
export const changeChosenAnswer = (id: TId) => ({
  type: CHOSEN_CHANGE,
  data: id
});

//очистка сохраненного id
export const clearChosen = () => ({
  type: CHOSEN_CLEAR
});


//удаление вопроса
export const deleteQuestion = (id: TId, ip: string) => {
  return function (dispatch: AppDispatch) {
    dispatch({
      type: DELETE_REQUEST,
      data: id
    });
    axios.delete(`${API}/polls/${id}`,{
      headers: {
        'X-custom-ipuser': ip
      }
    })
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: DELETE_SUCCESS,
            data: id
          });
        } else {
          dispatch({
            type: DELETE_FAILED
          });
        }
      })
      .catch(error => {
        dispatch({
          type: DELETE_FAILED
        });
        console.log(error);
      });
  };
}

//запрос на создание вопроса
export const postQuestion = (body: TCreateQuestionBody, clearCallback: () => void) => {
  return function (dispatch: AppDispatch) {
    dispatch({
      type: CREATE_REQUEST
    });
    axios.post(`${API}/polls`, {
      text_q: body.text_q,
      ans: body.ans,
      ipUser: body.ip
    })
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: CREATE_SUCCESS,
            data: res.data
          });
          clearCallback();
        } else {
          dispatch({
            type: CREATE_FAILED
          });
        }
      })
      .catch(error => {
        dispatch({
          type: CREATE_FAILED
        });
        console.log(error);
      });
  };
}

//запись текста уведомления
export const writeMessage = (obj: TMessage) => ({
  type: WRITE_MESSAGE,
  data: obj
});

//очистить текст уведомления
export const clearMessage = () => ({
  type: CLEAR_MESSAGE
});

//запрос голосов
export const getVotes = (body: TGetVotes) => {
  return function (dispatch: AppDispatch) {
    dispatch({
      type: VOTES_REQUEST
    });
    axios.post(`${API}/polls/votes`, body)
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: VOTES_SUCCESS,
            data: res.data
          });
        } else {
          dispatch({
            type: VOTES_FAILED
          });
        }
      })
      .catch(error => {
        dispatch({
          type: VOTES_FAILED
        });
        console.log(error);
      });
  };
}

//Пополнение списка id ответов для запроса голосов 
export const addAnswerIdsList = (array: TId[]) => ({
  type: ANSWER_IDS_ADD,
  data: array
});

//Удаление из списка id ответов
export const removeAnswerIdsList = (array: TId[]) => ({
  type: ANSWER_IDS_REMOVE,
  data: array
});

//очистить массив изменившихся голосов
export const clearHighlight = () => ({
  type: CLEAR_HIGHLIGHT
});
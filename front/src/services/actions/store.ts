import { AppDispatch, IQuestion, TPostAnswerBody, TVotes } from "../../types/types";
import axios from "axios";
import { API } from "../../utils/constants";
import { IpResponse, TId, TCreateQuestionBody, TMessage } from "../../types/types";

import { setupMocksSuccess } from "../../utils/mockApi";
import { setupMocksError } from "../../utils/mockApi";
const axiosInstance = setupMocksSuccess();

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
export const CLEAR_MESSAGE:'CLEAR_MESSAGE' = 'CLEAR_MESSAGE';

//Запрос списка вопросов
export interface IQuestionsRequestAction { readonly type: typeof QUESTIONS_REQUEST }
export interface IQuestionsSuccessAction {
  readonly type: typeof QUESTIONS_SUCCESS,
  readonly data: Array<IQuestion>
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
    votes:TVotes,
    question: IQuestion
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
//Удаление вопроса
export interface IDeleteRequestAction { readonly type: typeof DELETE_REQUEST }
export interface IDeleteSuccessAction {
  readonly type: typeof DELETE_SUCCESS,
  readonly data: TId
}
export interface IDeleteErrorAction { readonly type: typeof DELETE_FAILED }
//Создание вопроса
export interface ICreateRequestAction { readonly type: typeof CREATE_REQUEST }
export interface ICreateSuccessAction {
  readonly type: typeof CREATE_SUCCESS,
  readonly data: IQuestion
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
  IDeleteRequestAction |
  IDeleteSuccessAction |
  IDeleteErrorAction |
  ICreateRequestAction |
  ICreateSuccessAction |
  ICreateErrorAction |
  IWriteMessageAction |
  IClearMessageAction;

//получение списка вопросов
export const getQuestions = () => {
  return function (dispatch:AppDispatch) {
    dispatch({
      type: QUESTIONS_REQUEST
    });
    axiosInstance.get(`${API}/polls`)
    .then((res) => {
      if (res.status === 200) {
        dispatch({
          type: QUESTIONS_SUCCESS,
          data: res.data
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

//получение ip пользователя
export const getIpUser = () => {
  return function (dispatch:AppDispatch) {
    dispatch({
      type: IP_REQUEST
    });
    axios.get<IpResponse>('https://api.ipify.org?format=json')
    .then((res) => {
      if (res.status === 200) {
        dispatch({
          type: IP_SUCCESS,
          data: res.data.ip
        });
      } else {
        dispatch({
          type: IP_FAILED
        });
      }
    })
    .catch(error => {
      dispatch({
        type: IP_FAILED
      });
      console.log(error);
    });
  };
}

//отправка ответа на вопрос
export const postAnswer = (body:TPostAnswerBody) => {
  return function (dispatch:AppDispatch) {
    dispatch({
      type: ANSWER_REQUEST,
      data: body.id_a
    });
    axiosInstance.post(`${API}/polls/${body.id_q}/vote`,{
      id_a:body.id_a,
      ipUser:body.ipUser
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

//удаление вопроса
export const deleteQuestion = (id: TId) => {
  return function (dispatch:AppDispatch) {
    dispatch({
      type: DELETE_REQUEST
    });
    axiosInstance.delete(`${API}/polls/${id}`)
    .then((res) => {
      if (res.status === 200) {
        dispatch({
          type: DELETE_SUCCESS,
          data: res.data
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
export const postQuestion = (body:TCreateQuestionBody, clearCallback:()=>void) => {
  return function (dispatch:AppDispatch) {
    dispatch({
      type: CREATE_REQUEST
    });
    axiosInstance.post(`${API}/polls`,{
      text_q: body.text_q,
      ans: body.ans,
      ip:body.ip
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
export const writeMessage = (obj:TMessage) => ({
  type: WRITE_MESSAGE,
  data: obj
});

//очистить текст уведомления
export const clearMessage = () => ({
  type: CLEAR_MESSAGE
});
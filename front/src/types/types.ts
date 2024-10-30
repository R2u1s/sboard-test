import { store } from '../index';
import { Action, ActionCreator, Dispatch } from 'redux';
import { TStoreActions } from '../services/actions/store';
import { ThunkAction } from 'redux-thunk';

export type TId = string;

export type TAnswer = {
  id_a: TId;
  text_a: string;
}

export type TPostAnswerBody = {
  id_q: TId;
  id_a: TId;
  ipUser: string;
}

export interface IQuestion {
  id_q: TId;
  text_q: string;
  ans: TAnswer[];
  owner: boolean;
  res_ans?: TId;
}

export interface IApiResponseAnswer {
  id: TId;
  text_a: string;
}

export interface IApiResponseQuestion {
  id: TId;
  text_q: string;
  ans: IApiResponseAnswer[];
  owner: boolean;
  res_ans?: TId;
}

export type TCreateQuestionBody = {
  text_q: string;
  ans: string[];
  ip:string;
}

export type TMessage = {
  text:string;
  positive:boolean;
}

export type TVotes = {
  [key: string]: number;
}

export type LineWrapperProps = {
  firstComponent: React.ReactNode;
  secondComponent: React.ReactNode;
  thirdComponent?: React.ReactNode;
  extraClass?: string;
};

export interface IQuestionProps {
  question: IQuestion
};

export interface ICheckProps {
  isDone: boolean;
}

export type TInputValues = {[key: string]: any};

export type TInputElement = { 
  name: string; 
  text: string 
};

export interface IpResponse {
  ip: string;
}

export type RootState = ReturnType<typeof store.getState>;

// Типизация всех экшенов приложения
type TApplicationActions = TStoreActions;

// Типизация thunk в нашем приложении
export type AppThunk<TReturn = void> = ActionCreator<
  ThunkAction<TReturn, Action, RootState, TApplicationActions>
>;

// Типизация метода dispatch для проверки на валидность отправляемого экшена
export type AppDispatch = typeof store.dispatch;

export type TApiAnswer = {
  status:string,
  data:any
}

export type TGetVotes = TId[];
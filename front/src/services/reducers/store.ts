import { IQuestion, TVotes, TId, TMessage } from "../../types/types"
import { TEXT_MESSAGE_DELETE_FAIL, TEXT_MESSAGE_ANSWER_FAIL, TEXT_MESSAGE_CREATE_FAIL, TEXT_MESSAGE_IP_FAIL, TEXT_MESSAGE_DELETE_SUCCESS, TEXT_MESSAGE_CREATE_SUCCESS } from "../../utils/constants";
import {
  QUESTIONS_REQUEST,
  QUESTIONS_SUCCESS,
  QUESTIONS_FAILED,
  ANSWER_REQUEST,
  ANSWER_SUCCESS,
  ANSWER_FAILED,
  IP_REQUEST,
  IP_SUCCESS,
  IP_FAILED,
  CHOSEN_CHANGE,
  DELETE_REQUEST,
  DELETE_SUCCESS,
  DELETE_FAILED,
  CREATE_REQUEST,
  CREATE_SUCCESS,
  CREATE_FAILED,
  CLEAR_MESSAGE,
  TStoreActions
} from "../actions/store"

export type TState = {
  questions: IQuestion[];
  votes: TVotes;
  ipUser: string;
  chosen:TId | null,
  message: TMessage,
  questionsRequest: boolean,
  questionsSuccess: boolean,
  questionsFailed: boolean,
  ipRequest: boolean,
  ipSuccess: boolean,
  ipFailed: boolean,
  answerRequest: boolean,
  answerSuccess: boolean,
  answerFailed: boolean,
  deleteRequest: boolean,
  deleteSuccess: boolean,
  deleteFailed: boolean,
  createRequest: boolean,
  createSuccess: boolean,
  createFailed: boolean
};

const initialState: TState = {
  questions: [],
  votes: {},
  ipUser: '',
  chosen:null, //временное сохранение id выбранного ответа
  message:{
    text:'',
    positive: true //если сообщение об ошибке - false, успех - true
  },
  questionsRequest: false,
  questionsSuccess: false,
  questionsFailed: false,
  ipRequest: false,
  ipSuccess: false,
  ipFailed: false,
  answerRequest: false,
  answerSuccess: false,
  answerFailed: false,
  deleteRequest: false,
  deleteSuccess: false,
  deleteFailed: false,
  createRequest: false,
  createSuccess: false,
  createFailed: false
}

export const storeReducer = (state = initialState, action: TStoreActions) => {
  switch (action.type) {
    case QUESTIONS_REQUEST: {
      return {
        ...state,
        questionsRequest: true,
        questionsSuccess: false,
        questionsFailed: false
      };
    }
    case QUESTIONS_SUCCESS: {
      return {
        ...state,
        questionsRequest: false,
        questionsSuccess: true,
        questionsFailed: false,
        questions: action.data
      };
    }
    case QUESTIONS_FAILED: {
      return {
        ...state,
        questionsRequest: false,
        questionsSuccess: false,
        questionsFailed: true
      };
    }
    case IP_REQUEST: {
      return {
        ...state,
        ipRequest: true
      };
    }
    case IP_SUCCESS: {
      return {
        ...state,
        ipRequest: false,
        ipSuccess: true,
        ipFailed: false,
        ipUser: action.data
      };
    }
    case IP_FAILED: {
      return {
        ...state,
        message: {
          text:TEXT_MESSAGE_IP_FAIL,
          positive: false
        },
        ipRequest: false,
        ipSuccess: false,
        ip: true
      };
    }
    case ANSWER_REQUEST: {
      return {
        ...state,
        chosen: action.data,
        answerRequest: true,
        answerSuccess: false,
        answerFailed: false
      };
    }
    case ANSWER_SUCCESS: {
      return {
        ...state,
        answerRequest: false,
        answerSuccess: true,
        answerFailed: false,
        votes: {
          ...state.votes,
          ...action.data.votes
        },
        questions: state.questions.map((obj) =>
            obj.id_q === action.data.question.id_q ? { ...obj, res_ans: action.data.question.res_ans } : obj
          )
      };
    }
    case ANSWER_FAILED: {
      return {
        ...state,
        message: {
          text:TEXT_MESSAGE_ANSWER_FAIL,
          positive:false
        },
        answerRequest: false,
        answerSuccess: false,
        answerFailed: true
      };
    }
    case CHOSEN_CHANGE: {
      return { ...state, chosen: action.data };
    }
    case DELETE_REQUEST: {
      return {
        ...state,
        deleteRequest: true,
        deleteSuccess: false,
        deleteFailed: false
      };
    }
    case DELETE_SUCCESS: {
      return {
        ...state,
        message: {
          text: TEXT_MESSAGE_DELETE_SUCCESS,
          positive: true
        },
        deleteRequest: false,
        deleteSuccess: true,
        deleteFailed: false,
        questions: action.data
      };
    }
    case DELETE_FAILED: {
      return {
        ...state,
        message: {
          text: TEXT_MESSAGE_DELETE_FAIL,
          positive: false
        },
        deleteRequest: false,
        deleteSuccess: false,
        deleteFailed: true
      };
    }
    case CREATE_REQUEST: {
      return {
        ...state,
        createRequest: true,
        createSuccess: false,
        createFailed: false
      };
    }
    case CREATE_SUCCESS: {
      return {
        ...state,
        message: {
          text:TEXT_MESSAGE_CREATE_SUCCESS,
          positive: true
        },
        createRequest: false,
        createSuccess: true,
        createFailed: false,
        questions: action.data
      };
    }
    case CREATE_FAILED: {
      return {
        ...state,
        message: {
          text:TEXT_MESSAGE_CREATE_FAIL,
          positive: false
        },
        createRequest: false,
        createSuccess: false,
        createFailed: true
      };
    }
    case CLEAR_MESSAGE: {
      return { 
        ...state, 
        message: initialState.message
       };
    }
    default: {
      return state;
    }
  }
} 
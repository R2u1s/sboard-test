import { IQuestion, TVotes, TId, TMessage } from "../../types/types"
import { TEXT_MESSAGE_DELETE_FAIL, TEXT_MESSAGE_ANSWER_FAIL, TEXT_MESSAGE_CREATE_FAIL, TEXT_MESSAGE_IP_FAIL, TEXT_MESSAGE_DELETE_SUCCESS, TEXT_MESSAGE_CREATE_SUCCESS } from "../../utils/constants";
import { transformAnswerResponse, transformQuestionsResponse } from "../../utils/helpers";
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
  CHOSEN_CLEAR,
  DELETE_REQUEST,
  DELETE_SUCCESS,
  DELETE_FAILED,
  CREATE_REQUEST,
  CREATE_SUCCESS,
  CREATE_FAILED,
  CLEAR_MESSAGE,
  VOTES_REQUEST,
  VOTES_SUCCESS,
  VOTES_FAILED,
  ANSWER_IDS_ADD,
  ANSWER_IDS_REMOVE,
  CLEAR_HIGHLIGHT,
  TStoreActions
} from "../actions/store"
import { getDifferentKeys } from "../../utils/utils";

export type TState = {
  questions: IQuestion[];
  total: number;
  votes: TVotes;
  ipUser: string;
  chosen: TId | null,
  message: TMessage,
  answerIds: TId[],
  prevVotesResponse: TVotes,
  highlightAnswerVote: TId[],
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
  createFailed: boolean,
  votesRequest: boolean,
  votesSuccess: boolean,
  votesFailed: boolean
};

const initialState: TState = {
  questions: [],
  total: 0,
  votes: {},
  ipUser: '',
  chosen: null, //временное сохранение id выбранного ответа
  message: {
    text: '',
    positive: true //если сообщение об ошибке - false, успех - true
  },
  answerIds: [],
  prevVotesResponse: {},
  highlightAnswerVote: [], //сохраняем сюда id ответов, для которых нужно подсветить изменившееся количество голосов
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
  createFailed: false,
  votesRequest: false,
  votesSuccess: false,
  votesFailed: false
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
        questions: [...state.questions,...transformQuestionsResponse(action.data.questions,state.questions)],
        total: action.data.total,
        votes: {...state.votes,...action.data.votes},
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
          text: TEXT_MESSAGE_IP_FAIL,
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
          obj.id_q === action.data.question.id ? { ...obj, res_ans: action.data.question.res_ans } : obj
        )
      };
    }
    case ANSWER_FAILED: {
      return {
        ...state,
        chosen: null,
        message: {
          text: TEXT_MESSAGE_ANSWER_FAIL,
          positive: false
        },
        answerRequest: false,
        answerSuccess: false,
        answerFailed: true
      };
    }
    case CHOSEN_CHANGE: {
      return { ...state, chosen: action.data };
    }
    case CHOSEN_CLEAR: {
      return { ...state, chosen: initialState.chosen };
    }
    case DELETE_REQUEST: {
      return {
        ...state,
        chosen: action.data,
        deleteRequest: true,
        deleteSuccess: false,
        deleteFailed: false
      };
    }
    case DELETE_SUCCESS: {
      return {
        ...state,
        chosen: null,
        message: {
          text: TEXT_MESSAGE_DELETE_SUCCESS,
          positive: true
        },
        deleteRequest: false,
        deleteSuccess: true,
        deleteFailed: false,
        questions: state.questions.filter(item => item.id_q !== action.data)
      };
    }
    case DELETE_FAILED: {
      return {
        ...state,
        chosen: null,
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
      const newPoll: IQuestion = {
        id_q: action.data.id,
        text_q: action.data.text_q,
        ans: transformAnswerResponse(action.data.ans),
        owner: action.data.owner
      }
      return {
        ...state,
        message: {
          text: TEXT_MESSAGE_CREATE_SUCCESS,
          positive: true
        },
        createRequest: false,
        createSuccess: true,
        createFailed: false,
        questions: [newPoll, ...state.questions]
      };
    }
    case CREATE_FAILED: {
      return {
        ...state,
        message: {
          text: TEXT_MESSAGE_CREATE_FAIL,
          positive: false
        },
        createRequest: false,
        createSuccess: false,
        createFailed: true
      };
    }
    case VOTES_REQUEST: {
      return {
        ...state,
        votesRequest: true,
        votesSuccess: false,
        votesFailed: false
      };
    }
    case VOTES_SUCCESS: {
      //меняем votes только если ответ сервера отличается от предыдущего
      // if (isEqual(state.prevVotesResponse, action.data) || Object.keys(state.prevVotesResponse).length === 0) {
      //   return {
      //     ...state,
      //     prevVotesResponse: action.data,
      //     votesRequest: false,
      //     votesSuccess: true,
      //     votesFailed: false
      //   };
      // } else {
        return {
          ...state,
          prevVotesResponse: action.data,
          highlightAnswerVote:getDifferentKeys(state.prevVotesResponse,action.data), 
          votes: {...state.votes,...action.data},
          votesRequest: false,
          votesSuccess: true,
          votesFailed: false
        };
      }
    // }
    case VOTES_FAILED: {
      return {
        ...state,
        votesRequest: false,
        votesSuccess: false,
        votesFailed: true
      };
    }
    case ANSWER_IDS_ADD: {
      return { ...state, answerIds: [...state.answerIds, ...action.data] };
    }
    case ANSWER_IDS_REMOVE: {
      return { ...state, answerIds: state.answerIds.filter(item => !action.data.includes(item)) };
    }
    case CLEAR_MESSAGE: {
      return {
        ...state,
        message: initialState.message
      };
    }
    case CLEAR_HIGHLIGHT: {
      return {
        ...state,
        highlightAnswerVote: initialState.highlightAnswerVote
      };
    }
    default: {
      return state;
    }
  }
} 
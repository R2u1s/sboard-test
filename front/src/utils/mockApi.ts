import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { API } from './constants';
import { mockQuestionsList,mockQuestionsListAfterDelete,mockVotesList } from './mock';
import { TId } from '../types/types';

export const setupMocksSuccess = () => {
  const axiosInstance = axios.create({});
  const mock = new AxiosMockAdapter(axiosInstance);

  mock.onGet(`${API}/polls`).reply(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([200, mockQuestionsList]);
      }, 1000);
    });
  });

  mock.onPost(`${API}/polls/111/vote`).reply(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([200, {
          votes:mockVotesList,
          question:{
            id_q: '111',
            text_q: 'Question question question question question 1',
            owner: true,
            ans: [
              {
                id_a: '112',
                text_a: 'Answer answer answer answer 1'
              },
              {
                id_a: '113',
                text_a: 'Answer answer answer answer 2'
              },
              {
                id_a: '114',
                text_a: 'Answer answer answer answer 3'
              }
            ],
            res_ans: '112'
          }
        }]);
      }, 1000);
    });
  });

  // mock.onDelete(`${API}/polls/111`).reply(() => {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve([200, mockQuestionsListAfterDelete]);
  //     }, 1000);
  //   });
  // });

  mock.onDelete(`${API}/polls/111`).reply(() => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject([500, { message: 'Internal Server Error' }]);
      }, 1000);
    });
  });

  mock.onPost(`${API}/polls`).reply(config => {
    // Парсим тело запроса
    const requestData = JSON.parse(config.data);
    console.log(requestData);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([200, [requestData,...mockQuestionsList]]);
      }, 1000);
    });
  });

  return axiosInstance;
};

export const setupMocksError = () => {
  const axiosInstance = axios.create({});
  const mock = new AxiosMockAdapter(axiosInstance);

  mock.onGet(`${API}/polls`).reply(() => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject([500, { message: 'Internal Server Error' }]);
      }, 1000);
    });
  });

  return axiosInstance;
};
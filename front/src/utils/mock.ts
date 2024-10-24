import { IQuestion, TVotes } from "../types/types";

export const mockQuestionsList: IQuestion[] = [
  {
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
    ]
  },
  {
    id_q: '211',
    text_q: 'Question question question question question question question question question question question question question question question 2',
    owner: false,
    ans: [
      {
        id_a: '212',
        text_a: 'Answer answer answer answer 1'
      },
      {
        id_a: '213',
        text_a: 'Answer answer answer answer answer answer answer answer answer answer 2'
      },
      {
        id_a: '214',
        text_a: 'Answer answer answer answer 3'
      },
      {
        id_a: '215',
        text_a: 'Answer answer answer answer 4'
      }
    ],
    res_ans: '213'
  },
  {
    id_q: '311',
    text_q: 'Question question question question question 3',
    owner: false,
    ans: [
      {
        id_a: '312',
        text_a: 'Answer answer answer answer 1'
      },
      {
        id_a: '313',
        text_a: 'Answer answer answer answer 2'
      },
      {
        id_a: '314',
        text_a: 'Answer answer answer answer 3'
      }
    ]
  }
];

export const mockVotesList: TVotes = {
  '112':12,
  '113':8,
  '114':5
}

export const mockQuestionsListAfterDelete: IQuestion[] = [
  {
    id_q: '211',
    text_q: 'Question question question question question question question question question question question question question question question 2',
    owner: false,
    ans: [
      {
        id_a: '212',
        text_a: 'Answer answer answer answer 1'
      },
      {
        id_a: '213',
        text_a: 'Answer answer answer answer answer answer answer answer answer answer 2'
      },
      {
        id_a: '214',
        text_a: 'Answer answer answer answer 3'
      },
      {
        id_a: '215',
        text_a: 'Answer answer answer answer 4'
      }
    ],
    res_ans: '213'
  },
  {
    id_q: '311',
    text_q: 'Question question question question question 3',
    owner: false,
    ans: [
      {
        id_a: '312',
        text_a: 'Answer answer answer answer 1'
      },
      {
        id_a: '313',
        text_a: 'Answer answer answer answer 2'
      },
      {
        id_a: '314',
        text_a: 'Answer answer answer answer 3'
      }
    ]
  }
];
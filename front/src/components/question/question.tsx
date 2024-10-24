import { FC, useState, useCallback, useEffect } from 'react';
import styles from "./question.module.css";
import { Line } from '../line/line';
import { ArrowIcon } from '../ui/icons/arrow-icon';
import { IQuestionProps, TId } from '../../types/types';
import { isAnswerCorrect, isQuestionAnswered } from '../../utils/helpers';
import { Check } from '../check/check';
import { Loader } from '../loader/loader';
import { DeleteIcon } from '../ui/icons/delete-icon';
import { mockVotesList } from '../../utils/mock';
import { useStore } from '../../services/hooks';
import { useDispatch } from '../../services/hooks';
import { postAnswer, deleteQuestion } from '../../services/actions/store';
import { TEXT_MESSAGE_DELETE_FAIL } from '../../utils/constants';

export const Question: FC<IQuestionProps> = ({ question }) => {

  const dispatch = useDispatch();

  const [show, setShow] = useState<boolean>(false);
  const [answered, setAnswered] = useState<TId | null>(isQuestionAnswered(question));

  const { questions, answerRequest, answerSuccess, answerFailed, ipUser, votes, chosen, deleteRequest, deleteSuccess, deleteFailed } = useStore(
    'questions',
    'answerRequest',
    'answerSuccess',
    'answerFailed',
    'deleteRequest',
    'deleteSuccess',
    'deleteFailed',
    'ipUser',
    'votes',
    'chosen'
  );

  const onExpandHandler = useCallback(() => {
    setShow(prev => !prev);
  }, [setShow]);

  const onAnswerClick = (id: TId) => {
    dispatch(postAnswer({
      id_q: question.id_q,
      id_a: id,
      ipUser: ipUser
    }));
  };

  const onDeleteClick = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    question.owner && dispatch(deleteQuestion(question.id_q));
  }

  useEffect(() => {
    //useEffect используем для изменения стилей после клика по одному из ответов.
    //Проверяем, что выполнен запрос на отправку выбранного ответа, и проверяем
    //ответ от сервера на случай если id выбранного ответа не совпадает с ответом
    //от сервера
    //Если всё ок, то отображаем выбранный ответ и количество голосов
    if (answerSuccess && chosen && question.ans.some(item => item.id_a === chosen)) {
      if (isAnswerCorrect(questions, question.id_q, chosen)) {
        setAnswered(isQuestionAnswered(question));
      } 
    }
  }, [questions]);

  return (
    <div className={`${styles.question} ${answered && styles.question_status_answered}`}>
      {/* Текст вопроса со стрелкой, символизирующей раскрывающийся список */}
      <div className={styles.question__text} onClick={onExpandHandler}>
        <Line
          firstComponent={<ArrowIcon extraClass={`${styles.arrow} ${!show && styles.arrow_status_inactive}`} />}
          secondComponent={<p className={`${styles.list__text} text text_type_main ${answered && 'text_weight_bold text_type_active'}`}>{question.text_q}</p>}
          thirdComponent={question.owner &&
            <div className={`${styles.question__third} text text_type_main`}>
              {deleteRequest ? <Loader extraClass={styles.loader__color} /> : <button className={styles.question__delete} onClick={onDeleteClick}><DeleteIcon /></button>}
            </div>}
        />
      </div>
      {/* Ответы */}
      {show && answered &&
        <p className={`${styles.question__votes} text text_type_medium`}>
          Votes
        </p>}
      <ul className={`${styles.list} ${show ? styles.question_expanded_open : styles.question_expanded_close}`}>
        {question.ans.map((item) => {
          return (
            <li className={styles.list__elem} key={item.id_a} onClick={() => { !answered && onAnswerClick(item.id_a) }}>
              <Line
                firstComponent={<Check isDone={answered === item.id_a} />}
                secondComponent={
                  <p className={`${styles.list__text} text text_type_medium ${answered === item.id_a && 'text_weight_bold text_type_active'}`}>
                    {item.text_a}
                  </p>}
                thirdComponent={show &&
                  <div className={`${styles.question__third} text text_type_main`}>
                    {chosen === item.id_a && answerRequest ? <Loader extraClass={styles.loader__color} /> : answered && votes[item.id_a] || '0'}
                  </div>}
              />
            </li>
          )
        })}
      </ul>
    </div>
  );
}


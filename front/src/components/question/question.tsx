import { FC, useState, useCallback, useEffect } from 'react';
import styles from "./question.module.css";
import { Line } from '../line/line';
import { ArrowIcon } from '../ui/icons/arrow-icon';
import { IQuestionProps, TId } from '../../types/types';
import { isAnswerCorrect, isQuestionAnswered } from '../../utils/helpers';
import { Loader } from '../loader/loader';
import { DeleteIcon } from '../ui/icons/delete-icon';
import { useStore } from '../../services/hooks';
import { useDispatch } from '../../services/hooks';
import { deleteQuestion, addAnswerIdsList, removeAnswerIdsList, clearChosen } from '../../services/actions/store';
import { Answer } from '../answer/answer';

export const Question: FC<IQuestionProps> = ({ question }) => {

  const dispatch = useDispatch();

  const [show, setShow] = useState<boolean>(false);
  const [answered, setAnswered] = useState<TId | null>(isQuestionAnswered(question));

  const { questions, answerSuccess, ipUser, chosen, deleteRequest } = useStore(
    'questions',
    'answerSuccess',
    'ipUser',
    'chosen',
    'deleteRequest'
  );

  const onExpandHandler = useCallback(() => {
    if (!show && answered) {
      dispatch(addAnswerIdsList(question.ans.map(item => item.id_a)));
    } else if (show && answered) {
      dispatch(removeAnswerIdsList(question.ans.map(item => item.id_a)));
    }
    setShow(prev => !prev);
  }, [setShow, answered, dispatch, question.ans, show]);


  const onDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    question.owner && dispatch(deleteQuestion(question.id_q, ipUser));
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
        dispatch(clearChosen());
      }
    }
  }, [questions, answerSuccess, chosen, question, dispatch]);

  return (
    <div className={`${styles.question} ${answered && styles.question_status_answered}`}>
      {/* Текст вопроса со стрелкой, символизирующей раскрывающийся список */}
      <div className={styles.question__text} onClick={onExpandHandler}>
        <Line
          firstComponent={<ArrowIcon extraClass={`${styles.arrow} ${!show && styles.arrow_status_inactive}`} />}
          secondComponent={<p className={`${styles.list__text} text text_type_main text_weight_bold ${answered && 'text_type_active'}`}>{question.text_q}</p>}
          thirdComponent={question.owner &&
            <div className={`${styles.question__third} text text_type_main`}>
              {deleteRequest ? chosen === question.id_q && <Loader extraClass={styles.loader__color} /> : <button className={styles.question__delete} onClick={onDeleteClick}><DeleteIcon /></button>}
            </div>}
        />
      </div>
      {/* Ответы */}
      {show && answered &&
        <p className={`${styles.question__votes} text text_type_medium`}>
          Голосов
        </p>}
      {question && question.ans && <ul className={`${styles.list} ${show ? styles.question_expanded_open : styles.question_expanded_close}`}>
        {question.ans.map((item) => {
          return (
            <Answer answered={answered} data={item} question={question}/>
          )
        })}
      </ul>}
    </div>
  );
}


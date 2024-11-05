import { FC, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import styles from "./question.module.css";
import { Line } from '../line/line';
import { ArrowIcon } from '../ui/icons/arrow-icon';
import { IQuestionProps, TId, TVotes } from '../../types/types';
import { filterVotesByAns, isAnswerCorrect, isQuestionAnswered } from '../../utils/helpers';
import { Check } from '../check/check';
import { Loader } from '../loader/loader';
import { DeleteIcon } from '../ui/icons/delete-icon';
import { useStore } from '../../services/hooks';
import { useDispatch } from '../../services/hooks';
import { postAnswer, deleteQuestion, addAnswerIdsList, removeAnswerIdsList, clearChosen, clearHighlight } from '../../services/actions/store';

export const Question: FC<IQuestionProps> = ({ question }) => {

  const dispatch = useDispatch();

  const [show, setShow] = useState<boolean>(false);
  const [answered, setAnswered] = useState<TId | null>(isQuestionAnswered(question));
  const [highlight, setHighlight] = useState<TId | null>(null);

  const { questions, answerRequest, answerSuccess, ipUser, votes, chosen, deleteRequest, hightLightAnswerVote } = useStore(
    'questions',
    'answerRequest',
    'answerSuccess',
    'deleteRequest',
    'ipUser',
    'votes',
    'chosen',
    'hightLightAnswerVote'
  );

  //мемоизируем объект с голосами
  const memoizedVotes = useMemo(() => {
    console.log(votes);
    return filterVotesByAns(question.ans, votes);
  }, [question.ans, votes, answerSuccess]);

  // Сохраним предыдущие голоса для сравнения
  const prevVotesRef = useRef(memoizedVotes);

  //таймер - для стилизации изменяющегося количества голосов
  useEffect(() => {
    // Определяем id ответов, количество голосов которых изменилось
    const changedVotes = hightLightAnswerVote.filter(id =>
      prevVotesRef.current[id] !== memoizedVotes[id]
    );
  
    if (changedVotes.length > 0) {
      changedVotes.forEach(id => {
        setHighlight(id);
  
        const timer = setTimeout(() => {
          setHighlight(null);
          dispatch(clearHighlight());
        }, 300);
  
        return () => clearTimeout(timer);
      });
    }
  
    prevVotesRef.current = memoizedVotes;
  }, [hightLightAnswerVote, memoizedVotes, dispatch]);

  const onExpandHandler = useCallback(() => {
    if (!show && answered) {
      dispatch(addAnswerIdsList(question.ans.map(item => item.id_a)));
    } else if (show && answered) {
      dispatch(removeAnswerIdsList(question.ans.map(item => item.id_a)));
    }
    setShow(prev => !prev);
  }, [setShow, answered, dispatch, question.ans, show]);

  const onAnswerClick = (id: TId) => {
    dispatch(postAnswer({
      id_q: question.id_q,
      id_a: id,
      ipUser: ipUser
    }));
    dispatch(addAnswerIdsList(question.ans.map(item => item.id_a)));
  };

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
            <li className={styles.list__elem} key={item.id_a} onClick={() => { !answered && onAnswerClick(item.id_a) }}>
              <Line
                firstComponent={<Check isDone={answered === item.id_a} />}
                secondComponent={
                  <p className={`${styles.list__text} text text_type_medium ${answered === item.id_a && 'text_weight_bold text_type_active'}`}>
                    {item.text_a}
                  </p>}
                thirdComponent={show &&
                  <div className={`${styles.question__third} ${highlight === item.id_a && styles.question__vote_highlight} text text_type_main`}>
                    {chosen === item.id_a && answerRequest ? <Loader extraClass={styles.loader__color} /> : answered && (memoizedVotes[item.id_a] || 0)}
                  </div>}
              />
            </li>
          )
        })}
      </ul>}
    </div>
  );
}


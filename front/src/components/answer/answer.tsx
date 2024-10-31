import { FC, useState, useEffect, useMemo, useRef } from 'react';
import styles from './answer.module.css';
import { Line } from '../line/line';
import { Check } from '../check/check';
import { useDispatch, useStore } from '../../services/hooks';
import { TAnswerProps, TId } from '../../types/types';
import { clearHighlight,postAnswer,addAnswerIdsList } from '../../services/actions/store';
import { Loader } from '../loader/loader';

export const Answer: FC<TAnswerProps> = ({ answered, data, question }) => {

  const dispatch = useDispatch();

  const { ipUser, chosen, votes, highlightAnswerVote, answerRequest } = useStore(
    'ipUser',
    'chosen',
    'votes',
    'highlightAnswerVote',
    'answerRequest'
  );

  //состояние определяющее надо ли подсветить изменившееся количество голосов
  const [highlight, setHighlight] = useState<boolean>(false);

  //мемоизируем количество голосов
  const memoizedVote = useMemo(() => {
    return votes[data.id_a] !== undefined ? votes[data.id_a] : 0;
  }, [data.id_a, votes]);

  // Сохраним предыдущие голоса для сравнения
  const prevVotesRef = useRef(memoizedVote);

  //таймер - для стилизации изменяющегося количества голосов
  useEffect(() => {

    if (highlightAnswerVote.includes(data.id_a) && prevVotesRef.current !== memoizedVote) {
      setHighlight(true);
      const timer = setTimeout(() => {
        setHighlight(false);
        dispatch(clearHighlight());
      }, 300);

      return () => clearTimeout(timer);
    }

    prevVotesRef.current = memoizedVote;
  }, [highlightAnswerVote, memoizedVote, dispatch, data.id_a]);

  const onAnswerClick = (id: TId) => {
    dispatch(postAnswer({
      id_q: question.id_q,
      id_a: id,
      ipUser: ipUser
    }));
    dispatch(addAnswerIdsList(question.ans.map(item => item.id_a)));
  };

  return (
    <li className={styles.answer} key={data.id_a} onClick={() => { !answered && onAnswerClick(data.id_a) }}>
      <Line
        firstComponent={<Check isDone={answered === data.id_a} />}
        secondComponent={
          <p className={`${styles.answer__text} text text_type_medium ${answered === data.id_a && 'text_weight_bold text_type_active'}`}>
            {data.text_a}
          </p>}
        thirdComponent={
          <div className={`${styles.line__third} ${highlight && styles.answer__vote_highlight} text text_type_main`}>
            {chosen === data.id_a && answerRequest ? <Loader extraClass={styles.loader__color} /> : answered && (memoizedVote)}
          </div>}
      />
    </li>
  )
}
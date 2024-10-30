import React from 'react';
import { FC, useEffect } from 'react';
import styles from "./app.module.css";
import { Main } from '../main/main';
import { useDispatch } from '../../services/hooks';
import { clearMessage, getQuestionsAndIp, getVotes } from '../../services/actions/store';
import { useStore } from '../../services/hooks';
import Modal from '../modal/modal';

export const App: FC = () => {

  //message - текст для уведомлений об успешно выполненных операциях или ошибках
  //его отправляем в выплывающее модальное окно
  //answerIds - массив из id ответов, для которых каждые 5 секунд будет
  //запрашиваться количество голосов для отображения в режиме
  //реального времени
  const { message, answerIds } = useStore('message', 'answerIds');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getQuestionsAndIp());
  }, [dispatch]);

  useEffect(() => {
    const intervalId = setInterval(()=>{answerIds.length > 0 && dispatch(getVotes(answerIds))}, 5000);

    return () => clearInterval(intervalId);
  }, [answerIds]);

  return (
    <div className={styles.app}>
      <header className={`text text_type_header`}>
        <h1 className={styles.title}>sBoard test</h1>
      </header>
      <Main />
      {/* {message.text.length > 0 && <Modal content={message} clearCallback={() => { dispatch(clearMessage()) }} />} */}
    </div>
  );
}


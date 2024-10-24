import React from 'react';
import { FC, useEffect } from 'react';
import styles from "./app.module.css";
import { Main } from '../main/main';
import { useDispatch } from '../../services/hooks';
import { clearMessage, getIpUser, getQuestions } from '../../services/actions/store';
import { useStore } from '../../services/hooks';
import Modal from '../modal/modal';

export const App:FC = () => {

  const dispatch = useDispatch();

  const { message } = useStore('message');
  
  //при запуске приложения делаются два запроса:
  //получение списка вопросов
  //и определение ip пользователя (альтернатива авторизации)
  useEffect(
    () => {
      dispatch(getQuestions());
      dispatch(getIpUser());
    },
    [dispatch]
  );

  return (
    <div className={styles.app}>
      <header className={`text text_type_header`}>
        <h1 className={styles.title}>SBoard test</h1>
      </header>
      <Main/>
      {message.text.length > 0 && <Modal content={message} clearCallback={()=>{dispatch(clearMessage())}}/>}
    </div>
  );
}


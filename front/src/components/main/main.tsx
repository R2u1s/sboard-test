import { FC, useMemo, useState, useEffect,useCallback } from 'react';
import styles from "./main.module.css";
import { Question } from '../question/question';
import { Tabs } from 'antd';
import { Create } from '../create/create';
import { Loader } from '../loader/loader';
import { useStore } from '../../services/hooks';
import { IQuestion } from '../../types/types';

export const Main: FC = () => {

  const { questions, questionsRequest, questionsSuccess, questionsFailed } = useStore(
    'questions',
    'questionsRequest',
    'questionsSuccess',
    'questionsFailed'
  );

  /* Реализация подсчета высоты экрана, чтобы рассчитать сколько влезет элементов списка */
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /* ----------------------------------------------------------------------------------- */

  /* Реализация рендера по скроллу. 250 это высота блока над списком, 52 высота элемента списка */
  const [qtyToShow, setQtyToShow] = useState<number>(Math.max(12, Math.floor((windowHeight - 250) / 52)));

  const handleScroll = useCallback((event: Event) => {
    const target = event.target as Document;
    const documentElement = target.documentElement;

    if (documentElement) {
      const { scrollTop, clientHeight, scrollHeight } = documentElement;

      if (scrollHeight - scrollTop > clientHeight - 1 && scrollHeight - scrollTop < clientHeight + 1) {
        questions.length > qtyToShow && setQtyToShow(prev => prev + 10);
      }
    }
  },[qtyToShow,questions.length]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [questions, qtyToShow,handleScroll]);
  /* ----------------------------------------------------------------------------------- */

  // Мемоизируем список вопросов
  const memoizedQuestions = useMemo(() => {

    if (questionsRequest || !questionsSuccess) {
      return null;
    }
    return questions && questions.length > 0 ? questions.map((item: IQuestion, index) => (
      index < qtyToShow && <li className={styles.list__elem} key={item.id_q}>
        <Question question={item} />
      </li>
    )) : 'Не удалось найти вопросы';
  }, [questions, questionsRequest, questionsSuccess,qtyToShow]);

  return (
    <main className={styles.content}>
      <Tabs
        defaultActiveKey="1"
        centered
        items={[
          {
            key: '1',
            label: 'Вопросы',
            children:
              questionsRequest ?
                <Loader extraClass={styles.loader__color} /> :
                questionsSuccess ?
                  <ul className={styles.list}>
                    {memoizedQuestions}
                  </ul> :
                  questionsFailed && 'Ошибка соединения с сервером'
          },
          {
            key: '2',
            label: 'Создать',
            children: <Create />,
          },
        ]} />
    </main>
  );
}


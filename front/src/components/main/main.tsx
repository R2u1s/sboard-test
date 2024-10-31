import { FC, useMemo, useEffect, useRef, useState } from 'react';
import styles from "./main.module.css";
import { Question } from '../question/question';
import { Tabs } from 'antd';
import { Create } from '../create/create';
import { Loader } from '../loader/loader';
import { useStore } from '../../services/hooks';
import { IQuestion } from '../../types/types';
import { useDispatch } from '../../services/hooks';
import { getQuestionsAndIp } from '../../services/actions/store';
import { OFFSET } from '../../utils/constants';

export const Main: FC = () => {

  const dispatch = useDispatch();

  const { questions, total, questionsRequest, questionsSuccess, questionsFailed } = useStore(
    'questions',
    'total',
    'questionsRequest',
    'questionsSuccess',
    'questionsFailed'
  );

  //реализация подгрузки списка вопросов по скроллу
  const [page, setPage] = useState<number>(0);

  const loaderRef = useRef(null);

  useEffect(() => {
    const currentObserverTarget = loaderRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && total > page * OFFSET) {
          setPage(prev => prev + 1);
          dispatch(getQuestionsAndIp(page + 1, OFFSET));
        }
      },
      { threshold: 1.0 }
    );

    if (currentObserverTarget) {
      observer.observe(currentObserverTarget);
    }

    return () => {
      if (currentObserverTarget) {
        observer.unobserve(currentObserverTarget);
      }
    };
  }, [dispatch, questions, page, total]);
  //////////////////////////////////////////////////

  // Мемоизируем список вопросов
  const memoizedQuestions = useMemo(() => {

    return questions && questions.length > 0 ? questions.map((item: IQuestion) => (
      <li className={styles.list__elem} key={item.id_q}>
        <Question question={item} />
      </li>
    )) : 'Не удалось найти вопросы';
  }, [questions]);

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
              questionsRequest && questions.length === 0 ?
                <Loader extraClass={styles.loader__color} /> :
                questionsSuccess || questions.length > 0 ?
                  <>
                    <ul className={styles.list}>
                      {memoizedQuestions}
                    </ul>
                    {questionsRequest && questions.length > 0 ?
                      <Loader extraClass={styles.loader__color} /> :
                      <div ref={loaderRef} style={{ height: '20px' }} />
                    }
                  </>
                  :
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


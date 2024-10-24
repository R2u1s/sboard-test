import { FC, useEffect } from 'react';
import styles from "./main.module.css";
import { mockQuestionsList } from '../../utils/mock';
import { Question } from '../question/question';
import { Tabs } from 'antd';
import { Create } from '../create/create';
import { Loader } from '../loader/loader';
import { getUserIp } from '../../utils/utils';
import { useStore } from '../../services/hooks';
import { IQuestion } from '../../types/types';

export const Main: FC = () => {

  useEffect(() => {
    (async () => {
      try {
        const ip = await getUserIp();;
        console.log('Ваш IP-адрес:', ip);
      } catch (error) {
        console.error('Не удалось получить IP-адрес:', error);
      }
    })();
  }, []);

  const { questions, questionsRequest, questionsSuccess, questionsFailed } = useStore(
    'questions',
    'questionsRequest',
    'questionsSuccess',
    'questionsFailed'
  );
  
  return (
    <main className={styles.content}>
      <Tabs
        defaultActiveKey="1"
        centered
        items={[
          {
            key: '1',
            label: 'Опросы',
            children:
              questionsRequest ? <Loader extraClass={styles.loader__color} /> :
                questionsSuccess ?
                  <ul className={styles.list}>
                    {questions.map((item:IQuestion) => {
                      return (
                        <li className={styles.list__elem} key={item.id_q}>
                          <Question question={item} />
                        </li>
                      )
                    })}
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


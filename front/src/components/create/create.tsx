import { FC, FormEvent } from 'react';
import styles from "./create.module.css";
import { Input } from '../ui/input/input';
import { AddIcon } from '../ui/icons/add-icon';
import { useForm } from '../../hooks/useForm';
import { TCreateQuestionBody, TInputValues } from '../../types/types';
import { INPUT_QUESTION_NAME, TEXT_BUTTON_DEFAULT } from '../../utils/constants';
import { INPUT_ANSWER_NAME } from '../../utils/constants';
import { checkQuestionAnswersNotEmpty, extractAnswers, transformArrayToObject } from '../../utils/helpers';
import { Loader } from '../loader/loader';
import { useStore } from '../../services/hooks';
import { useDispatch } from '../../services/hooks';
import { postQuestion } from '../../services/actions/store';

const defaultInputs = [
  {
    name: `${INPUT_QUESTION_NAME}`,
    text: ''
  },
  {
    name: `${INPUT_ANSWER_NAME}1`,
    text: ''
  },
  {
    name: `${INPUT_ANSWER_NAME}2`,
    text: ''
  }
]

//Логика кнопки создания вопроса:
//Кнопка доступна, если введен текст вопроса и двух ответов
//После нажатия на кнопку, текст меняется на крутящийся лоадер и, в случае успеха, 
//отображается сообщение об успешном создании вопроса и очищаются инпуты
//Далее, если пользователь начинает вводить что-то новое, то текст кнопки меняется
//дефолтный
//Если не удалось создать вопрос, то инпуты не очищаются и текст кнопки меняется
//на сообщение о том, что надо ещё раз попробовать и кнопка позволяет нажатие

export const Create: FC = () => {

  const dispatch = useDispatch();
  
  const { createRequest,ipUser } = useStore(
    'createRequest',
    'ipUser'
  );

  const { values, handleChange, setValues } = useForm({
    ...transformArrayToObject(defaultInputs)
  });

  const clearInputs = () => {
    setValues(transformArrayToObject(defaultInputs));
  };

  const addHandler = () => {
    const newAnswerName = `${INPUT_ANSWER_NAME}${Object.keys(values).length}`;
    setValues((prev: TInputValues): TInputValues => ({
      ...prev,
      [newAnswerName]: ''
    }));
  }

  const createQuestion = () => {
    const objQuestion:TCreateQuestionBody = {
      text_q:values[INPUT_QUESTION_NAME],
      ans:extractAnswers(values).reverse(),
      ip:ipUser
    }
    dispatch(postQuestion(objQuestion,clearInputs));
  }

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createQuestion();
  }

  return (
    <div className={styles.create__content}>
      <form className={styles.create__form} onSubmit={submitHandler}>
        <ul className={styles.create__list}>
          {Object.keys(values).map((item, index) => {
            return (
              <li className={styles.create__flex} key={index}>
                <Input
                  placeholder={item === INPUT_QUESTION_NAME ? 'Введите текст вопроса' : `Введите текст ${index}-го ответа`}
                  extraClass={item === INPUT_QUESTION_NAME ? styles.create__question : styles.create__answer}
                  onChange={e => {
                    handleChange(e)
                  }}
                  value={values[item]}
                  name={item}
                />
                {/* Кнопка добавления показана только для последнего вопроса */}
                {index === Object.keys(values).length - 1 && <button className={`${styles['create__add-button']}`} type='button' onClick={addHandler}>
                  <AddIcon />
                </button>}
              </li>
            )
          })}
        </ul>
        {checkQuestionAnswersNotEmpty(values) &&
          <button className={`${styles['create__create-button']}`} type='submit'>
            {createRequest ? <Loader extraClass={styles.loader__color} /> : <span className='text text_type_main text_type_active text_weight_bold'>
              {TEXT_BUTTON_DEFAULT}
            </span>}
          </button>}
      </form>
    </div>
  );
}


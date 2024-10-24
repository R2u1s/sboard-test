import { FC, useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './modal.module.css';
import { TMessage } from '../../types/types';

type TModal = { 
  content: TMessage, 
  clearCallback: () => void 
}

const modalRoot = document.getElementById("modal");

const Modal: FC<TModal> = ({ content, clearCallback }) => {

  const [visible, setVisible] = useState(false);
  const [moveUp, setMoveUp] = useState(false);

  useEffect(() => {
    // Сначала скрываем уведомление
    setVisible(false);
    setMoveUp(false);

    // Выдвигаем окно
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 0);

    // Убираем уведомление через 3 секунды после появления
    const hideTimer = setTimeout(() => {
      setMoveUp(true);
      // Скрываем уведомление после завершения анимации
      setTimeout(() => {
        setVisible(false);
        setMoveUp(false);
        clearCallback();
      }, 500);
    }, 3500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    }; // Очищаем таймеры при размонтировании
  }, []);

  return ReactDOM.createPortal(
    (
      <div className={`
      ${styles.modal__container} ${visible ? styles.modal__container_move_down : ''} ${moveUp ? styles.modal__container_move_up : ''}
      ${content.positive ? styles.modal__container_positivity_true : styles.modal__container_positivity_false} 
      text text_type_message
      `}>
        {content.text}
      </div>
    ), modalRoot!
  );
}

export default Modal;
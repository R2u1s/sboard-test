import { FC } from 'react';
import styles from "./check.module.css";
import { CheckIcon } from '../ui/icons/check-icon';
import { ICheckProps } from '../../types/types';

export const Check: FC<ICheckProps> = ({ isDone }) => {

  return (
    <div className={styles.check}>
      <div className={`${styles.circle} ${isDone ? styles.check_status_done : ""}`}>
        {isDone ? <CheckIcon /> : null}
      </div>
    </div>
  );
}


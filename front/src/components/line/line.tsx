import styles from "./line.module.css";
import { LineWrapperProps } from "../../types/types";

//компонент Line - строка, в которой размещаются три передаваемых компонента 

export const Line: React.FC<LineWrapperProps> = ({
  firstComponent,
  secondComponent,
  thirdComponent,
  extraClass = "",
}) => {
  return (
    <div className={`${styles.line} ${extraClass}`}>
      <div className={styles.line__last}>{firstComponent}</div>
      <div className={styles.line__center}>{secondComponent}</div>
      {thirdComponent && <div className={styles.line__last}>{thirdComponent}</div>}
    </div>
  );
};


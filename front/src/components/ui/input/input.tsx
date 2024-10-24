import React from "react";
import styles from "./input.module.css";

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  placeholder?: string;
  extraClass?: string;
  onChange?(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const Input: React.FC<InputProps> = ({
  placeholder = "Введите текст",
  extraClass = "",
  ...rest
}) => {

  return (
    <div className={`${styles.content}`}>
      <input
        className={`${styles.input} ${extraClass}`}
        placeholder={placeholder}
        type={"text"}
        {...rest}
      />
    </div>
  );
};

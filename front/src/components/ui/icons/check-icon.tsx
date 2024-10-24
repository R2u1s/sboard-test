import React from "react";

interface Props {
  fill?: string;
  extraClass?: string;
  size?: number; // Добавляем пропс для указания размера
}

export const CheckIcon: React.FC<Props> = ({ fill = "currentColor", extraClass = "", size = 1 }) => {
  return (
    <svg
      width={24*size} // Используем пропс size
      height={24*size} // Используем пропс size
      viewBox="0 0 24 24"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      className={extraClass} // Применяем дополнительный класс
    >
      <path
        d="M5 13l4 4L19 7"
        stroke="#0058af"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill}
      />
    </svg>
  );
};
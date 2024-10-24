import React from "react";

interface Props {
  fill?: string;
  extraClass?: string;
}

export const AddIcon: React.FC<Props> = ({ fill = "currentColor", extraClass = "" }) => {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 -960 960 960"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      className={extraClass}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
        fill={fill}
      />
    </svg>
  );
};

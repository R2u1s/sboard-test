import React from 'react';
import styles from './loader.module.css';

type TLoaderProps = {
  extraClass?: string;
}

export const Loader: React.FC<TLoaderProps> = ({
  extraClass = ""
}) => {
  return (
    <div className={`${styles.loader} ${extraClass} ${styles.active}`}>
      <svg width="32" height="32" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
        <g fill="none" fillRule="evenodd">
          <g transform="translate(2 2)" strokeWidth="4">
            <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
            <path d="M36 18c0-9.94-8.06-18-18-18">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="1s"
                repeatCount="indefinite" />
            </path>
          </g>
        </g>
      </svg>
    </div>
  )
}
import { type FC } from "react";

export const PieChart: FC = () => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="25" cy="25" r="18.75" stroke="#1AACFF" strokeWidth="4.16667" />
    <path
      d="M25 25H43.75"
      stroke="#1AACFF"
      strokeWidth="4.16667"
      strokeLinecap="round"
    />
    <path
      d="M25 6.25V24.8706C25 24.9534 25.0329 25.0329 25.0915 25.0915L37.5 37.5"
      stroke="#1AACFF"
      strokeWidth="4.16667"
      strokeLinecap="round"
    />
  </svg>
);

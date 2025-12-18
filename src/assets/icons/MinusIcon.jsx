import React from "react";

const MinusIcon = ({ size = "1em", color = "currentColor", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke={color}
    fill="none"
    {...props}
  >
    <path d="M6,12 L18,12" strokeWidth="2" />
  </svg>
);

export default MinusIcon;

import React from "react";

const PlusIcon = ({ size = "1em", color = "currentColor", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke={color}
    fill="none"
    {...props}
  >
    <path d="M12,18 L12,6 M6,12 L18,12" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default PlusIcon;

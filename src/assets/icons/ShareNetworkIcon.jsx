import React from "react";

const ShareNetworkIcon = (props) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    className="icon-lg"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="128"
      cy="256"
      r="48"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
    />
    <circle
      cx="384"
      cy="112"
      r="48"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
    />
    <circle
      cx="384"
      cy="400"
      r="48"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
    />
    <path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
      d="M169.83 279.53l172.34 96.94m0-240.94l-172.34 96.94"
    />
  </svg>
);

export default ShareNetworkIcon;

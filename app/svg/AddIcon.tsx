import * as React from "react";
const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} fill="none">
    <circle cx={20} cy={20} r={20} fill="url(#a)" />
    <path
      fill="#fff"
      d="M21.673 25.714v-4.167h4.062v-3.073h-4.062v-4.188H18.39v4.188h-4.104v3.073h4.104v4.167h3.283Z"
    />
    <defs>
      <radialGradient
        id="a"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="rotate(129.411 21.762 7.743) scale(66.7263)"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E84D70" />
        <stop offset={0.531} stopColor="#A337F6" />
        <stop offset={1} stopColor="#28A7ED" />
      </radialGradient>
    </defs>
  </svg>
);
export default AddIcon;

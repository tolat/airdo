import React from "react";
import "../styles/BasicButton.scss";

function BasicButton({ children, theme = "light" }) {
  // Dynamically set the class based on the `theme` prop
  const buttonClass = `basic-button ${theme === "dark" ? "dark" : "light"}`;

  return <button className={buttonClass}>{children}</button>;
}

export default BasicButton;

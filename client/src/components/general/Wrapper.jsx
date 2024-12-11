import React from "react";
import "../styles/Wrapper.scss";
import Sidebar from "./Sidebar";

function Wrapper({ children }) {
  return (
    <div className="wrapper">
      <Sidebar />
      {children}
    </div>
  );
}

export default Wrapper;

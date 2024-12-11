import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.scss";
import BasicButton from "./BasicButton";
import Logo from "../../assets/react.svg";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src={Logo} alt="React Logo" />
      </div>
      <nav>
        <Link to="/dashboard">
          <BasicButton>Dashboard</BasicButton>
        </Link>
        <Link to="/pipelines">
          <BasicButton>Pipelines</BasicButton>
        </Link>
        <Link to="/database">
          <BasicButton>Database</BasicButton>
        </Link>
        <Link to="/tools">
          <BasicButton>Tools</BasicButton>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;

import React from "react";
import "./Button.css";
import { Link } from "react-router-dom";

export const Button = ({ title, page }) => {
  return (
    <div className="btn">
      <Link to={page}>
        <button>{title}</button>
      </Link>
    </div>
  );
};

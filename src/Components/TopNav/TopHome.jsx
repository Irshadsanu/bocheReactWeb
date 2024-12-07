import React from "react";
import "./TopNav.css";

const TopHome = ({ head }) => {
  return (
    <div>
      <div className="topnav">
        <h5>{head}</h5>
      </div>
    </div>
  );
};

export default TopHome;

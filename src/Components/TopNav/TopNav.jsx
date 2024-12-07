import React from "react";
import "./TopNav.css";
import { FaAngleLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useCount } from "../../Context/Context";

export const TopNav = ({ title }) => {
  const navigate = useNavigate();
  const {setReady}=useCount();


  const handleGoBack = () => {
    // window.history.back();
    setReady(false)
    navigate("/home");
    
  };
  return (
    <div className="topnav">
      <div className="back-arrow" onClick={handleGoBack}>
        <FaAngleLeft />
      </div>
      <h5>{title}</h5>
    </div>
  );
};

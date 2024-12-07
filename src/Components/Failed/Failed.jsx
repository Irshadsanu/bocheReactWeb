import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Failed.css";
import Failed_pay from "../Assets/gif/payment faild 1.gif";

const Failed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const navigateTimeout = setTimeout(() => {
      window.history.pushState({ preventBack: true }, '', '');
      navigate("/home" , { state: { preventBack: true }});
    }, 3000);

    return () => clearTimeout(navigateTimeout);
  }, [navigate]);

  return (
    <div className="failed">
      <div className="failed-gif">
        <img src={Failed_pay} alt="Payment Failed" />
      </div> 
    </div>
  );
};

export default Failed;

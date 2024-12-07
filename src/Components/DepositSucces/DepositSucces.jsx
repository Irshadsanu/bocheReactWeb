import React, { useEffect } from "react";
import "./DepositSucces.css";
import Success_gif from "../Assets/gif/payment succesful png.gif";
import { useNavigate } from "react-router-dom";

export const DepositSucces = () => {
  const navigator = useNavigate();
  useEffect(() => {
    const navigateTimeout = setTimeout(() => {
      window.history.pushState({ preventBack: true }, '', '');
      navigator("/wallet", { state: { preventBack: true } });
    }, 3000);

    return () => clearTimeout(navigateTimeout);
  }, [navigator]);
  return (
    <div className="depositsucces">
      <div className="img-gif">
        <img src={Success_gif} alt="" />
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import "./WithdrawDetails.css";

const TdsAlert = ({ onCancel, onContinue, tdsToPay, widthrawAmount }) => {
  // const net_amount =

  const [totalTds, setTotalTds] = useState();
  let balance_without_tds;

  useEffect(() => {
    balance_without_tds = widthrawAmount - tdsToPay;
    console.log(balance_without_tds, "heloooo");
    setTotalTds(balance_without_tds);
  }, [tdsToPay]);

  return (
    <div className="tdscontainter">
      <div className="tds_box">
        <div className="text_wrap_alert">
          <p>
            Total withdraw amount :{" "}
            <span style={{ fontWeight: "600" }}>
              {" "}
              {widthrawAmount?.toFixed(2)}{" "}
            </span>{" "}
          </p>
          <p>
            Tds amount :{" "}
            <span style={{ color: "#f70000", fontWeight: "600" }}>
              {" "}
              - ₹{tdsToPay?.toFixed(2)}
            </span>
          </p>
          <p>
            Total :{" "}
            <span style={{ fontWeight: "600" }}>{totalTds?.toFixed(2)}</span>{" "}
          </p>
        </div>

        <div className="btn_container">
          <button onClick={onCancel} className="btn_1">
            cancel
          </button>
          <button onClick={onContinue} className="btn_2">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TdsAlert;

import React from "react";
import "./EarningTotal.css";

const EarningTotal = () => {
  return (
    <div className="earning-total">
      <div className="earning-amout">
        <h6>My Earnings</h6>
        <h5>₹20,230</h5>
      </div>
      <div className="single-amout">
        <div className="single-item">
          <div className="date-time">
            <p>19-04-2024</p>
            <p>10:45 AM</p>
          </div>
          <h4>₹40</h4>
        </div>
        <div className="single-item">
          <div className="date-time">
            <p>19-04-2024</p>
            <p>10:45 AM</p>
          </div>
          <h4>₹40</h4>
        </div>
        <div className="single-item">
          <div className="date-time">
            <p>19-04-2024</p>
            <p>10:45 AM</p>
          </div>
          <h4>₹40</h4>
        </div>
      </div>
    </div>
  );
};

export default EarningTotal;

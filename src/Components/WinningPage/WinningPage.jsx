import React from "react";
import "./WinningPage.css";

const WinningPage = () => {
  return (
    <div className="winningpage">
      <div className="wallet-box">
        <div className="winnin-b">Winning Wallet</div>
        <div className="deposit-b">Deposit Wallet</div>
      </div>
      <div className="earning-amout">
        <h6>Current Balance</h6>
        <h5>₹20,230</h5>
      </div>
      <h4>Last Transactions</h4>
      <div className="single-amout">
        <div className="single-item">
          <div className="date-time">
            <p>19-04-2024</p>
            <p>10:45 AM</p>
          </div>
          <div className="cash-details">
            <h4>+ ₹40</h4>
            <p>Deposit</p>
          </div>
        </div>
        <div className="single-item">
          <div className="date-time">
            <p>19-04-2024</p>
            <p>10:45 AM</p>
          </div>
          <div className="cash-details">
            <h4>+ ₹40</h4>
            <p>Deposit</p>
          </div>
        </div>
        <div className="single-item">
          <div className="date-time">
            <p>19-04-2024</p>
            <p>10:45 AM</p>
          </div>
          <div className="cash-draw">
            <h4>- ₹40</h4>
            <p>Withdraw</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinningPage;

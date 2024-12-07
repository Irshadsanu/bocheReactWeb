import React from "react";
import "./Alert.css";

const Logout = ({ onCancel, onConfirm }) => {
  return (
    <div className="logout">
      <div className="logout-box">
        <h6>Confirm logout</h6>
        <p>Are you sure you want to log out?</p>
        <div className="cancel-btn">
          <button className="cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="ok" onClick={onConfirm}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;

import React from "react";
import "./Alert.css";
const Exit = () => {
  return (
    <div>
      <div className="logout">
        <div className="logout-box">
          <h6>Confirm logout</h6>
          <p>Are you sure want to log out?</p>
          <div className="cancel-btn">
            <button className="cancel">Yes</button>
            <button className="ok">No</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exit;

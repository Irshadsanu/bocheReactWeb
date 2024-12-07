import React from "react";
import "../Alert/FilterAlert.css";

const FilterAlert = ({
  setShowFilterAlert,
  filter,
  handleFilterChange,
  handleFilter,
  
}) => {
  const handleClose = () => {
    handleIputClick("")
    setShowFilterAlert(false);
  };

  const handleApply = () => {

    handleFilter();
    setShowFilterAlert(false);
  };


  const handleIputClick = (value) => {
    handleFilterChange(value);
  }

  return (
    <div className="Filter_alert_container">
      <h6>Coupon</h6>
      <div className="chice_container">
        <div onClick={()=> handleIputClick("WON")} className="input_container">
          <label htmlFor="winning">Winning</label>
          <input
            id="winning"
            type="radio"
            value="WON"
            checked={filter === "WON"}
            onChange={() => handleFilterChange("WON")}
          />{" "}
        </div>
        <div onClick={ ()=> handleIputClick("NONE")} className="input_container">
          <label htmlFor="nonwinning">Non Winning</label>
          <input
            id="nonwinning"
            type="radio"
            value="NONE"
            checked={filter === "NONE"}
            onChange={() => handleFilterChange("NONE")}
          />{" "}
        </div>
        <div onClick={ ()=> handleIputClick("PENDING")} className="input_container">
          <label htmlFor="pending">Pending</label>
          <input
            id="pending"
            type="radio"
            value="PENDING"
            checked={filter === "PENDING"}
            onChange={() => handleFilterChange("PENDING")}
          />
        </div>
      </div>

      <div className="filter_btn_container">
        <button className="clrear" onClick={handleClose}>
          Clear
        </button>
        <button onClick={handleApply} className="apply">
          {" "}
          Apply{" "}
        </button>
      </div>
    </div>
  );
};

export default FilterAlert;

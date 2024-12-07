import React from "react";
import "./Donate.css";
import { Assets } from "../Assets/Assets";
import { MdOutlineVolunteerActivism } from "react-icons/md";

const Donate = () => {
  return (
    <div className="donate">
      <div className="donate-more">
        <div className="top-d">
          <img src={Assets.boche_donate} alt="" />
          <div className="top-content">
            <p>Would You Like to Donate More ?</p>
            <span>Boche charitable Trust</span>
          </div>
        </div>
        <button className="d-btn">
          <MdOutlineVolunteerActivism />
          Donate More
        </button>
      </div>
    </div>
  );
};

export default Donate;

import React from "react";
import "./Social.css";
import { Assets } from "../Assets/Assets";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { MdOutlineWifiTethering } from "react-icons/md";
import { TbAirConditioningDisabled } from "react-icons/tb";
import { Link } from "react-router-dom";

export const Social = () => {
  return (
    <div className="social">
      <h6>Boche Social Links</h6>
      <ul className="media">
        <li>
          <img src={Assets.Instagram} alt="" />
        </li>
        <li>
          <img src={Assets.Facebook} alt="" />
        </li>
        <li>
          <img src={Assets.Youtube} alt="" />
        </li>
        <li>
          <img src={Assets.Snapchat} alt="" />
        </li>
        <li>
          <img src={Assets.twitter} alt="" />
        </li>
      </ul>
      <ul className="condition">
        <Link to="/privacy" className="company-terms">
          <li>
            <MdOutlinePrivacyTip />
            Privacy Policy
          </li>
        </Link>
        <Link to="/terms" className="company-terms">
          <li>
            <TbAirConditioningDisabled />
            Terms and Condition
          </li>
        </Link>
        <Link to="/about" className="company-terms">
          <li>
            <MdOutlineWifiTethering />
            Contact Us
          </li>
        </Link>
      </ul>
    </div>
  );
};

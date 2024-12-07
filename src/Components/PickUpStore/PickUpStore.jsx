import React from "react";
import "./PickUpStore.css";
import { IoMdSearch } from "react-icons/io";
import { Assets } from "../Assets/Assets";

const PickUpStore = () => {
  return (
    <div className="pickupstore">
      <div className="from-store">
        <input type="radio" />
        <p>Pick Up From Store</p>
      </div>
      <div className="store-box">
        <h6>Our 50 Stores</h6>
        <form action="">
          <IoMdSearch />
          <input type="text" placeholder="Search Your Location" />
        </form>
        <div className="item-store">
          <img src={Assets.Locat} alt="" />
          <p>Eranakulam</p>
        </div>
        <div className="item-store">
          <img src={Assets.Locat} alt="" />
          <p>Thrissur</p>
        </div>
        <div className="item-store">
          <img src={Assets.Locat} alt="" />
          <p>Palakkad</p>
        </div>
        <div className="item-store">
          <img src={Assets.Locat} alt="" />
          <p>Kzhikoode</p>
        </div>
        <button className="btn-see">See More</button>
      </div>
      <div className="line">
        <h5>or</h5>
      </div>
      <div className="from-address">
        <input type="radio" />
        <p>Delivery to Your Address</p>
      </div>
    </div>
  );
};

export default PickUpStore;

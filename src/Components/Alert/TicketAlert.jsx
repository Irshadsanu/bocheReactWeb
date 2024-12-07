import React from "react";
import "./CouponAlert1.css";
import coupon_anm from "../Assets/gif/Animation - 1718280764199.json";
import Lottie from "react-lottie";
import { Link, useNavigate } from "react-router-dom";

const TicketAlert = ({ ticketQty, setShowCoupon }) => {
  const navigate = useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: coupon_anm,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleClick = () => {
    navigate("/coupen");
    console.log("Navigating to /coupen");
    // setShowCoupon(false);
  };

  return (
    <div className="ticket-redeem-box  boxx2">
      <div className="coupenbox boxxe">
        <h6>Redeemed</h6>
        <p style={{ fontSize: "14px" }}>{ticketQty} Lucky draw Tickets</p>

        <div className="btncoupe">
          <button onClick={handleClick} className="btncoupe-view">
            View tickets
          </button>
          <div className="lottie-app">
            <Lottie
              animationData={coupon_anm}
              className="lottie-animation"
              options={defaultOptions}
              height={150}
              width={150}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketAlert;

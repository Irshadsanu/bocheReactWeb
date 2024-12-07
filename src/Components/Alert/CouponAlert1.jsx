
import React, { useEffect, useState } from "react";
import "./CouponAlert1.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CouponAlert1 = ({
  setShowCouponAlert1,
  setShowCoupon,
  ticketQty,
  couponDocId,
  couponNumber,
}) => {
  const [showCheckBox, setShowCheckBox] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const cusName = localStorage.getItem("loginUserName");
  const cusPhone = localStorage.getItem("loginUserPhone");
  const cusID = localStorage.getItem("loginUserId");

  // const handleCheckboxChange = (event) => {
  //   setIsChecked(event.target.checked);
  // };

  const handleCancel = () => {
    // navigate("/home");
    setShowCouponAlert1(false);
  };

  useEffect(() => {
    if (ticketQty > 1) {
      setShowCheckBox(true);
    }
  }, [ticketQty]);

  const couponGenerateTickets = async (
    cusID,
    cusName,
    cusPhone,
    ticketQty,
    couponNumber,
    couponDocId
  ) => {
    console.log("couponGenerateTickets entered");

    const url = "https://bochemartrun-wyynhb4exq-uc.a.run.app/purchaseApi";
    const data = {
      prodId: couponNumber,
      mobNo: cusPhone,
      fName: cusName,
      qty: ticketQty,
      cusId: cusID,
      docId: couponDocId,
    };

    console.log(data, "conso;e daataaaaa");

    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          "api-key": "spine123AsdfASFVFD",
        },
      });

      if (response.status === 200) {
        console.log("Response:", response);
        return true;
      } else {
        console.error("Error:", response.status, response.data);
        return false;
      }
    } catch (error) {
      console.error("Request Error:", error);
      return false;
    }
  };

  const handleRedeemClick = async () => {
    const success = await couponGenerateTickets(
      cusID,
      cusName,
      cusPhone,
      ticketQty,
      couponNumber,
      couponDocId
    );

    if (success) {
      setShowCouponAlert1(false);
      setShowCoupon(true);
    }
  };

  return (
    <div>
      <div className="coupenbox alert1">
        <div className="coupenbox_text">
          <h6>
            Are you sure to Redeem <span>{ticketQty}</span> lucky draw tickets?
          </h6>
        </div>



        <div className="btncoupe">

          <button onClick={handleCancel} className="btncoupe-can">

            Cancel
          </button>
          <button className="btncoupe-red" onClick={handleRedeemClick}>
            Redeem
          </button>
        </div>
        {/* 
        {showCheckBox && (
          <p className='coupon_tems'>
            * if you don't need the MultiDraw, the whole lucky draw ticket will be added to the upcoming draw
          </p>
         )} */}
      </div>
    </div>
  );
};

export default CouponAlert1;

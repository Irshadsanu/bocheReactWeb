import React, { useState } from "react";
import "./SearchCoupen.css";
import TopnavWeb from "../TopNav/TopnavWeb";
import { Assets } from "../Assets/Assets";
import { firestore } from "../../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

export const SearchCoupen = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const cusId = localStorage.getItem("loginUserId");
  const cusName = localStorage.getItem("loginUserName");
  const cusPhone = localStorage.getItem("loginUserPhone");
  const ticketCount = 12;
  const [couponController, setCouponController] = useState(
    location.state?.coupenid
  );
  const ticketImages = [
    Assets.ticket,
    Assets.ticket,
    Assets.ticket,
    Assets.ticket,
    Assets.ticket,
    Assets.ticket,
    Assets.ticket,
    Assets.ticket,
    Assets.ticket,
    Assets.ticket,
    Assets.ticket,
    Assets.ticket,
  ];
  const generateCoupons = async () => {
    const id = couponController;
    const now = new Date();
    const lotDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // Add 3 days

    const map = {
      COUPON_NUMBER: couponController,
      USER_ID: cusId,
      TICKET_COUNT: ticketCount,
      USER_NAME: cusName,
      USER_PHONE: cusPhone,
      LOT_DATE: lotDate,
      VALIDITY: "ACTIVE",
      TICKET_DATE: now,
    };

    const ticketsMap = {};
    console.log("helooooooo");

    for (let i = 0; i < ticketCount; i++) {
      const ticketId = new Date().getTime().toString();

      const ticketMap = {
        TICKET_NUMBER: ticketId,
        USER_ID: cusId,
        LOT_DATE: lotDate,
        VALIDITY: "ACTIVE",
        WINNING_STATUS: "PENDING",
        TICKET_DATE: now,
      };

      ticketsMap[ticketId] = ticketMap;

      const couponTicketMap = {
        CUSTOMER_ID: cusId,
        CUSTOMER_NAME: cusName,
        CUSTOMER_PHONE: cusPhone,
        COUPON_ID: couponController,
        LOT_DATE: lotDate,
        VALIDITY: "ACTIVE",
        WINNING_STATUS: "PENDING",
        TICKET_DATE: now,
        TICKET_NUMBER: ticketId,
      };
      await setDoc(doc(firestore, "TICKETS", ticketId), couponTicketMap, {
        merge: true,
      });
    }

    map["TICKETS"] = ticketsMap;
    await setDoc(doc(firestore, "COUPONS", id), map, {
      merge: true,
    });
    navigator("/home", { state: { from: "coupen" } });
  };
  return (
    <div>
      <TopnavWeb />
      <div className="coupen-ticket">
        <ul className="single-ticket">
          {ticketImages.map((ticket, index) => (
            <li key={index}>
              <img src={ticket} alt={`Ticket ${index + 1}`} />
            </li>
          ))}
        </ul>
        <button onClick={generateCoupons}>Done</button>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { TopNav } from "../TopNav/TopNav";
import PaymentChoose from "../PaymentChoose/PaymentChoose";
import TopnavWeb from "../TopNav/TopnavWeb";
import Footer from "../../Pages/Footer/Footer";
import "./Payment.css";
import { Assets } from "../Assets/Assets";
import { useCount } from "../../Context/Context";
import { FiTruck } from "react-icons/fi";

const PaymentOption = () => {
  const { count, totalPrice } = useCount();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div>
      {isMobile ? <TopNav title="Delivery to Your Address" /> : <TopnavWeb />}
      <div className="payment-choose-web">
        <div className="payment-choose-boxx">
          <PaymentChoose />
        </div>
        <div className="payment-delivery-details">
          <div className="delivery-summery">
            <div className="delivery-summery-box">
              <div className="delivery-summery-top">
                <div className="tea-img-tea">
                  <img src={Assets.Tea} alt="" />
                </div>
                <div className="delivery-tea-details">
                  <p>boCHE TEA</p>
                  <p>100gm</p>
                  <h6>₹40.00</h6>
                  <p>
                    <FiTruck />
                    <span>Expected Delivery </span>
                  </p>
                  <h6>30th May 2024</h6>
                  <p>Quantity: {count}</p>
                </div>
              </div>
            </div>
            <div className="delivery-amount-summery">
              <div className="delivery-total">
                <p>Total </p>
                <p>₹{totalPrice}</p>
              </div>
              <div className="deliver-charges">
                <p>Delivery Charge</p>
                <p>₹0.00</p>
              </div>
              <div className="delivery-total-amount">
                <h6>Total Amount</h6>
                <h6>₹{totalPrice}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentOption;

import React, { useEffect, useState } from "react";
import "./PaymentChoose.css";
import { Assets } from "../Assets/Assets";
import { FaAngleRight } from "react-icons/fa6";
import { useCount } from "../../Context/Context";
import { useNavigate } from "react-router";
import { collection, doc, setDoc } from "firebase/firestore";
import { database, firestore } from "../../firebase";
import { useLocation } from "react-router-dom";
import useApiCallCcavenue from "../../Pages/Payment_Integration/ccAvanue";
import { off, onValue, ref } from "firebase/database";
import useApiCallICICI from "../../Pages/Payment_Integration/ICICPaymentIntegration";

const PaymentChoose = () => {
  const timestamp = Date.now().toString();
  const { totalPrice, count } = useCount();
  const id = Date.now().toString();
  const cusId = localStorage.getItem("loginUserId");
  const proId = localStorage.getItem("productId");
  const proImg = localStorage.getItem("productImages");
  const cusName = localStorage.getItem("loginUserName");
  const proQty = count;
  const proPrice = localStorage.getItem("productPrice");

  const selectedOption = "";
  const lastUsedDeliveryName = "";
  const lastUsedDeliveryAddress = "";
  const lastUsedDeliveryNumber = "";
  const orderPrice = count * proPrice;
  const refe = doc(collection(firestore, "ORDERS"), timestamp);
  const history = useNavigate();
  const location = useLocation();
  const paymentId = location.state?.PaymentId;
  const amounts = location.state?.Amounts;
  const phone = location.state?.Phone;

  const [lockCcAvanue, setLockCcAvanue] = useState("OFF");
  const [lockUpiIdent, setLockUpiIdent] = useState("OFF");
  const [lockGateWay, setLockGateWay] = useState("OFF");
  const [lockIciciPlus, setLockIciciPlus] = useState("OFF");

  useEffect(() => {
    // const rootRef = ref(database, "0/pgWebButtons");

    // Listen for changes and update state
    const ccAvanueListener = onValue(
      ref(database, "0/pgWebButtons/CCAvanue"),
      (snapshot) => {
        if (snapshot.exists()) {
          setLockCcAvanue(snapshot.val().toString());
        }
      }
    );

    const upiIntentListener = onValue(
      ref(database, "0/pgWebButtons/UpiIntent"),
      (snapshot) => {
        if (snapshot.exists()) {
          setLockUpiIdent(snapshot.val().toString());
        }
      }
    );

    const gateWayScreenListener = onValue(
      ref(database, "0/pgWebButtons/gateWayScreen"),
      (snapshot) => {
        if (snapshot.exists()) {
          setLockGateWay(snapshot.val().toString());
        }
      }
    );

    const iciciGateWayListener = onValue(
      ref(database, "0/pgWebButtons/iciciGateWay"),
      (snapshot) => {
        if (snapshot.exists()) {
          setLockIciciPlus(snapshot.val().toString());
        }
      }
    );

    // Clean up listeners when component unmounts
    return () => {
      off(ref(database, "0/pgWebButtons/CCAvanue"), "value", ccAvanueListener);
      off(
        ref(database, "0/pgWebButtons/UpiIntent"),
        "value",
        upiIntentListener
      );
      off(
        ref(database, "0/pgWebButtons/gateWayScreen"),
        "value",
        gateWayScreenListener
      );
      off(
        ref(database, "0/pgWebButtons/iciciGateWay"),
        "value",
        iciciGateWayListener
      );
    };
  }, []);

  console.log(paymentId, amounts, phone, "hhhhhhhhhhhhhhhhhhhiii");

  const [data, setData] = useState({
    ORDER_ID: timestamp,
    PRODUCT_NAME: "irshad",
    PRODUCT_PRICE: "40",
    ORDER_PRICE: totalPrice,
    PRODUCT_QUANTITY: count,
  });

  const handlePaymentOptionClick = async (e) => {
    e.preventDefault();
    try {
      await setDoc(refe, data);
      setData({
        name: "monu",
        gk: "1",
        place: "kkv",
      });
    } catch (error) {
      console.error("Error adding user details: ", error);
    }
    history("/succes");
  };

  const status = "SUCCESS";
  const app = "G-PAY";
  //   const amount = 40;

  const upiPayment = async () => {
    const paymentMap = {
      ORDER_ID: id,
      COSTUMER_ID: cusId,
      PRODUCT_ID: proId,
      COSTUMER_NAME: cusName,
      ORDER_DATE: new Date(),
      PAYMENT_STATUS: status,
      AMOUNT: amounts,
    };

    try {
      await setDoc(doc(firestore, "WEB_ATTEMPTS", id), paymentMap, {
        merge: true,
      });
      console.log("Attempt added successfully with merge!");
    } catch (error) {
      console.error("Error adding attempt: ", error);
    }

    if (status === "SUCCESS") {
      await addOrders();
      history("/succes");
      // alert("Order Confirmed")
    } else {
      alert("payment failed");
    }
  };

  const addOrders = async () => {
    const orderMap = {
      ORDER_ID: id,
      COSTUMER_ID: cusId,
      PRODUCT_ID: proId,
      COSTUMER_NAME: cusName,
      ORDER_DATE: new Date(),
      PRODUCT_IMAGE: [proImg],
      PRODUCT_QUANTITY: proQty,
      PRODUCT_PRICE: proPrice,
      ORDER_PRICE: orderPrice,
      STATUS: "CONFIRMED",
    };

    if (selectedOption !== "Pick Up From Store") {
      orderMap.DELIVERY_NAME = lastUsedDeliveryName;
      orderMap.DELIVERY_NUMBER = lastUsedDeliveryNumber;
      orderMap.DELIVERY_ADDRESS = lastUsedDeliveryAddress;
      orderMap.TYPE = "Home Delivery";
    } else {
      orderMap.TYPE = "Pick Up From Store";
    }

    const coupons = [];

    for (let i = 0; i < proQty; i++) {
      const couponId = Date.now().toString();

      const couponMap = {
        COUPON_ID: couponId,
        COSTUMER_ID: cusId,
        COSTUMER_NAME: cusName,
        COSTUMER_PHONE: couponId,
        ORDER_ID: id,
        STATUS: "PENDING",
      };

      await setDoc(doc(firestore, "COUPONS", couponId), couponMap, {
        merge: true,
      });
      coupons.push(couponId);
    }

    // Optionally include coupons array in the orderMap if needed
    // orderMap.COUPONS = coupons;

    await setDoc(doc(firestore, "ORDERS", id), orderMap, { merge: true });
  };
  const { apiCallCcavenue, isCCAvCheck } = useApiCallCcavenue();
  const { apiCallICICI, isICICICheck } = useApiCallICICI();
  const onhandleCcavenue = () => {
    apiCallCcavenue(paymentId, amounts, phone, cusName, cusId);
    console.log(
      paymentId,
      amounts,
      phone,
      cusName,
      cusId,
      "jjjjsssssssssssssssssssssss"
    );
  };
  const onhandleIcici = () => {
    apiCallICICI(paymentId, amounts, cusName, phone, cusId);
    console.log(
      paymentId,
      amounts,
      phone,
      cusName,
      cusId,
      "hyhyhyhyyhyhyhyhyhyhyyhyh"
    );
  };

  return (
    <div className="payment-choose">
      <div className="count-boxx">
        <h4>{totalPrice}</h4>
        <h6>
          {count} PACKETS X ₹{proPrice}
        </h6>
      </div>
      <div className="option-box">
        <h5>Payment Options</h5>
        {lockUpiIdent === "ON" ? (
          <div className="peyment-app-methds">
            <ul>
              <li onClick={upiPayment}>
                <img src={Assets.Gpay} alt="" />
              </li>
              <li>
                <img src={Assets.Paytm} alt="" />
              </li>
              <li>
                <img src={Assets.Bhim} alt="" />
              </li>
            </ul>
          </div>
        ) : (
          ""
        )}
        <div className="other-box">
          {/* <h6>Other Payment Options</h6> */}
          {lockCcAvanue === "ON" ? (
            <div className="other-payment" onClick={onhandleCcavenue}>
              <span>Payment Method 1</span>
              <FaAngleRight />
            </div>
          ) : (
            ""
          )}
          {lockIciciPlus === "ON" ? (
            <div className="other-payment" onClick={onhandleIcici}>
              <span>Payment Method 2</span>
              <FaAngleRight />
            </div>
          ) : (
            ""
          )}
        </div>
        <p>
          By continuing, you agree to our <span>Terms & Conditions</span>
        </p>
        <p>
          and acknowledge that you have <span>read and accept our Privacy</span>
          Policy.
        </p>
      </div>
    </div>
  );
};

export default PaymentChoose;

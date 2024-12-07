import React, { useEffect, useState } from "react";
import "./DeliverySummery.css";
import { Assets } from "../Assets/Assets";
import { FiTruck } from "react-icons/fi";
import { useCount } from "../../Context/Context";
import { useLocation } from "react-router-dom";

const DeliverySummery = ({ deliveryRate , from ,grandtotalFromCart, pdtImg, pdtPrice }) => {
  const {
    count,
    totalPrice,
    increment,
    decrement,
    showCount,
    setShowCount,
    toggleShowCount,
    cgst,
    sgst,
    totalGst,
    orgTeaAmout,
  } = useCount();

  // const [pdtImg,set]

// console.log(orderAgainPrice,"newpiceeeeeee");

  console.log(grandtotalFromCart, "this is from from delivery summer ........................")

  const [grandTotal, setGrandTotal] = useState(totalPrice );
  const state = localStorage.getItem("loginUserPlace");

  const location = useLocation();
  
  const {
    orderId,
    orderDate,
    orderPrice,
    productQuantity,
    status,
    productImage,
    productPrice,
    productName,
    productWeight,
    itemImg,
    price
  } = location.state || {};

  console.log(   orderId,
    orderDate,
    orderPrice,
    productQuantity,
    status,
    productImage,
    productPrice,
    productName,
    productWeight,
    itemImg,
    price,"this is from counttt via payment webbb")

  // useEffect(() => {
  //   // setShowCount(false);
  //   if ( deliveryRate && grandtotalFromCart ) {
  //     console.log("heloooooooooooooooooooooooooo...............")
  //     setGrandTotal(grandtotalFromCart + deliveryRate);
  //     setGrandTotal()
  //   } else if ( deliveryRate && totalPrice ){
  //     setGrandTotal(deliveryRate + totalPrice);
  //   } else {
  //     if(grandtotalFromCart) {
  //       setGrandTotal(grandtotalFromCart);
  //     } else {
  //       setGrandTotal(totalPrice)
  //     }
  //   }

  //   console.log(grandTotal, "grandTotal ...............................");

  // }, [grandtotalFromCart,totalPrice]);


  
  useEffect(() => {
    if (grandtotalFromCart) {
      setGrandTotal(deliveryRate ? grandtotalFromCart + deliveryRate : grandtotalFromCart);
    } else {
      setGrandTotal(deliveryRate ? totalPrice + deliveryRate : totalPrice);
    }
  }, [grandtotalFromCart, totalPrice, deliveryRate]);




  // useEffect(() => {
  //     // setShowCount(false);

  //   if (deliveryRate) {

  //     setGrandTotal(totalPrice + deliveryRate);
  //   } else {
  //     setGrandTotal(totalPrice);
  //   }
  // }, [totalPrice]);


   
  const weightUnit = productWeight % 1 !== 0 ? "gm" : "kg";
  // Concatenate the product name with weight and unit
  const displayName = `${productName} ${productWeight}${weightUnit}`;


  console.log(displayName, "udateed formate .........................")

  return (
    <div className="delivery-summery">

        {from !== "cart" && (

      <div className="delivery-summery-box">
      <div className="delivery-summery-top">
        <div className="tea-img-tea">
          <img src={itemImg || pdtImg} alt="" />
        </div>
        <div className="delivery-tea-details">
          <p>{productName}</p>
              <p>
                {productWeight < 1
                  ? `${(productWeight * 1000).toFixed(0)} g`
                  : `${productWeight} kg`}
              </p>
          <h6>₹{price || pdtPrice}</h6>
          {/* <p>
            <FiTruck />
            <span>Expected Delivery </span>
          </p> */}
          {/* <h6>30th May 2024</h6> */}
          {/* <p>Edit Quantity</p> */}
        </div>
      </div>
      <div className="edit-count">
        {showCount ? (
          <>
            <div className="edit-dec" onClick={decrement}>
              -
            </div>
            <div className="edit-num">{count}</div>
            <div className="edit-inc" onClick={increment}>
              +
            </div>
          </>
        ) : (
          <div className="quantity_div">
            <p>Quantity: </p>
            {count}
          </div>
        )}
      </div>
    </div>

      )}

      <div className="delivery-amount-summery">
        <div className="delivery-total">
          <p>Total </p>
          {
            grandtotalFromCart ? (

              <p>₹{(deliveryRate ? grandTotal - deliveryRate : grandtotalFromCart).toFixed(2)}</p>

            ) : (

              <p>₹{orgTeaAmout ? orgTeaAmout.toFixed(2) : grandTotal}</p>
            )

          }
        </div>
        {state !== "Kerala" ? (
          <div className="gst_summeryx">
            <h6>IGST (5%)</h6>
            <h6>₹ {totalGst.toFixed(2)} </h6>
          </div>
        ) : (
          <>
            {/* <div className="gst_summeryx">
              <h6>CGST (2.5%)</h6>
              <h6>₹ {cgst.toFixed(2)}</h6>
            </div>
            <div className="gst_summeryx">
              <h6>SGST (2.5%)</h6>
              <h6>₹ {sgst.toFixed(2)}</h6>
            </div> */}
          </>
        )}
        {deliveryRate ? (
          <div className="deliver-charges">
            <p>Delivery Charge</p>
            <p>₹{deliveryRate ? deliveryRate : 0}</p>
          </div>
        ) : (
          ""
        )}
        <div className="delivery-total-amount">
          <h6>Total Amount</h6>
          <h6>₹{grandTotal}</h6>
        </div>
      </div>
    </div>
  );
};

export default DeliverySummery;

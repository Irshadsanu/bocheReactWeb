import React, { createContext, useContext, useEffect, useState } from "react";
import { query, collection, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";

const CountContext = createContext();

export const CountProvider = ({ children }) => {

  
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lastUsedDeliveryName, setLastUsedDeliveryNameCtx] = useState("");
  const [selecteVariable, setSelecteVariable] = useState("");
  const [lastUsedDeliveryNumber, setLastUsedDeliveryNumberCtx] = useState("");
  const [lastUsedDeliveryAddress, setLastUsedDeliveryAddressCtx] = useState("");
  const [selecteaddress, setselecteAddressCtx] = useState("");
  const [ccLoading, setCcLoading] = useState(false);
  const [loginLoader, setLoginLoader] = useState(false);
  const [profileLoader, setProfileLoader] = useState(false);
  const [currentDepositBalance, setCurrentDepositBalance] = useState(0);
  const [currentWinningBalance, setCurrentWinningBalance] = useState(0);
  const [pincode, setPincode] = useState();
  const [showCount, setShowCount] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState();
  const [paymentLoader, setPaymentLoader] = useState(true);
  const [render,setRender] = useState(true)

  // const [myCartTotalProductQty,setCartTotalProductQty] = useState(0)

  const [ multiRate, setMultiRate] = useState(0)

  // console.log(currentDepositBalance);
  // console.log(lastUsedDeliveryName, "teateContextttttttttttttttttttttttttttttt");

  // console.log(lastUsedDeliveryNumber, "lastUsedDeliveryNumber on contexttttttttttttttuuuuuuuuuuuuuu")

  // console.log(
  //   deliveryAddress,
  //   "deliveryaddress,,,,,,,,, from  context .................."
  // );

  // console.log(pincode, "pincode .............. from cotext");

  const increment = () => {
    if (count < 10) {
      setCount(count + 1);
    }
  };

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  const gstRate = 5; // GST rate of 5%

  const productPrice = multiRate;

  // Calculate the original amount and GST amount
  const originalAmount = productPrice / (1 + gstRate / 100);
  const gstAmount = productPrice - originalAmount;

  console.log("Original Amount (Excluding GST):", originalAmount.toFixed(2));
  console.log("GST Amount:", gstAmount.toFixed(2));
  const totalGst = count * gstAmount;
  const sgst = totalGst / 2;
  const cgst = totalGst / 2;

  const [currentWalletBalance, setCurrentWalletBalance] = useState();

  const [ready, setReady] = useState(false);

  const totalPrice = count * productPrice;
  // const orgTeaAmout = totalPrice - totalGst;
  const orgTeaAmout = count * productPrice;


  return (
    <CountContext.Provider
      value={{
        loading,
        setLoading,
        count,
        totalPrice,
        increment,
        decrement,
        setCount,
        selecteVariable,
        setSelecteVariable,
        lastUsedDeliveryName,
        setLastUsedDeliveryNameCtx,
        lastUsedDeliveryNumber,
        setLastUsedDeliveryNumberCtx,
        lastUsedDeliveryAddress,
        setLastUsedDeliveryAddressCtx,
        selecteaddress,
        setselecteAddressCtx,
        ccLoading,
        setCcLoading,
        loginLoader,
        setLoginLoader,
        profileLoader,
        setProfileLoader,
        currentDepositBalance,
        setCurrentDepositBalance,
        currentWinningBalance,
        setCurrentWinningBalance,
        currentWalletBalance,
        setCurrentWalletBalance,
        ready,
        setReady,
        pincode,
        setPincode,
        showCount,
        setShowCount,
        deliveryAddress,
        setDeliveryAddress,
        paymentLoader,
        setPaymentLoader,
        cgst,
        sgst,
        totalGst,
        orgTeaAmout,
        setCount,
        setMultiRate,
        // myCartTotalProductQty,
        // setCartTotalProductQty,
      }}
    >
      {children}
    </CountContext.Provider>
  );
};

export const useCount = () => useContext(CountContext);

import React, { useContext, useState, useEffect } from "react";
import "firebase/firestore";
import { isAndroid, isIOS } from "react-device-detect";
import { firestore } from "../../firebase";

import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { collection, doc, setDoc } from "firebase/firestore";
import { useCount } from "../../Context/Context";




const attemptUpdation = async (
  orderID,
  amount,
  cusId,
  cusName,
  proId,
  proQty,
  proPrice,
  loginUserPhone,
  orderAmount,
  proImgs,
  paymentApp,
  paymentUpi,
  lastUsedDeliveryAddress,
  lastUsedDeliveryName,
  lastUsedDeliveryNumber,
  selecteaddress,
  deliveryRate,
  courierId,
  courierName,
  estimatedDays,
  changeDepositBalance,
  changeWinningBalance,
  changeRemainingBalance,
  attachedCount,
  productWeight,
  productName
  
) => {

  // const [timeString, setTimeString] = useState('');
  // const [deviceID, setDeviceID] = useState("");  // Fallback unique identifier
  // const selectedOptionEx = SelectContext();
  // const {lastUsedDeliveryAddress,lastUsedDeliveryName,lastUsedDeliveryNumber,selecteaddress} = useContext(SelectContext);
  
  let deviceID = "WEB";

  console.log(amount,"nameeeeffsdfgsdfg");
  

  console.log("helooooooooooooooooooooo this is attemp updateionnnnnnn onlyyyyyyyyyyyyyyyy")

  console.log("irsh_code....", selecteaddress);

  try {
    // Initialize FingerprintJS and get visitor ID
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    deviceID = result.visitorId;


    const map = {
      RESPONDS: "PENDING",
      TIME: Date.now().toString(),
      PAYMENT_STATUS: "PENDING",
      DEVICE_ID: deviceID,
      PACKAGE_VERSION: "WEB",
      AMOUNT: parseFloat(amount),
      PRODUCT_PRICE: proPrice,
      ORDER_AMOUNT: orderAmount,
      PRODUCT_ID: proId,
      PRODUCT_QUANTITY: proQty,
      CUSTOMER_NAME: cusName,
      CUSTOMER_ID: cusId,
      CUSTOMER_PHONE: loginUserPhone,
      ORDER_ID: orderID,
      TYPE: selecteaddress === "" ? "Delivery" : selecteaddress,
      PRODUCT_IMAGE: [proImgs],
      PRODUCT_WEIGHT:productWeight,
      PRODUCT_NAME : productName,
      PAYMENT_APP: paymentApp,
      PAYMENT_UPI: paymentUpi,
      PAYMENT_DATE: new Date(),
      PLATFORM: "WEB",

      DELIVERY_CHARGE: deliveryRate || 0,
      ESTIMATE_DAYS: estimatedDays || "0",
      COURIER_NAME: courierName || "NIL",
      COURIER_ID: courierId || 0,
      DEPOSIT_WALLET_AMOUNT: changeDepositBalance || 0,
      WINNING_WALLET_AMOUNT: changeWinningBalance || 0,
      ONLINE_PAID_AMOUNT: changeRemainingBalance || 0,
      ALLOCATED_COUNT: attachedCount,
      
    };

    console.log("irsh_code22222222....", selecteaddress);



    if (selecteaddress !== "Pick Up From Store") {
      map.DELIVERY_NAME = lastUsedDeliveryName;
      map.DELIVERY_NUMBER = lastUsedDeliveryNumber;
      map.DELIVERY_ADDRESS = lastUsedDeliveryAddress;
    }

    // Ensure the collection name and document ID are correctly passed
    //   await setDoc(doc(firestore, 'ATTEMPTS', orderID), map, { merge: true });
    // } catch (error) {
    //   console.error('Error updating attempt:', error);
    // }

    await setDoc(doc(firestore, "ATTEMPTS", orderID), map, { merge: true });
    console.log("Attempt added successfully with merge!");
  } catch (error) {
    console.error("Error adding attempt: ", error);
  }
};

export default attemptUpdation;

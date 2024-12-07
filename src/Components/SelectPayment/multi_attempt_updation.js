

import { doc , setDoc } from "firebase/firestore";

import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { firestore } from "../../firebase";



// console.log("helooooooooooooooooooooooooo")






const multiAttemptUpdation = async (
  orderID,
  amount,
  cusId,
  cusName,
  loginUserPhone,
  orderAmount,
  paymentApp,
  paymentUpi,
  depositWallet,
  winningWallet,
  paidAmount,
  apiResults,
  productList,
  lastUsedDeliveryAddress,
  lastUsedDeliveryName,
  lastUsedDeliveryNumber,
  selecteaddress,
  deliveryRate,
  courierId,
  courierName,
  estimatedDays,
  totalWeight
) => {


  console.log(
   
    productList,"=== productList---------------------------------",
   

  )


    console.log("helooooooooooooooooooooo this is multi attempt updationnnnnnnnnnnnnn")

  console.log(productList, "okokokokookokok product list");

  // Getting current time or fetched time from server
// 



  const fp = await FingerprintJS.load();
    const result = await fp.get();

  const deviceID = result.visitorId;


    console.log(deviceID, "device id ......................")


  
  const map = {
    RESPONDS: "PENDING",
    TIME:  Date.now().toString(),
    PAYMENT_STATUS: "PENDING",
    DEVICE_ID: deviceID,
    PACKAGE_VERSION: "WEB",
    AMOUNT: parseFloat(amount),
    ORDER_AMOUNT: orderAmount,
    CUSTOMER_NAME: cusName,
    CUSTOMER_ID: cusId,
    CUSTOMER_PHONE: loginUserPhone,
    ORDER_ID: orderID,
    TYPE: selecteaddress === "" ? "Delivery" : selecteaddress,
    PAYMENT_APP: paymentApp,
    PAYMENT_UPI: paymentUpi,
    PAYMENT_DATE:  new Date(),
    PLATFORM: "WEB",
    DEPOSIT_WALLET_AMOUNT: depositWallet || 0,
    WINNING_WALLET_AMOUNT: winningWallet || 0,
    ONLINE_PAID_AMOUNT: paidAmount || 0,
  

    DELIVERY_CHARGE: deliveryRate || 0,
    ESTIMATE_DAYS: estimatedDays || "0",
    COURIER_NAME: courierName || "NIL",
    COURIER_ID: courierId || 0,

    PRODUCT_LIST: productList.map(product => ({
      PRODUCT_ID: product.productId,
      PRODUCT_PRICE: product.price,
      PRODUCT_NAME: product.name,
      PRODUCT_IMAGES: product.productImageList,
      PRODUCT_QTY: product.productQty,
      PRODUCT_WEIGHT: product.grossWeight,
      PRODUCT_SGST: product.sgst,
      PRODUCT_CGST: product.cgst,
      PRODUCT_IGST: product.igst,
      ALLOCATED_TICKETS_COUNT: product.allocatedTicket,
    }))
  };

  console.log(orderID, "order id .................................... from multi before attempt")


  console.log("selecteaddress adressssssssssssss on multi atteimptt...", selecteaddress);

  // Address information
  if (selecteaddress !== "Pick Up From Store") {
    map.DELIVERY_NAME = lastUsedDeliveryName;
    map.DELIVERY_NUMBER = lastUsedDeliveryNumber;
    map.DELIVERY_ADDRESS = lastUsedDeliveryAddress;
  }


console.log("Map data before setDoc:", map);

try {
  console.log("enter to attempt fucnion on multiiii..........")

    await setDoc(doc(firestore, "ATTEMPTS", orderID), map, { merge: true });
    console.log("Attempt added successfully with merge! on multi === attempt updation .......");
    
} catch (error) {
    console.error("Error adding attempt: ", error);
}



};


export default multiAttemptUpdation;

// import { useNavigate } from "react-router-dom";
// import { firestore } from "../../firebase";
// import Success from "../Success/Success"; // Assuming you have a component for success screen
// import { addWalletTransactions } from "./addWalletTransactions";
// import purchaseApi from "./purchaseApi";
// import AddOrders from "./AddOrders";
// import { doc, setDoc } from "firebase/firestore";
// import addOrderforShiprocket from "./addOrderforShiprocket";

// const updatePaymentForWallet = async (
//   orderID,
//   app,
//   amount,
//   loginUserId,
//   loginUserName,
//   productId,
//   productName,
//   productImages,
//   productPrice,
//   loginUserPhone,
//   loginUserPlace,
//   loginUserPhoto,
//   depositWallet,
//   winningWallet,
//   paidAmount,
//   apiResults,
//   dedeuctDepositAmonunt,
//   deductWinningAmount,
//   navigate,
//   selectedAddress,
//   lastUsedDeliveryName,
//   lastUsedDeliveryNumber,
//   lastUsedDeliveryAddress,
//   count,
//   grandTotal,
//   custPhone,
//   name
// ) => {
//   const now = new Date();
//   const totalOrder = dedeuctDepositAmonunt + deductWinningAmount;

//   console.log(custPhone, "hhhhhhhh");

//   const map = {
//     RESPONDS: "SUCCESS",
//     TIME: now.getTime().toString(),
//     PAYMENT_STATUS: "SUCCESS",
//     AMOUNT: parseFloat(amount),
//     PAYMENT_APP: app,
//   };

//   await setDoc(doc(firestore, "ATTEMPTS", orderID), map, { merge: true });

//   await addWalletTransactions(
//     orderID,
//     grandTotal,
//     loginUserId,
//     loginUserName,
//     now,
//     dedeuctDepositAmonunt,
//     deductWinningAmount,
//     custPhone
//   );
//   console.log(dedeuctDepositAmonunt);
//   if (dedeuctDepositAmonunt > 0) {
//     const walletMap = {
//       AMOUNT: dedeuctDepositAmonunt,
//       TYPE: "PURCHASE_DEPOSIT",
//       DATE: now,
//       CUSTOMER_ID: loginUserId,
//       ORDER_ID: orderID,
//       CUSTOMER_PHONE: custPhone,
//       CUSTOMER_NAME: name,
//     };

//     await setDoc(
//       doc(firestore, "WALLET_TRANSACTION", now.getTime().toString()),
//       walletMap,
//       { merge: true }
//     );
//   }

//   if (deductWinningAmount > 0) {
//     const walletMap = {
//       AMOUNT: deductWinningAmount,
//       TYPE: "PURCHASE_WINNING",
//       DATE: now,
//       CUSTOMER_ID: loginUserId,
//       ORDER_ID: orderID,
//       CUSTOMER_PHONE: custPhone,
//       CUSTOMER_NAME: name,
//     };

//     await setDoc(
//       doc(firestore, "WALLET_TRANSACTION", now.getTime().toString()),
//       walletMap,
//       { merge: true }
//     );
//   }

//   await purchaseApi(
//     productId,
//     loginUserPhone,
//     loginUserName,
//     count,
//     loginUserId,
//     orderID
//   );

//   AddOrders({
//     id: orderID,
//     cusId: loginUserId,
//     cusName: loginUserName,
//     proId: productId,
//     proImg: [productImages],
//     proQty: count,
//     proPrice: 40,
//     orderPrice: totalOrder,
//     loginUserPhone,
//     apiResults,
//     buildNumber: "WEB",
//     selectedAddressOption: selectedAddress, // or the appropriate option
//     lastUsedDeliveryName: lastUsedDeliveryName,
//     lastUsedDeliveryNumber: lastUsedDeliveryNumber,
//     lastUsedDeliveryAddress: lastUsedDeliveryAddress,
//   });

//   //   if ( selectedAddress === "Delivery to Your Address") {
//   //     await addOrderforShiprocket (
//   //       orderID,
//   //       loginUserName,
//   //       lastUsedDeliveryAddress,
//   //       loginUserPhone,
//   //       totalOrder,
//   //       productId,
//   //       count,
//   //     );
//   //   }

//   navigate("/succes", {
//     state: {
//       cusId: loginUserId,
//       from: "ORDER",
//       orderId: orderID,
//       cusName: loginUserName,
//       cusNumber: loginUserPhone,
//       cusPlace: loginUserPlace,
//       cusPhoto: loginUserPhoto,
//       qty: count,
//     },
//   });
// };

// export default updatePaymentForWallet;

import { useNavigate } from "react-router-dom";
import { firestore } from "../../firebase";
import Success from "../Success/Success"; // Assuming you have a component for success screen
import { addWalletTransactions } from "./addWalletTransactions";
import purchaseApi from "./purchaseApi";
import AddOrders from "./AddOrders";
import { doc, setDoc } from "firebase/firestore";
import addOrderforShiprocket from "./addOrderforShiprocket";


// const loginUserPincode = localStorage.getItem("loginUserPincode")

const updatePaymentForWallet = async (
  orderID,
  app,
  amount,
  loginUserId,
  loginUserName,
  productId,
  productName,
  productImages,
  productPrice,
  loginUserPhone,
  loginUserPlace,
  loginUserPhoto,
  depositWallet,
  winningWallet,
  paidAmount,
  apiResults,
  dedeuctDepositAmonunt,
  deductWinningAmount,
  navigate,
  selectedAddress,
  lastUsedDeliveryName,
  lastUsedDeliveryNumber,
  lastUsedDeliveryAddress,
  count,
  grandTotal,
  custPhone,
  name,
  loginUserPincode,
  productWeight

) => {






  const now = new Date();
  const totalOrder = dedeuctDepositAmonunt + deductWinningAmount;

  const map = {
    RESPONDS: "SUCCESS",
    TIME: now.getTime().toString(),
    PAYMENT_STATUS: "SUCCESS",
    AMOUNT: parseFloat(amount),
    PAYMENT_APP: app,
    PINCODE : loginUserPincode
    
  };

  await setDoc(doc(firestore, "ATTEMPTS", orderID), map, { merge: true });

  await addWalletTransactions(
    orderID,
    grandTotal,
    loginUserId,
    loginUserName,
    now,
    dedeuctDepositAmonunt,
    deductWinningAmount,
    custPhone
  );


  if (dedeuctDepositAmonunt > 0) {
    const walletMap = {
      AMOUNT: dedeuctDepositAmonunt,
      TYPE: "PURCHASE_DEPOSIT",
      DATE: now,
      CUSTOMER_ID: loginUserId,
      ORDER_ID: orderID,
      CUSTOMER_PHONE: custPhone,
      CUSTOMER_NAME: name,
      PINCODE : loginUserPincode
    };

    await setDoc(
      doc(firestore, "WALLET_TRANSACTION", now.getTime().toString()),
      walletMap,
      { merge: true }
    );
  }

  if (deductWinningAmount > 0) {
    const walletMap = {
      AMOUNT: deductWinningAmount,
      TYPE: "PURCHASE_WINNING",
      DATE: now,
      CUSTOMER_ID: loginUserId,
      ORDER_ID: orderID,
      CUSTOMER_PHONE: custPhone,
      CUSTOMER_NAME: name,
      PINCODE : loginUserPincode
    };

    await setDoc(
      doc(firestore, "WALLET_TRANSACTION", now.getTime().toString()),
      walletMap,
      { merge: true }
    );
  }

  await purchaseApi(
    productId,
    loginUserPhone,
    loginUserName,
    count,
    loginUserId,
    orderID
  );

  await AddOrders({
    id: orderID,
    cusId: loginUserId,
    cusName: loginUserName,
    proId: productId,
    proImg: [productImages],
    proQty: count,
    proPrice: productPrice,
    orderPrice: totalOrder,
    loginUserPhone,
    apiResults,
    buildNumber: "WEB",
    selectedAddressOption: selectedAddress, 
    lastUsedDeliveryName: lastUsedDeliveryName,
    lastUsedDeliveryNumber: lastUsedDeliveryNumber,
    lastUsedDeliveryAddress: lastUsedDeliveryAddress,
    pincode : loginUserPincode,
    productWeight : productWeight,
    amount : amount
  });


  navigate("/succes", {
    state: {
      cusId: loginUserId,
      from: "ORDER",
      orderId: orderID,
      cusName: loginUserName,
      cusNumber: loginUserPhone,
      cusPlace: loginUserPlace,
      cusPhoto: loginUserPhoto,
      qty: count,
      pincode : loginUserPincode
    },
  });
};

export default updatePaymentForWallet;


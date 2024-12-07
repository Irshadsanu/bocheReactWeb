import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../firebase";

export const addWalletTransactions = async (
  orderId,
  amount,
  customerId,
  customerName,
  tranDate,
  depoWalletAmount,
  winWalletAmount,
  custPhone
) => {
  const transactionMap = {
    AMOUNT: amount,
    APP_VERSION: "WEB",
    CUSTOMER_ID: customerId,
    CUSTOMER_NAME: customerName,
    DEPOSIT_WALLET_AMOUNT: depoWalletAmount || 0,
    DEVICE_ID: "WEB",
    ONLINE_PAID_AMOUNT: 0,
    ORDER_ID: orderId,
    TRANSACTION_DATE: tranDate,
    TRANSACTION_ID: orderId,
    TRANSACTION_TYPE: "PURCHASE",
    WINNING_WALLET_AMOUNT: winWalletAmount || 0,
    CUSTOMER_PHONE:custPhone ,
  };
  console.log(depoWalletAmount, "depoWalletAmount");
  console.log(winWalletAmount, "winWalletAmount");
  await setDoc(doc(firestore, "TRANSACTIONS", orderId), transactionMap, {
    merge: true,
  });
  console.log("add wallet transaction");
};

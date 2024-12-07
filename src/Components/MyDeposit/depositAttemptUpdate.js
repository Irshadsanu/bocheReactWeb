import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../firebase";

const depositAttemptUpdate = async (
  orderID,
  amount,
  cusId,
  cusName,
  loginUserPhone
) => {
  const map = {
    RESPONDS: "PENDING",
    TIME: Date.now().toString(),
    PAYMENT_STATUS: "PENDING",
    DEVICE_ID: "WEB",
    PACKAGE_VERSION: "WEB",
    AMOUNT: parseFloat(amount),
    CUSTOMER_NAME: cusName,
    CUSTOMER_ID: cusId,
    CUSTOMER_PHONE: loginUserPhone,
    ORDER_ID: orderID,
    TYPE: "DEPOSIT",
    PAYMENT_DATE: new Date(),
    PLATFORM: "WEB",
  };

  try {
    await setDoc(doc(firestore, "ATTEMPTS", orderID), map, { merge: true });
    console.log("Deposit attempt updated successfully");
  } catch (error) {
    console.error("Error updating deposit attempt:", error);
  }
};

export default depositAttemptUpdate;

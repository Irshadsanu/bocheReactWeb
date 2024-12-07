import { firestore } from "../../firebase";
import { useNavigate } from "react-router-dom";
import {
  setDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  where,
  query,
} from "firebase/firestore";
import { useCount } from "../../Context/Context";

export const listenForPayment = (
  order_id,
  qty,
  loginUserId,
  loginUserName,
  loginUserPhone,
  ccAvanueListen,
  setCcAvanueListen,
  navigator,
  from,
  setPaymentLoader
) => {
  console.log("Listening for payment with order ID:", order_id);
  console.log(from, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhfrom");

  // Ensure any existing listener is cancelled
  if (
    typeof window._paymentListenStream !== "undefined" &&
    window._paymentListenStream !== null
  ) {
    window._paymentListenStream();
  }

  // Set up a new listener
  const q = query(
    collection(firestore, "MONITOR_NODE"),
    where("ORDER_ID", "==", order_id),
    where("PAYMENT_STATUS", "in", ["Success", "Failed"])
  );

  window._paymentListenStream = onSnapshot(q, (snapshot) => {
    if (!snapshot.empty && ccAvanueListen) {
      setCcAvanueListen(false);
      console.log("Payment update received");

      const data = snapshot.docs[0].data();
      if (from === "DEPOSIT") {
        // navigator("/deposucces");
        if (data.PAYMENT_STATUS === "Success") {
          console.log("Payment successful");
          // Navigate to success screen
          navigator("/deposucces", {
            state: {
              orderId: order_id,
            },
          });
          setPaymentLoader(false);
        } else if (data.PAYMENT_STATUS === "Failed") {
          console.log("Payment failed");
          // Navigate to failed screen
          navigator("/depofailed");
          setPaymentLoader(false);
        }
      } else if (from === "PURCHASE") {
        if (data.PAYMENT_STATUS === "Success") {
          console.log("Payment successful");

          // window.location.pushState({ preventBack: true }, "");
          
          // Navigate to success screen
          navigator("/succes", {
            state: {
              orderId: order_id,
              qty: qty,
              preventBack: true,
            },
          });
          setPaymentLoader(false);
        } else if (data.PAYMENT_STATUS === "Failed") {
          console.log("Payment failed");
          // Navigate to failed screen
          navigator("/failed");
          setPaymentLoader(false);
        }
      }
    }
  });

  console.log("Listener setup complete");
};

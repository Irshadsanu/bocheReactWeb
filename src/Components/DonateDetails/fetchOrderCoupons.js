// services/fetchOrderCoupons.js
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import CouponModel from "../../ModelClasses/coupon_model";

const fetchOrderCoupons = async (cusId, orderId) => {
  const db = getFirestore();
  const couponsRef = collection(db, "TICKETS");
  const q = query(
    couponsRef,
    where("CUSTOMER_ID", "==", cusId),
    where("ORDER_ID", "==", orderId)
  );

  const querySnapshot = await getDocs(q);
  const couponOrderList = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const coupon = new CouponModel(
      data.COUPON_ID || "",
      data.LOT_DATE || "",
      data.TICKET_DATE.toDate() || "",
      data.TICKET_NUMBER || "",
      data.CUSTOMER_ID || "",
      data.CUSTOMER_NAME || "",
      data.VALIDITY || "",
      data.WINNING_STATUS || "",
      data.ORDER_ID || "",
      data.WIN_AMOUNT || ""
    );
    couponOrderList.push(coupon);

    console.log(coupon.TICKET_DATE,"date from function")

  });

  return couponOrderList;
};

export default fetchOrderCoupons;

// // services/fetchCoupons.js
// import {
//   getFirestore,
//   collection,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";
// import CouponModel from "../../ModelClasses/coupon_model";

// const fetchCoupons = async (cusId) => {
//   const db = getFirestore();
//   const couponsRef = collection(db, "TICKETS");
//   const q = query(couponsRef, where("CUSTOMER_ID", "==", cusId));

//   const querySnapshot = await getDocs(q);
//   console.log(cusId, "cus Id 2");
//   const couponList = [];

//   querySnapshot.forEach((doc) => {
//     console.log("hello this demo");
//     const data = doc.data();
//     const coupon = new CouponModel(
//       data.COUPON_ID || "",
//       data.LOT_DATE || "",
//       data.TICKET_DATE || "",
//       data.TICKET_NUMBER || "",
//       data.USER_ID || "",
//       data.USER_NAME || "",
//       data.VALIDITY || "",
//       data.WINNING_STATUS || "",
//       data.ORDER_ID || "",
//       data.CHANNEL_ID || "",
//       data.DRAW_ID || ""
//     );
//     couponList.push(coupon);
//   });

// //   return couponList;
// // };

// // export default fetchCoupons;

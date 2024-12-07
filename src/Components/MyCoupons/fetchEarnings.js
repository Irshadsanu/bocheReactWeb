// services/fetchCoupons.js
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
  } from "firebase/firestore";
  import CouponModel from "../../ModelClasses/coupon_model";
  
  const fetchEarnings = async (cusId) => {
    
    const db = getFirestore();
    const couponsRef = collection(db, "CUSTOMERS");
    const q = query(couponsRef, where("CUSTOMER_ID", "==", cusId));
  
    const querySnapshot = await getDocs(q);
    console.log(cusId, "cus Id earn");
    // console.log(querySnapshot.docs[0].WINNING_WALLET_TOTAL);


    let myEarnings = 0;
    querySnapshot.forEach((doc) => {
      console.log("get Earn");
      const data = doc.WINNING_WALLET_TOTAL;
      console.log(data);
      myEarnings = data.WINNING_WALLET_TOTAL || 0;

    });
    console.log( myEarnings,"irsh");
  
    return myEarnings;
  };
  
  export default fetchEarnings;
  
import React, { useEffect, useState } from "react";
import "./Spotlight.css";
import { MdOutlineCall } from "react-icons/md";
import { IoWallet } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { encrypt, decrypt } from "../Spotlight/Encryption";
import {
  getDocs,
  query,
  collection,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import Support from "../Alert/Support";
import CouponAlert1 from "../Alert/CouponAlert1";
import axios from "axios";
import TicketAlert from "../Alert/TicketAlert";
import ClipLoader from "react-spinners/ClipLoader";
import { useCount } from "../../Context/Context";
import { toast } from "sonner";

export const Spotlight = () => {

  const [coupon, setCoupon] = useState("");
  const navigate = useNavigate();
  const custId = localStorage.getItem("loginUserId");
  const [showSupport, setShowSupport] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [couponDocId, setCouponDocId] = useState("");
  const [couponNumber, setCouponNumber] = useState("");
  const [ticketQty, setTicketQty] = useState(0);
  const [encryptedData, setEncryptedData] = useState("");
  const [decryptedData, setDecryptedData] = useState("");
  const [showCouponAlert1, setShowCouponAlert1] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);

  const [loading, setLoading] = useState(false);

  const cusId = localStorage.getItem("loginUserId");
  console.log(cusId, "cus id................");

  const [currentWinning, setCurrentWinning] = useState();

  const { setCurrentWalletBalance } = useCount();

  useEffect(() => {
    const fetchCurrentBalance = async () => {
      try {
        const docRef = doc(firestore, "CUSTOMERS", custId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          setCurrentBalance(data.DEPOSIT_WALLET_BALANCE || 0);
        } else {
          console.log("No documents");
        }
      } catch (error) {
        console.log("Error fetching current Balance", error);
      }
    };

    custId == "" || custId == null ? <></> : fetchCurrentBalance();
  }, [custId]);

  const winningTotalAmonuntFunction = async (cusId) => {
    const winningSnapshot = await getDocs(
      query(
        collection(firestore, "WALLET_TRANSACTION"),
        where("CUSTOMER_ID", "==", cusId),
        where("TYPE", "in", ["WINNING", "USING_SCRATCH_AND_WIN","WINNING_CREDIT"])
      )
    );

    const currentWinningAmount = winningSnapshot.docs.reduce(
      (sum, doc) => sum + doc.data().AMOUNT,
      0
    );

    // const takenWinningSnapshot = await getDocs(
    //   query(
    //     collection(firestore, "WALLET_TRANSACTION"),
    //     where("CUSTOMER_ID", "==", custId),
    //     where("TYPE", "in", [
    //       "PURCHASE_WINNING",
    //       "WITHDRAW",
    //       "WITHDRAW_REQUEST",
    //     ])
    //   )
    // );
    // const takenWinning = takenWinningSnapshot.docs.reduce(
    //   (sum, doc) => sum + doc.data().AMOUNT,
    //   0
    // );

    setCurrentWinning(currentWinningAmount);
    setCurrentWalletBalance(currentWinningAmount);
  };

  console.log(currentWinning, "currentWinning");

  useEffect(() => {
    winningTotalAmonuntFunction(cusId);
  }, []);

  const handleCloseCuponAlert1 = () => {
    setShowCouponAlert1(false);
  };

  const openCoupon = () => {
    setShowCoupon(true);
  };

  const handleCloseTicket = () => {
    setShowCoupon(false);
  };

  const apiEncryption = async (coupon) => {
    try {
      const response = await axios.get(
        "https://bochemartrun-wyynhb4exq-uc.a.run.app/spineApiEncrypt",
        {
          params: { input: coupon },
        }
      );

      if (response.status === 200) {
        return response.data; // Return the response data directly
      } else {
        return "null";
      }
    } catch (error) {
      return "null";
    }
  };

  const apiDecryption = async (encInput) => {
    try {
      const response = await axios.get(
        "https://bochemartrun-wyynhb4exq-uc.a.run.app/spineApiDecrypt",
        {
          params: { encInput: encInput },
        }
      );

      if (response.status === 200) {
        return response.data; // Return the response data directly
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const couponCheck = async (encData) => {
    setLoading(true);
    console.log("hellooooooo");

    const collectionRef = collection(firestore, "COUPONS_DATA");
    const q = query(
      collectionRef,
      where("COUPON_NUMBER", "==", encData),
      where("VALIDITY", "==", "ACTIVE")
    );
    const querySnapshot = await getDocs(q);

    console.log(querySnapshot, "=====querysnapsot");

    if (!querySnapshot.empty) {
      const map = querySnapshot.docs[0].data();
      const dycNumber = map.COUPON_NUMBER;
      console.log(dycNumber + " mkkkkkkkkkkk");

      setCouponDocId(querySnapshot.docs[0].id);
      setTicketQty(map.TICKETS_COUNT);

      // console.log(querySnapshot.docs[0].id, "=== couponDocId");
      // console.log(dycNumber, "=== couponNumber");
      // console.log(map.TICKETS_COUNT, "=== ticketQty");

      const decryptedCouponNumber = await handleDecrypt(dycNumber);
      setCouponNumber(decryptedCouponNumber);
      if (decryptedCouponNumber) {
        console.log(decryptedCouponNumber, "decryptedCouponNumber");
        return true;
      }
    } else {
      //   alert("Please enter a valid coupon number");
      toast.error("Please enter a valid coupon number");
      setCoupon("");

      return false;
      setLoading(false);
    }
  };

  const handleEncrypt = async () => {
    try {
      const encData = await apiEncryption(coupon);
      setEncryptedData(encData);
      console.log(encData, "===encData ");

      const success = await couponCheck(encData);
      return success;
    } catch (error) {
      console.error("Error in handleEncrypt:", error);
      return false;
    }
  };

  const handleDecrypt = async (number) => {
    try {
      const decData = await apiDecryption(number);
      setDecryptedData(decData);
      return decData;
    } catch (error) {
      console.error("Error in handleDycrypt: ", error);
      return null;
    }
  };

  const handleAddClick = async (e) => {
    e.preventDefault();

    setLoading(true);

    const success = await handleEncrypt();

    if (success) {
      setShowCouponAlert1(true);
      setCoupon("");
    }
    setLoading(false);
  };

  const handleShowSupport = () => {
    setShowSupport(true);
  };

  const handleCloseSupport = () => {
    setShowSupport(false);
  };

  return (
    <div className="spotlight">
      <div className="top-box">
        <h6>
          Welcome to Boche <span>Mart!</span>
        </h6>

        {/* <div onClick={handleShowSupport} className="help">
          <MdOutlineCall />
          <p>Help</p>
        </div> */}
        
      </div>
      <div className="spot-web">
        <form onSubmit={handleAddClick}>
          <input
            type="text"
            placeholder="Enter coupon number"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            maxLength={"12"}
          />
          <button type="submit" className="Addd">
            {loading ? <ClipLoader color="#fff" size={16} /> : "Add"}
          </button>
        </form>

        {/* winning balance /////////////////////////////////////////////////////////////////////// */}

        <div className="main-box-spot">
          <div className="linkee">
            <p>My Earnings</p>
            <h6>₹ {currentWinning?.toFixed(2)}</h6>
          </div>
          <Link to={custId ? "/wallet" : "/login"} className="wallet-show link">
            <div className="deposit">
              <IoWallet />
              <p>My Wallet</p>
            </div>
          </Link>
        </div>
      </div>

      {showCouponAlert1 && (
        <div className="support_alert_overlay" onClick={handleCloseCuponAlert1}>
          <div
            className="alert-content_support"
            onClick={(e) => e.stopPropagation()}
          >
            <CouponAlert1
              setShowCouponAlert1={setShowCouponAlert1}
              setShowCoupon={setShowCoupon}
              ticketQty={ticketQty}
              couponDocId={couponDocId}
              couponNumber={couponNumber}
            />
          </div>
        </div>
      )}

      {showCoupon && (
        <div className="support_alert_overlay" onClick={handleCloseTicket}>
          <div
            className="alert-content_support"
            onClick={(e) => e.stopPropagation()}
          >
            <TicketAlert ticketQty={ticketQty} />
          </div>
        </div>
      )}

      {showSupport && (
        <div className="support_alert_overlay" onClick={handleCloseSupport}>
          <div
            className="alert-content_support"
            onClick={(e) => e.stopPropagation()}
          >
            <Support />
          </div>
        </div>
      )}
    </div>
  );
};

export default Spotlight;

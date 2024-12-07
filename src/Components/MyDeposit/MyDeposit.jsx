// // import React, { useState,useEffect } from "react";
// // import "./MyDeposit.css";
// // import { useNavigate } from "react-router-dom";
// // import { setDoc,doc,serverTimestamp,increment,getDoc } from "firebase/firestore";
// // import { firestore } from "../../firebase";

// // const MyDeposit = () => {
// //   const [amount, setAmount] = useState("");
// //   const [error, setError] = useState("");
// //   const navigator = useNavigate();

// //   const [currentDepositBalance, setCurrentDepositBalance] = useState(0); // Assuming initial balance
// //   // const [custId] = useState(''); // Replace with actual customer ID
// //   // const [appVersion] = useState('1.0.0'); // Replace with actual app version
// //   // const [cusName] = useState('Customer Name'); // Replace with actual customer nam

// //   const custId = localStorage.getItem("loginUserId");
// //   const cusName = localStorage.getItem("loginUserName");
// //   const appVersion = "WEB";

// //   useEffect(() => {
// //     // Fetch the current balance from Firestore when the component mounts
// //     const fetchCurrentBalance = async () => {
// //       try {
// //         const docRef = doc(firestore, 'CUSTOMERS', custId);
// //         const docSnap = await getDoc(docRef);
// //         if (docSnap.exists()) {
// //           const data = docSnap.data();
// //           setCurrentDepositBalance(data.DEPOSIT_WALLET_BALANCE || 0);
// //         } else {
// //           console.log('No such document!');
// //         }
// //       } catch (error) {
// //         console.error('Error fetching current balance: ', error);
// //       }
// //     };

// //     fetchCurrentBalance();
// //   }, [custId]);

// //   const priceHandler = (amount) => {
// //     setAmount(amount);
// //     validateAmount(amount);
// //   };

// //   const validateAmount = (amount) => {
// //     if (!amount) {
// //       setError("Amount is required");
// //       return false;
// //     }
// //     if (isNaN(amount)) {
// //       setError("Amount must be a number");
// //       return false;
// //     }
// //     if (Number(amount) <= 0) {
// //       setError("Amount must be greater than zero");
// //       return false;
// //     }
// //     setError("");
// //     return true;
// //   };

// //   const handleOnClick = async () => {
// //     if (validateAmount(amount)) {
// //       await addDeposit();
// //       navigator("/deposucces" ,{replace:true});
// //     }
// //   };

// //   const price = [
// //     { id: 1, price: 50 },
// //     { id: 2, price: 100 },
// //     { id: 3, price: 200 },
// //     { id: 5, price: 300 },
// //     { id: 6, price: 400 },
// //     { id: 9, price: 500 },
// //   ];

// //   const addDeposit = async () => {
// //     const now = new Date();
// //     const id = now.getTime().toString();

// //     const depositAmountValue = parseInt(amount);
// //     if (isNaN(depositAmountValue)) {
// //       alert('Please enter a valid amount');
// //       return;
// //     }

// //     const addDepositMap = {
// //       DEPOSIT_WALLET_TOTAL: increment(depositAmountValue),
// //       DEPOSIT_WALLET_BALANCE: increment(depositAmountValue),
// //     };

// //     const addDepositMap2 = {
// //       CUSTOMER_ID: custId,
// //       AMOUNT: depositAmountValue,
// //       TYPE: 'DEPOSIT',
// //       DATE: serverTimestamp(),
// //     };

// //     const transactionMap = {
// //       AMOUNT: depositAmountValue,
// //       TRANSACTION_ID: id,
// //       TRANSACTION_TYPE: 'DEPOSIT',
// //       CUSTOMER_NAME: cusName,
// //       CUSTOMER_ID: custId,
// //       APP_VERSION: appVersion,
// //       TRANSACTION_DATE: serverTimestamp(),
// //     };

// //     try {
// //       await setDoc(doc(firestore, 'CUSTOMERS', custId), addDepositMap, { merge: true });
// //       await setDoc(doc(firestore, 'WALLET_TRANSACTION', id), addDepositMap2, { merge: true });
// //       await setDoc(doc(firestore, 'TRANSACTIONS', id), transactionMap, { merge: true });

// //       setCurrentDepositBalance((prevBalance) => prevBalance + depositAmountValue);
// //       // alert('Deposit Successful');
// //     } catch (error) {
// //       console.error('Error adding deposit: ', error);
// //     }
// //   };

// //   return (
// //     <div className="mydeposit">
// //       <div className="balance">
// //         <p>Current Balance</p>
// //         <h6>₹ {currentDepositBalance}</h6>
// //       </div>
// //       <form action="">
// //         <input
// //           type="text"
// //           placeholder="Enter Amount"
// //           className={amount ? `active enter` : "enter"}
// //           value={amount}
// //           onChange={(e) => priceHandler(e.target.value)}
// //         />
// //       </form>
// //       {error && <p className="error" >{error}</p>}
// //       <p>Enter amount to deposit to your account</p>
// //       <ul className="amounts">
// //         {price.map(({ price }, i) => (
// //           <li onClick={() => priceHandler(price)} key={i}>
// //             <p >₹{price}</p>
// //           </li>
// //         ))}
// //       </ul>
// //       <button onClick={handleOnClick} disabled={!!error}>
// //         Pay Now
// //       </button>
// //     </div>
// //   );
// // };

// // export default MyDeposit;

// import React, { useState, useEffect } from "react";
// import "./MyDeposit.css";
// import { useNavigate } from "react-router-dom";
// import {
//   setDoc,
//   doc,
//   serverTimestamp,
//   increment,
//   getDoc,
// } from "firebase/firestore";
// import { firestore } from "../../firebase";
// import { ClipLoader } from "react-spinners"; // Import the spinner component

// const MyDeposit = () => {
//   const [amount, setAmount] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false); // Add loading state
//   const [currentDepositBalance, setCurrentDepositBalance] = useState(0);
//   const navigator = useNavigate();

//   const custId = localStorage.getItem("loginUserId");
//   const cusName = localStorage.getItem("loginUserName");
//   const appVersion = "WEB";

//   useEffect(() => {
//     const fetchCurrentBalance = async () => {
//       try {
//         const docRef = doc(firestore, "CUSTOMERS", custId);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setCurrentDepositBalance(data.DEPOSIT_WALLET_BALANCE || 0);
//         } else {
//           console.log("No such document!");
//         }
//       } catch (error) {
//         console.error("Error fetching current balance: ", error);
//       }
//     };

//     fetchCurrentBalance();
//   }, [custId]);

//   const priceHandler = (amount) => {
//     setAmount(amount);
//     validateAmount(amount);
//   };

//   const validateAmount = (amount) => {
//     if (!amount) {
//       setError("Amount is required");
//       return false;
//     }
//     if (isNaN(amount)) {
//       setError("Amount must be a number");
//       return false;
//     }
//     if (Number(amount) <= 0) {
//       setError("Amount must be greater than zero");
//       return false;
//     }
//     setError("");
//     return true;
//   };

//   const handleOnClick = async () => {
//     if (validateAmount(amount)) {
//       setIsLoading(true); // Set loading to true
//       await addDeposit();
//       setIsLoading(false); // Set loading to false after processing
//       navigator("/deposucces", { replace: true });
//     }
//   };

//   const price = [
//     { id: 1, price: 50 },
//     { id: 2, price: 100 },
//     { id: 3, price: 200 },
//     { id: 5, price: 300 },
//     { id: 6, price: 400 },
//     { id: 9, price: 500 },
//   ];

//   const addDeposit = async () => {
//     const now = new Date();
//     const id = now.getTime().toString();
//     const depositAmountValue = parseInt(amount);

//     if (isNaN(depositAmountValue)) {
//       alert("Please enter a valid amount");
//       return;
//     }

//     const addDepositMap = {
//       DEPOSIT_WALLET_TOTAL: increment(depositAmountValue),
//       DEPOSIT_WALLET_BALANCE: increment(depositAmountValue),
//     };

//     const addDepositMap2 = {
//       CUSTOMER_ID: custId,
//       AMOUNT: depositAmountValue,
//       TYPE: "DEPOSIT",
//       DATE: serverTimestamp(),
//     };

//     const transactionMap = {
//       AMOUNT: depositAmountValue,
//       TRANSACTION_ID: id,
//       TRANSACTION_TYPE: "DEPOSIT",
//       CUSTOMER_NAME: cusName,
//       CUSTOMER_ID: custId,
//       APP_VERSION: appVersion,
//       TRANSACTION_DATE: serverTimestamp(),
//     };

//     try {
//       await setDoc(doc(firestore, "CUSTOMERS", custId), addDepositMap, {
//         merge: true,
//       });
//       await setDoc(doc(firestore, "WALLET_TRANSACTION", id), addDepositMap2, {
//         merge: true,
//       });
//       await setDoc(doc(firestore, "TRANSACTIONS", id), transactionMap, {
//         merge: true,
//       });
//       setCurrentDepositBalance(
//         (prevBalance) => prevBalance + depositAmountValue
//       );
//     } catch (error) {
//       console.error("Error adding deposit: ", error);
//     }
//   };

//   return (
//     <div className="mydeposit">
//       <div className="balance">
//         <p>Current Balance</p>
//         <h6>₹ {currentDepositBalance}</h6>
//       </div>
//       <form action="">
//         <input
//           type="text"
//           placeholder="Enter Amount"
//           className={amount ? `active enter` : "enter"}
//           value={amount}
//           onChange={(e) => priceHandler(e.target.value)}
//         />
//       </form>
//       {error && <p className="error">{error}</p>}
//       <p>Enter amount to deposit to your account</p>
//       <ul className="amounts">
//         {price.map(({ price }, i) => (
//           <li onClick={() => priceHandler(price)} key={i}>
//             <p>₹{price}</p>
//           </li>
//         ))}
//       </ul>
//       <button onClick={handleOnClick} disabled={isLoading || !!error}>
//         {isLoading ? <ClipLoader color="#ffffff" size={16} /> : "Pay Now"}
//       </button>
//     </div>
//   );
// };

// export default MyDeposit;

import React, { useState, useEffect } from "react";
import "./MyDeposit.css";
import { useNavigate } from "react-router-dom";
import {
  setDoc,
  doc,
  serverTimestamp,
  increment,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useCount } from "../../Context/Context";
import useApiCallCcavenue from "../../Pages/Payment_Integration/ccAvanue";
import depositAttemptUpdate from "./depositAttemptUpdate";
import { database } from "../../firebase";
import { ref, onValue, off } from "firebase/database";
import useApiCallICICI from "../../Pages/Payment_Integration/ICICPaymentIntegration";
import { toast } from "sonner";

const MyDeposit = () => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentDepositBalance, setCurrentDepositBalance] = useState(0);
  const navigator = useNavigate();

  const custId = localStorage.getItem("loginUserId");
  const cusName = localStorage.getItem("loginUserName");
  const appVersion = "WEB";
  const phone = localStorage.getItem("loginUserPhone");

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const depositSnapshot = await getDocs(
          query(
            collection(firestore, "WALLET_TRANSACTION"),
            where("CUSTOMER_ID", "==", custId),
            where("TYPE", "==", "DEPOSIT")
          )
        );
        const currentDeposit = depositSnapshot.docs.reduce(
          (sum, doc) => sum + doc.data().AMOUNT,
          0
        );

        const winningSnapshot = await getDocs(
          query(
            collection(firestore, "WALLET_TRANSACTION"),
            where("CUSTOMER_ID", "==", custId),
            where("TYPE", "==", "WINNING")
          )
        );
        const currentWinning = winningSnapshot.docs.reduce(
          (sum, doc) => sum + doc.data().AMOUNT,
          0
        );

        const takenWinningSnapshot = await getDocs(
          query(
            collection(firestore, "WALLET_TRANSACTION"),
            where("CUSTOMER_ID", "==", custId),
            where("TYPE", "in", ["PURCHASE_WINNING", "WITHDRAW"])
          )
        );
        const takenWinning = takenWinningSnapshot.docs.reduce(
          (sum, doc) => sum + doc.data().AMOUNT,
          0
        );

        const takenDepositSnapshot = await getDocs(
          query(
            collection(firestore, "WALLET_TRANSACTION"),
            where("CUSTOMER_ID", "==", custId),
            where("TYPE", "==", "PURCHASE_DEPOSIT")
          )
        );
        const takenDeposit = takenDepositSnapshot.docs.reduce(
          (sum, doc) => sum + doc.data().AMOUNT,
          0
        );

        setCurrentDepositBalance(currentDeposit - takenDeposit);
      } catch (error) {
        console.error("Error fetching wallet data: ", error);
      }
    };

    fetchWalletData();
  }, [custId]);

  const priceHandler = (amount) => {
    setAmount(amount);
    validateAmount(amount);
  };

  const validateAmount = (amount) => {
    if (!amount) {
      setError("Amount is required");
      return false;
    }
    if (isNaN(amount)) {
      setError("Amount must be a number");
      return false;
    }
    if (Number(amount) <= 0) {
      setError("Amount must be greater than zero");
      return false;
    }
    setError("");
    return true;
  };
  const { setLoading } = useCount();

  useEffect(() => {
    // const rootRef = ref(database, "0/pgWebButtons");

    // Listen for changes and update state
    const ccAvanueListener = onValue(
      ref(database, "0/pgWebButtons/CCAvanue"),
      (snapshot) => {
        if (snapshot.exists()) {
          setLockCcAvanue(snapshot.val().toString());
        }
      }
    );

    const upiIntentListener = onValue(
      ref(database, "0/pgWebButtons/UpiIntent"),
      (snapshot) => {
        if (snapshot.exists()) {
          setLockUpiIdent(snapshot.val().toString());
        }
      }
    );

    const gateWayScreenListener = onValue(
      ref(database, "0/pgWebButtons/gateWayScreen"),
      (snapshot) => {
        if (snapshot.exists()) {
          setLockGateWay(snapshot.val().toString());
        }
      }
    );

    const iciciGateWayListener = onValue(
      ref(database, "0/pgWebButtons/iciciGateWay"),
      (snapshot) => {
        if (snapshot.exists()) {
          setLockIciciPlus(snapshot.val().toString());
        }
      }
    );

    // Clean up listeners when component unmounts
    return () => {
      off(ref(database, "0/pgWebButtons/CCAvanue"), "value", ccAvanueListener);
      off(
        ref(database, "0/pgWebButtons/UpiIntent"),
        "value",
        upiIntentListener
      );
      off(
        ref(database, "0/pgWebButtons/gateWayScreen"),
        "value",
        gateWayScreenListener
      );
      off(
        ref(database, "0/pgWebButtons/iciciGateWay"),
        "value",
        iciciGateWayListener
      );
    };
  }, []);
  const { apiCallCcavenue, isCCAvCheck, apiCallCcavenueDeposit } =
    useApiCallCcavenue();
  const { apiCallICICI, isICICICheck, apiCallICICIDeposit } = useApiCallICICI();
  const [lockCcAvanue, setLockCcAvanue] = useState("OFF");
  const [lockUpiIdent, setLockUpiIdent] = useState("OFF");
  const [lockGateWay, setLockGateWay] = useState("OFF");
  const [lockIciciPlus, setLockIciciPlus] = useState("OFF");
  const handleOnClick = async () => {
    if (amount) {
      const orderID = Date.now().toString() + generateRandomString(2);
      function generateRandomString(length) {
        const availableChars =
          "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
        let randomString = "";
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * availableChars.length);
          randomString += availableChars[randomIndex];
        }
        return randomString;
      }
      if (validateAmount(amount)) {
        setIsLoading(true); // Set loading to true

        setLoading(true);

        const cusId = localStorage.getItem("loginUserId");
        const loginUserPhone = localStorage.getItem("loginUserPhone");
        const name = localStorage.getItem("loginUserName");

        await depositAttemptUpdate(
          orderID,
          amount,
          cusId,
          cusName,
          loginUserPhone,
          "CCAVANUE",
          ""
        );
      }
      // await addDeposit();
      setIsLoading(false); // Set loading to false after processing
      // navigator("/deposucces", { replace: true });

      if (
        lockCcAvanue === "ON" &&
        lockGateWay !== "ON" &&
        lockIciciPlus !== "ON"
      ) {
        apiCallCcavenueDeposit(orderID, amount, cusName, phone, custId); // Call CCAvenue API
      } else if (
        lockCcAvanue !== "ON" &&
        lockGateWay !== "ON" &&
        lockIciciPlus === "ON"
      ) {
        apiCallICICIDeposit(orderID, amount, cusName, phone, custId); // Call ICICI Payment Integration
      } else if (lockGateWay === "ON") {
        navigator("/deposiey", {
          state: { Amounts: amount, orderID: orderID },
        });
      }
    } else {
      toast.error("Enter a Valid Amout");
    }
  };

  const price = [
    { id: 1, price: 50 },
    { id: 2, price: 100 },
    { id: 3, price: 200 },
    { id: 5, price: 300 },
    { id: 6, price: 400 },
    { id: 9, price: 500 },
  ];

  const addDeposit = async () => {
    const now = new Date();
    const id = now.getTime().toString();
    const depositAmountValue = parseInt(amount);

    if (isNaN(depositAmountValue)) {
      alert("Please enter a valid amount");
      return;
    }

    const addDepositMap = {
      DEPOSIT_WALLET_TOTAL: increment(depositAmountValue),
      DEPOSIT_WALLET_BALANCE: increment(depositAmountValue),
    };

    const addDepositMap2 = {
      CUSTOMER_ID: custId,
      AMOUNT: depositAmountValue,
      TYPE: "DEPOSIT",
      DATE: serverTimestamp(),
    };

    const transactionMap = {
      AMOUNT: depositAmountValue,
      TRANSACTION_ID: id,
      TRANSACTION_TYPE: "DEPOSIT",
      CUSTOMER_NAME: cusName,
      CUSTOMER_ID: custId,
      APP_VERSION: appVersion,
      TRANSACTION_DATE: serverTimestamp(),
    };

    try {
      await setDoc(doc(firestore, "CUSTOMERS", custId), addDepositMap, {
        merge: true,
      });
      await setDoc(doc(firestore, "WALLET_TRANSACTION", id), addDepositMap2, {
        merge: true,
      });
      await setDoc(doc(firestore, "TRANSACTIONS", id), transactionMap, {
        merge: true,
      });
      setCurrentDepositBalance(
        (prevBalance) => prevBalance + depositAmountValue
      );
    } catch (error) {
      console.error("Error adding deposit: ", error);
    }
  };

  return (
    <div className="mydeposit">
      <div className="balance">
        <p>Current Balance</p>
        <h6>₹ {currentDepositBalance.toFixed(2)}</h6>
      </div>
      <form action="">
        <input
          type="number"
          placeholder="Enter Amount"
          className={amount ? `active enter` : "enter"}
          value={amount}
          onChange={(e) => priceHandler(e.target.value)}
        />
      </form>
      {error && <p className="error">{error}</p>}
      <p>Enter amount to deposit to your account</p>
      <ul className="amounts">
        {price.map(({ price }, i) => (
          <li onClick={() => priceHandler(price)} key={i}>
            <p>₹{price}</p>
          </li>
        ))}
      </ul>
      <button onClick={handleOnClick} disabled={isLoading || !!error}>
        {isLoading ? <ClipLoader color="#ffffff" size={16} /> : "Pay Now"}
      </button>
    </div>
  );
};

export default MyDeposit;

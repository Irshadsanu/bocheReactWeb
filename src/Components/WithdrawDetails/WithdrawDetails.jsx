import React, { useEffect, useState } from "react";
import "./WithdrawDetails.css";
import AccountDetails from "../../Components/AccoutDetails/AccoutDetails";
import { Button } from "../Button/Button";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCount } from "../../Context/Context";
import { toast } from "sonner";
import TdsAlert from "./TdsAlert";
import { set } from "firebase/database";

const WithdrawDetails = () => {
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [amount, setAmount] = useState();
  const cusId = localStorage.getItem("loginUserId");
  const cusName = localStorage.getItem("loginUserName");
  const cusPhone = localStorage.getItem("loginUserPhone");

  const [holderName, setHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [ifceCode, setIfceCode] = useState("");
  const [pan, setPan] = useState("");

  const [hasBankData, setHasBankData] = useState(true);

  const [showTdsAlert, setShowTdsAlert] = useState(false);

  const [isRadioChecked, setIsRadioChecked] = useState(false);

  const [tdsToPay, setTdsToPay] = useState(0);

  //   const [
  //     payableTdsAmountWithdrawUserSide,
  //     setPayableTdsAmountWithdrawUserSide,
  //   ] = useState(0.0);
  const [totalWithdrawalUserSide, setTotalWithdrawalUserSide] = useState(0.0);

  // Calculate the start and end of the financial year
  const now = new Date();
  let startOfYear = new Date(now.getFullYear(), 3, 1); // April 1st
  if (now < startOfYear) {
    startOfYear = new Date(now.getFullYear() - 1, 3, 1);
  }
  const endOfYear = new Date(startOfYear.getFullYear() + 1, 2, 31, 23, 59, 59);

  useEffect(() => {
    // const fetchTransactions = async () => {

    //   const transactionsQuery = query(
    //     collection(firestore, "WALLET_TRANSACTION"),
    //     where("CUSTOMER_ID", "==", cusId),
    //     where("TYPE", "==", "WITHDRAW_REQUEST"),
    //     where("DATE", ">=", startOfYear),
    //     where("DATE", "<=", endOfYear),
    //     orderBy("DATE", "desc")
    //   );

    //   const querySnapshot = await getDocs(transactionsQuery); // No need to call getDocs twice

    //   if (querySnapshot.empty) {
    //     console.log("No transactions found.");
    //   } else {
    //     console.log("Transactions fetched successfully.");
    //   }

    //   let totalAmount = 0.0;
    //   let totalTdsAmount = 0.0;

    //   querySnapshot.forEach((doc) => {
    //     const data = doc.data();

    //     console.log("Transaction Data:", data.AMOUNT); // Log each document's data

    //     totalAmount += data.AMOUNT ?? 0.0;
    //     totalTdsAmount += data.TDS_AMOUNT ?? 0.0;
    //   });

    //   // Update state with the computed totals
    //   setTotalWithdrawalUserSide(totalAmount + totalTdsAmount);
    //   console.log(totalAmount, "total amout");
    //   console.log(totalTdsAmount, "tds");
    // };

    const fetchTransactions = async () => {
      try {
        console.log("Fetching transactions...");

        const transactionsQuery = query(
          collection(firestore, "WALLET_TRANSACTION"),
          where("CUSTOMER_ID", "==", cusId),
          where("TYPE", "==", "WITHDRAW_REQUEST"),
          where("DATE", ">=", startOfYear),
          where("DATE", "<=", endOfYear),
          orderBy("DATE", "desc")
        );

        const querySnapshot = await getDocs(transactionsQuery);

        if (querySnapshot.empty) {
          console.log("No transactions found.");
        } else {
          console.log("Transactions fetched successfully.");
        }

        let totalAmount = 0.0;
        let totalTdsAmount = 0.0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // console.log("Transaction Data:", data); // Log each document's data

          const amount = parseFloat(data.AMOUNT) || 0.0;
          const tdsAmount = parseFloat(data.TDS_AMOUNT) || 0.0;

          // console.log("Parsed AMOUNT:", amount); // Log parsed values
          // console.log("Parsed TDS_AMOUNT:", tdsAmount);

          totalAmount += amount;
          totalTdsAmount += tdsAmount;
        });

        console.log("Total Amount:", totalAmount);
        console.log("Total TDS Amount:", totalTdsAmount);

        setTotalWithdrawalUserSide(totalAmount + totalTdsAmount);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [cusPhone, startOfYear, endOfYear]);

  // TDS Calculation Logic
  //   const tdsCalculationScratchAndWin = (amount, totalWithdrawalUserSide) => {
  //     let payableTDS = 0.0;
  //     if (totalWithdrawalUserSide > 10000) {
  //       payableTDS = amount * 0.33;
  //     } else if (totalWithdrawalUserSide + amount > 10000) {
  //       const balance = totalWithdrawalUserSide + amount - 10000;
  //       payableTDS = balance * 0.33;
  //     }

  //     setPayableTdsAmountWithdrawUserSide(payableTDS);
  //     console.log(payableTDS, "payable tds");
  //   };

  let payableTdsAmountWithdrawUserSide = 0.0;

  const tdsCalculationScratchAndWin = (
    controllerAmount,
    totalWithdrawThisMonth
  ) => {
    // If the total withdrawn this month exceeds 10,000, apply 33% TDS on the current controller amount
    if (totalWithdrawThisMonth > 10000) {
      payableTdsAmountWithdrawUserSide = controllerAmount * 0.33;
      console.log(
        "heloooo this functionis ssssssssssssssssssssssss.l,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,"
      );

    }
    // If the total withdrawn + current controller amount exceeds 10,000, apply TDS only on the amount exceeding 10,000
    else if (totalWithdrawThisMonth + controllerAmount > 10000) {

      console.log("heloooofffffffffffffffff.l,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");

      const excessAmount = totalWithdrawThisMonth + controllerAmount - 10000;

      payableTdsAmountWithdrawUserSide = excessAmount * 0.33;
 
    }
    // If the total withdrawn this month doesn't exceed 10,000, no TDS is applied
    else {
      payableTdsAmountWithdrawUserSide = 0.0;
      console.log(
        "heloooo this functionis falise.l,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,"
      );
     
    }

    setTdsToPay(payableTdsAmountWithdrawUserSide);

    console.log("Calculated TDS:", payableTdsAmountWithdrawUserSide);

    
    return payableTdsAmountWithdrawUserSide;
  };

  // const tdsCalculationScratchAndWin = (
  //   controllerAmount,
  //   totalWithdrawThisMonth
  // ) => {
  //   if (totalWithdrawThisMonth > 10000) {

  //     console.log(totalWithdrawThisMonth, "this totalWithdrawThisMonth....................... ")
  //     console.log(controllerAmount, "this controllerAmount....................... ")

  //     payableTdsAmountWithdrawUserSide = controllerAmount * 0.33;
  //   } else if (totalWithdrawThisMonth + controllerAmount > 10000) {
  //     const excessAmount = totalWithdrawThisMonth + controllerAmount - 10000;
  //     payableTdsAmountWithdrawUserSide = excessAmount * 0.33;
  //   } else {
  //     payableTdsAmountWithdrawUserSide = 0.0;
  //     setShowTdsAlert(false);
  //   }

  //   return payableTdsAmountWithdrawUserSide;
  // };

  // const handleRedeemCLick = () => {
  //   if (amount) {
  //     tdsCalculationScratchAndWin(amount, totalWithdrawalUserSide);

  //     if (!hasBankData || !isRadioChecked) {
  //       //   alert("Choose your Bank");
  //       toast.warning("Choose your Bank or Select the active account");
  //       return;
  //     }

  //     if (currentWinningBalance >= amount) {


  //       setShowTdsAlert(true);

  //     } else {
  //       toast.error("No Sufficient Balance");
  //     }
  //   } else {
  //     toast.error("enter a  valid amout");
  //   }
  // };


  const handleRedeemCLick = async () => {
    if (amount) {
      // If tdsCalculationScratchAndWin is async, await its result.
       tdsCalculationScratchAndWin(amount, totalWithdrawalUserSide);
  
      if (!hasBankData || !isRadioChecked) {
        toast.warning("Choose your Bank or Select the active account");
        return;
      }

   
  
      if (currentWinningBalance >= amount) {
        // Ensure the value of tdsToPay is available after tdsCalculationScratchAndWin
        if (tdsToPay> 0 || payableTdsAmountWithdrawUserSide == 0 ) {

          console.log("No TDS to pay (tdsToPay is 0 or falsy)");
          try {
            // Proceed with the withdrawal function
             requestForWithdrawFun(
              cusId,
              amount,
              bankName,
              holderName,
              accountNumber,
              ifceCode,
              pan,
              tdsToPay // Pass the TDS value, even if it's zero
            );
  
            toast.success("Success!");
            console.log("Success to redeem");
            return; // Return after successful withdrawal
          } catch (error) {
            console.error("Error during withdrawal:", error);
          }
        } else {
          setShowTdsAlert(true); // Trigger TDS alert immediately if TDS is required
          console.log("TDS to pay:", tdsToPay);
        }
      } else {
        toast.error("No Sufficient Balance");
      }
    } else {
      toast.error("Enter a valid amount");
    }
  };

  


  const handleContinue = () => {
    setShowTdsAlert(false);

    // Proceed with the withdrawal function
    requestForWithdrawFun(
      cusId,
      amount,
      bankName,
      holderName,
      accountNumber,
      ifceCode,
      pan,
      // payableTdsAmountWithdrawUserSide
      tdsToPay
    );

    // alert("Success!");
    toast.success("Success!");
    console.log("Success to redeem");
  };

  const handleCancel = () => {
    setShowTdsAlert(false);
    console.log("Action canceled");
  };

  const navigate = useNavigate();

  const handlePrevious = () => {
    navigate(-1);
  };

  const hasData = accountNumber.length > 0;

  const handleButtonClick = () => {
    setShowNewAddressForm(true);
  };

  const priceHandler = (amount) => {
    setAmount(amount);
  };

  const price = [
    { id: 1, price: 50 },
    { id: 2, price: 100 },
    { id: 3, price: 200 },
    { id: 5, price: 300 },
    { id: 6, price: 400 },
    { id: 9, price: 500 },
  ];

  const fetchData = async () => {
    try {
      const ref = doc(firestore, "CUSTOMERS", cusId);
      const docSnap = await getDoc(ref);

      if (docSnap.exists()) {
        const data = docSnap.data();
        // console.log("Document data:", data); // Logging the fetched data
        setBankName(data.BANK_NAME || "");
        setHolderName(data.ACCOUNT_HOLDER_NAME || "");
        setAccountNumber(data.ACCOUNT_NUMBER || "");
        setIfceCode(data.IFSC || "");
        setPan(data.PAN_CARD_NUMBER || "");
        setShowNewAddressForm(false); // Hide form after fetching data
        setHasBankData(true);
      } else {
        console.log("No such document!");
        setHasBankData(false);
      }
    } catch (error) {
      console.log("Error fetching document: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [cusId]);

  const [walletTransactionList, setWalletTransactionList] = useState([]);
  const { currentWinningBalance, setCurrentWinningBalance } = useCount();

  const requestForWithdrawFun = (
    userId,
    amount,
    bankName,
    holderName,
    accountNumber,
    ifceCode,
    pan,
    // payableTdsAmountWithdrawUserSide
    tdsToPay
  ) => {
    const now = new Date();
    const nowEpoch = now.getTime();

    //change all value of the "payableTdsAmountWithdrawUserSide" to  tdsToPay (21/09)

    const walletMap = {
      TYPE: "WITHDRAW_REQUEST",
      AMOUNT: amount - tdsToPay,
      DATE: now,
      CUSTOMER_ID: userId,
      CUSTOMER_NAME: cusName,
      CUSTOMER_PHONE: cusPhone,
      TDS_AMOUNT: tdsToPay,
      //  payableTdsAmountWithdrawUserSide,
    };

    const mapTransaction = {
      AMOUNT: amount - tdsToPay,
      TRANSACTION_TYPE: "WITHDRAW_REQUEST",
      DATE: now,
      CUSTOMER_ID: userId,
      CUSTOMER_NAME: cusName,
      CUSTOMER_PHONE: cusPhone,
      TDS_AMOUNT: tdsToPay,
      //  payableTdsAmountWithdrawUserSide,
    };

    const mapWithdraw = {
      AMOUNT: amount - tdsToPay,
      TRANSACTION_TYPE: "WITHDRAW_REQUEST",
      DATE: now,
      CUSTOMER_ID: userId,
      TRANSACTION_ID: nowEpoch.toString(),
      STATUS: "PENDING",
      BANK_NAME: bankName,
      ACCOUNT_HOLDER_NAME: holderName,
      ACCOUNT_NUMBER: accountNumber,
      IFSC: ifceCode,
      CUSTOMER_NAME: cusName,
      CUSTOMER_PHONE: cusPhone,
      PAN_CARD_NUMBER: pan,
      TDS_AMOUNT: tdsToPay,
      //  payableTdsAmountWithdrawUserSide,
    };

    setDoc(
      doc(firestore, "WALLET_TRANSACTION", nowEpoch.toString()),
      walletMap,
      { merge: true }
    );
    setDoc(
      doc(firestore, "TRANSACTIONS", nowEpoch.toString()),
      mapTransaction,
      { merge: true }
    );
    setDoc(
      doc(firestore, "WITHDRAW_REQUESTS", nowEpoch.toString()),
      mapWithdraw,
      { merge: true }
    );

    const updatedBalance = (parseFloat(currentWinningBalance) - amount).toFixed(
      0
    );
    setCurrentWinningBalance(updatedBalance);

    const newTransaction = {
      id: nowEpoch.toString(),
      amount: amount,
      customerId: userId,
      transactionType: "WITHDRAW_REQUESTS",
      date: now,
    };

    setWalletTransactionList([newTransaction, ...walletTransactionList]);
  };

  return (
    <div className="withdrawdetails">
      <div className="back_arrow_container">
        <FaChevronLeft onClick={handlePrevious} />
      </div>
      <div className="balance">
        <p>Current Balance</p>
        <h6>₹ {currentWinningBalance}</h6>
      </div>
      <form action="">
        <input
          type="text"
          placeholder="Enter Amount"
          className={amount ? `active enter` : "enter"}
          value={amount}
          onChange={(e) => priceHandler(Number(e.target.value))}
        />
      </form>
      <p>Enter amount to Withdraw to your account</p>
      <ul className="amounts">
        {price.map(({ price }, i) => (
          <li onClick={() => priceHandler(price)} key={i}>
            <p>₹{price}</p>
          </li>
        ))}
      </ul>

      {hasData ? (
        <div className="withdrw-bank">
          <h4>Withdraw to</h4>
          <div className="bank-details">
            <div className="bank">
              <p>Name: {holderName}</p>
              <p>Bank name: {bankName}</p>
              <p>Account number: {accountNumber}</p>
              <p>IFSC code: {ifceCode}</p>
              <p>Pan :{pan}</p>
            </div>
            <div className="edit-change">
              <div className="edit" onClick={handleButtonClick}>
                Edit
              </div>
              <input
                value={isRadioChecked}
                onChange={() => setIsRadioChecked(!isRadioChecked)}
                type="radio"
              />
            </div>
          </div>
        </div>
      ) : (
        <button className="btn-bank" onClick={handleButtonClick}>
          Add Bank Account
        </button>
      )}

      {showNewAddressForm && (
        <AccountDetails
          onSaveSuccess={fetchData}
          existingDetails={{
            holderName,
            accountNumber,
            ifceCode,
            bankName,
            pan,
          }}
        />
      )}

      {/* <Button title="Redeem Now" /> */}
      <button onClick={handleRedeemCLick} className="redeembtn">
        Redeem Now
      </button>

      {showTdsAlert && (
        <TdsAlert
          widthrawAmount={amount}
          tdsToPay={tdsToPay}
          onCancel={handleCancel}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};

export default WithdrawDetails;

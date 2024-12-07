import React, { useEffect, useState } from "react";
import "./SelectPayment.css";
import { FaChevronLeft } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link, useHistory, useLocation, useNavigate } from "react-router-dom";
import { CiWallet } from "react-icons/ci";
import ClipLoader from "react-spinners/ClipLoader";
import { useCount } from "../../Context/Context";
import useApiCallCcavenue from "../../Pages/Payment_Integration/ccAvanue";
import attemptUpdation from "./atempt_updation";

import multiAttemptUpdation from "./multi_attempt_updation"

import {
  doc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { database, firestore } from "../../firebase";
import updatePaymentForWallet from "./updatePaymentForWallet";
import useApiCallICICI from "../../Pages/Payment_Integration/ICICPaymentIntegration";
import { ref, onValue, off } from "firebase/database";
import { toast } from "sonner";
import multiUpdatePaymentForWallet from "./multiUpdatePaymentForWallet ";

let dedeuctDepositAmonunt;
let deductWinningAmount;
let deductPayAmount;






const SelectPayment = ({
  deliveryRate,
  setStep,
  setDeliveryRate,
  estimatedDays,
  courierName,
  courierId,
  handleBackToAddress,
  setEstimatedDays,
  setCourierName,
  setCourierId,
  grandtotalFromCart,
  productList,
  // productName
  // productWeight

}) => {

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [showQuestionBox, setShowQuestionBox] = useState(false);
  const [problemSolved, setProblemSolved] = useState(false);
  const navigator = useNavigate();

  const loginUserPincode = localStorage.getItem("loginUserPincode")
  const  loginUserPlace = localStorage.getItem("loginUserPlace")
  const loginUserPhoto = localStorage.getItem("loginUserPhoto")

  const {
    totalPrice,
    count,
    loading,
    setLoading,
    lastUsedDeliveryAddress,
    pincode,
    lastUsedDeliveryName,
    lastUsedDeliveryNumber,
    selecteaddress,
    setReady,
    setShowCount,

  } = useCount();

  const location = useLocation();
  console.log(location.state.from,"stateesdfsdee")

const { totalWeight, totalQuatity, from, cartState, price, itemImg, productWeight,allocatedTicket,singleproductTotalWeight,productName,productPrice,productImage, igst , cgst , sgst} = location.state || {}; // Fallback to empty object if state is undefined

console.log(productName,"nameeeeeasdfasdf")

  useEffect(() => {
    console.log(deductWinningAmount, "deductWinningAmount");
  }, [courierName]);

  useEffect(() => {
    console.log(dedeuctDepositAmonunt, "dedeuctDepositAmonunt");
  }, [courierId]);

  useEffect(() => {
    console.log(estimatedDays, "estimatedDays");
  }, [estimatedDays]);

  useEffect(() => {
    console.log(deliveryRate, "deliveryRate");
    console.log(typeof deliveryRate, "deliveryRate data type ............");
  }, [deliveryRate]);

  // console.log(grandtotalFromCart, "grandtotalFromCart: on ")

  const generateUniqueOptions = (correctAnswer) => {
    const random = Math.random;
    const newOptions = new Set();
    newOptions.add(correctAnswer);

    while (newOptions.size < 4) {
      newOptions.add(Math.floor(random() * 20));
    }

    return Array.from(newOptions);
  };

  const generateQuestion = () => {
    const random = Math.random;
    const newNum1 = Math.floor(random() * 10) + 1;
    const newNum2 = Math.floor(random() * 10) + 1;
    const newCorrectAnswer = newNum1 + newNum2;

    let newOptions = generateUniqueOptions(newCorrectAnswer);

    newOptions = shuffleArray(newOptions);

    setNum1(newNum1);
    setNum2(newNum2);
    setCorrectAnswer(newCorrectAnswer);
    setOptions(newOptions);
    setSelectedOption(null);
    setMessage("");
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // useEffect(() => {
  //   generateQuestion();
  //   setRemainingBalance(totalPrice);
  //   setchangeRemainingBalance(totalPrice);
  // }, []);

  useEffect(() => {
    generateQuestion();

    // Update remaining balance only if grandtotalFromCart is available
    if (grandtotalFromCart !== undefined && grandtotalFromCart !== null) {
        setRemainingBalance(grandtotalFromCart);
        setchangeRemainingBalance(grandtotalFromCart);
    } else {
        setRemainingBalance(totalPrice);
        setchangeRemainingBalance(totalPrice);
    }
}, []); // Only watch for changes in grandtotalFromCart



  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option === correctAnswer) {
      setMessage("Correct!");
      setProblemSolved(true);
      setShowQuestionBox(false);
    } else {
      setMessage("Try again!");
      setProblemSolved(false);
    }
  };

  const handleNext = () => {
    setOpen(true);
    setMessage("");
  };
  const [attachedCount, setAttachedCount] = useState();
  const productId = localStorage.getItem("productId");

  const fetchProduct = async () => {
    const docRef = doc(firestore, "PRODUCTS", productId);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const attachedCount = snapshot.data().TICKET_COUNT;
      console.log(attachedCount, "this is attached count");
      setAttachedCount(attachedCount); // Assuming you have a setAttachedCount function
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    fetchProduct();
  });

  const [currentDepositBalance, setCurrentDepositBalance] = useState(0);
  const [currentWinningBalance, setCurrentWinningBalance] = useState(0);
  const [changeDepositBalance, setChangeDepositBalance] = useState(0);
  const [changeWinningBalance, setChangeWinningBalance] = useState(0);

  const { apiCallCcavenue, isCCAvCheck } = useApiCallCcavenue();
  const { apiCallICICI, isICICICheck } = useApiCallICICI();
  const [lockCcAvanue, setLockCcAvanue] = useState("OFF");
  const [lockUpiIdent, setLockUpiIdent] = useState("OFF");
  const [lockGateWay, setLockGateWay] = useState("OFF");
  const [lockIciciPlus, setLockIciciPlus] = useState("OFF");

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

  const handleClick = async (e) => {
    e.preventDefault();

    if (!problemSolved) {
        // alert("Please solve the problem first.");
       toast.error("Please solve the problem first.");
        setShowQuestionBox(!showQuestionBox);
    } 
    else {

    setLoading(true);

    const paymentId = Date.now().toString() + generateRandomString(2);
    const amount = 1;
    const loginUserId = localStorage.getItem("loginUserId");
    const phone = localStorage.getItem("loginUserPhone");
    const name = localStorage.getItem("loginUserName");
    const proId = localStorage.getItem("productId");
    const proPrice = localStorage.getItem("productPrice");
    const proImgs = localStorage.getItem("productImages");

    //   navigator("/home", { state: { from: "coupen" } });

    console.log(paymentId, "edsefsfsfsfsfsrf");

    const apiResults = {
      deliveryRate: deliveryRate ? deliveryRate : 0,
      courierId: courierId,
      courierName: courierName,
      estimatedDays: estimatedDays,
    };


    console.log(apiResults,"apiiresltsssssss")



        console.log(productList, "....*****..... product list")

              //Mulit attempt updation ///////////////////////////////

              if (productList != undefined && productList.length > 0) {

                console.log("Multi attempt updation...000000000000");

                await multiAttemptUpdation (
                  paymentId,
                  changeRemainingBalance,
                  loginUserId,
                  name,
                  phone,
                  grandtotalFromCart,
                  "CCAVANUE",
                  "",
                  dedeuctDepositAmonunt,
                  deductWinningAmount,
                  changeRemainingBalance,
                  apiResults,
                  productList,
                  lastUsedDeliveryAddress,
                  lastUsedDeliveryName,
                  lastUsedDeliveryNumber,
                  selecteaddress,
                  deliveryRate,
                  courierId,
                  courierName,
                  estimatedDays,
                )

                console.log(

                  paymentId ,"=== orderID",
                  amount, "=== amount",
                  loginUserId ,"=== cusId",
                  name, "=== cusName",
                  phone , "=== loginUserPhone",
                  grandtotalFromCart, "=== orderAmount",

                  "CCAVANUE", "=== paymentApp" ,

                  "" , "=== paymentUpi",
                  dedeuctDepositAmonunt ,"=== depositWallet",

                  deductWinningAmount, "=== winningWallet",

                  changeRemainingBalance ,"=== paidAmount",

                  apiResults,"=== apiResults",

                  productList,"=== productList",

                  lastUsedDeliveryAddress,"=== lastUsedDeliveryAddress",

                  lastUsedDeliveryName,"=== lastUsedDeliveryName",

                  lastUsedDeliveryNumber,"=== lastUsedDeliveryNumber",

                  selecteaddress,"=== selecteaddress",

                  deliveryRate,"=== deliveryRate",

                  courierId,"=== courierId",
                  courierName,"=== courierName",
                  estimatedDays,"=== estimatedDays",
                  
                )
            
              } else {

                console.log(productList,"Single attempt updation");
                console.log("attempt updation..........")

                await attemptUpdation(

                  paymentId,
                  grandTotal,
                  loginUserId,
                  name,
                  proId,
                  count,
                  proPrice,
                  phone,
                  grandTotal,
                  proImgs,
                  "CCAVANUE",
                  "",
                  lastUsedDeliveryAddress,
                  lastUsedDeliveryName,
                  lastUsedDeliveryNumber,
                  selecteaddress,
                  deliveryRate,
                  courierId, // Ensure courierId is correctly passed
                  courierName, // Ensure courierName is correctly passed
                  estimatedDays, // Ensure estimatedDays is correctly passed
                  dedeuctDepositAmonunt,
                  deductWinningAmount,
                  changeRemainingBalance,
                  allocatedTicket,
                  productWeight,
                  productName
                )
              }
        
  
    
      // const mainProvider = useContext(MainProviderContext);

      if (changeRemainingBalance > 0) {
        if (
          lockCcAvanue === "ON" &&
          lockGateWay !== "ON" &&
          lockIciciPlus !== "ON"
        ) {
          apiCallCcavenue(paymentId, amount, name, phone, loginUserId); // Call CCAvenue API
        } else if (
          lockCcAvanue !== "ON" &&
          lockGateWay !== "ON" &&
          lockIciciPlus === "ON"
        ) {
          apiCallICICI(paymentId, amount, name, phone, loginUserId); // Call ICICI Payment Integration
        } else if (lockGateWay === "ON") {
          navigator("/option", {
            state: { PaymentId: paymentId, Amounts: amount, Phone: phone },
          });
        }

        // navigator("/option");
        setLoading(false);
        // apiCallCcavenue(paymentId, amount, name, phone, loginUserId);
      } else {
        // if(location.state.from == "cart"){

        if(productList != undefined && productList.length > 0){

          console.log("going to multiwallettt")

          multiUpdatePaymentForWallet (

            paymentId,
            "WALLET",
            grandTotal,
            loginUserId,
            name,
            productList,
            // proId,
            // productName,
            // proImgs,
            // proPrice,
            phone,
            loginUserPlace,
            loginUserPhoto,
            dedeuctDepositAmonunt,
            deductWinningAmount,
            remainingBalance,
            apiResults,
            dedeuctDepositAmonunt,
            deductWinningAmount,
            navigator,
            selecteaddress,
            lastUsedDeliveryName,
            lastUsedDeliveryNumber,
            lastUsedDeliveryAddress,
            count,
            grandTotal,
            custPhone,
            name,
            loginUserPincode
            
          )

        } else {

          console.log(productList,"THIS IS FOR SINGLEpro WALLET PAYMENT")
        
        updatePaymentForWallet(
          paymentId,
          "WALLET",
          changeRemainingBalance,
          loginUserId,
          name,
          proId,
          productName,
          proImgs,
          proPrice,
          phone,
          loginUserPlace,
          loginUserPhoto,
          dedeuctDepositAmonunt,
          deductWinningAmount,
          remainingBalance,
          apiResults,
          dedeuctDepositAmonunt,
          deductWinningAmount,
          navigator,
          selecteaddress,
          lastUsedDeliveryName,
          lastUsedDeliveryNumber,
          lastUsedDeliveryAddress,
          count,
          grandTotal,
          custPhone,
          name,
          loginUserPincode,
          productWeight
        );
      }
        // console.log("errorrr ")
        setLoading(false)
      }
   

    console.log(
      dedeuctDepositAmonunt,
      "dedeuctDepositAmonunt................ fro functin"
    );

   
    // }
    }
  };

  const handleBack = () => {
    setStep("address");
    setDeliveryRate(0);
    setEstimatedDays("NIL");
    setCourierName("NIL");
    setCourierId(0);
    setReady(false);
    setShowCount(true);
  };

  useEffect(() => {
    setchangeRemainingBalance(grandTotal);
  }, [deliveryRate]);

  const [isChecked, setIsChecked] = useState(false);
  const [remainingBalance, setRemainingBalance] = useState();
  const [changeRemainingBalance, setchangeRemainingBalance] = useState();
  const [transactions, setTransactions] = useState();


  const handleRadioClick = () => {

    setIsChecked(!isChecked);

    if (!isChecked) {
      if (currentDepositBalance >= grandTotal) {
        const remainDeposit = currentDepositBalance - grandTotal;
        dedeuctDepositAmonunt = grandTotal;
        deductWinningAmount = 0;
        deductPayAmount = 0;
        console.log(remainDeposit);
        setChangeDepositBalance(remainDeposit);
        setchangeRemainingBalance(0);
      } else {
        const payAmount = grandTotal - currentDepositBalance;
        dedeuctDepositAmonunt = currentDepositBalance;
        setChangeDepositBalance(0);
        if (currentWinningBalance >= payAmount) {
          const winningRemain = currentWinningBalance - payAmount;
          deductWinningAmount = payAmount;
          deductPayAmount = 0;
          setChangeWinningBalance(winningRemain);
          setchangeRemainingBalance(0);
        } else {
          const remainingPay = payAmount - currentWinningBalance;
          deductWinningAmount = currentWinningBalance;
          deductPayAmount = remainingPay;
          setChangeWinningBalance(0);
          setchangeRemainingBalance(remainingPay);
        }
      }
    } else {
      dedeuctDepositAmonunt = 0;
      deductWinningAmount = 0;
      deductPayAmount = grandTotal;
      setChangeDepositBalance(currentDepositBalance);
      setChangeWinningBalance(currentWinningBalance);
      setchangeRemainingBalance(grandTotal);
    }

    console.log(dedeuctDepositAmonunt, "dedeuctDepositAmonunt");
    console.log(deductWinningAmount, "deductWinningAmount");
    console.log(deductPayAmount, "deductPayAmount");
    console.log(changeRemainingBalance,"lasttotallll")
  };

  const custPhone = localStorage.getItem("loginUserPhone");


  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const depositSnapshot = await getDocs(
          query(
            collection(firestore, "WALLET_TRANSACTION"),
            where("CUSTOMER_PHONE", "==", custPhone),
            where("TYPE", "in", ["DEPOSIT","DEPOSIT_CREDIT"])
          )
        );
        const currentDeposit = depositSnapshot.docs.reduce(
          (sum, doc) => sum + doc.data().AMOUNT,
          0
        );

        const winningSnapshot = await getDocs(
          query(
            collection(firestore, "WALLET_TRANSACTION"),
            where("CUSTOMER_PHONE", "==", custPhone),
            where("TYPE", "in", ["WINNING", "USING_SCRATCH_AND_WIN","WINNING_CREDIT"])
          )
        );
        const currentWinning = winningSnapshot.docs.reduce(
          (sum, doc) => sum + doc.data().AMOUNT,
          0
        );

        const takenWinningSnapshot = await getDocs(
          query(
            collection(firestore, "WALLET_TRANSACTION"),
            where("CUSTOMER_PHONE", "==", custPhone),
            where("TYPE", "in", [
              "PURCHASE_WINNING",
              "WITHDRAW",
              "WITHDRAW_REQUEST",
               "WINNING_DEBIT"
            ])
          )
        );
        const takenWinning = takenWinningSnapshot.docs.reduce(
          (sum, doc) => sum + doc.data().AMOUNT,
          0
        );

        const takenDepositSnapshot = await getDocs(
          query(
            collection(firestore, "WALLET_TRANSACTION"),
            where("CUSTOMER_PHONE", "==", custPhone),
            where("TYPE", "in", ["PURCHASE_DEPOSIT","DEPOSIT_DEBIT"])
          )
        );
        const takenDeposit = takenDepositSnapshot.docs.reduce(
          (sum, doc) => sum + doc.data().AMOUNT,
          0
        );

        setCurrentDepositBalance(currentDeposit - takenDeposit);
        setCurrentWinningBalance(currentWinning - takenWinning);
        setChangeDepositBalance(currentDeposit - takenDeposit);
        setChangeWinningBalance(currentWinning - takenWinning);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    const fetchTransactions = async (cusId, type) => {
      try {
        const snapshot = await getDocs(
          query(
            collection(firestore, "WALLET_TRANSACTION"),
            where("CUSTOMER_PHONE", "==", custPhone),
            where("TYPE", "==", type)
          )
        );

        if (!snapshot.empty) {
          const transactions = snapshot.docs.map((doc) => ({
            customerId: doc.data().CUSTOMER_ID,
            transactionId: doc.data().TRANSACTION_ID,
            amount: doc.data().AMOUNT,
            customerName: doc.data().CUSTOMER_NAME,
            transactionType: doc.data().TYPE,
            transactionDate: doc.data().DATE.toDate(),
          }));

          transactions.sort((a, b) => b.transactionDate - a.transactionDate);
          setTransactions(transactions);
        }
      } catch (error) {
        console.error(`Error fetching ${type} transactions:`, error);
      }
    };

    fetchWalletData();
    fetchTransactions(custPhone, "DEPOSIT");
    fetchTransactions(custPhone, "WINNING");



    if (grandtotalFromCart) {
      // If grandtotalFromCart is available, use it
      if (deliveryRate) {
        setGrandTotal(grandtotalFromCart + deliveryRate);
        setchangeRemainingBalance(grandtotalFromCart + deliveryRate);
      } else {
        setGrandTotal(grandtotalFromCart);
        setchangeRemainingBalance(grandtotalFromCart);
      }
    } else {
      // If grandtotalFromCart is not available, fall back to totalPrice
      setGrandTotal(totalPrice + (deliveryRate || 0));
      setchangeRemainingBalance(totalPrice + (deliveryRate || 0));
    }

  }, [custPhone]);


  // const [grandTotal, setGrandTotal] = useState( grandtotalFromCart ? grandtotalFromCart : totalPrice );
  const [grandTotal, setGrandTotal] = useState(grandtotalFromCart !== undefined && grandtotalFromCart !== null ? grandtotalFromCart : totalPrice);

  return (
    
    <div className="selectpayment">
      <button className="btn-backx" onClick={handleBack}>
        <FaChevronLeft />
      </button>

      <div className="question_box_main">
        <h5>Solve this problem</h5>
        <span>Enter the correct answer to proceed with your payment</span>
        <div className="problem">
          <div className="question_">
            <p>What is </p>
            <span>
              {num1} + {num2}
            </span>
          </div>
          <div className="option_box">
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  handleOptionClick(option);
                }}
                className={`options ${
                  selectedOption !== null
                    ? option === correctAnswer
                      ? selectedOption === correctAnswer
                        ? "correct"
                        : ""
                      : option === selectedOption
                      ? "wrong"
                      : ""
                    : ""
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div onClick={handleRadioClick} className="option-wallet-web">
        <div className="mixed-balance">
          <div className="icon-wallet">
            <CiWallet />
          </div>
          <div className="content-wallet-box">
            <h6>My Wallet</h6>
            <p className="balance">
              Deposit Wallet Balance ₹ {changeDepositBalance.toFixed(2)}
            </p>
            <p className="balance">
              Winning Wallet Balance ₹ {changeWinningBalance.toFixed(2)}
            </p>
          </div>
        </div>
        <input
          type="radio"
          checked={isChecked}
          onChange={handleRadioClick} // Add this to prevent the warning
        />
</div>


      {/* <div className="use-wallet">
        <h5>Online Payment</h5>
        <FaArrowRightLong />
      </div> */}
      <div className="order-button-dt">
        {/* <div className="place-amount remiann">
          <h6>Total Amount</h6>
          <h5>₹ {totalPrice}</h5>
        </div>
        <div className="place-amount remiann">
          <h6>Delivery Charge </h6>
          <h5>₹ {deliveryRate ? deliveryRate : 0}</h5>
        </div> */}
        <div className="place-amount">
          <h6>Pay </h6>
          <h5>₹ {changeRemainingBalance}</h5>
        </div>
        {loading ? (
          <button className="placholder-pay">
            <ClipLoader color="#fff" size={16} />
          </button>
        ) : (
          <Link
            onClick={handleClick}
            // onClick={showQuestion}
            style={{ width: "100%" }}
            className="link"
          >
            <button className="placholder-pay">Place Order</button>
          </Link>
        )}
      </div>
    </div>
  );
};



export default SelectPayment;

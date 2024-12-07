// import React, { useEffect, useState } from "react";
// import "./MyWallet.css";
// import VectorWinning from "../Assets/Images/Vector.png";
// import VectorTopUp from "../Assets/Images/Vector _1.png";
// import useBreakpoint from "../MyWallet/MyWalletBreakPoint";
// import { Link } from "react-router-dom";
// import Deposit from "../../Pages/Deposit/Deposit";
// import {
//   doc,
//   getDoc,
//   query,
//   collection,
//   where,
//   getDocs,
// } from "firebase/firestore";
// import { firestore } from "../../firebase";

// export const MyWallet = () => {
//   const breakpoint = useBreakpoint();
//   const isMobile = breakpoint <= 794;
//   const isDesktop = breakpoint > 794;

//   const [activeTab, setActiveTab] = useState("winning");
//   const [depositOpen, setDepositOpen] = useState(false);
//   const [myWalletTotal, setMyWalletTotal] = useState("0");
//   const [currentDepositBalance, setCurrentDepositBalance] = useState(0);
//   const [currentWinningBalance, setCurrentWinningBalance] = useState(0);
//   const [transactionModelList, setTransactionModelList] = useState([]);
//   const [filterTransactionModelList, setFilterTransactionModelList] = useState(
//     []
//   );
//   const [filterWinModelList, setFilterWinModelList] = useState([]);

//   const custId = localStorage.getItem("loginUserId");

//   useEffect(() => {
//     const fetchWalletData = async () => {
//       try {
//         const depositSnapshot = await getDocs(
//           query(
//             collection(firestore, "WALLET_TRANSACTION"),
//             where("CUSTOMER_ID", "==", custId),
//             where("TYPE", "==", "DEPOSIT")
//           )
//         );
//         const currentDeposit = depositSnapshot.docs.reduce(
//           (sum, doc) => sum + doc.data().AMOUNT,
//           0
//         );

//         const winningSnapshot = await getDocs(
//           query(
//             collection(firestore, "WALLET_TRANSACTION"),
//             where("CUSTOMER_ID", "==", custId),
//             where("TYPE", "==", "WINNING")
//           )
//         );
//         const currentWinning = winningSnapshot.docs.reduce(
//           (sum, doc) => sum + doc.data().AMOUNT,
//           0
//         );

//         const takenWinningSnapshot = await getDocs(
//           query(
//             collection(firestore, "WALLET_TRANSACTION"),
//             where("CUSTOMER_ID", "==", custId),
//             where("TYPE", "in", ["PURCHASE_WINNING", "WITHDRAW"])
//           )
//         );
//         const takenWinning = takenWinningSnapshot.docs.reduce(
//           (sum, doc) => sum + doc.data().AMOUNT,
//           0
//         );

//         const takenDepositSnapshot = await getDocs(
//           query(
//             collection(firestore, "WALLET_TRANSACTION"),
//             where("CUSTOMER_ID", "==", custId),
//             where("TYPE", "==", "PURCHASE_DEPOSIT")
//           )
//         );
//         const takenDeposit = takenDepositSnapshot.docs.reduce(
//           (sum, doc) => sum + doc.data().AMOUNT,
//           0
//         );

//         setCurrentDepositBalance(currentDeposit - takenDeposit);
//         setCurrentWinningBalance(currentWinning - takenWinning);

//         const customerDoc = await getDoc(doc(firestore, "CUSTOMERS", custId));
//         if (customerDoc.exists()) {
//           const data = customerDoc.data();
//           setMyWalletTotal(data?.WINNING_WALLET_TOTAL?.toString() || "0");
//         }
//       } catch (error) {
//         console.error("Error fetching wallet data:", error);
//       }
//     };

//     const fetchTransactions = async (cusId, type, setTransactions) => {
//       try {
//         const snapshot = await getDocs(
//           query(
//             collection(firestore, "WALLET_TRANSACTION"),
//             where("CUSTOMER_ID", "==", cusId),
//             where("TYPE", "==", type)
//           )
//         );

//         if (!snapshot.empty) {
//           const transactions = snapshot.docs.map((doc) => ({
//             customerId: doc.data().CUSTOMER_ID,
//             transactionId: doc.data().TRANSACTION_ID,
//             amount: doc.data().AMOUNT,
//             customerName: doc.data().CUSTOMER_NAME,
//             transactionType: doc.data().TYPE,
//             transactionDate: doc.data().DATE.toDate(),
//           }));

//           transactions.sort((a, b) => b.transactionDate - a.transactionDate);
//           setTransactions(transactions);
//         }
//       } catch (error) {
//         console.error(`Error fetching ${type} transactions:`, error);
//       }
//     };

//     fetchWalletData();
//     fetchTransactions(custId, "DEPOSIT", setFilterTransactionModelList);
//     fetchTransactions(custId, "WINNING", setFilterWinModelList);
//   }, [custId]);

//   const handlePopUpOpen = () => setDepositOpen(true);
//   const handlePopUpClose = () => setDepositOpen(false);

//   const walletAmount = currentDepositBalance + currentWinningBalance;

//   const formatDate = (date) => {
//     const options = {
//       year: "numeric",
//       day: "numeric",
//       month: "long",
//       hour: "numeric",
//       minute: "numeric",
//       hour12: true,
//     };
//     return new Date(date).toLocaleDateString(undefined, options);
//   };

//   const renderTransactions = (transactions) =>
//     transactions.length > 0 ? (
//       transactions.map((transaction, index) => (
//         <div key={index} className="content_content">
//           <div className="content_content_sub">
//             <h3>{transaction.transactionType}</h3>
//             <div className="content_content_sub_2">
//               <p>{formatDate(transaction.transactionDate)}</p>
//             </div>
//           </div>
//           <div className="content_content_sub">
//             <h3>+ ₹ {transaction.amount}</h3>
//           </div>
//         </div>
//       ))
//     ) : (
//       <div>No Transactions</div>
//     );

//   return (
//     <div className="mywallet_container">
//       {isDesktop && (
//         <div className="mywallet">
//           <div className="wallet-box">
//             <div
//               className={`tab ${activeTab === "winning" ? "active" : ""}`}
//               onClick={() => setActiveTab("winning")}
//             >
//               <img src={VectorWinning} alt="Winning" /> Top up Wallet
//             </div>
//             <div
//               className={`tab ${activeTab === "deposit" ? "active" : ""}`}
//               onClick={() => setActiveTab("deposit")}
//             >
//               <img src={VectorTopUp} alt="Deposit" /> Winning Wallet
//             </div>
//           </div>

//           {activeTab === "winning" && (
//             <div className="content-container">
//               <div className="content">
//                 <div className="content_head">Recent Transactions</div>
//                 <div className="content_contents_box_main">
//                   {renderTransactions(filterTransactionModelList)}
//                 </div>
//               </div>
//               <div className="content-2">
//                 <div className="current-balance">
//                   <p>Top up Wallet</p>
//                   <h6>₹ {currentDepositBalance}</h6>
//                 </div>
//                 <button onClick={handlePopUpOpen} className="topUp-btn">
//                   Top Up
//                 </button>
//                 <div className="myWallet-balance">
//                   <p>My Wallet</p>
//                   <h6>₹ {walletAmount}</h6>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === "deposit" && (
//             <div className="content-container">
//               <div className="content">
//                 <div className="content_head">Recent Transactions</div>
//                 <div className="content_contents_box_main">
//                   {renderTransactions(filterWinModelList)}
//                 </div>
//               </div>
//               <div className="content-2">
//                 <div className="current-balance">
//                   <p>Winning Wallet</p>
//                   <h6>₹ {currentWinningBalance}</h6>
//                 </div>
//                 <Link to="/withdraw">
//                   <button className="topUp-btn">Withdraw</button>
//                 </Link>
//                 <div className="myWallet-balance">
//                   <p>My Wallet</p>
//                   <h6>₹ {walletAmount}</h6>
//                 </div>
//               </div>
//             </div>
//           )}

//           {depositOpen && (
//             <div className="Deposit_overlay" onClick={handlePopUpClose}>
//               <div
//                 onClick={(e) => e.stopPropagation()}
//                 className="popUp_content"
//               >
//                 <Deposit />
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {isMobile && (
//         <div className="my_wallet_mobile">
//           <div className="mywallet">
//             <div className="wallet-box">
//               <div
//                 className={`tab ${activeTab === "winning" ? "active" : ""}`}
//                 onClick={() => setActiveTab("winning")}
//                 style={{
//                   backgroundColor:
//                     activeTab === "winning" ? "#5A508E" : "transparent",
//                 }}
//               >
//                 <img src={VectorWinning} alt="Winning" /> Top up Wallet
//               </div>
//               <div
//                 className={`tab ${activeTab === "deposit" ? "active" : ""}`}
//                 onClick={() => setActiveTab("deposit")}
//                 style={{
//                   backgroundColor:
//                     activeTab === "deposit" ? "#E5D00B" : "transparent",
//                 }}
//               >
//                 <img src={VectorTopUp} alt="Deposit" /> Winning Wallet
//               </div>
//             </div>
//           </div>

//           <div className="balance-container">
//             <div className="current-balance">
//               <p>
//                 {activeTab === "winning" ? "Top Up Wallet" : "Winning Wallet"}
//               </p>
//               <h6>
//                 ₹{" "}
//                 {activeTab === "winning"
//                   ? currentDepositBalance
//                   : currentWinningBalance}
//               </h6>
//             </div>
//             <div className="myWallet-balance">
//               <p>My Wallet</p>
//               <h6>₹ {walletAmount}</h6>
//             </div>
//           </div>

//           <div className="mobile-content-container">
//             <div className="content_head">Recent Transactions</div>
//             <div className="content_contents_box_main">
//               {renderTransactions(
//                 activeTab === "winning"
//                   ? filterTransactionModelList
//                   : filterWinModelList
//               )}
//             </div>
//           </div>

//           <div className="action-button">
//             {activeTab === "winning" ? (
//               <button onClick={handlePopUpOpen} className="topUp-btn">
//                 Top Up
//               </button>
//             ) : (
//               <Link to="/withdraw">
//                 <button className="topUp-btn">Withdraw</button>
//               </Link>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import "./MyWallet.css";
import VectorWinning from "../Assets/Images/Vector.png";
import VectorTopUp from "../Assets/Images/Vector _1.png";
import useBreakpoint from "../MyWallet/MyWalletBreakPoint";
import { Link, Navigate } from "react-router-dom";
import Deposit from "../../Pages/Deposit/Deposit";
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import { useCount } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";



export const MyWallet = () => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint <= 794;
  const isDesktop = breakpoint > 794;

  const [activeTab, setActiveTab] = useState("winning");
  const [depositOpen, setDepositOpen] = useState(false);
  const [myWalletTotal, setMyWalletTotal] = useState("0");
  const [transactionModelList, setTransactionModelList] = useState([]);
  const [filterTransactionModelList, setFilterTransactionModelList] = useState(
    []
  );
  const [filterWinModelList, setFilterWinModelList] = useState([]);

  const custId = localStorage.getItem("loginUserId");
  const custPhone = localStorage.getItem("loginUserPhone");
  const {
    currentDepositBalance,
    setCurrentDepositBalance,
    currentWinningBalance,
    setCurrentWinningBalance,
  } = useCount();

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

        const customerDoc = await getDoc(
          doc(firestore, "CUSTOMERS", custPhone)
        );
        if (customerDoc.exists()) {
          const data = customerDoc.data();
          setMyWalletTotal(data?.WINNING_WALLET_TOTAL?.toString() || "0");
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    const fetchTransactions = async (cusId, type, setTransactions) => {
      try {
        const snapshot = await getDocs(
          query(
            collection(firestore, "WALLET_TRANSACTION"),
            where("CUSTOMER_PHONE", "==", custPhone),
            where("TYPE", "in", type)
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
    fetchTransactions(
      custPhone,
      ["DEPOSIT", "PURCHASE_DEPOSIT","DEPOSIT_DEBIT","DEPOSIT_CREDIT"],
      setFilterTransactionModelList
    );
    fetchTransactions(
      custPhone,
      [
        "WINNING",
        "PURCHASE_WINNING",
        "WITHDRAW_REQUEST",
        "USING_SCRATCH_AND_WIN",
        "WINNING_DEBIT",
        'WINNING_CREDIT'
      ],
      setFilterWinModelList
    );
  }, [custPhone]);

  const navigate = useNavigate()

  const handleWithdraw = (Balance) => {

    const sanitizedBalance = Number(Balance) || 0;

    if(sanitizedBalance <= 0){
      console.log("balcen&&&" , Balance);
        
        toast.error("Your wallet is empty now")

    } else {
      console.log("blancee%%%",Balance);
      navigate('/withdraw')
    }
  }

  const handlePopUpOpen = () => {
    console.log("Pop-up open handler called");
    setDepositOpen(true);
  };
  const handlePopUpClose = () => setDepositOpen(false);

  const walletAmount = currentDepositBalance + currentWinningBalance;

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const renderTransactions = (transactions) =>
    transactions.length > 0 ? (
      transactions.map((transaction, index) => (
        <div key={index} className="content_content">
          <div className="content_content_sub">
            <h3>
              {transaction.transactionType === "PURCHASE_DEPOSIT" ||
              transaction.transactionType === "PURCHASE_WINNING"
                ? "PURCHASE"
                : transaction.transactionType}
            </h3>
            <div className="content_content_sub_2">
              <p>{formatDate(transaction.transactionDate)}</p>
            </div>
          </div>
          <div
            className={
              transaction.transactionType === "PURCHASE_DEPOSIT" ||
              transaction.transactionType === "PURCHASE_WINNING"
                ? "content_content_sub2"
                : "content_content_sub"
            }
          >
            <h3>
              {transaction.transactionType === "PURCHASE_DEPOSIT" ||
              transaction.transactionType === "PURCHASE_WINNING"
                ? "-"
                : "+"}{" "}
              ₹ {transaction.amount?.toFixed(2)}
            </h3>
          </div>
        </div>
      ))
    ) : (
      <div>No Transactions</div>
    );

  return (
    <div className="mywallet_container">
      {isDesktop && (
        <div className="mywallet">
          <div className="wallet-box">
            <div
              className={`tab ${activeTab === "winning" ? "active" : ""}`}
              onClick={() => setActiveTab("winning")}
            >
              <img src={VectorWinning} alt="Winning" /> Top up Wallet
            </div>

            {/* winning wallet  */}

            <div
              className={`tab ${activeTab === "deposit" ? "active" : ""}`}
              onClick={() => setActiveTab("deposit")}
            >
              <img src={VectorTopUp} alt="Deposit" /> Winning Wallet
            </div>
          </div>

          {activeTab === "winning" && (
            <div className="content-container">
              <div className="content">
                <div className="content_heade">Recent Transactions</div>
                <div className="content_contents_box_main">
                  {renderTransactions(filterTransactionModelList)}
                </div>
              </div>
              <div className="content-2">
                <div className="current-balance">
                  <p>Top up Wallet Balance</p>
                  <h6>₹ {currentDepositBalance?.toFixed(2)}</h6>
                </div>
                <button onClick={handlePopUpOpen} className="topUp-btn">
                  Top Up
                </button>
                <div className="myWallet-balance">
                  <p>My Total Earnings</p>
                  {/* <h6>₹ {walletAmount?.toFixed(2)}</h6> */}
                  <h6>₹ {currentDepositBalance?.toFixed(2)}</h6>
                </div>
              </div>
            </div>
          )}

          {activeTab === "deposit" && (
            <div className="content-container">
              <div className="content">
                <div className="content_heade">Recent Transactions</div>
                <div className="content_contents_box_main">
                  {renderTransactions(filterWinModelList)}
                </div>
              </div>
              <div className="content-2">
                <div className="current-balance">
                  <p>Winning Wallet Balance</p>
                  {/* <h6>₹ {currentWinningBalance?.toFixed(2)}</h6> */}
                  <h6>₹ {(currentWinningBalance ? Number(currentWinningBalance) : 0)?.toFixed(2)}</h6>
                </div>
            
                  <button className="topUp-btn" onClick={()=>handleWithdraw(currentWinningBalance)}>Withdraw</button>
 
                <div className="myWallet-balance">
                  <p>My Total Earnings </p>
                  {/* <h6>₹ {walletAmount?.toFixed(2)}</h6> */}
                  <h6>₹ {(walletAmount ? Number(walletAmount) : 0)?.toFixed(2)}</h6>
                </div>
              </div>
            </div>
          )}

          {depositOpen && (
            <div className="Deposit_overlay" onClick={handlePopUpClose}>
              <div
                onClick={(e) => e.stopPropagation()}
                className="popUp_content"
              >
                <Deposit />
              </div>
            </div>
          )}
        </div>
      )}

      {isMobile && (
        <div className="my_wallet_mobile">
          <div className="mywallet">
            <div className="wallet-box">
              <div
                className={`tab ${activeTab === "winning" ? "active" : ""}`}
                onClick={() => setActiveTab("winning")}
                style={{
                  backgroundColor:
                    activeTab === "winning" ? "#5A508E" : "transparent",
                }}
              >
                <img src={VectorWinning} alt="Winning" />
                 Top up Wallet
              </div>
              <div
                className={`tab ${activeTab === "deposit" ? "active" : ""}`}
                onClick={() => setActiveTab("deposit")}
                style={{
                  backgroundColor:
                    activeTab === "deposit" ? "#E5D00B" : "transparent",
                }}
              >
                <img src={VectorTopUp} alt="Deposit" /> Winning Wallet
              </div>
            </div>
          </div>

          <div className="balance-container">
            <div className="current-balance">
              <p>
                {activeTab === "winning" ? "Top Up Wallet" : "Winning Wallet"}
              </p>
              <h6>
                ₹{" "}
                {activeTab === "winning"
                  ? currentDepositBalance?.toFixed(2)
                  : currentWinningBalance?.toFixed(2)}
              </h6>
            </div>
            {/* <div className="myWallet-balance">
              <p>My Wallet</p>
              <h6>₹ {walletAmount}</h6>
            </div> */}
          </div>

          <div className="mobile-content-container">
            <div className="content_head">Recent Transactions</div>
            <div className="content_contents_box_main">
              {renderTransactions(
                activeTab === "winning"
                  ? filterTransactionModelList
                  : filterWinModelList
              )}
            </div>
          </div>

          <div className="action-button">
            {activeTab === "winning" ? (
              <button onClick={handlePopUpOpen} className="topUp-btn">
                Top Up
              </button>
            ) : (
                <button className="topUp-btn" onClick={()=>handleWithdraw(currentWinningBalance)}>Withdraw</button>
            )}
          </div>
        </div>
      )}
      {depositOpen && (
        <div className="Deposit_overlay" onClick={handlePopUpClose}>
          <div onClick={(e) => e.stopPropagation()} className="popUp_content">
            <Deposit />
          </div>
        </div>
      )}
    </div>
  );
};

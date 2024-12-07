// import React, { useState, useEffect, useRef } from "react";
// import "./Transactions.css";
// import HeaderWeb from "../../Components/Header/HeaderWeb";
// import Footer from "../Footer/Footer";
// import { query, collection, where, getDocs } from "firebase/firestore";
// import { firestore } from "../../firebase";
// import { ClipLoader } from "react-spinners";
// import transactionIMg from "../../Components/Assets/Images/transation_empty.png";
// import TopHome from "../../Components/TopNav/TopHome";
// import couponColender from "../../Components/Assets/Images/calendar_month_filter.png";
// import arrowDownCoupon from "../../Components/Assets/Images/arrow_drop_down_filter.png";
// import { BsSortDown } from "react-icons/bs";

// const Transactions = () => {
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 870);
//   const [activeTab, setActiveTab] = useState("ALL");
//   const [transactionModelList, setTransactionModelList] = useState([]);
//   const [loadedTransactions, setLoadedTransactions] = useState(5); // Number of transactions to load initially
//   const [isLoading, setIsLoading] = useState(false); // Loading state
//   const [date, setDate] = useState();
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(null);
//   const [sortOrder, setSortOrder] = useState("asc");
//   const itemWrapperRef = useRef(null); // Ref for .item_wrapper div

//   const [hasMoreData, setHasMoreData] = useState(true); // New flag to track if more data is available

//   const fetchTransactions = async (cusId) => {
//     setIsLoading(true);
//     const q = query(
//       collection(firestore, "TRANSACTIONS"),
//       where("CUSTOMER_ID", "==", cusId)
//     );
//     const snapshot = await getDocs(q);

//     if (!snapshot.empty) {
//       const transactions = snapshot.docs.map((doc) => {
//         const data = doc.data();
//         const transDate = data.TRANSACTION_DATE?.toDate();

//         let transactionType = data.TRANSACTION_TYPE ?? "";
//         switch (transactionType) {
//           case "USING_SCRATCH_AND_WIN":
//             transactionType = "Scratch & Win";
//             break;
//           case "WITHDRAW_REQUEST":
//             transactionType = "WITHDRAW";
//             break;
//           case "WITHDRAW":
//             transactionType = "WITHDRAW";
//             break;
//           case "PURCHASE":
//             transactionType = "PURCHASE";
//             break;
//           case "DEPOSIT":
//             transactionType = "TOP UP";
//             break;
//           case "WINNING":
//             transactionType = "WINNING";
//             break;
//           default:
//             return false;
//         }
//         return {
//           customerId: data.CUSTOMER_ID ?? "",
//           transactionId: data.TRANSACTION_ID ?? "",
//           amount: data.AMOUNT ?? 0,
//           customerName: data.CUSTOMER_NAME ?? "",
//           transactionType,
//           transactionDate: transDate,
//         };
//       });

//       console.log(transactions, "transaction .....................");

//       transactions.sort((a, b) => b.transactionDate - a.transactionDate);
//       setTransactionModelList(transactions);
//       setLoadedTransactions(18); // Reset loaded transactions
//     }
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     const cusId = localStorage.getItem("loginUserId");
//     fetchTransactions(cusId);

//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 870);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (itemWrapperRef.current) {
//         const itemWrapper = itemWrapperRef.current;
//         const { scrollTop, clientHeight, scrollHeight } = itemWrapper;

//         if (scrollHeight - (scrollTop + clientHeight) < 100 && !isLoading) {
//           setIsLoading(true); // Start loader
//           loadMoreData(); // Trigger data fetching
//         }
//       }
//     };

//     const itemWrapper = itemWrapperRef.current;
//     if (itemWrapper) {
//       itemWrapper.addEventListener("scroll", handleScroll);
//     }
//     return () => {
//       if (itemWrapper) {
//         itemWrapper.removeEventListener("scroll", handleScroll);
//       }
//     };
//   }, [isLoading, loadedTransactions]);

//   useEffect(() => {
//     if (activeTab !== "ALL") {
//       setLoadedTransactions(10); // Reset to initial load count when tab changes
//     }
//   }, [activeTab]);

//   const loadMoreData = async () => {
//     // Simulate network delay
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     // Increase the number of loaded transactions
//     setLoadedTransactions((prev) => prev + 10);

//     // Here you might need to implement the logic to fetch more transactions if needed
//     setIsLoading(false); // Ensure loading state is stopped
//   };

//   const handleSort = () => {
//     const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
//     setSortOrder(newSortOrder);

//     const sortedTransactions = [...transactionModelList].sort((a, b) => {
//       return newSortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
//     });

//     setTransactionModelList(sortedTransactions);
//   };

//   //   ---------------------------------------------------------------------------------------------- confuced Function

//   const renderContent = () => {
//     // Validate date range: fromDate should not be greater than toDate
//     if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
//       return (
//         <div className="error_message">
//           <p>From Date cannot be greater than To Date</p>
//         </div>
//       );
//     }

//     const filteredTransactions = transactionModelList

//         // Filter out transactions with missing or undefined essential fields
//         // .filter((transaction) => {
//         //   return (
//         //     transaction.customerId &&
//         //     transaction.transactionType &&
//         //     transaction.transactionDate
//         //   );
//         // })

//       // Date filter only applies when the active tab is "ALL"
//       .filter((transaction) => {
//         if (activeTab === "ALL" && fromDate && toDate) {
//           return (
//             transaction.transactionDate >= new Date(fromDate) &&
//             transaction.transactionDate <= new Date(toDate)
//           );
//         }
//         return true;
//       })

//       .filter((transaction) => {
//         if (fromDate && toDate) {
//           return (
//             transaction.transactionDate >= new Date(fromDate) &&
//             transaction.transactionDate <= new Date(toDate)
//           );
//         }
//         return true;
//       })

//       .filter((transaction) => {
//         switch (activeTab) {
//           case "ALL":
//             return true;

//           case "WINNING":
//             return transaction.transactionType === "WINNING";

//           case "TOP UP":
//             return transaction.transactionType === "TOP UP";
//           case "PURCHASE":
//             return transaction.transactionType === "PURCHASE";
//           case "WITHDRAW":
//             return (
//               transaction.transactionType === "WITHDRAW"
//               // ||
//               // transaction.transactionType === "WITHDRAW"
//             );
//           case "Scratch & Win":
//             return transaction.transactionType === "Scratch & Win";

//           default:
//             return false;
//         }
//       });

//     if (filteredTransactions.length === 0) {
//       return (
//         <div className="empty_container_transaction">
//           <div className="image_container">
//             <img style={{ textAlign: "center" }} src={transactionIMg} alt="" />
//           </div>
//           <div className="empty_text">
//             <p>No Transactions Found!</p>
//             <span>
//               Its looks like you haven't made any transactions yet. When you
//               place an order, it will appear here.
//             </span>
//           </div>
//         </div>
//       );
//     }

//     const visibleTransactions = filteredTransactions.slice(
//       0,
//       loadedTransactions
//     );

//     const getTransactionTypeClass = (transactionType) => {
//       switch (transactionType) {
//         case "PURCHASE":
//           return "text-red";
//         case "WINNING":
//           return "text-green";
//         case "Scratch & Win":
//           return "text-green";
//         default:
//           return "";
//       }
//     };

//     //----------------------------------------------------------------------------  retun-1

//     return visibleTransactions.length > 0 ? (
//       <>
//         <table className="trn_table">
//           <thead className="trn_tbl_head">
//             <tr className="trn_tbl_head_row">
//               <th className="trn_tbl_mainHead">Type</th>
//               <th className="trn_tbl_mainHead">Date</th>
//               <th className="trn_tbl_mainHead">Time</th>

//               <th className="trn_tbl_mainHead desc_sort">
//                 Amount
//                 <BsSortDown onClick={handleSort} />
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {visibleTransactions.map((transaction, index) => (
//               <tr key={index}>
//                 <td
//                   className={`tbl_data_trn ${getTransactionTypeClass(
//                     transaction.transactionType
//                   )}`}
//                 >
//                   {transaction.transactionType}
//                 </td>

//                 <td className="tbl_data_trn">
//                   {transaction.transactionDate?.toLocaleDateString()}
//                 </td>
//                 <td className="tbl_data_trn">
//                   {transaction.transactionDate?.toLocaleTimeString()}
//                 </td>
//                 <td
//                   className={`tbl_data_trn ${getTransactionTypeClass(
//                     transaction.transactionType
//                   )}`}
//                 >
//                   {/* ₹{transaction.amount?.toFixed(2)} */}
//                   {transaction.amount ? `₹${transaction.amount.toFixed(2)}` : ""}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </>
//     ) : (
//       //   visibleTransactions.map((transaction, index) => (
//       //     <div className="single-item" key={index}>
//       //       <div className="date-time">
//       //         <p className={transaction.transactionType.toLowerCase()}>
//       //           {transaction.transactionType === "DEPOSIT"
//       //             ? "TOP UP"
//       //             : transaction.transactionType}
//       //           Amount
//       //         </p>
//       //         <p>
//       //           {transaction.transactionDate?.toLocaleTimeString()}
//       //           <span>{transaction.transactionDate?.toLocaleDateString()}</span>
//       //         </p>
//       //       </div>
//       //       <div
//       //         className={
//       //           transaction.transactionType === "DEPOSIT" ||
//       //           transaction.transactionType === "WINNING"
//       //             ? "cash-details"
//       //             : "cash-draw"
//       //         }
//       //       >
//       //         <h4>
//       //           {transaction.transactionType === "DEPOSIT" ||
//       //           transaction.transactionType === "WINNING"
//       //             ? `+ ₹${transaction.amount?.toFixed(2)}`
//       //             : `- ₹${transaction.amount?.toFixed(2)}`}
//       //         </h4>
//       //       </div>
//       //     </div>
//       //   ))
//       <div>No {activeTab} Transactions</div>
//     );
//   };

//   const handleDateTextClick = () => {
//     document.getElementById("datePicker").click();
//   };

//   const handleDateChange = (e) => {
//     setDate(e.target.value);
//   };
//   const handleFromDateChange = (event) => {
//     setFromDate(event.target.value);
//   };

//   // Function to handle fromDate text click
//   const handleFromDateTextClick = () => {
//     // Custom logic when the fromDate text is clicked (if any)
//   };

//   // Function to handle toDate change
//   const handleToDateChange = (event) => {
//     setToDate(event.target.value);
//   };

//   // Function to handle toDate text click
//   const handleToDateTextClick = () => {
//     // Custom logic when the toDate text is clicked (if any)
//   };

//   //   return visibleTransactions.length > 0 ? (

//   //   ----------------------------------------------------------------------------------------- default retun is mobile

//   return (
//     <>
//       {isMobile ? <TopHome head="Transactions" /> : <HeaderWeb />}

//       <div className="date_picker">
//         {/* From Date Picker */}

//         <div
//           style={{
//             position: "relative",
//             cursor: "pointer",
//             marginLeft: "20px",
//           }}
//           className={`filter_btns ${toDate ? "active" : ""}`}
//           onClick={() => document.getElementById("toDatePicker").click()} // Trigger click on date input
//         >

//           <span style={{ fontWeight: "500" }} onClick={handleToDateTextClick}>
//             {toDate ? toDate : "To Date"}
//           </span>
//           <input
//             id="toDatePicker"
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             style={{
//               position: "absolute",
//               opacity: 0,
//               width: "96%",
//               height: "100%",
//               left: 0,
//               top: 0,
//               cursor: "pointer",
//             }}
//           />
//           <img
//             className="icons"
//             src={couponColender}
//             alt="calendar icon"
//             style={{ cursor: "pointer", marginLeft: "15px" }}
//           />
//         </div>

//         {/* To Date Picker */}
//         <div
//           style={{
//             position: "relative",
//             cursor: "pointer",
//             marginLeft: "20px",
//           }}
//           className={`filter_btns ${toDate ? "active" : ""}`}
//         >
//           {/* <img
//               style={{ height: "2.5px", width: "5px" }}
//               src={arrowDownCoupon}
//               alt="arrow down"
//             /> */}
//           <span style={{ fontWeight: "500" }} onClick={handleToDateTextClick}>
//             {toDate ? toDate : "To Date"}
//           </span>
//           <input
//             id="toDatePicker"
//             type="date"
//             value={toDate}
//             // onChange={handleToDateChange}
//             onChange={(e) => setToDate(e.target.value)}
//             style={{
//               position: "absolute",
//               opacity: 0,
//               width: "96%",
//               height: "100%",
//               left: 0,
//               top: 0,
//               cursor: "pointer",
//             }}
//           />
//           <img
//             className="icons"
//             src={couponColender}
//             alt="calendar icon"
//             style={{ cursor: "pointer", marginLeft: "15px" }}
//           />
//         </div>
//       </div>

//       <div className="web-transation">
//         <ul className="list-tra">
//           {[
//             "ALL",
//             "Scratch & Win",
//             "WINNING",
//             "TOP UP",
//             "WITHDRAW",
//             "PURCHASE",
//           ].map((tab) => (
//             <li
//               key={tab}
//               className={activeTab === tab ? "active" : ""}
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab}
//             </li>
//           ))}
//         </ul>

//         <div className="item_wrapper" ref={itemWrapperRef}>
//           {transactionModelList.length === 0 ? (
//             <div className="empty_container_transaction">
//               <div className="image_container">
//                 <img
//                   style={{ textAlign: "center" }}
//                   src={transactionIMg}
//                   alt=""
//                 />
//               </div>
//               <div className="empty_text">
//                 <p>No Transactions Found!</p>
//                 <span>
//                   Its looks like you haven't made any transactions yet. When you
//                   place an order, it will appear here.
//                 </span>
//               </div>
//             </div>
//           ) : (
//             <>
//               <div className="list-amount">{renderContent()}</div>
//               {isLoading && (
//                 <div className="loader" style={{ textAlign: "center" }}>
//                   <ClipLoader color="#36d7b7" size={35} />
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default Transactions;

// updated yesterday function

import React, { useState, useEffect, useRef } from "react";
import "./Transactions.css";
import HeaderWeb from "../../Components/Header/HeaderWeb";
import Footer from "../Footer/Footer";
import { query, collection, where, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase";
import { ClipLoader } from "react-spinners";
import transactionIMg from "../../Components/Assets/Images/transation_empty.png";
import TopHome from "../../Components/TopNav/TopHome";
import couponColender from "../../Components/Assets/Images/calendar_month_filter.png";
import arrowDownCoupon from "../../Components/Assets/Images/arrow_drop_down_filter.png";
import { BsSortDown } from "react-icons/bs";
import { FaSleigh } from "react-icons/fa6";
import { BottomNav } from "../../Components/BottomNav/BottomNav";

const Transactions = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 870);
  const [currentScreen, setCurrentScreen] = useState("transactions");

  const [activeTab, setActiveTab] = useState("ALL");
  const [transactionModelList, setTransactionModelList] = useState([]);
  const [loadedTransactions, setLoadedTransactions] = useState(5); // Number of transactions to load initially
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [date, setDate] = useState();
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const itemWrapperRef = useRef(null); // Ref for .item_wrapper div
  const [hasMoreData, setHasMoreData] = useState(true); // New flag to track if more data is available

  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  const fetchTransactions = async (custPhone) => {
    if (!hasMoreData) return; // Stop fetching if no more data

    console.log(hasMoreData, "from fetch initail...........");

    setIsLoading(true);
    const q = query(
      collection(firestore, "TRANSACTIONS"),
      where("CUSTOMER_PHONE", "==", custPhone)
    );
    
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const transactions = snapshot.docs.map((doc) => {
        const data = doc.data();
        const transDate = data.TRANSACTION_DATE?.toDate();

        let transactionType = data.TRANSACTION_TYPE ?? "";
        switch (transactionType) {
          case "USING_SCRATCH_AND_WIN":
            transactionType = "Scratch & Win";
            break;
          case "WITHDRAW":
            transactionType = "WITHDRAW";
            break;
          case "PURCHASE":
            transactionType = "PURCHASE";
            break;
          case "DEPOSIT":
            transactionType = "TOP UP";
            break;
          case "WINNING":
            transactionType = "WINNING";
            break;
          default:
            return false;
        }

        return {
          customerId: data.CUSTOMER_ID ?? "",
          transactionId: data.TRANSACTION_ID ?? "",
          amount: data.AMOUNT ?? 0,
          customerName: data.CUSTOMER_NAME ?? "",
          transactionType,
          transactionDate: transDate,
          phone: data.CUSTOMER_PHONE
        };
      });

      console.log(transactions, "transaction .....................");

      transactions.sort((a, b) => b.transactionDate - a.transactionDate);
      setTransactionModelList(transactions);
      setLoadedTransactions(18); // Reset loaded transactions
    } else {
      setHasMoreData(false); // Stop further fetching if no data is found
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // const cusId = localStorage.getItem("loginUserId");
    const custPhone = localStorage.getItem("loginUserPhone");
    fetchTransactions(custPhone);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 870);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (itemWrapperRef.current) {
        const itemWrapper = itemWrapperRef.current;
        const { scrollTop, clientHeight, scrollHeight } = itemWrapper;

        if (
          scrollHeight - (scrollTop + clientHeight) < 100 &&
          !isLoading &&
          hasMoreData
        ) {
          console.log(hasMoreData, "hasmoredata from handle sroll...........");

          setIsLoading(true); // Start loader
          loadMoreData(); // Trigger data fetching
        }
      }
    };

    const itemWrapper = itemWrapperRef.current;
    if (itemWrapper) {
      itemWrapper.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (itemWrapper) {
        itemWrapper.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isLoading, loadedTransactions]);

  useEffect(() => {
    if (activeTab !== "ALL") {
      setLoadedTransactions(10); // Reset to initial load count when tab changes
    }
  }, [activeTab]);

  const loadMoreData = async () => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // // Increase the number of loaded transactions
    // setLoadedTransactions((prev) => prev + 10);

    if (loadedTransactions >= transactionModelList.length) {
      setHasMoreData(false); // Stop fetching more if no more transactions to load
    } else {
      setLoadedTransactions((prev) => prev + 11); // Load more transactions
    }

    // Here you might need to implement the logic to fetch more transactions if needed
    setIsLoading(false); // Ensure loading state is stopped
  };

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sortedTransactions = [...transactionModelList].sort((a, b) => {
      return newSortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
    });

    setTransactionModelList(sortedTransactions);
  };

  const renderContent = () => {
    // Validate date range: fromDate should not be greater than toDate

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      return (
        <div className="error_message">
          <p>From Date cannot be greater than To Date</p>
        </div>
      );
    }

    const filteredTransactions = transactionModelList

      // Filter out transactions with missing or undefined essential fields

      .filter((transaction) => {
        return (
          transaction.phone &&
          transaction.transactionType &&
          transaction.transactionDate
        );
      })

      // Date filter only applies when the active tab is "ALL"

      // .filter((transaction) => {
      //   if (activeTab === "ALL" && fromDate && toDate) {
      //     return (
      //       transaction.transactionDate >= new Date(fromDate) &&
      //       transaction.transactionDate <= new Date(toDate)
      //     );
      //   }
      //   return true;
      // })

      // .filter((transaction) => {
      //   if (activeTab === "ALL" && fromDate && toDate) {
      //     const transactionDate = new Date(transaction.transactionDate);
      //     const startDate = new Date(fromDate);
      //     const endDate = new Date(toDate);
      //     return transactionDate >= startDate && transactionDate <= endDate;
      //   }
      //   return true;
      // })


      .filter((transaction) => {
        if (activeTab === "ALL" && fromDate && toDate) {
          const transactionDate = new Date(transaction.transactionDate);
          const startDate = new Date(fromDate);
          const endDate = new Date(toDate);
    
          // Ensure the transaction date is within the selected range
          return (
            transactionDate >= startDate.setHours(0, 0, 0, 0) &&
            transactionDate <= endDate.setHours(23, 59, 59, 999)
          );
        }
        return true;
      })

      


      .filter((transaction) => {
        console.log(
          toDate,
          fromDate,
          "the dates ................................."
        );

        if (fromDate && toDate) {
          return (
            transaction.transactionDate >= new Date(fromDate) &&
            transaction.transactionDate <= new Date(toDate)
          );
        }
        return true;
      })

      .filter((transaction) => {
        switch (activeTab) {
          case "ALL":
            return true;
          case "WINNING":
            return transaction.transactionType === "WINNING";
          case "TOP UP":
            return transaction.transactionType === "TOP UP";
          case "PURCHASE":
            return transaction.transactionType === "PURCHASE";
          case "WITHDRAW":
            return transaction.transactionType === "WITHDRAW";
          case "Scratch & Win":
            return transaction.transactionType === "Scratch & Win";
          default:
            return false;
        }
      });

    if (filteredTransactions.length === 0) {
      return (
        <div className="empty_container_transaction">
          <div className="image_container">
            <img style={{ textAlign: "center" }} src={transactionIMg} alt="" />
          </div>
          <div className="empty_text">
            <p>No Transactions Found!</p>
            <span>
              Its looks like you haven't made any transactions yet. When you
              place an order, it will appear here.
            </span>
          </div>
        </div>
      );
    }

    const visibleTransactions = filteredTransactions
    .slice(0, loadedTransactions)
    .sort((a, b) => b.transactionDate - a.transactionDate); // Sort in descending order

    
    const getTransactionTypeClass = (transactionType) => {
      switch (transactionType) {
        case "PURCHASE":
          return "text-red";
        case "WINNING":
          return "text-green";
        case "Scratch & Win":
          return "text-green";
        default:
          return "";
      }
    };

    //----------------------------------------------------------------------------  retun-1

    return visibleTransactions.length > 0 ? (
      <>
        <table className="trn_table">
          <thead className="trn_tbl_head">
            <tr className="trn_tbl_head_row">
              <th className="trn_tbl_mainHead">Type</th>
              <th className="trn_tbl_mainHead">Date</th>
              <th className="trn_tbl_mainHead">Time</th>

              <th className="trn_tbl_mainHead desc_sort">
                Amount
                <BsSortDown onClick={handleSort} />
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleTransactions.map((transaction, index) => (
              <tr key={index}>
                <td
                  className={`tbl_data_trn ${getTransactionTypeClass(
                    transaction.transactionType
                  )}`}
                >
                  {transaction.transactionType}
                </td>

                <td className="tbl_data_trn">
                  {transaction.transactionDate?.toLocaleDateString()}
                </td>
                <td className="tbl_data_trn">
                  {transaction.transactionDate?.toLocaleTimeString()}
                </td>
                <td
                  className={`tbl_data_trn ${getTransactionTypeClass(
                    transaction.transactionType
                  )}`}
                >
                  {/* ₹{transaction.amount?.toFixed(2)} */}
                  {transaction.amount
                    ? `₹${transaction.amount.toFixed(2)}`
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    ) : (
      <div>No {activeTab} Transactions</div>
    );
  };

  const handleDateTextClick = () => {
    document.getElementById("datePicker").click();
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };
  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  // Function to handle fromDate text click
  const handleFromDateTextClick = () => {
    // Custom logic when the fromDate text is clicked (if any)
  };

  // Function to handle toDate change
  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  // Function to handle toDate text click
  const handleToDateTextClick = () => {
    // Custom logic when the toDate text is clicked (if any)
  };

   // Get today's date in the format YYYY-MM-DD
   const today = new Date().toISOString().split("T")[0];

  //   return visibleTransactions.length > 0 ? (

  //   ----------------------------------------------------------------------------------------- default retun is mobile

  return (
    <>
      {isMobile ? <TopHome head="Transactions" /> : <HeaderWeb />}
      <div className="date_picker">
        {/* From Date Picker */}
        <div
          style={{
            position: "relative",
            cursor: "pointer",
            marginLeft: "20px",
          }}
          className={`filter_btns ${fromDate ? "active" : ""}`}
          onClick={() => fromDateRef.current?.focus()} // Trigger focus on the From Date input
        >
          <span style={{ fontWeight: "500" }}>
            {fromDate ? fromDate : "From Date"}
          </span>
          <input
            id="FromDatePicker"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            max={today}
            ref={fromDateRef}
            style={{
              position: "absolute",
              opacity: 0,
              width: "96%",
              height: "100%",
              left: 0,
              top: 0,
              cursor: "pointer",
            }}
          />
          <img
            className="icons"
            src={couponColender}
            alt="calendar icon"
            style={{ marginLeft: "15px" }}
          />
        </div>

        {/* To Date Picker */}
        <div
          style={{
            position: "relative",
            cursor: "pointer",
            marginLeft: "20px",
          }}
          className={`filter_btns ${toDate ? "active" : ""}`}
          onClick={() => toDateRef.current?.focus()} // Trigger focus on the To Date input
        >
          <span style={{ fontWeight: "500" }}>
            {toDate ? toDate : "To Date"}
          </span>
          <input
            id="toDatePicker"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            max={today}
            min={fromDate || ""}
            ref={toDateRef}
            style={{
              position: "absolute",
              opacity: 0,
              width: "96%",
              height: "100%",
              left: 0,
              top: 0,
              cursor: "pointer",
            }}
          />
          <img
            className="icons"
            src={couponColender}
            alt="calendar icon"
            style={{ marginLeft: "15px" }}
          />
        </div>
      </div>

      <div className="web-transation">
        <ul className="list-tra">
          {[
            "ALL",
            "Scratch & Win",
            "WINNING",
            "TOP UP",
            "WITHDRAW",
            "PURCHASE",
          ].map((tab) => (
            <li
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>

        <div className="item_wrapper" ref={itemWrapperRef}>

          {transactionModelList.length === 0 ? (

            <div className="empty_container_transaction">
              <div className="image_container">
                <img
                  style={{ textAlign: "center" }}
                  src={transactionIMg}
                  alt=""
                />
              </div>
              <div className="empty_text">
                <p>No Transactions Found!</p>
                <span>
                  Its looks like you haven't made any transactions yet. When you
                  place an order, it will appear here.
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="list-amount">{renderContent()}</div>
              {isLoading && (
                <div className="loader" style={{ textAlign: "center" }}>
                  <ClipLoader color="#36d7b7" size={35} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen}/>

      <Footer />
    </>
  );
};

export default Transactions;

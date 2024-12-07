import React, { useState, useEffect, useRef } from "react";
import "./MyCoupons.css";
import { BsFillTrophyFill } from "react-icons/bs";
import { FaChevronRight } from "react-icons/fa6";
import Ticker from "../Assets/Images/ticket.png";
import { Assets } from "../Assets/Assets";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import { useCount } from "../../Context/Context";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import Support from "../Alert/Support";
import TicketAlert from "../Alert/TicketAlert";
import CouponAlert1 from "../Alert/CouponAlert1";
import couponIMg from "../../Components/Assets/Images/ticket_empty.png";
import AlertCoupen from "./AlertCoupen";
import filterLogo from "../Assets/Images/filter_logoo.png";
import couponColender from "../Assets/Images/calendar_month_filter.png";
import arrowDownCoupon from "../Assets/Images/arrow_drop_down_filter.png";
import couponLogoFilter from "../Assets/Images/coupon_filter.png";
import coupon_search_bar from "../Assets/Images/coupon_search_icon.png";
import FilterAlert from "../Alert/FilterAlert";
import { IoIosSearch } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { toast } from "sonner";

const MyCoupons = () => {

  const cusId = localStorage.getItem("loginUserId");
  const cusPhone = localStorage.getItem("loginUserPhone");
  const cusName = localStorage.getItem("loginUserName")
  

  const [coupon, setCoupon] = useState("");
  const navigate = useNavigate();
  const { loading, setLoading } = useCount();
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false); // State for loading more data
  const loadMoreRef = useRef(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [encryptedData, setEncryptedData] = useState("");
  const [decryptedData, setDecryptedData] = useState("");
  const [showCouponAlert1, setShowCouponAlert1] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);

  const [showSupport, setShowSupport] = useState(false);
  // const [currentBalance, setCurrentBalance] = useState(0);
  const [couponDocId, setCouponDocId] = useState("");
  const [couponNumber, setCouponNumber] = useState("");
  const [ticketQty, setTicketQty] = useState(0);

  const [showFilterAlert, setShowFilterAlert] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState();
  const [filterDraw, setFilterDraw] = useState();

  const [filter, setFilter] = useState("");

  const [drawId, setDrawId] = useState("");

  const [filteredCouponState, SetFilteredCouponState] = useState(coupons);

  const { currentWalletBalance } = useCount();

  const fetchProducts = async (lastVisibleDoc) => {
    try {
      if (!lastVisibleDoc) {
        setLoading(true); // Set loading state only for initial fetch
      } else {
        setLoadingMore(true); // Set loadingMore state for subsequent fetches
      }

      const limitSize = 50;
      const collectionRef = collection(firestore, "TICKETS");
      let q = query(
        collectionRef,
        where("CUSTOMER_PHONE", "==", cusPhone),
        orderBy("TICKET_DATE", "desc"),
        limit(limitSize)
      );

      if (lastVisibleDoc) {
        q = query(
          collectionRef,
          where("CUSTOMER_NAME", "==", cusName),
          orderBy("TICKET_DATE", "desc"),
          startAfter(lastVisibleDoc),
          limit(limitSize)
        );
      }

      const querySnapshot = await getDocs(q);
      console.log( querySnapshot,"Query snapshot....***///****");

      if (querySnapshot.empty) {
        console.log("No documents found");
        setHasMore(false);
        return;
      }

      const newProducts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Document data:", data);
        return {
          id: doc.id,
          ...data,
          TICKET_DATE: data.TICKET_DATE ? data.TICKET_DATE.toDate() : null,
          LOT_DATE: data.LOT_DATE ? data.LOT_DATE.toDate() : null,
        };
      });

      console.log("Fetched products:", newProducts);

      if (lastVisibleDoc) {
        setCoupons((prevCoupons) => [...prevCoupons, ...newProducts]);
      } else {
        setCoupons(newProducts); // Set fresh data for initial fetch
      }

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(
        !querySnapshot.empty && querySnapshot.docs.length === limitSize
      );
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      if (!lastVisibleDoc) {
        setLoading(false); // Unset loading state after initial fetch
      } else {
        setLoadingMore(false); // Unset loadingMore state after subsequent fetches
      }
    }
  };

  useEffect(() => {
    if (cusPhone) {
      fetchProducts(null);
    }
  }, [cusPhone]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchProducts(lastVisible);
        }
      },
      {
        root: null,
        rootMargin: "20px",
        threshold: 0.1,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [lastVisible, hasMore, loading, loadingMore]);

  const checkExpired = (lotDate) => {
    const currentDate = new Date();
    return currentDate > lotDate;
  };

  const getChannelName = (channelId) => {
    switch (channelId) {
      case "8":
        return "Boche Mart";
      case "9":
        return "Boche Gold";
      case "6":
        return "WEB(QR)";
      case "1":
        return "Handheld Device";
      case "2":
        return "Boche Tea";
      case "3":
        return "QR";
      case "4":
        return "Retailer App";
      case "5":
        return "PlayerApp";
      default:
        return "";
    }
  };

  const [currentWinning, setCurrentWinning] = useState();

  const [currentBalance, setCurrentBalance] = useState(0);
  const winningTotalAmonuntFunction = async (cusPhone) => {
    const winningSnapshot = await getDocs(
      query(
        collection(firestore, "WALLET_TRANSACTION"),
        where("CUSTOMER_PHONE", "==", cusPhone),
        where("TYPE", "in", ["WINNING", "USING_SCRATCH_AND_WIN"])
      )
    );

    const currentWinningAmount = winningSnapshot.docs.reduce(
      (sum, doc) => sum + doc.data().AMOUNT,
      0
    );
    // const takenWinningSnapshot = await getDocs(
    //   query(
    //     collection(firestore, "WALLET_TRANSACTION"),
    //     where("CUSTOMER_ID", "==", cusId),
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
  };
  useEffect(() => {
    const fetchCurrentBalance = async () => {
      try {
        const docRef = doc(firestore, "CUSTOMERS", cusPhone);
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

    cusPhone == "" || cusPhone == null ? <></> : fetchCurrentBalance();
    winningTotalAmonuntFunction(cusPhone);
  }, [cusPhone]);

  // const hadndleSearch = ()=> {

  // }

  const formateDate = (date) => {
    const day = String(date.getDate()).padStart(2, 0);
    const month = String(date.getMonth() + 1).padStart(2, 0);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

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
      // setLoading(false);
      setCouponLoading(false);
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

    // setLoading(true);
    setCouponLoading(true);

    const success = await handleEncrypt();

    if (success) {
      setShowCouponAlert1(true);
      setCoupon("");
    }
    setLoading(false);
    setCouponLoading(false);
  };

  const handleShowSupport = () => {
    setShowSupport(true);
  };

  const handleCloseSupport = () => {
    setShowSupport(false);
  };

  const handleFilterAlertOpen = () => {
    setShowFilterAlert(true);
  };

  const handleDateTextClick = () => {
    document.getElementById("datePicker").click();
  };

    // Get today's date in the format YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  // const handleFilter = () => {
  //   const filterCoupons = coupons.filter((coupon) => {
  //     const isValidDate = !date || coupon.TICKET_DATE === date;
  //     if (!filter) return isValidDate;
  //     return coupon.WINNING_STATUS === filter && isValidDate;
  //   });
  //   SetFilteredCouponState(filterCoupons);
  // };

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  const handleFilter = () => {
    let filteredCoupons = coupons;

    if (filter) {
      filteredCoupons = filteredCoupons.filter(
        (coupon) => coupon.WINNING_STATUS === filter
      );
    }

    // Apply date filter
    if (date) {
      const selectedDate = new Date(date);
      console.log(date, "this datee  selected .....................");
      if (
        coupon.TICKET_DATE &&
        typeof coupon.TICKET_DATE.toDate === "function"
      ) {
        const couponDate = coupon.TICKET_DATE.toDate();
        // Use couponDate for date filtering
      } else {
        // Handle the case where TICKET_DATE is not a valid Date object
        console.error("Invalid date format for TICKET_DATE");
      }
      filteredCoupons = filteredCoupons.filter((coupon) => {
        const couponDate = coupon.TICKET_DATE;
        return (
          couponDate.getFullYear() === selectedDate.getFullYear() &&
          couponDate.getMonth() === selectedDate.getMonth() &&
          couponDate.getDate() === selectedDate.getDate()
        );
      });
    }
    setFilterDraw("");
    setDrawId("");
    SetFilteredCouponState(filteredCoupons);
  };

  useEffect(() => {
    handleFilter();
  }, [date]);

  // const handleFilterDrawId = ()=> {

  //   console.log("heloooooooooooooooooo")

  //   let FilteredDrawId = renderCoupon;

  //   FilteredDrawId =  FilteredDrawId.filter((id) => id.DRAW_ID === drawId );

  //    console.log(renderCoupon, "renderCoupon...............");
  //    console.log(drawId, "draw ,id .............")
  //    console.log(FilteredDrawId, "FilteredDrawId.................")

  //    renderCoupon = FilteredDrawId ;

  // }

  // const handleFilterDrawId = () => {
  //   setFilterDraw(drawId);
  //   console.log("heloooooooooooooooooo");
  //   if (!drawId) {
  //     setFilterDraw("");
  //     setDrawId("");
  //     console.log("drawId is not set");
  //     return;
  //   }

  //   let FilteredDrawId = renderCoupon?.filter(
  //     (coupon) => coupon.DRAW_ID == drawId
  //   );
  //   console.log(FilteredDrawId, "FilteredDrawId...........");
  //   setFilter("");
  //   setDate("");
  //   SetFilteredCouponState(FilteredDrawId);
  //   // renderCoupon = FilteredDrawId;
  // };

  // let renderCoupon =
  //   filter || date || filterDraw ? filteredCouponState : coupons;

  //   const handleFilterDrawId = () => {
  //     if (!drawId) {
  //       setFilterDraw("");
  //       setDrawId("");
  //       console.log("drawId is not set");
  //       SetFilteredCouponState(coupons);
  //       return;
  //     }

  //     setFilterDraw(drawId);
  //     filterCouponsByDrawId(drawId);
  //   };
  const handleFilterDrawId = () => {
    if (!drawId) {
      setFilterDraw("");
      setDrawId("");
      console.log("drawId is not set");
      SetFilteredCouponState(coupons); // Reset to full list
      return;
    }

    setFilterDraw(drawId);
    filterCouponsByDrawId(drawId);
  };

  const filterCouponsByDrawId = (drawId) => {
    let FilteredDrawId = renderCoupon?.filter(
      (coupon) => coupon.DRAW_ID == drawId
    );
    console.log(FilteredDrawId, "FilteredDrawId...........");
    setFilter("");
    setDate("");
    SetFilteredCouponState(FilteredDrawId);
  };

  useEffect(() => {
    if (filterDraw !== "") {
      filterCouponsByDrawId(filterDraw);
    }
  }, [filterDraw]);

  let renderCoupon =
    filter || date || filterDraw ? filteredCouponState : coupons;

  

  return (
    <div className="mycoupons">
      <div className="coupen-webap">
        <div className="my-earnings">
          <div className="left-cont">
            <BsFillTrophyFill />
            <h6>My Earnings</h6>
          </div>
          <div className="right-cont">
            <h6>₹{currentWinning?.toFixed(2)}</h6>
            <FaChevronRight />
          </div>
        </div>
        <div className="scan">
          <input
            type="text"
            placeholder="Enter coupon number"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            maxLength={"12"}
          />
          <button onClick={handleAddClick}>
            {couponLoading ? <ClipLoader color="#fff" size={16} /> : "Add"}
          </button>
        </div>
      </div>

      {/* =------------------------------------------------------------------------------------------- filter area  */}

      <div className="filter_items_contianer">
        <img className="icons" src={filterLogo} alt="filter logo" />
        <button
          className={`filter_btns ${filter ? "active" : ""}`}
          onClick={handleFilterAlertOpen}
        >
          <img
            className="icons"
            src={couponLogoFilter}
            alt="coupon logo filter"
          />
          <span style={{ fontWeight: "500" }}>
            {filter ? filter : "Coupon"}
          </span>
          <img
            style={{ height: "2.5px", width: "5px" }}
            src={arrowDownCoupon}
            alt="arrow down"
          />
        </button>

        <div
        style={{ position: "relative", cursor: "pointer" }}
        className={`filter_btns ${date ? "active" : ""}`}
      >
        <img
          style={{ height: "2.5px", width: "5px" }}
          src="arrowDownCoupon.png" // Replace with your actual image path
          alt="arrow down"
        />
        <span style={{ fontWeight: "500" }}>
          {date ? date : "Date"}
        </span>
        <input
          id="datePicker"
          type="date"
          onChange={handleDateChange}
          max={today} // Set the max attribute to today's date to avoid selection of future dates
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
          style={{ cursor: "pointer", marginLeft: "15px" }}
        />
      </div>
      </div>

      {/* <div className="coupon_search_bar">
        <input
          placeholder="Search Draw Id"
          type="number"
          value={drawId}
          onChange={(e) => {
            setDrawId(e.target.value);
          }}
        />
        <button className="draw_searchbtn" onClick={handleFilterDrawId}>
          <FaSearch />
        </button>
      </div> */}
      <div className="coupon_search_bar">
        <input
          placeholder="Search Draw Id"
          type="number"
          value={drawId}
          onChange={(e) => {
            const value = e.target.value;
            setDrawId(value);

            // Reset coupon list if input is cleared
            if (!value) {
              setFilterDraw("");
              SetFilteredCouponState(coupons); // Reset to full list
            }
          }}
        />
        <button className="draw_searchbtn" onClick={handleFilterDrawId}>
          <FaSearch />
        </button>
      </div>

      <ul className="draw">{/* <li>LuckyDraw Tickets</li> */}</ul>
      {loading && !couponLoading && !loadingMore && (
        <div className="loader-order" style={{ textAlign: "center" }}>
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      )}

      {renderCoupon.length > 0 ? (
        <>
          {cusPhone ? (
            <div className="ticket_list_all">
              <ul className="mytick" style={{ padding: "0" }}>
                {renderCoupon.map((coupon, index) => (
                  <li key={index}>
                    <div className="ticket-won">
                      {(() => {
                        switch (coupon.WINNING_STATUS) {
                          case "WON":
                            return (
                              <div className="wino">
                                <h6>₹{coupon.WIN_AMOUNT} Cashback</h6>
                              </div>
                            );
                          case "PENDING":
                            return (
                              <div className="pending">
                                <h6>Pending</h6>
                              </div>
                            );
                          case "NONE":
                          default:
                            return (
                              <div className="better-luck">
                                <h6>Better Luck Next Time</h6>
                              </div>
                            );
                        }
                      })()}
                      <img src={Ticker} alt="" />
                    </div>
                    <div className="contetnt-box-ticket">
                      <div className="contents-boxe">
                        <div className="content_wrapper">
                          <div className="ticketId_container">
                            <div className="bg">
                              <span>TSN NO</span>
                            </div>
                            <p className="ticketId">{coupon.TICKET_NUMBER}</p>
                          </div>
                          <div className="time-box">
                            <p className="ticketDate">
                              {formateDate(coupon.TICKET_DATE)}
                            </p>
                          </div>
                          <div className="channelid">
                            <p>{getChannelName(coupon.CHANNEL_ID)}</p>
                          </div>
                          <div className="drawid">
                            <p>Draw ID </p>
                            <h6>{coupon.DRAW_ID}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
                <div ref={loadMoreRef} />
                {loadingMore && (
                  <div className="loader-more" style={{ textAlign: "center" }}>
                    <ClipLoader color="#36d7b7" size={35} />
                  </div>
                )}
              </ul>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>No coupons available. Please log in to view your coupons.</p>
            </div>
          )}
        </>
      ) : !loading ? (
        <div className="empty_container_coupon">
          <div className="image_container">
            <img style={{ textAlign: "center" }} src={couponIMg} alt="" />
          </div>
            <div className="empty_text">
              <p>No Coupons Available!</p>
              <span>
                Currently, there are no active coupons for you to use. Please check back later for new deals!
              </span>
            </div>

        </div>
      ) : (
        ""
      )}

      {/* -------------------------------------------- coupon codes // */}

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
            <AlertCoupen setShowCoupon={setShowCoupon} ticketQty={ticketQty} />
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

      {showFilterAlert && (
        <div className="Filter_alert_overlay">
          <div
            className="alert-content_support"
            onClick={(e) => e.stopPropagation()}
          >
            <FilterAlert
              handleFilterChange={handleFilterChange}
              filter={filter}
              setShowFilterAlert={setShowFilterAlert}
              handleFilter={handleFilter}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCoupons;

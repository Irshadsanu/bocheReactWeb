import React, { useEffect, useState } from "react";
import "./Header.css";
import { Assets } from "../Assets/Assets";
import bocheClearLogo from '../Assets/Images/boche_clear_logo.png'
import Profile from "../Profile/Profile";
import { FaUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import { TopNav } from "../TopNav/TopNav";
import { useCount } from "../../Context/Context";
import { collection, getAggregateFromServer, onSnapshot, query, sum, where } from "firebase/firestore";
import { firestore } from "../../firebase";

export const Header = () => {
  const [showProfile, setShowProfile] = useState(false);

  const userImg = localStorage.getItem("loginUserPhoto");
  const loginUserName = localStorage.getItem("loginUserName");
  const loginUserId = localStorage.getItem("loginUserId");
  


  const [cartViewList, setCartViewList] = useState([]);
  const [myCartTotalProductQty, setCartTotalProductQty] = useState(0);

  const {ready,setReady} = useCount()

  // const {myCartTotalProductQty,setCartTotalProductQty} = useCount()


  const fetchCartTotalProductQty = async (custId) => {
    try {
      const cartQuery = query(
        collection(firestore, "CART"),
        where("CUSTOMER_ID", "==", custId)
      );
  
      // Listen for real-time updates
      const unsubscribe = onSnapshot(cartQuery, (snapshot) => {
        let totalQty = 0;
  
        // Aggregate PRODUCT_QTY from all documents in the snapshot
        snapshot.forEach((doc) => {
          const data = doc.data();
          totalQty += data.PRODUCT_QTY || 0; // Sum the PRODUCT_QTY fields
        });
  
        console.log("Real-time total quantity:", totalQty);
  
        // Update state with the real-time total
        setCartTotalProductQty(totalQty);
      });
  
      // Return unsubscribe function for cleanup
      return unsubscribe;
    } catch (e) {
      console.error('Error fetching cart total:', e);
      setCartTotalProductQty(0);
    }
  };
  
  useEffect(() => {

    console.log(ready,"readyreadyyyyyy")
    let unsubscribe;
  
    if (loginUserId) {
      const fetchData = async () => {
        unsubscribe = await fetchCartTotalProductQty(loginUserId);
      };
  
      fetchData();
    }
  
    // Cleanup function to unsubscribe from Firestore listener
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [loginUserId, ready]); // Add `ready` to dependencies
  


  
        // Function to calculate the total price and total item count
        const getTotalPrice = () => {
          return cartViewList.reduce((total, item) => total + (item.price * item.productQty), 0).toFixed(2);
        };
      
        const getTotalItemCount = () => {
          return cartViewList.reduce((count, item) => count + item.productQty, 0);
        };
      
        const deliveryCharge = 0; // Modify if you have dynamic delivery charge logic



  const navigate = useNavigate();

  const handleUserImgClick = () => {
    
    // const navigateData =
    //   loginUserId == "" || loginUserId == null
    //     ? "/login"
    //     : document.body.classList.add("modal-active", "overflow-hidden");


    if (loginUserId === "" || loginUserId == null) {
      navigate("/login");
    } else {
      document.body.classList.add("modal-active", "overflow-hidden");
    }
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  return (
    <div>
      {/* <TopNav/> */}
      <header>
        <div className="user_icon_wrapper">
          <div className="header_icon_wrapper">

            <div className="icon_notiCart">
              <Link to={"/notification"}>
                <img src={Assets.noti_icon} alt="" />
              </Link>
            </div>
            <div className="icon_notiCart">
              <div className="cart_icon_wrapper">
                <div className="quantity_icon">
                  <Link to={"/cart"}>
                    <img src={Assets.cart_icon} alt="" />
                  </Link>
                </div>

                <div className="quantity_badge">
                  <span> {myCartTotalProductQty ? myCartTotalProductQty : 0} </span>
                </div>
              </div>
            </div>
          </div>

          <div className="user-img" onClick={handleUserImgClick}>
            {userImg ? (
              <img src={userImg} alt="User" />
            ) : loginUserName ? (
              <div className="user-text">{getInitial(loginUserName)}</div>
            ) : (
              <div className="icon_user_defaul">
                <FaUser />
              </div>
            )}
          </div>

        </div>
        <h3>boCHE MART</h3>
        <div className="boche-logo">
          <img src={bocheClearLogo} alt="" />
        </div>
      </header>
      <Profile />
    </div>
  );
};

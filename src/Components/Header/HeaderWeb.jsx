import "./Header.css";
import { Assets } from "../Assets/Assets";
import bocheClearLogo from '../Assets/Images/boche_clear_logo.png'
import { Link, useLocation, useNavigate } from "react-router-dom";
import Profile from "../Profile/Profile";
import { FaUserAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { aggregateField, collection, getAggregateFromServer, getDocs, onSnapshot, query, sum, where } from "firebase/firestore";
import { firestore } from "../../firebase";
import { TopNav } from "../TopNav/TopNav";
import { useCount } from "../../Context/Context";

const HeaderWeb = () => {
  const userIdIMg = localStorage.getItem("loginUserPhoto");
  const loginUserName = localStorage.getItem("loginUserName");
  const loginUserPhone = localStorage.getItem("loginUserPhone");
  const loginUserId = localStorage.getItem("loginUserId");
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("");
  const navigate = useNavigate();

  const custId = localStorage.getItem("loginUserId");


  const [cartTotalProductQty, setCartTotalProductQty] = useState(0);

  const {ready} = useCount()

  // const {myCartTotalProductQty,setCartTotalProductQty} = useCount()


  const currentLocation = location.pathname;


  console.log(currentLocation, "cureent location .................");

  // Update currentPath based on location state when the component mounts or when location changes


//cart total quantity function



  // const fetchCartTotalProductQty = async (custId) => {
  //   setCartTotalProductQty(0); // Reset the total before fetching

  

  //   try{

  //     console.log("heliiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
  //     // Construct the query to get the aggregate sum
  //     const cartQuery = query(
  //       collection(firestore,'CART'),
  //       where('CUSTOMER_ID', '==', custId),
  //       // AggregateField('PRODUCT_QTY') // Firestore-specific function to perform the sum
  //       aggregateField('PRODUCT_QTY')
  //     );
  //     // console.log("helooooooooooooooooooooooooooooo")
  //     const aggregateSnapshot = await getDocs(cartQuery);

  //     console.log(aggregateSnapshot, "aggregateSnapshot..............................")

  //     // Extract the sum from the result (ensure you check the correct field)
  //     let sumValue = 0;
  //     aggregateSnapshot.forEach((doc) => {
  //       sumValue += doc.data().PRODUCT_QTY;
  //     });

  //     // Update state with the total quantity
  //     setCartTotalProductQty(sumValue || 0);


  //     console.log(sumValue, "sum value ................");


  // const fetchCartTotalProductQty = async (custId) => {
  //   setCartTotalProductQty(0); // Reset the total before fetching

  //   try {
  //     // Construct the query with the sum aggregation
  //     const cartQuery = query(
  //       collection(firestore, 'CART'),
  //       where('CUSTOMER_ID', '==', custId)
  //     );

  //     // Use `getAggregateFromServer` to fetch the sum
  //     const aggregateSnapshot = await getAggregateFromServer(cartQuery, { PRODUCT_QTY: sum('PRODUCT_QTY') });

  //     // Extract the sum value
  //     const sumValue = aggregateSnapshot.data().PRODUCT_QTY;

  //     // Update state with the total quantity
  //     setCartTotalProductQty(sumValue || 0);



  //   } catch (e) {
  //     console.error("Error fetching cart total:", e);
  //     setCartTotalProductQty(0);
  //     console.log("helooooooooooooooooooooooooooooo")
  //   }
  // };


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




  useEffect(() => {
    if (location.state?.from) {
      setCurrentPath("/" + location.state.from);
    } else {
      setCurrentPath(location.pathname);
    }
  }, [location]);

  const handleClick = (path) => {
    setCurrentPath(path);
  };

  const handleUserImgClick = () => {
    // if (currentLocation == "/summery") {
    //   document.body.classList.add(null);
    //   return;
    // }

    // const buttonClickNavigatoin =
    //   loginUserId === "" || loginUserId == null
    //     ? "/login"
    //     : document.body.classList.add("modal-active", "overflow-hidden");

    // navigate(buttonClickNavigatoin);
    

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
    <header className="head-web">
      <div className="web-logo">
        <img src={bocheClearLogo} alt="bocheLogo" />
      </div>
      <ul className="nav">
        <li>
          <Link
            onClick={() => handleClick("/home")}AC
            to="/home"
            className={`link ${currentPath === "/home" ? "active" : ""}`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            onClick={() => handleClick("/coupen")}
            to="/coupen"
            className={`link ${currentPath === "/coupen" ? "active" : ""}`}
          >
            My Tickets
          </Link>
        </li>
        <li>
          <Link
            onClick={() => handleClick("/order")}
            to="/order"
            className={`link ${currentPath === "/order" ? "active" : ""}`}
          >
            My Orders
          </Link>
        </li>
        <li>
          <Link
            onClick={() => handleClick("/store")}
            to="/store"
            className={`link ${currentPath === "/store" ? "active" : ""}`}
          >
            Stores
          </Link>
        </li>
        <li>
          <Link
            onClick={() => handleClick("/transactions")}
            to="/transactions"
            className={`link ${
              currentPath === "/transactions" ? "active" : ""
            }`}
          >
            Transactions
          </Link>
        </li>


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
                <span> {cartTotalProductQty ? cartTotalProductQty : 0} </span>
              </div>
            </div>
          </div>
        </div>

        <div className="user-web" onClick={handleUserImgClick}>
          {userIdIMg ? (
            <img src={userIdIMg} alt="User" />
          ) : loginUserName ? (
            <div className="user-text">{getInitial(loginUserName)}</div>
          ) : (
            <div className="icon_user_defaul">
              <FaUser />
            </div>
          )}
          <div className="name_number">
            <h6>{loginUserName}</h6>
            <p>{loginUserPhone}</p>
          </div>
        </div>

      </ul>
      <Profile />
    </header>
  );
};



export default HeaderWeb;

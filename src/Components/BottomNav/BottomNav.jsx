import React from "react";
import "./BottomNav.css";
import { Assets } from "../Assets/Assets";
import { Link, useLocation } from "react-router-dom";

export const BottomNav = ({ setCurrentScreen, currentScreen }) => {
  // const location = useLocation();

  // const {
  //   productImages,
  //   productPrice,
  //   } = location.state || {};

  const handleNavClick = (screen) => {
    setCurrentScreen(screen);
    // console.log("screeeeeeeenn",screen);
    
  };

  //   const [activeImages, setActiveImages] = useState({
  //     home: Assets.Home,
  //     coupen: Assets.Coupen,
  //     order: Assets.Order,
  //     store: Assets.Store,
  //   });

  //   // Function to handle image change when link is active
  //   const handleImageChange = (link, activeImage) => {
  //     setActiveImages((prevState) => ({
  //       ...prevState,
  //       [link]: activeImage,
  //     }));
  //   };

  return (
    <div className="bottom-nav">
      <ul className="nav-bar">
        <li>
          <Link
            to="/home"
            className={`link ${currentScreen === "home" ? "active" : ""}`}
            // onClick={() => handleNavClick("home")}
          >
            <img
              src={currentScreen === "home" ? Assets.activeHo : Assets.Home}
              alt="Home"
            />
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/coupen"
            className={`link ${currentScreen === "coupen" ? "active" : ""}`}
            // onClick={() => handleNavClick("coupen")}
          >
            <img
              src={
                currentScreen === "coupen" ? Assets.activeCou : Assets.Coupen
              }
              alt="My Coupons"
            />
            My Tickets
          </Link>
        </li>
        <li>
          <Link
            to="/order"
            className={`link ${currentScreen === "order" ? "active" : ""}`}
            // onClick={() => handleNavClick("order")}
          >
            <img
              src={currentScreen === "order" ? Assets.activeOr : Assets.Order}
              alt="My Orders"
            />
            My Orders
          </Link>
        </li>
        <li>
          <Link
            to="/store"
            className={`link ${currentScreen === "store" ? "active" : ""}`}
            // onClick={() => handleNavClick("store")}
          >
            <img
              src={currentScreen === "store" ? Assets.activeSt : Assets.Store}
              alt="Stores"
            />
            Stores
          </Link>
        </li>
        <li>
          <Link
            to="/transactions"
            className={`link ${
              currentScreen === "transactions" ? "active" : ""
            }`}
            // onClick={() => handleNavClick("transactions")}
          >
            <img
              src={
                currentScreen === "transactions"
                  ? Assets.activeTr
                  : Assets.Transac
              }
              alt="Transactions"
            />
            Transactions
          </Link>
        </li>
      </ul>
    </div>
  );
};

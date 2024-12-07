import React, { useState, useEffect } from "react";
import { BottomNav } from "../../Components/BottomNav/BottomNav";
import { Home } from "../Home/Home";
import Coupons from "../Coupons/Coupons";
import Orders from "../Orders/Orders";
import Store from "../Store/Store";
import Transactions from "../Transactions/Transactions";
import { useLocation, useNavigate } from "react-router-dom";

const BottomNavFixed = () => {
  const location = useLocation();
  const [currentScreen, setCurrentScreen] = useState("home");


  console.log(location.state?.from);
  // setCurrentScreen(from);
  // console.log(location.state?.productId)
  // console.log(location.state?.productImages)
  // console.log(location.state?.productPrice)
  // console.log(navigator)

  // useEffect(() => {
  //   setCurrentScreen(location.state?.from);
  // }, [location]);

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <Home />;
      case "coupen":
        return <Coupons />;
      case "order":
        return <Orders />;
      case "store":
        return <Store />;
      case "transactions":
        return <Transactions />;
      default:
        return <Home />;
    }
  };
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 870);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 870);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      {renderScreen()}
      {isMobile && (
        <BottomNav
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
        />
      )}
    </>
  );
};

export default BottomNavFixed;

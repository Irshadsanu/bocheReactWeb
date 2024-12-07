import React, { useState, useEffect } from "react";
import { BottomNav } from "../../Components/BottomNav/BottomNav";
import { MyOrders } from "../../Components/MyOrders/MyOrders";
import HeaderWeb from "../../Components/Header/HeaderWeb";
import Footer from "../Footer/Footer";
import TopHome from "../../Components/TopNav/TopHome";

const Orders = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 870);
  const [currentScreen, setCurrentScreen] = useState("order");


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
    <div>
      {isMobile ? <TopHome head="My Orders" /> : <HeaderWeb />}
      <MyOrders />
      <Footer />
       {isMobile && (
        <BottomNav
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
        />
      )}
    </div>
  );
};

export default Orders;

import React, { useState, useEffect } from "react";
import { BottomNav } from "../../Components/BottomNav/BottomNav";
import MyCoupons from "../../Components/MyCoupons/MyCoupons";
import HeaderWeb from "../../Components/Header/HeaderWeb";
import Footer from "../Footer/Footer";
import TopHome from "../../Components/TopNav/TopHome";

const Coupons = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 870);
  const [currentScreen, setCurrentScreen] = useState("coupen");

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
      {isMobile ? <TopHome head="My Coupons" /> : <HeaderWeb />}
      <MyCoupons />
      {isMobile && (
        <BottomNav
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
        />
      )}
      <Footer />
    </div>
  );
};

export default Coupons;

import React, { useState, useEffect } from "react";
import { TopNav } from "../../Components/TopNav/TopNav";
import { BottomNav } from "../../Components/BottomNav/BottomNav";
// import Donate from "../../Components/Donate/Donate";
import ConfirmedOrder from "../../Components/ConfirmedOrder/ConfirmedOrder";
import { DonateDetails } from "../../Components/DonateDetails/DonateDetails";
import { useLocation } from "react-router-dom";
import HeaderWeb from "../../Components/Header/HeaderWeb";
import Footer from "../Footer/Footer";

const Summery = () => {
  
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 870);
  const [isTab, setisTab] = useState(window.innerWidth <= 800);

  // const currentUrl = window.location.href;

  // console.log(currentUrl, "current url .................")

  const currentPathname = location.pathname;
  console.log(currentPathname, "current url .................");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 870);
      setisTab(window.innerWidth <= 800);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // console.log(location);
  // console.log(order.orderPrice)
  return (
    <div>
      {isMobile ? <TopNav title="Purchase Summary" /> : <HeaderWeb />}
      {/* <Donate /> */}
      <ConfirmedOrder />
      <DonateDetails />
      <BottomNav />
      {/* {isTab ? <BottomNav /> : <Footer />} */}
      <Footer />
    </div>
  );
};

export default Summery;

import React, { useState, useEffect } from "react";
import StoreList from "../../Components/StoreList/StoreList";
import { BottomNav } from "../../Components/BottomNav/BottomNav";
import HeaderWeb from "../../Components/Header/HeaderWeb";
import Footer from "../Footer/Footer";
import TopHome from "../../Components/TopNav/TopHome";

const Store = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 870);
  const [currentScreen, setCurrentScreen] = useState("store");
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
      {isMobile ? <TopHome head="Store List" /> : <HeaderWeb />}
      <StoreList />
      <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen}/>
      <Footer />
    </>
  );
};

export default Store;

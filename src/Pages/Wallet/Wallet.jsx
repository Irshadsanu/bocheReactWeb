import React, { useState, useEffect } from "react";
import { TopNav } from "../../Components/TopNav/TopNav";
// import { Button } from "../../Components/Button/Button";
import { MyWallet } from "../../Components/MyWallet/MyWallet";
import HeaderWeb from "../../Components/Header/HeaderWeb";
import Footer from "../Footer/Footer";
import { useLocation } from "react-router-dom";

const Wallet = () => {
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

  const location = useLocation();

 

  useEffect(() => {

    const handlePropState = (event) =>  {
      if (location.state && location.state?.preventBack ) {
        alert("cannot go back to payment gate way ");
        window.history.pushState({ preventBack: true }, '', '');

      }
    };

    window.history.pushState({ preventBack: true }, '', '');
    window.addEventListener( "popstate", handlePropState);

    return ()=> {
      window.removeEventListener("popstate", handlePropState);
    }

  }, [location.state])



  return (
    <>
      {isMobile ? <TopNav title="My Wallet" /> : <HeaderWeb />}
      <MyWallet />
      {/* <Button title="Withdraw Now" /> */}
      <Footer />
    </>
  );
};

export default Wallet;

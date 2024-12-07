import React, { useState, useEffect } from "react";
import "./Home.css";
import { Header } from "../../Components/Header/Header";
import { Spotlight } from "../../Components/Spotlight/Spotlight";
import { Count } from "../../Components/Count/Count";
import { Social } from "../../Components/Social/Social";
import { Button } from "../../Components/Button/Button";
import { BottomNav } from "../../Components/BottomNav/BottomNav";
import { useLocation, useNavigate } from "react-router-dom";
import { useProduct } from "../../Context/ProductContext";
import HeaderWeb from "../../Components/Header/HeaderWeb";
import Footer from "../Footer/Footer";
import MultiList from "../../Components/MultiList/MultiList";

export const Home = () => {
  const location = useLocation();
  const { productImages, productPrice } = location.state || {};
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [isTab, setIsTab] = useState(window.innerWidth <= 870);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      
      setIsMobile(window.innerWidth <= 480);
      setIsTab(window.innerWidth <= 870);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const loginUserId = localStorage.getItem("loginUserId");
  console.log(loginUserId, "loggggggggggggs");
  
  const handleButtonClick = () => {
    const page =
      loginUserId === "" || loginUserId === null ? "/login" : "/address";
    navigate(page);
  };

  return (
    <>
      {isTab ? <Header /> : <HeaderWeb />}
      <Spotlight />

      {/* <Count productImages={productImages} productPrice={productPrice} /> */}

      <MultiList/>
      
      { isTab ? <Social /> : <Footer /> }

      {/* {isMobile && (
        // <Button
        //   title="Buy Now"
        //   page={
        //     loginUserId === "" || loginUserId === null ? "/login" : "/address"
        //   }
        // />
        <button className="buy-btn" onClick={handleButtonClick}>
          Buy Now
        </button>
      )} */}
    </>
  );
};

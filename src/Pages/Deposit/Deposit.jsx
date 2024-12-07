import React, { useState, useEffect } from "react";
import { TopNav } from "../../Components/TopNav/TopNav";
// import { Button } from "../../Components/Button/Button";
import MyDeposit from "../../Components/MyDeposit/MyDeposit";
import TopnavWeb from "../../Components/TopNav/TopnavWeb";

const Deposit = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      {/* {isMobile ? <TopNav title="Deposit" /> : ""} */}
      <MyDeposit />
      {/* <Button title="Pay Now" /> */}
    </>
  );
};

export default Deposit;

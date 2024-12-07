import React, { useState, useEffect } from "react";
import { TopNav } from "../../Components/TopNav/TopNav";
// import { Button } from "../../Components/Button/Button";
import WithdrawDetails from "../../Components/WithdrawDetails/WithdrawDetails";
import TopnavWeb from "../../Components/TopNav/TopnavWeb";

const Withdraw = () => {
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
      {isMobile ? <TopNav title="Withdraw" /> : <TopnavWeb />}
      <WithdrawDetails />
      {/* <Button title="Redeem Now" /> */}
    </>
  );
};

export default Withdraw;

import React, { useState, useEffect } from "react";
import { TopNav } from "../TopNav/TopNav";
import SelectPayment from "../SelectPayment/SelectPayment";
// import { Button } from "../../Components/Button/Button";
import TopnavWeb from "../TopNav/TopnavWeb";
import Footer from "../../Pages/Footer/Footer";
import { useLocation } from "react-router-dom";

export const Payment = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const location = useLocation();


  const deliveryRate = location.state?.deliveryRate;
  const estimatedDays = location.state?.estimatedDays;
  const courierName = location.state?.courierName;
  const courierId = location.state?.courierId;

  // console.log(deliveryRate, "delivery rate ..................")
  // console.log(estimatedDays, "estimatedDays rate ..................")
  // console.log(courierName, "courierName rate ..................")

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
    <div>
      {isMobile ? <TopNav title="Address" /> : <TopnavWeb />}
      <SelectPayment 
            deliveryRate={deliveryRate} 
            estimatedDays={estimatedDays}
            courierName={courierName}
            courierId={courierId}
             />
      {/* <Button title="Place Order" /> */}
      <Footer />
    </div>
  );
};

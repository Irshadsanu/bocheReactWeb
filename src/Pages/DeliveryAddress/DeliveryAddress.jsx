import React, { useState, useEffect } from "react";
import "./DeliveryAddress.css";
import { TopNav } from "../../Components/TopNav/TopNav";
import { UserDetails } from "../../Components/UserDetails/UserDetails";
import { useLocation, useNavigate } from "react-router-dom";
import TopnavWeb from "../../Components/TopNav/TopnavWeb";

const DeliveryAddress = () => {
  const location = useLocation();
  const { frmId, toId } = location.state || { frmId: "", toId: "" };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  console.log(location.state?.frmId);
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
      <UserDetails frmId={location.state?.frmId} toId={location.state?.toId} />
    </div>
  );
};

export default DeliveryAddress;

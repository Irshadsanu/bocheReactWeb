import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { listenForPayment } from "./listenForPayment";
import PayLoader from "../../Components/Assets/gif/Animation - 1719835352356.json";
import { useCount } from "../../Context/Context";
import Lottie from "react-lottie";

const CheckStatus = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const [ccAvanueListen, setCcAvanueListen] = useState(true);
  const { paymentLoader, setPaymentLoader } = useCount();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: PayLoader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { apiurl, oid, loginUserId, loginUserName, loginUserPhone } =
    location.state || {};
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const { id } = useParams();
  const query = useQuery();
  const paymentId = query.get("oid");
  const from = query.get("from");
  const qty = query.get("qty");

  useEffect(() => {
    setPaymentLoader(true);
    listenForPayment(
      paymentId,
      qty,
      loginUserId,
      loginUserName,
      loginUserPhone,
      ccAvanueListen,
      setCcAvanueListen,
      navigator,
      from,
      setPaymentLoader
    );

    return () => {
      // Cleanup listener on component unmount
      if (
        typeof window._paymentListenStream !== "undefined" &&
        window._paymentListenStream !== null
      ) {
        window._paymentListenStream();
      }
    };
  }, [
    paymentId,
    loginUserId,
    loginUserName,
    loginUserPhone,
    ccAvanueListen,
    navigator,
    from,
    setPaymentLoader,
  ]);

  return (
    <div
      className="checkstatus"
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="content">
        <Lottie
          animationData={PayLoader}
          className="lottie-animation"
          options={defaultOptions}
          height={300}
          width={300}
        />
        <p style={{ textAlign: "center", fontSize: "20px" }}>
          Don't Skip the page
        </p>
      </div>
    </div>
  );
};

export default CheckStatus;

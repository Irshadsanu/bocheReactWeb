import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { listenForPayment } from "./listenForPayment";
import { useCount } from "../../Context/Context";
import { HashLoader } from "react-spinners";
import Lottie from "react-lottie";
import PayLoader from "../../Components/Assets/gif/Animation - 1719835352356.json";

const ICICIWebView = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const {
    apiurl,
    paymentId,
    from,
    loginUserId,
    loginUserName,
    loginUserPhone,
    loginUserPlace,
    loginUserPhoto,
    proId,
    proQty,
    proPrice,
    orderPrice,
    proImg,
    loginUserPincode
  } = location.state || {};
  const { ccLoading, setCcLoading } = useCount();

  const [iciciListen, setIciciListen] = useState(true);

  useEffect(() => {
    listenForPayment(
      paymentId,
      loginUserId,
      loginUserName,
      loginUserPhone,
      iciciListen,
      setIciciListen,
      navigator
    );

    return () => {
      // Cleanup listener on component unmount
      if (
        typeof window._paymentListenStream !== "undefined" &&
        window._paymentListenStream !== null
      ) {
        window._paymentListenStream();
        setCcLoading(false);
      }
    };
  }, [
    paymentId,
    loginUserId,
    loginUserName,
    loginUserPhone,
    iciciListen,
    setIciciListen,
    navigator,
    setCcLoading
  ]);

  useEffect(() => {
    if (apiurl) {
      console.log(apiurl);
      // Function to dynamically create and submit the form
      const submitPaymentForm = () => {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = apiurl;

        const urlParams = new URLSearchParams(apiurl.split("?")[1]);
        urlParams.forEach((value, key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      };

      // Call the function to submit the form
      submitPaymentForm();
    }
  }, [apiurl]);

  const linkStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    textAlign: "center",
    display: "block",
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: PayLoader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const OnLoadingClick = () => {
    setCcLoading(true);
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {ccLoading ? (
        <HashLoader color={"#007bff"} loading={ccLoading} size={150} />
      ) : (
        <Lottie
        animationData={PayLoader}
        className="lottie-animation"
        options={defaultOptions}
        height={400}
        width={400}
      />
      )}
    </div>
  );
};

export default ICICIWebView;

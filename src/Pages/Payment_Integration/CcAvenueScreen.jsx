import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import Iframe from "react-iframe";
import IframeComponent from "./iframeCompo";
import { listenForPayment } from "./listenForPayment";
import { useCount } from "../../Context/Context";
import { HashLoader } from "react-spinners";
const CcAvenueScreen = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const {
    apiurl,
    paymentId,
    from,
    loginUserId,
    loginUserName,
    loginUserPhone,
  } = location.state || {};
  const { ccLoading, setCcLoading } = useCount();

  const [ccAvanueListen, setCcAvanueListen] = useState(true);

  useEffect(() => {
    listenForPayment(
      paymentId,
      loginUserId,
      loginUserName,
      loginUserPhone,
      ccAvanueListen,
      setCcAvanueListen,
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
    ccAvanueListen,
    setCcAvanueListen,
    navigator,
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
  const OnLoadingClick = () => {
    setCcLoading(true);
  };

  return (
    // <IframeComponent apiurl={apiurl} />

    // <div dangerouslySetInnerHTML={{ __html: apiurl }} />

    <div style={{ position: "relative", height: "100vh" }}>
      {/* {apiurl}
 <iframe
        src={apiurl}
        width="100%"
        height="600px"
        frameBorder="0"
        scrolling="auto"
        sandbox="allow-same-origin allow-scripts allow-forms"
        title={apiurl}
      ></iframe> */}
    </div>
  );
};

export default CcAvenueScreen;

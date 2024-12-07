import React, { useState, useEffect } from "react";
import "./Privacy.css";
import { TopNav } from "../../Components/TopNav/TopNav";
import TopnavWeb from "../../Components/TopNav/TopnavWeb";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase";

export const Privacy = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [privacyData, setPrivacyData] = useState();

  async function fetchData() {
    const data = await getDoc(doc(firestore, "CMS", "Privacy Policy"));
    if (data.exists()) {
      setPrivacyData(data.data());
      console.log(data.data(), "Document data");
    } else {
      console.log("No such document!");
    }
  }

  useEffect(() => {
    fetchData();
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
      {isMobile ? <TopNav title="Privacy Policy" /> : <TopnavWeb />}
      <div className="contents">
        <div className="intro">
          <h6>Privacy Policy</h6>
        </div>
        <p>
          {privacyData?.PRIVACY_POLICY_START}
          <a href="mailto:care@bochemart.com">
            {privacyData?.PRIVACY_POLICY_LINK}
          </a>
          {privacyData?.PRIVACY_POLICY_END}
        </p>

        <div className="intro">
          <h6>Data Collection and Processing</h6>
        </div>
        <p>{privacyData?.DATA_SECURITY_FIRST}</p>

        <div className="intro">
          <h6>How We Use Your Data</h6>
        </div>
        <p>{privacyData?.HOW_TO_USE}</p>

        <div className="intro">
          <h6>Legal Basis of Processing Personal Data</h6>
        </div>
        <p>{privacyData?.LEGAL_BASIS}</p>

        <div className="intro">
          <h6>Disclosure of Your Data</h6>
        </div>
        <p>{privacyData?.DISCLOSURE}</p>

        <div className="intro">
          <h6>Billing and Payments</h6>
        </div>
        <p>{privacyData?.BILLING_AND_PAYMENTS}</p>

        <div className="intro">
          <h6>Minors Data</h6>
        </div>
        <p>{privacyData?.MINORS_DATA}</p>

        <div className="intro">
          <h6>Data Retention</h6>
        </div>
        <p>{privacyData?.DATA_RETENTION}</p>

        <div className="intro">
          <h6>Data Principal Rights</h6>
        </div>
        <p>{privacyData?.DATA_PRINCIPAL_RIGHTS}</p>

        <div className="intro">
          <h6>Cross Border Data Transfer</h6>
        </div>
        <p>
          {privacyData?.CROSS_BORDER_DATA_FIRST}
          {privacyData?.CROSS_BORDER_DATA_TRANSFER}
        </p>

        <div className="intro">
          <h6>Data Security</h6>
        </div>
        <p>{privacyData?.DATA_SECURITY}</p>

        <div className="intro">
          <h6>Complaints or Inquiry</h6>
        </div>
        <p>
          {privacyData?.COMPLAINTS_OR_INQUIRY_START}
          <a href="mailto:care@bochemart.com">
            {privacyData?.PRIVACY_POLICY_LINK}
          </a>
          {privacyData?.COMPLAINTS_OR_INQUIRY_END}
        </p>
        <div className="intro">
          <h6>Duties of Data Principals</h6>
        </div>
        <p>{privacyData?.DUTIES_OF_DATA_PRINCIPALS}</p>
        <div className="intro">
          <h6>Changes to this Privacy Notice</h6>
        </div>
        <p>{privacyData?.CHANGES_TO_THIS_PRIVACY_NOTICE}</p>

        <Link to="/home" className="link">
          <button>Ok</button>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

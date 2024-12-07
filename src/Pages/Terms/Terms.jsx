import React, { useState, useEffect } from "react";
import "./Terms.css";
import { TopNav } from "../../Components/TopNav/TopNav";
import TopnavWeb from "../../Components/TopNav/TopnavWeb";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";
import { collection, doc, getDoc, query } from "firebase/firestore";
import { firestore } from "../../firebase";

export const Terms = () => {
  const [termData, setTermData] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const id = localStorage.getItem("loginUserId");
  async function fetchData() {
    const data = await getDoc(doc(firestore, "CMS", "Terms and Conditions"));
    if (data.exists()) {
      setTermData(data.data());
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
      {isMobile ? <TopNav title="Terms and Conditions" /> : <TopnavWeb />}
      <div className="conditions">
        <div className="head">
          <h6>Terms and Conditions</h6>
        </div>
        <p>{termData?.TERMS_AND_CONDITIONS}</p>
        <div className="head">
          <h6>Cancellation of Order</h6>
        </div>
        <p>{termData?.CANCELLATION_OF_ORDER}</p>
        <div className="head">
          <h6>Return Policy</h6>
        </div>
        <p>
          {termData?.RETURN_POLICY_START}
          <a href="mailto:care@bochemart.com">care@bochemart.com</a>
          {termData?.RETURN_POLICY_END}
        </p>
        <div className="head">
          <h6>Refund Policy</h6>
        </div>
        <p>
          <h5>General Terms</h5>
          <p>{termData?.GENERAL_TERMS}</p>
          <h5>Exceptions to the No Refund Policy</h5>
          <p>{termData?.EXCEPTIONS_TO_NO_REFUND}</p>
          <h5>How to Request a Refund </h5>
          <p>
            Email Us: Please email us at
            <a href="mailto:care@bochemart.com">care@bochemart.com</a> with your
            order details, the reason for the refund request, and any supporting
            evidence (e.g., photos of damaged items).
          </p>
          <h5>Process and Timeline</h5>
          <p>{termData?.PROCESS_AND_TIMELINE}</p>
          <h5>Contact Information </h5>
          <p>
            {termData?.CONTACT_INFORMATION}
            <a href="mailto:care@bochemart.com">care@bochemart.com</a>
          </p>
        </p>
        <div className="head">
          <h6>Terms of Use</h6>
        </div>
        <p>{termData?.TERMS_OF_USE}</p>
        <div className="head">
          <h6>Prohibited Use</h6>
        </div>
        <p>{termData?.PROHIBITED_USE}</p>
        <div className="head">
          <h6>Contents Posted</h6>
        </div>
        <p>{termData?.CONTENT_POSTED}</p>
        <div className="head">
          <h6>License</h6>
        </div>
        <p>{termData?.LICENSE}</p>

        <div className="head">
          <h6>General Obligations</h6>
        </div>
        <p>{termData?.GENERAL_OBLIGATION}</p>

        <div className="head">
          <h6>Privacy</h6>
        </div>
        <p>{termData?.PRIVACY}</p>

        <div className="head">
          <h6>Third-PartyAPI’s/ Links</h6>
        </div>
        <p>{termData?.THIRD_PARTY_API_OR_LINK}</p>

        <div className="head">
          <h6>Legal Disclaimer</h6>
        </div>
        <p>{termData?.LEGAL_DISCLAIMER}</p>

        <div className="head">
          <h6>Our Liability</h6>
        </div>
        <p>{termData?.OUR_LIABILITY}</p>

        <div className="head">
          <h6>Third Party Liability</h6>
        </div>
        <p>{termData?.THIRD_PARTY_LIABILITY}</p>
        <div className="head">
          <h6> Your Liability</h6>
        </div>
        <p>{termData?.YOUR_LIABILITY}</p>
        <div className="head">
          <h6> Force Majeure</h6>
        </div>
        <p>{termData?.FORCE_MAJEURE}</p>

        <div className="head">
          <h6>Indemnity</h6>
        </div>
        <p>{termData?.INDEMNITY}</p>

        <div className="head">
          <h6>Applicable Law / Jurisdiction</h6>
        </div>
        <p>{termData?.APPLICABLE_LAW_JURISDICTION}</p>

        <div className="head">
          <h6> Description</h6>
        </div>
        <p>{termData?.DESCRIPTION}</p>
        <div className="head">
          <h6> Limitation of Liability</h6>
        </div>
        <p>{termData?.LIMITATION_OF_LIABILITY}</p>

        <div className="head">
          <h6> Shipping</h6>
        </div>
        <p>{termData?.SHIPPING}</p>

        <div className="head">
          <h6> Charges</h6>
        </div>
        <p>{termData?.CHARGES}</p>

        <div className="head">
          <h6> Delivery</h6>
        </div>
        <p>{termData?.DELIVERY}</p>

        <div className="head">
          <h6> Time Frame</h6>
        </div>
        <p>{termData?.DELIVERY}</p>

        <div className="head">
          <h6> Shipping Charges</h6>
        </div>
        <p>{termData?.SHIPPING_CHARGE}</p>

        <Link to="/home" className="link">
          <button>Ok</button>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

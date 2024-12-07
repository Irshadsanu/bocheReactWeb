import React, { useState, useEffect } from "react";
import "./AboutUs.css";
import { TopNav } from "../../Components/TopNav/TopNav";
import TopnavWeb from "../../Components/TopNav/TopnavWeb";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";

const AboutUs = () => {
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
    <div>
      {isMobile ? <TopNav title="About Us" /> : <TopnavWeb />}
      <div className="about">
        <div className="about-boc">
          <p>Boche Mart</p>
          <p>PATRONYMIC TECHNOLOGIES AND INDUSTRIES PRIVATE LIMITED,</p>
          <p>
            <p> ContactUs </p>
            <p> Floor No : Door No.52/1060,Old-21-349-28A Building No/Flat</p>
            <p> No : West Fort Tower </p>
            <p> Road/Street :Ayy anthole Road</p>
            <p> City/Town/Village : Thrissur </p>
            <p> District : Thrissur </p>
            <p> State : Kerala</p>
            <p> PinCode : 680004</p>
          </p>
        </div>
        {/* <ul>
          <li>
            <h6>Developed by</h6>
            <a
              href="https://www.spinecodes.com"
              className="linkey"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.spinecodes.com
            </a>
          </li>
          <li>
            <h6>Managed by</h6>
            <a
              href="https://www.nuerobots.com"
              className="linkey"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.nuerobots.com
            </a>
          </li>
        </ul> */}

        <Link to="/home" className="link">
          <button>Ok</button>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;

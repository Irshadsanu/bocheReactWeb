import React, { useState } from "react";
import "./Footer.css";
import { Assets } from "../../Components/Assets/Assets";
import { IoMailOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import Support from "../../Components/Alert/Support";

const Footer = () => {
  const [showSupport, setShowSupport] = useState(false);

  const location = useLocation()

  const scrollToTop = () => {
    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling effect
    });
  };


  const handleShowSupport = () => {
    setShowSupport(true);
  };

  const handleCloseSupport = () => {
    setShowSupport(false);
  };

  return (
    <div>
      <footer>
        <div className="footer-social">
          <img src={Assets.Boche_web} alt="" className="boche-logo" />
          <p>
            The Group began its journey in the year 1863, with a single store at
            Varanthirappilly, Thrissur. 158 years since the initial spark, today
            the Chemmanur Brand stands strong with its legacy of traditional
            values and visionary outlook. The hallmark of the group is enhancing
            lifestyles while promoting progress in all walks of life. This is
            what has earned us the trust and goodwill of people and continues to
            widen our reach across the globe.
          </p>
          <h6>Boche Social Links</h6>
          <ul className="links-medias">
            <li>
              <img src={Assets.Instagram} alt="" />
            </li>
            <li>
              <img src={Assets.Facebook} alt="" />
            </li>
            <li>
              <img src={Assets.Youtube} alt="" />
            </li>
            <li>
              <img src={Assets.Snapchat} alt="" />
            </li>
            <li>
              <img src={Assets.twitter} alt="" />
            </li>
          </ul>
        </div>
        <div className="footer-right-contents">
          <div className="bottom-nav-list">
            <ul className="options-contact">
              <li onClick={handleShowSupport}>Helpline</li>

              <Link to="/terms" className="link">
                <li>Terms and Condition</li>
              </Link>
              <Link to="/privacy" className="link">
                <li>Privacy Policy</li>
              </Link>
              <Link to="/about" className="link">
                <li>Contact Us</li>
              </Link>
              <li>
                <a href="mailto:care@bochemart.com" className="link">
                  <IoMailOutline />
                  care@bochemart.com
                </a>
              </li>
            </ul>
            <ul className="pages-option">
              <Link to="/home" className="link"
              onClick={(e) => {
                if(location.pathname === "/home"){
                  e.preventDefault()
                  scrollToTop(); // Scroll to the top
                }
              }}>
                <li>Home</li>
              </Link>
              <Link to="/coupen" className="link"
              onClick={(e) => {
                if(location.pathname === '/coupen'){
                  e.preventDefault()
                  scrollToTop()
                }
              }}>
                <li>My Tickets</li>
              </Link>
              <Link to="/order" className="link"
              onClick={(e) => {
                if(location.pathname === '/order'){
                  e.preventDefault()
                  scrollToTop()
                }
              }}>
                <li>My Orders</li>
              </Link>
              <Link to="/store" className="link"
              onClick={(e) => {
                if(location.pathname === '/store'){
                  e.preventDefault()
                  scrollToTop()
                }
              }}>
                <li>Stores</li>
              </Link>
              <Link to="/transactions" className="link"
              onClick={(e) => {
                if(location.pathname === '/transactions'){
                  e.preventDefault()
                  scrollToTop()
                }
              }}>
                <li>Transactions</li>
              </Link>
            </ul>
          </div>
          <div className="available">
            <img src={Assets.PlayStore} alt="" />
            <img src={Assets.AppStore} alt="" />
          </div>
        </div>
      </footer>
      <div className="footer-bar">
        <p>© boCHE MART 2024 . All Rights Reserved.</p>
        <p>
          {/* <span>Developed By</span>
          <img src={Assets.Spine} alt="" /> */}
        </p>
      </div>

      {showSupport && (
        <div className="support_alert_overlay" onClick={handleCloseSupport}>
          <div
            className="alert-content_support"
            onClick={(e) => e.stopPropagation()}
          >
            <Support />
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;

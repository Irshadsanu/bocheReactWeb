// import React, { useEffect, useState } from "react";
// import "./TopNav.css";
// import { Assets } from "../Assets/Assets";
// import Profile from "../Profile/Profile";
// import { FaUser } from "react-icons/fa6";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaAngleLeft } from "react-icons/fa";

// const TopnavWeb = () => {
//   const loginUserName = localStorage.getItem("loginUserName");
//   const userIdIMg = localStorage.getItem("loginUserPhoto");
//   const loginUserPhone = localStorage.getItem("loginUserPhone");
//   const loginUserId = localStorage.getItem("loginUserId");
//   const navigate = useNavigate();
//   const [backOn, setBackOn] = useState(false);

//   const [showProfile, setShowProfile] = useState(false);
//   const location = useLocation();
//   const currentLocation = location.pathname;

//   useEffect(() => {
//     if (currentLocation == "/paymentweb") {
//       setBackOn(true);
//     }
//   });

//   const handleProfile = () => {
//     const navigateData =
//       loginUserId == "" || loginUserId == null
//         ? "/login"
//         : document.body.classList.add("modal-active", "overflow-hidden");

//     navigate(navigateData);
//   };

//   const onBackinPaymentWb = () => {
//     navigate("/home");
//   };

//   const getInitial = (name) => {
//     return name ? name.charAt(0).toUpperCase() : "";
//   };

//   return (
//     <div>
//       <div className="web-topnav">
//         <div className="total_conatainer_web">
//           {backOn ?? (
//             <div className="backoo_btn">
//               <FaAngleLeft onClick={onBackinPaymentWb} />
//             </div>
//           )}
//           <div className="logo-nav">
//             <img className="boche_tex" src={Assets.Boche_web} alt="" />
//           </div>
//         </div>

//         <div onClick={handleProfile} className="user-top-web">
//           {userIdIMg ? (
//             <img className="user_img" src={userIdIMg} alt="User" />
//           ) : loginUserName ? (
//             <div className="user-initial_img">{getInitial(loginUserName)}</div>
//           ) : (
//             <div className="icon_user_defaul">
//               <FaUser />
//             </div>
//           )}
//           <div className="name_number">
//             <h6>{loginUserName}</h6>
//             <p> {loginUserPhone} </p>
//           </div>
//         </div>
//       </div>

//       <Profile />
//     </div>
//   );
// };

// export default TopnavWeb;

import React, { useEffect, useState } from "react";
import "./TopNav.css";
import { Assets } from "../Assets/Assets";
import Profile from "../Profile/Profile";
import { FaUser } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";

const TopnavWeb = () => {
  const loginUserName = localStorage.getItem("loginUserName");
  const userIdIMg = localStorage.getItem("loginUserPhoto");
  const loginUserPhone = localStorage.getItem("loginUserPhone");
  const loginUserId = localStorage.getItem("loginUserId");
  const navigate = useNavigate();
  const [backOn, setBackOn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();
  const currentLocation = location.pathname;

  // Only run the effect when the location changes
  useEffect(() => {
    if (currentLocation === "/paymentweb") {
      setBackOn(true);
    } else {
      setBackOn(false);
    }
  }, [currentLocation]);

  console.log(currentLocation,"loccccc")

  const handleProfile = () => {
    if (!loginUserId) {
      navigate("/login");
    } else {
      document.body.classList.add("modal-active", "overflow-hidden");
      setShowProfile(true);
    }
  };

  const onBackinPaymentWb = () => {
    navigate("/home");
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  return (
    <div>
      <div className="web-topnav">
        <div className="total_conatainer_web">
          {!backOn && (
            <div className="backoo_btn">
              <FaAngleLeft onClick={onBackinPaymentWb} />
            </div>
          )}
          <div className="logo-nav">
            <img className="boche_tex" src={Assets.boche_clear_logo} alt="Logo" />
          </div>
        </div>
        {currentLocation == "/terms" ? "" : (

        <div onClick={handleProfile} className="user-top-web">
          {userIdIMg ? (
            <img className="user_img" src={userIdIMg} alt="User" />
          ) : loginUserName ? (
            <div className="user-initial_img">{getInitial(loginUserName)}</div>
          ) : (
            <div className="icon_user_default">
              <FaUser />
            </div>
          )}
          <div className="name_number">
            <h6>{loginUserName}</h6>
            <p>{loginUserPhone}</p>
          </div>
        </div>
        )}
      </div>

      {showProfile && <Profile />}
    </div>
  );
};

export default TopnavWeb;

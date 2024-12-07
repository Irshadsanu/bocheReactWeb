// import React, { useState } from "react";
// import "./Profile.css";
// import { FaChevronLeft } from "react-icons/fa6";
// import Yakob from "../Assets/Images/yakoob.svg";
// import { useNavigate } from "react-router-dom";
// import Logout from "../Alert/Logout"; // Import the Logout component
// import ProfileEdit from "../ProfileEdit/ProfileEdit";
// import { FaUserAlt } from "react-icons/fa";

// const Profile = () => {

//   const userIdIMg = localStorage.getItem("loginUserPhoto");

//   const navigator = useNavigate();
//   const [showLogoutAlert, setShowLogoutAlert] = useState(false); // State for alert visibility
//   const [showEditPopup, setShowEditPopup] = useState(false);

//   const handleClick = () => {
//     document.body.classList.remove("modal-active", "overflow-hidden");
//   };

//   const loginUserPhone = localStorage.getItem("loginUserPhone");
//   const loginUserName = localStorage.getItem("loginUserName");
//   const loginUserPhoto = localStorage.getItem("loginUserPhoto");
//   const loginUserPlace = localStorage.getItem("loginUserPlace");

//   const handleClearLocalStorage = () => {
//     localStorage.clear();
//     navigator("/login");
//     console.log("Local storage cleared!");
//   };

//   const handleLogoutClick = () => {
//     setShowLogoutAlert(true);
//   };

//   const handleCancelLogout = () => {
//     setShowLogoutAlert(false);
//   };

//   const handleConfirmLogout = () => {
//     handleClearLocalStorage();
//     setShowLogoutAlert(false);
//   };
//   const handleEditClick = () => {
//     setShowEditPopup(true);
//   };

//   const handleCancelEdit = () => {
//     setShowEditPopup(false);
//   };

//   return (
//     <div className="profile">
//       <div className="profile-box">
//         <h6>Profile</h6>
//         <span onClick={handleClick}>
//           <FaChevronLeft />
//         </span>
//       </div>
//       <div className="bottom">
//         <div className="profile-details">
//           <div className="user-image">
//             {/* <img
//               src={
//                 loginUserPhoto === "" || loginUserPhoto === undefined
//                   ? <FaUserAlt />
//                   : loginUserPhoto
//               }
//               alt=""
//             /> */}
//             {userIdIMg ? <img src={userIdIMg}/> : <FaUserAlt className="UserIcon" /> }
//           </div>
//           <h5>{loginUserName}</h5>
//           <p>{loginUserPhone}</p>
//           <p>{loginUserPlace}</p>
//         </div>
//         <div className="btns">
//           <button onClick={handleLogoutClick} className="out">
//             Log out
//           </button>
//           <button onClick={handleEditClick} className="edit">
//             {/* Add onClick for edit */}
//             Edit
//           </button>
//         </div>
//       </div>

//       <div className="overlay" onClick={handleClick}></div>

//       {showLogoutAlert && (
//         <Logout onCancel={handleCancelLogout} onConfirm={handleConfirmLogout} />
//       )}

//       {showEditPopup && ( // Render the ProfileEdit component when showEditPopup is true
//         <div className="popup">
//           <div className="popup-inner">
//             <button className="close-btn" onClick={handleCancelEdit}>
//               Close
//             </button>
//             <ProfileEdit setShowEditPopup={setShowEditPopup} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;

import React, { useState } from "react";
import "./Profile.css";
import { FaChevronLeft, FaUser } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import Logout from "../Alert/Logout"; // Import the Logout component
import ProfileEdit from "../ProfileEdit/ProfileEdit";
import { FaUserAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const Profile = () => {
  const userIdIMg = localStorage.getItem("loginUserPhoto");
  const navigator = useNavigate();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false); // State for alert visibility
  const [showEditPopup, setShowEditPopup] = useState(false);

  const handleClick = () => {
    document.body.classList.remove("modal-active", "overflow-hidden");
  };

  const loginUserPhone = localStorage.getItem("loginUserPhone");
  const loginUserName = localStorage.getItem("loginUserName");
  const loginUserPlace = localStorage.getItem("loginUserPlace");

  const handleClearLocalStorage = () => {
    localStorage.clear();
    navigator("/login");
    console.log("Local storage cleared!");
  };

  const handleLogoutClick = () => {
    setShowLogoutAlert(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutAlert(false);
  };

  const handleConfirmLogout = () => {
    handleClearLocalStorage();
    setShowLogoutAlert(false);
    window.location.reload();
  };

  const handleEditClick = () => {
    setShowEditPopup(true);
  };

  const handleCancelEdit = () => {
    setShowEditPopup(false);
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  return (
    <div className="profile">
      <div className="profile-box">
        <h6>Profile</h6>
        <span onClick={handleClick}>
          <IoClose />
        </span>
      </div>
      <div className="bottom">
        <div className="profile-details">
          <div className="user-image">
            {userIdIMg ? (
              <img src={userIdIMg} alt="User" />
            ) : loginUserName ? (
              <div className="user-text-profile">
                {getInitial(loginUserName)}
              </div>
            ) : (
              <div className="login_user_profile_default">
                <FaUser />
              </div>
            )}
          </div>
          <h5>{loginUserName}</h5>
          <p>{loginUserPhone}</p>
          <p>{loginUserPlace}</p>
        </div>
        <div className="btns">
          <button onClick={handleEditClick} className="edit">
            Edit
          </button>
          <button onClick={handleLogoutClick} className="out">
            Log out
          </button>
        </div>

        {/* <div className="dashboard">
          <h5>Dashboard</h5>
          <div className="list_dashboard">
            <div className="item_dashboard">
              <h6>237</h6>
              <p>Tea Packet Purchased</p>
            </div>
            <div className="item_dashboard">
              <h6>₹13,000</h6>
              <p>Amount Spent</p>
            </div>
            <div className="item_dashboard">
              <h6>79</h6>
              <p>Total Winning</p>
            </div>
            <div className="item_dashboard">
              <h6>₹1,500</h6>
              <p>Wallet Amount</p>
            </div>
            <div className="item_dashboard">
              <h6>3</h6>
              <p>Channel of Pucrchasing</p>
            </div>
          </div>
        </div> */}
      </div>

      <div className="overlay" onClick={handleClick}></div>

      {showLogoutAlert && (
        <Logout onCancel={handleCancelLogout} onConfirm={handleConfirmLogout} />
      )}

      {showEditPopup && ( // Render the ProfileEdit component when showEditPopup is true
        <div className="popup">
          <div className="popup-inner">
            <button className="close-btn" onClick={handleCancelEdit}>
              <IoClose />
            </button>
            <ProfileEdit setShowEditPopup={setShowEditPopup} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

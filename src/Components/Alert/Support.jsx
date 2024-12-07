// import React from "react";
// import "./Alert.css";
// import { IoIosCall } from "react-icons/io";
// import { FaWhatsapp } from "react-icons/fa";

// const Support = () => {
//   return (
//     <div className="support">
//       <div className="logout-box">
//         <h6>Connect Support Team</h6>
//         <p>
//           Excellence in helpline services is the heartbeat of user satisfaction
//         </p>
//         <div className="cancel-btn">
//           <button className="calb">
//             <IoIosCall />
//             Call
//           </button>
//           <button className="calb">
//             <FaWhatsapp />
//             WhatsApp
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Support;
import React, { useState, useEffect } from "react";
import "./Alert.css";
import { IoIosCall } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { database } from "../../firebase";
import { ref, onValue, off } from "firebase/database";

const Support = () => {
  const [contactNumber, setContactNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    const dbRef = ref(database, "0");
    const listener = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setContactNumber(data.PhoneNumber ?? "");
        setWhatsappNumber(data.WhatsappNumber ?? "");
      }
    });

    // Cleanup the listener on component unmount
    return () => off(dbRef, "value", listener);
  }, []);

  const handleCall = () => {
    window.location.href = `tel:${contactNumber}`;
  };

  const handleWhatsApp = () => {
    const message = "Hello, I need support";
    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
  };

  return (
    <div className="support">
      <div className="logout-box">
        <h6>Connect Support Team</h6>
        <p>
          Excellence in helpline services is the heartbeat of user satisfaction
        </p>
        <div className="cancel-btn">
          <button className="calb" onClick={handleCall}>
            <IoIosCall />
            Call
          </button>
          <button className="calb" onClick={handleWhatsApp}>
            <FaWhatsapp />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default Support;

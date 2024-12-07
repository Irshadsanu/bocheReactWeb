// import React, { useEffect, useState } from "react";
// import "./Login.css";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { database } from "../../firebase";
// import { ref, onValue } from "firebase/database";
// import { firestore } from "../../firebase";
// import {
//   getDocs,
//   collection,
//   query,
//   where,
//   increment,
//   getFirestore,
//   setDoc,
//   doc,
// } from "firebase/firestore";

// import { TimeContext } from "./timerProvider";
// import Footer from "../Footer/Footer";
// import { useCount } from "../../Context/Context";
// import { ClipLoader } from "react-spinners";
// import firebase from "firebase/compat/app";
// import { toast } from "sonner";

// export const Login = () => {
//   const navigator = useNavigate();
//   const [showLoading, setShowLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [formData, setFormData] = useState({
//     mobile: "",
//   });
//   const [mobile, setMobile] = useState("");
//   const [numberValue, setNumberValue] = useState("");
//   const [spineVerificationId, setSpineVerificationId] = useState(null);
//   const [showOtpWidForAdmin, setShowOtpWidForAdmin] = useState(false);
//   const { loginLoader, setLoginLoader } = useCount();

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const incrementCount = async () => {
//     try {
//       await setDoc(
//         doc(firestore, "OTP", "OTP_COUNT"),
//         {
//           COUNT: increment(1),
//         },
//         { merge: true }
//       );
//       //   await firestore
//       //     .collection("OTP")
//       //     .doc("OTP_COUNT")
//       //     .update({
//       //       COUNT: increment(1),
//       //     });
//     } catch (e) {
//       console.error("Error incrementing count:", e);
//     }
//   };

//   const [fixedOtpList, setFixedOtpList] = useState([]);

//   const fixedOtpChecking = () => {
//     const fixedOtpRef = ref(database, "FIXED_OTP");

//     // Create a reference to the 'FIXED_OTP' node
//     onValue(fixedOtpRef, (snapshot) => {
//       // Attach a listener to the reference
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const otpList = Object.keys(data); // Extract the keys as the OTP list
//         setFixedOtpList(otpList);
//         console.log(otpList);
//       } else {
//         console.log("dfjh"); // Handle the case where the snapshot does not exist
//       }
//     });
//   };

//   useEffect(() => {
//     fixedOtpChecking(); // Call the function to check for OTPs on component mount
//   }, []);

//   function dd() {
//     console.log("wisee");
//   }

//   async function sentOtp() {
//     setLoginLoader(true);
//     try {
//       const phone = mobile;
//       console.log("sanuiiiiiiiiiii");
//       const response = await axios.post(
//         "https://bochemartrun-wyynhb4exq-uc.a.run.app/callotp",
//         { phone },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log("san31111111111");

//       if (response.status === 200) {
//         console.log("otp success");
//         console.log(response.data.encOtp);

//         setSpineVerificationId(response.data.encOtp);
//         // setShowOtpWidForAdmin(true);
//         // incrementCount();

//         // // Assuming you have a way to access and manipulate timeProvider context
//         // // const { resetCountdown, startCountdown } = useContext(TimeContext);
//         // resetCountdown();
//         // startCountdown();
//         navigator("/otp", {
//           state: { mobile: phone, verificationId: response.data.encOtp, mode:"login" },
//         });
//         setLoginLoader(false);
//         incrementCount();
//         // alert("OTP sent to phone successfully");
//         toast.success("OTP sent to phone successfully");
//       } else {
//         console.log("Request failed with status:", response.status);
//         setLoginLoader(false);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setLoginLoader(false);
//     }
//   }

//   const checkMobileInFirestore = async (mobile) => {
//     const userCollectionRef = collection(firestore, "USERS");
//     const q = query(
//       userCollectionRef,
//       where("PHONE", "==", mobile),
//       where("TYPE", "==", "CUSTOMER"),
//       where("STATUS", "==", "ACTIVE")
//     );
//     const querySnapshot = await getDocs(q);
//     return !querySnapshot.empty; // Returns true if the mobile number exists
//   };

//   // const { resetCountdown, startCountdown } = useContext(TimeContext);

//   const handleOtpRequest = async () => {
//     const phone = mobile; // Replace with actual phone number
//     await sentOtp();
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault(); // Prevent default form submission
//     // getOtpApi(); // Call getOtpApi function
//     // fixedOtpChecking();

//     const mobileExists = await checkMobileInFirestore(mobile);

//     // const ref = collection(firestore, "user");
//     if (mobileExists) {
//       if (fixedOtpList.includes(mobile)) {
//         navigator("/otp", { state: { mobile: mobile } });
//       } else {
//         sentOtp();
//       }
//     } else {
//       //   alert("User Not Found");
//       toast.error("User Not Found");
//       navigator("/register");
//     }
//   };

//   return (
//     <>
//       <div className="login">
//         <div className="img-box">
//           <h5>Login</h5>
//           <p>
//             Hey we’ve handpicked some items just for you. Tap to see your
//             personalized recommendations!
//           </p>
//         </div>
//         <div className="login-box">
//           <input
//             type="tel"
//             placeholder="Mobile Number"
//             name="mobile"
//             value={mobile}
//             onChange={(e) => setMobile(e.target.value)}
//             minLength={10}
//             maxLength={10}
//             pattern="[0-9]{10}"
//             required
//           />
//           <button type="submit" onClick={handleLogin} className="log-b">
//             {loginLoader ? <ClipLoader color="#36d7b7" size={16} /> : "Login"}
//           </button>

//           <p>Don’t You Have Account ?</p>
//           <Link to="/register">
//             <button className="reg">Register</button>
//           </Link>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

import React, { useEffect, useState } from "react";
import "./Login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { database } from "../../firebase";
import { ref, onValue, get } from "firebase/database";
import { firestore } from "../../firebase";
import {
  getDocs,
  collection,
  query,
  where,
  increment,
  getFirestore,
  setDoc,
  doc,
} from "firebase/firestore";

import { TimeContext } from "./timerProvider";
import Footer from "../Footer/Footer";
import { useCount } from "../../Context/Context";
import { ClipLoader } from "react-spinners";
import firebase from "firebase/compat/app";
import { toast } from "sonner";

export const Login = () => {
  const navigator = useNavigate();
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    mobile: "",
  });
  const [mobile, setMobile] = useState("");
  const [numberValue, setNumberValue] = useState("");
  const [spineVerificationId, setSpineVerificationId] = useState(null);
  const [showOtpWidForAdmin, setShowOtpWidForAdmin] = useState(false);
  const { loginLoader, setLoginLoader } = useCount();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const incrementCount = async () => {
    try {
      await setDoc(
        doc(firestore, "OTP", "OTP_COUNT"),
        {
          COUNT: increment(1),
        },
        { merge: true }
      );
      //   await firestore
      //     .collection("OTP")
      //     .doc("OTP_COUNT")
      //     .update({
      //       COUNT: increment(1),
      //     });
    } catch (e) {
      console.error("Error incrementing count:", e);
    }
  };

  const [fixedOtpList, setFixedOtpList] = useState([]);

  const fixedOtpChecking = async () => {
    const fixedOtpRef = ref(database, "FIXED_OTP");

    // Create a reference to the 'FIXED_OTP' node
    // onValue(fixedOtpRef, (snapshot) => {
    // Attach a listener to the reference

    const snapshot = await get(fixedOtpRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const otpList = Object.keys(data); // Extract the keys as the OTP list
      setFixedOtpList(otpList);
      console.log(otpList);
    } else {
      console.log("dfjh"); // Handle the case where the snapshot does not exist
    }
    // });
  };

  useEffect(() => {
    fixedOtpChecking(); // Call the function to check for OTPs on component mount
  }, []);

  function dd() {
    console.log("wisee");
  }

  async function sentOtp() {
    setLoginLoader(true);
    try {
      const phone = mobile;
      console.log("sanuiiiiiiiiiii");
      const response = await axios.post(
        "https://bochemartrun-wyynhb4exq-uc.a.run.app/callotp",
        { phone },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("san31111111111");

      if (response.status === 200) {
        console.log("otp success");
        console.log(response.data.encOtp);

        setSpineVerificationId(response.data.encOtp);
        // setShowOtpWidForAdmin(true);
        // incrementCount();

        // // Assuming you have a way to access and manipulate timeProvider context
        // // const { resetCountdown, startCountdown } = useContext(TimeContext);
        // resetCountdown();
        // startCountdown();
        navigator("/otp", {
          state: {
            mobile: phone,
            verificationId: response.data.encOtp,
            mode: "login",
          },
        });
        setLoginLoader(false);
        incrementCount();
        // alert("OTP sent to phone successfully");
        toast.success("OTP sent to phone successfully");
      } else {
        console.log("Request failed with status:", response.status);
        setLoginLoader(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoginLoader(false);
    }
  }

  const checkMobileInFirestore = async (mobile) => {
    const userCollectionRef = collection(firestore, "USERS");
    const q = query(
      userCollectionRef,
      where("PHONE", "==", mobile),
      where("TYPE", "==", "CUSTOMER"),
      where("STATUS", "==", "ACTIVE")
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Returns true if the mobile number exists
  };

  // const { resetCountdown, startCountdown } = useContext(TimeContext);

  const handleOtpRequest = async () => {
    const phone = mobile; // Replace with actual phone number
    await sentOtp();
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if(!mobile || mobile.length === 0){
      toast.error("please enter a valid Mobile Number")
      return
    }
    // getOtpApi(); // Call getOtpApi function
    // fixedOtpChecking();
    setLoginLoader(true);

    const mobileExists = await checkMobileInFirestore(mobile);

    // const ref = collection(firestore, "user");
    if (mobileExists) {
      if (fixedOtpList.includes(mobile)) {
        navigator("/otp", { state: { mobile: mobile } });
        setLoginLoader(false);
      } else {
        sentOtp();
      }
    } else {
      //   alert("User Not Found");
      toast.error("User Not Found");
      navigator("/register");
      setLoginLoader(false);
    }
  };

  return (
    <>
      <div className="login">
        <div className="img-box">
          <h5>Login</h5>
          <p>
            Hey we’ve handpicked some items just for you. Tap to see your
            personalized recommendations!
          </p>
        </div>
        <div className="login-box">
          <input
            type="tel"
            placeholder="Mobile Number"
            name="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            minLength={10}
            maxLength={10}
            pattern="[0-9]{10}"
            required
          />
          {/* <button type="submit" onClick={handleLogin} className="log-b">
            {loginLoader ? <ClipLoader color="#36d7b7" size={16} /> : "Login"}
          </button> */}
          {loginLoader ? (
            <button className="log-b">
              <ClipLoader color="#36d7b7" size={16} />
            </button>
          ) : (
            <button type="submit" onClick={handleLogin} className="log-b">
              Login
            </button>
          )}

          <p>Don’t You Have Account ?</p>
          <Link to="/register">
            <button className="reg">Register</button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

// import React, { useState } from "react";
// import "./Registration.css";
// import { Assets } from "../../Components/Assets/Assets";
// import { firestore } from "../../firebase";
// import { setDoc, collection, doc, where, getDocs } from "firebase/firestore";
// import { Link, useNavigate } from "react-router-dom";
// import Footer from "../Footer/Footer";
// import { ClipLoader } from "react-spinners";
// import axios from "axios";
// import firebase from "firebase/compat/app";
// import { query } from "firebase/database";

// export const Registration = () => {
//   const navigator = useNavigate();

//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [pin, setPin] = useState("");
//   const [userState, setUserState] = useState("");
//   const [error, setError] = useState("");
//   const [regLoader, setRegLoader] = useState(false);
//   const [spineVerificationId, setSpineVerificationId] = useState(null);

//   const [stateSelectValue, setStateSelectValue] = useState('');

//   const validateForm = () => {
//     if (!name.trim() || !phone.trim() || !userState.trim()) {
//       setError("All fields are required");
//       return false;
//     }
//     if (phone.length < 10) {
//       setError("Phone number must be at least 10 digits long");
//       return false;
//     }
//     setError("");
//     return true;
//   };

//   const incrementCount = async () => {
//     try {
//       await firestore
//         .collection("OTP")
//         .doc("OTP_COUNT")
//         .update({
//           COUNT: firebase.firestore.FieldValue.increment(1),
//         });
//     } catch (e) {
//       console.error("Error incrementing count:", e);
//     }
//   };

//   async function sentOtp() {
//     try {
//       const response = await axios.post(
//         "https://bocherun-wyynhb4exq-uc.a.run.app/callotp",
//         { phone },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 200) {
//         setSpineVerificationId(response.data.encOtp);
//         navigator("/otp", {
//           state: { mobile: phone, verificationId: response.data.encOtp },
//         });
//         incrementCount();
//         alert("OTP sent to phone successfully");
//       } else {
//         console.log("Request failed with status:", response.status);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }

//   const checkMobileInFirestore = async (mobile) => {
//     const userCollectionRef = collection(firestore, "USERS");
//     const q = query(userCollectionRef, where("PHONE", "==", mobile));
//     const querySnapshot = await getDocs(q);
//     return !querySnapshot.empty;
//   };

// // -=============================================================================

// const usePinCodeApi = () => {

//   const getPinCodeApi = async (pincode) => {
//     const url = `https://api.postalpincode.in/pincode/${pincode}`;
//     try {
//       const response = await fetch(url);
//       if (response.status === 200) {
//         const jsonData = await response.json();
//         jsonData.forEach(item => {
//           const newMap = item['PostOffice'];
//           newMap.forEach(element => {
//             setStateSelectValue(element['State'].toString());
//             // Set other fields here if needed
//           });
//         });
//         console.log("if condition check");
//         return true;
//       } else {
//         setError('Failed to fetch data');
//         return false;
//       }
//     } catch (e) {
//       console.error("exception", e);
//       setError(e.message);
//       return false;
//     }
//   };

//   return { stateSelectValue, getPinCodeApi, error };
// };

// const PinCodeComponent = () => {
//   const { stateSelectValue, getPinCodeApi, error } = usePinCodeApi();
//   const [pincode, setPincode] = useState('');

//   const handleGetPinCode = async () => {
//     const success = await getPinCodeApi(pincode);

//   };

//   const registerUser = async () => {

//     PinCodeComponent();

//     if (success) {
//       // console.log('Data fetched successfully');
//     } else {

//       if (!validateForm()) {
//         return;
//       }

//       const ismobile = await checkMobileInFirestore(phone);

//       if (ismobile) {
//         alert("User already exists");
//       } else {
//         setRegLoader(true);
//         const now = new Date();
//         const id = now.getTime().toString();

//         const regMap = {
//           ID: id,
//           NAME: name,
//           PHONE: phone,
//           STATE: userState,
//           TYPE: "CUSTOMER",
//           REF: `CUSTOMERS/${id}`,
//           STATUS: "ACTIVE",
//         };

//         const cosMap = {
//           ID: id,
//           NAME: name,
//           PHONE: phone,
//           STATE: userState,
//           DATE: now,
//           STATUS: "ACTIVE",
//         };
//         const ref = doc(collection(firestore, "USERS"), id);
//         const ref2 = doc(collection(firestore, "CUSTOMERS"), id);

//         try {
//           await setDoc(ref, regMap);
//           await setDoc(ref2, cosMap);
//           console.log("User registered successfully");
//           setRegLoader(false);
//           sentOtp();
//         } catch (error) {
//           setRegLoader(false);
//           console.error("Error registering user:", error);
//         }
//       }

//     }

//   };

//   return (
//     <>
//       <div className="registration">
//         <div className="img-box">
//           <h5>Registration</h5>
//           <p>
//             We’ve picked out something special just for you! Check out the app
//             now to see what’s waiting.
//           </p>
//         </div>
//         <div className="register-box">
//           {error && <div className="error-message">{error}</div>}
//           <input
//             type="text"
//             placeholder="Full Name"
//             name="NAME"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <input
//             type="number"
//             placeholder="Mobile Number"
//             name="MOBILE"
//             value={phone}
//             maxLength= {10}
//             onChange={(e) => setPhone(e.target.value)}
//           />
//           <input
//             type="number"
//             placeholder="PIN CODE"
//             name="PIN"
//             value={pin}
//             maxLength= {6}
//             onChange={(e) => setPin(e.target.value)}
//           />
//           <select
//             name="STATE"
//             value={userState}
//             onChange={(e) => setUserState(e.target.value)}
//             className="reg-state"
//           >
//             <option value="">Select State</option>
//             <option value="Andhra Pradesh">Andhra Pradesh</option>
//             <option value="Arunachal Pradesh">Arunachal Pradesh</option>
//             <option value="Assam">Assam</option>
//             <option value="Bihar">Bihar</option>
//             <option value="Chhattisgarh">Chhattisgarh</option>
//             <option value="Goa">Goa</option>
//             <option value="Gujarat">Gujarat</option>
//             <option value="Haryana">Haryana</option>
//             <option value="Himachal Pradesh">Himachal Pradesh</option>
//             <option value="Jharkhand">Jharkhand</option>
//             <option value="Karnataka">Karnataka</option>
//             <option value="Kerala">Kerala</option>
//             <option value="Madhya Pradesh">Madhya Pradesh</option>
//             <option value="Maharashtra">Maharashtra</option>
//             <option value="Manipur">Manipur</option>
//             <option value="Meghalaya">Meghalaya</option>
//             <option value="Mizoram">Mizoram</option>
//             <option value="Nagaland">Nagaland</option>
//             <option value="Odisha">Odisha</option>
//             <option value="Punjab">Punjab</option>
//             <option value="Rajasthan">Rajasthan</option>
//             <option value="Sikkim">Sikkim</option>
//             <option value="State">State</option>
//             <option value="Tamil Nadu">Tamil Nadu</option>
//             <option value="Telangana">Telangana</option>
//             <option value="Tripura">Tripura</option>
//             <option value="Uttar Pradesh">Uttar Pradesh</option>
//             <option value="Uttarakhand">Uttarakhand</option>
//             <option value="West Bengal">West Bengal</option>
//           </select>
//           <button type="submit" onClick={registerUser} className="reg-b">
//             {regLoader ? <ClipLoader color="#36d7b7" size={16} /> : "Register"}
//           </button>
//           <p>Already have an account?</p>
//           <Link to="/login">
//             <button className="resend">Sign In</button>
//           </Link>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

import React, { useEffect, useState } from "react";
import "./Registration.css";
import { Assets } from "../../Components/Assets/Assets";
import { database, firestore } from "../../firebase";
import { setDoc, collection, doc, where, getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import firebase from "firebase/compat/app";
import { query } from "firebase/database";
import { toast } from "sonner";

import { ref, onValue } from "firebase/database";

export const Registration = () => {
  const navigator = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [userState, setUserState] = useState("");
  const [error, setError] = useState("");
  const [regLoader, setRegLoader] = useState(false);
  const [spineVerificationId, setSpineVerificationId] = useState(null);
  const [userDistrict, setUserDistrict] = useState("");



  useEffect(() => {
    fixedOtpChecking(); // Call the function to check for OTPs on component mount
  }, []);




  const validateForm = () => {
    if (!name.trim() || !phone.trim() || !pin.trim()) {
      setError("All fields are required");
      return false;
    }
    if (phone.length < 10) {
      setError("Phone number must be at least 10 digits long");
      return false;
    }
    if (pin.length < 6) {
      setError("Pin code must be at least 6 digits long");
      return false;
    }
    setError("");
    return true;
  };

  console.log(pin, "pin on intial");

  const incrementCount = async () => {
    try {
      await firestore
        .collection("OTP")
        .doc("OTP_COUNT")
        .update({
          COUNT: firebase.firestore.FieldValue.increment(1),
        });
    } catch (e) {
      console.error("Error incrementing count:", e);
    }
  };

  async function sentOtp(name , phone , pin ,state ,district) {
    try {
      const response = await axios.post(
        "https://bochemartrun-wyynhb4exq-uc.a.run.app/callotp",
        { phone },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSpineVerificationId(response.data.encOtp);

        console.log(response.data.encOtp, "this isi verification id ............")
        // navigator("/otp", {
        //   state: { mobile: phone, verificationId: response.data.encOtp,ref:ref,ref2:ref2,regMap:regMap,cosMap: cosMap, mode:"register" },
        // });, 
        navigator("/otp", {
          state: { mobile: phone, verificationId: response.data.encOtp,name:name,pin:pin,state:state,district: district, mode:"register" },
        });
        incrementCount();
        // alert("OTP sent to phone successfully");
        toast.success("OTP sent to phone successfully");
      } else {
        console.log("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const checkMobileInFirestore = async (mobile) => {
    const userCollectionRef = collection(firestore, "USERS");
    const q = query(userCollectionRef, where("PHONE", "==", mobile));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  // ===============================================

  const usePinCodeApi = () => {

    const getPinCodeApi = async (pincode) => {
      const url = `https://api.postalpincode.in/pincode/${pincode}`;
      try {
        const response = await fetch(url);
        if (response.status === 200) {
          const jsonData = await response.json();
          const postOffices = jsonData[0].PostOffice;
          if (postOffices && postOffices.length > 0) {
            const state = postOffices[0].State;
            const district = postOffices[0].District;
            return { state, district };
          }
        } else {
          setError("Failed to fetch data");
          return null;
        }
      } catch (e) {
        console.error("Exception", e);
        setError(e.message);
        return null;
      }
    };

    return { getPinCodeApi, error };
  };

  const { getPinCodeApi } = usePinCodeApi(pin);

  //////////////////////////////////////////////////////// Register user

  // const registerUser = async () => {
  //   if (!validateForm()) {
  //     return;
  //   }
  //   setRegLoader(true);

  //   const stateFromApi = await getPinCodeApi(pin);

  //   console.log(pin, "pin on inside");

  //   if (stateFromApi) {
  //     const ismobile = await checkMobileInFirestore(phone);

  //     const { state, district } = stateFromApi;
  //     setUserDistrict(district);
  //     setUserState(state);

  //     if (ismobile) {
  //       // alert("User already exists");
  //       toast.warning("User already exists");
  //       setRegLoader(false);
  //       navigator("/login");
  //     } else {
  //       // setRegLoader(false);
  //       // setRegLoader(false);
  //       const now = new Date();
  //       const id = now.getTime().toString();

  //       console.log(pin, "pin on insiide function ");

  //       const regMap = {
  //         ID: id,
  //         NAME: name,
  //         PHONE: phone,
  //         STATE: state,
  //         TYPE: "CUSTOMER",
  //         PINCODE: pin,
  //         REF: `CUSTOMERS/${id}`,
  //         STATUS: "ACTIVE",
  //         REGISTERD_BY: "WEB",
  //         DISTRICT: district,
  //       };

  //       const cosMap = {
  //         ID: id,
  //         NAME: name,
  //         PHONE: phone,
  //         PINCODE: pin,
  //         STATE: state,
  //         TYPE: "CUSTOMER",
  //         DATE: now,
  //         STATUS: "ACTIVE",
  //         REGISTERD_BY: "WEB",
  //         DISTRICT: district,
  //       };
  //       const ref = doc(collection(firestore, "USERS"), id);
  //       const ref2 = doc(collection(firestore, "CUSTOMERS"), id);

  //       try {
  //         await setDoc(ref, regMap);
  //         await setDoc(ref2, cosMap);
  //         console.log("User registered successfully");
  //         sentOtp();
  //         // setRegLoader(false);
  //       } catch (error) {
  //         setRegLoader(false);
  //         console.error("Error registering user:", error);
  //       }
  //     }
  //   } else {
  //     //   alert("Pin code is incorrect");
  //     toast.error("Pin code is incorrect");
  //     setRegLoader(false);
  //   }
  // };


  const [fixedOtpList, setFixedOtpList] = useState([]);

  const fixedOtpChecking = () => {
    const fixedOtpRef = ref(database, "FIXED_OTP");

    // Create a reference to the 'FIXED_OTP' node
    onValue(fixedOtpRef, (snapshot) => {
      // Attach a listener to the reference
      if (snapshot.exists()) {
        const data = snapshot.val();
        const otpList = Object.keys(data); // Extract the keys as the OTP list
        setFixedOtpList(otpList);
        console.log(otpList);
      } else {
        console.log("dfjh"); // Handle the case where the snapshot does not exist
      }
    });
  };



  const registerUser = async () => {
    
    if (!validateForm()) {
      return;
    }
    setRegLoader(true);
  
    const stateFromApi = await getPinCodeApi(pin);
  
    if (stateFromApi) {
      
      const isMobile = await checkMobileInFirestore(phone);
  
      const { state, district } = stateFromApi;
      setUserDistrict(district);
      setUserState(state);
  
      if (isMobile) {
        toast.warning("User already exists");
        setRegLoader(false);
        navigator("/login");

      } else {


        // const mobileExists = await checkMobileInFirestore(phone);

        // const ref = collection(firestore, "user");
        // if (mobileExists) {
          if (fixedOtpList.includes(phone)) {


            navigator("/otp", { 
              state: { mobile: phone,name:name,pin:pin,state:state,district: district, mode:"register" } 
            });

          } else {
            // sentOtp();
            sentOtp(name , phone , pin ,state ,district);
          }
        // } else {
        //   //   alert("User Not Found");
        //   toast.error("User Not Found");
        //   navigator("/register");
        // }
  
        // Instead of calling Firestore here, navigate to OTP and pass the ref and other data
        // sentOtp(name , phone , pin ,state ,district);

        // navigator("/otp", {
        //   state: {
        //     mobile: phone,
        //     verificationId: spineVerificationId,
        //     ref,  // Pass the Firestore user reference
        //     ref2, // Pass the Firestore customer reference
        //     regMap,
        //     cosMap,
        //     mode: "register"
        //   },
        // });
  
        // Send the OTP after navigation to OTP component
        
      }
    } else {
      toast.error("Pin code is incorrect");
      setRegLoader(false);
    }
  };

  


  return (
    <>
      <div className="registration">
        <div className="img-box">
          <h5>Registration</h5>
          <p>
            We’ve picked out something special just for you! Check out the app
            now to see what’s waiting.
          </p>
        </div>
        <div className="register-box">
          {error && <div className="error-message">{error}</div>}
          <input
            type="text"
            placeholder="Full Name"
            name="NAME"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            name="MOBILE"
            value={phone}
            maxlength={"10"}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="text" // Use text instead of number
            placeholder="PIN CODE"
            name="PIN"
            value={pin}
            maxLength="6" // Properly limits input to 6 characters
            onChange={(e) => {
              // Allow only numeric input
              if (/^\d*$/.test(e.target.value)) {
                setPin(e.target.value);
              }
            }}
          />


          {/* <input
            type="text"
            placeholder="State"
            name="STATE"
            value={userState}
            readOnly
          /> */}
          {/* <input
            type="text"
            placeholder="District "
            name="DISTRICT"
            value={userDistrict}
            readOnly
          /> */}

          {regLoader ? (
            <button className="reg-b">
              <ClipLoader color="#36d7b7" size={16} />
            </button>
          ) : (
            <button type="submit" onClick={registerUser} className="reg-b">
              Register
            </button>
          )}

          <p>Already have an account?</p>
          <Link to="/login">
            <button className="resend">Sign In</button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

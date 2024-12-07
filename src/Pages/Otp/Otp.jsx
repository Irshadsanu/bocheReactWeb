import React, { useState, useEffect } from "react";
import { Assets } from "../../Components/Assets/Assets";
import axios from "axios";
import "./Otp.css";
import { useLocation, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import {
  getDocs,
  collection,
  query,
  where,
  getFirestore,
  doc,
  setDoc,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import { ProductModel } from "../../ModelClasses/product_model";
import { useProduct } from "../../Context/ProductContext";
import Footer from "../Footer/Footer";
import { ClipLoader } from "react-spinners";
import sentOtp from "../Login/sentOtp";
import { toast } from "sonner";

const Otp = () => {
  const { productData, setProductData } = useProduct();
  // console.log(productData);
  const location = useLocation();
  // const { mobile, verificationId } = location.state || {};
  const navigator = useNavigate();
  const [otp, setOtp] = useState(["123456", "000000", "111111", "555555"]);
  const [userOtp, setUserOtp] = useState("");
  // console.log(verificationId);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [oloader, setOloader] = useState(false);
  const [timer, setTimer] = useState(30); // Initial timer value in seconds
  const [timerEnded, setTimerEnded] = useState(false);

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    mobile: "",
    otp: "", // Add otp field to the formData
  });
  const [showLoading, setShowLoading] = useState(false);

  // const { mobile, verificationId, ref, ref2, regMap, cosMap ,mode} = location.state || {};


  const { mobile, verificationId, name, state, mode, district, pin } =
    location.state || {};

  console.log(
    mobile,
    verificationId,
    district,
    state,
    name,
    pin,
    mode,
    "ddddddddddddddddddd"
  );

  console.log(location, "locaiton.................");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLoginOrRegister = () => {
    // e.preventDefault();
    setOloader(true);
    if (mode === "register") {
      handleRegister(); // Logic for registration
    } else {
      handleLogin(); // Logic for login
    }
  };

  const now = new Date();
  const id = now.getTime().toString();

  const regMap = {
    ID: id,
    NAME: name,
    PHONE: mobile,
    STATE: state,
    TYPE: "CUSTOMER",
    PINCODE: pin,
    REF: `CUSTOMERS/${id}`,
    STATUS: "ACTIVE",
    REGISTERD_BY: "WEB",
    DISTRICT: district,
  };

  const cosMap = {
    ID: id,
    NAME: name,
    PHONE: mobile,
    PINCODE: pin,
    STATE: state,
    TYPE: "CUSTOMER",
    DATE: now,
    STATUS: "ACTIVE",
    REGISTERD_BY: "WEB",
    DISTRICT: district,
  };

  // Firestore document references
  const ref1 = doc(collection(firestore, "USERS"), id);
  const ref2 = doc(collection(firestore, "CUSTOMERS"), id);




  const handleRegister = async () => {
    // e.preventDefault();
    setOloader(true);
    setShowLoading(true);
    const targetKey = mobile;
    const pin = userOtp;

    if (verificationId === null || verificationId === undefined) {

      await checkValueForKey(targetKey, pin);
    } else {
      await verifyOtp();
    }

    setTimeout(() => {
      setShowLoading(false);
      setOloader(false);
      // otpPage("/otp"); // Navigate to OTP page
    }, 2000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setOloader(true);
    setShowLoading(true);
    const targetKey = mobile;
    const pin = userOtp;
    if (verificationId === null || verificationId === undefined) {
      checkValueForKey(targetKey, pin);
    } else {
      verifyOtp();
    }

    // Call the function to check for OTP
    // checkValueForKey(mobile, otp);

    // Simulate OTP API call
    setTimeout(() => {
      setShowLoading(false);
      setOloader(false);
      // otpPage("/otp"); // Navigate to OTP page
    }, 2000);
  };

  const navigate = useNavigate();

  const checkValueForKey = async (targetKey, pin) => {
    const fixedOtpRef = ref(database, "FIXED_OTP");
    onValue(fixedOtpRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.entries(data).forEach(async ([key, value]) => {
          if (key === targetKey && value === pin) {
            console.log("Key and pin match found!!!!!!!!!");
            // alert("Login Success");

            try {
              if (mode === "register") {
                console.log("valid otpppppppppppppppppppppppppppppppp");
                // Use the passed `ref` and `ref2` to store data in Firestore
                await setDoc(ref1, regMap); // Register user in USERS collection
                await setDoc(ref2, cosMap); // Register user in CUSTOMERS collection
                toast.success("User registered successfully");
              } else {
                toast.success("Login Success");
              }
              userAuthorized();

              // Navigate to the next step (e.g., user dashboard or success page)
              // navigator("/home");
            } catch (error) {
              console.error("Error saving user data to Firestore:", error);
              toast.error("Failed to register user. Please try again.");
            }

            // navigate("/");
            // User authorization logic here
            // You might set a token or perform some navigation

            // Example:
            // localStorage.setItem('appwrite_token', '');
            // localStorage.setItem('phone_number', key);
            // Navigate to another page
            // otpPage("/some-page"); // Replace with actual navigation
          } else if (key === targetKey && value !== pin) {
            // alert("Invalid otp");
            toast.error("Invalid otp");
          }
        });
      } else {
        console.log("No fixed OTPs found.");
      }
    });
  };

  const verifyOtp = async () => {
    try {
      const params = {
        otp: userOtp,
        data: verificationId,
      };

      const response = await axios.post(
        "https://bochemartrun-wyynhb4exq-uc.a.run.app/verifyotp",
        params,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("decrypt success");
        console.log(response.data);

        if (response.data === "success") {
          
          if (mode === "register") {
            console.log(mode, "enter mode resgister,,,,,,,,,,,,,,,,,,,");

            try {
              console.log("valid otpppppppppppppppppppppppppppppppp");
              // Use the passed `ref` and `ref2` to store data in Firestore
              await setDoc(ref1, regMap); // Register user in USERS collection
              await setDoc(ref2, cosMap); // Register user in CUSTOMERS collection
              toast.success("User registered successfully");

              // Navigate to the next step (e.g., user dashboard or success page)
            } catch (error) {
              console.error("Error saving user data to Firestore:", error);
              toast.error("Failed to register user. Please try again.");
            }
          }

          userAuthorized();

          //   alert("Login Success");
          toast.success("Login Success");
          setSnackbarOpen(true);
        } else {
          //   alert("OTP verification failed");
          toast.error("OTP verification failed");
          setSnackbarOpen(true);
        }
      } else {
        console.log("Request failed with status:", response.status);
        // alert("Request failed");
        toast.error("Request failed");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
      //   alert("An error occurred");
      toast.error("An error occurred");
      setSnackbarOpen(true);
    }
  };

  const [loginUser, setLoginUser] = useState({
    id: "",
    name: "",
    type: "",
    phone: "",
    place: "",
    photo: "",
  });

  // const [productModelList, setProductModelList] = useState([]);

  let productModelList = [];

  const fetchMainProduct = async () => {
    try {
      const userCollectionRef = collection(firestore, "PRODUCTS");
      const snapshot = await getDocs(userCollectionRef);
      // const snapshot = await db.collection("PRODUCTS").get();
      const products = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const addedDate = data.ADDED_DATE.toDate(); // Assuming ADDED_DATE is a Firebase Timestamp
        const product = new ProductModel(
          doc.id,
          data.NAME || "",
          data.PRICE || 0,
          data.CATEGORY_ID || "",
          data.CATEGORY_NAME || "",
          data.DESCRIPTION || "",
          data.IMAGES || [],
          data.OFFER_STATUS || "",
          data.OFFER_PRICE || 0,
          data.ADDED_BY || "",
          addedDate
        );
        productModelList.push(product);
      });
      console.log("sdgfdhjah");
      console.log(products);
      console.log("Product Model List:", productModelList);

      // Update productModelList state

      if (productModelList.length > 0) {
        console.log("First product ID:", productModelList[0].id);
        console.log("First product name:", productModelList[0].name);
      } else {
        console.log("No products found");
      }

      // Trigger a re-render
      // notifyListeners();
    } catch (error) {
      console.error("Error fetching main product data:", error);
      // Handle error
    }
  };

  const userAuthorized = async () => {
    try {
      productModelList = [];
      const userCollectionRef = collection(firestore, "USERS");

      console.log("fetching users for local storage.................");
      
      const q = query(
        userCollectionRef,
        where("PHONE", "==", mobile),
        where("STATUS", "==", "ACTIVE")
      );
      const querySnapshot = await getDocs(q);
      console.log("irsdhasf");
      // const querySnapshot = await collection("CUSTOMERS")
      //   .where("PHONE", "==", mobile)
      //   .where("STATUS", "==", "ACTIVE")
      //   .get();

      if (!querySnapshot.empty) {

        console.log("fetching snapshot is empty...........................");
        const userData = querySnapshot.docs[0].data();
        const loginUser = {
          id: querySnapshot.docs[0].id,
          name: userData["NAME"] || "",
          phone: userData["PHONE"] || "",
          place: userData["STATE"] || "",
          type: userData["TYPE"] || "",
          photo: userData["PROFILE_IMAGE"] || "",
        };

        setLoginUser(loginUser);

        // Store data in local storage
        localStorage.setItem("appwrite_token", mobile);
        localStorage.setItem("loginUserId", loginUser.id);
        localStorage.setItem("loginUserName", loginUser.name);
        localStorage.setItem("loginUserPhone", loginUser.phone);
        localStorage.setItem("loginUserType", loginUser.type);
        localStorage.setItem("loginUserPhoto", loginUser.photo);
        localStorage.setItem("loginUserPlace", loginUser.place);

        console.log(loginUser);
        console.log("loginUser.............................");
        // Fetch user details and other data
        await fetchMainProduct();
        // await fetchOrders(loginUser.id);
        // await fetchCoupons(loginUser.id);
        // await fetchWallet(loginUser.id);

        // Check if product list has more than one product
        console.log(productModelList);
        console.log(productModelList[0].id);
        console.log(productModelList[0].name);
        console.log(productModelList[0].images);

        console.log("productModelList...................");
        // setProductData({
        //   productId: productModelList[0].id,
        //   productName: productModelList[0].name,
        //   productImages: productModelList[0].images,
        //   productPrice: productModelList[0].price,
        //   loginUserName: loginUser.name,
        //   loginUserId: loginUser.id,
        //   loginUserType: loginUser.type,
        //   loginUserPhone: loginUser.phone,
        //   loginUserPlace: loginUser.place,
        //   loginUserPhoto: loginUser.photo
        // });
        // console.log("irshadsssss")

          // console.log("irshadsssss")
          localStorage.setItem("productId", productModelList[0].id);
          localStorage.setItem("productName", productModelList[0].name);
          localStorage.setItem("productImages", productModelList[0].images);
          localStorage.setItem("productPrice", productModelList[0].price);

          navigator("/home", {
            state: {
              productId: productModelList[0].id,
              productName: productModelList[0].name,
              productImages: productModelList[0].images,
              productPrice: productModelList[0].price,
              loginUserName: loginUser.name,
              loginUserId: loginUser.id,
              loginUserType: loginUser.type,
              loginUserPhone: loginUser.phone,
            },
            replace: true,
          });
     
      } else {
        // Redirect to login screen if user not found
      }
    } catch (error) {
      // Handle error
      console.error("Sorry, some error occurred:", error);
      // You might want to show a snackbar or toast here
    }
  };

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setTimerEnded(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);
  
  const handleOtpRequest = async () => {
    setUserOtp("");
    const phone = mobile;
    await sentOtp(phone);
    setTimer(30); // Reset timer when OTP is requested again
    setTimerEnded(false);
  };

  return (
    <>
    <div className="otp">
      <div className="img-box">
        <h6>OTP Verification</h6>
        <p>
          We’ve picked out something special just for you! Check out the app
          now to see what’s waiting.
        </p>
      </div>
      <div className="otp-box">
        <p>
          Enter the <span>OTP Code</span> sent to
        </p>
        <p>+91 {mobile}</p>
        <form action="">
            <OtpInput
              type="tel" // Restricts input to numbers
              value={userOtp}
              onChange={setUserOtp}
              numInputs={6}
              renderInput={(props, index) => (
                <input
                  {...props}
                  className="number"
                  inputMode="numeric" // Ensure numeric keypad on mobile
                  onKeyDown={(e) => {
                    const isNumeric = /^\d$/.test(e.key);
                    const isBackspace = e.key === "Backspace";

                    // Allow backspace and numeric input
                    if (!isNumeric && !isBackspace) {
                      e.preventDefault();
                    }

                    if (isBackspace && !props.value) {
                      // Focus the previous input if empty
                      const previousInput = document.querySelectorAll(".number")[index - 1];
                      if (previousInput) {
                        previousInput.focus();
                      }
                    }
                  }}
                />
              )}
              minLength={6}
              maxLength={6}
              required
            />
        </form>
        <button className="otp-b" onClick={handleLogin}>
          {oloader ? <ClipLoader color="#36d7b7" size={16} /> : "Verify"}
        </button>
        {timerEnded ? (
          <button className="resend" onClick={handleOtpRequest}>
            Resend OTP
          </button>
        ) : (
          <p>
            Didn't receive a code?{" "}
            <span> 0:{timer < 10 ? `0${timer}` : timer}</span>
          </p>
        )}
      </div>
    </div>
    <Footer />
  </>
  
  );
};

export default Otp;

// login code -------------------------------------------------------

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
//     </>
//   );
// };

import React, { useEffect, useState } from "react";
import "./UserDetails.css";
import { firestore } from "../../firebase";
import { setDoc, collection, doc, getDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import { ClipLoader } from "react-spinners";
import { toast, Toaster } from "sonner";

export const UserDetails = ({ frmId, toId }) => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [userMobile, setUserMobile] = useState("");
  const [userLandMark, setUserLandMark] = useState("");
  const [userLocality, setUserLocality] = useState("");
  const [userCity, setUserCity] = useState("");
  const [userPinCode, setUserPinCode] = useState("");
  const [userState, setUserState] = useState("");
  const [userDistrict, setUserDistrict] = useState("");
  const [userHouseName, setUserHouseName] = useState("");
  const [userLoader, setUserLoader] = useState(false);

  // console.log(userDistrict, "userDistrict....................")
  // console.log(userState, "userState....................")

  const [errors, setErrors] = useState({});

  const cusId = localStorage.getItem("loginUserId");

  console.log(cusId, "cus id ......................");

  const location = useLocation();

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const dataRef = doc(firestore, "CUSTOMERS", cusId);

  //     try {
  //       const dataSnapshot = await getDoc(dataRef);

  //       if (dataSnapshot.exists()) {
  //         const data = dataSnapshot.data();

  //         setUserName(data.NAME || ""); // Adjust to match the data structure
  //         setUserMobile(data.PHONE || ""); // Adjust to match the data structure
  //       } else {
  //         console.error("No such document!");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching document:", error);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  useEffect(() => {
    console.log(location.state?.frmId);
    console.log(location.state?.toId);
    frmId = location.state?.frmId;
    toId = location.state?.toId;

    const address = location.state?.address || {};

    if (address) {
      setUserName(address.userName || "");
      setUserMobile(address.userMobile || "");
      setUserLandMark(address.userLandMark || "");
      setUserLocality(address.userLocality || "");
      setUserCity(address.userCity || "");
      setUserPinCode(address.userPinCode || "");
      setUserState(address.userState || "");
      setUserDistrict(address.userDistrict || "");
      setUserHouseName(address.userHouseName || "");
    }
  }, [location.state]);

  // const validate = () => {
  //   const newErrors = {} ;

  //   if (!userName.trim()) {
  //     newErrors.userName = "Name is required";
  //   } else if (/[,]/.test(userName)) {
  //     newErrors.userName = "Name cannot contain commas";
  //   }

  //   if (!userMobile.trim() || !/^\d{10}$/.test(userMobile)) {
  //     newErrors.userMobile = "Valid mobile number is required";
  //   } else if (/[,]/.test(userMobile)) {
  //     newErrors.userMobile = "Mobile number cannot contain commas";
  //   }

  //   if (!userState.trim()) {
  //     newErrors.userState = "State is required";
  //   } else if (/[,]/.test(userState)) {
  //     newErrors.userState = "State cannot contain commas";
  //   }

  //   if (!userDistrict.trim()) {
  //     newErrors.userDistrict = "District is required";
  //   } else if (/[,]/.test(userDistrict)) {
  //     newErrors.userDistrict = "District cannot contain commas";
  //   }

  //   if (!userHouseName.trim()) {
  //     newErrors.userHouseName = "House name is required";
  //   } else if (/[,]/.test(userHouseName)) {
  //     newErrors.userHouseName = "House name cannot contain commas";
  //   }

  //   if (!userLandMark.trim()) {
  //     newErrors.userLandMark = "Landmark is required";
  //   } else if (/[,]/.test(userLandMark)) {
  //     newErrors.userLandMark = "Landmark cannot contain commas";
  //   }

  //   if (!userLocality.trim()) {
  //     newErrors.userLocality = "Locality is required";
  //   } else if (/[,]/.test(userLocality)) {
  //     newErrors.userLocality = "Locality cannot contain commas";
  //   }

  //   if (!userCity.trim()) {
  //     newErrors.userCity = "City is required";
  //   } else if (/[,]/.test(userCity)) {
  //     newErrors.userCity = "City cannot contain commas";
  //   }

  //   if (!userPinCode.trim() || !/^\d{6}$/.test(userPinCode)) {
  //     newErrors.userPinCode = "Valid PIN Code is required";
  //   } else if (/[,]/.test(userPinCode)) {
  //     newErrors.userPinCode = "PIN Code cannot contain commas";
  //   }

  //   // if (!cusId || !frmId || !toId ) {
  //     if (!cusId || !frmId || (!toId && frmId === "EDIT")) {
  //     console.error("Missing required IDs for Firestore operations.");
  //     return;
  //   }

  //   console.log("frmId:", frmId);

  //   console.log("toId:", toId);

  //   setErrors(newErrors);

  //   return Object.keys(newErrors).length === 0;
  // };

  const validate = () => {
    const newErrors = {};

    if (!userName.trim()) {
      newErrors.userName = "Name is required";
    } else if (/[,]/.test(userName)) {
      newErrors.userName = "Name cannot contain commas";
    }

    if (!userMobile.trim() || !/^\d{10}$/.test(userMobile)) {
      newErrors.userMobile = "Valid mobile number is required";
    } else if (/[,]/.test(userMobile)) {
      newErrors.userMobile = "Mobile number cannot contain commas";
    }

    if (!userState.trim()) {
      newErrors.userState = "State is required";
    }

    if (!userDistrict.trim()) {
      newErrors.userDistrict = "District is required";
    }

    if (!userHouseName.trim()) {
      newErrors.userHouseName = "House name is required";
    }

    if (!userPinCode.trim() || !/^\d{6}$/.test(userPinCode)) {
      newErrors.userPinCode = "Valid PIN Code is required";
    }
    // Validate City
    if (!userCity.trim()) {
      newErrors.userCity = "City is required";
    }

    // Validate Locality
    if (!userLocality.trim()) {
      newErrors.userLocality = "Locality is required";
    }

    // Validate Landmark
    if (!userLandMark.trim()) {
      newErrors.userLandMark = "Landmark is required";
    }

    setErrors(newErrors);

    // Debugging log
    console.log("Validation errors:", newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePrevious = ()=> {

    navigate(-1);
  }

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
          //   setError("Failed to fetch data");
          console.log("Failed to fetch data");
          return null;
        }
      } catch (e) {
        console.error("Exception", e);
        // setError(e.message);
        console.log("message");
        return null;
      }
    };

    return { getPinCodeApi };
  };

  const { getPinCodeApi } = usePinCodeApi();

  const handlePinCodeChange = async (e) => {
    const pin = e.target.value;

    setUserPinCode(pin);

    if (pin.length === 6) {
      const data = await getPinCodeApi(pin);
      if (data) {
        setUserState(data.state || "");
        setUserDistrict(data.district || "");
      }
    }
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    console.log("cusId: ", cusId);
    console.log("frmId: ", frmId);
    console.log("toId: ", toId);

    if (!cusId) {
      toast.error("Customer ID is missing. Please log in.");
      return;
    }

    // Check if fromId is "EDIT" and toId is missing
    if (frmId === "EDIT" && !toId) {
      toast.error("To ID is required for editing.");
      return;
    }

    if (!validate()) return;
    setUserLoader(true);

    console.log("this is the porblem ........");

    console.log(frmId, "form id");

    // if (pinError) {
    //   return Toaster.error("Invalid pin code")
    // }

    const id =
      location.state?.frmId === "EDIT"
        ? location.state?.toId
        : Date.now().toString();

    const addressMap = {
      USER_NAME: userName,
      USER_MOBILE: userMobile,
      USER_LAND_MARK: userLandMark,
      USER_LOCALITY: userLocality,
      USER_CITY: userCity,
      USER_PIN_CODE: userPinCode,
      USER_STATE: userState,
      USER_DISTRICT: userDistrict,
      USER_HOUSE_NAME: userHouseName,
    };

    const cosMap = {
      LAST_USED_USER_NAME: userName,
      LAST_USED_USER_NUMBER: userMobile,
      LAST_USED_USER_ADDRESS: `${userLandMark},${userLocality},${userCity},${userState},${userPinCode}`,
      LAST_USED_USER_ADDRESS_TO: `${userLandMark},${userLocality},${userCity},${userState},${userDistrict},${userHouseName},${userPinCode}`,
    };

    const ref = doc(
      collection(firestore, "CUSTOMERS", cusId, "DELIVER_ADDRESS"),
      id
    );
    const ref2 = doc(firestore, "CUSTOMERS", cusId, "DELIVER_ADDRESS", id);

    try {
      console.log(frmId,"iddidiidii");
      
      if (frmId === "new") {
        await setDoc(ref, addressMap, { merge: true });
      } else {
        await setDoc(ref2, addressMap, { merge: true });
      }

      await setDoc(doc(firestore, "CUSTOMERS", cusId), cosMap, { merge: true });
      setUserLoader(false);
      //   alert("User details added successfully!");
      toast.success(" Delivery Address added successfully!");
      if (window.innerWidth < 480) {
        navigate("/address");
      } else {
        navigate("/paymentweb");
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      setUserLoader(false);
      //   alert("An error occurred while adding user details. Please try again.");
      toast.error(
        "An error occurred while adding user details. Please try again."
      );
    }
  };

  return (
    <div className="userdetails">
      <div className="back_arrow_container_change_address">

        <FaChevronLeft onClick={handlePrevious} />

      </div>
      <div className="user-box">
        <h5> Delivery Address</h5>
        <form>
          <div className="formbox">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            {errors.userName && (
              <span className="error">{errors.userName}</span>
            )}
          </div>
          <div className="formbox">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="text"
              id="mobile"
              maxLength="10"
              name="mobile"
              value={userMobile}
              onChange={(e) => setUserMobile(e.target.value)}
            />
            {errors.userMobile && (
              <span className="error">{errors.userMobile}</span>
            )}
          </div>
          <div className="formbox">
            <label htmlFor="pincode">PIN Code</label>
            <input
              type="text" // Use text to bypass scientific notation issues
              id="pincode"
              inputMode="numeric" // Ensure numeric keyboard on mobile
              maxLength="6"
              name="pincode"
              value={userPinCode}
              onChange={handlePinCodeChange}
              onKeyDown={(e) => {
                // Allow only digits, Backspace, and Delete keys
                if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
                  e.preventDefault();
                }
              }}
            />
            {errors.userPinCode && (
              <span className="error">{errors.userPinCode}</span>
            )}
          </div>


          <div className="formbox">
            <label htmlFor="state"> State </label>
            <input
              type="text"
              id="state"
              name="state"
              value={userState}
              onChange={(e) => setUserState(e.target.value)}
              readOnly
            />
            {errors.userState && (
              <span className="error"> {errors.userState} </span>
            )}
          </div>

          <div className="formbox">
            <label htmlFor="district"> District </label>
            <input
              type="text"
              id="district"
              name="district"
              value={userDistrict}
              onChange={(e) => setUserDistrict(e.target.value)}
              readOnly
            />
            {errors.userDistrict && (
              <span className="error">{errors.userDistrict}</span>
            )}
          </div>

          <div className="formbox">
            <label htmlFor="house number"> House name</label>
            <input
              type="text"
              id="houseName"
              name="houseName"
              value={userHouseName}
              onChange={(e) => setUserHouseName(e.target.value)}
            />
            {errors.userHouseName && (
              <span className="error">{errors.userHouseName}</span>
            )}
          </div>

          <div className="formbox">
            <label htmlFor="city"> City </label>
            <input
              type="text"
              id="city"
              name="city"
              value={userCity}
              onChange={(e) => setUserCity(e.target.value)}
            />
            {errors.userCity && (
              <span className="error">{errors.userCity}</span>
            )}
          </div>

          <div className="formbox">
            <label htmlFor="locality">Locality</label>
            <input
              type="text"
              id="locality"
              name="locality"
              value={userLocality}
              onChange={(e) => setUserLocality(e.target.value)}
            />
            {errors.userLocality && (
              <span className="error">{errors.userLocality}</span>
            )}
          </div>

          <div className="formbox">
            <label htmlFor="landmark">Landmark</label>
            <input
              type="text"
              id="landmark"
              name="landmark"
              value={userLandMark}
              onChange={(e) => setUserLandMark(e.target.value)}
            />
            {errors.userLandMark && (
              <span className="error">{errors.userLandMark}</span>
            )}
          </div>

          {userLoader ? (
            <div
              className="loader-userr"
              style={{ width: "100%", textAlign: "center" }}
            >
              <ClipLoader color="#36d7b7" size={50} />
            </div>
          ) : (
            <button type="submit" className="btn" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserDetails;

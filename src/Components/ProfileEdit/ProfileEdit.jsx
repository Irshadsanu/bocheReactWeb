import React, { useState, useEffect } from "react";
import "./ProfileEdit.css";
import { FaUserAlt } from "react-icons/fa";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useCount } from "../../Context/Context";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

const ProfileEdit = ({ setShowEditPopup }) => {
  const userId = localStorage.getItem("loginUserId");
  const navigator = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const { profileLoader, setProfileLoader } = useCount();

  const [errors, setErrors] = useState({});
  const [pin, setPin] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const userDoc = await getDoc(doc(firestore, "USERS", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.NAME || "");
          setPhone(userData.PHONE || "");
          setPin(userData.PINCODE || "");
          if (userData.PROFILE_IMAGE) {
            setImageURL(userData.PROFILE_IMAGE);
          }
        }
      }
    };

    fetchUserData();
  }, [userId]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImageURL(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    try {
      if (image) {
        const fileRef = ref(storage, `${userId}/${image.name}`);
        await uploadBytes(fileRef, image);
        return await getDownloadURL(fileRef);
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required.";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Phone number must be a valid 10-digit number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const usePinCodeApi = () => {

  //   console.log("hellooooooo")
  //   const getPinCodeApi = async (pincode) => {
  //     const url = `https://api.postalpincode.in/pincode/${pincode}`;
  //     try {
  //       const response = await fetch(url);
  //       if (response.status === 200) {
  //         const jsonData = await response.json();
  //         const postOffices = jsonData[0].PostOffice;
  //         if (postOffices && postOffices.length > 0) {
  //           const state = postOffices[0].State;
  //           const district = postOffices[0].District;
  //           console.log("pin fetched successfully");
  //           return { state, district };
  //         }
  //       } else {
  //         //   setError("Failed to fetch data");
  //         console.log("Failed to fetch data");
  //         return null;
  //       }
  //     } catch (e) {
  //       console.error("Exception", e);
  //       // setError(e.message);
  //       console.log("message");
  //       return null;
  //     }
  //   };

  //   return { getPinCodeApi };
  // };

  const usePinCodeApi = () => {
    console.log("hellooooooo");

    const getPinCodeApi = async (pincode) => {
      const url = `https://api.postalpincode.in/pincode/${pincode}`;
      try {
        const response = await fetch(url);
        if (response.status === 200) {
          const jsonData = await response.json();
          const postOffices = jsonData[0].PostOffice;

          // If post offices are found, return state and district
          if (postOffices && postOffices.length > 0) {
            const state = postOffices[0].State;
            const district = postOffices[0].District;
            console.log("Pin fetched successfully");
            return { state, district };
          }
        } else {
          console.log("Failed to fetch data");
          //   alert("Failed to fetch data. Please try again later.");
          toast.success("Failed to fetch data. Please try again later.");
          return null;
        }
      } catch (e) {
        console.error("Exception", e);
        // alert("An error occurred while fetching data.");
        toast.error("An error occurred while fetching data.");
        return null;
      }
    };

    return { getPinCodeApi };
  };

  const { getPinCodeApi } = usePinCodeApi(pin);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setProfileLoader(true);

    try {
      const imageUrl = await handleImageUpload();

      if (!userId) {
        throw new Error("User ID is missing.");
      }

      const stateFromApi = await getPinCodeApi(pin);

      if (!stateFromApi) {
        setProfileLoader(false); // Stop loader if invalid pin code

        return toast.error("Enter valid pincode");
      }

      console.log(pin, "pin on inside");

      let updateState = "";
      let updateDistrict = "";

      if (stateFromApi) {
        const { state, district } = stateFromApi;
        updateState = state;
        updateDistrict = district;
        console.log(state, "hloooooooooooooooooo");
      }

      console.log(updateDistrict, "distrrrrrrr");
      console.log(updateState, "strtetetettete");

      const userRef = doc(firestore, "USERS", userId);
      const customerRef = doc(firestore, "CUSTOMERS", userId);

      const userUpdate = {
        NAME: name,
        STATE: updateState,
        DISTRICT: updateDistrict,
        PINCODE: pin,
      };

      const customerUpdate = {
        NAME: name,
        STATE: updateState,
        DISTRICT: updateDistrict,
        PINCODE: pin,
      };

      if (imageUrl) {
        userUpdate.PROFILE_IMAGE = imageUrl;
      }

      await setDoc(userRef, userUpdate, { merge: true });
      await setDoc(customerRef, customerUpdate, { merge: true });

      localStorage.setItem("loginUserName", name);
      localStorage.setItem("loginUserPlace", updateState);

      if (phone) {
        localStorage.setItem("loginUserPhone", phone);
      }

      if (imageUrl) {
        localStorage.setItem("loginUserPhoto", imageUrl);
      }
      setProfileLoader(false);
      //   alert("Profile updated successfully!");
      toast.success("Profile updated successfully!");
      setShowEditPopup(false);
    } catch (error) {
      console.error("Error updating profile: ", error);
      setProfileLoader(false);
      //   alert("An error occurred while updating profile. Please try again.");
      toast.success(
        "An error occurred while updating profile. Please try again."
      );
    }
  };

  return (
    <div className="profile-edit">
      <form onSubmit={handleSubmit}>
        {imageURL ? (
          <img src={imageURL} alt="Selected" className="image-preview" />
        ) : (
          <FaUserAlt className="user-icon" />
        )}
        <input
          className="user_select_img"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <input
            type="tel"
            placeholder="Number"
            value={phone}
            // onChange={(e) => setPhone(e.target.value)}
            className={errors.phone ? "input-error" : ""}
            readOnly
            style={{ color: "#FB641B" }}
          />
          {errors.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
        </div>
        <div className="form-group">
          <input
            type="tel"
            placeholder="Pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className={errors.phone ? "input-error" : ""}
          />
          {errors.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
        </div>

        {profileLoader ? (
          <ClipLoader color="#36d7b7" />
        ) : (
          <button type="submit">Submit</button>
        )}
      </form>
    </div>
  );
};

export default ProfileEdit;

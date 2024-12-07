// code old 1

import React, { useState, useEffect } from "react";
import "./ChangeAddress.css";
import { Assets } from "../Assets/Assets";
import fetchAddress from "./fetchAddress";
import AddressModel from "../../ModelClasses/AddressModel";
import { firestore } from "../../firebase";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { FaChevronLeft } from "react-icons/fa6";
import SelectAddress from "../SelectAddress/SelectAddress";



const ChangeAddress = () => {
  
  const navigator = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const cusId = localStorage.getItem("loginUserId");

  const stateObject = { toshow: "true" };

  
  const handlePrevious = ()=> {

    navigator(-1);
  }

  const handleEdit =  ( address )=>{
    console.log(address,"aasdfsdfasdfasdf")
    navigator("/userDetails" , { state: { address ,frmId:"EDIT",toId:address.id},}, )
  }

  useEffect(() => {
    const fetchData = async () => {
      const fetchedAddresses = await fetchAddress(cusId);
      setAddresses(fetchedAddresses);
      console.log(fetchedAddresses, "fetch adresss for select adrsssssss...........")
      if (fetchedAddresses.length > 0) {
        setSelectedAddress(fetchedAddresses[0].id);
        console.log(selectedAddress, "this is select addresss ..........")
      }
    };

    fetchData();
  }, [cusId]);

  // const handleRadioChange = (event) => {
  //   setSelectedAddress(event.target.value);
  // };

  const handleRadioChange = (addressId) => {
    console.log("Selected Address ID:", addressId); // Debugging line
    setSelectedAddress(addressId);
  };

  const cosId = localStorage.getItem("loginUserId");

  console.log( selectedAddress, "seelctaddrsss before passss")

  const changeAddressSelection = async () => {
    try {
      const docRef = doc(
        firestore,
        "CUSTOMERS",
        cusId,
        "DELIVER_ADDRESS",
        selectedAddress
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        const cosMap = {
          LAST_USED_USER_NAME: data.USER_NAME.toString(),
          LAST_USED_USER_NUMBER: data.USER_MOBILE.toString(),
          LAST_USED_USER_ADDRESS: `${data.USER_LAND_MARK.toString()},${data.USER_LOCALITY.toString()},${data.USER_CITY.toString()},${data.USER_STATE.toString()},${data.USER_PIN_CODE.toString()}`,
        };

        await setDoc(doc(firestore, "CUSTOMERS", cusId), cosMap, {
          merge: true,
        });
      }

      if (window.innerWidth < 480) {

        navigator("/address", { state: { selectedAddress } });
      } else {
        navigator("/paymentweb" , { state: { selectedAddress } });
      }


      // await fetchAddress(cusId); // Ensure fetchAddress is defined
      // navigate("/select-address", { state: { selectedAddress } }); // Pass selected address via state
    } catch (error) {
      console.error("Error updating address: ", error);
    }
  };
  return (
    <div className="change-addres">
      <div className="back_arrow_container_change_address">
        <FaChevronLeft onClick={handlePrevious} />
      </div>
      <div className="select-address-heading">Select your address here</div>
      <div className="address-lists">
        {addresses.map((address) => (
          <div 
            onClick={() => handleRadioChange(address.id)} 
            className="address-itemm"
          >
            <form 
              onClick={(e) => e.stopPropagation()} 
              action=""
            >
              <input
                type="radio"
                value={address.id}
                checked={selectedAddress === address.id}
                onChange={() => handleRadioChange(address.id)} // Allow direct interaction
              />
            </form>
            <div className="address-boxx">
              <div className="edit-top">
                <div className="location">
                  <img src={Assets.Location} alt="" />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(address);
                  }} 
                  className="edit"
                >
                  Edit
                </button>
              </div>
              <p>{address.userName}</p>
              <p>
                {address.userMobile}, {address.userLandMark},{" "}
                {address.userLocality}, {address.userCity}, {address.userState}, {address.userPinCode}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={changeAddressSelection} className="change-bbtn">
        Change Address
      </button>
    </div>
  );
  
};

export default ChangeAddress;



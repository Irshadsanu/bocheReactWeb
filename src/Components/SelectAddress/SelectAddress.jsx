import React, { useState, useEffect, useContext } from "react";
import "./SelectAddress.css";
import { Assets } from "../Assets/Assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { useCount } from "../../Context/Context";

const SelectAddress = ({ setSelectedAddress, setVariableSelect }) => {
  const [lastUsedDeliveryName, setLastUsedDeliveryName] = useState("");
  const [lastUsedDeliveryAddress, setLastUsedDeliveryAddress] = useState("");
  const [lastUsedDeliveryId, setLastUsedDeliveryId] = useState();
  const [selectedVariable, setSelectedVariable] = useState("");
  const {
    setselecteAddressCtx,
    setLastUsedDeliveryNameCtx,
    setLastUsedDeliveryAddressCtx,
    setReady,
    setPincode,
    setLastUsedDeliveryNumberCtx,
    addressFetch,
    setAddressFetch,
    deliveryAddress,
    setDeliveryAddress,
  } = useCount();
  const [ShowAddressBox, setShowAddressBox] = useState(false);
  const navigate = useNavigate();
  const cusId = localStorage.getItem("loginUserId");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  const location = useLocation();

  const locaitnCheck = location.state?.selectedAddress;

  //  const [ addressShowing , setAddressShowing ] = useState([]);

  //  setAddressShowing(location.state?.selectedAddress);

  console.log(locaitnCheck, "locaitnCheck from changeAddress");

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchLastUsedDeliveryInfo(cusId);
      setLastUsedDeliveryName(data.lastUsedDeliveryName);
      setLastUsedDeliveryAddress(data.lastUsedDeliveryAddress);
      setLastUsedDeliveryNameCtx(data.lastUsedDeliveryName);
      setLastUsedDeliveryAddressCtx(data.lastUsedDeliveryAddress);
      setPincode(extractPincode(data.lastUsedDeliveryAddress));
      setLastUsedDeliveryNumberCtx(data.lastUsedDeliveryNumber);
    };
    loadData();
  }, [
    cusId,
    setLastUsedDeliveryNameCtx,
    setLastUsedDeliveryAddressCtx,
    setPincode,
  ]);

  useEffect(() => {
    if (location.state?.selectedAddress) {
      setSelectedVariable("Delivery to Your Address");

      if (selectedVariable === "Delivery to Your Address") {
        setSelectedVariable("");
        setselecteAddressCtx("");
        if (!isMobile) {
          setSelectedAddress("");
        }
        setReady(false);
        setShowAddressBox(true);
      } else {
        setSelectedVariable("Delivery to Your Address");
        setselecteAddressCtx("Delivery to Your Address");
        if (!isMobile) {
          setSelectedAddress("Delivery to Your Address");
          setVariableSelect("Delivery to Your Address");
        }
        setReady(true);
      }

      // if(!isMobile) {
      //   setVariableSelect("Delivery to Your Address");
      //   setReady(true);
      // }

      setShowAddressBox(true);
    }
  }, [location.state, setReady]);

  const fetchLastUsedDeliveryInfo = async (cusId) => {
    const customerRef = doc(firestore, "CUSTOMERS", cusId);
    const customerSnapshot = await getDoc(customerRef);
    if (customerSnapshot.exists()) {
      const data = customerSnapshot.data();
      console.log(data, "mapped data");
      setDeliveryAddress(data.LAST_USED_USER_ADDRESS);
      setLastUsedDeliveryId(data.LAST_USED_DELIVER_ID);

      return {
        lastUsedDeliveryName: data.LAST_USED_USER_NAME || "",
        lastUsedDeliveryAddress: data.LAST_USED_USER_ADDRESS || "",
        lastUsedDeliveryNumber: data.LAST_USED_USER_NUMBER || 0,
      };
    } else {
      return {
        lastUsedDeliveryName: "",
        lastUsedDeliveryAddress: "",
        lastUsedDeliveryNumber: 0,
      };
    }
  };

  const extractPincode = (address) => {
    const splited = address.split(",");
    console.log(splited, "pin sllietttttt");
    return splited[4] || "";
  };

  const handleStorePickUpClick = () => {
    if (selectedVariable === "Pick Up From Store") {
      setSelectedVariable("");
      setselecteAddressCtx("");
      if (!isMobile) {
        setSelectedAddress("");
      }
    } else {
      setSelectedVariable("Pick Up From Store");
      setselecteAddressCtx("Pick Up From Store");
      setSelectedAddress("Pick Up From Store");
      setVariableSelect("Pick Up From Store");
      if (!isMobile) {
        setSelectedAddress("Pick Up From Store");
        setVariableSelect("Pick Up From Store");
      }
    }
  };

  const handleDeliveryAddressClick = () => {
    if (selectedVariable === "Delivery to Your Address") {
      setSelectedVariable("");
      setselecteAddressCtx("");
      if (!isMobile) {
        setSelectedAddress("");
      }
      setReady(false);
      setShowAddressBox(true);
    } else {
      setSelectedVariable("Delivery to Your Address");
      setselecteAddressCtx("Delivery to Your Address");
      setSelectedAddress("Delivery to Your Address");
      setVariableSelect("Delivery to Your Address");
      if (!isMobile) {
        setSelectedAddress("Delivery to Your Address");
        setVariableSelect("Delivery to Your Address");
      }
      setReady(true);
    }
  };

  console.log(selectedVariable, "selectvariable,,,,,,,,,,,,,,,,,,,,");

  const handClick = () => {
    navigate("/home", { state: { from: "home" } });
  };

  return (
    <div className="select-address">
      <div className="view_all_btn">
        <button onClick={handClick}>View all</button>
      </div>
      <div className="address-options">
        <div className="item" onClick={handleStorePickUpClick}>
          <div className="left-box">
            <div className="location">
              <img src={Assets.Store} alt="Locat" />
            </div>
            <div className="del-det">
              <h6>Pick up from store</h6>
              <p>
                You can collect the purchased products from the listed stores in
                our website.
              </p>
            </div>
          </div>
          <input
            type="radio"
            className="SelectRadio"
            checked={selectedVariable === "Pick Up From Store"}
            readOnly
          />
        </div>
        <div className="item-del" onClick={handleDeliveryAddressClick}>
          <div className="left-box-del">
            <div className="left-deliver-box">
              <div className="location">
                <img src={Assets.Store} alt="Locat" />
              </div>
              <div className="del-det">
                <h6>Delivery to your address</h6>
                <p>
                  The product you order will be shipped directly to the address
                  you specify during checkout.
                </p>
              </div>
            </div>
            <input
              type="radio"
              className="SelectRadio"
              checked={selectedVariable === "Delivery to Your Address"}
              readOnly
            />
          </div>

          {selectedVariable === "Delivery to Your Address" && (
            <div className="main-del-box">
              <h5 className="heading">Delivery to :</h5>
              <div className="address-item">
                <div className="top-btn-add">
                  {deliveryAddress && (
                    <Link to="/change" className="link">
                      <button className="change">Change</button>
                    </Link>
                  )}
                  <Link to="/delivery" state={{ frmId: "new", toId: "" }}>
                    <button className="add-new-address-btn">
                      + New Address
                    </button>
                  </Link>
                </div>
                {deliveryAddress && (
                  <div className="address-box">
                    {/* <div className="edit-top">
                    <div className="location">
                      <img src={Assets.Location} alt="" />
                    </div>
                  </div> */}
                    <p>{lastUsedDeliveryName}</p>
                    <p>{lastUsedDeliveryAddress}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectAddress;

import React, { useState, useEffect } from "react";
import { TopNav } from "../../Components/TopNav/TopNav";
import { Button } from "../../Components/Button/Button";
import SelectAddress from "../../Components/SelectAddress/SelectAddress";
import { Link, useNavigate } from "react-router-dom";
import TopnavWeb from "../../Components/TopNav/TopnavWeb";
import Footer from "../Footer/Footer";
import { useCount } from "../../Context/Context";
import { firestore } from "../../firebase";
import { setDoc, collection, doc, where, getDoc } from "firebase/firestore";
import { fetchDeliveryChargeAndAvailability } from "../../Components/SelectAddress/DeliverCharge";
import "./Address.css";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

export const Address = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const cusId = localStorage.getItem("loginUserId");
  const [pincode, setPincode] = useState("");
  const { selecteaddress, count, ready, setReady, totalPrice } = useCount();
  const [courierId, setCourierId] = useState(0);
  const [courierName, setCourierName] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [deliveryRate, setDeliveryRate] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchLastUsedDeliveryInfo = async (cusId) => {
    try {
      const customerRef = doc(firestore, "CUSTOMERS", cusId);
      const customerSnapshot = await getDoc(customerRef);

      if (customerSnapshot.exists()) {
        const data = customerSnapshot.data();
        setPincode(extractPincode(data.LAST_USED_USER_ADDRESS));
        console.log(data, "this is data from address");
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching last used delivery info:", error);
    }
  };

  const extractPincode = (address) => {
    try {
      const splited = address.split(",");
      return splited[4]?.trim() || "";
    } catch (error) {
      console.error("Error extracting pincode:", error);
      return "";
    }
  };

  useEffect(() => {
    if (cusId) {
      fetchLastUsedDeliveryInfo(cusId);
    }
  }, [cusId]);

  const fetchDetails = async () => {
    try {
      const proQty = count;
      let pincodeString = pincode.trim();

      // console.log(count, "coountttttttt.................")
      // console.log(pincodeString, "coountttttttt.................")

      //   const data = await fetchDeliveryChargeAndAvailability(
      //     pincodeString,
      //     proQty
      //   );
      //   console.log(data, "api data");
      const data = {
        rate: 60,
        estimated_delivery_days: "5",
        courier_name: "loadtest",
        courier_company_id: 2,
      };

      if (data && data.rate) {
        // const intRate = Math.ceil(data.rate);
        // setDeliveryRate(intRate);
        setDeliveryRate(data.rate);
        setEstimatedDays(data.estimated_delivery_days);
        setCourierName(data.courier_name);
        setCourierId(data.courier_company_id);

        // console.log("pyyyyyyyyyy",data.courier_company_id,data.courier_name,data.estimated_delivery_days,data.rate);
        navigate("/payment", {
          state: {
            amount: totalPrice,
            courierId: data.courier_company_id,
            courierName: data.courier_name,
            estimatedDays: data.estimated_delivery_days,
            deliveryRate: data.rate,
          },
        });
      } else {
        console.error("Data does not contain rate:", data);
        // alert("Error fetching delivery rate. Please try again.");
        toast.error("Error fetching delivery rate. Please try again.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (ready) => {
    if (
      (ready && selecteaddress === "Delivery to Your Address") ||
      selecteaddress === "Pick Up From Store"
    ) {
      console.log(ready);
      // console.log(selecteaddress, "selecteaddress from if caseeeeeee")
      fetchDetails();
      setLoading(true);
    } else {
      if (ready === false) {
        //  setReady(false);
        return alert("select your delivery mode");
      } else {
        setReady(false);
      }
      navigate("/payment", { state: { deliveryRate: deliveryRate } });
      setLoading(false);
    }
  };

  return (
    <div>
      {isMobile ? <TopNav title="Address" /> : <TopnavWeb />}
      <SelectAddress />
      <div className="btn">
        <button onClick={() => handleSubmit(ready)}>
          {loading ? <ClipLoader color="#fff" size={16} /> : "Submit"}
        </button>
      </div>
      <Footer />
    </div>
  );
};

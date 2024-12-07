import React, { useEffect, useState } from "react";
import "./PaymentWeb.css";
import SelectAddress from "../SelectAddress/SelectAddress";
import SelectPayment from "../SelectPayment/SelectPayment";
import DeliverySummery from "../DeliverySummery/DeliverySummery";
import TopnavWeb from "../TopNav/TopnavWeb";
import { CSSTransition } from "react-transition-group";
import { fetchDeliveryChargeAndAvailability } from "../SelectAddress/DeliverCharge";
import { useCount } from "../../Context/Context";
import { ClipLoader } from "react-spinners";
import Footer from "../../Pages/Footer/Footer";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
// import { useParams } from 'react-router-dom';

const PaymentWeb = () => {
  const [step, setStep] = useState("address");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [variableSelect, setVariableSelect] = useState("");
  const {
    count,
    ready,
    setReady,
    pincode,
    showCount,
    setShowCount,
    deliveryAddress,
  } = useCount();

  const [deliveryRate, setDeliveryRate] = useState();
  const [courierId, setCourierId] = useState(0);
  const [courierName, setCourierName] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [loading, setLoading] = useState(false);


  const location = useLocation();

  const { totalWeight, totalQuatity, from, cartState, price, itemImg, productWeight,allocatedTicket,singleproductTotalWeight ,productName,productPrice,productImage, igst , cgst , sgst ,grandTotal} = location.state || {}; // Fallback to empty object if state is undefined

  console.log(totalWeight, totalQuatity, from, cartState, price, itemImg, productWeight,allocatedTicket,singleproductTotalWeight ,productName,productPrice,productImage, igst , cgst , sgst ,grandTotal,"this is from counttttttt")
  
  // console.log(price,productPrice,productWeight,"price in paymentweb from buyniw")
  // console.log( totalWeight, totalQuatity,from, cartState, "locaation.......................................")
  // console.log(pincode, "pincode ......");

  console.log(count, "prd qty ..................");

  useEffect(() => {
    setShowCount(true);
  }, []);

  useEffect(() => {
    if (step === "payment") {
      setShowCount(false);
    } else if (step === "address") {
      setShowCount(true);
    }
  }, [step, setShowCount]);

  // console.log(showCount, "show count change. ...........")

  let intRate;

  const handleContinueToPayment = async (ready) => {

    setTimeout(() => {
      console.log("Selected Address:", selectedAddress);  // Should show the selected address
       // Should show the delivery mode
      if (!selectedAddress && !variableSelect) {
        // toast.warning("Please select an address and delivery mode")
        toast.warning("Kindly select a purchase option to proceed.");
        setLoading(false);
        return;
      }
      // Proceed with your payment navigation here
    }, 100);
  

    try {
      setLoading(true);

      // if (!variableSelect) {
      //   // alert("Select your delivery mode");
      //   toast.warning("Select your delivery mode");
      //   setLoading(false);
      //   return;
      // }


      if (ready && variableSelect === "Delivery to Your Address") {
        
        if (deliveryAddress) {
          const proQty = count;
          let pincodeString = pincode.toString().trim();

          if (from == "cart") {
              const data = await fetchDeliveryChargeAndAvailability(
              pincodeString,
              totalWeight,
            );

            if (data && data.rate) {

              console.log('courieeee nameee', data.courierName)

              // setDeliveryRate(Math.ceil(data.rate));
              // setEstimatedDays(data.estimated_delivery_days);
              // setCourierName(data.courier_name);
              // setCourierId(data.courier_company_id);
              setDeliveryRate(data.rate);
              setEstimatedDays(data.estimated_delivery_days);
              setCourierName(data.courier_name);
              setCourierId(data.courier_company_id);
            } else {
              console.error("Data does not contain rate:", data);
              // alert("Error fetching delivery rate. Please try again.");
              toast.error("Error fetching delivery rate. Please try again.");
              setLoading(false);
              return;
            }
          } else {

            const data = await fetchDeliveryChargeAndAvailability(
              pincodeString,
              singleproductTotalWeight
            );
            if (data && data.rate) {
              // setDeliveryRate(Math.ceil(data.rate));
              // setEstimatedDays(data.estimated_delivery_days);
              // setCourierName(data.courier_name);
              // setCourierId(data.courier_company_id);
              setDeliveryRate(data.rate);
              setEstimatedDays(data.estimated_delivery_days);
              setCourierName(data.courier_name);
              setCourierId(data.courier_company_id);

              console.log(data, "delivery dataa api ..................")
            } else {
              console.error("Data does not contain rate:", data);
              // alert("Error fetching delivery rate. Please try again.");
              toast.error("Error fetching delivery rate. Please try again.");
              setLoading(false);
              return;
            }     
          }


          setStep("payment");
          setLoading(false);

        } else {
          //   alert("Select your address");
          toast.warning("Select your address");
          setLoading(false);
        }

      } else if (variableSelect === "Pick Up From Store") {
        setStep("payment");
        setReady(false);
        setLoading(false);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error in handleContinueToPayment:", error);
      //   alert("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");

    }
  };

  return (
    <>
      <TopnavWeb />
      
      <div className="payment-web">
        <div className="web-payment-box">
          <CSSTransition
            in={step === "address"}
            timeout={500}
            classNames="fade"
            unmountOnExit
          >
            <SelectAddress
              setSelectedAddress={setSelectedAddress}
              setVariableSelect={setVariableSelect}
            />
          </CSSTransition>

          <CSSTransition
            in={step === "payment"}
            timeout={500}
            classNames="fade"
            unmountOnExit
          >
            <SelectPayment
              deliveryRate={deliveryRate}
              estimatedDays={estimatedDays}
              courierName={courierName}
              courierId={courierId}
              setDeliveryRate={setDeliveryRate}
              setStep={setStep}
              setCourierId={setCourierId}
              setCourierName={setCourierName}
              setEstimatedDays={setEstimatedDays}
              grandtotalFromCart={grandTotal}
              productList={cartState}
              productWeight={productWeight}
              allocatedTicket={allocatedTicket}
              productName={productName}
            />
          </CSSTransition>
        </div>

        <div className="delivery-summery-main">
          
          <DeliverySummery from={from} deliveryRate={deliveryRate} productName={productName}
          productWeight={productWeight} itemImg={itemImg} price={price} grandtotalFromCart={grandTotal} pdtImg={productImage} pdtPrice={productPrice}
          />
          {step === "address" && (
            <div className="switch-bt">
              <button
                className="btn-del"
                onClick={() => handleContinueToPayment(ready)}
              >
                {loading ? <ClipLoader color="#fff" size={16} /> : "Continue"}
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentWeb;

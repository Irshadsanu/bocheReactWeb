// import { firestore } from "../../firebase";
// import { doc, setDoc } from "firebase/firestore";

import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../firebase";

const addMultiOrders = async ({
    id,
    cusId,
    cusName,
    proTotalQty,
    orderPrice,
    loginUserPhone,
    apiResults,
    buildNumber,
    itemList,
    itemTotalWeight,
    amount,
    selectedAddressOption,
    lastUsedDeliveryName,
    lastUsedDeliveryNumber,
    lastUsedDeliveryAddress,
  }) => {
    try {
      // Generate a random code for "Pick Up From Store" option



      const min = 100000;
      const max = 999999;
      const rNum = Math.floor(Math.random() * (max - min + 1)) + min;
  
      const orderDate = new Date(); // Current date
  
  
      // Create the order map
      const orderMapF = {
        APP_VERSION: buildNumber,
        PLATFORM: "WEB", // Replace with the appropriate platform if needed
        CUSTOMER_ID: cusId,
        CUSTOMER_NAME: cusName,
        CUSTOMER_PHONE: loginUserPhone,
        ITEMS: itemList,
        ITEM_TOTAL_AMOUNT: orderPrice,
        ITEM_TOTAL_QUANTITY: proTotalQty,
        ORDER_DATE: orderDate,
        ORDER_ID: id,
        ORDER_TIME: orderDate.getTime().toString(),
        STATUS: "CONFIRMED",
        PAYMENT_TYPE: "WALLET",
        CHANNEL_ID: "8",
        ITEM_TOTAL_WEIGHT: itemTotalWeight,
        ORDER_AMOUNT: amount,
        TYPE: selectedAddressOption,
      };
  
      // Add delivery or random code based on address option
      if (selectedAddressOption !== "Pick Up From Store") {
        orderMapF.DELIVERY_NAME = lastUsedDeliveryName;
        orderMapF.DELIVERY_NUMBER = lastUsedDeliveryNumber;
        orderMapF.DELIVERY_ADDRESS = lastUsedDeliveryAddress;
      } else {
        orderMapF.RANDOM_CODE = rNum;
      }
  
      // Handle delivery details from API results
      if (Object.keys(apiResults).length > 0) {
        orderMapF.DELIVERY_CHARGE = apiResults.deliveryRate || 0.0;
        orderMapF.ESTIMATE_DAYS = apiResults.estimatedDays || "NIL";
        orderMapF.COURIER_NAME = apiResults.courierName || "NIL";
        orderMapF.COURIER_ID = apiResults.courierId || 0;
      } else {
        orderMapF.DELIVERY_CHARGE = 0.0;
        orderMapF.ESTIMATE_DAYS = "NIL";
        orderMapF.COURIER_NAME = "NIL";
        orderMapF.COURIER_ID = 0;
      }
  
      // Save the order details to the Firestore database
      await setDoc(doc(firestore, "ORDERS", id), orderMapF, { merge: true });
  
      // Add a random code to the customer document if necessary
      if (selectedAddressOption === "Pick Up From Store") {
        await setDoc(
          doc(firestore, "CUSTOMERS", cusId),
          { RANDOM_CODE: rNum },
          { merge: true }
        );
      }
  
      console.log("Order successfully added!");
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };
  
  export default addMultiOrders;

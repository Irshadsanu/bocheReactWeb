import { firestore } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

const AddOrders = async ({
  id,
  cusId,
  cusName,
  proId,
  proImg,
  proQty,
  proPrice,
  orderPrice,
  loginUserPhone,
  apiResults,
  buildNumber,
  selectedAddressOption,
  lastUsedDeliveryName,
  lastUsedDeliveryNumber,
  lastUsedDeliveryAddress,
  productWeight,
  amount

}) => {

  let itemList = [];
  const min = 100000;
  const max = 999999;
  const rNum = Math.floor(Math.random() * (max - min + 1)) + min;

  const itemMap = {
    ITEM_QUANTITY: proQty,
    PRODUCT_ID: proId,
    PRODUCT_IMAGE: proImg,
    PRODUCT_PRICE: proPrice,
    PRODUCT_WEIGHT: productWeight
  };

  itemList.push(itemMap);

  const orderDate = new Date();

  const orderMapF = {
    APP_VERSION: "WEB",
    CUSTOMER_ID: cusId,
    CUSTOMER_NAME: cusName,
    CUSTOMER_PHONE: loginUserPhone,
    ITEMS: itemList,
    // ITEM_TOTAL_AMOUNT: orderPrice,
    ITEM_TOTAL_AMOUNT: proQty * proPrice,
    ITEM_TOTAL_QUANTITY: proQty,
    ORDER_DATE: orderDate,
    ORDER_ID: id,
    ORDER_TIME: orderDate.getTime().toString(),
    ORDER_AMOUNT : amount,
    STATUS: "CONFIRMED",
    TYPE: selectedAddressOption,
    PLATFORM: "WEB",
  };
  
  if (selectedAddressOption === "Pick Up From Store") {
    orderMapF.RANDOM_CODE = rNum;
  }

  if (selectedAddressOption !== "Pick Up From Store") {
    orderMapF.DELIVERY_NAME = lastUsedDeliveryName;
    orderMapF.DELIVERY_NUMBER = lastUsedDeliveryNumber;
    orderMapF.DELIVERY_ADDRESS = lastUsedDeliveryAddress;
  }

  orderMapF.DELIVERY_CHARGE = apiResults.deliveryRate || 0;
  orderMapF.ESTIMATE_DAYS = apiResults.estimatedDays || "0";
  orderMapF.COURIER_ID = apiResults.courierId || 0;
  orderMapF.COURIER_NAME = apiResults.courierName || "";

  await setDoc(doc(firestore, "ORDERS", id), orderMapF, { merge: true });

  if (selectedAddressOption === "Pick Up From Store") {
    await setDoc(
      doc(firestore, "CUSTOMERS", cusId),
      { RANDOM_CODE: rNum },
      { merge: true }
    );
  }
};

export default AddOrders;

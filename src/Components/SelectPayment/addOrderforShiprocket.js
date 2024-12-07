import axios from "axios";

const addOrderforShiprocket = async (
  orderID,
  loginUserName,
  lastUsedDeliveryAddress,
  loginUserPhone,
  totalOrder,
  productId,
  count
) => {

  
  const url = "https://bochemartrun-wyynhb4exq-uc.a.run.app/placeShipOrder";
  const headers = {
    "api-key": "spine123AsdfASFVFD",
    "Content-Type": "application/json",
  };
  const data = {
    orderId: orderID,
    cusName: loginUserName,
    cusAddress: lastUsedDeliveryAddress,
    cusPhone: loginUserPhone,
    orderPrice: totalOrder,
    proId: productId,
    proQty: count,
  };

  console.log(data, "Data being sent to API");




  console.log(orderID, " 1 orderID phon from api");
  console.log(loginUserName, "2  loginUserName phon from api");
  console.log(lastUsedDeliveryAddress, " 3 lastUsedDeliveryAddress phon from api");
  console.log(loginUserPhone, "4  login phon from api");
  console.log(totalOrder , "5  totalOrder phon from api");
  console.log(productId, "6  productId phon from api");
  console.log(count, "7  count phon from api");

//   try {
//     const response = await axios.post(url, data, { headers: headers });

//     if (response.status === 200) {
//       console.log(JSON.stringify(response.data));


//     } else {
//       console.log(response.statusText);
//     }
//   } catch (error) {
//     console.error("Error: ", error);
//   }
// };


try {
  const response = await axios.post(url, data, { headers: headers });

  if (response.status === 200) {
    console.log("Response Data:", JSON.stringify(response.data));
  } else {
    console.log("Response Status:", response.status);
    console.log("Response Status Text:", response.statusText);
  }
} catch (error) {
  if (error.response) {
    // The request was made and the server responded with a status code that falls out of the range of 2xx
    console.error("Server responded with an error:", error.response.data);
    console.error("Status Code:", error.response.status);
    console.error("Headers:", error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    console.error("No response received:", error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error setting up request:", error.message);
  }
  console.error("Config:", error.config);
}
}


export default addOrderforShiprocket;

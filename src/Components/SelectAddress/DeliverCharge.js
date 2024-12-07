import axios from "axios";

export const fetchDeliveryChargeAndAvailability = async (pincode, totalWeight) => {
  const endpoint =
    "https://bochemartrun-wyynhb4exq-uc.a.run.app/serviceAvailability";

  const queryParameters = { 
    pickup_postcode: "676528",
    delivery_postcode: pincode,
    cod: "0",
    weight:totalWeight,
  };

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: endpoint,
    headers: { 
      'api-key': 'spine123AsdfASFVFD'
    },
    params: queryParameters
  };

  
  try {
    const response = await axios.request(config);

    if (response.status === 200) {
      console.log("Delivery charge and availability:");
      console.log(JSON.stringify(response.data));
      return response.data;
    } else {
      console.log(`Request failed with status: ${response.status}`);
      console.log(response.statusText);
    }
  } catch (e) {
    console.log(`Exception during HTTP request: ${e}`);
  }
};

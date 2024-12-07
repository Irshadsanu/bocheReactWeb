import axios from "axios";

async function purchaseApi(prodId, mobNo, fName, qty, cusId, docId) {
  const url =
    "https://bochemartrun-wyynhb4exq-uc.a.run.app/purchaseApiForWallet";

  const data = {
    prodId,
    mobNo,
    fName,
    qty,
    cusId,
    docId,
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        "api-key": "spine123AsdfASFVFD",
      },
    });

    if (response.status === 200) {
      console.log("Response:", response.data);
    } else {
      console.error("Error:", response.status, response.data);
    }
  } catch (error) {
    console.error("Request Error:", error);
  }
}

export default purchaseApi;
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCount } from "../../Context/Context";

const useApiCallICICI = () => {
  const [isICICICheck, setIsICICICheck] = useState(false);
  const navigator = useNavigate();
  const { setLoading } = useCount();

  const apiCallICICI = async (
    paymentId,
    amount,
    name,
    phone,
    loginUserId,
    loginUserPlace,
    loginUserPhoto,
    proId,
    proQty,
    proPrice,
    orderPrice,
    proImg,
    loginUserPincode
  ) => {
    setIsICICICheck(true);

    const params = {
      TxnRefNo: paymentId,
      Amount: (parseInt(amount) * 100).toString(),
      CurrencyCode: "INR",
      OrderInfo: paymentId,
      Email: "test@gmail.com",
      Phone: phone,
    };

    try {
      const response = await axios.post(
        "https://bochemartrun-wyynhb4exq-uc.a.run.app/orderICICweb",
        params,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const url = response.data;

        navigator("/iciciwebview", {
          state: {
            apiurl: url,
            paymentId,
            from: "PURCHASE",
            loginUserId,
            loginUserName: name,
            loginUserPhone: phone,
            loginUserPlace,
            loginUserPhoto,
            proId,
            proQty,
            proPrice,
            orderPrice,
            proImg,
            loginUserPincode,
          },
        });

        setIsICICICheck(false);
        setLoading(false);
      } else {
        setIsICICICheck(false);
        setLoading(false);
        console.error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setIsICICICheck(false);
      setLoading(false);
      console.error("API call failed: ", error);
    }
  };
  const apiCallICICIDeposit = async (
    paymentId,
    amount,
    name,
    phone,
    loginUserId,
    loginUserPlace,
    loginUserPhoto,
    proId,
    proQty,
    proPrice,
    orderPrice,
    proImg,
    loginUserPincode
  ) => {
    setIsICICICheck(true);

    const params = {
      TxnRefNo: paymentId,
      Amount: (parseInt(amount) * 100).toString(),
      CurrencyCode: "INR",
      OrderInfo: paymentId,
      Email: "test@gmail.com",
      Phone: phone,
    };

    try {
      const response = await axios.post(
        "https://bochemartrun-wyynhb4exq-uc.a.run.app/orderICICdepositweb",
        params,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const url = response.data;

        navigator("/iciciwebview", {
          state: {
            apiurl: url,
            paymentId,
            from: "PURCHASE",
            loginUserId,
            loginUserName: name,
            loginUserPhone: phone,
            loginUserPlace,
            loginUserPhoto,
            proId,
            proQty,
            proPrice,
            orderPrice,
            proImg,
            loginUserPincode,
          },
        });

        setIsICICICheck(false);
        setLoading(false);
      } else {
        setIsICICICheck(false);
        setLoading(false);
        console.error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setIsICICICheck(false);
      setLoading(false);
      console.error("API call failed: ", error);
    }
  };

  return { apiCallICICI, isICICICheck, apiCallICICIDeposit };
};

export default useApiCallICICI;

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCount } from "../../Context/Context";

const useApiCallCcavenue = () => {
  const [isCCAvCheck, setIsCCAvCheck] = useState(false);
  const navigator = useNavigate();
  const { totalPrice, count, loading, setLoading } = useCount();

  const apiCallCcavenue = async (
    paymentId,
    amount,
    name,
    phone,
    loginUserId
  ) => {
    setIsCCAvCheck(true);

    console.log(`${amount} amountttttttt`);
    console.log(`${paymentId} paymenttiddd`);
    console.log(`${phone} phoneeetiddd`);
    console.log(`${name} nameeeee`);

    const params = {
      port: "0",
      //   from: "PURCHASE",
      orderid: paymentId,
      data: `&amount=${amount}.00&language=EN&currency=INR&merchant_param1=${paymentId}&merchant_param2=${phone}&merchant_param3=${name}&merchant_param4=${amount}&merchant_param5=${paymentId}`,
    };

    console.log("reeeeeee2222");

    try {
      const response = await axios.post(
        "https://bochemartrun-wyynhb4exq-uc.a.run.app/initOrderweb",
        params,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("reeeeeee444");

      if (response.status === 200) {
        console.log("server success");
        console.log(`${response.data} rrrrrrrrrrrr`);

        // Navigate to the next screen

        navigator("/ccaavenue", {
          state: {
            apiurl: response.data,
            paymentId,
            from: "",
            loginUserId,
            loginUserName: name,
            loginUserPhone: phone,
          },
        });

        setIsCCAvCheck(false);
        setLoading(false);
      } else {
        setIsCCAvCheck(false);
        setLoading(false);
        console.error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setIsCCAvCheck(false);
      setLoading(false);
      console.error("API call failed: ", error);
    }
  };

  const apiCallCcavenueDeposit = async (
    paymentId,
    amount,
    name,
    phone,
    loginUserId
  ) => {
    setIsCCAvCheck(true);

    console.log(`${amount} amountttttttt`);
    console.log(`${paymentId} paymenttiddd`);
    console.log(`${phone} phoneeetiddd`);
    console.log(`${name} nameeeee`);

    const params = {
      port: "0",
      //   from: "DEPOSIT",
      orderid: paymentId,
      data: `&amount=${amount}.00&language=EN&currency=INR&merchant_param1=${paymentId}&merchant_param2=${phone}&merchant_param3=${name}&merchant_param4=${amount}&merchant_param5=${paymentId}`,
    };

    console.log("reeeeeee2222");

    try {
      const response = await axios.post(
        "https://bochemartrun-wyynhb4exq-uc.a.run.app/initOrderdepositweb",
        params,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("reeeeeee444");

      if (response.status === 200) {
        console.log("server success");
        console.log(`${response.data} rrrrrrrrrrrr`);

        // Navigate to the next screen

        navigator("/ccaavenue", {
          state: {
            apiurl: response.data,
            paymentId,
            from: "",
            loginUserId,
            loginUserName: name,
            loginUserPhone: phone,
          },
        });

        setIsCCAvCheck(false);
        setLoading(false);
      } else {
        setIsCCAvCheck(false);
        setLoading(false);
        console.error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setIsCCAvCheck(false);
      setLoading(false);
      console.error("API call failed: ", error);
    }
  };

  return { apiCallCcavenue, isCCAvCheck, apiCallCcavenueDeposit };
};

export default useApiCallCcavenue;

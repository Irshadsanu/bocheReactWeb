import axios from "axios";
import React, { useState, useContext } from "react";
import { TimeContext } from "./timerProvider";



const sentOtp = async (
  phone,
  setSpineVerificationId,
  setShowOtpWidForAdmin,
  incrementCount,
  navigate,
  context
) => {
  try {
    const response = await axios.post(
      "https://bochemartrun-wyynhb4exq-uc.a.run.app/callotp",
      { phone },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("otp success");
      console.log(response.data.encOtp);

      setSpineVerificationId(response.data.encOtp);
      setShowOtpWidForAdmin(true);
      incrementCount();

      // Assuming you have a way to access and manipulate timeProvider context
      const { resetCountdown, startCountdown } = context(TimeContext);
      resetCountdown();
      startCountdown();
      navigate("/otp", { state: { mobile: phone } });

      alert("OTP sent to phone successfully");
    } else {
      console.log("Request failed with status:", response.status);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export default sentOtp;

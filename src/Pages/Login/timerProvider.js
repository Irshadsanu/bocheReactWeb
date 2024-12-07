import React, { createContext, useState, useCallback } from "react";

export const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
  const [countdown, setCountdown] = useState(0);

  const resetCountdown = useCallback(() => {
    setCountdown(60); // Example: reset to 60 seconds
  }, []);

  const startCountdown = useCallback(() => {
    // Logic to start countdown
  }, []);

  return (
    <TimeContext.Provider value={{ countdown, resetCountdown, startCountdown }}>
      {children}
    </TimeContext.Provider>
  );
};

import React, { createContext, useState,useContext } from 'react';

// Create the context
export const SelectContext = createContext();

// Create the provider component
export const SelectProvider = ({ children }) => {
  const [lastUsedDeliveryName, setLastUsedDeliveryNameCtx] = useState("");
  const [selecteVariable, setSelecteVariable] = useState("");
  const [lastUsedDeliveryNumber, setLastUsedDeliveryNumberCtx] = useState("");
  const [lastUsedDeliveryAddress, setLastUsedDeliveryAddressCtx] = useState("");
  const [selecteaddress, setselecteAddressCtx] = useState("");

  return (
    <SelectContext.Provider value={{ 
        selecteVariable, setSelecteVariable ,
        lastUsedDeliveryName,setLastUsedDeliveryNameCtx,
        lastUsedDeliveryNumber,setLastUsedDeliveryNumberCtx,
        lastUsedDeliveryAddress,setLastUsedDeliveryAddressCtx,
        selecteaddress, setselecteAddressCtx   
        }}>
      {children}
    </SelectContext.Provider>
  );
};

// export const useSelect = () => useContext(SelectContext);
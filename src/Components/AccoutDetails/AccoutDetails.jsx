// import React, { useState } from "react";
// import "./AccoutDetails.css";
// import { collection, doc, setDoc } from "firebase/firestore";
// import { firestore } from "../../firebase";

// const AccountDetails = ({onSaveSuccess}) => {
//   const [holderName, setHolderName] = useState("");
//   const [accountNumber, setAccountNumber] = useState("");
//   const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
//   const [bankName, setBankName] = useState("");
//   const [ifceCode, setIfceCode] = useState("");
//   const cusId = localStorage.getItem("loginUserId");

//   const [error, setError] = useState({});

//   const validate = () => {
//     const newErrors = {};

//     if (!bankName.trim()) newErrors.bankName = "Bank name is required";
//     if (!holderName.trim())
//       newErrors.holderName = "Account holder name is required";
//     if (!accountNumber.trim())
//       newErrors.accountNumber = "Account number is required";
//     if (accountNumber !== confirmAccountNumber)
//       newErrors.confirmAccountNumber = "Account numbers do not match";
//     if (!ifceCode.trim()) newErrors.ifceCode = "IFSC code is required";

//     setError(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleUpdateData = async (event) => {
//     event.preventDefault();

//     if (!validate()) return;

//     const accountDetails = {
//       ACCOUNT_HOLDER_NAME: holderName,
//       ACCOUNT_NUMBER: accountNumber,
//       BANK_NAME: bankName,
//       IFSCE: ifceCode,
//     };

//     try {
//       const ref = doc(firestore, "CUSTOMERS", cusId);
//       await setDoc(ref, accountDetails, { merge: true });

//       alert("User details added successfully!");
//       onSaveSuccess();
//     } catch (error) {
//       console.error("Error adding document: ", error);
//       alert("An error occurred while adding user details. Please try again.");
//     }
//   };

//   return (
//     <div className="account-details">
//       <h5>Add New Account Details</h5>
//       <form >
//         <input
//           type="text"
//           id="bankName"
//           name="bankName"
//           value={bankName}
//           onChange={(e) => setBankName(e.target.value)}
//           placeholder="Bank Name"
//           required
//         />
//         {error.bankName && <p className="error">{error.bankName}</p>}
//         <input
//           type="text"
//           id="holderName"
//           name="holderName"
//           value={holderName}
//           onChange={(e) => setHolderName(e.target.value)}
//           placeholder="Account Holder Name"
//           required
//         />
//         {error.holderName && <p className="error">{error.holderName}</p>}
//         <input
//           type="number"
//           id="accountNumber"
//           name="accountNumber"
//           value={accountNumber}
//           onChange={(e) => setAccountNumber(e.target.value)}
//           placeholder="Account Number"
//           required
//         />
//         {error.accountNumber && <p className="error">{error.accountNumber}</p>}
//         <input
//           type="number"
//           id="confirmAccountNumber"
//           name="confirmAccountNumber"
//           value={confirmAccountNumber}
//           onChange={(e) => setConfirmAccountNumber(e.target.value)}
//           placeholder="Confirm Account Number"
//           required
//         />
//         {error.confirmAccountNumber && (
//           <p className="error">{error.confirmAccountNumber}</p>
//         )}
//         <input
//           type="text"
//           id="ifcCode"
//           name="ifcCode"
//           value={ifceCode}
//           onChange={(e) => setIfceCode(e.target.value)}
//           placeholder="IFSC Code"
//           required
//         />
//         {error.ifceCode && <p className="error">{error.ifceCode}</p>}
//         <button type="submit" className="save-bank" onClick={handleUpdateData}>
//           Save
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AccountDetails;

import React, { useEffect, useState } from "react";
import "./AccoutDetails.css";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { toast } from "sonner";

const AccountDetails = ({ onSaveSuccess, existingDetails }) => {
  const [holderName, setHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [ifceCode, setIfceCode] = useState("");
  const cusId = localStorage.getItem("loginUserId");
  const [pan, setPan] = useState("");

  const [error, setError] = useState({});

  //   const validate = () => {
  //     const newErrors = {};
  //     const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/; // PAN card format regex

  //     if (!bankName.trim()) newErrors.bankName = "Bank name is required";
  //     if (!holderName.trim())
  //       newErrors.holderName = "Account holder name is required";
  //     if (!accountNumber.trim())
  //       newErrors.accountNumber = "Account number is required";
  //     if (accountNumber !== confirmAccountNumber)
  //       newErrors.confirmAccountNumber = "Account numbers do not match";
  //     if (!ifceCode.trim()) newErrors.ifceCode = "IFSC code is required";
  //     if (!pan.trim()) newErrors.pan = "PAN card is required";
  //     else if (!panRegex.test(pan))
  //       newErrors.pan = "PAN card format is invalid (e.g., ABCDE1234F)";

  //     setError(newErrors);
  //     return Object.keys(newErrors).length === 0;
  //   };

  const validate = () => {
    const newErrors = {};
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/; // PAN card format regex

    // Validate bankName
    if (!bankName.trim()) {
      newErrors.bankName = "Bank name is required";
    }

    // Validate account holder name
    if (!holderName.trim()) {
      newErrors.holderName = "Account holder name is required";
    }

    // Validate account number
    if (!accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
    }

    // Validate account number match with confirmAccountNumber
    if (accountNumber !== confirmAccountNumber) {
      newErrors.confirmAccountNumber = "Account numbers do not match";
    }

    // Validate IFSC code
    if (!ifceCode.trim()) {
      newErrors.ifceCode = "IFSC code is required";
    }

    // Validate PAN card
    if (!pan.trim()) {
      newErrors.pan = "PAN card is required";
    } else if (!panRegex.test(pan.trim().toUpperCase())) {
      newErrors.pan = "PAN card format is invalid (e.g., ABCDE1234F)";
    }

    // Update the errors in state
    setError(newErrors);

    // Return whether there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;
    addAccountDetails();

    const accountDetails = {
      ACCOUNT_HOLDER_NAME: holderName,
      ACCOUNT_NUMBER: accountNumber,
      BANK_NAME: bankName,
      IFSC: ifceCode,
      PAN_CARD_NUMBER: pan,
    };

    try {
      const ref = doc(firestore, "CUSTOMERS", cusId);
      await setDoc(ref, accountDetails, { merge: true });

      //   alert("User details added successfully!");
      toast.success("");
      onSaveSuccess("Account details added successfully"); // Notify parent component
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("An error occurred while adding user details. Please try again.");
    }
  };

  useEffect(() => {
    if (existingDetails) {
      setHolderName(existingDetails.holderName);
      setAccountNumber(existingDetails.accountNumber);
      setConfirmAccountNumber(existingDetails.accountNumber); // Match confirm account number for editing
      setBankName(existingDetails.bankName);
      setIfceCode(existingDetails.ifceCode);
    }
  }, [existingDetails]);

  const addAccountDetails = () => {
    const accountDetails = {
      ACCOUNT_HOLDER_NAME: holderName,
      ACCOUNT_NUMBER: accountNumber,
      BANK_NAME: bankName,
      IFSC: ifceCode,
      PAN_CARD_NUMBER: pan,
    };

    setDoc(doc(firestore, "CUSTOMERS", cusId), accountDetails, {
      merge: true,
    })
      .then(() => {
        console.log("Account details added successfully");
      })
      .catch((error) => {
        console.error("Error adding account details: ", error);
      });
  };

  return (
    <div className="account-details">
      <h5>Add New Account Details</h5>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="bankName"
          name="bankName"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          placeholder="Bank Name"
          required
        />
        {error.bankName && <p className="error">{error.bankName}</p>}
        <input
          type="text"
          id="holderName"
          name="holderName"
          value={holderName}
          onChange={(e) => setHolderName(e.target.value)}
          placeholder="Account Holder Name"
          required
        />
        {error.holderName && <p className="error">{error.holderName}</p>}
        <input
          type="number"
          id="accountNumber"
          name="accountNumber"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Account Number"
          required
        />
        {error.accountNumber && <p className="error">{error.accountNumber}</p>}
        <input
          type="number"
          id="confirmAccountNumber"
          name="confirmAccountNumber"
          value={confirmAccountNumber}
          onChange={(e) => setConfirmAccountNumber(e.target.value)}
          placeholder="Confirm Account Number"
          required
        />
        {error.confirmAccountNumber && (
          <p className="error">{error.confirmAccountNumber}</p>
        )}
        <input
          type="text"
          id="ifcCode"
          name="ifcCode"
          value={ifceCode}
          onChange={(e) => setIfceCode(e.target.value)}
          placeholder="IFSC Code"
          required
        />
        {error.ifceCode && <p className="error">{error.ifceCode}</p>}
        <input
          type="text"
          id="pan"
          name="pan"
          value={pan}
          onChange={(e) => setPan(e.target.value)}
          placeholder="PAN (ABCDE1234F)"
          required
        />
        {error.pan && <p className="error">{error.pan}</p>}
        <button type="submit" className="save-bank">
          Save
        </button>
      </form>
    </div>
  );
};

export default AccountDetails;

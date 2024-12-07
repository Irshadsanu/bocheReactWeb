import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import React from 'react'
import { firestore } from '../../firebase';
import purchaseApi from './purchaseApi';
import AddOrders from './AddOrders';
import { addWalletTransactions } from './addWalletTransactions';
import addMultiOrders from './addMultiOrders';

const multiUpdatePaymentForWallet  = async (

    orderID,
    app,
    amount,
    loginUserId,
    loginUserName,
    productList,
    // productId,
    // productName,
    // productImages,
    // productPrice,
    loginUserPhone,
    loginUserPlace,
    loginUserPhoto,
    depositWallet,
    winningWallet,
    paidAmount,
    apiResults,
    dedeuctDepositAmonunt,
    deductWinningAmount,
    navigate,
    selectedAddress,
    lastUsedDeliveryName,
    lastUsedDeliveryNumber,
    lastUsedDeliveryAddress,
    count,
    grandTotal,
    custPhone,
    name,
    loginUserPincode

) => {

  console.log(amount,"amountcomeonnnnn")

    const now = new Date();

   const map = {
    RESPONDS: "SUCCESS",
    TIME: now.getTime().toString(),
    PAYMENT_STATUS: "SUCCESS",
    AMOUNT: parseFloat(amount),
    PAYMENT_APP: app,
    PICODE : loginUserPincode
  };

  await setDoc(doc(firestore, "ATTEMPTS", orderID), map, { merge: true });

    // Wallet Transactions
    await addWalletTransactions(
        orderID,
        // parseFloat(amount),
        grandTotal,
        loginUserId,
        loginUserName,
        now,
        dedeuctDepositAmonunt,
        deductWinningAmount,
        custPhone
      );

    // Deposit Wallet Handling
    if (dedeuctDepositAmonunt > 0) {
        const walletMap = {
            AMOUNT: dedeuctDepositAmonunt,
            TDS_AMOUNT: 0,
            TYPE: "PURCHASE_DEPOSIT",
            DATE: now,
            CUSTOMER_ID: loginUserId,
            CUSTOMER_NAME: name,
            CUSTOMER_PHONE: custPhone,
            ORDER_ID: orderID,
            PINCODE : loginUserPincode
        };

        await setDoc(
            doc(firestore, "WALLET_TRANSACTION", now.getTime().toString()),
            walletMap,
            { merge: true }
          );
        }

    // Winning Wallet Handling
    if (deductWinningAmount > 0) {
        const walletMap = {
            AMOUNT: deductWinningAmount,
            TDS_AMOUNT: 0,
            TYPE: "PURCHASE_WINNING",
            DATE: now,
            CUSTOMER_ID: loginUserId,
            CUSTOMER_NAME: name,
            CUSTOMER_PHONE: custPhone,
            ORDER_ID: orderID,
            PINCODE : loginUserPincode
        };

        await setDoc(
            doc(firestore, "WALLET_TRANSACTION", now.getTime().toString()),
            walletMap,
            { merge: true }
          );
        }

        let itemList = [];
        let itemShipList = [];
        let itemTotalAmount = 0;
        let itemTotalQty = 0;
        let totalTicketQty = 0;
        let itemTotalWeight = 0;

        for (let product of productList) {
            
            const totalQty = product.productQty * product.allocatedTicket;
            totalTicketQty += totalQty;
        
            const orderAmount = product.price * product.productQty;
            const detectedGstPrice = (orderAmount / (1 + product.igst / 100).toFixed(2));


            const itemMap = {
                ITEM_QUANTITY: product.productQty,
                PRODUCT_ID: product.productId,
                PRODUCT_IMAGE: product.productImageList,
                PRODUCT_PRICE: product.price,
                PRODUCT_NAME: product.name,
                WITHOUT_GST_AMOUNT: detectedGstPrice,
                ALLOCATED_TICKETS_COUNT: product.allocatedTicket,
                PRODUCT_WEIGHT: product.grossWeight,
                PRODUCT_SGST: product.sgst,
                PRODUCT_IGST: product.igst,
                PRODUCT_CGST: product.cgst,
              };

              itemList.push(itemMap);
              itemTotalAmount += product.price * product.productQty;
              itemTotalQty += product.productQty;
              itemTotalWeight += (product.grossWeight * product.productQty.toFixed(2));
          
              const itemShipMap = {
                name: product.name,
                sku: product.productId,
                units: product.productQty,
                selling_price: product.price,
                discount: "",
                tax: 5,
                hsn: 902,
              };    

              itemShipList.push(itemShipMap);


            await purchaseApi(
                // "",
                product.productId,
                loginUserPhone,
                loginUserName,
                product.allocatedTicket * product.productQty,
                loginUserId,
                orderID
                // now.getTime().toString(),
                // product.productName,
                // product.productPrice.toString(),
            );
        }

            const newWallet = depositWallet + winningWallet

            console.log(productList,"prodcttlistt")


              const neworderPrice = grandTotal - apiResults.deliveryRate 
              console.log(neworderPrice,"item total amount from multiwallet pickupstore")

              await addMultiOrders({
                id: orderID,
                cusId: loginUserId,
                cusName: loginUserName,
                proTotalQty: itemTotalQty,
                orderPrice: neworderPrice,
                loginUserPhone,
                apiResults,
                buildNumber: "WEB",
                itemList, 
                itemTotalWeight,
                amount, 
                selectedAddressOption: selectedAddress,
                lastUsedDeliveryName,
                lastUsedDeliveryNumber,
                lastUsedDeliveryAddress,
              });


                // Clear the user's cart after successful order placement
                const cartQuery = query(
                    collection(firestore, "CART"),
                    where("CUSTOMER_ID", "==", loginUserId)
                  );
                  
                  const cartDocs = await getDocs(cartQuery);


            // Delete each document
            if (!cartDocs.empty) {
                for (const cartDoc of cartDocs.docs) {
                    const docRef = doc(firestore, "CART", cartDoc.id);
                    await deleteDoc(docRef);
                    console.log(`Deleted document with ID: ${cartDoc.id}`);
                }
            }

            navigate("/succes", {
                state: {
                  cusId: loginUserId,
                  from: "ORDER",
                  orderId: orderID,
                  cusName: loginUserName,
                  cusNumber: loginUserPhone,
                  cusPlace: loginUserPlace,
                  cusPhoto: loginUserPhoto,
                  cusPincode: loginUserPincode,
                  ticketCount: totalTicketQty,
                },
              });
            }

export default multiUpdatePaymentForWallet 

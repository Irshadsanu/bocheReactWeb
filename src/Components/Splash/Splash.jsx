// import React, { useState, useEffect } from "react";
// import "./Splash.css";
// import { Assets } from "../Assets/Assets";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   getDocs,
//   collection,
//   query,
//   where,
//   getFirestore,
// } from "firebase/firestore";
// import { firestore } from "../../firebase";
// import { ProductModel } from "../../ModelClasses/product_model";
// import { useProduct } from "../../Context/ProductContext";
// import axios from "axios";
// import { PropagateLoader } from "react-spinners";
// import Loader from "./Loader";

// const Splash = () => {
//   const navigator = useNavigate();
//   const location = useLocation();
//   // const { mobile } = location.state || {};
//   const { productData, setProductData } = useProduct();
//   const [loginUser, setLoginUser] = useState({
//     id: "",
//     name: "",
//     type: "",
//     phone: "",
//     place: "",
//     photo: "",
//   });

//   let productModelList = [];

//   const fetchMainProduct = async () => {

//     try {
      
//       const userCollectionRef = collection(firestore, "PRODUCTS");
//       const snapshot = await getDocs(userCollectionRef);
//       // const snapshot = await db.collection("PRODUCTS").get();
//       const products = [];

//       snapshot.forEach((doc) => {
//         const data = doc.data();
//         const addedDate = data.ADDED_DATE.toDate(); // Assuming ADDED_DATE is a Firebase Timestamp
//         const product = new ProductModel(
//           doc.id,
//           data.NAME || "",
//           data.PRICE || 0,
//           data.CATEGORY_ID || "",
//           data.CATEGORY_NAME || "",
//           data.DESCRIPTION || "",
//           data.IMAGES || [],
//           data.OFFER_STATUS || "",
//           data.OFFER_PRICE || 0,
//           data.ADDED_BY || "",
//           addedDate
//         );
//         productModelList.push(product);
//       });
//       console.log("sdgfdhjah");
//       console.log(products);
//       console.log("Product Model List:", productModelList);

//       // Update productModelList state

//       if (productModelList.length > 0) {
//         console.log("First product ID:", productModelList[0].id);
//         console.log("First product name:", productModelList[0].name);
//       } else {
//         console.log("No products found");
//       }

//       // Trigger a re-render
//       // notifyListeners();
//     } catch (error) {
//       console.error("Error fetching main product data:", error);

//       // Handle error
//     }
//   };

//   const userAuthorized = async (phone) => {
//     try {
//       productModelList = [];
//       const userCollectionRef = collection(firestore, "USERS");
//       console.log("ddysuaiihgffdhsjakjshdfgdhxsjz");
//       const q = query(
//         userCollectionRef,
//         where("PHONE", "==", phone),
//         where("STATUS", "==", "ACTIVE")
//       );
//       const querySnapshot = await getDocs(q);
//       console.log("irsdhasf");
//       // const querySnapshot = await collection("CUSTOMERS")
//       //   .where("PHONE", "==", mobile)
//       //   .where("STATUS", "==", "ACTIVE")
//       //   .get();

//       if (!querySnapshot.empty) {
//         const userData = querySnapshot.docs[0].data();
//         const loginUser = {
//           id: querySnapshot.docs[0].id,
//           name: userData["NAME"] || "",
//           phone: userData["PHONE"] || "",
//           place: userData["STATE"] || "",
//           type: userData["TYPE"] || "",
//           photo: userData["PROFILE_IMAGE"] || "",
//         };

//         setLoginUser(loginUser);

//         // Store data in local storage
//         localStorage.setItem("appwrite_token", phone);
//         localStorage.setItem("loginUserId", loginUser.id);
//         localStorage.setItem("loginUserName", loginUser.name);
//         localStorage.setItem("loginUserPhone", loginUser.phone);
//         localStorage.setItem("loginUserType", loginUser.type);
//         localStorage.setItem("loginUserPhoto", loginUser.photo);
//         localStorage.setItem("loginUserPlace", loginUser.place);

//         console.log(loginUser);
//         console.log("loginUser.............................");
//         // Fetch user details and other data
//         await fetchMainProduct();
//         // await fetchOrders(loginUser.id);
//         // await fetchCoupons(loginUser.id);
//         // await fetchWallet(loginUser.id);

//         // Check if product list has more than one product
//         console.log(productModelList);
//         console.log(productModelList[0].id);
//         console.log(productModelList[0].name);
//         console.log(productModelList[0].images);

//         console.log("productModelList...................");
//         // setProductData({
//         //   productId: productModelList[0].id,
//         //   productName: productModelList[0].name,
//         //   productImages: productModelList[0].images,
//         //   productPrice: productModelList[0].price,
//         //   loginUserName: loginUser.name,
//         //   loginUserId: loginUser.id,
//         //   loginUserType: loginUser.type,
//         //   loginUserPhone: loginUser.phone,
//         //   loginUserPlace: loginUser.place,
//         //   loginUserPhoto: loginUser.photo
//         // });
//         // console.log("irshadsssss")

//         // if (productModelList.length > 1) {
//         //   // Do something if there are more than one product
//         // } else {
//           // console.log("irshadsssss")
//           localStorage.setItem("productId", productModelList[0].id);
//           localStorage.setItem("productName", productModelList[0].name);
//           localStorage.setItem("productImages", productModelList[0].images);
//           localStorage.setItem("productPrice", productModelList[0].price);

          

//           navigator("/home", {
//             state: {
//               productId: productModelList[0].id,
//               productName: productModelList[0].name,
//               productImages: productModelList[0].images,
//               productPrice: productModelList[0].price,
//               loginUserName: loginUser.name,
//               loginUserId: loginUser.id,
//               loginUserType: loginUser.type,
//               loginUserPhone: loginUser.phone,
//               from: "home",
//             },
//           });
//         // }
//       } else {
//         // Redirect to login screen if user not found
//       }
//     } catch (error) {
//       // Handle error
//       console.error("Sorry, some error occurred:", error);
//       // You might want to show a snackbar or toast here
//     }
//   };

//   useEffect(() => {

//     const timeout = setTimeout(async () => {

//       await fetchMainProduct();
//       let user = "";
//       user = localStorage.getItem("loginUserId");
//       console.log(user + "dfhgdfhvjfdgdsfvsdvsjdhvs");
//       const phone = localStorage.getItem("loginUserPhone");
//       console.log(phone + "dfhgdfhvjfdgdsfvsdvsjdhvs");
//       if (user === "" || user === null) {

//         if (productModelList.length > 1) {
//           // Do something if there are more than one product
//         } else {
//           localStorage.setItem("productId", productModelList[0].id);
//           localStorage.setItem("productName", productModelList[0].name);
//           localStorage.setItem("productImages", productModelList[0].images);
//           localStorage.setItem("productPrice", productModelList[0].price);

//           navigator("/home", {
//             state: {
//               productId: productModelList[0].id,
//               productName: productModelList[0].name,
//               productImages: productModelList[0].images,
//               productPrice: productModelList[0].price,
//               loginUserName: "",
//               loginUserId: "",
//               loginUserType: "",
//               loginUserPhone: "",
//             },
//           });
//         }
//       } else {
//         userAuthorized(phone);
//       }
//       navigator("/home");
//     }, 30);

//     return () => clearTimeout(timeout);
//   }, [navigator]);
//   return (
//     <>
//       <div className="splash">
//         <div className="boche-splash">
//           {/* <img src={Assets.Splash} alt="" /> */}
//           <PropagateLoader color="#FB641B" />
//           {/* <Loader /> */}
//         </div>
//       </div>
//       <div className="nuerospine">
//         {/* <img src={Assets.NuroSpine} alt="" /> */}
//       </div>
//     </>
//   );
// };

// export default Splash;



//pracitseeeeeeeeeeeeeeeeeeeeee


import React, { useState, useEffect } from "react";
import "./Splash.css";
import { Assets } from "../Assets/Assets";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getDocs,
  collection,
  query,
  where,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import { ProductModel } from "../../ModelClasses/product_model";
import { useProduct } from "../../Context/ProductContext";
import axios from "axios";
import { PropagateLoader } from "react-spinners";
import Loader from "./Loader";

const Splash = () => {

  const [multiProductList, setMultiProductList] = useState([]);

  const [ splashMultiProductList,setSplashMultiProductList] = useState([])

  const navigator = useNavigate();
  const location = useLocation();
  // const { mobile } = location.state || {};
  const { productData, setProductData } = useProduct();
  const [loginUser, setLoginUser] = useState({
    id: "",
    name: "",
    type: "",
    phone: "",
    place: "",
    photo: "",
  });

  let productModelList = [];

  const fetchMainProduct = async () => {

    // try {
      
    //   // const userCollectionRef = collection(firestore, "PRODUCTS");
    //   // const snapshot = await getDocs(userCollectionRef);
    //   // // const snapshot = await db.collection("PRODUCTS").get();
    //   // const products = [];

    //   snapshot.forEach((doc) => {
    //     const data = doc.data();
    //     const addedDate = data.ADDED_DATE.toDate(); // Assuming ADDED_DATE is a Firebase Timestamp
    //     const product = new ProductModel(
    //       doc.id,
    //       data.NAME || "",
    //       data.PRICE || 0,
    //       data.CATEGORY_ID || "",
    //       data.CATEGORY_NAME || "",
    //       data.DESCRIPTION || "",
    //       data.IMAGES || [],
    //       data.OFFER_STATUS || "",
    //       data.OFFER_PRICE || 0,
    //       data.ADDED_BY || "",
    //       addedDate
    //     );
    //     productModelList.push(product);
    //   });
    //   console.log("sdgfdhjah");
    //   console.log(products);
    //   console.log("Product Model List:", productModelList);

    //   // Update productModelList state

    //   if (productModelList.length > 0) {
    //     console.log("First product ID:", productModelList[0].id);
    //     console.log("First product name:", productModelList[0].name);
    //   } else {
    //     console.log("No products found");
    //   }

    //   // Trigger a re-render
    //   // notifyListeners();
    // } catch (error) {
    //   console.error("Error fetching main product data:", error);

    //   // Handle error
    // }

    try {


      const newMultiProductList = [];
      const q = query(
        collection(firestore, "CHANNEL_PRODUCTS"),
        where("CHANNEL_ID", "==", "8"),
        where("STATUS", "==", "ACTIVE")
      );
  
      // Listen for real-time updates on CHANNEL_PRODUCTS
      const unsubscribe = onSnapshot(q, async (channelProductSnapShot) => {
        if (!channelProductSnapShot.empty) {
          newMultiProductList.length = 0; // Clear previous data
  
          const productPromises = channelProductSnapShot.docs.map(async (chaProDoc) => {
            const { PRODUCT_ID: productId, ALLOCATED_TICKET: allocatedTicket } = chaProDoc.data();
  
            // Fetch real-time updates for each PRODUCT_ID
            const productQuery = query(
              collection(firestore, "PRODUCTS"),
              where("PRODUCT_ID", "==", productId)
            );
  
            return new Promise((resolve) => {
              onSnapshot(productQuery, (productSnapshot) => {
                if (productSnapshot.empty) {
                  resolve(null);
                } else {
                  const products = productSnapshot.docs.map((doc) => {
                    const map = doc.data();
                    return {
                      id: doc.id,
                      name: map.NAME || "",
                      price: map.PRICE || 0.0,
                      grossWeight: map.GROSS_WEIGHT || 0.0,
                      allocatedTicket,
                      productImageList: Array.isArray(map.IMAGES) ? map.IMAGES.map((item) => item.toString()) : [],
                      cgst: parseFloat(map.CGST) || 0.0,
                      igst: parseFloat(map.IGST) || 0.0,
                      sgst: parseFloat(map.SGST) || 0.0,
                    };
                  });
                  resolve(products);
                }
              });
            });
          });


  
          // Wait for all product data to resolve
          const products = await Promise.all(productPromises);
          products.forEach((productList) => {
            if (productList) newMultiProductList.push(...productList);
          });
  
          // Sort products by gross weight
          newMultiProductList.sort((a, b) => a.grossWeight - b.grossWeight);
          // setMultiProductList(newMultiProductList);
          setSplashMultiProductList(newMultiProductList)

        } else {
          // setMultiProductList([]);
          setSplashMultiProductList([])

        }
  

      });
  
      // Return unsubscribe function to stop the real-time listener when needed
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching real-time products:", error);
    
    }
  };

  const userAuthorized = async (phone) => {
    try {
      productModelList = [];
      const userCollectionRef = collection(firestore, "USERS");
      console.log("ddysuaiihgffdhsjakjshdfgdhxsjz");
      const q = query(
        userCollectionRef,
        where("PHONE", "==", phone),
        where("STATUS", "==", "ACTIVE")
      );
      const querySnapshot = await getDocs(q);
      console.log("irsdhasf");
      // const querySnapshot = await collection("CUSTOMERS")
      //   .where("PHONE", "==", mobile)
      //   .where("STATUS", "==", "ACTIVE")
      //   .get();

      if (!querySnapshot.empty) {

        const userData = querySnapshot.docs[0].data();
        const loginUser = {
          id: querySnapshot.docs[0].id,
          name: userData["NAME"] || "",
          phone: userData["PHONE"] || "",
          place: userData["STATE"] || "",
          type: userData["TYPE"] || "",
          photo: userData["PROFILE_IMAGE"] || "",
          pincode: userData["PINCODE"]
        };

        setLoginUser(loginUser);

        // Store data in local storage
        localStorage.setItem("appwrite_token", phone);
        localStorage.setItem("loginUserId", loginUser.id);
        localStorage.setItem("loginUserName", loginUser.name);
        localStorage.setItem("loginUserPhone", loginUser.phone);
        localStorage.setItem("loginUserType", loginUser.type);
        localStorage.setItem("loginUserPhoto", loginUser.photo);
        localStorage.setItem("loginUserPlace", loginUser.place);
        localStorage.setItem("loginUserPincode", loginUser.pincode);

        console.log(loginUser);
        console.log("loginUser.............................");
        // Fetch user details and other data
        // await fetchMainProduct();
        // await fetchOrders(loginUser.id);
        // await fetchCoupons(loginUser.id);
        // await fetchWallet(loginUser.id);

        // Check if product list has more than one product

        console.log(productModelList);
        console.log(productModelList[0].id);
        console.log(productModelList[0].name);
        console.log(productModelList[0].images);

        console.log("productModelList...................");

        // setProductData({
        //   productId: productModelList[0].id,
        //   productName: productModelList[0].name,
        //   productImages: productModelList[0].images,
        //   productPrice: productModelList[0].price,
        //   loginUserName: loginUser.name,
        //   loginUserId: loginUser.id,
        //   loginUserType: loginUser.type,
        //   loginUserPhone: loginUser.phone,
        //   loginUserPlace: loginUser.place,
        //   loginUserPhoto: loginUser.photo
        // });
        // console.log("irshadsssss")

        // if (productModelList.length > 1) {
        //   // Do something if there are more than one product
        // } else {
          // console.log("irshadsssss")

          localStorage.setItem("productId", productModelList[0].id);
          localStorage.setItem("productName", productModelList[0].name);
          localStorage.setItem("productImages", productModelList[0].images);
          localStorage.setItem("productPrice", productModelList[0].price);

          

          navigator("/home", {
            state: {
              productId: productModelList[0].id,
              productName: productModelList[0].name,
              productImages: productModelList[0].images,
              productPrice: productModelList[0].price,
              loginUserName: loginUser.name,
              loginUserId: loginUser.id,
              loginUserType: loginUser.type,
              loginUserPhone: loginUser.phone,
              from: "home",
            },
          });
        // }
      } else {
        // Redirect to login screen if user not found
      }
    } catch (error) {
      // Handle error
      console.error("Sorry, some error occurred:", error);
      // You might want to show a snackbar or toast here
    }
  };

  useEffect(() => {

    const timeout = setTimeout(async () => {

      await fetchMainProduct();
      let user = "";
      user = localStorage.getItem("loginUserId");
      console.log(user + "dfhgdfhvjfdgdsfvsdvsjdhvs");
      const phone = localStorage.getItem("loginUserPhone");
      console.log(phone + "dfhgdfhvjfdgdsfvsdvsjdhvs");

      if (user === "" || user === null) {



          //commented on 19/11/2024 reason : for sync multiprodcut on splash

          // localStorage.setItem("productId", productModelList[0].id);
          // localStorage.setItem("productName", productModelList[0].name);
          // localStorage.setItem("productImages", productModelList[0].images);
          // localStorage.setItem("productPrice", productModelList[0].price);

          navigator("/home", {
            state: {
              productId: productModelList[0].id,
              productName: productModelList[0].name,
              productImages: productModelList[0].images,
              productPrice: productModelList[0].price,
              loginUserName: "",
              loginUserId: "",
              loginUserType: "",
              loginUserPhone: "",
            },
          });
    
      } else {
        userAuthorized(phone);
      }
      navigator("/home");
    }, 30);

    return () => clearTimeout(timeout);
  }, [navigator]);
  return (
    <>
      <div className="splash">
        <div className="boche-splash">
          {/* <img src={Assets.Splash} alt="" /> */}
          <PropagateLoader color="#FB641B" />
          {/* <Loader /> */}
        </div>
      </div>
      <div className="nuerospine">
        {/* <img src={Assets.NuroSpine} alt="" /> */}
      </div>
    </>
  );
};


export default Splash;










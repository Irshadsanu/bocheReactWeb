// import React, { useState, useEffect } from "react";
// import "./MyOrders.css";
// import { MdOutlineSearch } from "react-icons/md";
// import { FaChevronRight } from "react-icons/fa6";
// import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
// import { firestore } from "../../firebase";
// import { format } from "date-fns";
// import { Link, useNavigate } from "react-router-dom";
// import boximg from "../Assets/Images/package_2.png";
// import visibiityOff from "../Assets/Images/visibility_off.png";
// import VisibilityOfFBox from "../Assets/Images/Rectangle.png";
// import Visibility from "../Assets/Images/visibility.png";
// import { Assets } from "../Assets/Assets";
// import { ClipLoader } from "react-spinners";
// import { useCount } from "../../Context/Context";

// export const MyOrders = () => {
//   const [otpVisibility, setOtpVisibility] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const [orderOtp, setOrderOtp] = useState("");
//   const { loading, setLoading } = useCount();

//   // const handleVisible = ()=> {

//   //  if ( otpVisibility === false ) {
//   //   otpVisibility = true
//   //  } else {
//   //   otpVisibility = false
//   //  }
//   // }

//   const handleVisible = () => {
//     setOtpVisibility((prevState) => !prevState);
//   };

//   const cusId = localStorage.getItem("loginUserId");
//   const navigate = useNavigate();

//   const formatDate = (date) => {
//     return format(date, "dd MM yyyy");
//   };

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       console.log(cusId);
//       const q = query(
//         collection(firestore, "ORDERS"),
//         where("CUSTOMER_ID", "==", cusId),
//         orderBy("ORDER_DATE", "desc")
//       );
//       const snapshot = await getDocs(q);

//       const fetchedOrders = [];
//       if (!snapshot.empty) {
//         snapshot.forEach((doc) => {
//           const data = doc.data();
//           const productsItemList = [];

//           if (Array.isArray(data.ITEMS)) {
//             data.ITEMS.forEach((item) => {
//               productsItemList.push({
//                 productId: item.PRODUCT_ID || "",
//                 productImage: item.PRODUCT_IMAGE || [],
//                 productPrice: item.PRODUCT_PRICE || 0.0,
//                 itemQuantity: item.ITEM_QUANTITY || 0,
//               });
//             });
//           }

//           const orderDate = data.ORDER_DATE.toDate();
//           fetchedOrders.push({
//             orderId: data.ORDER_ID || "",
//             customerId: data.CUSTOMER_ID || "",
//             orderDate: orderDate,
//             itemTotalAmount: data.ITEM_TOTAL_AMOUNT || 0.0,
//             productsItemList: productsItemList,
//             status: data.STATUS || "",
//             randomCode: data.RANDOM_CODE || "0",
//             type: data.TYPE || "",
//             deliveryAddress: data.DELIVERY_ADDRESS || "",
//             deliveryName: data.DELIVERY_NAME || "",
//             deliveryNumber: data.DELIVERY_NUMBER || "",
//             itemTotalQuantity: data.ITEM_TOTAL_QUANTITY || 0,
//           });
//         });

//         setOrders(fetchedOrders);

//         const pickupOrders = fetchedOrders.filter(
//           (order) => order.type === "Pick Up From Store"
//         );
//         if (pickupOrders.length > 0) {
//           setOrderOtp(pickupOrders[0].randomCode.toString());
//         }
//       }
//       console.log(`${fetchedOrders.length} orders fetched and sorted.`);
//       console.log(`${orders.length} orders fetch ---------------------.`);
//       setLoading(false);
//     } catch (e) {
//       console.error("Error fetching orders:", e);
//       setLoading(false);
//     }
//   };
//   // const fetchOrders = async () => {
//   //   try {
//   //     console.log(cusId);
//   //     const q = query(
//   //       collection(firestore, "ORDERS"),
//   //       where("COSTUMER_ID", "==", cusId)
//   //     );
//   //     const snapshot = await getDocs(q);
//   //     const ordersList = [];

//   //     if (!snapshot.empty) {
//   //       snapshot.forEach((doc) => {
//   //         const data = doc.data();
//   //         const orderDate = data.ORDER_DATE.toDate();
//   //         ordersList.push(
//   //           new OrdersModel(
//   //             data.ORDER_ID,
//   //             data.COSTUMER_ID || "",
//   //             orderDate,
//   //             data.ORDER_PRICE || 0,
//   //             data.PRODUCT_ID || "",
//   //             data.PRODUCT_IMAGE || [],
//   //             data.PRODUCT_PRICE || 0,
//   //             data.PRODUCT_QUANTITY || 0,
//   //             data.STATUS || ""
//   //           )
//   //         );
//   //       });
//   //     }

//   //     console.log(`${ordersList.length} orders fetched.`);
//   //     return ordersList;
//   //   } catch (error) {
//   //     console.error("Error fetching orders: ", error);
//   //     return [];
//   //   }
//   // };

//   // const [orders, setOrders] = useState([]);

//   const [searchQuantity, setSearchQuantity] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchOrders();
//       // setOrders(fetchedOrders);
//     };

//     fetchData();
//   }, [cusId]);

//   const handleSearch = (e) => {
//     setSearchQuantity(e.target.value);
//   };

//   const filteredOrders = orders
//     ? orders.filter((order) => {
//         return order.itemTotalQuantity.toString().includes(searchQuantity);
//       })
//     : [];

//   console.log(orders);

//   const handleOrderClick = (order) => {
//     navigate("/summery", {
//       state: {
//         orderId: order.orderId,
//         orderDate: order.orderDate,
//         orderPrice: order.itemTotalAmount,
//         productQuantity: order.itemTotalQuantity,
//         status: order.status,
//         productImage: order.productImage,
//         productPrice: order.productsItemList[0].productPrice,
//       },
//     });
//   };

//   return (
//     <div className="my-order">
//       <form action="">
//         <input
//           type="text"
//           placeholder="Search by product quantity..."
//           value={searchQuantity}
//           onChange={handleSearch}
//         />

//         <div className="icon_boxx">
//           <MdOutlineSearch /> <p>Search Orders</p>
//         </div>
//       </form>
//       {/* ----------------------------------------------------------------------------------- */}

//       <div className="otp_box_container">
//         <div className="otp_box">
//           <div className="otp_box_main">
//             <div className="otp_box_container_col_1">
//               <img src={boximg} alt="" />
//             </div>
//             <div className="otp_box_container_col_2">
//               <h4>Delivery requires an OTP</h4>

//               {otpVisibility === false ? (
//                 <div className="visiblity_container_off">
//                   <div className="otp_hidden_box">
//                     <img
//                       className="visible_box"
//                       onClick={handleVisible}
//                       src={VisibilityOfFBox}
//                       alt=""
//                     />
//                     <img
//                       className="visibility"
//                       onClick={handleVisible}
//                       src={Visibility}
//                       alt=""
//                     />
//                   </div>
//                   <p> Click on the icon to access the OTP</p>
//                 </div>
//               ) : (
//                 <div className="visiblity_container_on">
//                   <h3>{orderOtp}</h3>{" "}
//                   <img onClick={handleVisible} src={visibiityOff} alt="" />
//                 </div>
//               )}

//               <p>You need to provide the OTP to receive the product</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {loading ? (
//         <div className="loader-order" style={{ textAlign: "center" }}>
//           <ClipLoader color="#36d7b7" size={50} />
//         </div>
//       ) : (
//         <div className="order-list">
//           {filteredOrders.map((order) => (
//             <div className="order-item" key={order.orderId}>
//               <div
//                 className="total-click"
//                 onClick={() => handleOrderClick(order)}
//               >
//                 <div className="order-details">
//                   <div className="order-box">
//                     <div className="tea">
//                       <img src={Assets.Tea} alt="" />
//                     </div>
//                     <div className="deliver">
//                       <p>boCHE TEA</p>
//                       <span>{order.itemTotalQuantity / 10}Kg</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="quantity_box">
//                   <div className="quantity_box_contianer">
//                     <h4>₹{order.itemTotalAmount}</h4>
//                     <p>{order.itemTotalQuantity} Tea Packets</p>
//                   </div>
//                 </div>
//                 <div className="delivery_details">
//                   <div className="delivery_details_container">
//                     <div className="sub_container_Delivery_details">
//                       {" "}
//                       <div className="circle"></div>
//                       <h4>
//                         {" "}
//                         {order.status} on {formatDate(order.orderDate)}
//                       </h4>
//                     </div>
//                     <p>Your order is {order.status.toLowerCase()}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="buttons">
//                 <div className="buttons_container">
//                   <button
//                     className="btn_2"
//                     onClick={() => handleOrderClick(order)}
//                   >
//                     Order Details
//                   </button>
//                   <Link to="/paymentweb">
//                     <button className="btn_1">Order Agian</button>
//                   </Link>
//                 </div>
//               </div>
//               {/* <div className="order-arrow">
//               <FaChevronRight />
//             </div> */}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

//main code

// -------------------------------------------

// // import React, { useState, useEffect } from 'react';
// // import "./MyOrders.css";
// // import { MdOutlineSearch } from "react-icons/md";
// // import { FaChevronRight } from "react-icons/fa6";
// // import { collection, query, where, getDocs } from "firebase/firestore";
// // import { firestore } from "../../firebase";
// // import { OrdersModel } from "../../ModelClasses/order_model";
// // import { format } from 'date-fns';
// // import { useNavigate } from 'react-router-dom';

// // export const MyOrders = () => {
// //   const cusId = localStorage.getItem('loginUserId');
// //   const navigate = useNavigate();

// //   const formatDate = (date) => {
// //     return format(date, 'dd MM yyyy');
// //   };

// //   const [orders, setOrders] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [filteredOrders, setFilteredOrders] = useState([]);

// //   const fetchOrders = async () => {
// //     try {
// //       console.log(cusId);
// //       const q = query(collection(firestore, "ORDERS"), where("COSTUMER_ID", "==", cusId));
// //       const snapshot = await getDocs(q);
// //       const ordersList = [];

// //       if (!snapshot.empty) {
// //         snapshot.forEach((doc) => {
// //           const data = doc.data();
// //           const orderDate = data.ORDER_DATE.toDate();
// //           ordersList.push(new OrdersModel(
// //             data.ORDER_ID,
// //             data.COSTUMER_ID || "",
// //             orderDate,
// //             data.ORDER_PRICE || 0,
// //             data.PRODUCT_ID || "",
// //             data.PRODUCT_IMAGE || [],
// //             data.PRODUCT_PRICE || 0,
// //             data.PRODUCT_QUANTITY || 0,
// //             data.STATUS || "",
// //             data.PRODUCT_NAME || "" // Ensure the product name is included
// //           ));
// //         });
// //       }

// //       console.log(`${ordersList.length} orders fetched.`);
// //       setOrders(ordersList);
// //       setFilteredOrders(ordersList); // Initialize filtered orders
// //     } catch (error) {
// //       console.error("Error fetching orders: ", error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchOrders();
// //   }, [cusId]);

// //   useEffect(() => {
// //     const filterOrders = () => {
// //       const filtered = orders.filter(order =>
// //         order.productName.toLowerCase().includes(searchTerm.toLowerCase())
// //       );
// //       setFilteredOrders(filtered);
// //     };

// //     filterOrders();
// //   }, [searchTerm, orders]);

// //   const handleOrderClick = (order) => {
// //     navigate('/summery', {
// //       state: {
// //         orderId: order.orderId,
// //         orderDate: order.orderDate,
// //         orderPrice: order.orderPrice,
// //         productQuantity: order.productQuantity,
// //         status: order.status,
// //         productImage: order.productImage,
// //         productPrice: order.productPrice
// //       }
// //     });
// //   };

// //   return (
// //     <div className="my-order">
// //       <form onSubmit={(e) => e.preventDefault()}>
// //         <input
// //           type="text"
// //           placeholder="Search by product name..."
// //           value={searchTerm}
// //           onChange={(e) => setSearchTerm(e.target.value)}
// //         />
// //         <MdOutlineSearch />
// //       </form>
// //       <div className="order-list">
// //         {filteredOrders.map((order) => (
// //           <div className="order-item" key={order.orderId} onClick={() => handleOrderClick(order)}>
// //             <div className="order-details">
// //               <div className="order-box">
// //                 <div className="tea">
// //                   <img src={order.productImage} alt="" />
// //                 </div>
// //                 <div className="deliver">
// //                   <p>{order.status} on {formatDate(order.orderDate)}</p>
// //                   <span>{order.productQuantity} Tea Pack</span>
// //                 </div>
// //               </div>
// //             </div>
// //             <div className="order-arrow">
// //               <FaChevronRight />
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // // ----------------------------------------------------------

// // // old code

// import React, { useState, useEffect } from 'react';
// import "./MyOrders.css";
// import { MdOutlineSearch } from "react-icons/md";
// import { FaChevronRight } from "react-icons/fa6";
// import { Assets } from "../Assets/Assets";
// import { Link } from "react-router-dom";
// import { collection,query, where, getDocs } from "firebase/firestore";
// import { firestore } from "../../firebase";
// import {OrdersModel} from "../../ModelClasses/order_model"
// import { format } from 'date-fns';
// import { useNavigate } from 'react-router-dom';

// export const MyOrders = () => {

//   const cusId = localStorage.getItem('loginUserId');
//   const navigator = useNavigate();

//   const formatDate = (date) => {
//     return format(date, 'dd MM yyyy');
//   };

//   const fetchOrders = async () => {
//     try {
//       console.log(cusId);
//       const q = query(collection(firestore, "ORDERS"), where("COSTUMER_ID", "==", cusId));
//       const snapshot = await getDocs(q);
//       const ordersList = [];

//       if (!snapshot.empty) {
//         snapshot.forEach((doc) => {
//           const data = doc.data();
//           const orderDate = data.ORDER_DATE.toDate();
//           ordersList.push(new OrdersModel(
//             data.ORDER_ID   ,
//             data.COSTUMER_ID || "",
//             orderDate,
//             data.ORDER_PRICE || 0,
//             data.PRODUCT_ID || "",
//             data.PRODUCT_IMAGE || [],
//             data.PRODUCT_PRICE || 0,
//             data.PRODUCT_QUANTITY || 0,
//             data.STATUS || ""
//           ));
//         });
//       }

//       console.log(`${ordersList.length} orders fetched.`);
//       return ordersList;
//     } catch (error) {
//       console.error("Error fetching orders: ", error);
//       return [];
//     }
//   };

//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const fetchedOrders = await fetchOrders();
//       setOrders(fetchedOrders);
//     };

//     fetchData();
//   }, [cusId]);

//   const handleOrderClick = (order) => {
//     navigator('/summery', {
//       state: {
//         orderId: order.orderId,
//         orderDate: order.orderDate,
//         orderPrice: order.orderPrice,
//         productQuantity: order.productQuantity,
//         status: order.status,
//         productImage:order.productImage,
//         productPrice:order.productPrice

//       }
//     });
//   };

//   return (
//     <div className="my-order">
//       <form action="">
//         <input type="text" placeholder="Search here..." />
//         <MdOutlineSearch />
//       </form>
//       <div className="order-list">
//       {orders.map((order) => (

//           <div className="order-item" onClick={() => handleOrderClick(order)} >
//             <div className="order-details">
//               <div className="order-box">
//                 <div className="tea">
//                   <img src={order.productImage} alt="" />
//                 </div>
//                 <div className="deliver">
//                   <p>{order.status} on {formatDate(order.orderDate)}</p>
//                   <span>{order.productQuantity} Tea Pack</span>
//                 </div>
//               </div>
//             </div>
//             <div className="order-arrow">
//               <FaChevronRight />
//             </div>
//           </div>

//          ))}
//         {/* <div className="order-item">
//           <div className="order-details">
//             <div className="order-box">
//               <div className="tea">
//                 <img src={Assets.Tea} alt="" />
//               </div>
//               <div className="deliver">
//                 <p>Delivered on April 20, 2024</p>
//                 <span>Tea Pack</span>
//               </div>
//             </div>
//           </div>
//           <div className="order-arrow">
//             <FaChevronRight />
//           </div>
//         </div>
//         <div className="order-item">
//           <div className="order-details">
//             <div className="order-box">
//               <div className="tea">
//                 <img src={Assets.Tea} alt="" />
//               </div>
//               <div className="deliver">
//                 <p>Delivered on April 20, 2024</p>
//                 <span>Tea Pack</span>
//               </div>
//             </div>
//           </div>
//           <div className="order-arrow">
//             <FaChevronRight />
//           </div>
//         </div>
//         <div className="order-item">
//           <div className="order-details">
//             <div className="order-box">
//               <div className="tea">
//                 <img src={Assets.Tea} alt="" />
//               </div>
//               <div className="deliver">
//                 <p>Delivered on April 20, 2024</p>
//                 <span>Tea Pack</span>
//               </div>
//             </div>
//           </div>
//           <div className="order-arrow">
//             <FaChevronRight />
//           </div>
//         </div> */}
//       </div>
//     </div>
//   );
// };

//lasts updation

import React, { useState, useEffect, useRef, useCallback } from "react";
import "./MyOrders.css";
import { MdOutlineSearch } from "react-icons/md";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import { format } from "date-fns";
import { Link, useLocation, useNavigate } from "react-router-dom";
import boximg from "../Assets/Images/package_2.png";
import visibiityOff from "../Assets/Images/visibility_off.png";
import VisibilityOfFBox from "../Assets/Images/Rectangle.png";
import Visibility from "../Assets/Images/visibility.png";
import { Assets } from "../Assets/Assets";
import { ClipLoader } from "react-spinners";
import { useCount } from "../../Context/Context";
import orderIMg from "../../Components/Assets/Images/order_empty.png";

export const MyOrders = () => {
  
  const [otpVisibility, setOtpVisibility] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderOtp, setOrderOtp] = useState("");
  const { loading, setLoading, setCount,setMultiRate } = useCount();
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef(null);
  const navigate = useNavigate();
  const cusId = localStorage.getItem("loginUserId");
  const cusPhone = localStorage.getItem("loginUserPhone");

  const handleVisible = () => {
    setOtpVisibility((prevState) => !prevState);
  };

  const formatDate = (date) => {
    return format(date, "dd MM yyyy");
  };

  const location = useLocation();

  const hasFetchedOrders = useRef(false);

  // const fetchOrders = async (lastVisibleDoc = null) => {
  //   try {
  //     setLoading(true);
  //     console.log("Fetching orders with lastVisibleDoc:", lastVisibleDoc);

  //     let collectionRef = collection(firestore, "ORDERS");
  //     let baseQuery = query(
  //       collectionRef,
  //       where("CUSTOMER_ID", "==", cusId),
  //       orderBy("ORDER_DATE", "desc"),
  //       limit(15)
  //     );

  //     if (lastVisibleDoc) {
  //       baseQuery = query(baseQuery, startAfter(lastVisibleDoc));
  //     }

  //     const snapshot = await getDocs(baseQuery);

  //     console.log("Query executed:", baseQuery);
  //     console.log("Snapshot metadata:", snapshot.metadata);

  //     const fetchedOrders = snapshot.docs.map(doc => {
  //       const data = doc.data();
  //       const productsItemList = Array.isArray(data.ITEMS) ? data.ITEMS.map(item => ({
  //         productId: item.PRODUCT_ID || "",
  //         productImage: item.PRODUCT_IMAGE || [],
  //         productPrice: item.PRODUCT_PRICE || 0.0,
  //         itemQuantity: item.ITEM_QUANTITY || 0,
  //       })) : [];

  //       const orderDate = data.ORDER_DATE.toDate();

  //       return {
  //         orderId: data.ORDER_ID || "",
  //         customerId: data.CUSTOMER_ID || "",
  //         orderDate: orderDate,
  //         itemTotalAmount: data.ITEM_TOTAL_AMOUNT || 0.0,
  //         productsItemList: productsItemList,
  //         status: data.STATUS || "",
  //         randomCode: data.RANDOM_CODE || "0",
  //         type: data.TYPE || "",
  //         deliveryAddress: data.DELIVERY_ADDRESS || "",
  //         deliveryName: data.DELIVERY_NAME || "",
  //         deliveryNumber: data.DELIVERY_NUMBER || "",
  //         itemTotalQuantity: data.ITEM_TOTAL_QUANTITY || 0,
  //       };
  //     });

  //     console.log("Fetched orders:", fetchedOrders);

  //     setOrders(prevOrders => [...prevOrders, ...fetchedOrders]);
  //     setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
  //     setHasMore(snapshot.docs.length === 15);

  //     const pickupOrders = fetchedOrders.filter(order => order.type === "Pick Up From Store");
  //     if (pickupOrders.length > 0) {
  //       setOrderOtp(pickupOrders[0].randomCode.toString());
  //     }

  //     setLoading(false);
  //   } catch (e) {
  //     console.error("Error fetching orders:", e);
  //     setLoading(false);
  //   }
  // };

  const fetchOrders = useCallback(
    async (lastVisibleDoc = null) => {

      try {

        setLoading(true);
        console.log("Fetching orders with lastVisibleDoc:", lastVisibleDoc);

        let collectionRef = collection(firestore, "ORDERS");
        let baseQuery = query(
          collectionRef,
          where("CUSTOMER_PHONE", "==", cusPhone), // Filter orders by CUSTOMER_ID
          orderBy("ORDER_DATE", "desc"),
          limit(15)
        );

        if (lastVisibleDoc) {
          baseQuery = query(baseQuery, startAfter(lastVisibleDoc));
        }

        const snapshot = await getDocs(baseQuery);

        console.log("Query executed:", baseQuery);
        console.log("Snapshot metadataaaaaaaaaaaa:", snapshot.metadata);
        console.log(snapshot,"haiiinoooo")

        const fetchedOrders = [];
        if (!snapshot.empty) {
          snapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Document dataaaaa:", data);

            const productsItemList = Array.isArray(data.ITEMS)
              ? data.ITEMS.map((item) => ({
                  productName : item.PRODUCT_NAME || "",
                  productId: item.PRODUCT_ID || "",
                  productImage: item.PRODUCT_IMAGE || [],
                  productPrice: item.PRODUCT_PRICE || 0.0,
                  productWeight : item.PRODUCT_WEIGHT || 0,
                  itemQuantity: item.ITEM_QUANTITY || 0,
                  productWeight : item.PRODUCT_WEIGHT || 0,
                  productPriceWithoutGst : item.WITHOUT_GST_AMOUNT || 0,
                  igst : item.IGST || 0,
                  cgst : item.CGST || 0,
                  sgst : item.SGST || 0
                }))
              : [];

             
              

            fetchedOrders.push({
              orderId: data.ORDER_ID || "",
              customerId: data.CUSTOMER_ID || "",
              orderDate: data.ORDER_DATE.toDate(),
              itemTotalAmount: data.ITEM_TOTAL_AMOUNT || 0.0,
              productsItemList: productsItemList,
              status: data.STATUS || "",
              randomCode: data.RANDOM_CODE || "0",
              type: data.TYPE || "",
              deliveryAddress: data.DELIVERY_ADDRESS || "",
              deliveryName: data.DELIVERY_NAME || "",
              deliveryNumber: data.DELIVERY_NUMBER || "",
              itemTotalQuantity: data.ITEM_TOTAL_QUANTITY || 0,
              deliveryRate: data.DELIVERY_CHARGE || 0,
              totalWeight : data.ITEM_TOTAL_WEIGHT || 0,
              orderAmount : data.ORDER_AMOUNT || 0
            });
          });

          console.log("Fetched ordersssssssssssssss:", fetchedOrders);

          setOrders((prevOrders) => [...prevOrders, ...fetchedOrders]); // Append new orders to the previous state
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
          setHasMore(snapshot.docs.length === 15);

          const pickupOrders = fetchedOrders.filter(
            (order) => order.type === "Pick Up From Store"
          );
          if (pickupOrders.length > 0) {
            setOrderOtp(pickupOrders[0].randomCode.toString());
          }
        } else {
          console.log("No more orders to fetch.");
          setHasMore(false);
        }
      } catch (e) {
        console.error("Error fetching orders:", e);
      } finally {
        setLoading(false);
      }
    },
    [cusPhone]
  );
  useEffect(() => {
    if (location.state?.from === "order") {
      // Call your function here
      fetchOrders();
    }
  }, [location.state]);

  useEffect(() => {
    if (location.state?.from === "order" && !hasFetchedOrders.current) {
      fetchOrders();
      hasFetchedOrders.current = true;
    }
  }, [location.state, fetchOrders]);

  useEffect(() => {
    console.log(location.state, "this is stateeeeeeeeeeeeeeeeeee");

    const handlePropState = (event) => {
      if (location.state && location.state?.preventBack) {
        console.log("cannot go back to payment gate way ");
        window.history.pushState({ preventBack: true }, "");
      }
    };

    window.history.pushState({ preventBack: true }, "");
    window.addEventListener("popstate", handlePropState);

    return () => {
      window.removeEventListener("popstate", handlePropState);
    };
  }, [location.state]);

  const handleOrderAgain = (productName, productImage, productPrice, productWeight, qty,igst, sgst,cgst) => {
    console.log(productPrice,"single pdt price from order again");
    
    setCount(qty);
    setMultiRate(productPrice);
    

    navigate('/paymentweb', { state: { productImage, productName, productPrice, productWeight, qty, igst, sgst,cgst } });
  };

  useEffect(() => {
    
    console.log("order workingggggggg oooooooo");
    const observerCallback = (entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchOrders(lastVisible);
        console.log("order workingggggggg 1111111");
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [lastVisible, hasMore, loading, fetchOrders]);

  // -------------------------------

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && hasMore && !loading) {
  //         fetchOrders(lastVisible);
  //       }
  //     },
  //     {
  //       root: null,
  //       rootMargin: "20px",
  //       threshold: 0.1,
  //     }
  //   );

  //   if (loadMoreRef.current) {
  //     observer.observe(loadMoreRef.current);
  //   }

  //   return () => {
  //     if (loadMoreRef.current) {
  //       observer.unobserve(loadMoreRef.current);
  //     }
  //   };
  // }, [lastVisible, hasMore, loading]);

  const [searchQuantity, setSearchQuantity] = useState("");

  const handleSearch = (e) => {
    setSearchQuantity(e.target.value);
  };
  // const [qtyfilteredOrders, setQtyFilteredOrders] = useState([]);
  // const handleIconClick = () => {
  //   const filtered = orders.filter((order) =>
  //     order.itemTotalQuantity.toString().startsWith(searchQuantity)
  //   );
  //   setQtyFilteredOrders(filtered); // Update filtered orders on icon click
  // };

  //   const filteredOrders = orders.filter((order) =>
  //     order.itemTotalQuantity.toString().includes(searchQuantity)
  //   );
  const filteredOrders = searchQuantity
    ? orders.filter((order) =>
        order.itemTotalQuantity.toString().startsWith(searchQuantity)
      )
    : orders;

  console.log(filteredOrders, "filtered orders dataaaaaas");
  console.log(filteredOrders.productsItemList,"itemmmmlisttttt");
  

  // fetchedOrders.push({
  //   orderId: data.ORDER_ID || "",
  //   customerId: data.CUSTOMER_ID || "",
  //   orderDate: orderDate,
  //   itemTotalAmount: data.ITEM_TOTAL_AMOUNT || 0.0,
  //   productsItemList: productsItemList,
  //   status: data.STATUS || "",
  //   randomCode: data.RANDOM_CODE || "0",
  //   type: data.TYPE || "",
  //   deliveryAddress: data.DELIVERY_ADDRESS || "",
  //   deliveryName: data.DELIVERY_NAME || "",
  //   deliveryNumber: data.DELIVERY_NUMBER || "",
  //   itemTotalQuantity: data.ITEM_TOTAL_QUANTITY || 0,
  // });

  const handleOrderClick = (order) => {
    console.log(order,"order details dtaaaaaaaaaaa")
    navigate("/summery", {
      state: {
        orderId: order.orderId,
        orderDate: order.orderDate,
        orderPrice: order.itemTotalAmount,
        productQuantity: order.itemTotalQuantity,
        status: order.status,
        productImage: order.productsItemList[0].productImage,
        productPrice: order.productsItemList[0].productPrice,
        productWeight : order.productsItemList[0].productWeight,
        multiProOrder : order.productsItemList,
        deliveryRate: order.deliveryRate,
        type: order.type,
      },
    });
    console.log(order.productsItemList,"nameeeeasdfsdfaa")
  };
  return (
    <div className="my-order">
      <div className="serch_otp_main">
        <form action="">
          <input
            type="text"
            placeholder="Search by product quantity..."
            value={searchQuantity}
            onChange={handleSearch}
          />
          <div className="icon_boxx"
          //  onClick={handleIconClick}
           >
            <MdOutlineSearch /> <p>Search </p>
          </div>
        </form>

        {/* ------------------------------------------------------------------------- imggggggggg */}
        {/* {orders.length === 0 ? (
  <img style={{textAlign: "center"}} src={orderIMg} alt="" />
) : (
  <> */}
        <div className="otp_box_container">
          {orderOtp.length > 0 ? (
            <div className="otp_box">
              <div className="otp_box_main">
                <div className="otp_box_container_col_1">
                  <img src={boximg} alt="" />
                </div>
                <div className="otp_box_container_col_2">
                  <h4>Delivery requires an OTP</h4>
                  {otpVisibility === false ? (
                    <div className="visiblity_container_off">
                      <div className="otp_hidden_box">
                        <img
                          className="visible_box"
                          onClick={handleVisible}
                          src={VisibilityOfFBox}
                          alt=""
                        />
                        <img
                          className="visibility"
                          onClick={handleVisible}
                          src={Visibility}
                          alt=""
                        />
                      </div>
                      <p> Click on the icon to access the OTP</p>
                    </div>
                  ) : (
                    <div className="visiblity_container_on">
                      <h3>{orderOtp}</h3>{" "}
                      <img onClick={handleVisible} src={visibiityOff} alt="" />
                    </div>
                  )}
                  <p>You need to provide the OTP to receive the product</p>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {loading && !orders.length ? (
        <div className="loader-order" style={{ textAlign: "center" }}>
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      ) : (
        <div className="order-list">
          {filteredOrders.length === 0 ? (
            <>
              <div className="empty_container">
                {" "}
                <div className="image_container">
                  <img style={{ textAlign: "center" }} src={orderIMg} alt="" />
                </div>
                <div className="empty_text">
                  <p>No Orders Found!</p>
                  <span>
                    Start exploring your products and place your order today!"
                  </span>
                </div>
              </div>
            </>
          ) : (
            filteredOrders.map((order) => (
            
              <div className="order-item" key={order.orderId}>
                <div
                  className="total-click"
                  onClick={() => handleOrderClick(order)}
                >
                  <div className="order-details">
                    <div className="order-box">
                      <div className="tea">
                        <img src={order.productsItemList[0].productImage} alt="" />
                      </div>
                      <div className="deliver">
                        <p>{order.orderId}</p>
                        <span>
                          {order.totalWeight < 1
                            ? `${(order.totalWeight * 1000).toFixed(0)}g` // Convert to grams
                            : `${order.totalWeight}kg`}       
                        </span>

                      </div>
                    </div>
                  </div>
                  <div className="quantity_box">
                    <div className="quantity_box_contianer">
                      <h4>₹{order.orderAmount}</h4>
                      <p>{order.itemTotalQuantity} Tea Packets</p>
                    </div>
                  </div>
                  <div className="delivery_details">
                    <div className="delivery_details_container">
                      <div className="sub_container_Delivery_details">
                        <div className="circle"></div>
                        <h4>
                          {order.status} on {formatDate(order.orderDate)}
                        </h4>
                      </div>
                      <p>Your order is {order.status.toLowerCase()}</p>
                    </div>
                  </div>
                </div>
                <div className="buttons">
                  <div className="buttons_container">
                    <button
                      className="order_btn_2"
                      onClick={() => handleOrderClick(order)}
                    >
                      Order Details
                    </button>


                    {/* <Link
                      to={{
                        pathname: "/paymentweb",
                        state: { itemTotalQuantity: order.itemTotalQuantity,
                          productName : order.productsItemList[0].productName,
                          prodcutImage : order.productsItemList[0].productImage,
                          productPrice : order.productsItemList[0].productPrice,
                          productWeight : order.productsItemList[0].productWeight
                        },
                      }}
                    >
                      <button
                        onClick={() => setCount(order.itemTotalQuantity)}
                        className="order_btn_1"
                      >
                        Order Again
                      </button>
                    </Link> */}


                    {/* order again commented on 21/11/24  */}

                    {/* <button onClick={() => handleOrderAgain(
                           order.productsItemList[0].productName,
                           order.productsItemList[0].productImage,
                           order.productsItemList[0].productPrice,
                           order.productsItemList[0].productWeight,
                           order.itemTotalQuantity,
                           order.productsItemList[0].igst,
                           order.productsItemList[0].cgst,
                           order.productsItemList[0].sgst
                           
                    )}
                    className="order_btn_1">order Again</button> */}    

                  </div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="loader-order" style={{ textAlign: "center" }}>
              <ClipLoader color="#36d7b7" size={50} />
            </div>
          )}
          {hasMore && !loading && (
            <div ref={loadMoreRef} style={{ height: "20px" }}>
              {/* Empty div to trigger intersection observer */}
            </div>
          )}
        </div>
      )}
      {/* </>
)} */}
    </div>
  );
};

export default MyOrders;

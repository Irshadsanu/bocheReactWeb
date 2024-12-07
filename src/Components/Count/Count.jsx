import React, { useEffect, useState } from "react";
import "./Count.css";
import { Assets } from "../Assets/Assets";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useCount } from "../../Context/Context";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../Header/Header";
import Footer from "../../Pages/Footer/Footer";
import HeaderWeb from "../Header/HeaderWeb";
import { firestore } from "../../firebase";
import { collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { toast } from "sonner";
import { setConsent } from "firebase/analytics";

export const Count = () => {

  const productPrice = localStorage.getItem("productPrice");
  const productImages = localStorage.getItem("productImages");
  const loginUserId = localStorage.getItem("loginUserId");
  const cusId = localStorage.getItem("loginUserId");

  const { state: { productId, productName , itemImg, price ,productWeight,allocatedTicket, igst , sgst, cgst } = {} } = useLocation();

  console.log(productId,"product id ........................")

  
  const custPhone = localStorage.getItem("loginUserPhone");
  const custName = localStorage.getItem("loginUserName");

  let myCartTotalProductQty;

  // const [myCartTotalProductQty,setCartTotalProductQty] = useState(0)



  const [clickedButton, setClickedButton] = useState(null);

  const { count,setCount, totalPrice, increment, decrement , setMultiRate } = useCount();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [isTab, setIsTab] = useState(window.innerWidth <= 870);
  const navigate = useNavigate();
  const [emptyQuantity,setEmptyQuantity] = useState(false)
  const [singleproductTotalWeight,setSingleproductTotalWeight] = useState(0)

  const productQty = count ; 

  useEffect(() => {
    setMultiRate(price);
  
  }, [price])

  
  useEffect(() => {
    const handleResize = () => {
      
      setIsMobile(window.innerWidth <= 480);
      setIsTab(window.innerWidth <= 870);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);




  useEffect(() => {

    // const singleproductTotalWeight = count  * productWeight 
    setSingleproductTotalWeight(count  * productWeight)
    console.log(singleproductTotalWeight,"productweight qtyyy")

  },[count])

  const handleButtonClick = (singleproductTotalWeight) => {

    console.log(price,productPrice,productWeight,allocatedTicket,"price from coount");

    const buttonLink =
      loginUserId === "" || loginUserId === null ? "/login" : "/paymentweb";
    navigate(buttonLink, {
      state: { count, totalPrice, productPrice, productImages , from : "count" , price, itemImg, productWeight,allocatedTicket,singleproductTotalWeight,productName ,igst , sgst, cgst },
    });
  };
  const handleClick = (action) => {
    if(action === "increment" && count >= 10){
      toast.error("cannot increment beyond 10")
    }
    setClickedButton(action);
    if(count === 0 && action == "decrement"){
      setEmptyQuantity(true)
    }
    setTimeout(() => {
      setClickedButton(null);     
    }, 200);
    action === "increment" ? increment() : decrement();
  };

        // add cart function -----------------------------------------------------------------------------

        

const addToCartFn = async ( cusId, custName, custPhone, productId, productName, productQty) => {

    try {

      if(!cusId) {
        navigate('/login')
        return
      }
      // Query to find if the product already exists in the cart
      const cartQuery = query(
  
        collection(firestore, "CART"),
        where("CUSTOMER_ID", "==", cusId),
        where("PRODUCT_ID", "==", productId)
      );
  
      const existingCartSnapshot = await getDocs(cartQuery);
  
      console.log("tessssssssssssssssssssssttt")
  
  
      if (!existingCartSnapshot.empty) {
        // If product already exists, update its quantity
        const existingDoc = existingCartSnapshot.docs[0];
        const existingQty = existingDoc.data().PRODUCT_QTY;
        const updatedQty = existingQty + productQty;
        // const productRate = 
  
      // console.log(existingDoc, "existingDoc,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,")
      // console.log(existingQty, "existingQty,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,")
      console.log( updatedQty , "updatedQty,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,")
  
    
  
        // if (updatedQty <= 10) {
        //   // Update total product quantity in a state or variable
        //   setCartTotalProductQty((prev) => prev + productQty);


        //   // console.log(myCartTotalProductQty,"chekckkkkkkkkkkkkkkkkkkkkkkkkk" )
  
        //   await updateDoc(doc(firestore, "CART", existingDoc.id), {
        //     "PRODUCT_QTY": updatedQty
        //   });

        if (updatedQty <= 10) {
          await updateDoc(doc(firestore, "CART", existingDoc.id), {
            PRODUCT_QTY: updatedQty,
          });

          // setCartTotalProductQty((prev) => prev + productQty); // Update state

          console.log("Updating Firestore with:", { updatedQty, productId });
          addToCartSnackBar(productName);
          console.log("Product quantity updated successfully.");
        } else {
          if(cusId){
            // Display a notification if the quantity exceeds the limit
            toast.error("You cannot add more than 10 items of this product to the cart.")
          }
        }
      } else {
        // If the product is not in the cart, create a new entry
        const date = new Date();
        const id = date.getTime().toString();
  
        const newCartItem = {
          ID: id,
          ADDED_DATE: date,
          ADDED_DATE_MILI: id,
          PRODUCT_NAME: productName,
          PRODUCT_ID: productId,
          CUSTOMER_ID: cusId,
          CUSTOMER_NAME: custName,
          CUSTOMER_PHONE: custPhone,
          PRODUCT_QTY: productQty
        };
        
        myCartTotalProductQty += productQty;
        console.log(`${myCartTotalProductQty}32dnsfkjsn`);
  
        // setCartTotalProductQty((prev) => prev + productQty);
        await setDoc(doc(firestore, "CART", id), newCartItem, { merge: true });

        addToCartSnackBar(productName);
        
        console.log("Product added to cart successfully.");
      }
      
      // Notify listeners or update state if necessary
      // (e.g., using a React hook or context update)
      
    } catch (e) {
      console.error("Error adding to cart:", e);
    }
  }


  function addToCartSnackBar(productName) {
  
    if(cusId){
      toast.success(`Added ${productName} to cart`)
    }

  }

  useEffect(() => {
    // Store count in localStorage whenever it changes
    localStorage.setItem('productCount', count);
  }, [count]); // Dependency on `count` ensures it updates whenever the count changes
  
  useEffect(() => {
    // Retrieve stored count value from localStorage, default to 1 if not found
    const savedCount = localStorage.getItem('productCount');
    if (savedCount) {
      setCount(Number(savedCount));
    } else {
      setCount(1); // Default to 1 if no saved value exists
    }
  }, []);

  useEffect(() => {
    // When the product changes (e.g., productId or productName changes), reset count to 1
    setCount(1);
    localStorage.setItem('productCount', 1); // reset in localStorage as well
  }, [productId]); // Depend on productId to reset count when switching products
  
  
  
  return (

    <>
   {isTab ? <Header /> : <HeaderWeb />}
   

    <div className="count">

      <div className="tea-number">
        <img src={Assets.Line} alt="" className="round" />
        <img src={itemImg } alt="" className="tea" />
      </div>
      <div className="count-box">
        <div className="web-content">
          <h6>
           {productName} <span></span>
          </h6>
          <span>Unlock luck with every tea pack you pick!</span>
          <p>
            Experience the exceptional taste of Bochetea, handpicked from
            Wayanad's Boche 1000 Acres Tea Plantation. Our tea embodies the
            region's splendor with its rich aroma and taste. Enjoy the premium
            quality of Bochetea, a blend of tradition and excellence.
          </p>
          <h6>INR  {price} </h6>
        </div>
        <div className="count-web">
          <h2>₹ {totalPrice}</h2>
          <h6>
            <span>{count}</span> PACKETS X ₹{price}
          </h6>
        </div>
      
  
        <div className="mobile-view">
          <div className="couter">
            <div
              onClick={() => handleClick("decrement")}
              className={clickedButton === "decrement" ? "clicked" : ""}
            >
              <FaMinus />
            </div>
            <p>{count}</p>
            <div
              onClick={() => handleClick("increment")}
              className={clickedButton === "increment" ? "clicked" : ""}
            >
              <FaPlus />
            </div>
          </div>
            {isMobile && <div className="text_content_wrapper">
              <p>Unlock luck with every tea pack you pick!</p>
              <span> Experience the exceptional taste of Bochetea, handpicked from
                Wayanad's Boche 1000 Acres Tea Plantation. Our tea embodies the
                region's splendor with its rich aroma and taste. Enjoy the premium
                quality of Bochetea, a blend of tradition and excellence.</span>
            </div>}

        </div>
        <div className="web-counter">
          <div className="couter-web">
            <div
              onClick={() => handleClick("decrement")}
              className={`inc ${
                clickedButton === "decrement" ? "clicked" : ""
              }`}
            >
              <FaMinus />
            </div>
            <p>{count}</p>
            <div
              onClick={() => handleClick("increment")}
              className={`dec ${
                clickedButton === "increment" ? "clicked" : ""
              }`}
            >
              <FaPlus />
            </div>
          </div>
        </div>
        {/* {isMobile && ( */}

          <div className="btn_container__">
                     <button className="bbttn_add_to_cart" onClick={()=>  addToCartFn(cusId,custName, custPhone, productId,productName, productQty )}>
            Add to cart
          </button>

          <button className="bbttn" onClick={() => handleButtonClick(singleproductTotalWeight)}>
            Buy Now
          </button>
          </div>

        {/* )} */}
      </div>
    </div>

    <Footer/>
    </>
  );
 
};


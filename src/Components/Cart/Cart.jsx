import React, { useContext, useEffect, useState } from 'react'
import "./Cart.css"
import { Assets } from '../Assets/Assets'
import HeaderWeb from '../Header/HeaderWeb'
import Footer from '../../Pages/Footer/Footer'
import { Header } from '../Header/Header'
import { collection, getDocs, query, where ,deleteDoc,updateDoc, increment, doc} from 'firebase/firestore';
import { firestore } from "../../firebase";
import {  useNavigate } from 'react-router-dom'
import { toast } from "sonner";
import { CiTrash } from "react-icons/ci";
import { MdRemoveShoppingCart } from "react-icons/md";
import { useCount } from '../../Context/Context'


const Cart = () => {

    const [isMobile, setIsMobile] = useState(window.innerWidth > 480);

    const custId = localStorage.getItem("loginUserId");
    const [cartViewList, setCartViewList] = useState([]);
    const navigate = useNavigate();

    const [totalWeight, setTotalWeight] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0)

    const {ready,setReady} = useCount()

    useEffect(() => {
      console.log(custId,cartViewList,"Nikhilllll")
    })


    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth > 870);
        };
    
        window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);


      const  handleNavigateBack = ()=> {

        navigate(-1)
        // navigate('/home')
      }

      // console.log(cartViewList, "cart vie lsithlllllllllllllllllllllllllllllllllllllllllllllll")
      //handle buy now ////////////////////////////////////////////////////////////////////

      const handleBuyNow = (totalWeight , totalQuantity ,cartViewList )=> {
        
       totalQuantity = cartViewList.reduce((sum, item) => sum + item.quantity, 0);
       
        const grandTotal = parseFloat(getTotalPrice());

        if(totalQuantity !== 0 ){
          
          navigate( "/paymentweb", { state: { from : "cart", totalWeight : totalWeight , totalQuatity: totalQuantity, cartState: cartViewList , grandTotal: grandTotal }})

        }else{
          toast.error("cart can not be empty")
        }
      }


  //  let itemTotalWeight;

      useEffect(() => {
        // console.log(itemTotalWeight, "llllllllllllllllllllllllllllllllllllllllllllllll")
        
      }, [])

      // cart item fetch funciton ................................................................

      const fetchCart = async (custId) => {
        try {
          setCartViewList([]); // Clear current cart view list
    
        //   Fetch cart items for the specified customer
          const cartSnapshot = await getDocs(
            query(collection(firestore, 'CART'), where('CUSTOMER_ID', '==', custId))
          );

    
          if (cartSnapshot.empty) return;
    
          // Array to hold promises for concurrent fetching
          const futures = [];
          let totalWeightForCustomer = 0;
          let totalQuantityForCustomer = 0;

    
          cartSnapshot.docs.forEach((cartDoc) => {

            const cartDocId = cartDoc.id;
            const productId = cartDoc.data().PRODUCT_ID;
            const productQty = cartDoc.data().PRODUCT_QTY;

            // console.log(cartDocId, productId, productQty, "llllllllllllllllllllllllllll")
    
            const allocatedTicketFuture =  getDocs(
              query(
                collection(firestore, 'CHANNEL_PRODUCTS'),
                where('CHANNEL_ID', '==', '8'),
                where('PRODUCT_ID', '==', productId)
              )
            );
    
            // Fetch product details
            const productFuture = getDocs(
              query(
                collection(firestore, 'PRODUCTS'),
                where('PRODUCT_ID', '==', productId)
              )
            );

            console.log(productFuture, "dddddddddddddddddddddddddddd")
    
            // Process both requests concurrently
            futures.push(
              Promise.all([allocatedTicketFuture, productFuture]).then(([proAllocatedSnapshot, productSnapshot]) => {
                let allocatedTicket = 0;
                if (!proAllocatedSnapshot.empty) {
                  allocatedTicket = proAllocatedSnapshot.docs[0]?.data().ALLOCATED_TICKET || 0;
                 
                }
    
                if (productSnapshot.empty) return;
    
                const productData = productSnapshot.docs[0].data();
                const productImageList = Array.isArray(productData.IMAGES)
                  ? productData.IMAGES.map((item) => item.toString())
                  : [];

                //   console.log(productData, productImageList, "kkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
    
                const price = typeof productData.PRICE === 'number' ? productData.PRICE : 0.0;
                const grossWeight = typeof productData.GROSS_WEIGHT === 'number' ? productData.GROSS_WEIGHT : 0.0;
                const sgst = parseFloat(productData.SGST) || 0.0;
                const cgst = parseFloat(productData.CGST) || 0.0;
                const igst = parseFloat(productData.IGST) || 0.0;

                console.log(price, "price ", grossWeight, "groass wight", sgst, "sgst", cgst, "cgst", igst, "igst" , "lllllllllkkkkkkkkkkkkkkjjjjjjjjjjjjjj")
    
  // Calculate item weight based on quantity
  const itemTotalWeight = grossWeight * productQty;
  totalQuantityForCustomer += productQty;



  console.log(itemTotalWeight, "itemTotalWeight......................................");

    // Add item weight to the total weight for the customer
    totalWeightForCustomer += itemTotalWeight;


    // console.log(totalWeightForCustomer, "totalWeightForCustomer..................................")




                setCartViewList((prevList) => {
                    const itemExists = prevList.some((cartItem) => cartItem.productId === productId);
                    if (!itemExists) {
                      return [
                        ...prevList,
                        {
                          cartDocId,
                          id: productSnapshot.docs[0].id,
                          productId,
                          name: productData.NAME || '',
                          productQty,
                          productImageList,
                          price,
                          grossWeight,
                          allocatedTicket,
                          sgst,
                          cgst,
                          igst,
                        },
                      ];
                    }
                    return prevList; // If item already exists, return the previous list unchanged
                  });
                  



                console.log(cartViewList, "cart view list ...........................");
              })
            );
          });
    
          // Wait for all promises to complete
          await Promise.all(futures);


        // Set the total weight for the customer
        setTotalWeight(totalWeightForCustomer);
        setTotalQuantity(totalQuantityForCustomer);
        console.log(`Total weight for customer ${custId}:`, totalWeightForCustomer);
        console.log(`Total qty for customer ${custId}:`, totalQuantityForCustomer);

    
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      };

      useEffect(() => {
        if (custId) {
          setCartViewList([]); // Clear the list before fetching to avoid duplication
          fetchCart(custId);
        }
      }, [custId]);



        // Function to calculate the total price and total item count
  const getTotalPrice = () => {
    return cartViewList.reduce((total, item) => total + (item.price * item.productQty), 0).toFixed(2);
  };

  const getTotalItemCount = () => {
    return cartViewList.reduce((count, item) => count + item.productQty, 0);
  };

  const deliveryCharge = 0; // Modify if you have dynamic delivery charge logic




      // cart item remove function 

      
      const deleteFromCart = async (cartId) => {
        try {
          const indexToRemove = cartViewList.findIndex((item) => item.cartDocId === cartId);
          if (indexToRemove === -1) {
            console.log('Item not found in the cart');
            return;
          }
      
          const removedItem = cartViewList[indexToRemove];
          const updatedCartList = [...cartViewList];
          updatedCartList.splice(indexToRemove, 1);
      
          // Update the React state
          setCartViewList(updatedCartList);
          // notifyUpdate();
          // console.log("removed succrss fuly ...................")
      
          // Delete the document from Firestore
          await deleteDoc(doc(firestore, 'CART', cartId));
          // console.log("delted item from dat base.....................................")
          console.log(`Deleted item from cart: ${removedItem.productName}`);
        } catch (e) {
          console.error("Error deleting item from cart:", e);
        }
      };
      

      // console.log(cartViewList, "cart view list .....................")



      //cart increament and decrement function 

  
const incrementAndDecrementCount = async (from, docId, setCartViewList, cartViewList) => {

  try {

    setReady(!ready)
    console.log(ready,"readyreadyyyy")
    const index = cartViewList.findIndex((item) => item.cartDocId === docId);

    if (index === -1 ) {
      console.log('Item not found in the cart');
      return;
    }

    const currentQty = cartViewList[index].productQty;
    if (from === "INCREMENT" && currentQty >= 10) {
      toast.error("Cannot increment beyond 10");
      console.log('Cannot increment beyond 10');
      return;
    }

    const updateData = {
      PRODUCT_QTY: from === "INCREMENT" ? increment(1) : increment(-1),
    };

    // Update Firestore document
    await updateDoc(doc(firestore, 'CART', docId), updateData);

    // Update the local state

    const updatedCartList = [...cartViewList];
    if (from === "INCREMENT") {
      updatedCartList[index].productQty += 1;
    } else {
      updatedCartList[index].productQty -= 1;
    }

    // Check if the quantity is zero and remove the item if needed
    if (updatedCartList[index].productQty === 0) {
      await deleteDoc(doc(firestore, 'CART', docId));
      updatedCartList.splice(index, 1);
      console.log('Item removed from cart');
    }

    setCartViewList(updatedCartList);
   
  } catch (e) {
    console.error('Error incrementing count:', e);
  }
};





  return (

    <>
    {isMobile ?<HeaderWeb/> : <Header/>}
    
  
    <div className='cart' >
        <div className="header_cart">
            <div onClick={handleNavigateBack} className="back_arrow">
                <img src={Assets.arrow_back} alt="" />
            </div>
            <h6>My Cart</h6>
        </div>

        <div className="cart_contents_wrapper">


            <div className="cart_item_container">

            {cartViewList?.length > 0 ? (

              cartViewList.map((item, index) => (
                <div key={index} className="cart_item_container_item">
                  <div className="item_contents">
{/* 
                    <div className="check_cart">
                      <img className='check_' src={Assets.check_cart} alt="Check" />
                    </div> */}

                    <div className="item_img_cart">
                      <img src={item.productImageList[0] || Assets.pacck} alt="Product" />
                    </div>

                    <div className="section_3_item_container">
                      <div className="item_text_wrapper">
                        <h4>{item.name}</h4> {/* Ensure 'name' is part of the state object */}
                        <div onClick={() => deleteFromCart(item.cartDocId, item.productQty)} className="btn_x">
                          <img src={Assets.close_icon} alt="Remove" />
                          <span>Remove</span>
                        </div>
                      </div>
                      <p>{item.description || 'Best Quality Product'}</p> {/* Use a fallback if 'description' doesn't exist */}
                      <h6>₹{item.price.toFixed(2)}</h6>

                      <div className="item_footer_items">
                        <span>{item.grossWeight < 1 ? `${item.grossWeight * 1000}g` : `${item.grossWeight}kg`}</span>

                        <div className="item_count_div">
                          <div style={{ cursor: 'pointer' }} onClick={() => incrementAndDecrementCount("DECREMENT", item.cartDocId, setCartViewList, cartViewList)} className="icon_count_div">
                            <span>
                              {item.productQty === 1 ? <CiTrash /> : '-'} {/* Conditional rendering */}
                            </span>
                          </div>
                          <p>{item.productQty}</p>
                          <div style={{ cursor: 'pointer' }} onClick={() => incrementAndDecrementCount("INCREMENT", item.cartDocId, setCartViewList, cartViewList)} className="icon_count_div">
                            <span >+</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="line_item"></div>
                  <span>Seller: {item.sellerName || 'boche group'}</span> {/* Ensure 'sellerName' is part of the state object */}
                </div>
              ))

            ) : (
              <div className='cart_item_container_item'>
              <div>
                <div>Empty Cart</div>
              </div>
              <div>
                <MdRemoveShoppingCart size={50} color="gray" />
              </div>
            </div>
            
            )}


{/*                 
                <div className="cart_item_container_item">
                    <div className="item_contents">

                        <div className="check_cart">
                            <img className='check_' src={Assets.check_cart} alt="" />
                        </div>

                        <div className="item_img_cart">
                            <img src={Assets.pacck} alt="" />
                        </div>

                        <div className="section_3_item_container">

                      
                        <div className="item_text_wrapper">
                          
                                <h4>Boche Tea powder</h4> <div className="btn_x"><img src={Assets.close_icon} alt="" /> <span>Remove</span>  </div>
                            
                        </div>
                        <p>Best Quality Product</p>
                        <h6>₹40</h6>

                        <div className="item_footer_items">
                        <span>100g</span>

                           <div className="item_count_div">

                             <div className="icon_count_div">
                               <span>-</span>
                            </div> 
                            
                            <p> 10 </p> 

                             <div className="icon_count_div">
                            <span>+</span>
                            </div> 

                            </div>

                        </div>

                        </div>


                        </div>

                        <div className="line_item">

                        </div>

                        <span>Seller:boche group</span>
                       
                    
                </div> */}

              
            </div>



            <div className="cart_sub_total">
                <h4>Subtotal </h4>
                
                <div className="price_container">
                <h6>Price Details ({getTotalItemCount()} item{getTotalItemCount() !== 1 ? 's' : ''})</h6>
                    {/* <h6>Price Details ({getTotalItemCount()})</h6> */}
                    <div className="product_price">
                        <p>Total Product Price</p>  <span>₹{getTotalPrice()}</span>
                    </div>
                    <div className="product_price">
                        <p>Delivery Charges</p>  <span> { deliveryCharge ? deliveryCharge : 0 } </span>

                    </div>

                    <div className="line_item">

</div>

                    <div className="order_total">
                        <p>Order Total</p>
                          <span>₹{(parseFloat(getTotalPrice()) + deliveryCharge).toFixed(2)}</span>
                    </div>


                </div>



                
                <button onClick={()=> handleBuyNow( totalWeight , totalQuantity,cartViewList, )} className="buyNow_total">
                        Buy now
                    </button>
            </div>

        </div>

    </div>

    <Footer/>
    </>
  )
}

export default Cart
import React, { useEffect, useState } from 'react'
import "./MultiList.css"
import { Assets } from "../Assets/Assets";
import { firestore } from "../../firebase";
import { collection, getDocs, query, where, doc,onSnapshot, setDoc, updateDoc} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';



const MultiList = () => {

    const [multiProductList, setMultiProductList] = useState([]);
    const [loader,setLoader] = useState(false)

    const navigate =  useNavigate(); 

    const handleNavigation = ( id, name, itemImg , price, productWeight,allocatedTicket, igst, sgst, cgst )=> {

      navigate('/count', { state: { productId:id , productName : name , itemImg: itemImg , price : price , productWeight: productWeight,allocatedTicket : allocatedTicket, igst : igst, sgst: sgst , cgst: cgst } });
    }


          // Fetch product function -----------------------------------------------------------------------------


          const fetchMultiProduct = () => {

            try {

              setLoader(true);
          
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
                  setMultiProductList(newMultiProductList);
                } else {
                  setMultiProductList([]);
                }
          
                setLoader(false);
              });
          
              // Return unsubscribe function to stop the real-time listener when needed
              return unsubscribe;
            } catch (error) {
              console.error("Error fetching real-time products:", error);
              setLoader(false);
            }
          };
          
          
    
      // Fetch products on component mount
      useEffect(() => {
        fetchMultiProduct();
      }, []);

      console.log(multiProductList, "multiproducts list ............")


  return (

    <div className='multiList'>
        <div className="multiList_wrapper">

        { loader ? (
          <div className="loader-multi" style={{textAlign: "center"}}>
          <ClipLoader color="#36d7b7" size={50} />
        </div>
        ) : (

          multiProductList.map((product) => (
            <div className="multi_item" onClick={() => handleNavigation(product.id, product.name, product.productImageList[0], product.price, product.grossWeight,product.allocatedTicket, product.igst, product.sgst, product.cgst)} key={product.id}>
              <div className="item_img_div">
                <img
                  src={product.productImageList[0] || Assets.pacck}
                  alt={product.name}
                  onError={(e) => { e.target.onerror = null; e.target.src = Assets.pacck; }} // Fallback to a default image
                />
              </div>
              <h3>{product.name}</h3>
              <div className="price_gram_wrapper">
                <span>{product.grossWeight < 1 ? `${product.grossWeight * 1000}g` : `${product.grossWeight}kg`}</span>
                <h6>₹{product.price}</h6>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MultiList
// ProductContext.js
import React, { createContext, useContext, useState ,useEffect} from 'react';
import { ProductModel } from '../ModelClasses/product_model';


const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [productData, setProductData] = useState({
    productId: '',
    productName: '',
    productImages: [],
    productPrice: 0,
    loginUserName: '',
    loginUserId: '',
    loginUserType: '',
    loginUserPhone: '',
    loginUserPlace: '',
    loginUserPhoto: ''
  });




  useEffect(() => {
    // Load stored data from localStorage on component mount
    const storedProductData = JSON.parse(localStorage.getItem('productData'));
    if (storedProductData) {
      setProductData(storedProductData);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('productData', JSON.stringify(productData));
  }, [productData]);

  // Save state to localStorage whenever productData changes
  
  return (
    <ProductContext.Provider value={{ productData, setProductData }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);

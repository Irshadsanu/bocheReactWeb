import React, { useEffect, useRef, useState } from "react";
import "./ConfirmedOrder.css";
import { Assets } from "../Assets/Assets";
import { MdDone } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import downloadImg from "../Assets/Images/download (2).png";
import invoLogo from "../Assets/Images/Layer 1 4.png";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { FaAngleLeft } from "react-icons/fa6";

const ConfirmedOrder = () => {

  const location = useLocation();
  const {
    orderId,
    orderDate,
    orderPrice,
    productQuantity,
    status,
    productImage,
    productPrice,
    productWeight,
    multiProOrder,
    deliveryRate,
    type,
  } = location.state || {};

console.log(   orderId,
  orderDate,
  orderPrice,
  productQuantity,
  status,
  productImage,
  productPrice,
  productWeight,
  multiProOrder,
  deliveryRate,
  type,"haiiii")
  
  const invoiceRef = useRef();
  const state = localStorage.getItem("loginUserPlace");
  const cusId = localStorage.getItem("loginUserId");
  const MobNO = localStorage.getItem("loginUserPhone");
  const [lastUsedDeliveryName, setUsedDeliveryName] = useState();

  const [lastUsedDeliveryAddress, setLastUsedDeliveryAddress] = useState();
  const [ticketId, setTicketId] = useState();

  const [hasOrder, setHasOrder] = useState(false);
  const navigate = useNavigate();

  console.log(location, "location...........");

  const fetchLastUsedDeliveryInfo = async (cusId) => {
    const customerRef = doc(firestore, "CUSTOMERS", cusId);
    const customerSnapshot = await getDoc(customerRef);

    if (customerSnapshot.exists()) {
      const data = customerSnapshot?.data();
      console.log(data, "data ...............");
      setUsedDeliveryName(data?.LAST_USED_USER_NAME || "");
      setTicketId(data?.id || "");
      const formatedAddress = (data?.LAST_USED_USER_ADDRESS || "")?.replace(
        /,/g,
        ", "
      );
      setLastUsedDeliveryAddress(formatedAddress);
      console.log(formatedAddress, "midfied ...........");
    } else {
      return {
        lastUsedDeliveryName: "",
        ticketId: "",
        lastUsedDeliveryAddress: "",
      };
    }
  };

  // console.log(lastUsedDeliveryName, "lastUsedDeliveryName");
  // console.log(ticketId, "ticketId");
  // console.log(lastUsedDeliveryAddress, "lastUsedDeliveryAddress");

  useEffect(() => {
    fetchLastUsedDeliveryInfo(cusId);
  }, [cusId]);

  useEffect(() => {
    if (location) {
      setHasOrder(!setHasOrder);
    }
  }, [location]);

  const formattedOrderDate = orderDate
    ? format(new Date(orderDate), "PPpp")
    : "";

  const downloadPdf = async () => {
    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, { scale: 2 });

      const imgData = canvas.toDataURL("image/png");

      // Get viewport height and calculate the proportional width
      const pdfHeight = window.innerHeight;
      const pdfWidth = (canvas.width * pdfHeight) / canvas.height;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };


  //order datails for mapping for multi product order

  // const productsArray = 
  // console.log(productsArray,"multiprooooo");
  

  //   const gst = (location.state?.productPrice * 5) / 100;

  const gstRate = 5; // GST rate of 5%

  // Calculate the original amount and GST amount
  const originalAmount = productPrice / (1 + gstRate / 100);
  const gstAmount = productPrice - originalAmount;

  console.log("Original Amount (Excluding GST):", originalAmount.toFixed(2));
  console.log("GST Amount:", gstAmount.toFixed(2));

  // const totalGst = location.state?.productQuantity * gstAmount;
  const totalGst = multiProOrder.reduce((sum, product) => {
    const igst = 
      (Number(product.productPrice) * Number(product.itemQuantity)) - 
      Number(product.productPriceWithoutGst);
    return sum + igst;
  }, 0);

  // Calculate  the totals for pdf invoice
  const totalWithoutGst  = multiProOrder.reduce((total,item) => total + item.productPriceWithoutGst, 0) 

  const theSubTotal = totalWithoutGst

  const deliveryCharge = location.state?.deliveryRate || 0;

  const grandTotal = theSubTotal + totalGst + deliveryCharge;

  console.log(theSubTotal,deliveryCharge,grandTotal, "invoiceeeeeee")

  const sgst = totalGst / 2;
  const cgst = totalGst / 2;




  const totalPurchase =
    location.state?.productPrice * location.state?.productQuantity;
  const teatotal =
    location.state?.productPrice * location.state?.productQuantity - totalGst;
  const subTotal = teatotal + deliveryRate;
  //   const formateDate = (date) => {
  //     const day = String(date.getDate()).padStart(2, 0);
  //     const month = String(date.getMonth() + 1).padStart(2, 0);
  //     const year = date.getFullYear();

  //     return `${day}/${month}/${year}`;
  //   };

  const onBackInOrder = () => {
    navigate("/order");
  };
  const formateDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      return "Invalid Date";
    }

    const day = String(date.getDate()).padStart(2, "0"); // Corrected padStart with '0' (as a string)
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  console.log(multiProOrder[0].productWeight,"singleweighttt")

  return (

    <div className="confirmedorder">
      {/* <FaAngleLeft style={{ fontSize: "30px" }} onClick={onBackInOrder} /> */}


      {multiProOrder.length === 1 ? (

        <div className="top-tea">
          <div className="tea-left-top">
            <img src={multiProOrder[0].productImage ? multiProOrder[0].productImage : "img"} alt="Product" />
          </div>
          <div className="tea-top-total">
            {/* <p>
              {multiProOrder[0].productWeight
                ? multiProOrder[0].productWeight < 1
                  ? `${multiProOrder[0].productWeight * 1000}g`
                  : `${multiProOrder[0].productWeight}kg`
                : "nil"}
            </p> */}
            <p>
              {multiProOrder[0].productName}
            </p>
            <p>
              {multiProOrder[0].itemQuantity ? multiProOrder[0].itemQuantity : "nil"} PACKETS X ₹
              {multiProOrder[0].productPrice ? multiProOrder[0].productPrice : "nil"}
            </p>
          </div>
        </div>

      ) : (

        <div className="multi-order-data">
          <div className="multi-image-wrapper">
            {multiProOrder.map((pro, index) => (
              <div className="multi-image-container" key={index}>
                <img src={pro.productImage} alt="pro images" />
              </div>
            ))}
          </div>

          <div className="multi-prodata-wrapper">
            {multiProOrder.map((pro, index) => (
              <div className="multi-prodata" key={index}>
                <p>
                  {pro.productName} <span>({pro.itemQuantity}),</span>
                </p>
              </div>
            ))}
          </div>
        </div>
        )}


      {type === "Pick Up From Store" ? (
        <>
          <div className="confirmed-details">
            <div className="detail-box">
              <div className={`left-line`}>
                <div className="tick">
                  <MdDone />
                </div>
                <div className="line"></div>
              </div>
              <div className="right-detail">
                <h6> Order Confirmed {formattedOrderDate} </h6>
                <p>Your order has been placed.</p>
              </div>
            </div>
            <div className="detail-box">
              <div className="left-line">
                <div className="tick">
                  <MdDone />
                </div>
                <div
                  className={`${
                    location.state?.status === "DELIVERD" ? "line" : "grey-line"
                  }`}
                ></div>
              </div>
              <div className="right-detail">
                <h6>Product now available in the store</h6>
                <p>Your order has been Shipped.</p>
              </div>
            </div>
            <div className="detail-box">
              <div className="left-line">
                <div
                  className={`${
                    location.state?.status === "DELIVERD" ? "tick" : "grey-tick"
                  }`}
                >
                  <MdDone />
                </div>
              </div>
              <div className="right-detail">
                {status === "DELIVERD" ? (
                  <h6>Deliverd </h6>
                ) : (
                  <h6>Not Collected </h6>
                )}
              </div>
            </div>
          </div>

          {/* -------------------------------------------- end of pick from store */}
        </>
      ) : (
        <>
          <div className="confirmed-details">
            <div className="detail-box">
              <div className={`left-line`}>
                <div className="tick">
                  <MdDone />
                </div>
                <div className="line"></div>
              </div>
              <div className="right-detail">
                <h6> Order Confirmed, {formattedOrderDate} </h6>
                <p>Your order has been placed.</p>
                <p>Your item has been picked up by courier partner</p>
              </div>
            </div>
            <div className="detail-box">
              <div className="left-line">
                <div
                  className={` ${
                    location.state?.status === "DELIVERED" ||
                    location.state?.status === "SHIPPED"
                      ? "tick"
                      : "grey-tick"
                  }`}
                >
                  <MdDone />
                </div>
                <div
                  className={`${
                    location.state?.status === "DELIVERED"
                      ? "line"
                      : "grey-line"
                  }`}
                ></div>
              </div>

              <div className="right-detail">
                {status === "SHIPPED" || status === "DELIVERED" ? (
                  <h6>Shipped </h6>
                ) : (
                  <h6>Not Collected </h6>
                )}

                {/*                
                    <h6>Shipped, {formattedOrderDate}</h6>
                    <p>Your order has been Shipped.</p> */}

                {/* <h6>Shipped, 1pril 15, 2024</h6>
            <p>Your order has been Shipped.</p>
            <span>Tue, 16th Apr - 10:05 am</span> */}
              </div>
            </div>
            <div className="detail-box">
              <div className="left-line">
                {/* <div className={`tick${ type === "Delivery to Your Address" ? "grey-tick" : location.state?.status === "DISPATCHED" ? " tick" : "" }`} >
                      <MdDone />
                    </div> */}
                <div
                  className={` ${
                    location.state?.status === "DELIVERED"
                      ? "tick"
                      : "grey-tick "
                  }`}
                >
                  <MdDone />
                </div>
                {/* <div className={`line${type === "Delivery to Your Address" ? "grey-line" : "" }`} ></div> */}
              </div>

              <div className="right-detail">
                {location.state?.status === "DELIVERED" ? (
                  <p>Your order has been Delivered.</p>
                ) : (
                  <h6>Not Collected</h6>
                )}

                {/* <h6>Delivered on April 20, 2024</h6>
            <p>Your order has been Delivered.</p>
            <span>Sat, 20th Apr - 12:05 pm</span> */}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="price-details">
        <h6>Price Details</h6>
        <div className="price">
          <h6>Total Product Price</h6>
          {/* <h6>₹ {location.state?.orderPrice - totalGst.toFixed(2)}</h6> */}
          <h6>₹ {location.state?.orderPrice}</h6>
        </div>
        <div className="price">
          <h6>Total No of items</h6>
          <h6>{location.state?.productQuantity}</h6>
        </div>
        <div className="price">
          <h6>Delivery Charge </h6>
          <h6 className="freee"> {deliveryRate} </h6>
        </div>

        {state !== "Kerala" ? (
          <div className="gst_summery">
            <h6>IGST (5%)</h6>
            <h6>₹ {totalGst.toFixed(2)}</h6>
          </div>
        ) : (
          <>
            <div className="gst_summery">
              <h6>CGST (2.5%)</h6>
              <h6>₹ {cgst.toFixed(2)}</h6>
            </div>
            <div className="gst_summery">
              <h6>SGST (2.5%)</h6>
              <h6>₹ {sgst.toFixed(2)}</h6>
            </div>
          </>
        )}
        <div className="total">
          <h6>Total </h6>
          <h6>₹ {location.state?.orderPrice + deliveryRate}</h6>
        </div>
        <div className="invoice_container" onClick={downloadPdf}>
          <p>Product Invoice</p>
          <div className="download">
            <img src={downloadImg} alt="Download" />
            <h6>Download</h6>
          </div>
        </div>
      </div>

      {/* Hidden Invoice Component for PDF generation */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <div ref={invoiceRef}>
          {/* <div className="invoice_main">
            <div className="invoice_head">
              <h4>Invoice</h4> <img src={invoLogo} alt="Invoice Logo" />
            </div>
            <h6># {location.state?.orderId}</h6>
            <div className="invoice_user">
              <p>Bill to</p>
              
              <p>{lastUsedDeliveryName ? lastUsedDeliveryName : "Name"}</p>
              <div className="address_div">
              <p>
                {" "}
                {lastUsedDeliveryAddress
                  ? lastUsedDeliveryAddress
                  : "Address"}{" "}
              </p>
              </div>
             
            </div>
            <div className="items_table">
              <div className="table_column_head">
                <div className="table_column_head_items">Items</div>
                <div className="table_column_head_items">Prize</div>
                <div className="table_column_head_items">Quantity</div>
                <div className="table_column_head_items">Amount</div>
              </div>
              <div className="table_column_Items_div">
                <div className="table_column_items">Tea Packet</div>
                <div className="table_column_items">
                  ₹{location.state?.productPrice}
                </div>
                <div className="table_column_items">
                  {location.state?.productQuantity} x{" "}
                  {location.state?.productPrice}
                </div>
                <div className="table_column_items">
                  ₹{location.state?.orderPrice}
                </div>
              </div>
            </div>
            <div className="table_column_Items_divvvv">
              <div className="table_column_itemsss">Total</div>
              <div className="table_column_itemsss">
                ₹{location.state?.orderPrice}
              </div>
            </div>
            <div className="invoice_TC">
              <span className="invoice_TC_text">Terms & Conditions</span>
              <p>Lorem Ipsum is simply dummy text of the printing and
              typesetting industry.</p>
            </div>

            <div className="final_text">
              <span> 
                Powered by <img src={bocheText} alt="" />
              </span>
              <p>Lorem Ipsum is simply dummy text of the printing and</p>
              <p>typesetting industry.</p>
            </div>
          </div>
 */}

          {/* ------------------------------------------------ ----------------------------------------new  */}

          <div className="invoice_main">
            <div className="invoice_head">
              <img src={invoLogo} alt="Invoice Logo" />
              <h4>INVOICE</h4>
            </div>
            <div className="office_addrss_container">
              <div className="Office_address_1">
                <h6>PATRONYMIC TECHNOLOGIES AND INDUSTRIES PRIVATE LIMITED</h6>
                <span>Door No.52/1060,Old-21-349-28A</span>
                <span>West Fort Tower</span>
                <span>Ayyanthole Road</span>
                <span>Thrissur</span>
                <span>Thrissur,Kerala ,680004</span>

                <span>GSTIN:32AANCP1729R2ZT</span>
              </div>

              <div className="Office_address_2">
                <div>.</div>
                <span>Dated: {formateDate(location.state?.orderDate)}</span>
                <span>Invoice No.: {location.state?.orderId}</span>
                <span>Customer Id: {cusId}</span>
                <span>Purchase Order No.:</span>
                <span>Payment Due By:</span>
              </div>
            </div>

            <div className="line_horizondal"></div>

            <div className="office_addrss_container">
              <div className="Office_address_1_sub">
                <h6>Bill To</h6>
                <span>Customer Name: {lastUsedDeliveryName} </span>
                <span>Customer Address: {lastUsedDeliveryAddress} </span>

                <p>Phone Number: {MobNO}</p>

                <p>Email id: demo@gmail.com</p>
              </div>

              <div className="Office_address_2_sub">
                <h6>
                  <p>Ship To</p>(If Different)
                </h6>
                <span>Customer Name</span>
                <span>Customer Address:</span>
                <span>Phone Number:</span>
                <span>Email Id:</span>
              </div>
            </div>

            <table className="invoice-table">
              <thead className="tab_hgt">
                <tr>
                  <th className="min_width">SR.No.</th>
                  <th className="high_width">Description</th>
                  <th className="min_width">HSN/SAC</th>
                  <th className="min_width">Quantity</th>
                  <th className="normal_width">Rate(INR)</th>
                  {state !== "Kerala" ? (
                    <th className="normal_width">IGST (5%)</th>
                  ) : (
                    <>
                      <th className="normal_width">SGST(2.5%)</th>
                      <th className="normal_width">CGST(2.5%)</th>
                    </>
                  )}
                  <th className="normal_width">Amount(INR)</th>
                </tr>
              </thead>
              <tbody style={{ height: "150px" }}>

                {multiProOrder.map((product,index) => (

                <tr>
                  <td className="min_width">{index + 1}</td>
                  <td className="high_width">{product.productName}</td>
                  <td className="min_width"></td>
                  <td className="min_width">{product.itemQuantity}</td>
                  <td className="normal_width"> {product.productPriceWithoutGst.toFixed(2)} </td>
                  {state !== "Kerala" ? (
                    <td className="normal_width">  {(
                      (Number(product.productPrice) * Number(product.itemQuantity)) - 
                      Number(product.productPriceWithoutGst)
                    ).toFixed(2)}</td>
                  ) : (
                    <>
                      <td className="normal_width"> {sgst.toFixed(2)}</td>
                      <td className="normal_width"> {cgst.toFixed(2)}</td>
                    </>
                  )}
                    <td className="normal_width">
                      {(Number(product.productPrice) * product.itemQuantity).toFixed(2)}
                    </td>

                </tr>
                ))}

                {/* <tr>
                  <td className="min_width">2</td>
                  <td className="high_width">Delivery Charge </td>
                  <td className="min_width"></td>
                  <td className="min_width">0</td>
                  <td className="normal_width">00.00</td>
                  <td className="normal_width">00.00</td>
                  <td className="normal_width">
                    {location.state?.deliveryRate}.00
                  </td>
                </tr> */}

              </tbody>
            </table>

            <div className="table_container">
              <table className="invoice-table_2">
                <tbody>
                  <tr>
                    <td className="declaration" colSpan="2">
                      <strong>Declaration</strong>
                      <br />
                      We declare that this invoice shows the actual price of the
                      goods described and that all particulars are true and
                      correct.
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="table_3">
                <tbody>
                  <tr className="total_coulm_container">
                    <td colSpan="2"></td>
                    <td className="right-align">Sub Total</td>
                    <td className="right-align"> {totalWithoutGst.toFixed(2)} </td>
                  </tr>
                  <tr className="total_coulm_container">
                    <td colSpan="2"></td>
                    <td className="right-align">GST (5%)</td>
                    <td className="right-align"> {totalGst.toFixed(2)} </td>
                  </tr>
    
                  <tr className="total_coulm_container">
                    <td colSpan="2"></td>
                    <td className="right-align">Delivery Charge</td>
                    <td className="right-align">{location.state?.deliveryRate ? location.state.deliveryRate : "0.00"}</td>
                  </tr>

                  <tr className="total_coulm_container">
                    <td colSpan="2"></td>
                    <td className="right-align">Grand Total</td>
                    <td className="left-align">{grandTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="table_bottom_text">
              <h6>For boCHE Bhumiputra Pvt. Ltd</h6>
            </div>

            <div className="signature_div">
              <h6>Authorised Signatory</h6>
            </div>

            <div className="invoice_TC">
              <span className="invoice_TC_text">Terms and Conditions</span>
              <p>1.Goods once sold will not be taken back or exchanged.</p>
              <p>2.All disputes are subject to Kerala jurisdiction.</p>
            </div>

            <div className="final_text">
              <h6>This is computer generated Invoice.</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmedOrder;

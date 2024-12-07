import React, { useState, useEffect, useRef } from "react";
import "./DonateDetails.css";
import Ticket from "../Assets/Images/ticket.png";
import { useLocation, useNavigate } from "react-router-dom";
import fetchOrderCoupons from "./fetchOrderCoupons";
import downloadImg from "../Assets/Images/download (2).png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import invoLogo from "../Assets/Images/Layer 1 4.png";
import bocheText from "../Assets/Images/boche text.png";
import { doc, getDoc, query, where } from "firebase/firestore";
import { firestore } from "../../firebase";

export const DonateDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    orderId,
    orderDate,
    orderPrice,
    productQuantity,
    status,
    productImage,
    productPrice,
    deliveryRate,
  } = location.state || {};

  const [coupons, setCoupons] = useState([]);
  const invoiceRef = useRef();
  const cusId = localStorage.getItem("loginUserId");
  const MobNO = localStorage.getItem("loginUserPhone");

  const gstRate = 5; // GST rate of 5%

  // Calculate the original amount and GST amount
  const originalAmount = productPrice / (1 + gstRate / 100);
  const gstAmount = productPrice - originalAmount;

  //   const gst = (location.state?.productPrice * 5) / 100;
  const totalGst = location.state?.productQuantity * gstAmount;
  console.log(totalGst, "totalgst ok 1");
  console.log(gstAmount, "gst ok 1");

  const sgst = totalGst / 2;
  const cgst = totalGst / 2;
  const totalPurchase =
    location.state?.productPrice * location.state?.productQuantity;

  console.log(sgst, "sgst   ok 2");
  console.log(cgst, "sgst   ok 2");

  const teatotal =
    location.state?.productPrice * location.state?.productQuantity - totalGst;
  const subTotal = teatotal + deliveryRate;

  console.log(teatotal, "this gst tttttttttttttttttt");
  console.log(
    location.state?.productPrice,
    "product price ......................."
  );

  const [lastUsedDeliveryName, setUsedDeliveryName] = useState();

  const [lastUsedDeliveryAddress, setLastUsedDeliveryAddress] = useState();

  const [ticketId, setTicketId] = useState();

  // console.log(coupons)

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
    const fetchData = async () => {
      const fetchedCoupons = await fetchOrderCoupons(
        cusId,
        location.state?.orderId
      );
      setCoupons(fetchedCoupons);

      console.log(fetchedCoupons, "date from function fron donate deatils");
    };

    if (cusId && orderId) {
      fetchData();
    }
  }, [cusId, orderId]);

  //   fetchData();
  // }, [cusId, orderId]);

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

  const handleNavigation = () => {
    navigate("/coupen", { state: { from: "coupen" } });
  };
  const getChannelName = (channelId) => {
    switch (channelId) {
      case "8":
        return "Boche Mart";
      case "9":
        return "Boche Gold";
      case "6":
        return "WEB(QR)";
      case "1":
        return "Handheld Device";
      case "2":
        return "Boche Tea";
      case "3":
        return "QR";
      case "4":
        return "Retailer App";
      case "5":
        return "PlayerApp";
      default:
        return "";
    }
  };

  const formateDate = (date) => {
    const day = String(date.getDate()).padStart(2, 0);
    const month = String(date.getMonth() + 1).padStart(2, 0);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  // const dateOnly = coupons.TICKET_DATE.toLocaleDateString();

  console.log(coupons, "ticketDate. coupn data check......................");

  // console.log(dateOnly, " date string only ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");

  return (
    <div className="donatedetails">
      {/* <div className="donate-detail-box">
        <div className="donate-amount">
          <div className="top-donate">
            <h6>You Donate to Boche Charity </h6>
            <h6>₹ 50</h6>
          </div>
          <p>Little amount of tea bag going to Boche Charitable trust </p>
        </div>
        <div className="earned-ticket">
          <h6>Tickets Earned</h6>
          <h6>{location.state?.productQuantity}</h6>
        </div>
      </div> */}
      {/* <div className="price-details">
        <h6>Price Details</h6>
        <div className="price">
          <h6>Product Price</h6>
          <h6>₹ {location.state?.productPrice}</h6>
        </div>
        <div className="price">
          <h6>Items</h6>
          <h6>{location.state?.productQuantity}</h6>
        </div>
        <div className="price">
          <h6>Delivery Charge </h6>
          <h6 className="freee"> {deliveryRate} </h6>
        </div>
        <div className="total">
          <h6>Total </h6>
          <h6>₹ {location.state?.orderPrice}</h6>
        </div>
      </div>

      <div className="invoice_container" onClick={downloadPdf}>
        <p>Product Invoice</p>
        <div className="download">
          <img src={downloadImg} alt="Download" />
          <h6>Download</h6>
        </div>
      </div> */}
      <div className="my-tickets">
        <div className="ticket-top">
          <h6>boCHE Lucky Draw Ticket</h6>
          <button onClick={handleNavigation}>See More</button>
        </div>
        <ul className="tick">
          {coupons?.map((coupon, index) => (
            <li key={index}>
              <img src={Ticket} alt="Ticket" />
              <div className="total_content-container">
                <div className="ticket-content">
                  <div className="ticketId_contain">
                    <div className="tsn">
                      <span>TSN NO</span>
                    </div>
                    <p className="tktId">{coupon.TICKET_NUMBER}</p>
                  </div>
                  <div className="time-boxx">
                    <p className="tiktDate">
                      {/* {coupons.TICKET_DATE.toLocaleDateString()} */}
                      {formateDate(coupon.TICKET_DATE)}
                    </p>
                  </div>
                  <div className="channel_id">
                    <p>{getChannelName(coupon.CHANNEL_ID)} </p>
                  </div>
                  <div className="draw_id">
                    <p>Draw ID </p>
                    <p>{coupon.DRAW_ID}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Hidden Invoice Component for PDF generation */}
      {/* <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <div ref={invoiceRef}>
          <div className="invoice_main">
            <div className="invoice_head">
              <img src={invoLogo} alt="Invoice Logo" />
              <h4>INVOICE</h4>
            </div>
            <div className="office_addrss_container">
              <div className="Office_address_1">
                <h6>PATRONYMIC TECHNOLOGIES AND INDUSTRIES PRIVATE LIMITED</h6>
                <span>Floor No.: Door No.52/1060,Old-21-349-28A</span>
                <span>Building No./Flat No.: West Fort Tower</span>
                <span>Road/Street: Ayyanthole Road</span>
                <span>City/Town/Village: Thrissur</span>
                <span>Thrissur,Kerala ,680004</span>

                <span>GSTIN: 32AANCP1729R2ZT</span>
              </div>

              <div className="Office_address_2">
                <div>.</div>
                <span>Dated: formateDate(location.state?.orderDate)</span>
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
                <span>
                  {" "}
                  <p>Phone Number:</p> {MobNO}
                </span>
                <span>
                  {" "}
                  <p>Email id:</p> demo@gmail.com{" "}
                </span>
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
                  <th className="normal_width">SGST(2.5%)</th>
                  <th className="normal_width">CGST(2.5%)</th>
                  <th className="normal_width">Amount(INR)</th>
                </tr>
              </thead>
              <tbody style={{ height: "150px" }}>
                <tr>
                  <td className="min_width">1</td>
                  <td className="high_width"> boCHE TEA 0.3Kg</td>
                  <td className="min_width"></td>
                  <td className="min_width">
                    {location.state?.productQuantity}
                  </td>
                  <td className="normal_width"> {teatotal} </td>
                  <td className="normal_width"> {sgst} .00</td>
                  <td className="normal_width"> {cgst} .00</td>
                  <td className="normal_width">{totalPurchase} .00</td>
                </tr>
                <tr>
                  <td className="min_width">2</td>
                  <td className="high_width">Delivery Charge </td>
                  <td className="min_width"></td>
                  <td className="min_width">0</td>
                  <td className="normal_width">00.00</td>
                  <td className="normal_width">00.00</td>
                  <td className="normal_width">00.00</td>
                  <td className="normal_width">
                    {" "}
                    {location.state?.deliveryRate}{" "}
                  </td>
                </tr>
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
                    <td className="right-align"> {subTotal} </td>
                  </tr>
                  <tr className="total_coulm_container">
                    <td colSpan="2"></td>
                    <td className="right-align">GST (5%)</td>
                    <td className="right-align"> {totalGst} </td>
                  </tr>
                  <tr className="total_coulm_container">
                    <td colSpan="2"></td>
                    <td className="right-align">Grand Total</td>
                    <td className="left-align">{location.state?.orderPrice}</td>
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
      </div> */}
    </div>
  );
};

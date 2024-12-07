import React, { useEffect, useState } from "react";
import "./DonateDetails.css";
import invoLogo from "../Assets/Images/Layer 1 4.png";
import bocheText from "../Assets/Images/boche text.png";
import { collection, doc, getDoc, query } from "firebase/firestore";
import { firestore } from "../../firebase";

// const invoiceRef = useRef();

const Invoice = () => {
  const custId = localStorage.getItem("loginUserId");

  const [lastUsedDeliveryName, setUsedDeliveryName] = useState();

  const [lastUsedDeliveryAddress, setLastUsedDeliveryAddress] = useState();

  const [ticketId, setTicketId] = useState();

  const fetchLastUsedDeliveryInfo = async (cusId) => {
    const customerRef = doc(firestore, "CUSTOMERS", cusId);
    const customerSnapshot = await getDoc(customerRef);

    if (customerSnapshot.exists()) {
      const data = customerSnapshot.data();
      return {
        lastUsedDeliveryName: data.LAST_USED_USER_NAME || "",
        ticketId: data.id || "",
        lastUsedDeliveryAddress: data.LAST_USED_USER_ADDRESS || "",
      };
    } else {
      return {
        lastUsedDeliveryName: "",
        ticketId: "",
        lastUsedDeliveryAddress: "",
      };
    }
  };

  useEffect(() => {
    fetchLastUsedDeliveryInfo(custId);
  }, [custId]);

  return (
    <div>
      {/* <div className="invoice_main">
        <div className="invoice_head">
          <img src={invoLogo} alt="Invoice Logo" />
          <h4>INVOICE</h4>
        </div>
        <div className="office_addrss_container">
          <div className="Office_address_1">
            <h6>BOCHE BHUMIPUTRA PRIVATE LIMITED</h6>
            <span>Boche 1000 Acres</span>
            <span>13/354, 13/367,</span>
            <span>Meppadi Road, Kalpetta</span>
            <span>GSTIN: 32AALCB4828R1Z4 </span>
          </div>

          <div className="Office_address_2">
            <div>.</div>
            <span>Dated: 11/07/2024</span>
            <span>Invoice No.: BT-0002008602</span>
            <span>Customer Id: 5621051</span>
            <span>Purchase Order No.:</span>
            <span>Payment Due By:</span>
          </div>
        </div>

        <div className="line_horizondal"></div>

        <div className="office_addrss_container">
          <div className="Office_address_1_sub">
            <h6>Bill To</h6>
            <span>Customer Name:Darvin Thomas</span>
            <span>Customer Address:</span>
            <span>
              {" "}
              <p>Phone Number:</p>9526734371
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

        <div className="invoice_user">
          <p>Bill to</p>
          <p> {lastUsedDeliveryName} </p>
          {/* <p>Yasar Ameen</p>
              <p>Vengara, Malappuram</p>
              <p>Kerala, 676765</p> */}
      {/* <p>{lastUsedDeliveryAddress} </p>
        </div> */}

      {/* 
        <div className="items_table">
          <div className="table_column_head">
            <div className="table_column_head_items">Items</div>
            <div className="table_column_head_items">Prize</div>
            <div className="table_column_head_items">Quantity</div>
            <div className="table_column_head_items">Amount</div>
          </div>
          <div className="table_column_Items_div">
            <div className="table_column_items">Tea Packet</div>
            <div className="table_column_items">₹40</div>
            <div className="table_column_items">5 x 40</div>
            <div className="table_column_items">₹200</div>
          </div>
        </div>


        <div className="table_column_Items_divvvv">
          <div className="table_column_itemsss">Total</div>
          <div className="table_column_itemsss">₹200</div>
        </div> */}

      {/* // <table className="invoice-table">
        //   <thead className="tab_hgt">
        //     <tr>
        //       <th className="min_width">SR.No.</th>
        //       <th className="high_width">Description</th>
        //       <th className="min_width">HSN/SAC</th>
        //       <th className="min_width">Quantity</th>
        //       <th className="normal_width">Rate(INR)</th>
        //       <th className="normal_width">SGST(2.5%)</th>
        //       <th className="normal_width">CGST(2.5%)</th>
        //       <th className="normal_width">Amount(INR)</th>
        //     </tr>
        //   </thead>
        //   <tbody style={{ height: "150px" }}>
        //     <tr>
        //       <td className="min_width">1</td>
        //       <td className="high_width">boCHE TEA 100gm </td>
        //       <td className="min_width"></td>
        //       <td className="min_width">1</td>
        //       <td className="normal_width">38.00</td>
        //       <td className="normal_width">1.00</td>
        //       <td className="normal_width">1.00</td>
        //       <td className="normal_width">40.00</td>
        //     </tr>
        //     <tr>
        //       <td className="min_width">2</td>
        //       <td className="high_width">Delivery Charge </td>
        //       <td className="min_width"></td>
        //       <td className="min_width">0</td>
        //       <td className="normal_width">00.00</td>
        //       <td className="normal_width">00.00</td>
        //       <td className="normal_width">00.00</td>
        //       <td className="normal_width">00.00</td>
        //     </tr>
        //   </tbody>
        // </table>

        // <div className="table_container">
        //   <table className="invoice-table_2">
        //     <tbody>
        //       <tr>
        //         <td className="declaration" colSpan="2">
        //           <strong>Declaration</strong>
        //           <br />
        //           We declare that this invoice shows the actual price of the
        //           goods described and that all particulars are true and correct.
        //         </td>
        //       </tr>
        //     </tbody>
        //   </table>

        //   <table className="table_3">
        //     <tbody>
        //       <tr className="total_coulm_container">
        //         <td colSpan="2"></td>
        //         <td className="right-align">Sub Total</td>
        //         <td className="right-align">38.00</td>
        //       </tr>
        //       <tr className="total_coulm_container">
        //         <td colSpan="2"></td>
        //         <td className="right-align">GST (5%)</td>
        //         <td className="right-align">2.00</td>
        //       </tr>
        //       <tr className="total_coulm_container">
        //         <td colSpan="2"></td>
        //         <td className="right-align">Grand Total</td>
        //         <td className="left-align">40.00</td>
        //       </tr>
        //     </tbody>
        //   </table>
        // </div> */}

      {/* <div className="content_row">
            <div className="declaration">
            <p>Declaration</p> 
          <p>
          We declare that this invoice shows the actual price of the goods
          described and that all particulars are true and correct.
          </p>
            </div>
           
      
          </div> */}

      {/* //     <div className="table_bottom_text">
    //       <h6>For boCHE Bhumiputra Pvt. Ltd</h6>
    //     </div>

    //     <div className="signature_div">
    //       <h6>Authorised Signatory</h6>
    //     </div>

    //     <div className="invoice_TC">
    //       <span className="invoice_TC_text">Terms and Conditions</span>
    //       <p>1.Goods once sold will not be taken back or exchanged.</p>
    //       <p>2.All disputes are subject to Kerala jurisdiction.</p>
    //     </div>

    //     <div className="final_text">
    //       <h6>This is computer generated Invoice.</h6>
    //     </div>
    //   </div> */}

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
            <span>Dated:00</span>
            <span>Invoice No.: ok</span>
            <span>Customer Id:12</span>
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
              <p>Phone Number:</p> 000
            </span>
            <span>
              <p>Email id:</p> demo@gmail.com
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
              {"kerala" !== "Kerala" ? (
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
            <tr>
              <td className="min_width">1</td>
              <td className="high_width"> boCHE TEA 0.3Kg</td>
              <td className="min_width"></td>
              <td className="min_width">4</td>
              <td className="normal_width"> 40 </td>
              {"kerala" !== "Kerala" ? (
                <td className="normal_width">00.00</td>
              ) : (
                <>
                  <td className="normal_width"> 0.00</td>
                  <td className="normal_width"> 0.00</td>
                </>
              )}
              <td className="normal_width">40.00</td>
            </tr>
            <tr>
              <td className="min_width">2</td>
              <td className="high_width">Delivery Charge </td>
              <td className="min_width"></td>
              <td className="min_width">0</td>
              <td className="normal_width">00.00</td>
              <td className="normal_width">00.00</td>
              <td className="normal_width">00.00</td>
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
                  goods described and that all particulars are true and correct.
                </td>
              </tr>
            </tbody>
          </table>

          <table className="table_3">
            <tbody>
              <tr className="total_coulm_container">
                <td colSpan="2"></td>
                <td className="right-align">Sub Total</td>
                <td className="right-align"> 00</td>
              </tr>
              <tr className="total_coulm_container">
                <td colSpan="2"></td>
                <td className="right-align">GST (5%)</td>
                <td className="right-align"> 00 </td>
              </tr>
              <tr className="total_coulm_container">
                <td colSpan="2"></td>
                <td className="right-align">Grand Total</td>
                <td className="left-align">40</td>
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
  );
};

export default Invoice;

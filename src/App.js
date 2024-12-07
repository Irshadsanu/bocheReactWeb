import "./App.css";
import { Earnings } from "./Pages/Earnings/Earnings";
import { Home } from "./Pages/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PickUp from "./Pages/PickUp/PickUp";
import { Address } from "./Pages/Address/Address";
import DeliveryAddress from "./Pages/DeliveryAddress/DeliveryAddress";
import { Payment } from "./Components/PaymentWeb/Payment";
import PaymentOption from "./Components/PaymentWeb/PaymentOption";
import { Login } from "./Pages/Login/Login";
import Otp from "./Pages/Otp/Otp";
import { Registration } from "./Pages/Registration/Registration";
import Orders from "./Pages/Orders/Orders";
import Summery from "./Pages/Summery/Summery";
import Coupons from "./Pages/Coupons/Coupons";
import Store from "./Pages/Store/Store";
import Deposit from "./Pages/Deposit/Deposit";
import Withdraw from "./Pages/Withdraw/Withdraw";
import Wallet from "./Pages/Wallet/Wallet";
import Success from "./Components/Success/Success";
import { useState, useEffect } from "react";
// bootstrap min css file
import "bootstrap/dist/css/bootstrap.min.css";
import Splash from "./Components/Splash/Splash";
import { ProductProvider } from "./Context/ProductContext";
import { useProduct } from "./Context/ProductContext";
import WinningWallet from "./Pages/WinningWallet/WinningWallet";
import AccoutDetails from "./Components/AccoutDetails/AccoutDetails";
import Transactions from "./Pages/Transactions/Transactions";
import BottomNavFixed from "./Pages/BottomNavFixed/BottomNavFixed";
import { Privacy } from "./Pages/Privacy/Privacy";
import { Terms } from "./Pages/Terms/Terms";
import AboutUs from "./Pages/AboutUs/AboutUs";
import ChangeAddress from "./Components/ChangeAddress/ChangeAddress";
import Failed from "./Components/Failed/Failed";
import ProfileEdit from "./Components/ProfileEdit/ProfileEdit";
import Logout from "./Components/Alert/Logout";
import Exit from "./Components/Alert/Exit";
import Support from "./Components/Alert/Support";
import { SearchCoupen } from "./Components/SearchCoupen/SearchCoupen";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import PaymentWeb from "./Components/PaymentWeb/PaymentWeb";
import CcAvenueScreen from "./Pages/Payment_Integration/CcAvenueScreen";
import Invoice from "./Components/DonateDetails/Invoice";
import { DepositSucces } from "./Components/DepositSucces/DepositSucces";
import UserDetails from "./Components/UserDetails/UserDetails";
import MyCoupons from "./Components/MyCoupons/MyCoupons";
import CheckStatus from "./Pages/Payment_Integration/checkStatus";
import DepositFailed from "./Components/DepositFailed/DepositFailed";
import ICICPaymentIntegration from "./Pages/Payment_Integration/ICICPaymentIntegration";
import ICICIWebView from "./Pages/Payment_Integration/ICICIwebView";
import DepositIcici from "./Components/PaymentChoose/DepositIcici";
import TopHome from "./Components/TopNav/TopHome";
import { Toaster } from "sonner";
import PolicyPage from "./Pages/Terms/PolicyPage";
import { Count } from "./Components/Count/Count";
import Cart from "./Components/Cart/Cart";
import Notification from "./Components/Notification/Notification";

function App() {
  return (
    <div className="App">
      <>
        <ProductProvider>
          <Router>
            <ScrollToTop />
            <Toaster richColors position="top-center" />
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/earning" element={<Earnings />} />
              <Route path="/pickup" element={<PickUp />} />
              <Route path="/address" element={<Address />} />
              <Route path="/delivery" element={<DeliveryAddress />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/option" element={<PaymentOption />} />
              <Route path="/login" element={<Login />} />
              <Route path="/otp" element={<Otp />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/order" element={<Orders />} />
              <Route path="/summery" element={<Summery />} />
              <Route path="/coupen" element={<Coupons />} />
              <Route path="/store" element={<Store />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/withdraw" element={<Withdraw />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/succes" element={<Success />} />
              <Route path="/winning" element={<WinningWallet />} />
              <Route path="/account" element={<AccoutDetails />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/home" element={<BottomNavFixed />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/change" element={<ChangeAddress />} />
              <Route path="/failed" element={<Failed />} />
              <Route path="/edit" element={<ProfileEdit />} />
              <Route path="/logout" element={<Support />} />
              <Route path="/search" element={<SearchCoupen />} />
              <Route path="/paymentweb" element={<PaymentWeb />} />
              <Route path="/ccaavenue" element={<CcAvenueScreen />} />
              <Route path="/invoice" element={<Invoice />} />
              <Route path="/deposucces" element={<DepositSucces />} />
              <Route path="/userDetails" element={<UserDetails />} />
              <Route path="/MyCoupons" element={<MyCoupons />} />
              <Route path="/checkstatus" element={<CheckStatus />} />
              <Route path="/depofailed" element={<DepositFailed />} />
              <Route path="/ICIC" element={<ICICPaymentIntegration />} />
              <Route path="/iciciwebview" element={<ICICIWebView />} />
              <Route path="/deposiey" element={<DepositIcici />} />
              <Route path="/policy/policy.html" element={<PolicyPage />} />
              <Route path="/count" element={<Count />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/notification" element={<Notification />} />

            </Routes>
          </Router>
        </ProductProvider>
      </>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Success.css";
import Success_gif from "../Assets/gif/payment succesful png.gif";
import { Assets } from "../Assets/Assets";
import { useCount } from "../../Context/Context";
import { toast } from "sonner";

const Success = () => {
  const { totalPrice, count } = useCount();
  const navigator = useNavigate();
  const location = useLocation();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const successTimeout = setTimeout(() => {
      setIsSuccess(true);
    }, 3000);

    return () => clearTimeout(successTimeout);
  }, []); // The dependency array is empty to avoid infinite loop

  useEffect(() => {
    const navigateTimeout = setTimeout(() => {
      // navigator("/home", { state: { from: "order" } });
    }, 10000);

    return () => clearTimeout(navigateTimeout);
  }, [navigator]);

  function handleClick() {
    const isMobile = window.innerWidth < 480;
    window.history.pushState({ preventBack: true }, "");

    if (isMobile) {
      navigator("/home", { state: { from: "coupen", preventBack: true } });
    } else {
      navigator("/coupen");
    }

    // navigator("/order", { state: { from: "order" }, replace: true });
  }
  console.log(count);

  console.log(count, "usecount inside context'''''''");

  useEffect(() => {
    console.log(count, "usecount inside context'''''''");
  }, [useCount]);

  useEffect(() => {
    const handlePropState = (event) => {
      if (location.state && location.state?.preventBack) {
        toast.error("cannot go back to payment gate way ");
        window.history.pushState({ preventBack: true }, "");
      }
    };

    window.history.pushState({ preventBack: true }, "");
    window.addEventListener("popstate", handlePropState);

    return () => {
      window.removeEventListener("popstate", handlePropState);
    };
  }, [location.state]);

  return (
    <div className="success">
      <div className="success_container">
        {isSuccess && (
          <>
            <div className="win_and_congradas">
              <div className="congrats">
                <img src={Assets.Congrats} alt="" />
              </div>

              <div className="win">
                <span>You Have Won</span>
                <h3>
                  {location.state?.qty}{" "}
                  {location.state?.qty > 1
                    ? "boCHE Lucky Draw Tickets"
                    : "boCHE Lucky Draw Ticket"}
                </h3>
              </div>
            </div>

            <div className="success_div_sub">
              <div className="star_container">
                <img src={Assets.Star_icon} alt="" />
              </div>

              <div className="coupon_btn_container">
                <div className="tickets">
                  {location.state?.qty > 1 ? (
                    <img src={Assets.SetTickets} alt="Another Ticket" />
                  ) : (
                    <img src={Assets.ticket} alt="Ticket" />
                  )}
                </div>
              </div>
              <button onClick={handleClick} className="bottom-btn">
                My Tickets
              </button>
            </div>
          </>
        )}
      </div>
      {isSuccess && (
        <div className="animation-container">
          <div className="circle-gree"></div>
        </div>
      )}
      {/* {isSuccess && (
        <button onClick={handleClick} className="bottom-btn">
          HOME
        </button>
      )} */}

      {!isSuccess && (
        <div className="img-gif">
          <img src={Success_gif} alt="" />
        </div>
      )}
    </div>
  );
};

export default Success;

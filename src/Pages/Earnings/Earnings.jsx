import React from "react";
import { TopNav } from "../../Components/TopNav/TopNav";
import EarningTotal from "../../Components/EarningTotal/EarningTotal";

export const Earnings = () => {
  return (
    <div>
      <TopNav title="My Earnings" />
      <EarningTotal />
    </div>
  );
};

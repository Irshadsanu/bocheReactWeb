import React from "react";
import { TopNav } from "../../Components/TopNav/TopNav";
import PickUpStore from "../../Components/PickUpStore/PickUpStore";
import { Button } from "../../Components/Button/Button";

const PickUp = () => {
  return (
    <div>
      <TopNav title="Buy Now" />
      <PickUpStore />
      <Button title="Submit" />
    </div>
  );
};

export default PickUp;

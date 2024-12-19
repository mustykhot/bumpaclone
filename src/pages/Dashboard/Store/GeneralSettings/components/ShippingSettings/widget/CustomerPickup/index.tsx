import { useState } from "react";
import { IconButton } from "@mui/material";

import { ChevronRight } from "assets/Icons/ChevronRight";

import { ContentHeader } from "../../settings";
import { PickupModal } from "../PickupModal";
import "./style.scss";

const CustomerPickup = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setOpenModal(true);
        }}
        className="pd_customer_pickup"
      >
        <div className="chose_flex flex">
          <ContentHeader
            title="Customer Pick-up Location"
            description="Your customers will see these partners at checkout "
          />

          <div className="toggle_flex">
            <IconButton>
              <ChevronRight />
            </IconButton>
          </div>
        </div>
      </div>

      <PickupModal
        type="customer"
        openModal={openModal}
        closeModal={() => {
          setOpenModal(false);
        }}
      />
    </>
  );
};

export default CustomerPickup;

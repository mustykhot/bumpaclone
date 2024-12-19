import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Fade,
  Slide,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@mui/material";
import { IconButton, Button } from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { XIcon } from "assets/Icons/XIcon";

import { OrderType } from "Models/order";

import "./style.scss";
import moment from "moment";

type ModalProps = {
  openModal: boolean;
  closeModal: Function;
  order: OrderType;
};

const steps = [
  {
    label: "Delivered",
    description: `Tuesday, 18th August, 2024`,
  },
  {
    label: "In Transit",
    description: "Tuesday, 18th August, 2024",
  },
  {
    label: "Picked Up",
    description: `Tuesday, 18th August, 2024`,
  },
];

const TrackShippingModal = ({ openModal, closeModal, order }: ModalProps) => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <Fade in={openModal}>
      <div
        onClick={(e) => e.target === e.currentTarget && closeModal()}
        className={`modal-wrap `}
      >
        <Slide direction="up" in={openModal} mountOnEnter unmountOnExit>
          <div className="modal-content msg-modal track-shipping-modal ">
            <div className="top_side">
              <div className="title-container">
                <h3>Track Shipment</h3>

                <p>
                  Tracking Number:
                  <span>{order?.shipping_record?.tracking_number}</span>
                  <br />
                  Courier Name:
                  <span>
                    {order?.shipping_record?.shipment[0]?.courier?.name}
                  </span>
                  <br />
                  Courier Number:
                  <span>
                    {order?.shipping_record?.shipment[0]?.courier?.phone}
                  </span>
                </p>
              </div>
              <IconButton
                className="icon_button_container"
                onClick={() => {
                  closeModal();
                }}
              >
                <XIcon />
              </IconButton>
            </div>
            <div className="middle_side">
              <div className="partner-and-date">
                <div className="partner">
                  <p>Delivery Partner</p>
                  <img
                    src={
                      order?.shipping_record?.shipment[0]?.courier?.service_icon
                    }
                    alt="partner"
                  />
                </div>

                <div className="date">
                  <p>Estimated Delivery Date</p>
                  <p className="date-text">
                    {moment(order?.shipping_record?.shipment[0]?.date).format(
                      "LL"
                    )}
                  </p>
                </div>
              </div>

              {order?.shipping_record?.shipment[0]?.events?.length ? (
                <div className="tracker">
                  <Stepper activeStep={activeStep} orientation="vertical">
                    {order?.shipping_record?.shipment[0]?.events?.map(
                      (step, index: number) => (
                        <Step key={index}>
                          <StepLabel
                            icon={
                              index <= activeStep ? (
                                <CheckCircleIcon color="primary" />
                              ) : (
                                <RadioButtonUncheckedIcon color="primary" />
                              )
                            }
                          >
                            {step.location}
                          </StepLabel>
                          <StepContent>
                            <p className="description">{step.message}</p>
                            <p className="description">
                              {moment(step.captured).format("LLL")}
                            </p>
                          </StepContent>
                        </Step>
                      )
                    )}
                  </Stepper>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="bottom_side">
              <Button
                onClick={() => {
                  closeModal();
                }}
                variant="contained"
                className="primary_styled_button"
              >
                Okay
              </Button>
            </div>
          </div>
        </Slide>
      </div>
    </Fade>
  );
};

export default TrackShippingModal;

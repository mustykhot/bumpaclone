import { Button, IconButton } from "@mui/material";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import Modal from "components/Modal";
import React, { useEffect, useRef, useState } from "react";
import success from "assets/images/checkcircle.png";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

type Props = {
  openModal: boolean;
  closeModal: () => void;
  numOfStaff: number;
};
const ExtraSuccessModal = ({ openModal, closeModal, numOfStaff }: Props) => {
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const confetiRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (confetiRef.current) {
      setHeight(confetiRef.current.clientHeight / 2);
      setWidth(confetiRef.current.clientWidth);
    }
  }, []);

  return (
    <Modal
      closeOnOverlayClick={true}
      openModal={openModal}
      closeModal={closeModal}
    >
      <div className="extra_wrapper" ref={confetiRef}>
        <Confetti
          numberOfPieces={500}
          width={514}
          height={480}
          tweenDuration={3000}
          recycle={false}
          colors={[
            "#f44336",
            "#e91e63",
            "#9c27b0",
            "#673ab7",
            "#3f51b5",
            "#2196f3",
            "#03a9f4",
            "#00bcd4",
            "#009688",
            "#4CAF50",
            "#8BC34A",
            "#CDDC39",
            "#FFEB3B",
            "#FFC107",
            "#FF9800",
            "#FF5722",
            "#009444",
          ]}
        />
        <IconButton type="button" className="close_btn" onClick={closeModal}>
          <CloseSqIcon />
        </IconButton>
        <img src={success} alt="" />
        <div className="text_content">
          <h3>Purchase Successful!</h3>
          <p>
            You can now add {numOfStaff} more staff Account
            {numOfStaff && numOfStaff > 1 && "s"}.
          </p>
          <Button
            className="pay_btn"
            type="button"
            onClick={() => closeModal()}
          >
            Add new Staff
          </Button>
          <Button className="pay_btn clear" type="button" onClick={closeModal}>
            I'll do that Later
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExtraSuccessModal;

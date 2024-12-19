import { Fade, Slide } from "@mui/material";
import { IconButton, Button } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";
import "./style.scss";
import { alt_image_url } from "utils/constants/general";
import aramax from "assets/images/aramax.png";
import NormalSelectField from "components/forms/NormalSelectField";

type ModalProps = {
  openModal: boolean;
  closeModal: Function;
};

const BookPickupModal = ({ openModal, closeModal }: ModalProps) => {
  return (
    <Fade in={openModal}>
      <div
        onClick={(e) => e.target === e.currentTarget && closeModal()}
        className={`modal-wrap `}
      >
        <Slide direction="up" in={openModal} mountOnEnter unmountOnExit>
          <div className="modal-content msg-modal book-pickup-modal ">
            <div className="top_side">
              <div className="title-container">
                <h3>Book Pick-Up</h3>

                <p>
                  You’re about to request pick-up. A dispatch rider will come to
                  the selected location to pick-up this order for delivery.
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
              <div className="partner-container">
                <p className="delivery-partner">Delivery Partner</p>
                <img src={aramax} alt="partner" />
              </div>

              <div className="select-location-container">
                <p>Select Pick-up Location</p>
                <NormalSelectField
                  name="location"
                  selectOption={[]}
                  onChange={(val: any) => {}}
                />
              </div>
            </div>
            <div className="bottom_side">
              <Button
                onClick={() => {
                  closeModal();
                }}
                variant="contained"
                className="primary_styled_button"
              >
                Book Pickup
              </Button>
            </div>
          </div>
        </Slide>
      </div>
    </Fade>
  );
};

export default BookPickupModal;

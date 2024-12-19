import { CircularProgress, IconButton } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";
import Modal from "components/Modal";
import NormalSelectField from "components/forms/NormalSelectField";
import { useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import TextAreaField from "components/forms/TextAreaField";
import { Radio, Button } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import { LocationType } from "services/api.types";
import "./style.scss";
type ModalProps = {
  openModal: boolean;
  closeModal: Function;
  btnAction: () => void;
  locationTobeDeleted?: LocationType | null;
};

const options = [
  {
    label: "I am closing shop at this location.",
    value: "I am closing shop at this location.",
  },
  {
    label: "I’m migrating to another location.",
    value: "I’m migrating to another location.",
  },
  {
    label: "other",
    value: "other",
  },
];
const DeleteLocationModal = ({
  openModal,
  closeModal,
  locationTobeDeleted,
}: ModalProps) => {
  const [value, setValue] = useState("");
  const [other, setOther] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  return (
    <Modal openModal={openModal} closeModal={closeModal}>
      <div className="cancel_subscription_modal pd_delete_location">
        <div className="cancel_section">
          <div className="text_box">
            <h2>Delete Store Location</h2>
            <p>
              The products associated with this store needs to be moved to
              another store location.
            </p>
          </div>

          <IconButton
            onClick={() => {
              closeModal();
            }}
            className="icon_button_container"
          >
            <XIcon />
          </IconButton>
        </div>

        <div className="select_section">
          <p className="question">
            Select the location products will be moved to
          </p>
          <NormalSelectField
            name="location"
            selectOption={[]}
            label="Store location"
          />
        </div>
        <div className="reason_box">
          <p className="question">Why are you deleting this address?</p>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              {options.map((item) => (
                <FormControlLabel
                  value={item.value}
                  className={"radio_label"}
                  control={<Radio />}
                  label={item.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
          {value === "other" && (
            <TextAreaField
              value={other}
              height={"h-[120px]"}
              placeholder="Please give us your feedback..."
              onChange={(e) => {
                setOther(e.target.value);
              }}
            />
          )}
        </div>
        <div className="btn_flex">
          <Button
            variant="outlined"
            onClick={() => {
              closeModal();
            }}
          >
            Cancel
          </Button>
          <Button
            className={`submit   ${value ? "" : "disabled"} ${
              value === "other" && !other ? "disabled" : ""
            }`}
            variant="contained"
          >
            Cancel Subscription
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteLocationModal;

import { IconButton } from "@mui/material";
import Modal from "components/Modal";
import { Button } from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";
import { useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import TextAreaField from "components/forms/TextAreaField";
import { DeleteLargeIcon } from "assets/Icons/DeleteLargeIcon";
import { ViewLargeIcon } from "assets/Icons/ViewLargeIcon";
import { useDeleteStoreProfileMutation } from "services";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { handleError } from "utils";

type DeleteAccountModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

const options = [
  {
    label: "I am not satisfied with my subscription offers.",
    value: "I am not satisfied with my subscription offers.",
  },
  {
    label: "I am closing my business.",
    value: "I am closing my business.",
  },
  {
    label: "I no longer need Bumpa for my business.",
    value: "I no longer need Bumpa for my business.",
  },
  {
    label: "I’m migrating to another platform.",
    value: "I’m migrating to another platform.",
  },
  {
    label: "other",
    value: "other",
  },
];

export const DeleteAccountModal = ({
  closeModal,
  openModal,
}: DeleteAccountModalProps) => {
  const [step, setStep] = useState(0);
  const [value, setValue] = useState("");
  const [other, setOther] = useState("");
  const [deleteStoreProfileMutation, { isLoading }] =
    useDeleteStoreProfileMutation();

  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleDeleteProfile = async () => {
    try {
      let result = await deleteStoreProfileMutation();
      if ("data" in result) {
        setStep(2);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const recoverAccount = () => {
    navigate("/recover-account");
  };
  return (
    <>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div
          className={`cancel_subscription_modal ${
            step === 1 || step === 2 ? "success" : ""
          }`}
        >
          <div className="cancel_section">
            <div className="text_box">
              {step === 0 && (
                <>
                  <h2>Delete your account</h2>
                  <p>
                    We’re sad to see you go. Please let us know how we can do
                    better by telling us why you want to delete your account.
                  </p>{" "}
                </>
              )}
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
          {step === 0 && (
            <>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={value}
                  onChange={handleChange}
                >
                  {options.map((item) => (
                    <FormControlLabel
                      key={item.value}
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

              <div className="btn_flex">
                <Button variant="outlined" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  className={`submit ${value ? "" : "disabled"} ${
                    value === "other" && !other ? "disabled" : ""
                  }`}
                  onClick={() => {
                    setStep(1);
                  }}
                  variant="contained"
                >
                  Delete Account
                </Button>
              </div>
            </>
          )}

          {step === 1 && (
            <div className="cancel_successful_container">
              <DeleteLargeIcon />
              <h3>Delete your account</h3>
              <p>
                Your store and it’s data will be erased. Are you sure you want
                to continue?
              </p>
              <div className="btn_box">
                <LoadingButton
                  onClick={handleDeleteProfile}
                  className="red_bg"
                  variant="contained"
                  loading={isLoading}
                >
                  Yes, delete account
                </LoadingButton>
                <Button onClick={closeModal} className="done">
                  Cancel{" "}
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="cancel_successful_container">
              <ViewLargeIcon />
              <h3>Account deactivated</h3>
              <p>
                Your store and its data will be removed in 14 days, you still
                have an opportunity to recover your account and data before
                then.
              </p>
              <div className="btn_box">
                <Button variant="contained" onClick={recoverAccount}>
                  Recover account
                </Button>
                <Button
                  onClick={() => {
                    navigate("/signup");
                  }}
                  className="done"
                >
                  Create new account
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

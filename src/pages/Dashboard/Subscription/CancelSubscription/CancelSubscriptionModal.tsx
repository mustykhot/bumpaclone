import { IconButton } from "@mui/material";
import Modal from "components/Modal";
import { Button } from "@mui/material";
import "./style.scss";
import { XIcon } from "assets/Icons/XIcon";
import { useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import TextAreaField from "components/forms/TextAreaField";
import { CancelSubscriptionIcon } from "assets/Icons/CancelSubscriptionIcon";
import { useUnSubscribeMutation } from "services";
import { handleError } from "utils";
import { CircularProgress } from "@mui/material";
import { useGetUser } from "hooks/getUserHook";
import { showToast } from "store/store.hooks";
import { useNavigate } from "react-router-dom";
import { CancelSubscriptionRedIcon } from "assets/Icons/CancelSubscriptionRedIcon";

type CancelSubscriptionModalProps = {
  openModal: boolean;
  closeModal: () => void;
  refetch?: any;
  subscriptionType?: string;
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
    label: "Other",
    value: "other",
  },
];

export const CancelSubscriptionModal = ({
  closeModal,
  openModal,
  refetch,
  subscriptionType,
}: CancelSubscriptionModalProps) => {
  const [step, setStep] = useState(0);
  const [value, setValue] = useState("");
  const [other, setOther] = useState("");
  const { store_id } = useGetUser();
  const navigate = useNavigate();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const [unsubscribe, { isLoading }] = useUnSubscribeMutation();
  const onSubmit = async () => {
    const payload = {
      store_id: `${store_id}`,
      reason: other ? other : value,
    };
    try {
      let result = await unsubscribe(payload);
      if ("data" in result) {
        showToast("Subscription Cancelled Successfully", "success");
        setStep(2);
        refetch && refetch();
      } else {
        handleError(result);
        refetch && refetch();
      }
    } catch (error) {
      handleError(error);
      refetch && refetch();
    }
  };

  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={() => {
          closeModal();
          setStep(0);
        }}
      >
        <div
          className={`cancel_subscription_modal ${step === 2 ? "success" : ""}`}
        >
          <div className="cancel_section">
            <div className="text_box">
              {step === 1 && (
                <>
                  <h2>Cancel Subscription</h2>
                  <p>
                    We’re sad to see you cancel. Please let us know what we can
                    do better by telling us why you want to cancel your
                    subscription.
                  </p>{" "}
                </>
              )}
            </div>

            <IconButton
              onClick={() => {
                closeModal();
                setStep(0);
              }}
              className="icon_button_container"
            >
              <XIcon />
            </IconButton>
          </div>
          {step === 0 && (
            <div className="cancel_successful_container">
              <CancelSubscriptionRedIcon />
              <h3>Cancel Subscription</h3>
              <p>
                {`Do you want to cancel your subscription${
                  subscriptionType !== "growth"
                    ? " or change your subscription plan"
                    : ""
                }?`}
              </p>
              <div className="btn_box">
                <Button
                  onClick={() => {
                    setStep(1);
                  }}
                  className="done"
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          )}
          {step === 1 && (
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
                <Button
                  variant="outlined"
                  onClick={() => {
                    closeModal();
                    setStep(0);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className={`submit   ${value ? "" : "disabled"} ${
                    value === "other" && !other ? "disabled" : ""
                  }`}
                  onClick={onSubmit}
                  variant="contained"
                >
                  {isLoading ? (
                    <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                  ) : (
                    "Cancel Subscription"
                  )}
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="cancel_successful_container">
              <CancelSubscriptionIcon />
              <h3>Subscription Cancelled</h3>
              <p>
                Your account has been downgraded to Bumpa free. Remember, you
                can still upgrade your account to keep enjoying the full
                benefits of Bumpa anytime.
              </p>
              <div className="btn_box">
                {subscriptionType !== "growth" && (
                  <Button
                    onClick={() => {
                      navigate(
                        `/dashboard/subscription/select-plan?type=upgrade&slug=${subscriptionType}`
                      );
                    }}
                    variant="contained"
                    className="primary_styled_button"
                  >
                    Upgrade Plan
                  </Button>
                )}
                <Button
                  onClick={() => {
                    closeModal();
                    setStep(0);
                  }}
                  className="done"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

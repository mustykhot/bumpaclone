import Modal from "components/Modal";
// import "./style.scss";
import { Button, IconButton } from "@mui/material";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import InputField from "components/forms/InputField";
import { useState, useEffect } from "react";
import { formatNumber, handleError } from "utils";
import {
  useGetExtraLocationAmtMutation,
  useInitiatePaymentMutation,
  useGetStoreInformationQuery,
} from "services";
import { useAppSelector } from "store/store.hooks";
import { selectStoreId } from "store/slice/AuthSlice";
import { LoadingButton } from "@mui/lab";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import { getObjWithValidValues, REDIRECT_URL } from "utils/constants/general";

type Props = {
  openModal: boolean;
  closeModal: () => void;
};

const ExtraStaffModal = ({ openModal, closeModal }: Props) => {
  const [count, setCount] = useState<number | undefined>();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState<number | undefined>();

  const store_id = useAppSelector(selectStoreId);

  const [initiate, { isLoading: isInitiateLoading }] =
    useInitiatePaymentMutation();

  const makePayment = async () => {
    const payload = {
      store_id: `${store_id}`,
      plan_id: 15,
      plan_count: count,
      redirect_url: `${REDIRECT_URL}dashboard/staff?slot=${count}&success=true`,
    };
    try {
      let result = await initiate(getObjWithValidValues(payload));
      if ("data" in result) {
        window.open(result?.data.data.authorization_url, "_blank");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };
  const [getAmount, { isLoading }] = useGetExtraLocationAmtMutation();

  const handleGetAmount = async () => {
    try {
      let result = await getAmount({
        store_id: store_id,
        plan_id: 15,
        plan_count: count,
      });
      if ("data" in result) {
        // @ts-ignore
        setAmount(result?.data?.prorated_amount);
        setStep(2);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Modal
      closeOnOverlayClick={true}
      openModal={openModal}
      closeModal={closeModal}
    >
      <div className={`extra_wrapper staff ${step === 2 ? "step2_staff" : ""}`}>
        <IconButton
          type="button"
          className="close_btn"
          onClick={() => closeModal()}
        >
          <CloseSqIcon />
        </IconButton>
        {step == 2 && (
          <IconButton
            type="button"
            className="close_btn back-btn"
            onClick={() => setStep(1)}
          >
            <BackArrowIcon />
          </IconButton>
        )}

        <img src="/staffimg.svg" alt="" />
        {step == 1 && (
          <div className="text_content">
            <h3>Add more staff accounts</h3>
            <p>Each additional staff account cost N20,000</p>
            <p className="label">How many staff accounts do you want to add?</p>
            <InputField
              type="number"
              name="locationCount"
              value={count}
              onChange={(e) => {
                setCount(parseInt(e.target.value));
              }}
            />
            <LoadingButton
              className="save pay_btn"
              disabled={!count}
              type="button"
              onClick={() => handleGetAmount()}
              loading={isLoading}
            >
              Continue
            </LoadingButton>
          </div>
        )}
        {step === 2 &&
          (amount ? (
            <div className="text_content">
              <h3 className="mb-2">
                Amount to pay for <span>{count}</span> <br /> extra staff
                account slot
                {count && count > 1 && "s"}
              </h3>
              <p>
                Staff account costs and expiration are calculated based on your
                current subscription cycle.
              </p>
              <div className="soft_wrap">
                <span className="span_amt">Amount</span>
                <span className="span_number">₦{formatNumber(amount)}</span>
              </div>
              <LoadingButton
                className="save pay_btn"
                type="button"
                onClick={() => makePayment()}
                loading={isInitiateLoading}
              >
                Pay ₦{formatNumber(amount)}
              </LoadingButton>
              <Button
                className="pay_btn cancel"
                type="button"
                onClick={() => {
                  closeModal();
                  setStep(1);
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <p style={{ marginTop: "16px" }}>
              Please contact support to proceed
            </p>
          ))}
      </div>
    </Modal>
  );
};

export default ExtraStaffModal;

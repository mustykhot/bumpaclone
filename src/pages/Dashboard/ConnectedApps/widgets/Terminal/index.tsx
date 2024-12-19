import { useEffect, useState } from "react";
import { BumpaIcon } from "assets/Icons/BumpaIcon";
import PoweredByPaystack from "assets/images/PoweredByPaystack.svg";
import Loader from "components/Loader";
import { KYCFlow } from "pages/Dashboard/KYC/KYCFlow";
import { TerminalActivationFlow } from "pages/Dashboard/Terminal/TerminalActivationFlow";
import {
  useGetCheckoutTerminalQuery,
  useGetPaymentMethodsQuery,
} from "services";
import { PaymentMethodsResponse } from "services/api.types";
import {
  closeManageTerminal,
  selectShouldOpenManageTerminal,
  startTerminalFlow,
} from "store/slice/TerminalSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { ManageTerminalModal } from "./ManageTerminalModal";
import { ManageWhatsappModal } from "./ManageWhatsappModal";

type TerminalProps = {
  data?: PaymentMethodsResponse;
};

export const Terminal = ({ data }: TerminalProps) => {
  const dispatch = useAppDispatch();

  const shouldOpenManageTerminal = useAppSelector(
    selectShouldOpenManageTerminal
  );

  const [openManageTerminalModal, setOpenManageTerminalModal] = useState(false);
  const [openManageWhatsappModal, setOpenManageWhatsappModal] = useState(false);

  const { refetch: refetchPaymentMethods } = useGetPaymentMethodsQuery();
  const { data: checkoutTerminal, isLoading: checkoutTerminalLoading } =
    useGetCheckoutTerminalQuery();

  const hasTerminal = checkoutTerminal?.success;

  const handleTerminalSuccess = async () => {
    await refetchPaymentMethods();
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasTerminal) {
      dispatch(startTerminalFlow());
    } else {
      setOpenManageTerminalModal(true);
    }
  };

  useEffect(() => {
    if (shouldOpenManageTerminal) {
      setOpenManageTerminalModal(true);
      dispatch(closeManageTerminal());
    }
  }, [shouldOpenManageTerminal, dispatch]);

  return (
    <>
      {checkoutTerminalLoading && <Loader />}
      <div
        className={`payment_method_container terminal`}
        onClick={handleCardClick}
      >
        <div className="title_flex">
          <div className="title_container">
            <BumpaIcon className="app_image" />
            <h4>Bumpa Terminal</h4>
          </div>
        </div>
        <div className="main">
          <div className="bank">
            <p className="description">Bank transfer, but better and faster</p>
            <img
              src={PoweredByPaystack}
              alt="Powered By Paystack"
              className="powered-by"
            />
          </div>
        </div>
      </div>
      <TerminalActivationFlow onSuccess={handleTerminalSuccess} />
      <KYCFlow />
      {openManageTerminalModal && (
        <ManageTerminalModal
          openModal={openManageTerminalModal}
          closeModal={() => {
            setOpenManageTerminalModal(false);
          }}
          terminalInfo={checkoutTerminal}
          setOpenManageWhatsappModal={setOpenManageWhatsappModal}
        />
      )}
      {openManageWhatsappModal && (
        <ManageWhatsappModal
          openModal={openManageWhatsappModal}
          closeModal={() => setOpenManageWhatsappModal(false)}
          terminalInfo={checkoutTerminal}
        />
      )}
    </>
  );
};

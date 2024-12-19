import { ActivateTerminalModal } from "pages/Dashboard/Terminal/ActivateTerminalModal";
import { GetTerminalModal } from "pages/Dashboard/Terminal/GetTerminalModal";
import { LinkTerminalModal } from "pages/Dashboard/Terminal/LinkTerminalModal";
import { TerminalGetStartedModal } from "pages/Dashboard/Terminal/TerminalGetStartedModal";
import { TerminalStatusModal } from "pages/Dashboard/Terminal/TerminalStatusModal";
import { useEffect } from "react";
import { selectCurrentUser } from "store/slice/AuthSlice";
import { setKYCOrigin, startKYCFlow } from "store/slice/KycSlice";
import {
  closeAllModals,
  closeModal,
  handleActivateTerminalAction,
  handleTerminalGetStartedAction,
  handleTerminalStatusNoAction,
  handleTerminalStatusYesAction,
  resetTerminalFlow,
  selectShouldContinueTerminalFlow,
  selectTerminalModals,
} from "store/slice/TerminalSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";

interface TerminalActivationFlowProps {
  onSuccess?: () => void;
}

export const TerminalActivationFlow = ({ onSuccess }: TerminalActivationFlowProps) => {
  const dispatch = useAppDispatch();
  const modals = useAppSelector(selectTerminalModals);
  const shouldContinueTerminalFlow = useAppSelector(
    selectShouldContinueTerminalFlow
  );
  const user = useAppSelector(selectCurrentUser);

  const handleLinkTerminalSuccess = () => {
    dispatch(closeAllModals());
    onSuccess?.();
  };

  useEffect(() => {
    if (shouldContinueTerminalFlow) {
      dispatch(handleTerminalGetStartedAction());
      dispatch(resetTerminalFlow());
    }
  }, [shouldContinueTerminalFlow, dispatch]);

  return (
    <>
      <ActivateTerminalModal
        openModal={modals.activateTerminal}
        closeModal={() => dispatch(closeModal("activateTerminal"))}
        btnAction={() => dispatch(handleActivateTerminalAction())}
      />

      {modals.terminalGetStarted && (
        <TerminalGetStartedModal
          openModal={modals.terminalGetStarted}
          closeModal={() => dispatch(closeModal("terminalGetStarted"))}
          btnAction={() => {
            if (
              user?.bvn_verified_at === null ||
              user?.nin_verified_at === null
            ) {
              dispatch(setKYCOrigin('terminal'));
              dispatch(startKYCFlow());
            } else {
              dispatch(handleTerminalGetStartedAction());
            }
            dispatch(closeModal("terminalGetStarted"));
          }}
        />
      )}

      <TerminalStatusModal
        openModal={modals.terminalStatus}
        closeModal={() => dispatch(closeAllModals())}
        noAction={() => dispatch(handleTerminalStatusNoAction())}
        yesAction={() => dispatch(handleTerminalStatusYesAction())}
      />

      <LinkTerminalModal
        openModal={modals.linkTerminal}
        closeModal={() => dispatch(closeModal("linkTerminal"))}
        handleLinkTerminalSuccess={handleLinkTerminalSuccess}
        handleCloseStatusModal={() => dispatch(closeAllModals())}
      />

      <GetTerminalModal
        openModal={modals.getTerminal}
        closeModal={() => dispatch(closeModal("getTerminal"))}
        handleGetTerminalSuccess={handleLinkTerminalSuccess}
        handleCloseStatusModal={() => dispatch(closeAllModals())}
      />
    </>
  );
};

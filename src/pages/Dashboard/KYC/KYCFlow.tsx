import { useAppSelector, useAppDispatch } from "store/store.hooks";
import { selectCurrentStore, selectCurrentUser } from "store/slice/AuthSlice";
import { VerifyIdentityModal } from "pages/Dashboard/KYC/VerifyIdentityModal";
import { UpdateProfileModal } from "pages/Dashboard/KYC/UpdateProfileModal";
import { BvnModal } from "pages/Dashboard/KYC/BvnModal";
import { BvnSuccessModal } from "pages/Dashboard/KYC/BvnModal/BvnSuccessModal";
import { NinModal } from "pages/Dashboard/KYC/NinModal";
import { NinSuccessModal } from "pages/Dashboard/KYC/NinModal/NinSuccessModal";
import { UpdateBusinessNameModal } from "pages/Dashboard/KYC/UpdateBusinessNameModal";
import { CacModal } from "pages/Dashboard/KYC/CacModal";
import { VerificationSuccessModal } from "pages/Dashboard/KYC/KycComponents/VerificationSuccess/VerificationSuccess";
import {
  closeKYCModal,
  handleVerificationNextStep,
  resetKYCFlow,
  selectKYCModals,
  selectKYCStatus,
  setKYCOrigin,
  setKYCStatus,
} from "store/slice/KycSlice";
import { continueTerminalFlow } from "store/slice/TerminalSlice";

export const KYCFlow = () => {
  const dispatch = useAppDispatch();

  const kycModals = useAppSelector(selectKYCModals);
  const kycStatus = useAppSelector(selectKYCStatus);
  const userStore = useAppSelector(selectCurrentStore);
  const user = useAppSelector(selectCurrentUser);

  const handleNextStep = () => {
    if (!user?.bvn_verified_at) {
      dispatch(
        handleVerificationNextStep({
          currentStep: "updateProfile",
          nextModal: "bvn",
        })
      );
    } else if (!user?.nin_verified_at) {
      dispatch(
        handleVerificationNextStep({
          currentStep: "updateProfile",
          nextModal: "nin",
        })
      );
    } else if (user?.desired_kyc_tier === 2 && !userStore?.cac) {
      dispatch(
        handleVerificationNextStep({
          currentStep: "updateProfile",
          nextModal: "updateBusinessName",
        })
      );
    }
  };

  return (
    <>
      <VerifyIdentityModal
        openModal={kycModals.verifyIdentity}
        closeModal={() => dispatch(closeKYCModal("verifyIdentity"))}
        btnAction={() =>
          dispatch(
            handleVerificationNextStep({
              currentStep: "verifyIdentity",
              nextModal: "updateProfile",
            })
          )
        }
      />

      <UpdateProfileModal
        openModal={kycModals.updateProfile}
        closeModal={() => dispatch(closeKYCModal("updateProfile"))}
        handleNextStep={handleNextStep}
      />

      <BvnModal
        openModal={kycModals.bvn}
        closeModal={() => dispatch(closeKYCModal("bvn"))}
        handleSuccess={() =>
          dispatch(
            handleVerificationNextStep({
              currentStep: "bvn",
              nextModal: "bvnSuccess",
            })
          )
        }
        handleCancel={() => {
          dispatch(resetKYCFlow());
        }}
      />

      <BvnSuccessModal
        openModal={kycModals.bvnSuccess}
        closeModal={() => dispatch(closeKYCModal("bvnSuccess"))}
        handleContinueToNin={() => {
          dispatch(closeKYCModal("updateProfile"));
          dispatch(
            handleVerificationNextStep({
              currentStep: "bvnSuccess",
              nextModal: "nin",
            })
          );
        }}
      />

      <NinModal
        openModal={kycModals.nin}
        closeModal={() => dispatch(closeKYCModal("nin"))}
        handleSuccess={() => {
          dispatch(closeKYCModal("updateProfile"));
          if (user?.desired_kyc_tier === 2 && !userStore?.cac) {
            dispatch(
              handleVerificationNextStep({
                currentStep: "nin",
                nextModal: "ninSuccess",
              })
            );
          } else {
            dispatch(
              handleVerificationNextStep({
                currentStep: "nin",
                nextModal: "verificationSuccess",
              })
            );
          }
        }}
        handleCancel={() => {
          dispatch(resetKYCFlow());
        }}
      />

      <NinSuccessModal
        openModal={kycModals.ninSuccess}
        closeModal={() => dispatch(closeKYCModal("ninSuccess"))}
        handleContinueToCac={() =>
          dispatch(
            handleVerificationNextStep({
              currentStep: "ninSuccess",
              nextModal: "updateBusinessName",
            })
          )
        }
      />

      <UpdateBusinessNameModal
        openModal={kycModals.updateBusinessName}
        closeModal={() => dispatch(closeKYCModal("updateBusinessName"))}
        handleNextStep={() =>
          dispatch(
            handleVerificationNextStep({
              currentStep: "updateBusinessName",
              nextModal: "cac",
            })
          )
        }
        handleCancel={() => {
          dispatch(resetKYCFlow());
        }}
      />

      <CacModal
        openModal={kycModals.cac}
        closeModal={() => dispatch(closeKYCModal("cac"))}
        handleBack={() => {
          dispatch(closeKYCModal("cac"));
          dispatch(
            handleVerificationNextStep({
              currentStep: "cac",
              nextModal: "updateBusinessName",
            })
          );
        }}
        handleSuccess={() => {
          dispatch(setKYCStatus({ cacComplete: true }));
          dispatch(
            handleVerificationNextStep({
              currentStep: "cac",
              nextModal: "verificationSuccess",
            })
          );
        }}
        handleCancel={() => {
          dispatch(resetKYCFlow());
        }}
      />

      <VerificationSuccessModal
        openModal={kycModals.verificationSuccess}
        closeModal={() => {
          dispatch(setKYCStatus({ verificationComplete: true }));
          dispatch(closeKYCModal("verificationSuccess"));
          if (kycStatus.kycOrigin === "terminal") {
            dispatch(continueTerminalFlow());
            dispatch(setKYCOrigin(null));
          }
        }}
        fromCac={kycStatus.cacComplete}
      />
    </>
  );
};

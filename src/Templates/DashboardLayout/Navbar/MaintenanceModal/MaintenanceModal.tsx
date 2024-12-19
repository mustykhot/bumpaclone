import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { XIcon } from "assets/Icons/XIcon";
import { LargeMaintenanceIcon } from "assets/Icons/LargeMaintenanceIcon";
import Modal from "components/Modal";
import InputField from "components/forms/InputField";
import { useSetMaintenanceModeMutation } from "services";
import { showToast } from "store/store.hooks";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { setMaintenanceModeStatus } from "store/slice/ProfileSlice";
import { selectCurrentStore, setStoreDetails } from "store/slice/AuthSlice";
import { handleError } from "utils";
type MaintainanceModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const MaintenanceModal = ({
  closeModal,
  openModal,
}: MaintainanceModalProps) => {
  const dispatch = useAppDispatch();
  const [setMaintenanceMode, { isLoading }] = useSetMaintenanceModeMutation();
  const userStore = useAppSelector(selectCurrentStore);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const handleMaintenaceMode = async () => {
    let payload = {
      message: userStore?.online ? maintenanceMessage : "",
      status: userStore?.online ? true : false,
    };
    try {
      let result = await setMaintenanceMode(
        payload?.status ? payload : { status: false }
      );
      if ("data" in result) {
        showToast("Maintenance mode updated", "success");
        setMaintenanceMessage("");
        dispatch(setStoreDetails(result?.data?.store));
        dispatch(
          setMaintenanceModeStatus(result?.data?.store?.online || false)
        );
        closeModal();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    if (userStore?.settings?.maintenance_message) {
      setMaintenanceMessage(userStore?.settings?.maintenance_message);
    }
  }, [userStore]);

  return (
    <>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div className={`cancel_subscription_modal success`}>
          <div className="cancel_section">
            <div className="text_box"></div>

            <IconButton
              onClick={() => {
                closeModal();
              }}
              className="icon_button_container"
            >
              <XIcon />
            </IconButton>
          </div>

          <div className="cancel_successful_container">
            <LargeMaintenanceIcon />
            <h3>
              {userStore?.online
                ? "Set to maintenance mode"
                : "Turn off Maintenance Mode"}
            </h3>
            {userStore?.online ? (
              <p>
                Setting your store to maintenance mode means your storefront
                would be offline and customers can’t shop on it.
              </p>
            ) : (
              <p>
                Turning off your store maintenance mode means your storefront
                would be online and customers can shop on it.
              </p>
            )}
            {userStore?.online ? (
              <InputField
                label={"Custom Message"}
                value={maintenanceMessage}
                containerClass="w-full mb-6"
                onChange={(e) => {
                  setMaintenanceMessage(e.target.value);
                }}
              />
            ) : (
              ""
            )}

            <div className="btn_box">
              <LoadingButton
                variant="contained"
                onClick={handleMaintenaceMode}
                loading={isLoading}
              >
                {userStore?.online
                  ? "Set to maintenance mode"
                  : "Turn off Maintenance Mode"}
              </LoadingButton>
              <Button onClick={closeModal} className="done">
                Cancel{" "}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

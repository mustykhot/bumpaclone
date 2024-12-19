import { Button, IconButton } from "@mui/material";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import Modal from "components/Modal";
import power from "assets/images/bigpower.png";
import {
  useReactivateLocationMutation,
  useReactivateStaffMutation,
} from "services";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { setExtra } from "@sentry/react";
type Props = {
  openModal: boolean;
  closeModal: () => void;
  item?: any;
  slots?: any;
  selectedIds?: any;
  reactivate_all: boolean;
  type: string;
  itemName?: string;
};
const ReactivateStaffModal = ({
  openModal,
  closeModal,
  item,
  slots,
  selectedIds,
  reactivate_all,
  type,
  itemName,
}: Props) => {
  const [reactivateStaff, { isLoading: loadReactivate }] =
    useReactivateStaffMutation();

  const [reactivateLocation, { isLoading: loading }] =
    useReactivateLocationMutation();
  const [extraError, setExtraError] = useState<any>();

  const reactivateStaffFnc = async () => {
    try {
      const result = await reactivateStaff({
        staff_ids: reactivate_all ? [] : [item.id],
        all: reactivate_all,
      });
      if ("data" in result) {
        showToast("Staff reactivated is now active", "success");
        closeModal();
      } else {
        // @ts-ignore
        handleError(result.error.data.error ? result.error.data.error : result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const reactivateLocationFnc = async () => {
    try {
      const result = await reactivateLocation({
        location_ids: reactivate_all ? [] : [item.id],
        all: reactivate_all,
      });
      if ("data" in result) {
        showToast("Location reactivated is now active", "success");
        closeModal();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };
  const handleClick = () => {
    if (type == "staff") {
      reactivateStaffFnc();
    } else if (type === "location") {
      reactivateLocationFnc();
    }
  };
  return (
    <div>
      <Modal
        closeOnOverlayClick={true}
        openModal={openModal}
        closeModal={closeModal}
      >
        <div className="extra_wrapper success reactivate_md">
          <IconButton
            type="button"
            className="close_btn"
            onClick={() => closeModal()}
          >
            <CloseSqIcon />
          </IconButton>
          <img src={power} alt="" />
          <div className="text_content">
            <h3>Confirm Reactivation</h3>
            {reactivate_all ? (
              <p>
                You’re about to reactivate all deactivated{" "}
                {type === "staff" ? "staff accounts" : "locations"}{" "}
              </p>
            ) : (
              <p>
                You’re about to reactivate{" "}
                <span className="product_name">
                  {" "}
                  {itemName ? itemName : item?.name}{" "}
                </span>
                from the available <span className="slot_count">{slots}</span>{" "}
                {type === "staff" ? "staff" : "location"} account slot.
              </p>
            )}

            <LoadingButton
              className="pay_btn"
              type="button"
              onClick={handleClick}
              loading={loadReactivate}
            >
              Yes, Reactivate
            </LoadingButton>
            <Button
              className="pay_btn clear"
              type="button"
              onClick={() => closeModal()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default ReactivateStaffModal;

import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "./style.scss";
import { handleError } from "utils";
import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import InputField from "components/forms/InputField";
import { useParams } from "react-router-dom";
import {
  useEditFreeUrlMutation,
  useUpdateProductStockMutation,
} from "services";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { SuccessMarkIcon } from "assets/Icons/SuccessMarkIcon";
import { ErrorMarkIcon } from "assets/Icons/ErrorMarkIcon";
import { SuccessfulConnectionModal } from "pages/Dashboard/ConnectedApps/widgets/Modals/SuccessfulConnectionModal";
import { selectCurrentStore, setStoreDetails } from "store/slice/AuthSlice";

type Props = {
  openModal: boolean;
  closeModal: () => void;
};

export const EditDefaultUrlModal = ({ openModal, closeModal }: Props) => {
  const [storeUrl, setStoreUrl] = useState("");
  const userStore = useAppSelector(selectCurrentStore);
  const [editFreeUrl, { isLoading }] = useEditFreeUrlMutation();
  const [editSuccessModal, setEditSucessMoal] = useState(false);
  const dispatch = useAppDispatch();
  const onSubmit = async () => {
    let payload = {
      new_url: storeUrl,
    };
    try {
      let result = await editFreeUrl({
        body: payload,
        id: userStore?.id || "",
      });
      if ("data" in result) {
        // showToast("Saved successfully", "success");
        if (result.data.status) {
          setEditSucessMoal(true);
          dispatch(setStoreDetails(result.data.store));
          closeModal();
        } else {
          showToast(result.data.message, "error");
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (userStore) {
      setStoreUrl(userStore.subdomain || "");
    }
  }, [userStore]);

  return (
    <>
      <SuccessfulConnectionModal
        openModal={editSuccessModal}
        title="Store URL Updated"
        description={`You’ve successfully changed your store URL to ${storeUrl}.bumpa.shop It may take a while before it becomes active.`}
        closeModal={() => {
          setEditSucessMoal(false);
          setStoreUrl("");
        }}
        btnAction={() => {
          setEditSucessMoal(false);
          setStoreUrl("");
        }}
        btnText="Done"
      />
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children pd_edit_default_url">
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              className="remove_border"
              title={"Edit Store URL"}
            >
              <p className="modal_description">
                You can edit your website url to a new one. This is the website
                your customers will visit to buy from your store
              </p>
            </ModalRightTitle>
            <div className="form_box">
              <InputField
                name="name"
                label="Your Store URL"
                placeholder="Enter domain"
                value={storeUrl}
                onChange={(e: any) => {
                  setStoreUrl(e.target.value);
                }}
                suffix={<p className="url_suffix">.bumpa.shop</p>}
              />
              {/* 
              <div
                className={`check_status_box ${true ? "success" : "error"} `}
              >
                {false ? <SuccessMarkIcon /> : <ErrorMarkIcon />}

                <p>
                  <span>{storeUrl}</span>.bumpa.shop is {true ? "" : "not"}
                  available
                </p>
              </div> */}
            </div>
          </div>

          <div className=" bottom_section">
            <Button type="button" className="cancel" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="button"
              className="save"
              disabled={storeUrl ? false : true}
              onClick={() => {
                onSubmit();
              }}
            >
              {isLoading ? (
                <CircularProgress sx={{ color: "#ffffff" }} size="1.5rem" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </ModalRight>
    </>
  );
};

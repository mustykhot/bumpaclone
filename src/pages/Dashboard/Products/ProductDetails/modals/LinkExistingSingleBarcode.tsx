import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { ScanIcon } from "assets/Icons/ScanIcon";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { handleError } from "utils";
import InputField from "components/forms/InputField";
import { useLinkExistingBarcodeMutation } from "services";
import { showToast } from "store/store.hooks";

import "./style.scss";

type Props = {
  openModal: boolean;
  closeModal: () => void;
};

export const LinkExistingSingleBarcodeModal = ({
  openModal,
  closeModal,
}: Props) => {
  const { id } = useParams();
  const [barcode, setBarcode] = useState("");
  const [linkBarcode, { isLoading }] = useLinkExistingBarcodeMutation();
  const ref = useRef<any>(null);
  const onSubmit = async () => {
    let payload = {
      barcode,
    };

    try {
      let result = await linkBarcode({ body: payload, id: Number(id || 0) });
      if ("data" in result) {
        showToast("Barcode Linked Successfuly", "success");
        closeModal();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    ref?.current?.focus();
  }, []);
  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children pd_show_variations">
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              className="remove_border"
              title={"Link Existing Barcode"}
            >
              <p className="text-[#5C636D] text-[14px]">
                Enter barcode or click scan icon to scan barcode and link
                product
              </p>
            </ModalRightTitle>
            <div className="form_box">
              <InputField
                placeholder="Enter or scan barcode"
                ref={ref}
                label="Barcode"
                value={barcode}
                onChange={(e) => {
                  setBarcode(e.target.value);
                }}
                suffix={
                  <IconButton
                    onClick={() => {
                      ref?.current?.focus();
                    }}
                  >
                    <ScanIcon stroke="#009444" />
                  </IconButton>
                }
              />
            </div>
          </div>

          <div className=" bottom_section">
            <Button type="button" className="cancel" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="button"
              className="save"
              disabled={barcode ? false : true}
              onClick={() => {
                onSubmit();
              }}
            >
              {isLoading ? (
                <CircularProgress sx={{ color: "#ffffff" }} size="1.5rem" />
              ) : (
                "Link Barcode"
              )}
            </Button>
          </div>
        </div>
      </ModalRight>
    </>
  );
};

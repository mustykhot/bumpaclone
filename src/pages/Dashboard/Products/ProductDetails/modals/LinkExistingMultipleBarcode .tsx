import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { ScanIcon } from "assets/Icons/ScanIcon";
import InputField from "components/forms/InputField";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { useLinkExistingBarcodeMutation } from "services";
import { handleError } from "utils";
import { showToast } from "store/store.hooks";
import "./style.scss";

type Props = {
  openModal: boolean;
  closeModal: () => void;
  variants: any;
};

const SingleVariant = ({
  variant,
  index,
  handleFeildsChange,
}: {
  variant: any;
  index: number;
  handleFeildsChange: any;
}) => {
  const ref = useRef<any>(null);

  return (
    <div className="single_variant_scan">
      <div className="image_and_name">
        <img src={variant.image} alt="variant" />
        <p>{variant.variant}</p>
      </div>
      <InputField
        placeholder="Enter or scan barcode"
        ref={ref}
        value={variant.barcode}
        onChange={(e) => {
          handleFeildsChange(e.target.value, index);
        }}
        containerClass="input_scan"
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
  );
};

export const LinkExistingMultipleBarcodeModal = ({
  openModal,
  closeModal,
  variants,
}: Props) => {
  const { id } = useParams();
  const [formValues, setFormValues] = useState<any[]>([]);
  const [linkBarcode, { isLoading }] = useLinkExistingBarcodeMutation();
  const onSubmit = async () => {
    let variantList = formValues?.map((item) => {
      return {
        id: item.id,
        barcode: item.barcode,
      };
    });
    let payload = {
      product_variations: variantList,
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

  const handleFeildsChange = (value: any, i: number) => {
    let newFormValues = [...formValues];
    newFormValues[i].barcode = value;
    setFormValues([...newFormValues]);
  };
  useEffect(() => {
    setFormValues(
      variants?.map((item: any) => {
        return { ...item, barcode: item.barcode ? item.barcode : "" };
      })
    );
  }, [variants]);
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
                Enter barcodes or click scan icon to scan barcodes and link each
                variations.
              </p>
            </ModalRightTitle>
            <div className="form_box">
              {formValues && formValues?.length
                ? formValues?.map((item: any, i: number) => (
                    <SingleVariant
                      handleFeildsChange={handleFeildsChange}
                      index={i}
                      variant={item}
                    />
                  ))
                : ""}
            </div>
          </div>

          <div className=" bottom_section">
            <Button type="button" className="cancel" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="button"
              className="save"
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

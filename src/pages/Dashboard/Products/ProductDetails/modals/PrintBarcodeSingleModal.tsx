import { useEffect, useRef, useState } from "react";
import Barcode from "react-jsbarcode";
import { useReactToPrint } from "react-to-print";
import { useParams } from "react-router";
import { Checkbox, CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import Modal from "components/Modal";
import InputField from "components/forms/InputField";
import { selectCurrentStore, selectUserLocation } from "store/slice/AuthSlice";
import { showToast, useAppSelector } from "store/store.hooks";
import { usePrintBarCodeMutation } from "services";
import { formatPrice, handleError } from "utils";
import { getObjWithValidValuesAndList } from "utils/constants/general";
import "./style.scss";

type PrintBarcodeSingleModal = {
  openModal: boolean;
  closeModal: () => void;
  product: any;
  variantId?: number;
};

export const PrintBarcodeSingleModal = ({
  closeModal,
  openModal,
  product,
  variantId,
}: PrintBarcodeSingleModal) => {
  const store = useAppSelector(selectCurrentStore);
  const componentRef = useRef() as any;
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [printValue, setPrintValue] = useState<any[]>([]);

  const [printCode, { isLoading: printLoad }] = usePrintBarCodeMutation();
  const { id } = useParams();
  const userLocation = useAppSelector(selectUserLocation);
  const [confirmForm, setConfirmForm] = useState({
    name: false,
    price: false,
    copy_per_product: "1",
  });
  const onSubmit = async () => {
    let variantIdList = variantId
      ? product?.variations
          ?.map((item: any) => {
            return item.id;
          })
          .filter((el: any) => typeof el === "number")
          .filter((id: any) => id === variantId)
      : product?.variations
          ?.map((item: any) => {
            return item.id;
          })
          .filter((el: any) => typeof el === "number");
    const payload = {
      product_ids: product?.variations?.length ? null : [`${id}`],
      product_variation_ids: variantIdList,
      location_id: userLocation?.id,
      config: {
        ...confirmForm,
      },
    };
    try {
      let result = await printCode(getObjWithValidValuesAndList(payload));
      if ("data" in result) {
        let responseData = result.data.data;
        let repeatedResult = [];
        for (let i = 0; i < responseData?.length; i++) {
          for (let j = 0; j < Number(confirmForm.copy_per_product); j++) {
            repeatedResult.push(responseData[i]);
          }
        }
        setPrintValue(repeatedResult);
        showToast("Successful", "success");
        closeModal();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    if (printValue?.length) {
      handlePrint();
      setPrintValue([]);
    }
  }, [printValue]);
  return (
    <>
      <div className="cover_barcode_to_print hidden ">
        <div className="print_box" ref={componentRef}>
          {printValue?.map((item) => (
            <div className="single_barcode_print_box">
              <div className="store_name">
                <p>{store?.name} Store</p>
              </div>
              <div className="other_deatils">
                {item.name && confirmForm.name && (
                  <p className="product_name"> {item.name} </p>
                )}
                {item?.optionValues?.length ? (
                  <div className="options_display">
                    {item?.optionValues?.map((el: any) => (
                      <p>
                        {el.option}: {el.value}
                      </p>
                    ))}
                  </div>
                ) : (
                  ""
                )}
                {item.price && confirmForm.price && (
                  <p className="price">{formatPrice(Number(item.price))}</p>
                )}
                <div className="code_border">
                  <Barcode value={item.barcode} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div className="change_value_container">
          <div className="form_section">
            <div className="confirm_checkboxes">
              <Checkbox
                checked={confirmForm.name}
                onChange={() => {
                  setConfirmForm({
                    ...confirmForm,
                    name: !confirmForm.name,
                  });
                }}
              />
              <p>Show product names on barcode</p>
            </div>
            <div className="confirm_checkboxes">
              <Checkbox
                checked={confirmForm.price}
                onChange={() => {
                  setConfirmForm({
                    ...confirmForm,
                    price: !confirmForm.price,
                  });
                }}
              />
              <p>Show product prices on barcodes</p>
            </div>

            <InputField
              label="Copy per product"
              value={confirmForm.copy_per_product}
              placeholder="Enter how many copies per product"
              type="number"
              onChange={(e) => {
                setConfirmForm({
                  ...confirmForm,
                  copy_per_product: e.target.value,
                });
              }}
            />

            <Button
              onClick={() => {
                if (!printLoad) {
                  onSubmit();
                }
              }}
              className="primary_styled_button w-full"
              variant="contained"
            >
              {printLoad ? (
                <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
              ) : (
                "Print Barcodes"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

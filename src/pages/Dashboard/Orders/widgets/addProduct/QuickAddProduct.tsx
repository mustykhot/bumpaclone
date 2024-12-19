import { Button, Checkbox, CircularProgress } from "@mui/material";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { useState } from "react";
import InputField from "components/forms/InputField";
import { useCreateProductMutation } from "services";
import { showToast, useAppSelector } from "store/store.hooks";
import { selectUserLocation } from "store/slice/AuthSlice";
import { getCurrencyFnc, handleError } from "utils";
import { IMAGEURL } from "utils/constants/general";
import {
  formatNumberWithCommas,
  removeFormattedNumerComma,
} from "components/forms/ValidatedInput";
type ProductModalProps = {
  openModal: boolean;
  closeModal: () => void;
  extraFnc?: (item: any) => void;
  defaultExtraFnc?: (item: any) => void;
};

export const QuickAddProductModal = ({
  openModal,
  closeModal,
  extraFnc,
  defaultExtraFnc,
}: ProductModalProps) => {
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [status, setStatus] = useState(false);
  const userLocation = useAppSelector(selectUserLocation);

  const submitFnc = async () => {
    const payload = {
      title,
      price: Number(removeFormattedNumerComma(price)),
      stock: stock ? Number(stock) : 1,
      status: status ? 1 : 0,
      location_id: userLocation?.id,
    };
    try {
      let result = await createProduct(payload);
      if ("data" in result) {
        showToast("Created successfully", "success");
        if (typeof _cio !== "undefined") {
          _cio.track("web_product_add", payload);
        }
        if (typeof mixpanel !== "undefined") {
          mixpanel.track("web_product_add", payload);
        }
        let item = result.data.product;
        defaultExtraFnc && defaultExtraFnc(item);
        extraFnc &&
          extraFnc({
            id: item.id,
            url: item.url,
            name: item.name,
            price: item.price,
            total: item.price,
            stock: item.stock,
            thumbnail_url: item.alt_image_url,
            image: item.alt_image_url,
          });
        resetFnc();
        closeModal();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const resetFnc = () => {
    setStock("");
    setPrice("");
    setTitle("");
  };

  return (
    <ModalRight
      closeModal={() => {
        resetFnc();
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="modal_right_children">
        <div className="top_section">
          <ModalRightTitle
            closeModal={() => {
              closeModal();
            }}
            title="Create Product"
          />

          <div className="brief_form ">
            <InputField
              name="title"
              label="Product Name"
              value={title}
              required={true}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <InputField
              name="price"
              label="Product Price"
              value={price}
              prefix={
                <p className="text-[#9BA2AC] font-semibold text-[20px]">
                  {getCurrencyFnc()}
                </p>
              }
              type="text"
              required={true}
              onChange={(e) => {
                if (
                  !isNaN(parseInt(e.target.value?.replace(/,/g, ""))) ||
                  e.target.value.length === 0
                ) {
                  if (e.target.value.length === 0) {
                    setPrice("");
                  } else {
                    setPrice(
                      formatNumberWithCommas(
                        parseFloat(String(e.target.value)?.replace(/,/g, ""))
                      )
                    );
                  }
                }
              }}
            />
            <InputField
              name="stock"
              label="Stock Quantity"
              value={stock}
              type="number"
              onChange={(e) => {
                setStock(e.target.value);
              }}
            />
            <div className="check_box flex items-center">
              <Checkbox
                checked={status}
                onChange={() => {
                  setStatus(!status);
                }}
                sx={{
                  paddingLeft: 0,
                }}
              />{" "}
              <p className="text-[14px]">Publish product</p>
            </div>
          </div>
        </div>

        <div className="productOptionSubmit bottom_section">
          <Button
            type="button"
            className="cancel"
            onClick={() => {
              resetFnc();
              closeModal();
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={title && price ? false : true}
            className="save"
            onClick={() => {
              submitFnc();
            }}
          >
            {isLoading ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};

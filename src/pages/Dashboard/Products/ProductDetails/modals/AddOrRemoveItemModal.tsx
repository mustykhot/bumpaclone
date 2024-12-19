import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import InputField from "components/forms/InputField";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { handleError } from "utils";
import { useUpdateProductStockMutation } from "services";
import { showToast } from "store/store.hooks";
import "./style.scss";

type Props = {
  openModal: boolean;
  closeModal: () => void;
  type: string;
  variantId?: number;
  productId?: number;
};

export const reasonList = [
  { name: "Introducing new products", value: "Introducing new products" },
  { name: "Preparing for sales", value: "Preparing for sales" },
  { name: "Item Restock", value: "Item Restock" },
  { name: "Increasing product options", value: "Increasing product options" },
];

export const AddOrRemoveItemModal = ({
  openModal,
  closeModal,
  type,
  variantId,
  productId,
}: Props) => {
  const { id } = useParams();
  const [updateStock, { isLoading }] = useUpdateProductStockMutation();
  const [formData, setFormData] = useState({
    quantity: "",
    reason: "",
  });
  const handleInputs = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const onSubmit = async () => {
    let payload: any;
    if (variantId) {
      payload = {
        action: type,
        variations: [
          {
            product_variation_id: variantId,
            quantity: Number(formData?.quantity),
          },
        ],
      };
    } else {
      payload = {
        action: type,
        quantity: Number(formData?.quantity),
      };
    }

    try {
      let result = await updateStock({
        body: payload,
        id: Number(productId ? productId : id ? id : 0),
      });
      if ("data" in result) {
        showToast("Saved Successfuly", "success");
        setFormData({
          quantity: "",
          reason: "",
        });
        closeModal();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };
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
              title={type === "add" ? "Add Item" : "Remove Item"}
            ></ModalRightTitle>
            <div className="form_box">
              <InputField
                name="quantity"
                placeholder="How many?"
                type={"number"}
                value={formData?.quantity}
                onChange={(e: any) => {
                  handleInputs(e);
                }}
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
              disabled={formData?.quantity ? false : true}
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

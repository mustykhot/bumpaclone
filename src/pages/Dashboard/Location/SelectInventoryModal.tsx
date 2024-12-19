import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import NormalSelectField from "components/forms/NormalSelectField";
import { useGetLocationsQuery } from "services";
import { showToast } from "store/store.hooks";
import "./style.scss";
import { IndicatorComponent } from "components/IndicatorComponent";
import InfoBox from "components/InfoBox";

type ProductModalProps = {
  openModal: boolean;
  closeModal: () => void;
  productsToMove: any[];
  destinationLocation: string;
  setDestinationLocation: (val: string) => void;
  duplicateAllFnc: () => void;
  btnAction: (list: any[]) => void;
  moveAction: string;
  isDuplicateAll: boolean;
};

function isValidMove(array: any[]) {
  for (const item of array) {
    const quantityToMove = parseInt(item.quantityToMove);
    const quantity = parseInt(item.quantity);
    if (quantityToMove < 0 || quantityToMove > quantity) {
      return false;
    }
  }
  return true;
}

const SingleProduct = ({
  product,
  handleFeildsChange,
  index,
}: {
  product: any;
  handleFeildsChange: any;
  index: number;
}) => {
  const [val, setVal] = useState("");
  return (
    <div className="single_related_product location_related_product">
      <div className="related_product_flex">
        <div className="left_container">
          <img src={product.thumbnail_url} alt="product" />
        </div>
        <div className={`right_container  `}>
          <div className="left_side">
            <p className="name">{product.name}</p>
            <div className="bottom">
              {Number(product.quantity) === 0 ? (
                <p className="count text-[red]">Out of stock</p>
              ) : (
                <p className="count">{product.quantity} in Stock</p>
              )}

              {product.status === 0 && (
                <p className="isPublished">Unpuplishd</p>
              )}
            </div>
          </div>
          <div className="price_container">
            <input
              value={product.quantityToMove}
              type="number"
              placeholder=""
              onChange={(e) => {
                setVal(e.target.value);
                handleFeildsChange(e.target.value, index);
              }}
            />
            {Number(val) > product.quantity ? (
              <p className="error_input ">Exceeds stock</p>
            ) : Number(val) < 0 ? (
              <p className="error_input ">Quantity less than 0</p>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SelectInventoryModal = ({
  openModal,
  closeModal,
  productsToMove,
  destinationLocation,
  setDestinationLocation,
  moveAction,
  btnAction,
  isDuplicateAll,
  duplicateAllFnc,
}: ProductModalProps) => {
  const [step, setStep] = useState(0);
  const { id } = useParams();
  const { data, isLoading, isFetching, isError } = useGetLocationsQuery();
  const [formValues, setFormValues] = useState(
    productsToMove ? productsToMove : []
  );
  const onSubmit = () => {
    if (isDuplicateAll) {
      duplicateAllFnc();
    } else {
      if (step === 0) {
        setStep(1);
      } else {
        if (isValidMove(formValues)) {
          btnAction(formValues);
        } else {
          showToast(
            "Some quantities are invalid. Please check the product quantities.",
            "error"
          );
        }
      }
    }
  };

  const handleFeildsChange = (value: any, i: number) => {
    let newFormValues = [...formValues];
    newFormValues[i].quantityToMove = value;
    setFormValues([...newFormValues]);
  };
  useEffect(() => {
    let preparedValues = productsToMove.map((item) => {
      return { ...item, quantityToMove: item.quantity };
    });
    setFormValues(preparedValues);
  }, [productsToMove]);

  return (
    <>
      <ModalRight
        closeOnOverlayClick={false}
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children select_inventory_modal">
          <div className="top_section" id="scroller_top">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              title={
                step === 0
                  ? `${
                      moveAction === "duplicate" ? "Duplicate" : "Move"
                    } Inventory`
                  : `Confirm inventory ${
                      moveAction === "duplicate" ? "duplicate" : "move"
                    }`
              }
            />
            <div className="add_related_product_container">
              <p className="question_for_move">
                Which store location do you want to
                {moveAction === "duplicate" ? " duplicate" : " move"} products
                to?
              </p>
              <NormalSelectField
                name="location"
                defaultValue={destinationLocation}
                selectOption={
                  data
                    ? data?.data
                        .filter((item) => `${item.id}` !== `${id}`)
                        .map((el) => {
                          return { key: el.name, value: `${el.id}` };
                        })
                    : []
                }
                onChange={(val: any) => {
                  setDestinationLocation(val);
                }}
                label="Store location"
              />

              {step === 1 && !isDuplicateAll && (
                <div className="show_selected">
                  <Button
                    onClick={() => {
                      closeModal();
                      setStep(0);
                      setDestinationLocation("");
                    }}
                    variant="outlined"
                  >
                    Edit selection
                  </Button>
                  {moveAction === "move" && (
                    <InfoBox
                      text="Out-of-stock products are exempt from the movement"
                      color="yellow"
                    />
                  )}

                  <div className="list_selected_products">
                    {formValues.map((item, i: number) => (
                      <SingleProduct
                        handleFeildsChange={handleFeildsChange}
                        product={item}
                        index={i}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="productOptionSubmit bottom_section">
            <Button type="button" className="cancel" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={destinationLocation ? false : true}
              className="save"
              onClick={onSubmit}
            >
              Continue
            </Button>
          </div>
        </div>
      </ModalRight>
    </>
  );
};

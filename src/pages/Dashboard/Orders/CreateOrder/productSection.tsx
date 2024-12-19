import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { useState, useEffect } from "react";
import { Toggle } from "components/Toggle";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { Button } from "@mui/material";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import IconButton from "@mui/material/IconButton";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { SelectProductModal } from "../widgets/product/SelectProductModal";
import { AddDiscountModal } from "../widgets/discount/AddDiscount";
import { SelectShippingModal } from "../widgets/shipping/SelectShipping";
import { SelectTaxModal } from "../widgets/tax/SelectTax";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  addToCart,
  decreaseCart,
  getTotals,
  selectProductItems,
  selectTotal,
} from "store/slice/OrderSlice";
import { IMAGEURL, alt_image_url } from "utils/constants/general";
import { showToast } from "store/store.hooks";
import { useFormContext } from "react-hook-form";
import { EditIcon } from "assets/Icons/EditIcon";
import { formatNumber, formatPrice, getCurrencyFnc } from "utils";
import DropDownWrapper from "components/DropDownWrapper";
import { ShopingIcon } from "assets/Icons/Sidebar/ShopingIcon";
import shipbubble from "assets/images/shipbubble.png";
import { AutomatedShippingModal } from "./automatedShippingModal";

type ProductSectionProps = {
  setOpenCreateProductModal?: (val: boolean) => void;
  isEdit?: boolean;
};

const ProductListing = ({
  product,
  isEdit = false,
}: {
  product?: any;
  isEdit?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { watch, setValue } = useFormContext();
  return (
    <div className="product_listing_container">
      <img
        src={`${
          product?.thumbnail_url
            ? product?.thumbnail_url?.includes("amazon")
              ? `${product.thumbnail_url}`
              : `${IMAGEURL}${product.thumbnail_url}`
            : alt_image_url
        } `}
        alt="product"
      />
      <p className="name">{product.name}</p>
      <p className="price">
        {getCurrencyFnc()}
        {formatNumber(product.price)}
      </p>
      <div className="actions">
        <IconButton
          type="button"
          className="icon_button_container"
          onClick={() => {
            dispatch(decreaseCart(product));

            if (watch("shipping_record_id")) {
              setValue("shipping_record_id", null);
              setValue("automatedShippingCourier", null);
              setValue("shipping_price", null);

              showToast(
                "The selected shipping record has been cleared. Please re-add it.",
                "warning",
                6000
              );
            }
          }}
        >
          {product.quantity === 1 ? <TrashIcon /> : <RemoveIcon />}
        </IconButton>
        <p className="count">{product.quantity}</p>
        <IconButton
          type="button"
          className="icon_button_container primary_btn"
          onClick={() => {
            dispatch(addToCart(product));

            if (watch("shipping_record_id")) {
              setValue("shipping_record_id", "");
              setValue("automatedShippingCourier", null);
              setValue("shipping_price", "");
              showToast(
                "The selected shipping record has been cleared. Please re-add it.",
                "warning",
                6000
              );
            }
          }}
          disabled={product.quantity === product.stock}
        >
          <PlusIcon />
        </IconButton>
      </div>
    </div>
  );
};

export const ProductSection = ({
  setOpenCreateProductModal,
  isEdit = false,
}: ProductSectionProps) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openDiscountModal, setOpenDiscountModal] = useState(false);
  const [openShippingModal, setOpenShippingModal] = useState(false);
  const [openAutomatedShippingModal, setOpenAutomatedshippingModal] =
    useState(false);
  const [openTaxModal, setOpenTaxModal] = useState(false);
  const [openBriefProductModal, setOpenBriefProductModal] = useState(false);
  const dispatch = useAppDispatch();
  const addedProducts = useAppSelector(selectProductItems);
  const total = useAppSelector(selectTotal);
  const { watch, setValue } = useFormContext();
  useEffect(() => {
    if (addedProducts.length) {
      dispatch(getTotals());
    }
  }, [addedProducts, dispatch]);

  const getDiscount = () => {
    let discount_val: number = 0;
    if (watch("discount_type") === "percentage") {
      discount_val = (watch("total") * watch("discount_val")) / 100;
    } else {
      discount_val = watch("discount_val") || 0;
    }
    setValue("discount", discount_val);
    return discount_val;
  };

  let taxAmount = (
    ((watch("taxPercent") || 0) / 100) *
    (total - getDiscount())
  ).toFixed(2);
  useEffect(() => {
    if (total || watch("taxPercent")) {
      let amount = (
        (watch("taxPercent") / 100) *
        (total - getDiscount())
      ).toFixed(2);
      setValue("tax", amount);
    }
  }, [total, watch("taxPercent")]);

  useEffect(() => {
    setValue("total", total);
  }, [total]);

  return (
    <>
      <SelectProductModal
        openModal={openProductModal}
        setOpenCreateProductModal={setOpenCreateProductModal}
        closeModal={() => {
          setOpenProductModal(false);
        }}
      />

      <AutomatedShippingModal
        openModal={openAutomatedShippingModal}
        closeModal={() => {
          setOpenAutomatedshippingModal(false);
        }}
      />

      <AddDiscountModal
        openModal={openDiscountModal}
        closeModal={() => {
          setOpenDiscountModal(false);
        }}
      />
      <SelectShippingModal
        openModal={openShippingModal}
        closeModal={() => {
          setOpenShippingModal(false);
        }}
      />
      <SelectTaxModal
        openModal={openTaxModal}
        closeModal={() => {
          setOpenTaxModal(false);
        }}
      />
      <div className="pd_product_section accordion_sections">
        <Accordion className="accordion" expanded={expanded}>
          <AccordionSummary
            className="accordion_summary"
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <p>Products ({addedProducts && addedProducts.length})</p>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <div
                className={`display_product_flex ${
                  addedProducts.length ? "bordered" : ""
                }`}
              >
                {addedProducts.length
                  ? addedProducts.map((item: any) => {
                      return (
                        <ProductListing
                          product={item}
                          key={item.id}
                          isEdit={isEdit}
                        />
                      );
                    })
                  : ""}
              </div>
              <div
                className={`select_product ${
                  addedProducts.length ? "" : "nomargin"
                }`}
              >
                <Button
                  onClick={() => {
                    setOpenProductModal(true);
                  }}
                  variant="outlined"
                >
                  Select Products
                </Button>
                <Button
                  onClick={() => {
                    setOpenCreateProductModal &&
                      setOpenCreateProductModal(true);
                  }}
                  variant="outlined"
                >
                  Add a new product
                </Button>
              </div>
              {addedProducts.length ? (
                <>
                  <div className="total sub">
                    <p>Sub Total</p>
                    <span className="result_collected">
                      {formatPrice(total)}
                      <IconButton className="icon_btn"></IconButton>
                    </span>
                  </div>
                  <div className="extra_action">
                    <p className="action_name">Discount</p>
                    {watch("discount_val") ? (
                      <div className="flex gap-1 items-center">
                        <span className="dash_line"></span>
                        <span className="result_collected">
                          {watch("discount_type") === "percentage"
                            ? `${watch("discount_val")}%`
                            : `${getCurrencyFnc()} ${watch("discount_val")}`}
                          <IconButton
                            onClick={() => {
                              setOpenDiscountModal(true);
                            }}
                            className="icon_btn"
                          >
                            <EditIcon stroke="#009444" />
                          </IconButton>
                        </span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          setOpenDiscountModal(true);
                        }}
                        className="button"
                        endIcon={<ChevronDownIcon />}
                      >
                        Add discount
                      </Button>
                    )}
                  </div>

                  <div className="extra_action column">
                    <div className="flex justify-between items-center">
                      <p className="action_name">Shipping Fee</p>
                      <DropDownWrapper
                        origin="right"
                        closeOnChildClick
                        className="shipping-methods-drop-down"
                        action={
                          <Button className="" endIcon={<ChevronDownIcon />}>
                            Shipping Method
                          </Button>
                        }
                      >
                        <div className="cover_buttons">
                          <ul className="select_list btn_list">
                            <li>
                              <Button
                                startIcon={<ShopingIcon stroke="#5C636D" />}
                                onClick={() => {
                                  setOpenShippingModal(true);
                                }}
                              >
                                Saved Shipping Methods
                              </Button>
                            </li>
                            <li>
                              <Button
                                startIcon={
                                  <img
                                    src={shipbubble}
                                    className="w-[18px] h-[18px]"
                                  />
                                }
                                onClick={() => {
                                  if (watch("customer_details")) {
                                    setOpenAutomatedshippingModal(true);
                                  } else {
                                    showToast(
                                      "Please select a customer",
                                      "warning"
                                    );
                                  }
                                }}
                              >
                                Automated Shipping
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </DropDownWrapper>
                    </div>
                    {watch("shipping_price") &&
                      !watch("automatedShippingCourier") && (
                        <div className="flex justify-between items-center mt-2">
                          <p className="action_name">Shipping Amount</p>
                          <span className="result_collected">
                            {getCurrencyFnc()}
                            {watch("shipping_price")}
                            <IconButton
                              onClick={() => {
                                setValue("shipping_price", "");
                              }}
                              className="icon_btn"
                            >
                              <TrashIcon stroke="#D90429" />
                            </IconButton>
                          </span>
                        </div>
                      )}

                    {watch("automatedShippingCourier") && (
                      <div className="flex justify-between items-center mt-2">
                        <div className="courier-name-img">
                          <img
                            src={watch("automatedShippingCourier")?.img}
                            alt="courier"
                          />
                          <p>{watch("automatedShippingCourier")?.name}</p>
                        </div>

                        <span className="result_collected">
                          {getCurrencyFnc()}
                          {formatNumber(
                            Number(watch("automatedShippingCourier")?.price)
                          )}

                          <IconButton
                            onClick={() => {
                              setValue("automatedShippingCourier", null);
                              setValue("shipping_record_id", null);
                              setValue("shipping_price", null);
                            }}
                            className="icon_btn"
                          >
                            <TrashIcon stroke="#D90429" />
                          </IconButton>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="extra_action">
                    <p className="action_name">Tax</p>
                    {watch("tax") ? (
                      <span className="result_collected">
                        {getCurrencyFnc()}
                        {taxAmount}
                        <IconButton
                          onClick={() => {
                            setOpenTaxModal(true);
                          }}
                          className="icon_btn"
                        >
                          <EditIcon stroke="#009444" />
                        </IconButton>
                      </span>
                    ) : (
                      <Button
                        onClick={() => {
                          setOpenTaxModal(true);
                        }}
                        className="button"
                        endIcon={<ChevronDownIcon />}
                      >
                        Add taxes
                      </Button>
                    )}
                  </div>
                  <div className="total">
                    <p>Total Amount</p>
                    <p>
                      {formatPrice(
                        total -
                          getDiscount() +
                          (watch("tax") ? Number(taxAmount) : 0) +
                          Number(watch("shipping_price") || 0)
                      )}
                    </p>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
};

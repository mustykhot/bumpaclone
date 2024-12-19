import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import uuid from "react-uuid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import ValidatedInput, {
  formatNumberWithCommas,
  removeFormattedNumerComma,
} from "components/forms/ValidatedInput";
import SelectField from "components/forms/SelectField";
import Loader from "components/Loader";
import ErrorMsg from "components/ErrorMsg";
import TextEditor from "components/forms/TextEditor";
import { ProductMoq } from "./productMoq";
import UploadMultipleProductImage, {
  ImageUrl,
} from "components/forms/UploadMultipleProductImage";
import { FormSectionHeader } from "./widget/FormSectionHeader";
import { InventorySection } from "./inventorySection";
import { optionType, ProductOptionSection } from "./productOptionsSection";
import { AddProductCollectionModal } from "./productCollectionModal";
import { PreviewProductModal } from "./previewProductModal";
import { SelectColletionsModal } from "./SelectCollections";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { SelectTaxModal } from "./SelectTax";
import { useEditProductMutation, useGetSingleProductQuery } from "services";
import { getCurrencyFnc, handleError } from "utils";
import { showToast, useAppSelector } from "store/store.hooks";
import {
  getObjWithValidValues,
  hasNullOrEmptyPrice,
} from "utils/constants/general";
import { selectUserLocation } from "store/slice/AuthSlice";
import "./style.scss";

export type EditProductFeilds = {
  productType: string;
  title: string;
  description: string;
  stock: number;
  cost?: number;
  details: string;
  unit: string;
  price: number;
  sales?: number;
  images: ImageUrl[];
  image: any;
  thumbImage: any;
  options: optionType[] | [];
  variations: any[];
  tax: { name: string; tax: string; id: number };
  sku?: string;
  // collection: string;
  status: number;
  collections: any;
  location_ids?: string[];
  tags: string[];
  maximum_order_quantity?: number;
  minimum_order_quantity?: number;
  weight_kg?: number;

  // relatedProducts?: string[];
};

export const EditProductForm = () => {
  const [productType] = useState<string>("physical");
  const [openAddCollectionModal, setOpenAddCollectionModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [profit, setProfit] = useState<number | null>(null);
  const [price, setPrice] = useState<string | number>("");
  const [sellingPrice, setSellingPrice] = useState<string | number>("");
  const [editProduct, { isLoading }] = useEditProductMutation();
  const [options, setOptions] = useState<optionType[] | []>([]);
  const [defaultVariations, setDefaultVariations] = useState<any[]>([]);
  const [defaultImage, setDefaultImage] = useState<any[] | null>([]);
  const [defaultThumbnail, setDefaultThumbnail] = useState("");
  const [discountPrice, setDiscountPrice] = useState<string>("");
  const [variationsPendingEdit, setVariationsPendingEdit] = useState<any>([]);
  const [optionsPendingEdit, setOptionsPendingEdit] = useState<
    optionType[] | []
  >([]);
  const [openSelectCollections, setOpenSelectCollections] = useState(false);
  const userLocation = useAppSelector(selectUserLocation);
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data,
    isLoading: loadSingleData,
    isError,
  } = useGetSingleProductQuery({ id, location_id: userLocation?.id });

  const methods = useForm<EditProductFeilds>({
    mode: "all",
  });
  const { handleSubmit, setValue, watch, reset } = methods;

  function hasSimilarName(imagesList: any) {
    for (const image of imagesList) {
      if (image.name === defaultThumbnail) {
        return true; // Found a matching name
      }
    }

    return false;
  }

  const queryParams = new URLSearchParams(location.search);
  const cumulativeRowIndex = Number(queryParams.get("count"));

  const onSubmit = async (data: any) => {
    let realVariations = data.variations.map((item: any) => {
      return {
        image: item.image,
        variant: item.variant.trim(),
        id: item.id.toString()?.slice(0, 8) === "internal" ? null : item.id,
        stock: removeFormattedNumerComma(item.stock),
        price: removeFormattedNumerComma(item.price),
        sales: item.sales,
        weight_kg: item.weight_kg,
        cost: removeFormattedNumerComma(item.cost),
        maximum_order_quantity: removeFormattedNumerComma(
          item.maximum_order_quantity
        ),
        minimum_order_quantity: removeFormattedNumerComma(
          item.minimum_order_quantity
        ),
      };
    });
    let removeEmptyVariations = realVariations.map((item: any) => {
      return {
        ...getObjWithValidValues(item),
        sales:
          Number(removeFormattedNumerComma(item.sales)) === 0
            ? ""
            : Number(removeFormattedNumerComma(item.sales)),
      };
    });
    const payload = {
      ...data,
      location_id: userLocation?.id,
      weight_kg: data.weight_kg,
      cost: removeFormattedNumerComma(data.cost),
      price: removeFormattedNumerComma(data.price),
      stock: removeFormattedNumerComma(data.stock),
      maximum_order_quantity: removeFormattedNumerComma(
        data?.maximum_order_quantity
      ),
      minimum_order_quantity: removeFormattedNumerComma(
        data?.minimum_order_quantity
      ),
      tags:
        data?.tags && data?.tags?.length
          ? data?.tags?.map((item: any) => item.tag)
          : null,
      image:
        data.images && data.images?.length && data.images?.length === 1
          ? data.images[0]?.name
          : data.image
          ? typeof data.image === "string"
            ? data?.image.includes("stores")
              ? data.images && data.images?.length && data.images[0]
                ? data.images[0]?.name
                : ""
              : data.images && data.images?.length
              ? hasSimilarName(data.images)
                ? data?.image
                : data.images[0]
                ? data.images[0]?.name
                : ""
              : ""
            : data.image.name
          : data.images && data.images?.length && data.images[0]
          ? data.images[0]?.name
          : "",
      options: data.options.map((item: any) => {
        return {
          name: item.name,
          values: item.values,
        };
      }),
      variations: removeEmptyVariations,
    };

    if (realVariations?.length) {
      if (hasNullOrEmptyPrice(realVariations)) {
        showToast("Price field is missing for a variation item", "error");
      } else {
        try {
          let result = await editProduct({
            body: getObjWithValidValues({
              ...payload,
              sales: "",
              price: "",
              stock: "",
              cost: "",
              minimum_order_quantity: "",
              maximum_order_quantity: "",
            }),
            id,
          });
          if ("data" in result) {
            showToast("Edited successfully", "success");
            navigate(-1);
          } else {
            handleError(result, "", 8000);
          }
        } catch (error) {
          handleError(error, "", 8000);
        }
      }
    } else {
      try {
        let result = await editProduct({
          body: {
            ...getObjWithValidValues(payload),
            sales:
              Number(removeFormattedNumerComma(data.sales)) === 0
                ? ""
                : Number(removeFormattedNumerComma(data.sales)),
          },
          id,
        });
        if ("data" in result) {
          showToast("Edited successfully", "success");
          navigate(-1);
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  useEffect(() => {
    setValue("productType", productType);
  }, [productType, setValue]);

  useEffect(() => {
    if (price && sellingPrice) {
      let holdPrice = discountPrice
        ? Number(removeFormattedNumerComma(discountPrice))
        : Number(removeFormattedNumerComma(sellingPrice));
      setProfit(holdPrice - Number(removeFormattedNumerComma(price)));
    }
  }, [price, sellingPrice, discountPrice]);

  useEffect(() => {
    if (data) {
      const { product } = data;
      const prepareOptions = product?.options.map((item: any) => {
        return {
          ...item,
          id: `${uuid()}`,
        };
      });
      setOptionsPendingEdit(prepareOptions);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const { product } = data;
      setValue("title", product?.title);
      setValue("images", product?.images);
      setDefaultImage(product?.images?.length ? product?.images : null);
      setValue("sku", product?.sku);
      setValue("image", product?.image);
      setValue("status", product?.status);
      setDefaultThumbnail(product?.image);
      setValue("details", product?.details);
      setValue("description", product?.description);
      setValue("weight_kg", product?.weight_kg);
      setValue("maximum_order_quantity", product?.maximum_order_quantity);
      setValue("minimum_order_quantity", product?.minimum_order_quantity);
      setValue("stock", product?.stock);
      setValue(
        "cost",
        product?.cost
          ? (formatNumberWithCommas(
              parseFloat(String(product?.cost)?.replace(/,/g, ""))
            ) as any)
          : undefined
      );
      setValue(
        "sales",
        product?.sales
          ? (formatNumberWithCommas(
              parseFloat(String(product?.sales)?.replace(/,/g, ""))
            ) as any)
          : undefined
      );
      setValue(
        "price",
        product?.price
          ? (formatNumberWithCommas(
              parseFloat(String(product?.price)?.replace(/,/g, ""))
            ) as any)
          : undefined
      );
      setPrice(
        product?.cost
          ? (formatNumberWithCommas(
              parseFloat(String(product?.cost)?.replace(/,/g, ""))
            ) as any)
          : ""
      );
      setSellingPrice(
        product?.price
          ? (formatNumberWithCommas(
              parseFloat(String(product?.price)?.replace(/,/g, ""))
            ) as any)
          : ""
      );
      setDiscountPrice(
        product?.sales
          ? (formatNumberWithCommas(
              parseFloat(String(product?.sales)?.replace(/,/g, ""))
            ) as any)
          : ""
      );

      const tags =
        product?.tags && product?.tags?.length
          ? product?.tags.map((item: any) => {
              return { id: `${item.id}`, tag: item.tag };
            })
          : [];
      setValue("tags", tags);
      setValue("unit", product?.unit);
      const prepareOptions = product?.options.map((item: any) => {
        return {
          ...item,
          id: `${uuid()}`,
        };
      });
      setValue("options", prepareOptions);
      setOptions(prepareOptions);
      const prepareVariations = product?.variations.map((item: any) => {
        return {
          stock: item.quantity,
          minimum_order_quantity: item.minimum_order_quantity,
          maximum_order_quantity: item.maximum_order_quantity,
          weight_kg: item.weight_kg,

          price: formatNumberWithCommas(
            parseFloat(String(item.price)?.replace(/,/g, ""))
          ),
          sales: item.sales
            ? formatNumberWithCommas(
                parseFloat(String(item.sales)?.replace(/,/g, ""))
              )
            : null,
          cost: item.cost
            ? formatNumberWithCommas(
                parseFloat(String(item.cost)?.replace(/,/g, ""))
              )
            : null,
          image: item.image ? item.image : "",
          variant: item.variant,
          id: item.id,
          discounts: item.discounts,
          has_discount: item.has_discount,
          quantityPassed: true,
        };
      });
      setValue("variations", prepareVariations);
      setVariationsPendingEdit(prepareVariations);
      setDefaultVariations(
        product?.variations?.length ? prepareVariations : null
      );
    }
    // eslint-disable-next-line
  }, [data]);

  if (isError) {
    return <ErrorMsg error={"Something went wrong"} />;
  }
  if (loadSingleData) {
    return <Loader />;
  }

  return (
    <>
      {isLoading && <Loader />}
      {data && (
        <div className="pd_add_product">
          <AddProductCollectionModal
            openModal={openAddCollectionModal}
            closeModal={() => {
              setOpenAddCollectionModal(false);
            }}
          />
          <FormProvider {...methods}>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
              <SelectColletionsModal
                openModal={openSelectCollections}
                closeModal={() => {
                  setOpenSelectCollections(false);
                }}
              />
              <PreviewProductModal
                openModal={openPreviewModal}
                closeModal={() => {
                  setOpenPreviewModal(false);
                }}
              />
              <SelectTaxModal
                openModal={openModal}
                closeModal={() => {
                  setOpenModal(false);
                }}
              />
              <div className="form_section">
                <ModalHeader text="Edit Product" />
                <div className="form_field_container">
                  <div className="image_container">
                    <FormSectionHeader title="Product Images" />
                    <div className="px-[16px]">
                      <div className=" mb-[8px]">
                        <p className="add_image mr-[5px]">
                          Product Images (optional)
                        </p>
                        <div className="flex gap-[6px] items-center">
                          <InfoCircleIcon />
                          <p className="text-[#848D99] text-[12px]">
                            Recommended dimension: 930px x 1163px, Max file
                            size: 5mb
                          </p>
                        </div>
                      </div>
                      <UploadMultipleProductImage
                        name="images"
                        required={false}
                        isEdit={true}
                        defaultImage={defaultImage}
                        defaultThumbnail={defaultThumbnail}
                      />
                    </div>
                  </div>

                  <div className="product_details_container">
                    <FormSectionHeader title="Product Details" />
                    <div className="content">
                      <ValidatedInput
                        name="title"
                        placeholder="Enter Name"
                        label="Product Name"
                        type={"text"}
                      />
                      <ValidatedInput
                        name="description"
                        placeholder="Enter Short Description"
                        label="Short Description"
                        type={"text"}
                        required={false}
                      />
                      <TextEditor
                        label="Product Description"
                        required={false}
                        name="details"
                      />{" "}
                      <div className="cover_customer_select">
                        <div
                          onClick={() => {
                            setOpenSelectCollections(true);
                          }}
                          className="pick_cutomer"
                        >
                          <label>Select Collection</label>
                          <div>
                            <p>
                              {watch("tags") && watch("tags")?.length
                                ? watch("tags")
                                    ?.map((item: any) => item.tag)
                                    .join(", ")
                                : "Select collections"}
                            </p>
                            <ChevronDownIcon />
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setOpenAddCollectionModal(true);
                          }}
                          startIcon={<AddIcon />}
                          type="button"
                        >
                          Create collection
                        </Button>
                      </div>
                      {data &&
                      data.product &&
                      data.product?.variations &&
                      data.product?.variations?.length ? (
                        ""
                      ) : (
                        <ValidatedInput
                          name="price"
                          label="Pricing"
                          formatValue={true}
                          prefix={
                            <p className="text-[#000000] font-semibold text-[20px]">
                              {getCurrencyFnc()}
                            </p>
                          }
                          placeholder="Enter Amount"
                          type={"number"}
                          handleChange={(e) => {
                            setSellingPrice(e.target.value);
                          }}
                        />
                      )}
                      {data &&
                      data.product &&
                      data.product?.variations &&
                      data.product?.variations?.length ? (
                        ""
                      ) : (
                        <div className="form-group-flex">
                          <ValidatedInput
                            name="cost"
                            label="Cost Price"
                            type={"number"}
                            noOptional={true}
                            formatValue={true}
                            required={false}
                            prefix={
                              <p className="text-[#000000] font-semibold text-[20px]">
                                {getCurrencyFnc()}
                              </p>
                            }
                            handleChange={(e) => {
                              setPrice(e.target.value);
                            }}
                            extramessage={
                              sellingPrice && profit && price
                                ? `Profit: ${getCurrencyFnc()}${profit} (${Math.round(
                                    (profit /
                                      Number(
                                        removeFormattedNumerComma(price)
                                      )) *
                                      100
                                  )}%)`
                                : ""
                            }
                          />

                          <ValidatedInput
                            name="sales"
                            max={watch("price")}
                            label="Discounted Price"
                            formatValue={true}
                            required={false}
                            handleChange={(e) => {
                              setDiscountPrice(e.target.value);
                            }}
                            rules={{
                              validate: (value) => {
                                if (value) {
                                  return (
                                    Number(removeFormattedNumerComma(value)) <
                                      Number(
                                        removeFormattedNumerComma(
                                          watch("price")
                                        )
                                      ) ||
                                    "Discount should be lesser than selling price"
                                  );
                                }
                              },
                            }}
                            type={"number"}
                            prefix={
                              <p className="text-[#000000] font-semibold text-[20px]">
                                {getCurrencyFnc()}
                              </p>
                            }
                          />
                        </div>
                      )}
                      {/* <ValidatedTextArea
                      name="description"
                      height="h-[120px]"
                      label="Product Description"
                    /> */}
                      {/* <div className="form-group-flex">
                      <MultipleSelectField
                        name="tags"
                        required={false}
                        isLoading={loadCollections}
                        selectOption={
                          collections
                            ? collections.tags?.length
                              ? collections?.tags.map((item: any) => {
                                  return {
                                    key: item.tag,
                                    value: item.tag,
                                  };
                                })
                              : []
                            : []
                        }
                        label="Select Collections"
                        extramessage={
                          <Button
                            onClick={() => {
                              setOpenAddCollectionModal(true);
                            }}
                            startIcon={<AddIcon />}
                            type="button"
                          >
                            Create collection
                          </Button>
                        }
                      />
                    </div> */}
                      <SelectField
                        name="status"
                        required={false}
                        selectOption={[
                          {
                            value: 1,
                            key: "Published",
                          },
                          {
                            value: 0,
                            key: "Unpublished",
                          },
                        ]}
                        label="Product Status"
                        placeholder="Select Product Status"
                      />
                    </div>
                  </div>
                  {/* <PricingSection /> */}
                  <InventorySection isEdit={true} />
                  {!watch("variations")?.length && <ProductMoq isEdit={true} />}

                  <ProductOptionSection
                    options={options}
                    setOptions={setOptions}
                    variationsPendingEdit={variationsPendingEdit}
                    defaultVariations={defaultVariations}
                    optionsPendingEdit={optionsPendingEdit}
                    isEdit={true}
                  />
                  {/* <RelatedProduct /> */}
                </div>
              </div>

              <div className="submit_form_section">
                <div className="cancel-button-container">
                  <Button
                    onClick={() => {
                      reset();
                      setOptions([]);
                      navigate(-1);
                    }}
                    className="discard"
                  >
                    Cancel
                  </Button>
                </div>

                <div className="button_container">
                  <Button
                    onClick={() => {
                      setOpenPreviewModal(true);
                    }}
                    variant="contained"
                    type="button"
                    // disabled={!isValid}
                    className="preview"
                  >
                    Preview
                  </Button>

                  <LoadingButton
                    loading={false}
                    variant="contained"
                    className="add"
                    type="submit"
                  >
                    Save Changes
                  </LoadingButton>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      )}
    </>
  );
};

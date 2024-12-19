import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import uuid from "react-uuid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import ValidatedInput, {
  formatNumberWithCommas,
  removeFormattedNumerComma,
} from "components/forms/ValidatedInput";
import Loader from "components/Loader";
import ErrorMsg from "components/ErrorMsg";
import TextEditor from "components/forms/TextEditor";
import UploadMultipleProductImage, {
  ImageUrl,
} from "components/forms/UploadMultipleProductImage";
import SelectField from "components/forms/SelectField";
import { FormSectionHeader } from "./widget/FormSectionHeader";
import { InventorySection } from "./inventorySection";
import { optionType, ProductOptionSection } from "./productOptionsSection";
import { AddProductCollectionModal } from "./productCollectionModal";
import { PreviewProductModal } from "./previewProductModal";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { SelectTaxModal } from "./SelectTax";
import {
  useCreateProductMutation,
  useGetCollectionsQuery,
  useGetProductQuery,
  useGetSingleProductQuery,
} from "services";
import { getCurrencyFnc, handleError } from "utils";
import { showToast, useAppSelector } from "store/store.hooks";
import {
  getObjWithValidValues,
  hasNullOrEmptyPriceOrStock,
} from "utils/constants/general";
import { SelectColletionsModal } from "./SelectCollections";
import AskIsVariation from "./AskIsVariation";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
  selectUserLocation,
} from "store/slice/AuthSlice";
import { ProductMoq } from "./productMoq";
import "./style.scss";

export type EditProductFeilds = {
  productType: string;
  title: string;
  description: string;
  stock: number;
  cost?: number;
  details: string;
  unit: string;
  barcode?: any;
  price: number;
  sales?: number;
  images: ImageUrl[];
  image: any;
  options: optionType[] | [];
  variations: any[];
  tax: { name: string; tax: string; id: number };
  sku?: string;
  // collection: string;
  status: number;
  location_ids?: string[];
  collections: any;
  tags: string[];
  isVariantionApplied?: string;
  maximum_order_quantity?: number;
  minimum_order_quantity?: number;
  weight_kg?: number;
};

export const DuplicateProductForm = () => {
  const [productType] = useState<string>("physical");
  const [openAddCollectionModal, setOpenAddCollectionModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [profit, setProfit] = useState<number | null>(null);
  const [price, setPrice] = useState<string | number>("");
  const [sellingPrice, setSellingPrice] = useState<string | number>("");
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [options, setOptions] = useState<optionType[] | []>([]);
  const [defaultVariations, setDefaultVariations] = useState<any[]>([]);
  const [defaultImage, setDefaultImage] = useState<any[] | null>([]);
  const [defaultThumbnail, setDefaultThumbnail] = useState("");
  const [discountPrice, setDiscountPrice] = useState<string>("");
  const [openSelectCollections, setOpenSelectCollections] = useState(false);
  const userLocation = useAppSelector(selectUserLocation);

  const { data: collections, isLoading: loadCollections } =
    useGetCollectionsQuery({
      search: "",
    });
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

  const onSubmit: SubmitHandler<EditProductFeilds> = async (data) => {
    const validLocationIds = data.location_ids?.filter(
      (id) => id && id !== "undefined"
    );
    const locationIds =
      validLocationIds && validLocationIds.length > 0 ? validLocationIds : null;

    let realVariations = data.variations?.map((item: any) => {
      return {
        image: item.image,
        weight_kg: item.weight_kg,
        variant: item.variant.trim(),
        stock: item.stock ? removeFormattedNumerComma(item.stock) : 1,
        price: removeFormattedNumerComma(item.price),
        sales:
          Number(removeFormattedNumerComma(item.sales)) === 0
            ? null
            : Number(removeFormattedNumerComma(item.sales)),
        cost: removeFormattedNumerComma(item.cost),
        maximum_order_quantity: removeFormattedNumerComma(
          item.maximum_order_quantity
        ),
        minimum_order_quantity: removeFormattedNumerComma(
          item.minimum_order_quantity
        ),
      };
    });
    let removeEmptyVariations = realVariations?.map((item: any) =>
      getObjWithValidValues(item)
    );
    const payload = {
      ...data,
      isVariantionApplied: null,
      weight_kg: data.weight_kg,
      location_id: userLocation?.id,
      location_ids: locationIds,
      cost: removeFormattedNumerComma(data.cost),
      price: removeFormattedNumerComma(data.price),
      stock: data.stock ? removeFormattedNumerComma(data.stock) : 1,
      maximum_order_quantity: removeFormattedNumerComma(
        data?.maximum_order_quantity
      ),
      minimum_order_quantity: removeFormattedNumerComma(
        data?.minimum_order_quantity
      ),
      sales:
        Number(removeFormattedNumerComma(data.sales)) === 0
          ? null
          : Number(removeFormattedNumerComma(data.sales)),
      tags:
        data?.tags && data?.tags?.length
          ? data?.tags?.map((item: any) => item.tag)
          : null,
      image: data.image
        ? data.image.name
        : data.images && data.images?.length && data.images[0]
        ? data.images[0]?.path
        : "",

      options: data.options?.map((item: any) => {
        return {
          name: item.name,
          values: item.values,
        };
      }),
      variations: removeEmptyVariations,
    };

    const createProductAndHandleResult = async (productPayload: any) => {
      try {
        let result = await createProduct(getObjWithValidValues(productPayload));
        if ("data" in result) {
          showToast("Created successfully", "success");
          if (typeof _cio !== "undefined") {
            _cio.track(
              "web_product_add",
              getObjWithValidValues(productPayload)
            );
          }
          if (typeof mixpanel !== "undefined") {
            mixpanel.track(
              "web_product_add",
              getObjWithValidValues(productPayload)
            );
          }
          navigate(`/dashboard/products`);
        } else {
          handleError(result, "", 8000);
        }
      } catch (error) {
        handleError(error, "", 8000);
      }
    };

    if (data.isVariantionApplied === "Yes") {
      if (realVariations?.length) {
        if (hasNullOrEmptyPriceOrStock(realVariations)) {
          showToast(
            "Price or quantity field is missing for a variation item",
            "error"
          );
        } else {
          await createProductAndHandleResult(payload);
        }
      } else {
        showToast("Include product options to proceed", "error");
      }
    } else {
      await createProductAndHandleResult(payload);
    }
  };

  // set product type
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
      setValue("title", product?.title);
      setValue("images", product?.images);

      setDefaultImage(product?.images?.length ? product?.images : null);
      setValue("sku", product?.sku);
      setValue("image", product?.image);
      setValue("status", product?.status);
      setDefaultThumbnail(product?.image);
      setValue("details", product?.details);
      setValue("description", product?.description);
      setValue("maximum_order_quantity", product?.maximum_order_quantity);
      setValue("minimum_order_quantity", product?.minimum_order_quantity);
      setValue("weight_kg", product?.weight_kg);

      setValue(
        "stock",
        formatNumberWithCommas(
          parseFloat(String(product?.quantity)?.replace(/,/g, ""))
        ) as any
      );
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
          ? product?.tags?.map((item: any) => {
              return { id: `${item.id}`, tag: item.tag };
            })
          : [];
      setValue("tags", tags);

      setValue("unit", product?.unit);
      const prepareOptions = product?.options?.map((item: any) => {
        return {
          ...item,
          id: `${uuid()}`,
        };
      });
      setValue("options", prepareOptions);
      setOptions(prepareOptions);

      const prepareVariations = product?.variations?.map((item: any) => {
        return {
          image: item.image ? item.image : "",
          variant: item.variant,
          id: item.id,
          weight_kg: item.weight_kg,

          minimum_order_quantity: item.minimum_order_quantity,
          maximum_order_quantity: item.maximum_order_quantity,
          stock: formatNumberWithCommas(
            parseFloat(String(item.quantity)?.replace(/,/g, ""))
          ),
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
        };
      });
      setValue("variations", prepareVariations);
      setDefaultVariations(
        product?.variations?.length ? prepareVariations : null
      );
      if (product?.variations?.length) {
        setValue("isVariantionApplied", "Yes");
      } else {
        setValue("isVariantionApplied", "No");
      }
    }
    // eslint-disable-next-line
  }, [data, collections]);

  if (isError) {
    return <ErrorMsg error={"Something went wrong"} />;
  }
  if (loadSingleData) {
    return <Loader />;
  }

  return (
    <>
      {isLoading && <Loader />}

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
              <ModalHeader text="Create Product" />
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
                          Recommended dimension: 930px x 1163px, Max file size:
                          5mb
                        </p>
                      </div>
                    </div>
                    <UploadMultipleProductImage
                      name="images"
                      required={false}
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
                    <AskIsVariation options={options} setOptions={setOptions} />
                    {watch("isVariantionApplied") === "No" && (
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
                    {watch("isVariantionApplied") === "No" && (
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
                                    Number(removeFormattedNumerComma(price))) *
                                    100
                                )}%)`
                              : ""
                          }
                        />

                        <ValidatedInput
                          name="sales"
                          max={watch("price")}
                          label="Discounted Price"
                          required={false}
                          formatValue={true}
                          handleChange={(e) => {
                            setDiscountPrice(e.target.value);
                          }}
                          rules={{
                            validate: (value) => {
                              if (value) {
                                return (
                                  Number(removeFormattedNumerComma(value)) <
                                    Number(
                                      removeFormattedNumerComma(watch("price"))
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
                <InventorySection />
                {watch("isVariantionApplied") === "No" && <ProductMoq />}

                {watch("isVariantionApplied") === "Yes" && (
                  <ProductOptionSection
                    options={options}
                    setOptions={setOptions}
                    defaultVariations={defaultVariations}
                  />
                )}
              </div>
            </div>

            <div className="submit_form_section">
              <div className="button_container2">
                <Button
                  onClick={() => {
                    reset();
                    setOptions([]);
                  }}
                  className="discard"
                >
                  Clear Fields
                </Button>
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
    </>
  );
};

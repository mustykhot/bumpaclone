import AddIcon from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { PlayCircleIcon } from "assets/Icons/PlayCircleIcon";
import Loader from "components/Loader";
import TextEditor from "components/forms/TextEditor";
import UploadMultipleProductImage, {
  ImageUrl,
} from "components/forms/UploadMultipleProductImage";
import ValidatedInput, {
  removeFormattedNumerComma,
} from "components/forms/ValidatedInput";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import {
  useCreateProductMutation,
  useGetStoreInformationQuery,
} from "services";
import { selectUserLocation, setStoreDetails } from "store/slice/AuthSlice";
import {
  showToast,
  showVideoModal,
  useAppDispatch,
  useAppSelector,
} from "store/store.hooks";
import { getCurrencyFnc, handleError } from "utils";
import {
  getObjWithValidValues,
  hasNullOrEmptyPriceOrStock,
  IMAGEURL,
} from "utils/constants/general";
import AskIsVariation from "./AskIsVariation";
import { SelectColletionsModal } from "./SelectCollections";
import { SelectTaxModal } from "./SelectTax";
import { InventorySection } from "./inventorySection";
import { PreviewProductModal } from "./previewProductModal";
import { AddProductCollectionModal } from "./productCollectionModal";
import { ProductMoq } from "./productMoq";
import { optionType, ProductOptionSection } from "./productOptionsSection";
import { FormSectionHeader } from "./widget/FormSectionHeader";
import SizeGuardUpload from "./sizeguard";

export type CreateProductFeilds = {
  productType: string;
  title: string;
  description: string;
  stock: number;
  cost?: number;
  maximum_order_quantity?: number;
  minimum_order_quantity?: number;
  details: string;
  unit: string;
  price: number;
  sales?: number;
  barcode?: any;
  images: ImageUrl[];
  location_ids: string[];
  image: any;
  options: optionType[] | [];
  variations: any[];
  tax: { name: string; tax: string; id: number };
  isVariantionApplied?: string;
  tags: string[];
  weight_kg?: number;
};

export const AddProductForm = ({
  discardFnc,
  extraFnc,
}: {
  discardFnc?: any;
  extraFnc?: any;
}) => {
  const [productType] = useState<string>("physical");
  const [openAddCollectionModal, setOpenAddCollectionModal] = useState(false);
  // const [checkTax, setCheckTax] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  // const [checkDiscount, setCheckDiscount] = useState(true);
  const [checkDiscountToVariation, setCheckDiscountToVariation] =
    useState(false);
  const [checkPriceToVariation, setCheckPriceToVariation] = useState(false);
  const [checkStockToVariation, setCheckStockToVariation] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [profit, setProfit] = useState<number | null>(null);
  const [price, setPrice] = useState<string>("");
  const [sellingPrice, setSeliingPrice] = useState<string>("");
  const [discountPrice, setDiscountPrice] = useState<string>("");
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [options, setOptions] = useState<optionType[] | []>([]);
  const [openSelectCollections, setOpenSelectCollections] = useState(false);
  const userLocation = useAppSelector(selectUserLocation);
  const methods = useForm<CreateProductFeilds>({
    mode: "all",
    defaultValues: {
      location_ids: [],
    },
  });
  const {
    data: storeData,
    refetch,
    isFetching,
  } = useGetStoreInformationQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { handleSubmit, setValue, watch, reset } = methods;
  const priceInput = watch("price");

  const onSubmit: SubmitHandler<CreateProductFeilds> = async (data) => {
    const validLocationIds = data.location_ids?.filter(
      (id) => id && id !== "undefined"
    );
    const locationIds =
      validLocationIds && validLocationIds.length > 0 ? validLocationIds : null;

    let realVariations = data.variations?.map((item: any) => ({
      stock: removeFormattedNumerComma(item.stock),
      maximum_order_quantity: removeFormattedNumerComma(
        item.maximum_order_quantity
      ),
      minimum_order_quantity: removeFormattedNumerComma(
        item.minimum_order_quantity
      ),
      weight_kg: item.weight_kg,
      price: removeFormattedNumerComma(item.price),
      sales:
        Number(removeFormattedNumerComma(item.sales)) === 0
          ? null
          : Number(removeFormattedNumerComma(item.sales)),
      cost: removeFormattedNumerComma(item.cost),
      image: item.image,
      barcode: item.barcode,
      variant: item.variant.trim(),
    }));

    let removeEmptyVariations = realVariations?.map((item: any) =>
      getObjWithValidValues(item)
    );

    const payload = {
      ...data,
      location_id: userLocation?.id,
      location_ids: locationIds,
      weight_kg: data.weight_kg,
      cost: removeFormattedNumerComma(data.cost),
      price: removeFormattedNumerComma(data.price),
      isVariantionApplied: null,
      stock: removeFormattedNumerComma(data.stock) || 1,
      sales:
        Number(removeFormattedNumerComma(data.sales)) === 0
          ? null
          : Number(removeFormattedNumerComma(data.sales)),
      tags: data?.tags?.length ? data.tags.map((item: any) => item.tag) : null,
      image: data.image ? data.image.name : data.images?.[0]?.name || "",
      options: data.options?.map((item: any) => ({
        name: item.name,
        values: item.values,
      })),
      maximum_order_quantity: removeFormattedNumerComma(
        data?.maximum_order_quantity
      ),
      minimum_order_quantity: removeFormattedNumerComma(
        data?.minimum_order_quantity
      ),
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
          if (discardFnc) {
            let item = result.data.product;
            let prepareProduct = {
              id: item.id,
              url: item.url,
              name: item.name,
              unit: item.unit,
              price: item.price,
              total: item.price,
              discount: item.sales,
              stock: item.stock,
              description: item.description,
              thumbnail_url: item.thumbnail_url,
              image: item.image || item.images[0],
              variations: item.variations?.map((variant: any) => ({
                id: variant.id,
                variant: variant.id,
                itemId: item.id,
                url: item.url,
                name: `${item.name}(${variant.variant})`,
                unit: item.unit,
                price: variant.price,
                total: variant.price,
                discount: item.discount,
                stock: variant.stock,
                description: item.description,
                image: variant.image || item.images[0],
                thumbnail_url: `${IMAGEURL}${variant.image}`,
              })),
            };
            const refetchResult = await refetch();
            if (refetchResult.data) {
              dispatch(setStoreDetails(refetchResult.data.store));
            }
            extraFnc && extraFnc(prepareProduct);
            discardFnc();
          } else {
            navigate(`/dashboard/products`);
          }
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
    setValue("isVariantionApplied", "No");
  }, []);

  useEffect(() => {
    if (price && sellingPrice) {
      let holdPrice = discountPrice
        ? Number(removeFormattedNumerComma(discountPrice))
        : Number(removeFormattedNumerComma(sellingPrice));
      setProfit(holdPrice - Number(removeFormattedNumerComma(price)));
    }
  }, [price, sellingPrice, discountPrice]);

  return (
    <>
      {isLoading || (isFetching && <Loader />)}
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
              <ModalHeader
                text="Create Product"
                closeModal={discardFnc && discardFnc}
                button={
                  <Button
                    className="video"
                    onClick={() => {
                      showVideoModal(
                        true,
                        <iframe
                          width="560"
                          height="315"
                          src="https://www.youtube.com/embed/G-XjHouhEZo?si=BKsDaJWQ_B9dGhrr"
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        ></iframe>,
                        "How to Add Product"
                      );
                    }}
                    startIcon={<PlayCircleIcon />}
                  >
                    Watch video tutorial
                  </Button>
                }
              />
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
                      required={false}
                      type={"text"}
                    />
                    <TextEditor
                      label="Product Description"
                      name="details"
                      required={false}
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
                    <SizeGuardUpload />
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
                          setSeliingPrice(e.target.value);
                        }}
                      />
                    )}
                    {watch("isVariantionApplied") === "No" && (
                      <div className="form-group-flex">
                        <ValidatedInput
                          name="cost"
                          label="Cost Price"
                          formatValue={true}
                          noOptional={true}
                          required={false}
                          type={"number"}
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
                          label="Discounted Price"
                          formatValue={true}
                          max={watch("price")}
                          type={"number"}
                          required={false}
                          prefix={
                            <p className="text-[#000000] font-semibold text-[20px]">
                              {getCurrencyFnc()}
                            </p>
                          }
                          handleChange={(e) => {
                            setDiscountPrice(e.target.value);
                          }}
                          rules={{
                            validate: (value) => {
                              if (value) {
                                return (
                                  Number(removeFormattedNumerComma(value)) <
                                    Number(
                                      removeFormattedNumerComma(priceInput)
                                    ) ||
                                  "Discount should be lesser than selling price"
                                );
                              }
                            },
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {/* <PricingSection /> */}
                <InventorySection
                  checkStockToVariation={checkStockToVariation}
                  setCheckStockToVariation={setCheckStockToVariation}
                />
                {watch("isVariantionApplied") === "No" && <ProductMoq />}
                {watch("isVariantionApplied") === "Yes" && (
                  <>
                    <ProductOptionSection
                      checkDiscountToVariation={checkDiscountToVariation}
                      checkPriceToVariation={checkPriceToVariation}
                      checkStockToVariation={checkStockToVariation}
                      options={options}
                      setOptions={setOptions}
                    />
                  </>
                )}
                {/* <RelatedProduct /> */}
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
                    if (discardFnc) {
                      reset();
                      discardFnc();
                      setOptions([]);
                    } else {
                      reset();
                      setOptions([]);
                      navigate(-1);
                    }
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
                  loading={isLoading || isFetching}
                  variant="contained"
                  className="add"
                  type="submit"
                  // disabled={!isValid}
                >
                  Add product
                </LoadingButton>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

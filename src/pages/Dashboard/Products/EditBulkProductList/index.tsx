import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import uuid from "react-uuid";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { AnimatePresence, motion } from "framer-motion";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Slider from "@mui/material/Slider";
import { IconButton } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { FillArrowIcon } from "assets/Icons/FillArrowIcon";
import { MinusCircleIcon } from "assets/Icons/MinusCircleIcon";
import { PlusCircleIcon } from "assets/Icons/PlusCircleIcon";
import { EyeIcon } from "assets/Icons/EyeIcon";
import { EyeOffIcon } from "assets/Icons/EyeOffIcon";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { BorderNairaIcon } from "assets/Icons/BorderNairaIcon";
import { InfoCircleXLIcon } from "assets/Icons/InfoCircleXLIcon";
import { XIcon } from "assets/Icons/XIcon";
import DropDownWrapper from "components/DropDownWrapper";
import InputField from "components/forms/InputField";
import {
  formatNumberWithCommas,
  removeFormattedNumerComma,
} from "components/forms/ValidatedInput";
import { UpgradeModal } from "components/UpgradeModal";
import TableComponent from "components/table";
import Loader from "components/Loader";
import { useBulkEditProductMutation, useEditProductMutation } from "services";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { ChangePriceModal } from "./BulkActionModals/changePriceModal";
import { ChangeDiscountPriceModal } from "./BulkActionModals/changeDiscountPriceModal";
import { ChangeProductStockModal } from "./BulkActionModals/changeProductStockModal";
import { ChangeVariationPriceModal } from "./BulkActionModals/changeVariationPriceModal";
import { ChangeVariationStockModal } from "./BulkActionModals/changeVariationStockModal";
import { BulkEditSelectImage } from "./BulkActionModals/BulkEditSelectImage";
import { AddDescription } from "./BulkActionModals/AddDescription";
import { AddProductToCollectionModal } from "./BulkActionModals/AddProductToCollectionModal";
import { CollectionType } from "services/api.types";
import { RemoveProductFromCollectionModal } from "./BulkActionModals/RemoveProductFromCollectionModal";
import { SelectCollectionModal } from "./BulkActionModals/SelectCollectionModal";
import { CreateProductOptionModal } from "./BulkActionModals/CreateProductOptionModal";
import { optionType } from "../AddProduct/productOptionsSection";
import { EditProductOptionModal } from "./BulkActionModals/EditProductOptionModal";
import { ProductVariationEditorModal } from "./BulkActionModals/ProductVariationEditorModal";
import { PreviewProductModal } from "./BulkActionModals/previewProductModal";
import { AddProductPriceModal } from "./BulkActionModals/addProductPriceModal";
import { AddProductStockModal } from "./BulkActionModals/addProductStockModal";
import { ChangeCostPriceModal } from "./BulkActionModals/changeCostPriceModal";
import { AddProductCostPriceModal } from "./BulkActionModals/addProductCostPriceModal";
import { AddProductWeightModal } from "./BulkActionModals/addProductWeightModal";
import { AddProductDiscountPriceModal } from "./BulkActionModals/addProductDiscountPriceModal";
import {
  getVariationCostPrice,
  getVariationDiscountPrice,
  getVariationPrice,
  getVariationWeight,
} from "../widget/InventoryTable";
import { showToast, useAppSelector } from "store/store.hooks";
import {
  addToBulkProduct,
  selectBulkProduct,
} from "store/slice/BulkProductSlice";
import {
  handleError,
  truncateString,
  mergeArraysOfVariation,
  getCurrencyFnc,
} from "utils";
import {
  IMAGEURL,
  alt_image_url,
  getObjWithValidValues,
} from "utils/constants/general";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import "./style.scss";

type CollectionListType = {
  name: string;
  id: number;
};

const headCell = [
  {
    key: "images",
    name: "",
  },
  {
    key: "title",
    name: "Title",
  },
  {
    key: "details",
    name: "Details",
  },
  {
    key: "tags",
    name: "Collection",
  },
  {
    key: "status",
    name: "Status",
  },
  {
    key: "price",
    name: "Price",
  },
  {
    key: "cost",
    name: "Cost",
  },
  {
    key: "sales",
    name: "Discount Price",
  },
  {
    key: "weight_kg",
    name: "Weight",
  },
  {
    key: "preview",
    name: "Preview",
  },
];

export const EditBulkProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [previewProduct, setPreviewProduct] = useState<any>(null);
  const [openPreviewProduct, setOpenPreviewProduct] = useState(false);
  const bulkProductList = useAppSelector(selectBulkProduct);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const [selectBulk, setSelectBulk] = useState<any[]>([]);
  const [bulkEditProduct, { isLoading: bulkEditLoading }] =
    useBulkEditProductMutation();
  const [listOfTagsForRemoval, setListOfTagsForRemoval] = useState<number[]>(
    []
  );
  const [openRemoveProductFromCollection, setOpenRemoveProductFromCollection] =
    useState(false);
  const [openAddProductToCollection, setOpenAddProductToCollection] =
    useState(false);
  const [openProperties, setOpenProperties] = useState(false);
  const [viewWarning, setViewWarning] = useState(true);
  const [openChangePriceModal, setOpenChangePriceModal] = useState(false);
  const [openAddPriceModal, setOpenAddPriceModal] = useState(false);
  const [openAddCostPriceModal, setOpenAddCostPriceModal] = useState(false);
  const [openChangeCostPriceModal, setOpenChangeCostPriceModal] =
    useState(false);
  const [costPriceAction, setCostPriceAction] = useState("Increase");

  const [priceAction, setPriceAction] = useState("Increase");
  const [openChangeVariationPriceModal, setOpenChangeVariationPriceModal] =
    useState(false);
  const [variationPriceAction, setVariationPriceAction] = useState("Increase");
  const [openChangeDiscountPriceModal, setOpenChangeDiscountPriceModal] =
    useState(false);
  const [openAddDiscountPriceModal, setOpenAddDiscountPriceModal] =
    useState(false);

  const [openAddWeightModal, setOpenAddWeightModal] = useState(false);

  const [discountPriceAction, setDiscountPriceAction] = useState("Increase");
  const [variationStockAction, setVariationStockAction] = useState("Increase");
  const [openVariationStockModal, setOpenVariationStockModal] = useState(false);
  const [productStockAction, setProductStockAction] = useState("Increase");
  const [openProductStockModal, setOpenProductStockModal] = useState(false);
  const [openAddStockModal, setOpenAddStockModal] = useState(false);
  const [openCreateProductOptionModal, setOpenCreateProductOption] =
    useState(false);

  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);

  // product options to be edited
  const [openEditProductOptionModal, setOpenEditProductOptionModal] =
    useState(false);
  const [productOptionsToBeEdited, setProductOptionsToBeEdited] = useState<
    optionType[]
  >([]);

  // products with edited options/variations
  const [productsWithEditedOptions, setProductWithEditedOptions] = useState<
    any[]
  >([]);

  // form row list
  const [formValues, setFormValues] = useState<any[]>([]);
  const [filteredFormValues, setFilteredFormValues] = useState<any[]>([]);

  // selected
  const [selected, setSelected] = useState<string[]>([]);

  // stock filters
  const [viewStockFilter, setViewStockFilter] = useState(false);

  const [stockRangeValue, setStockRangeValue] = useState<number[]>([0, 0]);
  const [applyLowStockFilter, setApplyLowStockFilter] = useState(false);
  const [minStockFilterValue, setMinStockFilterValue] = useState(0);
  const [maxStockFilterValue, setMaxStockFilterValue] = useState(0);
  // price filters
  const [viewPriceFilter, setViewPriceFilter] = useState(false);
  const [priceValue, setPriceValue] = useState<number[]>([0, 0]);
  const [minPriceFilterValue, setMinPriceFilterValue] = useState(0);
  const [maxPriceFilterValue, setMaxPriceFilterValue] = useState(0);

  const [viewDiscountPriceFilter, setViewDiscountPriceFilter] = useState(false);
  const [discountPriceValue, setDiscountPriceValue] = useState<number[]>([
    0, 0,
  ]);
  const [minDiscountPriceFilterValue, setMinDiscountPriceFilterValue] =
    useState(0);
  const [maxDiscountPriceFilterValue, setMaxDiscountPriceFilterValue] =
    useState(100);

  // filter states
  const [selectedFilterCollection, setSelectedFilterCollection] = useState<
    number[]
  >([]);
  const [filterPublished, setFilterPublished] = useState(false);
  const [filterUnPublished, setFilterUnPublished] = useState(false);
  const [minPriceInputValue, setMinPriceInputValue] = useState<null | number>(
    null
  );
  const [maxPriceInputValue, setMaxPriceInputValue] = useState<null | number>(
    null
  );
  const [minDiscountPriceInputValue, setMinDiscountPriceInputValue] = useState<
    null | number
  >(null);
  const [maxDiscountPriceInputValue, setMaxDiscountPriceInputValue] = useState<
    null | number
  >(null);
  const [minStockInputValue, setMinStockInputValue] = useState<null | number>(
    null
  );
  const [maxStockInputValue, setMaxStockInputValue] = useState<null | number>(
    null
  );

  // product varition editor
  const [variantEditorTitle, setVariantEditorTitle] = useState("");
  const [variantEditorAction, setVariantEditorAction] = useState("");
  const [variantEditorType, setVariantEditorType] = useState("");

  const [openProductVariationEditor, setOpenProductVariationEditor] =
    useState(false);
  const [productsVariationTobeEdited, setProductVariationTobeEdited] = useState<
    any[]
  >([]);
  // function to prepare for variation Edit
  const prepareForVariationEdit = () => {
    if (selected.length) {
      let collectSelected = filteredFormValues
        .map((item, i) => {
          if (
            selected.includes(item.id) &&
            item.variations &&
            item.variations.length
          ) {
            return {
              ...item,
              index: i,
              isChecked: true,

              variations: item.variations.map((el: any) => {
                return {
                  ...el,
                  isChecked: true,
                };
              }),
            };
          }
        })
        .filter((item) => item !== undefined);
      setProductVariationTobeEdited(collectSelected);
      setOpenProductVariationEditor(true);
    }
  };

  // selected image
  const [openImageModal, setOpenImageModal] = useState(false);
  const [pickedImage, setPickedImage] = useState<null | {
    index: number;
    value: [];
  }>(null);

  // selected collectio
  const [openCollectionModal, setOpenCollectionModal] = useState(false);
  const [collection, setCollection] = useState<null | {
    index: number;
    collections: [];
  }>(null);

  // selected Description
  const [openDescriptionModal, setOpenDescriptionModal] = useState(false);
  const [description, setDescription] = useState<{
    index: number;
    value: string;
  }>({ index: 0, value: "" });

  // collection property
  const [filterCollections, setFilterCollections] = useState<
    CollectionListType[]
  >([]);

  // Table keys for showing filtering rows
  const [tableKeys, setTableKeys] = useState<string[]>([
    "images",
    "title",
    "details",
    "status",
    "price",
    "sales",
    "stock",
    "cost",
    "tags",
    "weight_kg",
    "preview",
  ]);

  const properties = [
    { name: "Title", key: "title" },
    { name: "Details", key: "details" },
    { name: "Collections", key: "tags" },
    { name: "Status", key: "status" },
    { name: "Price", key: "price" },
    { name: "Cost", key: "cost" },
    { name: "Weight", key: "weight_kg" },
    { name: "Discount Price", key: "sales" },
  ];

  const updateTableKeys = (key: string) => {
    if (tableKeys.includes(key)) {
      setTableKeys((prev) => prev.filter((item) => item !== key));
    } else {
      setTableKeys((prev) => [...prev, key]);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      let result = await bulkEditProduct({ products: data });
      if ("data" in result) {
        showToast("Products successfully edited", "success");
        navigate(-1);
        if (typeof _cio !== "undefined") {
          _cio.track("web_bulk_product_edit", data);
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const bulkSubmit = () => {
    if (
      isSubscriptionExpired ||
      isSubscriptionType === "free" ||
      isSubscriptionType === "starter"
    ) {
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
    } else {
      const productPayloadList = formValues?.map((item) => {
        if (item.isChanged) {
          const { isChanged, ...newObject } = item;

          let realVariations = newObject.variations.map((item: any) => {
            return {
              price: removeFormattedNumerComma(item.price),
              sales: item.sales,
              image: item.image,
              cost: removeFormattedNumerComma(item.cost),
              variant: item.variant.trim(),
              id: item.elId,
            };
          });
          let removeEmptyVariations = realVariations.map((item: any) => {
            return {
              ...getObjWithValidValues(item),
              sales:
                Number(removeFormattedNumerComma(item.sales)) === 0
                  ? ""
                  : removeFormattedNumerComma(item.sales),
            };
          });

          const payload = {
            ...newObject,
            image: newObject.image
              ? newObject.image.name
              : newObject.images &&
                newObject.images.length &&
                newObject.images[0]
              ? newObject.images[0]?.path
              : "",

            cost: removeFormattedNumerComma(newObject.cost),
            price: removeFormattedNumerComma(newObject.price),
            tags: newObject.tags.map((el: any) => el.tag),
            options: newObject.options.map((item: any) => {
              return {
                name: item.name,
                values: item.values,
              };
            }),
            variations: removeEmptyVariations,
          };

          return {
            ...getObjWithValidValues(payload),
            sales:
              Number(removeFormattedNumerComma(newObject.sales)) === 0
                ? ""
                : removeFormattedNumerComma(newObject.sales),
            id: newObject.id,
          };

          // return onSubmit(newObject);
        }
      });
      onSubmit(productPayloadList);
    }
  };

  // change price range value
  const handlePriceRangeChange = (event: Event, newValue: any) => {
    setPriceValue(newValue as number[]);
    setMinPriceInputValue(newValue ? newValue[0] : null);
    setMaxPriceInputValue(newValue ? newValue[1] : null);
  };
  const handleDiscountRangeChange = (event: Event, newValue: any) => {
    setDiscountPriceValue(newValue as number[]);
    setMinDiscountPriceInputValue(newValue ? newValue[0] : null);
    setMaxDiscountPriceInputValue(newValue ? newValue[1] : null);
  };
  const handleStockRangeChange = (event: Event, newValue: any) => {
    setStockRangeValue(newValue as number[]);
    setMinStockInputValue(newValue ? newValue[0] : null);
    setMaxStockInputValue(newValue ? newValue[1] : null);
  };

  // status bulk action
  const publishBulkAction = () => {
    if (selected.length) {
      filteredFormValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          handleChange("status", i, 1);
        }
      });
    }
  };
  const unPublishBulkAction = () => {
    if (selected.length) {
      filteredFormValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          handleChange("status", i, 0);
        }
      });
    }
  };

  // function To Add Edited VariationValue To Form
  const functionToAddEditedVariationValueToForm = (products: any) => {
    products.forEach((item: any) => {
      handleChange("variations", item.index, item.variations);
    });
  };
  // Price bulk action function
  const addPriceBulkAction = (number: number) => {
    if (selected.length) {
      filteredFormValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          handleChange("price", i, number);
        }
      });
    }
  };

  const addCostPriceBulkAction = (number: number) => {
    if (selected.length) {
      filteredFormValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          handleChange("cost", i, number);
        }
      });
    }
  };
  const costPriceBulkAction = (type: string, number: number) => {
    if (selected.length) {
      if (type === "percent") {
        if (costPriceAction === "Increase") {
          filteredFormValues.forEach((item: any, i) => {
            if (selected.includes(item.id)) {
              let cost = Number(removeFormattedNumerComma(item?.cost || 0));
              let calc =
                (number * Number(removeFormattedNumerComma(item?.cost || 0))) /
                100;
              let fullCalc = cost + calc;
              handleChange(
                "cost",
                i,
                fullCalc < 0
                  ? 0
                  : formatNumberWithCommas(
                      parseFloat(String(fullCalc).replace(/,/g, ""))
                    )
              );
            }
          });
        } else if (costPriceAction === "Decrease") {
          filteredFormValues.forEach((item: any, i) => {
            if (selected.includes(item.id)) {
              let cost = Number(removeFormattedNumerComma(item?.cost || 0));
              let calc =
                (number * Number(removeFormattedNumerComma(item?.cost || 0))) /
                100;
              let fullCalc = cost - calc;
              handleChange(
                "cost",
                i,
                fullCalc < 0
                  ? 0
                  : formatNumberWithCommas(
                      parseFloat(String(fullCalc).replace(/,/g, ""))
                    )
              );
            }
          });
        }
      } else if (type === "fixed") {
        if (costPriceAction === "Increase") {
          filteredFormValues.forEach((item: any, i) => {
            if (selected.includes(item.id)) {
              let cost = Number(removeFormattedNumerComma(item?.cost || 0));
              let calc = number;
              let fullCalc = cost + calc;
              handleChange(
                "cost",
                i,
                fullCalc < 0
                  ? 0
                  : formatNumberWithCommas(
                      parseFloat(String(fullCalc).replace(/,/g, ""))
                    )
              );
            }
          });
        } else if (costPriceAction === "Decrease") {
          filteredFormValues.forEach((item: any, i) => {
            if (selected.includes(item.id)) {
              let cost = Number(removeFormattedNumerComma(item?.cost || 0));
              let calc = number;
              let fullCalc = cost - calc;
              handleChange(
                "cost",
                i,
                fullCalc < 0
                  ? 0
                  : formatNumberWithCommas(
                      parseFloat(String(fullCalc).replace(/,/g, ""))
                    )
              );
            }
          });
        }
      }
    }
  };
  const priceBulkAction = (type: string, number: number) => {
    if (selected.length) {
      if (type === "percent") {
        if (priceAction === "Increase") {
          filteredFormValues.forEach((item: any, i) => {
            if (selected.includes(item.id)) {
              let price = Number(removeFormattedNumerComma(item.price));
              let calc =
                (number * Number(removeFormattedNumerComma(item.price))) / 100;
              let fullCalc = price + calc;

              handleChange(
                "price",
                i,
                fullCalc < 0
                  ? 0
                  : formatNumberWithCommas(
                      parseFloat(String(fullCalc).replace(/,/g, ""))
                    )
              );
            }
          });
        } else if (priceAction === "Decrease") {
          filteredFormValues.forEach((item: any, i) => {
            if (selected.includes(item.id)) {
              let price = Number(removeFormattedNumerComma(item.price));
              let calc =
                (number * Number(removeFormattedNumerComma(item.price))) / 100;
              let fullCalc = price - calc;
              handleChange(
                "price",
                i,
                fullCalc < 0
                  ? 0
                  : formatNumberWithCommas(
                      parseFloat(String(fullCalc).replace(/,/g, ""))
                    )
              );
            }
          });
        }
      } else if (type === "fixed") {
        if (priceAction === "Increase") {
          filteredFormValues.forEach((item: any, i) => {
            if (selected.includes(item.id)) {
              let price = Number(removeFormattedNumerComma(item.price));
              let calc = number;
              let fullCalc = price + calc;

              handleChange(
                "price",
                i,
                fullCalc < 0
                  ? 0
                  : formatNumberWithCommas(
                      parseFloat(String(fullCalc).replace(/,/g, ""))
                    )
              );
            }
          });
        } else if (priceAction === "Decrease") {
          filteredFormValues.forEach((item: any, i) => {
            if (selected.includes(item.id)) {
              let price = Number(removeFormattedNumerComma(item.price));
              let calc = number;
              let fullCalc = price - calc;

              handleChange(
                "price",
                i,
                fullCalc < 0
                  ? 0
                  : formatNumberWithCommas(
                      parseFloat(String(fullCalc).replace(/,/g, ""))
                    )
              );
            }
          });
        }
      }
    }
  };
  const variationPriceBulkAction = (type: string, number: number) => {
    if (selected.length) {
      if (type === "percent") {
        if (variationPriceAction === "Increase") {
          filteredFormValues.forEach((item: any, i) => {
            if (selected.includes(item.id)) {
              let variations = item.variations;
              if (variations.length) {
                let newVariation = variations.map((variant: any) => {
                  let price = Number(variant.price);
                  let calc = (number * Number(variant.price)) / 100;
                  let fullCalc = price + calc;
                  return {
                    ...variant,
                    price: fullCalc < 0 ? 0 : fullCalc,
                  };
                });
                handleChange("variations", i, newVariation);
              }
            }
          });
        } else if (variationPriceAction === "Decrease") {
          filteredFormValues.forEach((item: any, i) => {
            if (selected.includes(item.id)) {
              let variations = item.variations;
              if (variations.length) {
                let newVariation = variations.map((variant: any) => {
                  let price = Number(variant.price);
                  let calc = (number * Number(variant.price)) / 100;
                  let fullCalc = price - calc;
                  return {
                    ...variant,
                    price: fullCalc < 0 ? 0 : fullCalc,
                  };
                });
                handleChange("variations", i, newVariation);
              }
            }
          });
        }
      } else if (type === "fixed") {
        if (variationPriceAction === "Increase") {
          filteredFormValues.forEach((item: any, i) => {
            if (selected.includes(item.id)) {
              let variations = item.variations;
              if (variations.length) {
                let newVariation = variations.map((variant: any) => {
                  let price = Number(variant.price);
                  let calc = number;
                  let fullCalc = price + calc;
                  return {
                    ...variant,
                    price: fullCalc < 0 ? 0 : fullCalc,
                  };
                });
                handleChange("variations", i, newVariation);
              }
            }
          });
        } else if (variationPriceAction === "Decrease") {
          filteredFormValues.forEach((item: any, i) => {
            if (selected.includes(item.id)) {
              let variations = item.variations;
              if (variations.length) {
                let newVariation = variations.map((variant: any) => {
                  let price = Number(variant.price);
                  let calc = number;
                  let fullCalc = price - calc;
                  return {
                    ...variant,
                    price: fullCalc < 0 ? 0 : fullCalc,
                  };
                });
                handleChange("variations", i, newVariation);
              }
            }
          });
        }
      }
    }
  };
  const variationStockQuantityBulkAction = (type: string, number: number) => {
    if (variationStockAction === "Increase") {
      filteredFormValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          let variations = item.variations;
          if (variations.length) {
            let newVariation = variations.map((variant: any) => {
              let stock = Number(variant.stock);
              let calc = number;
              let fullCalc = stock + calc;
              return {
                ...variant,
                stock: fullCalc < 0 ? 0 : fullCalc,
              };
            });
            handleChange("variations", i, newVariation);
          }
        }
      });
    } else if (variationStockAction === "Decrease") {
      filteredFormValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          let variations = item.variations;
          if (variations.length) {
            let newVariation = variations.map((variant: any) => {
              let stock = Number(variant.stock);
              let calc = number;
              let fullCalc = stock - calc;
              return {
                ...variant,
                stock: fullCalc < 0 ? 0 : fullCalc,
              };
            });
            handleChange("variations", i, newVariation);
          }
        }
      });
    }
  };
  const discountPriceBulkAction = (type: string, number: number) => {
    if (selected.length) {
      if (type === "percent") {
        if (discountPriceAction === "Increase") {
          filteredFormValues.forEach((item: any, i) => {
            if (selected.includes(item.id)) {
              let sales = Number(removeFormattedNumerComma(item.sales));
              let calc =
                (number * Number(removeFormattedNumerComma(item.sales))) / 100;
              let fullCalc = sales + calc;

              handleChange(
                "sales",
                i,
                fullCalc < 0
                  ? 0
                  : formatNumberWithCommas(
                      parseFloat(String(fullCalc).replace(/,/g, ""))
                    )
              );
            }
          });
        } else if (discountPriceAction === "Decrease") {
          filteredFormValues.forEach((item: any, i) => {
            if (selected.includes(item.id)) {
              let sales = Number(removeFormattedNumerComma(item.sales));
              let calc =
                (number * Number(removeFormattedNumerComma(item.sales))) / 100;
              let fullCalc = sales - calc;

              handleChange(
                "sales",
                i,
                fullCalc < 0
                  ? 0
                  : formatNumberWithCommas(
                      parseFloat(String(fullCalc).replace(/,/g, ""))
                    )
              );
            }
          });
        }
      } else if (type === "fixed") {
        if (discountPriceAction === "Increase") {
          filteredFormValues.forEach((item: any, i) => {
            if (selected.includes(item.id)) {
              let sales = Number(removeFormattedNumerComma(item.sales));
              let calc = number;
              let fullCalc = sales + calc;
              handleChange(
                "sales",
                i,
                fullCalc < 0
                  ? 0
                  : formatNumberWithCommas(
                      parseFloat(String(fullCalc).replace(/,/g, ""))
                    )
              );
            }
          });
        } else if (discountPriceAction === "Decrease") {
          filteredFormValues.forEach((item: any, i) => {
            if (selected.includes(item.id)) {
              let sales = Number(removeFormattedNumerComma(item.sales));
              let calc = number;
              let fullCalc = sales - calc;
              handleChange(
                "sales",
                i,
                fullCalc < 0
                  ? 0
                  : formatNumberWithCommas(
                      parseFloat(String(fullCalc).replace(/,/g, ""))
                    )
              );
            }
          });
        }
      }
    }
  };
  const addDiscountPriceBulkAction = (number: number) => {
    if (selected.length) {
      filteredFormValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          handleChange("sales", i, number);
        }
      });
    }
  };

  // weight bulk action
  const addWeightBulkAction = (number: number) => {
    if (selected.length) {
      filteredFormValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          handleChange("weight_kg", i, number);
        }
      });
    }
  };
  // stock quantity bulk action
  const stockQuantityBulkAction = (type: string, number: number) => {
    if (selected.length) {
      if (productStockAction === "Increase") {
        filteredFormValues.forEach((item: any, i) => {
          if (selected.includes(item.id)) {
            let stock = Number(item.stock);
            let calc = number;
            let fullCalc = stock + calc;
            handleChange("stock", i, fullCalc < 0 ? 0 : fullCalc);
          }
        });
      } else if (productStockAction === "Decrease") {
        filteredFormValues.forEach((item: any, i) => {
          if (selected.includes(item.id)) {
            let stock = Number(item.stock);
            let calc = number;
            let fullCalc = stock - calc;
            handleChange("stock", i, fullCalc < 0 ? 0 : fullCalc);
          }
        });
      }
    }
  };
  const addStockBulkAction = (number: number) => {
    if (selected.length) {
      filteredFormValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          handleChange("stock", i, number);
        }
      });
    }
  };
  // function to add product to collection
  const addProductToCollectionFnc = (collection: CollectionType[]) => {
    if (selected.length) {
      filteredFormValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          const mergedTags = [...collection];
          item.tags.forEach((el: any) => {
            const hasDuplicate = mergedTags.some(
              (tagItem) => tagItem.id === el.id
            );
            if (!hasDuplicate) {
              mergedTags.push(el);
            }
          });
          handleChange("tags", i, mergedTags);
        }
      });
    }
  };

  // function to remove product from collection
  const removeProductFromCollectionFnc = (collection: CollectionType[]) => {
    if (selected.length) {
      filteredFormValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          const filteredTag = item.tags.filter((tagItem: any) => {
            // Check if the current tag's id exists in prevTag
            return !collection.some(
              (prevTagItem) => prevTagItem.id === tagItem.id
            );
          });
          handleChange("tags", i, filteredTag);
        }
      });
    }
  };

  // function to prepare product for collection removal
  const prepareProductForCollectionRemoval = () => {
    let listOfTags: any = [];
    formValues.forEach((currentProduct: any) => {
      if (selected.includes(currentProduct.id)) {
        currentProduct.tags.forEach((currentTag: any) => {
          const tagExists = listOfTags.some(
            (tag: any) => tag.id === currentTag.id
          );
          listOfTags.push(currentTag);
        });
      }
    });
    setListOfTagsForRemoval(listOfTags);
    setOpenRemoveProductFromCollection(true);
  };

  // function to add new product options
  const addCreateProductOption = (options: any) => {
    if (selected.length) {
      filteredFormValues.forEach((item: any, i) => {
        if (selected.includes(item.id)) {
          setProductWithEditedOptions((prev) => [...prev, item]);
          let combinedOptions = [...item.options, ...options];
          const array = combinedOptions.reduce(
            (acc: any, option: any) =>
              acc.flatMap((obj: any) =>
                option.values.map((value: any) => {
                  return {
                    variant: `${obj.variant ? obj.variant + "-" : ""}${value}`,
                  };
                })
              ),
            [{}]
          );
          const variationList = array.map((el: any, i: number) => {
            return {
              stock: "",
              price: item.price,
              cost: item.cost,
              image: item.image
                ? item.image
                : item.images.length && item.images[0]
                ? item.images[0]?.path
                : "",
              sales: "",
              ...el,
            };
          });
          const mergedArray = mergeArraysOfVariation(
            variationList,
            item.variations
          );
          handleChange("options", i, combinedOptions);
          handleChange("variations", i, mergedArray);
        }
      });
    }
  };

  // function for inputs changed
  const handleFeildsChange =
    (name: keyof any, index: number, formatValue?: boolean) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = e.target;
      let newFormValues: any = [...formValues];
      let newFormFilteredValues: any = [...filteredFormValues];
      if (formatValue) {
        if (value.length === 0) {
          newFormValues[index][name] = "";
          newFormFilteredValues[index][name] = "";
        } else {
          newFormValues[index][name] = formatNumberWithCommas(
            parseFloat(value.replace(/,/g, ""))
          );
          newFormFilteredValues[index][name] = formatNumberWithCommas(
            parseFloat(value.replace(/,/g, ""))
          );
        }
      } else {
        newFormValues[index][name] = value;
        newFormFilteredValues[index][name] = value;
      }

      newFormValues[index]["isChanged"] = true;
      newFormFilteredValues[index]["isChanged"] = true;
      setFormValues([...newFormValues]);
      setFilteredFormValues([...newFormFilteredValues]);
    };

  // function for other forms of change
  const handleChange = (name: string, index: number, value: any) => {
    let newFormValues: any = [...formValues];
    let newFormFilteredValues: any = [...filteredFormValues];
    newFormValues[index][name] = value;
    newFormFilteredValues[index][name] = value;
    newFormValues[index]["isChanged"] = true;
    newFormFilteredValues[index]["isChanged"] = true;
    setFormValues([...newFormValues]);
    setFilteredFormValues([...newFormFilteredValues]);
  };

  // function to open image modal
  const openImageModalFnc = (i: number, value: []) => {
    setPickedImage({ index: i, value });
    setOpenImageModal(true);
  };

  // function to open description modal
  const openDescriptionModalFnc = (i: number, value: string) => {
    setDescription({ index: i, value });
    setOpenDescriptionModal(true);
  };

  // function to open collection modal
  const openCollectionModalFnc = (i: number, collections: []) => {
    setOpenCollectionModal(true);
    setCollection({ index: i, collections });
  };

  // function to open edit options modal
  const openEditProductOptionModalFnc = () => {
    const selectedoptions = selectBulk.map((item) => item.options);
    const result = checkEquality(selectedoptions);
    if (result.areEqual) {
      if (result.equalArrays[0]?.length) {
        setProductOptionsToBeEdited(result.equalArrays[0]);
        setOpenEditProductOptionModal(true);
      } else {
        showToast("Please select products with options", "error");
      }
    } else {
      showToast("Please select products with identical options", "error");
    }
    // setProductOptionsToBeEdited
  };

  function checkEquality(allList: any) {
    let areEqual = true;
    const equalArrays: any[] = [];

    allList.forEach((currentArray: any, currentIndex: any) => {
      if (currentIndex === 0) {
        equalArrays.push(currentArray);
        return;
      }

      const previousArray = allList[currentIndex - 1];

      if (currentArray.length === previousArray.length) {
        const equal = currentArray.every((currentObj: any, objIndex: any) => {
          const previousObj = previousArray[objIndex];

          return (
            currentObj.name.toLowerCase() === previousObj.name.toLowerCase() &&
            arraysAreEqual(currentObj.values, previousObj.values)
          );
        });

        if (equal) {
          equalArrays.push(currentArray);
        } else {
          areEqual = false;
        }
      } else {
        areEqual = false;
      }
    });

    return {
      areEqual: areEqual,
      equalArrays: equalArrays,
    };
  }
  // Helper function to check if two arrays are equal
  function arraysAreEqual(arr1: any, arr2: any) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  // filter actions
  useEffect(() => {
    const filterData = () => {
      let updatedData = [...formValues];
      if (selectedFilterCollection?.length) {
        updatedData = updatedData.filter((item) => {
          return item.tags.some((el: any) =>
            selectedFilterCollection.includes(el.id)
          );
        });
      }
      if (filterPublished) {
        updatedData = updatedData.filter((item) => item.status === 1);
      }
      if (filterUnPublished) {
        updatedData = updatedData.filter((item) => item.status === 0);
      }
      if (minPriceInputValue) {
        updatedData = updatedData.filter(
          (item) =>
            Number(removeFormattedNumerComma(item.price)) >=
            Number(minPriceInputValue)
        );
      }
      if (maxPriceInputValue) {
        updatedData = updatedData.filter(
          (item) =>
            Number(removeFormattedNumerComma(item.price)) <=
            Number(maxPriceInputValue)
        );
      }

      if (minDiscountPriceInputValue) {
        updatedData = updatedData.filter(
          (item) =>
            Number(removeFormattedNumerComma(item.sales)) >=
            Number(minDiscountPriceInputValue)
        );
      }
      if (maxDiscountPriceInputValue) {
        updatedData = updatedData.filter(
          (item) =>
            Number(removeFormattedNumerComma(item.sales)) <=
            Number(maxDiscountPriceInputValue)
        );
      }

      if (minStockInputValue) {
        updatedData = updatedData.filter(
          (item) => Number(item.stock) >= Number(minStockInputValue)
        );
      }
      if (maxStockInputValue) {
        updatedData = updatedData.filter(
          (item) => Number(item.stock) <= Number(maxStockInputValue)
        );
      }
      if (applyLowStockFilter) {
        updatedData = updatedData.filter((item) => Number(item.stock) <= 2);
      }

      setFilteredFormValues(updatedData);
    };
    filterData();
  }, [
    selectedFilterCollection,
    filterPublished,
    filterUnPublished,
    minDiscountPriceInputValue,
    maxDiscountPriceInputValue,
    minPriceInputValue,
    maxPriceInputValue,
    minStockInputValue,
    maxStockInputValue,
    applyLowStockFilter,
  ]);

  useEffect(() => {
    if (bulkProductList && bulkProductList.length) {
      let preparedBulkList = bulkProductList.map((item: any) => {
        return {
          title: item.title,
          details: item.details,
          tags: item.tags ? item.tags : [],
          status: item.status,
          cost: item.cost
            ? formatNumberWithCommas(
                parseFloat(String(item.cost)?.replace(/,/g, ""))
              )
            : null,
          price: item.price
            ? formatNumberWithCommas(
                parseFloat(String(item.price)?.replace(/,/g, ""))
              )
            : null,
          sales: item.sales
            ? formatNumberWithCommas(
                parseFloat(String(item.sales)?.replace(/,/g, ""))
              )
            : null,
          stock: item.quantity,
          sku: item.sku,
          weight_kg: item.weight_kg,
          unit: item.unit,
          id: item.id,
          has_discount: item.has_discount,
          alt_image_url: item.alt_image_url,
          variations: item.variations.map((el: any) => {
            return {
              stock: el.quantity,
              price: el.price,
              image: el.image ? el.image : "",
              variant: el.variant,
              cost: el.cost,
              sales: el.sales,
              has_discount: el.has_discount,
              elId: el.id,
              weight_kg: el.weight_kg,
            };
          }),
          options: item.options.map((option: any) => {
            return {
              ...option,
              id: `${uuid()}`,
            };
          }),
          images: item.images,
          image: item.image,
        };
      });
      setFormValues(preparedBulkList);
      setFilteredFormValues(preparedBulkList);
    }
  }, [bulkProductList]);

  useEffect(() => {
    let listOfTags: any = [];
    formValues.forEach((currentProduct: any) => {
      currentProduct.tags.forEach((currentTag: any) => {
        const tagExists = listOfTags.some(
          (tag: any) => tag.id === currentTag.id
        );

        if (!tagExists) {
          listOfTags.push(currentTag);
        }
      });
    });
    setFilterCollections(listOfTags);
  }, [formValues]);

  return (
    <>
      {bulkEditLoading && <Loader />}
      <div className="pd_edit_bulk_list">
        <div className="bulk_list_container">
          <ModalHeader text="Bulk Editor" />

          <div className="edit_container">
            <div className="propertiesAndFilters">
              {/* properties */}
              <div className="properties">
                <div
                  onClick={() => {
                    setOpenProperties(!openProperties);
                  }}
                  className="property_select_box"
                >
                  <p>Table Properties</p>
                  <ChevronDownIcon />
                </div>
                <AnimatePresence>
                  {openProperties && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ type: "just" }}
                      className="property_drop_down"
                    >
                      <p className="description">
                        Check menus to show / hide columns from the table
                      </p>
                      <div className="check_properties">
                        {properties.map((item, i) => {
                          return (
                            <div className="single_property" key={i}>
                              <Checkbox
                                value={item.key}
                                checked={tableKeys.includes(item.key)}
                                onChange={(e) => {
                                  updateTableKeys(e.target.value);
                                }}
                              />
                              <p className="name">{item.name}</p>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* filters */}
              <div className="filters">
                {/* collection filter */}
                <Accordion defaultExpanded={true} className="accordion">
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <p className="title">Collections</p>
                  </AccordionSummary>
                  <AccordionDetails>
                    {filterCollections.map((item: any, i) => (
                      <div className="key_box" key={i}>
                        <p className="name">{item.tag}</p>
                        <Checkbox
                          value={item.id}
                          checked={selectedFilterCollection.includes(item.id)}
                          onChange={() => {
                            if (selectedFilterCollection.includes(item.id)) {
                              setSelectedFilterCollection((prev) =>
                                prev.filter((el) => el !== item.id)
                              );
                            } else {
                              setSelectedFilterCollection((prev) => [
                                ...prev,
                                item.id,
                              ]);
                            }
                          }}
                        />
                      </div>
                    ))}
                  </AccordionDetails>
                </Accordion>

                {/* Status Filter */}
                <Accordion defaultExpanded={true} className="accordion">
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <p className="title">Products</p>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="key_box">
                      <p className="name">Published</p>
                      <Checkbox
                        checked={filterPublished}
                        onChange={(e) => {
                          setFilterPublished(!filterPublished);
                        }}
                      />
                    </div>
                    <div className="key_box">
                      <p className="name">Unpublished</p>
                      <Checkbox
                        checked={filterUnPublished}
                        onChange={(e) => {
                          setFilterUnPublished(!filterUnPublished);
                        }}
                      />
                    </div>
                  </AccordionDetails>
                </Accordion>
                {/* Price Filter */}
                <Accordion defaultExpanded={true} className="accordion">
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <p className="title">Price</p>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="price_box">
                      <div className="key_box">
                        <p className="name">Price</p>
                        <Checkbox
                          checked={viewPriceFilter}
                          onChange={(e) => {
                            setViewPriceFilter(!viewPriceFilter);
                            if (e.target.checked === false) {
                              setMinPriceInputValue(null);
                              setMaxPriceInputValue(null);
                              setPriceValue([0, 0]);
                            } else {
                              if (formValues.length) {
                                const prices = formValues.map((item) =>
                                  item.price
                                    ? parseInt(
                                        String(
                                          removeFormattedNumerComma(
                                            item?.price || 0
                                          )
                                        )
                                      )
                                    : 0
                                );
                                const highestPrice = Math.max(...prices);
                                const lowestPrice = Math.min(...prices);

                                setMinPriceFilterValue(lowestPrice);
                                setMaxPriceFilterValue(highestPrice);
                              }
                            }
                          }}
                        />
                      </div>
                      {viewPriceFilter && (
                        <div className="price_filter_container">
                          <Slider
                            value={priceValue}
                            onChange={handlePriceRangeChange}
                            valueLabelDisplay="auto"
                            max={maxPriceFilterValue}
                            min={minPriceFilterValue}
                          />
                          <div className="input_box">
                            <InputField
                              value={
                                minPriceInputValue
                                  ? minPriceInputValue
                                  : priceValue[0]
                              }
                              onChange={(e) => {
                                setMinPriceInputValue(Number(e.target.value));
                              }}
                              prefix={<BorderNairaIcon />}
                            />
                            <InputField
                              value={
                                maxPriceInputValue
                                  ? maxPriceInputValue
                                  : priceValue[1]
                              }
                              onChange={(e) => {
                                setMaxPriceInputValue(Number(e.target.value));
                              }}
                              prefix={<BorderNairaIcon />}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="price_box">
                      <div className="key_box">
                        <p className="name">Discount Price</p>
                        <Checkbox
                          checked={viewDiscountPriceFilter}
                          onChange={(e) => {
                            setViewDiscountPriceFilter(
                              !viewDiscountPriceFilter
                            );
                            if (e.target.checked === false) {
                              setMinDiscountPriceInputValue(null);
                              setMaxDiscountPriceInputValue(null);
                              setDiscountPriceValue([0, 0]);
                            } else {
                              if (formValues.length) {
                                const discount = formValues.map((item) =>
                                  item.sales
                                    ? parseInt(
                                        String(
                                          removeFormattedNumerComma(
                                            item?.sales || 0
                                          )
                                        )
                                      )
                                    : 0
                                );
                                const highestPrice = Math.max(...discount);
                                const lowestPrice = Math.min(...discount);
                                setMinDiscountPriceFilterValue(lowestPrice);
                                setMaxDiscountPriceFilterValue(highestPrice);
                              }
                            }
                          }}
                        />
                      </div>
                      {viewDiscountPriceFilter && (
                        <div className="price_filter_container">
                          <Slider
                            value={discountPriceValue}
                            onChange={handleDiscountRangeChange}
                            valueLabelDisplay="auto"
                            max={maxDiscountPriceFilterValue}
                            min={minDiscountPriceFilterValue}
                          />
                          <div className="input_box">
                            <InputField
                              value={
                                minDiscountPriceInputValue
                                  ? minDiscountPriceInputValue
                                  : discountPriceValue[0]
                              }
                              onChange={(e) => {
                                setMinDiscountPriceInputValue(
                                  Number(e.target.value)
                                );
                              }}
                              prefix={<BorderNairaIcon />}
                            />

                            <InputField
                              value={
                                maxDiscountPriceInputValue
                                  ? maxDiscountPriceInputValue
                                  : discountPriceValue[1]
                              }
                              onChange={(e) => {
                                setMaxDiscountPriceInputValue(
                                  Number(e.target.value)
                                );
                              }}
                              prefix={<BorderNairaIcon />}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>
            <div className="formTableContainer">
              {viewWarning && (
                <div className="warning_indicator">
                  <div className="text_side">
                    <InfoCircleXLIcon />
                    <p>
                      Only products with similar properties can be changed at
                      once.
                    </p>
                  </div>
                  <IconButton
                    onClick={() => {
                      setViewWarning(false);
                    }}
                  >
                    <XIcon className="cancel" stroke={"#222D37"} />
                  </IconButton>
                </div>
              )}

              <div className=" table_section table_container">
                <div className="table_action_container">
                  <div className="left_section">
                    <div className="show_selected_actions">
                      <p>Selected: {selected.length}</p>

                      <DropDownWrapper
                        origin="left"
                        action={
                          <Button
                            endIcon={<FillArrowIcon />}
                            className="bulk_action_button"
                          >
                            Change Price
                          </Button>
                        }
                      >
                        <div className="bulk_action_card large">
                          <Button
                            className="icon_action_button"
                            startIcon={<PlusCircleIcon stroke="#5C636D" />}
                            onClick={() => {
                              if (selected.length) {
                                setOpenChangePriceModal(true);
                                setPriceAction("Increase");
                              } else {
                                showToast("Select product to edit", "error");
                              }
                            }}
                          >
                            Increase Price
                          </Button>

                          <Button
                            className="icon_action_button"
                            startIcon={<MinusCircleIcon stroke="#5C636D" />}
                            onClick={() => {
                              if (selected.length) {
                                setOpenChangePriceModal(true);
                                setPriceAction("Decrease");
                              } else {
                                showToast("Select product to edit", "error");
                              }
                            }}
                          >
                            Decrease Price
                          </Button>
                          <Button
                            className="icon_action_button"
                            startIcon={<PlusCircleIcon stroke="#5C636D" />}
                            onClick={() => {
                              if (selected.length) {
                                setOpenAddPriceModal(true);
                              } else {
                                showToast("Select product to edit", "error");
                              }
                            }}
                          >
                            Change price
                          </Button>
                        </div>
                      </DropDownWrapper>

                      {/* change discount price */}
                      <DropDownWrapper
                        origin="left"
                        action={
                          <Button
                            endIcon={<FillArrowIcon />}
                            className="bulk_action_button"
                          >
                            Change Discounted Price
                          </Button>
                        }
                      >
                        <div className="bulk_action_card large">
                          <Button
                            className="icon_action_button"
                            startIcon={<PlusCircleIcon stroke="#5C636D" />}
                            onClick={() => {
                              if (selected.length) {
                                setOpenChangeDiscountPriceModal(true);
                                setDiscountPriceAction("Increase");
                              } else {
                                showToast("Select product to edit", "error");
                              }
                            }}
                          >
                            Increase discounted Price
                          </Button>
                          <Button
                            className="icon_action_button"
                            startIcon={<MinusCircleIcon stroke="#5C636D" />}
                            onClick={() => {
                              if (selected.length) {
                                setOpenChangeDiscountPriceModal(true);
                                setDiscountPriceAction("Decrease");
                              } else {
                                showToast("Select product to edit", "error");
                              }
                            }}
                          >
                            Decrease discounted price
                          </Button>
                          <Button
                            className="icon_action_button"
                            startIcon={<PlusCircleIcon stroke="#5C636D" />}
                            onClick={() => {
                              if (selected.length) {
                                setOpenAddDiscountPriceModal(true);
                              } else {
                                showToast("Select product to edit", "error");
                              }
                            }}
                          >
                            Change discounted price
                          </Button>
                        </div>
                      </DropDownWrapper>

                      {/* change weight */}
                      <DropDownWrapper
                        origin="left"
                        action={
                          <Button
                            endIcon={<FillArrowIcon />}
                            className="bulk_action_button"
                          >
                            Change Weight
                          </Button>
                        }
                      >
                        <div className="bulk_action_card large">
                          <Button
                            className="icon_action_button"
                            startIcon={<PlusCircleIcon stroke="#5C636D" />}
                            onClick={() => {
                              if (selected.length) {
                                setOpenAddWeightModal(true);
                              } else {
                                showToast("Select product to edit", "error");
                              }
                            }}
                          >
                            Change weight
                          </Button>
                        </div>
                      </DropDownWrapper>

                      {/* change variations */}
                      <DropDownWrapper
                        origin="left"
                        action={
                          <Button
                            endIcon={<FillArrowIcon />}
                            className="bulk_action_button"
                          >
                            Change Variation
                          </Button>
                        }
                      >
                        <div className="bulk_action_card large">
                          {/* variation prices */}
                          <div className="action_section">
                            <h4>Variation Prices</h4>
                            <Button
                              className="icon_action_button"
                              startIcon={<PlusCircleIcon stroke="#5C636D" />}
                              onClick={() => {
                                if (selected.length) {
                                  setVariantEditorTitle(
                                    "Increase Variations Price"
                                  );
                                  setVariantEditorAction("Increase");
                                  setVariantEditorType("price");
                                  prepareForVariationEdit();
                                } else {
                                  showToast("Select product to edit", "error");
                                }
                              }}
                            >
                              Increase variation price
                            </Button>
                            <Button
                              className="icon_action_button"
                              startIcon={<MinusCircleIcon stroke="#5C636D" />}
                              onClick={() => {
                                if (selected.length) {
                                  setVariantEditorTitle(
                                    "Decrease Variations Price"
                                  );
                                  setVariantEditorAction("Decrease");
                                  setVariantEditorType("price");
                                  prepareForVariationEdit();
                                } else {
                                  showToast("Select product to edit", "error");
                                }
                              }}
                            >
                              Decrease variation price
                            </Button>
                          </div>

                          {/* variation cost prices */}
                          <div className="action_section">
                            <h4>Variation Cost Prices</h4>
                            <Button
                              className="icon_action_button"
                              startIcon={<PlusCircleIcon stroke="#5C636D" />}
                              onClick={() => {
                                if (selected.length) {
                                  setVariantEditorTitle(
                                    "Increase Variations Cost Price"
                                  );
                                  setVariantEditorAction("Increase");
                                  setVariantEditorType("cost");
                                  prepareForVariationEdit();
                                } else {
                                  showToast("Select product to edit", "error");
                                }
                              }}
                            >
                              Increase variation cost price
                            </Button>
                            <Button
                              className="icon_action_button"
                              startIcon={<MinusCircleIcon stroke="#5C636D" />}
                              onClick={() => {
                                if (selected.length) {
                                  setVariantEditorTitle(
                                    "Decrease Variations Cost Price"
                                  );
                                  setVariantEditorAction("Decrease");
                                  setVariantEditorType("cost");
                                  prepareForVariationEdit();
                                } else {
                                  showToast("Select product to edit", "error");
                                }
                              }}
                            >
                              Decrease variation cost price
                            </Button>
                          </div>
                          {/* variation discount */}
                          <div className="action_section">
                            <h4>Variations Discount Price</h4>
                            <Button
                              className="icon_action_button"
                              startIcon={<PlusCircleIcon stroke="#5C636D" />}
                              onClick={() => {
                                if (selected.length) {
                                  setVariantEditorTitle(
                                    "Increase Variations Discounted Price"
                                  );
                                  setVariantEditorAction("Increase");
                                  setVariantEditorType("discount");
                                  prepareForVariationEdit();
                                } else {
                                  showToast("Select product to edit", "error");
                                }
                              }}
                            >
                              Increase variations discounted price
                            </Button>
                            <Button
                              className="icon_action_button"
                              startIcon={<MinusCircleIcon stroke="#5C636D" />}
                              onClick={() => {
                                // setOpenVariationStockModal(true);
                                // setVariationStockAction("Decrease");

                                if (selected.length) {
                                  setVariantEditorTitle(
                                    "Decrease Variations Discounted Price"
                                  );
                                  setVariantEditorAction("Decrease");
                                  setVariantEditorType("discount");
                                  prepareForVariationEdit();
                                } else {
                                  showToast("Select product to edit", "error");
                                }
                              }}
                            >
                              Decrease variations discounted price
                            </Button>
                          </div>

                          {/* variation weight */}
                          <div className="action_section">
                            <h4>Variation Weight</h4>
                            <Button
                              className="icon_action_button"
                              startIcon={<PlusCircleIcon stroke="#5C636D" />}
                              onClick={() => {
                                if (selected.length) {
                                  setVariantEditorTitle(
                                    "Increase Variation Weight"
                                  );
                                  setVariantEditorAction("Increase");
                                  setVariantEditorType("weight_kg");
                                  prepareForVariationEdit();
                                } else {
                                  showToast("Select product to edit", "error");
                                }
                              }}
                            >
                              Increase variation weight
                            </Button>
                            <Button
                              className="icon_action_button"
                              startIcon={<PlusCircleIcon stroke="#5C636D" />}
                              onClick={() => {
                                if (selected.length) {
                                  setVariantEditorTitle(
                                    "Decrease Variation Weight"
                                  );
                                  setVariantEditorAction("Decrease");
                                  setVariantEditorType("weight_kg");
                                  prepareForVariationEdit();
                                } else {
                                  showToast("Select product to edit", "error");
                                }
                              }}
                            >
                              Decrease variation weight
                            </Button>
                          </div>
                        </div>
                      </DropDownWrapper>
                      {/* collection bulk action */}
                      <DropDownWrapper
                        origin="left"
                        action={
                          <Button
                            endIcon={<FillArrowIcon />}
                            className="bulk_action_button"
                          >
                            Change Collection
                          </Button>
                        }
                      >
                        <div className="bulk_action_card large">
                          <Button
                            className="icon_action_button"
                            startIcon={<PlusCircleIcon stroke="#5C636D" />}
                            onClick={() => {
                              if (selected.length) {
                                setOpenAddProductToCollection(true);
                              } else {
                                showToast("Select product to edit", "error");
                              }
                            }}
                          >
                            Add products to collection
                          </Button>
                          <Button
                            className="icon_action_button"
                            startIcon={<MinusCircleIcon />}
                            onClick={() => {
                              if (selectBulk.length) {
                                prepareProductForCollectionRemoval();
                              } else {
                                showToast("Select product to edit", "error");
                              }
                            }}
                          >
                            Remove products from collection{" "}
                          </Button>
                        </div>
                      </DropDownWrapper>
                      {/* status bulk action */}
                      <DropDownWrapper
                        origin="left"
                        action={
                          <Button
                            endIcon={<FillArrowIcon />}
                            className="bulk_action_button"
                          >
                            Change Status
                          </Button>
                        }
                      >
                        <div className="bulk_action_card large">
                          <Button
                            className="icon_action_button"
                            startIcon={<EyeIcon stroke="#5C636D" />}
                            onClick={() => {
                              if (selected.length) {
                                publishBulkAction();
                              } else {
                                showToast("Select product to edit", "error");
                              }
                            }}
                          >
                            Publish
                          </Button>
                          <Button
                            className="icon_action_button"
                            startIcon={<EyeOffIcon stroke="#5C636D" />}
                            onClick={() => {
                              if (selected.length) {
                                unPublishBulkAction();
                              } else {
                                showToast("Select product to edit", "error");
                              }
                            }}
                          >
                            Unpublish
                          </Button>
                        </div>
                      </DropDownWrapper>

                      {/* change cost price */}
                      <DropDownWrapper
                        origin="left"
                        action={
                          <Button
                            endIcon={<FillArrowIcon />}
                            className="bulk_action_button"
                          >
                            Change Cost Price
                          </Button>
                        }
                      >
                        <div className="bulk_action_card large">
                          <Button
                            className="icon_action_button"
                            startIcon={<PlusCircleIcon stroke="#5C636D" />}
                            onClick={() => {
                              if (selected.length) {
                                setOpenChangeCostPriceModal(true);
                                setCostPriceAction("Increase");
                              } else {
                                showToast("Select product to edit", "error");
                              }
                            }}
                          >
                            Increase Cost Price
                          </Button>
                          <Button
                            className="icon_action_button"
                            startIcon={<MinusCircleIcon stroke="#5C636D" />}
                            onClick={() => {
                              if (selected.length) {
                                setOpenChangeCostPriceModal(true);
                                setCostPriceAction("Decrease");
                              } else {
                                showToast("Select product to edit", "error");
                              }
                            }}
                          >
                            Decrease Cost Price
                          </Button>
                          <Button
                            className="icon_action_button"
                            startIcon={<PlusCircleIcon stroke="#5C636D" />}
                            onClick={() => {
                              if (selected.length) {
                                setOpenAddCostPriceModal(true);
                              } else {
                                showToast("Select product to edit", "error");
                              }
                            }}
                          >
                            Change Cost price
                          </Button>
                        </div>
                      </DropDownWrapper>
                    </div>
                  </div>
                </div>
                <TableComponent
                  selectMultiple={true}
                  selected={selected}
                  isLoading={false}
                  selectBulk={selectBulk}
                  setSelectBulk={setSelectBulk}
                  setSelected={setSelected}
                  headCells={headCell.filter((item) =>
                    tableKeys.includes(item.key)
                  )}
                  showPagination={false}
                  tableData={filteredFormValues.map((item, i) => ({
                    collections: item.tags,
                    options: item.options,
                    images: (
                      <div className={`image_details`}>
                        <img
                          src={
                            item.images && item.images.length
                              ? `${IMAGEURL}${
                                  item.images[0]
                                    ? item.images[0]?.path
                                    : item.image
                                }`
                              : alt_image_url
                          }
                          alt="variation"
                          onClick={() => {
                            openImageModalFnc(i, item.images);
                          }}
                        />
                      </div>
                    ),
                    title: (
                      <InputField
                        value={item.title}
                        onChange={handleFeildsChange("title", i)}
                        type={"text"}
                        extraClass={"name"}
                      />
                    ),
                    details: (
                      <div className="display_description">
                        <p className="parsed_string"></p>
                        <Button
                          onClick={() => {
                            openDescriptionModalFnc(i, item.details);
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    ),
                    tags: (
                      <div
                        onClick={() => {
                          openCollectionModalFnc(i, item.tags);
                        }}
                        className="collection_box"
                      >
                        <p>
                          <>
                            {item.tags && item.tags.length
                              ? truncateString(
                                  item.tags
                                    .map((tag: any) => tag.tag)
                                    .join(", "),
                                  20
                                )
                              : ""}
                          </>
                        </p>
                        <ChevronDownIcon />
                      </div>
                    ),
                    status: (
                      <Select
                        value={item.status}
                        className="status"
                        onChange={(e) => {
                          handleChange("status", i, e.target.value);
                        }}
                      >
                        <MenuItem value={1}>Publish</MenuItem>
                        <MenuItem value={0}>Unpublish</MenuItem>
                      </Select>
                    ),
                    price: item?.variations?.length ? (
                      <div className="price novariant ">
                        <div className="contain">
                          <p>{getVariationPrice(item.variations)}</p>
                        </div>
                      </div>
                    ) : (
                      <InputField
                        value={item.price}
                        onChange={handleFeildsChange("price", i, true)}
                        type={"text"}
                        extraClass={"price"}
                        prefix={
                          <p className="text-[#000000] font-semibold text-[20px]">
                            {getCurrencyFnc()}
                          </p>
                        }
                      />
                    ),
                    cost: item?.variations?.length ? (
                      <div className="price novariant ">
                        <div className="contain">
                          <p>{getVariationCostPrice(item.variations)}</p>
                        </div>
                      </div>
                    ) : (
                      <InputField
                        value={item.cost}
                        onChange={handleFeildsChange("cost", i, true)}
                        type={"text"}
                        extraClass={"price"}
                        prefix={
                          <p className="text-[#000000] font-semibold text-[20px]">
                            {getCurrencyFnc()}
                          </p>
                        }
                      />
                    ),
                    weight_kg: item?.variations?.length ? (
                      <div className="price novariant ">
                        <div className="contain">
                          <p>{getVariationWeight(item.variations)} Kg</p>
                        </div>
                      </div>
                    ) : (
                      <InputField
                        value={item.weight_kg}
                        onChange={handleFeildsChange("weight_kg", i, true)}
                        type={"text"}
                        extraClass={"price"}
                      />
                    ),
                    sales: item?.variations?.length ? (
                      <div className="price novariant ">
                        <div className="contain">
                          <p>{getVariationDiscountPrice(item.variations)}</p>
                        </div>
                      </div>
                    ) : (
                      <InputField
                        value={item.sales}
                        onChange={handleFeildsChange("sales", i, true)}
                        type={"text"}
                        prefix={
                          <p className="text-[#000000] font-semibold text-[20px]">
                            {getCurrencyFnc()}
                          </p>
                        }
                        extraClass={"price"}
                      />
                    ),

                    preview: (
                      <IconButton
                        onClick={() => {
                          setPreviewProduct(item);
                          setOpenPreviewProduct(true);
                        }}
                        type="button"
                        className="icon_button_container"
                      >
                        <EyeIcon />
                      </IconButton>
                    ),

                    id: item.id,
                  }))}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="submit_form_section">
          <Button
            onClick={() => {
              dispatch(addToBulkProduct([]));
              navigate(-1);
            }}
            className="discard"
          >
            Discard
          </Button>

          <div className="button_container">
            <Button
              variant="contained"
              className="add"
              type="submit"
              onClick={() => {
                bulkSubmit();
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
      {/* modals */}
      {/* select image modal */}
      <BulkEditSelectImage
        openModal={openImageModal}
        handleChange={handleChange}
        defaultImages={pickedImage?.value}
        imageIndex={pickedImage?.index}
        closeModal={() => {
          setOpenImageModal(false);
        }}
      />
      {/* add description modal */}
      <AddDescription
        openModal={openDescriptionModal}
        handleChange={handleChange}
        description={description}
        closeModal={() => {
          setOpenDescriptionModal(false);
        }}
      />
      {/* change cost price modal */}
      <ChangeCostPriceModal
        openModal={openChangeCostPriceModal}
        title={costPriceAction}
        actionFnc={(type, number) => {
          costPriceBulkAction(type, number);
        }}
        closeModal={() => {
          setOpenChangeCostPriceModal(false);
        }}
      />
      <AddProductCostPriceModal
        openModal={openAddCostPriceModal}
        actionFnc={(number: any) => {
          addCostPriceBulkAction(number);
        }}
        closeModal={() => {
          setOpenAddCostPriceModal(false);
        }}
      />
      {/* change price modal */}
      <ChangePriceModal
        openModal={openChangePriceModal}
        title={priceAction}
        actionFnc={(type, number) => {
          priceBulkAction(type, number);
        }}
        closeModal={() => {
          setOpenChangePriceModal(false);
        }}
      />
      <AddProductPriceModal
        openModal={openAddPriceModal}
        actionFnc={(number: any) => {
          addPriceBulkAction(number);
        }}
        closeModal={() => {
          setOpenAddPriceModal(false);
        }}
      />
      <ChangeVariationPriceModal
        openModal={openChangeVariationPriceModal}
        title={variationPriceAction}
        actionFnc={(type, number) => {
          variationPriceBulkAction(type, number);
        }}
        closeModal={() => {
          setOpenChangeVariationPriceModal(false);
        }}
      />
      <ChangeDiscountPriceModal
        openModal={openChangeDiscountPriceModal}
        title={discountPriceAction}
        actionFnc={(type, number) => {
          discountPriceBulkAction(type, number);
        }}
        closeModal={() => {
          setOpenChangeDiscountPriceModal(false);
        }}
      />
      <AddProductDiscountPriceModal
        openModal={openAddDiscountPriceModal}
        actionFnc={(number: any) => {
          addDiscountPriceBulkAction(number);
        }}
        closeModal={() => {
          setOpenAddDiscountPriceModal(false);
        }}
      />
      {/* change weight modal */}
      <AddProductWeightModal
        openModal={openAddWeightModal}
        actionFnc={(number: any) => {
          addWeightBulkAction(number);
        }}
        closeModal={() => {
          setOpenAddWeightModal(false);
        }}
      />
      {/* change stock quantity modal */}
      <AddProductStockModal
        openModal={openAddStockModal}
        actionFnc={(number: any) => {
          addStockBulkAction(number);
        }}
        closeModal={() => {
          setOpenAddStockModal(false);
        }}
      />
      <ChangeProductStockModal
        openModal={openProductStockModal}
        title={productStockAction}
        actionFnc={(type, number) => {
          stockQuantityBulkAction(type, number);
        }}
        closeModal={() => {
          setOpenProductStockModal(false);
        }}
      />
      <ChangeVariationStockModal
        openModal={openVariationStockModal}
        title={variationStockAction}
        actionFnc={(type, number) => {
          variationStockQuantityBulkAction(type, number);
        }}
        closeModal={() => {
          setOpenVariationStockModal(false);
        }}
      />
      {/* add product to collection */}
      <AddProductToCollectionModal
        filterCollections={filterCollections}
        openModal={openAddProductToCollection}
        addProductToCollectionFnc={(collection) => {
          addProductToCollectionFnc(collection);
        }}
        closeModal={() => {
          setOpenAddProductToCollection(false);
        }}
      />
      {/* remove product from collection */}
      <RemoveProductFromCollectionModal
        openModal={openRemoveProductFromCollection}
        listOfTagsForRemoval={listOfTagsForRemoval}
        removeProductFromCollectionFnc={(collection) => {
          removeProductFromCollectionFnc(collection);
        }}
        closeModal={() => {
          setOpenRemoveProductFromCollection(false);
        }}
      />
      {/* add single product to collection  */}
      <SelectCollectionModal
        openModal={openCollectionModal}
        defaultCollections={collection?.collections}
        rowIndex={collection?.index}
        handleChange={handleChange}
        closeModal={() => {
          setOpenCollectionModal(false);
        }}
      />
      {/* create product option */}
      <CreateProductOptionModal
        openModal={openCreateProductOptionModal}
        addCreateProductOption={(options) => {
          addCreateProductOption(options);
        }}
        closeModal={() => {
          setOpenCreateProductOption(false);
        }}
      />
      <EditProductOptionModal
        openModal={openEditProductOptionModal}
        closeModal={() => {
          setOpenEditProductOptionModal(false);
        }}
        addCreateProductOption={(options) => {
          addCreateProductOption(options);
        }}
        productOptionsToBeEdited={productOptionsToBeEdited}
      />
      <ProductVariationEditorModal
        openModal={openProductVariationEditor}
        functionToAddEditedVariationValueToForm={
          functionToAddEditedVariationValueToForm
        }
        productsToBeEdited={productsVariationTobeEdited}
        variantEditorTitle={variantEditorTitle}
        variantEditorType={variantEditorType}
        variantEditorAction={variantEditorAction}
        closeModal={() => {
          setOpenProductVariationEditor(false);
        }}
      />
      <PreviewProductModal
        openModal={openPreviewProduct}
        closeModal={() => {
          setOpenPreviewProduct(false);
        }}
        previewProduct={previewProduct}
      />
      {openUpgradeModal && (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          pro={isProUpgrade}
          title={`Edit Multiple Products At Once on Pro or Growth`}
          subtitle={`Save time & edit multiple products with one click.`}
          proFeatures={[
            "Bulk edit products to save time with inventory management",
            "Export Product CSV",
            "Manage products across different locations",
            "1 location website",
          ]}
          growthFeatures={[
            "Bulk edit products to save time with inventory management",
            "Export Product CSV",
            "Manage products across different locations",
            "2 in-1 website to sell different products across locations.",
          ]}
          eventName="bulk-product-edit"
        />
      )}
    </>
  );
};

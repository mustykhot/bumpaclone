import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Chip, CircularProgress, IconButton } from "@mui/material";
import { PermissionsType } from "Models";
import { CopyIcon } from "assets/Icons/CopyIcon";
import { PrimaryFillIcon } from "assets/Icons/PrimaryFillIcon";
import { PrinterIcon } from "assets/Icons/PrinterIcon";
import { ScanIcon } from "assets/Icons/ScanIcon";
import { ShareIcon } from "assets/Icons/ShareIcon";
import { EditIcon } from "assets/Icons/EditIcon";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { EyeIcon } from "assets/Icons/EyeIcon";
import { EyeOffIcon } from "assets/Icons/EyeOffIcon";
import { DuplicateIcon } from "assets/Icons/DuplicateIcon";
import { InfoCircleXLIcon } from "assets/Icons/InfoCircleXLIcon";
import DropDownWrapper from "components/DropDownWrapper";
import ErrorMsg from "components/ErrorMsg";
import { GrowthModal } from "components/GrowthModal";
import { UpgradeModal } from "components/UpgradeModal";
import PageUpdateModal from "components/PageUpdateModal";
import MessageModal from "components/Modal/MessageModal";
import Loader from "components/Loader";
import { PrintBarcodeSingleModal } from "./modals/PrintBarcodeSingleModal";
import { LinkExistingSingleBarcodeModal } from "./modals/LinkExistingSingleBarcode";
import { LinkExistingMultipleBarcodeModal } from "./modals/LinkExistingMultipleBarcode ";
import ProductWithNoVariations from "./ProductWithoutVariation";
import ProductWithVariations from "./ProductWithVariations";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import {
  useDeleteProductMutation,
  useEditProductMutation,
  useGetLoggedInUserQuery,
  useGetSingleProductQuery,
  useSetAppFlagMutation,
} from "services";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
  selectPermissions,
  selectUserLocation,
} from "store/slice/AuthSlice";
import { showToast, showVideoModal, useAppSelector } from "store/store.hooks";
import { formatNumber, handleError } from "utils";
import { useCopyToClipboardHook } from "hooks/useCopyToClipboardHook";
import { IMAGEURL } from "utils/constants/general";
import "./style.scss";
const productPageUpdates: { title: string; description: string }[] = [
  {
    title: "New Product Details and History Page",
    description:
      "The new product details page now provides a comprehensive history and audit for your products and variations.",
  },
  {
    title: "Comprehensive Action History",
    description:
      "View the history and audit of your products and variations. See who performed an action, the action performed, and the time and date of the action.",
  },
  {
    title: "Detailed Action Logs",
    description:
      "The action log details include: Adjusted ( Product added or removed), Updated ( A product edited in an order) ,Reserved (This is an unpaid product that was previously held in stock) .You can also see products in an order that was cancelled, returned or sold",
  },
];
type ProductSummaryType = {
  number?: number;
  title: string;
  color: string;
};
export const ProductSummaryBox = ({
  number,
  title,
  color,
}: ProductSummaryType) => {
  return (
    <div className={`product_summary_box ${color}`}>
      <h4>{formatNumber(number || 0)}</h4>
      <p>{title}</p>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userLocation = useAppSelector(selectUserLocation);
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetSingleProductQuery({
      id,
      location_id: userLocation?.id,
    });
  const [deleteProduct, { isLoading: loadDelete }] = useDeleteProductMutation();

  const [editProduct, { isLoading: editLoad }] = useEditProductMutation();
  const userPermission: PermissionsType = useAppSelector(selectPermissions);
  const [isStaff, setIsStaff] = useState(false);
  const canManageProducts = isStaff ? userPermission?.products?.manage : true;
  const searchParams = new URLSearchParams(location.search);
  const isAnalytics = searchParams.get("isAnalytics");
  const [openLinkModal, setOpenLinkModal] = useState(false);
  const [openLinkMultipleModal, setOpenLinkMultipleModal] = useState(false);
  const [openBarcode, setOpenBarcode] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openChangeStatus, setOpenChangeStatus] = useState(false);
  const [openDuplicate, setOpenDuplicate] = useState(false);
  const { isCopied, handleCopyClick } = useCopyToClipboardHook(
    data ? `${data.product?.url}?location=${userLocation?.id}` : ""
  );
  const [openGrowthModal, setOpenGrowthModal] = useState(false);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const [isBarcodeUpgrade, setIsBarcodeUpgrade] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const { data: userData } = useGetLoggedInUserQuery();
  const [setAppFlag, { isLoading: loadFlag }] = useSetAppFlagMutation();
  const queryParams = new URLSearchParams(location.search);
  const cumulativeRowIndex = Number(queryParams.get("count"));

  const handleDuplicateProduct = () => {
    navigate(`/dashboard/products/duplicate/${id}`);
  };

  const handleCopy = () => {
    handleCopyClick();
  };

  const handleDelete = () => {
    setOpenDeleteModal(true);
  };

  const deleteProductFnc = async () => {
    if (id) {
      try {
        let result = await deleteProduct(id);
        if ("data" in result) {
          showToast("Deleted Successfuly", "success");
          navigate(-1);
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };
  const updateAppFlag = async () => {
    let payload = {
      ...userData?.app_flags,
      webapp_updates: {
        ...userData?.app_flags?.webapp_updates,
        product_details_page: {
          version: 1,
          status: true,
        },
      },
    };
    try {
      let result = await setAppFlag(payload);
      if ("data" in result) {
        setOpenUpdateModal(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
    setOpenUpdateModal(false);
  };

  const updateProductFnc = async (status: number) => {
    const payload =
      status === 0
        ? {
            status: 1,
            price: data?.product?.price,
            title: data?.product?.name,
          }
        : {
            status: 0,
            price: data?.product?.price,
            title: data?.product?.name,
          };
    try {
      let result = await editProduct({ body: payload, id });
      if ("data" in result) {
        showToast("Updated successfully", "success");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (userData) {
      if (
        userData?.app_flags?.webapp_updates?.product_details_page?.version === 1
      ) {
        if (userData?.app_flags?.webapp_updates?.product_details_page?.status) {
          setOpenUpdateModal(false);
        } else {
          setOpenUpdateModal(true);
        }
      } else {
        setOpenUpdateModal(true);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (userPermission !== undefined) {
      setIsStaff(true);
    } else {
      setIsStaff(false);
    }
  }, [userPermission]);

  if (isError) {
    return (
      <ErrorMsg
        error={
          // @ts-ignore
          error?.status === 404
            ? "Product does not exist"
            : // @ts-ignore
            error?.status === "FETCH_ERROR"
            ? "Kindly check your internet connection"
            : "Something went wrong"
        }
      />
    );
  }
  return (
    <>
      {(isLoading || isFetching) && <Loader />}
      {data && (
        <>
          <div className="pd_product_details">
            {data && (
              <ModalHeader
                text={
                  <div className="product_name_flex">
                    <p>{data?.product?.name}</p>
                    <Chip
                      label={
                        data?.product?.status === 0
                          ? "Unpublished"
                          : "Published"
                      }
                      color={data?.product?.status === 0 ? "default" : "info"}
                    />
                  </div>
                }
                closeModal={() => {
                  if (isAnalytics) {
                    navigate(-1);
                  } else {
                    navigate("/dashboard/products");
                  }
                }}
                button={
                  <div className="action_buttons">
                    {canManageProducts && (
                      <>
                        <DropDownWrapper
                          origin={screenWidth <= 600 ? "left" : "right"}
                          className="navbar_dropdown"
                          action={
                            <Button
                              startIcon={<CopyIcon stroke="#5C636D" />}
                              className="grey_btn"
                              endIcon={<PrimaryFillIcon />}
                            >
                              Barcode
                            </Button>
                          }
                        >
                          <div className="cover_buttons">
                            <ul className="select_list btn_list">
                              <li className="scan_btns">
                                <Button
                                  onClick={() => {
                                    if (isSubscriptionType === "growth") {
                                      setOpenBarcode(true);
                                    } else {
                                      setIsBarcodeUpgrade(true);
                                      setOpenGrowthModal(true);
                                    }
                                  }}
                                  startIcon={
                                    <span className="span">
                                      <PrinterIcon stroke="#5C636D" />
                                    </span>
                                  }
                                >
                                  Print Barcode
                                </Button>
                              </li>
                              <li className="scan_btns">
                                <Button
                                  onClick={() => {
                                    if (isSubscriptionType === "growth") {
                                      if (data?.product?.variations?.length) {
                                        setOpenLinkMultipleModal(true);
                                      } else {
                                        setOpenLinkModal(true);
                                      }
                                    } else {
                                      setIsBarcodeUpgrade(true);
                                      setOpenGrowthModal(true);
                                    }
                                  }}
                                  startIcon={
                                    <span className="span">
                                      <ScanIcon />{" "}
                                    </span>
                                  }
                                >
                                  Link Existing Barcode{" "}
                                </Button>
                              </li>
                            </ul>
                          </div>
                        </DropDownWrapper>

                        <Button
                          startIcon={<EditIcon stroke="#009444" />}
                          variant="outlined"
                          className="edit_btn"
                          onClick={() => {
                            navigate(
                              `/dashboard/products/edit/${id}?count=${cumulativeRowIndex}`
                            );
                          }}
                        >
                          Edit Product
                        </Button>

                        <IconButton
                          onClick={handleDelete}
                          type="button"
                          className="icon_button_container"
                        >
                          <TrashIcon />
                        </IconButton>
                      </>
                    )}

                    <DropDownWrapper
                      origin={screenWidth <= 600 ? "left" : "right"}
                      className="navbar_dropdown"
                      action={
                        <Button
                          startIcon={<CopyIcon stroke="#5C636D" />}
                          className="grey_btn"
                          endIcon={<PrimaryFillIcon />}
                        >
                          More Menu
                        </Button>
                      }
                    >
                      <div className="cover_buttons">
                        <ul className="select_list btn_list">
                          <li className="scan_btns">
                            <Button
                              onClick={handleCopy}
                              startIcon={<ShareIcon />}
                            >
                              {isCopied ? "Link Copied" : "Share Link"}
                            </Button>
                          </li>
                          {canManageProducts && (
                            <>
                              <li className="scan_btns">
                                <Button
                                  startIcon={<DuplicateIcon />}
                                  onClick={handleDuplicateProduct}
                                >
                                  Duplicate
                                </Button>
                              </li>
                              <li className="scan_btns">
                                <Button
                                  onClick={() => {
                                    setOpenChangeStatus(true);
                                  }}
                                  startIcon={
                                    data?.product?.status === 0 ? (
                                      <EyeIcon />
                                    ) : (
                                      <EyeOffIcon />
                                    )
                                  }
                                >
                                  {data?.product?.status === 0
                                    ? "Publish"
                                    : "Unpublish"}
                                </Button>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </DropDownWrapper>
                  </div>
                }
              />
            )}

            {data ? (
              data?.product?.variations?.length ? (
                <ProductWithVariations
                  isLoading={isLoading || isFetching}
                  product={data?.product}
                  canManageProducts={canManageProducts}
                  isSubscriptionType={isSubscriptionType}
                  cumulativeRowIndex={cumulativeRowIndex}
                  refetch={refetch}
                />
              ) : (
                <ProductWithNoVariations
                  isLoading={isLoading}
                  refetch={refetch}
                  product={data?.product}
                  isSubscriptionType={isSubscriptionType}
                  cumulativeRowIndex={cumulativeRowIndex}
                  canManageProducts={canManageProducts}
                />
              )
            ) : (
              ""
            )}
          </div>
          <PrintBarcodeSingleModal
            openModal={openBarcode}
            closeModal={() => {
              setOpenBarcode(false);
            }}
            product={data ? data?.product : ""}
          />
          <LinkExistingSingleBarcodeModal
            openModal={openLinkModal}
            closeModal={() => {
              setOpenLinkModal(false);
            }}
          />
          {/* Link barcode modal */}
          <LinkExistingMultipleBarcodeModal
            openModal={openLinkMultipleModal}
            closeModal={() => {
              setOpenLinkMultipleModal(false);
            }}
            variants={data?.product?.variations.map((item: any) => {
              return {
                ...item,
                image: item?.image
                  ? `${IMAGEURL}${item?.image}`
                  : `${data?.product?.alt_image_url}`,
              };
            })}
          />
          {/* delete modal */}
          <MessageModal
            openModal={openDeleteModal}
            closeModal={() => {
              setOpenDeleteModal(false);
            }}
            icon={<TrashIcon />}
            btnChild={
              <Button
                onClick={() => {
                  deleteProductFnc();
                }}
                disabled={loadDelete}
                className="error"
              >
                {loadDelete ? (
                  <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
                ) : (
                  "Yes, delete"
                )}
              </Button>
            }
            description="Are you sure you want to delete this product? This action is irreversible"
          />

          {/* unpublish/publish modal */}
          <MessageModal
            openModal={openChangeStatus}
            closeModal={() => {
              setOpenChangeStatus(false);
            }}
            icon={<InfoCircleXLIcon stroke="#5C636D" />}
            btnChild={
              <Button
                onClick={() => {
                  updateProductFnc(data?.product?.status);
                }}
                className="primary_btn"
                disabled={editLoad}
              >
                {editLoad ? (
                  <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
                ) : (
                  "Yes, Change Status"
                )}
              </Button>
            }
            title="Confirm to Change Status"
            description={`Are you sure you want to change the status of this product to ${
              data?.product?.status === 0 ? "published" : "unpublished"
            }?`}
          />
          {/* duplicate modal */}
          <MessageModal
            openModal={openDuplicate}
            closeModal={() => {
              setOpenDuplicate(false);
            }}
            title={"Confirm to Duplicate"}
            icon={<InfoCircleXLIcon stroke="#5C636D" />}
            btnChild={
              <Button
                onClick={() => {
                  navigate(`/dashboard/products/duplicate/${id}`);
                }}
                className="primary_btn"
                disabled={editLoad}
              >
                Yes, Duplicate
              </Button>
            }
            description={`Are you sure you want to duplicate
      ${data?.product?.name} ${
              data?.product?.variations?.length ? "and it’s variations" : ""
            } ?`}
          />

          {openGrowthModal && isBarcodeUpgrade && (
            <GrowthModal
              openModal={openGrowthModal}
              closeModal={() => {
                setIsBarcodeUpgrade(false);
                setOpenGrowthModal(false);
              }}
              title={`Generate barcodes easily on the Growth Plan`}
              subtitle={`Get better inventory tracking when you use Bumpa’s barcode generator.`}
              growthFeatures={[
                "Generate barcodes for better inventory tracking",
                "Upload business logo on website",
                "Create unique barcodes for your products & sell faster.",
              ]}
              buttonText={`Upgrade to Growth`}
              eventName="activate-barcode"
            />
          )}
          <PageUpdateModal
            updates={productPageUpdates}
            openModal={openUpdateModal}
            isLoading={loadFlag}
            size={"large"}
            btnAction={() => {
              window.open(
                "https://support.getbumpa.com/support/solutions/articles/150000187016-product-history-optimisation",
                "_blank"
              );
            }}
            closeModal={() => {
              updateAppFlag();
            }}
          />
        </>
      )}
    </>
  );
};

export default ProductDetails;

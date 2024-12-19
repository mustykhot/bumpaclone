import { ReactNode, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { Button, CircularProgress, Skeleton } from "@mui/material";
import { AnchorIcon } from "assets/Icons/AnchorIcon";
import { EditIcon } from "assets/Icons/EditIcon";
import { EyeIcon } from "assets/Icons/EyeIcon";
import { LargeDeleteIcon } from "assets/Icons/LargeDeleteIcon";
import { ArrowRightIcon } from "assets/Icons/ArrowRightIcon";
import { TagIcon } from "assets/Icons/TagIcon";
import { PackageIcon } from "assets/Icons/PackageIcon";
import { UserIcon } from "assets/Icons/Sidebar/UserIcon";
import { EyeOffIcon } from "assets/Icons/EyeOffIcon";
import { ShareIcon } from "assets/Icons/ShareIcon";
import { CheckCircleLargeIcon } from "assets/Icons/CheckCircleLarge";
import { LargeCopyIcon } from "assets/Icons/LargeCopyIcon";
import { CopyIcon } from "assets/Icons/CopyIcon";
import { WhiteBuildingIcon } from "assets/Icons/WhiteBuildingIcon";
import { LargeAnchorIcon } from "assets/Icons/LargeAnchorIcon";
import { LargeDeactivateIcon } from "assets/Icons/LargeDeactivateIcon";
import { SummaryCard } from "components/SummaryCard";
import ErrorMsg from "components/ErrorMsg";
import Loader from "components/Loader";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { EditLocationModal } from "../EditLocation/EditLocation";
import DeleteLocationModal from "../DeleteLocation";
import ConfirmDeleteModal from "../DeleteLocation/ConfirmDeleteModal";
import { SelectLocationProductModal } from "../SelectLocationProductModal";
import { SelectInventoryModal } from "../SelectInventoryModal";
import {
  useDeactivateLocationMutation,
  useDeleteLocationMutation,
  useGetLocationActivitiesQuery,
  useGetLocationsQuery,
  useGetSingleLocationQuery,
  useGetSingleLocationStatsQuery,
  useGetStaffAccountsQuery,
  useMoveInventoryMutation,
  useSetdefaultLocationMutation,
} from "services";
import { showToast, useAppSelector } from "store/store.hooks";
import { formatNumber, formatPrice, getCurrencyFnc, handleError } from "utils";
import {
  convertLocationAddress,
  getObjWithValidValues,
} from "utils/constants/general";
import { selectCurrentStore, selectCurrentUser } from "store/slice/AuthSlice";
import { useCopyToClipboardHook } from "hooks/useCopyToClipboardHook";
import "./style.scss";

const SingleAction = ({
  icon,
  count,
  title,
  link,
}: {
  icon: ReactNode;
  count: number | string;
  title: string;
  link: string;
}) => {
  const navigate = useNavigate();
  return (
    <div
      className="pd_single_location"
      onClick={() => {
        if (link) {
          navigate(link);
        }
      }}
    >
      <div className="icon_box">{icon}</div>
      <div className="text_side">
        <div className="left">
          <p className="count">{count}</p>
          <p className="title">{title}</p>
        </div>
        <ArrowRightIcon className="arrow" stroke="#ffffff" />
      </div>
    </div>
  );
};

const LocationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useAppSelector(selectCurrentUser);
  const [productList, setProductList] = useState<any[]>([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openNotifyModal, setOpenNotifyModal] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [openMoveModal, setOpenMoveModal] = useState(false);
  const [openSelectInventoryModal, setOpenSelectInventoryModal] =
    useState(false);
  const [productsToMove, setProductsToMove] = useState<any[]>([]);
  const [destinationLocation, setDestinationLocation] = useState("");
  const [openConfirmMoveModal, setOpenConfirmMoveModal] = useState(false);
  const [openDeactivateModal, setOpenDeactivateModal] = useState(false);
  const [moveAction, setMoveAction] = useState("move");
  const [isDuplicateAll, setIsDuplicateAll] = useState(false);
  const { data, isLoading, isError } = useGetSingleLocationQuery(id);
  const { data: staffData } = useGetStaffAccountsQuery({ search: "" });
  const userStore = useAppSelector(selectCurrentStore);

  const { isCopied, handleCopyClick } = useCopyToClipboardHook(
    userStore ? `${userStore?.url_link}?location=${id}` : ""
  );
  const {
    data: dataStat,
    isLoading: isLoadingStat,
    isError: isErrorStat,
  } = useGetSingleLocationStatsQuery(id);

  const {
    data: dataActivities,
    isLoading: isLoadingActivities,
    isFetching: fetchingActivities,
    isError: isErrorActivities,
  } = useGetLocationActivitiesQuery(id);
  const [finalInventoryToMove, setFinalInventoryToMove] = useState<any[]>([]);
  const { data: locations } = useGetLocationsQuery();
  const getCauser = (id: number) => {
    if (`${user?.id}` === `${id}`) {
      return `${user?.name}`;
    } else {
      let filtered = staffData?.staff?.filter(
        (item) => `${item.id}` === `${id}`
      );
      return `${filtered && filtered?.length ? filtered[0]?.name : ""}`;
    }
  };
  const [deleteLocation, { isLoading: deleteLoading }] =
    useDeleteLocationMutation();
  const [deactivateLocation, { isLoading: deactivateLoading }] =
    useDeactivateLocationMutation();
  const [defaultLocation, { isLoading: defaultLocationLoading }] =
    useSetdefaultLocationMutation();
  const [moveInventory, { isLoading: moveinventoryLoading }] =
    useMoveInventoryMutation();
  const deleteFnc = async () => {
    try {
      let result = await deleteLocation(id);
      if ("data" in result) {
        showToast("Deleted successfully", "success");
        navigate(-1);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const setAsDefaultFnc = async () => {
    try {
      let result = await defaultLocation(id);
      if ("data" in result) {
        showToast("successfully set", "success");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const deactivateFnc = async () => {
    try {
      let result = await deactivateLocation(id);
      if ("data" in result) {
        showToast(
          `${
            data?.data?.is_active === 0 ? "Activated" : "Deactivated"
          } successfully`,
          "success"
        );
        setOpenDeactivateModal(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const moveInventoryFnc = async () => {
    const productList = finalInventoryToMove?.length
      ? finalInventoryToMove
          .map((item) => {
            if (moveAction === "duplicate") {
              return getObjWithValidValues({
                product_id: item.itemId ? item.itemId : item.id,
                product_variation_id: item.variant ? item.variant : null,
                quantity: item.quantityToMove,
              });
            } else {
              if (Number(item.quantityToMove) !== 0) {
                return getObjWithValidValues({
                  product_id: item.itemId ? item.itemId : item.id,
                  product_variation_id: item.variant ? item.variant : null,
                  quantity: item.quantityToMove,
                });
              }
            }
          })
          .filter(Boolean)
      : [];

    if (isDuplicateAll || productList.length) {
      const payload = {
        source_location_id: id,
        destination_location_id: destinationLocation,
        duplicate: moveAction === "duplicate" ? true : false,
        products: productList,
        all: isDuplicateAll,
      };
      try {
        let result = await moveInventory(payload);
        if ("data" in result) {
          showToast("Inventory transfer initiated", "success");
          setDestinationLocation("");
          setFinalInventoryToMove([]);
          setProductsToMove([]);
          setProductList([]);
          setOpenConfirmMoveModal(false);
          setOpenSelectInventoryModal(false);
          setOpenMoveModal(false);
          setOpenNotifyModal(true);
          setIsDuplicateAll(false);
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    } else {
      showToast("You can not move products that are out of stock", "warning");
    }
  };
  if (isError) {
    return <ErrorMsg error={"Something went wrong"} />;
  }
  if (isLoading || isLoadingStat) {
    return <Loader />;
  }
  return (
    <>
      {data && (
        <div className="pd_location_details">
          <ModalHeader
            text="Location Details"
            closeModal={() => {
              navigate(-1);
            }}
            button={
              <div className="action_buttons">
                <Button
                  onClick={() => {
                    handleCopyClick();
                  }}
                  startIcon={<ShareIcon />}
                  className="grey_btn"
                >
                  {isCopied ? "Link Copied" : "Share Store Link"}
                </Button>
                {Number(data?.data?.is_default) !== 1 && (
                  <Button
                    onClick={() => {
                      setAsDefaultFnc();
                    }}
                    className="grey_btn"
                  >
                    {defaultLocationLoading ? (
                      <CircularProgress
                        size="1.5rem"
                        sx={{ color: "#000000" }}
                      />
                    ) : (
                      "Set as default"
                    )}
                  </Button>
                )}

                <Button
                  onClick={() => {
                    setMoveAction("duplicate");
                    setOpenMoveModal(true);
                  }}
                  startIcon={<CopyIcon stroke="#5C636D" />}
                  className="grey_btn"
                >
                  Duplicate Inventory
                </Button>

                <Button
                  onClick={() => {
                    setMoveAction("move");
                    setOpenMoveModal(true);
                  }}
                  startIcon={<AnchorIcon />}
                  className="grey_btn"
                >
                  Move Inventory
                </Button>
                <Button
                  onClick={() => {
                    if (data?.data?.is_active === 0) {
                      deactivateFnc();
                    } else {
                      setOpenDeactivateModal(true);
                    }
                  }}
                  startIcon={
                    deactivateLoading ? (
                      <CircularProgress
                        size="1.5rem"
                        sx={{ color: "#000000" }}
                      />
                    ) : data?.data?.is_active === 0 ? (
                      <EyeIcon />
                    ) : (
                      <EyeOffIcon />
                    )
                  }
                  className="grey_btn"
                >
                  {data?.data?.is_active === 0 ? "Enable" : "Disable"}
                </Button>
                <Button
                  startIcon={<EditIcon stroke="#009444" />}
                  variant="outlined"
                  className="edit"
                  onClick={() => {
                    setOpenEditModal(true);
                  }}
                >
                  Edit
                </Button>
              </div>
            }
          />
          <div className="about_location_details section">
            <div className="about_location">
              <div className="icon_box">
                <WhiteBuildingIcon />
              </div>
              <div className="text_box">
                <div className="title">
                  <h3>{data.data.name}</h3>
                  {data.data.is_default === 1 && (
                    <p className="primary_text">Primary Address</p>
                  )}
                </div>
                <p className="address">{convertLocationAddress(data?.data)}</p>
              </div>
            </div>
            <div className="summary_flex_box">
              <SummaryCard
                count={formatPrice(dataStat?.data?.total_sales || 0)}
                title={"Total Sales"}
                icon={
                  <p className="text-[#5C636D] font-semibold text-[20px]">
                    {getCurrencyFnc()}
                  </p>
                }
                color={"default"}
              />
              <SummaryCard
                count={formatPrice(dataStat?.data?.total_inventory_value || 0)}
                title={"Store Inventory Value"}
                icon={
                  <p className="text-[#0059DE] font-semibold text-[20px]">
                    {getCurrencyFnc()}
                  </p>
                }
                color={"blue"}
              />
            </div>
          </div>
          <div className="location_actions">
            <SingleAction
              count={formatNumber(dataStat?.data?.total_products || 0)}
              title="Total Products"
              link={`/dashboard/products?location_id=${id}`}
              icon={<TagIcon stroke="#009444" />}
            />
            <SingleAction
              count={formatNumber(dataStat?.data?.total_orders || 0)}
              title="Total Orders"
              link={`/dashboard/orders?location_id=${id}`}
              icon={<PackageIcon stroke="#009444" />}
            />{" "}
            <SingleAction
              count={formatNumber(dataStat?.data?.total_customers || 0)}
              title="Total Customers"
              link={``}
              icon={<UserIcon isActive stroke="#009444" />}
            />
          </div>
          <div className="activities_section section">
            <div className="title">
              <p>Activities</p>
            </div>

            <div className="list_side">
              {isErrorActivities && <ErrorMsg message="Something went wrong" />}
              {(isLoadingActivities || fetchingActivities) && (
                <div className="px-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Skeleton
                      key={item}
                      animation="wave"
                      width="100%"
                      height={30}
                    />
                  ))}
                </div>
              )}
              {!isErrorActivities && !isLoading && !fetchingActivities
                ? dataActivities?.data?.data?.length
                  ? dataActivities?.data?.data?.map((item: any, i: number) => {
                      const parts = item.subject_type.split("\\");
                      const orderValue = parts[parts.length - 1];
                      return (
                        <div key={i} className="single_activity">
                          <p className="name">
                            {orderValue}{" "}
                            {item.event ? ` was ${item.event}` : ""}
                            {item.name ? ` by ${item.name}` : ""}
                          </p>
                          <p className="date">
                            {moment(item.created_at).format("ll")}
                          </p>
                        </div>
                      );
                    })
                  : ""
                : ""}
            </div>
          </div>
        </div>
      )}

      <EditLocationModal
        openModal={openEditModal}
        closeModal={() => {
          setOpenEditModal(false);
        }}
        locationToBeEdited={data?.data}
      />
      <DeleteLocationModal
        openModal={openDeleteModal}
        closeModal={() => {
          setOpenDeleteModal(false);
        }}
        locationTobeDeleted={null}
        btnAction={() => {}}
      />
      <ConfirmDeleteModal
        openModal={openConfirmDeleteModal}
        closeModal={() => {
          setOpenConfirmDeleteModal(false);
        }}
        icon={<LargeDeleteIcon />}
        isLoading={false}
        btnAction={() => {}}
        description_text="You’re about to delete your store located at"
        second_description_text={""}
        title="Confirm deletion"
      />
      <SelectLocationProductModal
        openModal={openMoveModal}
        productList={productList}
        setProductList={setProductList}
        moveAction={moveAction}
        dispatchFunc={(val: any) => {
          setIsDuplicateAll(false);
          setProductsToMove(val);
          setOpenSelectInventoryModal(true);
        }}
        duplicateAllFnc={() => {
          setIsDuplicateAll(true);
          setOpenSelectInventoryModal(true);
        }}
        setProductsToMove={setProductsToMove}
        closeModal={() => {
          setIsDuplicateAll(false);
          setOpenMoveModal(false);
        }}
      />
      <SelectInventoryModal
        openModal={openSelectInventoryModal}
        productsToMove={productsToMove}
        moveAction={moveAction}
        destinationLocation={destinationLocation}
        setDestinationLocation={setDestinationLocation}
        isDuplicateAll={isDuplicateAll}
        closeModal={() => {
          setOpenSelectInventoryModal(false);
          setIsDuplicateAll(false);
        }}
        duplicateAllFnc={() => {
          setOpenConfirmMoveModal(true);
        }}
        btnAction={(list: any[]) => {
          setOpenConfirmMoveModal(true);
          setFinalInventoryToMove(list);
        }}
      />
      <ConfirmDeleteModal
        openModal={openConfirmMoveModal}
        closeModal={() => {
          setOpenConfirmMoveModal(false);
        }}
        icon={
          moveAction === "duplicate" ? <LargeCopyIcon /> : <LargeAnchorIcon />
        }
        btnAction={() => {
          moveInventoryFnc();
        }}
        description_text={`You’re about to ${
          moveAction === "duplicate" ? "duplicate" : "move"
        } ${isDuplicateAll ? "all" : "selected"} products`}
        second_description_text={`to ${
          locations?.data?.filter(
            (item) => Number(item.id) === Number(destinationLocation)
          )[0]?.name
        }`}
        title={`Confirm ${
          moveAction === "duplicate" ? "duplication" : "movement"
        }`}
        isLoading={moveinventoryLoading}
        isError={false}
        btnText={`Yes, ${
          moveAction === "duplicate" ? "duplicate" : "move"
        } products`}
      />
      <ConfirmDeleteModal
        openModal={openNotifyModal}
        closeModal={() => {
          setOpenNotifyModal(false);
        }}
        icon={<CheckCircleLargeIcon />}
        btnAction={() => {
          setOpenNotifyModal(false);
        }}
        second_description_text={""}
        description_text="Inventory transfer initiated, we will notify you once this is completed"
        title="Processing ..."
        isError={false}
        btnText="Continue"
        displayCancel={false}
      />
      <ConfirmDeleteModal
        openModal={openDeactivateModal}
        closeModal={() => {
          setOpenDeactivateModal(false);
        }}
        icon={<LargeDeactivateIcon />}
        isLoading={deactivateLoading}
        btnAction={() => {
          deactivateFnc();
        }}
        description_text="Are you sure you want to disable your store."
        title="Disable store"
        btnText="Yes, disable store"
      />
    </>
  );
};

export default LocationDetails;

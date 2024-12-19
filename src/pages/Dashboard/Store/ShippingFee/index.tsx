import { useEffect, useState } from "react";
import EmptyResponse from "components/EmptyResponse";
import Button from "@mui/material/Button";
import { PlusIcon } from "assets/Icons/PlusIcon";
import Shipping from "assets/images/StaffAccount.png";
import "./style.scss";
// import CreateShipping from "./CreateShipping";
import { Link, useNavigate } from "react-router-dom";
import ViewShippingDetails from "./ListOfShippings/ViewShippingDetails";
import EditShipping from "./ListOfShippings/EditShipping";
import { CircularProgress, IconButton } from "@mui/material";
import { TrashIcon } from "assets/Icons/TrashIcon";
// import { SearchIcon } from "assets/Icons/SearchIcon";
// import InputField from "components/forms/InputField";
import TableComponent from "components/table";
import {
  useDeleteShippingMutation,
  useEditCollectionMutation,
  useEditShippingMutation,
  useGetLoggedInUserQuery,
  useGetShippingQuery,
  useSetAppFlagMutation,
} from "services";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import { ShippingType } from "services/api.types";
// import ErrorMsg from "components/ErrorMsg";
import moment from "moment";
import { EyeIcon } from "assets/Icons/EyeIcon";
import Loader from "components/Loader";
import { selectUserLocation } from "store/slice/AuthSlice";
import MessageModal from "components/Modal/MessageModal";
import { CopyIcon } from "assets/Icons/CopyIcon";
import { DuplicateShippingModal } from "./ListOfShippings/DuplicateShippingModal";
import { Toggle } from "components/Toggle";
import { EditIcon } from "assets/Icons/EditIcon";
import ViewFreeShippingDetails from "./ListOfShippings/ViewFreeShippingDetails";
import EditFreeShipping from "./ListOfShippings/EditFreeShipping";
import { InfoIcon } from "assets/Icons/InfoIcon";
import PageUpdateModal from "components/PageUpdateModal";
import { ShippingIcon } from "assets/Icons/ShippingIcon";
import { ShipBubbleConnectedModal } from "./shipbubbleConnectedModal";
const headCell = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "title",
    name: "Shipping Title",
  },
  {
    key: "description",
    name: "Shipping Description",
  },
  {
    key: "fee",
    name: "Shipping Fee",
  },
  {
    key: "action",
    name: "",
  },
];
const filterList = ["All"];
const ShippingFee = () => {
  const navigate = useNavigate();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editShipping, { isLoading: loadEdit }] = useEditShippingMutation();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFreeEditModal, setShowFreeEditModal] = useState(false);
  const [showFreeDetailsModal, setShowFreeDetailsModal] = useState(false);
  const [freeShipping, setFreeShipping] = useState<ShippingType | null>(null);
  const [selected, setSelected] = useState<string[] | number[]>([]);
  const [search] = useState("");
  const [filter, setFilter] = useState("All");
  const userLocation = useAppSelector(selectUserLocation);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const { data: userData } = useGetLoggedInUserQuery();
  const [setAppFlag, { isLoading: loadFlag }] = useSetAppFlagMutation();
  const { data, isLoading, isFetching, isError } = useGetShippingQuery({
    location_id: userLocation?.id ? userLocation?.id : null,
  });
  const [idTobeDeleted, setIdTobeDeleted] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
  const [openDeactivateModal, setOpenDeactivateModal] = useState(false);
  const [openShipbubbleModal, setOpenShipbubbleModal] = useState(false);
  const [shippingToView, setShippingToView] = useState<ShippingType | null>(
    null
  );
  const [deleteShipping, { isLoading: loadDelete }] =
    useDeleteShippingMutation();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const deleteInBulk = async () => {
    try {
      setIsDeleteLoading(true);
      const productRequests = selected?.map((id) => {
        return deleteShippingFnc(`${id}`);
      });

      const responses = await Promise.all(productRequests);
      if (responses?.length) {
        setSelected([]);
        showToast("Locations successfully deleted", "success");
        setOpenDeleteModal(false);
      }
    } catch (error) {
      showToast(
        "Failed to delete one or more location(s). Please try again.",
        "error"
      );
    } finally {
      setIsDeleteLoading(false);
    }
  };
  const deleteShippingFnc = async (id: string, callback?: () => void) => {
    try {
      let result = await deleteShipping(id);
      if ("data" in result) {
        setShowFreeDetailsModal(false);
        setShowDetailsModal(false);
        callback && callback();
      } else {
        handleError(result);
        callback && callback();
      }
    } catch (error) {
      handleError(error);
      callback && callback();
    }
  };
  const updateAppFlag = async () => {
    let payload = {
      ...userData?.app_flags,
      webapp_updates: {
        ...userData?.app_flags?.webapp_updates,
        shipping_page: {
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

  const handleDeactivateOrActivateFreeShipping = async () => {
    let payload = {
      ...freeShipping,
      status: freeShipping?.status === 1 ? false : true,
      free: true,
      visible: true,
    };
    try {
      let result = await editShipping({
        body: payload,
        id: `${freeShipping?.id}`,
      });
      if ("data" in result) {
        showToast("Edited successfully", "success");
        setOpenDeactivateModal(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleToggleFreeshipping = (checked?: boolean) => {
    setOpenDeactivateModal(true);
  };

  const bulkDelete = () => {
    deleteInBulk();
  };

  useEffect(() => {
    if (data && data?.shippingTypes?.length) {
      let filtered = data?.shippingTypes?.filter((item) => item?.is_free === 1);
      if (filtered?.length) {
        setFreeShipping(filtered[0]);
      } else {
        setFreeShipping(null);
      }
    }
  }, [data]);

  useEffect(() => {
    if (userData) {
      if (userData?.app_flags?.webapp_updates?.shipping_page?.version >= 1) {
        if (userData?.app_flags?.webapp_updates?.shipping_page?.status) {
          setOpenUpdateModal(false);
        } else {
          setOpenUpdateModal(true);
        }
      } else {
        setOpenUpdateModal(true);
      }
    }
  }, [userData]);

  return (
    <>
      {isLoading && <Loader />}
      <div
        className={`pd_shipping ${
          data && data?.shippingTypes?.length === 0 && !search ? "empty" : ""
        }`}
      >
        {data && data?.shippingTypes?.length === 0 && !search ? (
          <EmptyResponse
            message="Create Shipping Fees"
            image={Shipping}
            extraText="You can create your shipping methods here."
            btn={
              <div className="empty_btn_box">
                <Button
                  onClick={() => {
                    navigate("create");
                  }}
                  variant="contained"
                  className="primary_styled_button"
                  startIcon={<PlusIcon />}
                >
                  Create shipping methods
                </Button>
              </div>
            }
          />
        ) : (
          <div className="">
            <div className="container__title-section">
              <h3 className="name_of_section">Shipping Method</h3>

              <div className="btn_flex">
                <Button
                  startIcon={<ShippingIcon />}
                  className="settings_btn"
                  onClick={() => {
                    navigate("/dashboard/store/general-settings?tab=Shipping");
                  }}
                >
                  Settings
                </Button>
                {freeShipping ? (
                  <div
                    onClick={() => {
                      setShowFreeDetailsModal(true);
                    }}
                    className="display_free_shipping_box"
                  >
                    <p className="free_shipping_name">
                      Free Shipping
                      {freeShipping?.status === 1 && (
                        <span className="active_free_shipping"> (Active)</span>
                      )}
                    </p>
                    <div className="action_buttons">
                      <IconButton
                        onClick={(e) => {
                          setShowFreeEditModal(true);
                          e.stopPropagation();
                        }}
                        className="edit_btn"
                      >
                        <EditIcon stroke="#009444" />
                      </IconButton>

                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Toggle
                          toggled={freeShipping?.status === 1 ? true : false}
                          handlelick={handleToggleFreeshipping}
                        />{" "}
                      </IconButton>
                    </div>
                  </div>
                ) : (
                  <Button
                    startIcon={<PlusIcon stroke="#009444" />}
                    className="btn_pry"
                    variant={"outlined"}
                    onClick={() => {
                      navigate("create-free-shipping");
                    }}
                  >
                    Create Free Shipping
                  </Button>
                )}

                <Button
                  startIcon={<PlusIcon />}
                  className="btn_pry primary_styled_button"
                  variant={"contained"}
                  component={Link}
                  to="/dashboard/store/shipping-fees/create"
                >
                  Create shipping method
                </Button>
              </div>
            </div>
            <div className="table_section">
              <div className="table_action_container">
                <div className="left_section">
                  {selected.length ? (
                    <div className="show_selected_actions">
                      <p>Selected: {selected.length}</p>
                      <Button
                        onClick={() => {
                          setIdTobeDeleted("");
                          setOpenDeleteModal(true);
                        }}
                        startIcon={<TrashIcon />}
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() => {
                          setOpenDuplicateModal(true);
                        }}
                        startIcon={<CopyIcon />}
                      >
                        Duplicate to other locations{" "}
                      </Button>
                    </div>
                  ) : (
                    <div className="filter_container">
                      {filterList.map((item, i) => (
                        <Button
                          key={i}
                          onClick={() => {
                            setFilter(item);
                          }}
                          className={`filter_button ${
                            item === filter ? "active" : ""
                          }`}
                        >
                          {item}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <TableComponent
                isError={isError}
                isLoading={isLoading || isFetching}
                headCells={headCell}
                selectMultiple={true}
                selected={selected}
                showPagination={false}
                setSelected={setSelected}
                handleClick={(row: any) => {
                  setShippingToView(row);
                  setShowDetailsModal(true);
                }}
                tableData={data?.shippingTypes?.map((row, i) => ({
                  date: moment(row.created_at).format("ll"),
                  title: row.name,
                  name: row.name,
                  price: row.price,
                  created_at: row.created_at,
                  description: row.description,
                  visible: row.visible,
                  fee: row.price_formatted,
                  price_formatted: row.price_formatted,
                  location_id: row.location_id,
                  action: (
                    <div className="flex gap-[28px] justify-end">
                      <IconButton
                        type="button"
                        className="icon_button_container"
                        onClick={(e) => {
                          setIdTobeDeleted(`${row.id}`);
                          setOpenDeleteModal(true);
                          e.stopPropagation();
                        }}
                      >
                        {loadDelete && `${row.id}` === idTobeDeleted ? (
                          <CircularProgress size="1.5rem" sx={{}} />
                        ) : (
                          <TrashIcon />
                        )}
                      </IconButton>
                      {/* <IconButton
                        onClick={() => {
                          setShippingToView(row);
                          setShowDetailsModal(true);
                        }}
                        type="button"
                        className="icon_button_container"
                      >
                        <EyeIcon />
                      </IconButton> */}
                    </div>
                  ),
                  id: row.id,
                }))}
              />
            </div>
          </div>
        )}

        {showDetailsModal && (
          <ViewShippingDetails
            showModal={showDetailsModal}
            setShowModal={() => {
              setShowDetailsModal(false);
            }}
            deleteFnc={(id: string) => {
              setIdTobeDeleted(`${id}`);
              setOpenDeleteModal(true);
            }}
            loadDelete={loadDelete}
            shippingToView={shippingToView}
            setShowEditModal={() => {
              setShowEditModal(true);
            }}
          />
        )}

        <DuplicateShippingModal
          openModal={openDuplicateModal}
          closeModal={() => {
            setOpenDuplicateModal(false);
          }}
          shippingList={selected}
          setSelected={setSelected}
        />

        {showEditModal && (
          <EditShipping
            showModal={showEditModal}
            shippingToView={shippingToView}
            setShowModal={() => {
              setShowEditModal(false);
            }}
          />
        )}
      </div>
      <ViewFreeShippingDetails
        showModal={showFreeDetailsModal}
        setShowModal={() => {
          setShowFreeDetailsModal(false);
        }}
        deleteFnc={(id: string) => {
          setIdTobeDeleted(`${id}`);
          setOpenDeleteModal(true);
        }}
        loadDelete={loadDelete}
        handleToggleFreeshipping={handleToggleFreeshipping}
        shippingToView={freeShipping}
        setShowEditModal={() => {
          setShowFreeEditModal(true);
        }}
        setShowFreeEditModal={setShowFreeEditModal}
      />
      <EditFreeShipping
        showModal={showFreeEditModal}
        shippingToView={freeShipping}
        setShowModal={() => {
          setShowFreeEditModal(false);
        }}
      />
      <MessageModal
        openModal={openDeleteModal}
        closeModal={() => {
          setOpenDeleteModal(false);
        }}
        icon={<TrashIcon />}
        btnChild={
          <Button
            onClick={() => {
              if (idTobeDeleted) {
                deleteShippingFnc(idTobeDeleted, () => {
                  setIdTobeDeleted("");
                  setOpenDeleteModal(false);
                });
              } else {
                bulkDelete();
              }
            }}
            disabled={loadDelete || isDeleteLoading}
            className="error"
          >
            {loadDelete || isDeleteLoading ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Yes, delete"
            )}
          </Button>
        }
        description="Are you sure you want to delete selected shipping method? This action is irreversible"
      />
      <MessageModal
        openModal={openDeactivateModal}
        closeModal={() => {
          setOpenDeactivateModal(false);
        }}
        icon={<InfoIcon stroke="#5C636D" />}
        btnChild={
          <Button
            onClick={() => {
              handleDeactivateOrActivateFreeShipping();
            }}
            disabled={loadEdit}
            className="error"
          >
            {loadEdit ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Yes"
            )}
          </Button>
        }
        description={`Are you sure you want to ${
          freeShipping?.status == 1 ? "deactivate?" : "activate"
        }`}
      />
      <ShipBubbleConnectedModal
        openModal={openShipbubbleModal}
        closeModal={() => {
          setOpenShipbubbleModal(true);
        }}
      />

      <PageUpdateModal
        openModal={openUpdateModal}
        isLoading={loadFlag}
        title={"Free Shipping"}
        description={
          "You can set free shipping for your customers based on the minimum amount you want them to spend."
        }
        size={"small"}
        closeModal={() => {
          updateAppFlag();
        }}
        btnText="Dismiss"
        btnAction={() => {
          updateAppFlag();
        }}
      />
    </>
  );
};

export default ShippingFee;

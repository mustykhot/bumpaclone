import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import "./style.scss";
import { Button, IconButton } from "@mui/material";
import { BuildingIcon } from "assets/Icons/BuildingIcon";
import { EditIcon } from "assets/Icons/EditIcon";
import { LargeDeleteIcon } from "assets/Icons/LargeDeleteIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { SearchIcon } from "assets/Icons/SearchIcon";
import locationImg from "assets/images/location.png";
import EmptyResponse from "components/EmptyResponse";
import Loader from "components/Loader";
import InputField from "components/forms/InputField";
import TableComponent from "components/table";
import { LocationType } from "services/api.types";
import {
  useDeleteLocationMutation,
  useGetLocationsQuery,
  useGetLoggedInUserQuery,
  useGetStoreInformationQuery,
  useSetAppFlagMutation,
} from "services";
import {
  selectIsSubscriptionType,
  selectIsSubscriptionExpired,
} from "store/slice/AuthSlice";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import ConfirmDeleteModal from "./DeleteLocation/ConfirmDeleteModal";
import DeleteLocationModal from "./DeleteLocation";
import { EditLocationModal } from "./EditLocation/EditLocation";
import { BootstrapTooltip } from "../Transactions/TransactionHistoryTable";
import { InfoCircleXLIcon } from "assets/Icons/InfoCircleXLIcon";
import { XIcon } from "assets/Icons/XIcon";
import { GrowthModal } from "components/GrowthModal";
import { UpgradeModal } from "components/UpgradeModal";
import ExtraLocationModal from "./CreateLocation/ExtraLocationModal";
import { PowerIcon } from "assets/Icons/PowerIcon";
import ReactivateStaffModal from "../Store/StaffAccount/ListOfStaffAccount/StaffTable/ReactivateStaffModal";
import { PAGEUPDATEVERSIONS } from "utils/constants/general";
import PageUpdateModal from "components/PageUpdateModal";
import { LocationIcon1 } from "assets/Icons/LocationIcon1";
import ExtraSuccessModal from "./CreateLocation/ExtraSuccessModal";
import TopBanner from "components/Banner/TopBanner";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";

const headCell = [
  {
    key: "name",
    name: "Location Name",
  },
  {
    key: "address",
    name: "Address",
  },
  {
    key: "country",
    name: "Country",
  },
  {
    key: "state",
    name: "State",
  },

  {
    key: "city",
    name: "City",
  },

  {
    key: "action",
    name: "",
  },
];

const filterList = [
  { name: "All", value: "all" },
  { name: "Deactivated", value: "deactivated" },
];
const Location = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openExtraLocationModal, setOpenExtraLocationModal] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteDeleteModal] =
    useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [locationTobeDeleted, setLocationTobeDeleted] =
    useState<LocationType | null>(null);
  const [locationToBeEdited, setLocationToBeEdited] =
    useState<LocationType | null>(null);
  const [search, setSearch] = useState("");
  const [deleteLocation, { isLoading: deleteLoading }] =
    useDeleteLocationMutation();
  const { data, isLoading, isFetching, isError } = useGetLocationsQuery();
  const [searchedData, setSearchedData] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [extraSlots, setExtraSlots] = useState(false);
  const { data: storeData, isLoading: loadStore } =
    useGetStoreInformationQuery();
  const [openGrowthModal, setOpenGrowthModal] = useState(false);
  const [isMoreLocationUpgrade, setIsMoreLocationUpgrade] = useState(false);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const [isGrowthUpgrade, setIsGrowthUpgrade] = useState(false);
  const [openBuySlots, setOpenBuySlots] = useState(false);
  const [maxPlan, setMaxPlan] = useState(false);
  const [openReactivateModal, setOpenReactivateModal] = useState(false);
  const [isRowClick, setIsRowClick] = useState(false);
  const [activeLocation, setActiveLocation] = useState<any>();
  const [reactivateAll, setReactivateAll] = useState(false);
  const [showMaxModal, setShowMaxModal] = useState(false);
  const [mainRow, setMainRow] = useState("");
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const { data: userData } = useGetLoggedInUserQuery();
  const [setAppFlag, { isLoading: loadFlag }] = useSetAppFlagMutation();
  const [setBannerFlag, { isLoading: loadBanner }] = useSetAppFlagMutation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [openWarningBanner, setOpenWarningBanner] = useState(false);

  const no_extra_locations =
    storeData?.store?.subscription?.[0]?.no_of_extra_locations ?? 0;

  const freeSlots = data?.slots?.available_location_slots ?? 0;
  const numOfDisabled = data?.slots?.disabledLocations ?? 0;

  const deleteFnc = async () => {
    try {
      let result = await deleteLocation(locationToBeEdited?.id);
      if ("data" in result) {
        showToast("Deleted successfully", "success");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleRowClick = () => {
    setIsRowClick(true);
    if (isSubscriptionType === "growth") {
      if (freeSlots > 0) {
        setOpenReactivateModal(true);
      } else {
        setOpenUpgradeModal(true);
        setOpenBuySlots(true);
        setMaxPlan(true);
      }
    } else if (
      isSubscriptionExpired ||
      isSubscriptionType === "free" ||
      isSubscriptionType === "trial" ||
      isSubscriptionType === "pro" ||
      isSubscriptionType === "starter"
    ) {
      setIsGrowthUpgrade(true);
      setOpenUpgradeModal(true);
      setMaxPlan(true);
    }
  };

  const handleMoreClick = () => {
    setIsRowClick(false);
    if (isSubscriptionType === "growth") {
      setOpenUpgradeModal(true);
      setOpenBuySlots(true);
      setMaxPlan(true);
    } else if (
      isSubscriptionExpired ||
      isSubscriptionType === "free" ||
      isSubscriptionType === "pro" ||
      isSubscriptionType === "trial" ||
      isSubscriptionType === "starter"
    ) {
      setOpenGrowthModal(true);
    }
  };

  const handleReactivateAll = () => {
    setOpenReactivateModal(true);
    setReactivateAll(true);
  };

  const growthFeaturesList = isMoreLocationUpgrade
    ? [
        "Manage inventory & sales across more store locations on one Bumpa account.",
        "Manage a 2 in 1 website for different locations.",
        "Manage staff activities in different locations with the same dashboard.",
      ]
    : [
        "Manage inventory & sales across more store locations on one Bumpa account.",
        "Manage a 2 in 1 website for different locations.",
        "Get point-of-sale software for faster checkout in your physical store.",
        "Manage staff activities in different locations with the same dashboard.",
      ];

  const updateAppFlag = async () => {
    let payload = {
      ...userData?.app_flags,
      webapp_updates: {
        ...userData?.app_flags?.webapp_updates,
        location_page: {
          version: PAGEUPDATEVERSIONS.LOCATIONPAGE,
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

  useEffect(() => {
    if (userData) {
      if (
        userData?.app_flags?.webapp_updates?.location_page?.version >=
        PAGEUPDATEVERSIONS.LOCATIONPAGE
      ) {
        if (userData?.app_flags?.webapp_updates?.location_page?.status) {
          setOpenUpdateModal(false);
        } else {
          setOpenUpdateModal(true);
        }
      } else {
        setOpenUpdateModal(true);
      }
    }
  }, [userData]);

  const updateBannerFlag = async () => {
    let payload = {
      ...userData?.app_flags,
      webapp_updates: {
        ...userData?.app_flags?.webapp_updates,
        location_warning_banner: {
          version: PAGEUPDATEVERSIONS.LOCATION_WARNING_BANNER,
          status: true,
        },
      },
    };
    try {
      let result = await setBannerFlag(payload);
      if ("data" in result) {
        setOpenWarningBanner(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
    setOpenWarningBanner(false);
  };

  useEffect(() => {
    if (userData) {
      if (
        userData?.app_flags?.webapp_updates?.location_warning_banner?.version >=
        PAGEUPDATEVERSIONS.LOCATION_WARNING_BANNER
      ) {
        if (
          userData?.app_flags?.webapp_updates?.location_warning_banner?.status
        ) {
          setOpenWarningBanner(false);
        } else {
          setOpenWarningBanner(true);
        }
      } else {
        setOpenWarningBanner(true);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (search) {
      let filtered = data?.data?.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setSearchedData(filtered && filtered?.length ? [...filtered] : []);
    } else {
      setSearchedData(data?.data && data?.data?.length ? [...data?.data] : []);
    }
  }, [search, data]);

  useEffect(() => {
    if (filter === "deactivated") {
      let filtered = data?.data?.filter(
        (item) => item.is_active === 0 && item.reason_for_deletion !== null
      );
      setSearchedData(filtered && filtered?.length ? [...filtered] : []);
    } else if (filter === "disabled") {
      let filtered = data?.data?.filter(
        (item) => item.is_active === 0 && item.reason_for_deletion === null
      );
      setSearchedData(filtered && filtered?.length ? [...filtered] : []);
    } else {
      setSearchedData(data?.data && data?.data?.length ? [...data?.data] : []);
    }
  }, [filter]);

  const decodedURL = location.search.replace(/&amp;/g, "&");
  const queryParams = new URLSearchParams(decodedURL);
  const successPayment = queryParams.get("success");
  const slotsPurchased = queryParams.get("slot");

  useEffect(() => {
    if (successPayment) {
      setShowSuccessModal(true);
      setExtraSlots(true);
    }

    setTimeout(() => {
      queryParams.delete("success");
      queryParams.delete("slot");
    }, 2000);

    const newUrl = `${location.pathname}`;
    window.history.pushState({}, "", newUrl);
    const handlePageExit = () => {
      setExtraSlots(false); // Close the banner
    };
    window.addEventListener("beforeunload", handlePageExit);
    window.addEventListener("popstate", handlePageExit);

    return () => {
      window.removeEventListener("beforeunload", handlePageExit);
      window.removeEventListener("popstate", handlePageExit);
    };
  }, [successPayment]);

  const shouldShowMaxModal = () => {
    return (
      isSubscriptionType === "growth" &&
      no_extra_locations < 1 &&
      freeSlots === 0 &&
      openWarningBanner
    );
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className={`pd_location ${false ? "empty" : ""}`}>
        {false ? (
          <EmptyResponse
            message="Store Location"
            image={locationImg}
            extraText="You can add as many store locations as possible"
            btn={
              <Button
                sx={{
                  padding: "12px 24px",
                }}
                variant="contained"
                className="primary_styled_button"
                startIcon={<PlusIcon />}
                onClick={() => {
                  navigate("create");
                }}
              >
                Add store location
              </Button>
            }
          />
        ) : (
          <div className="location_container">
            <TopBanner
              openModal={extraSlots}
              closeModal={() => setExtraSlots(false)}
              text={
                "You have successfully purchased another slot for you to add another store location. Please note that this is only valid for the duration of your subscription."
              }
            />

            {shouldShowMaxModal() && (
              <div className="warning">
                <div className="right_flex">
                  <div className="helper_icone">
                    <InfoCircleXLIcon />
                  </div>
                  <p className="warning_text">
                    You’ve reached the maximum number of store locations. Click
                    the get more slots button below to add more locations.
                  </p>
                </div>
                <div className="close-icon" onClick={updateBannerFlag}>
                  <XIcon stroke="black" />
                </div>
              </div>
            )}

            <div className="title_section">
              <div className="top_div">
                <h3 className="name_of_section">Store Locations</h3>
                <div className="location_count">
                  <div className="first_flex">
                    <LocationIcon1 />
                    <span>Available Location Slots: {freeSlots}</span>
                  </div>

                  <Button
                    className={"store_button fixed-btn"}
                    onClick={() => {
                      handleMoreClick();
                    }}
                    variant={"outlined"}
                  >
                    Get more slots
                  </Button>
                  {numOfDisabled > 0 && freeSlots >= numOfDisabled ? (
                    <Button
                      className={"store_button reactivate all"}
                      onClick={() => {
                        handleReactivateAll();
                      }}
                      variant={"contained"}
                    >
                      Reactivate all Locations
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="btn_flex">
                <div className="btn_flex">
                  <Button
                    startIcon={<PlusIcon />}
                    variant={"contained"}
                    className="primary_styled_button"
                    onClick={() => {
                      navigate("create");
                    }}
                  >
                    Add new location
                  </Button>
                </div>
              </div>
            </div>
            <div className="info_disable">
              <InfoCircleIcon className="icon" />
              <p>
                Disabled locations are locations disabled by the user while
                deactivated locations are locations deativated when subscription
                expires
              </p>
            </div>
            <div className="table_section">
              <div className="table_action_container">
                <div className="left_section">
                  <div className="filter_container">
                    <Button
                      onClick={() => {
                        setFilter("");
                        setSearch("");
                      }}
                      className={`filter_button ${
                        filter === "" ? "active" : ""
                      } `}
                    >
                      All
                    </Button>
                    <Button
                      onClick={() => {
                        setFilter("disabled");
                        setSearch("");
                      }}
                      className={`filter_button  ${
                        filter === "disabled" ? "active" : ""
                      }`}
                    >
                      Disabled
                    </Button>
                    <Button
                      onClick={() => {
                        setFilter("deactivated");
                        setSearch("");
                      }}
                      className={`filter_button  ${
                        filter === "deactivated" ? "active" : ""
                      }`}
                    >
                      Deactivated
                    </Button>
                  </div>
                </div>
                <div className="search_container">
                  <InputField
                    type={"text"}
                    containerClass="search_field"
                    value={search}
                    onChange={(e: any) => {
                      setFilter("");
                      setSearch(e.target.value);
                    }}
                    placeholder="Search"
                    suffix={<SearchIcon />}
                  />
                </div>
              </div>

              <TableComponent
                isError={isError}
                isLoading={isLoading || isFetching}
                headCells={headCell}
                selectMultiple={false}
                showPagination={false}
                tableType="location"
                handleClick={(row: any) => {
                  if (row.reason_for_deletion !== null) {
                    handleRowClick();
                    setActiveLocation(row);
                    setMainRow(row.name.props.children[0]);
                    return;
                  }
                  navigate(`${row.id}`);
                }}
                tableData={searchedData?.map((row, i) => ({
                  ...row,
                  name: row.is_default ? (
                    <BootstrapTooltip
                      slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, -8],
                              },
                            },
                          ],
                        },
                      }}
                      title="Primary address."
                      placement="top-start"
                    >
                      <div className="flex gap-1 items-center">
                        {row.name}
                        <BuildingIcon stroke="#009444" />
                        {row.is_active === 0 &&
                        row.reason_for_deletion === null ? (
                          <span className="deactivated_chip">Disabled</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </BootstrapTooltip>
                  ) : (
                    <div className="flex gap-1 items-center">
                      {row.name}
                      {row.is_active === 0 &&
                      row.reason_for_deletion === null ? (
                        <span className="deactivated_chip">Disabled</span>
                      ) : (
                        ""
                      )}
                      {row.is_active === 0 &&
                      row.reason_for_deletion !== null ? (
                        <span className="deactivated_chip"> Deactivated</span>
                      ) : (
                        ""
                      )}
                    </div>
                  ),
                  address: row.address,
                  country: row.country,
                  state: row.state,
                  city: row.city,
                  action: (
                    <div className="flex gap-[28px] justify-end">
                      {row.reason_for_deletion !== null && freeSlots > 0 && (
                        <IconButton
                          type="button"
                          className=" z-10 trash"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenReactivateModal(true);
                            setActiveLocation(row);
                          }}
                        >
                          <BootstrapTooltip
                            slotProps={{
                              popper: {
                                modifiers: [
                                  {
                                    name: "offset",
                                    options: {
                                      offset: [0, -10],
                                    },
                                  },
                                ],
                              },
                            }}
                            title="Reactivate this location"
                            placement="top"
                          >
                            <div className="">
                              <PowerIcon stroke="#5C636D" />
                            </div>
                          </BootstrapTooltip>
                        </IconButton>
                      )}
                      {row.reason_for_deletion !== null && (
                        <IconButton
                          type="button"
                          className=" z-10 trash"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <BootstrapTooltip
                            slotProps={{
                              popper: {
                                modifiers: [
                                  {
                                    name: "offset",
                                    options: {
                                      offset: [0, -10],
                                    },
                                  },
                                ],
                              },
                            }}
                            title="This location is disabled because your subscription has expired."
                            placement="top"
                          >
                            <div className="">
                              <InfoCircleXLIcon stroke="#5C636D" />
                            </div>
                          </BootstrapTooltip>
                        </IconButton>
                      )}
                      {row.reason_for_deletion === null && (
                        <IconButton
                          onClick={(e) => {
                            if (row.reason_for_deletion !== null) {
                              handleRowClick();
                              return;
                            }
                            setLocationToBeEdited({
                              name: row.name,
                              address: row.address,
                              country_id: row.country_id,
                              state_id: row.state_id,
                              city_id: row.city_id,
                              id: `${row.id}`,
                              is_default: row.is_default,
                            });
                            setOpenEditModal(true);
                            e.stopPropagation();
                          }}
                          type="button"
                          className="icon_button_container trash"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </div>
                  ),
                  id: row.id,
                }))}
              />
            </div>
          </div>
        )}
      </div>
      <EditLocationModal
        openModal={openEditModal}
        closeModal={() => {
          setOpenEditModal(false);
        }}
        locationToBeEdited={locationToBeEdited}
      />
      <DeleteLocationModal
        openModal={openDeleteModal}
        closeModal={() => {
          setOpenDeleteModal(false);
        }}
        locationTobeDeleted={locationTobeDeleted}
        btnAction={() => {}}
      />
      <ConfirmDeleteModal
        openModal={openConfirmDeleteModal}
        closeModal={() => {
          setOpenConfirmDeleteDeleteModal(false);
        }}
        icon={<LargeDeleteIcon />}
        isLoading={deleteLoading}
        btnAction={() => {
          deleteFnc();
        }}
        description_text="You’re about to delete your store located at"
        second_description_text={locationTobeDeleted?.name}
        title="Confirm deletion"
      />
      {openUpgradeModal && (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          pro={isProUpgrade}
          growth={isGrowthUpgrade}
          location={openBuySlots}
          width={openBuySlots && maxPlan ? "600px" : ""}
          title={
            isRowClick
              ? "This Location Has Been Deactivated"
              : `Add multiple locations on Bumpa`
          }
          subtitle={`Add and manage multiple locations on Bumpa`}
          proFeatures={[
            "Add & manage up to 3 staff members",
            "No multilocation",
            "No point-of-sale software",
          ]}
          growthFeatures={[
            "Add & manage up to 2 locations",
            "Add multiple store locations & manage staff actions across each",
            "Get point-of-sale software to process physical sales faster & automatically record them",
          ]}
          eventName="multilocation"
        />
      )}
      {openGrowthModal && (
        <GrowthModal
          openModal={openGrowthModal}
          closeModal={() => {
            setOpenGrowthModal(false);
          }}
          moreLocation={isMoreLocationUpgrade}
          title={
            isMoreLocationUpgrade
              ? "Add an extra location on Bumpa"
              : "Manage a new store location on Bumpa"
          }
          subtitle={`Manage multiple stores easily on Bumpa.`}
          growthFeatures={growthFeaturesList}
          buttonText={
            isMoreLocationUpgrade
              ? "Add More Store Locations"
              : "Upgrade to Growth"
          }
          setShowModal={() => setOpenExtraLocationModal(true)}
          eventName="multilocation"
        />
      )}
      <ExtraLocationModal
        openModal={openExtraLocationModal}
        closeModal={() => setOpenExtraLocationModal(false)}
      />
      {openReactivateModal && (
        <ReactivateStaffModal
          openModal={openReactivateModal}
          closeModal={() => setOpenReactivateModal(false)}
          item={activeLocation}
          slots={freeSlots}
          type="location"
          reactivate_all={reactivateAll}
          itemName={mainRow}
        />
      )}
      <PageUpdateModal
        openModal={openUpdateModal}
        isLoading={loadFlag}
        title={"Purchase Extra Locations"}
        description={
          "You can now purchase extra locations that come with 1000 products, 3 staff seats & an extra location on your website."
        }
        size={"small"}
        closeModal={() => {
          updateAppFlag();
        }}
        btnText="Cancel"
      />
      {showSuccessModal && (
        <ExtraSuccessModal
          openModal={showSuccessModal}
          closeModal={() => setShowSuccessModal(false)}
          // @ts-ignore
          numOfLocations={parseInt(slotsPurchased)}
        />
      )}
    </>
  );
};

export default Location;

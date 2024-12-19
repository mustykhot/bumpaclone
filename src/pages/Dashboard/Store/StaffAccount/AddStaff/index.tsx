import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import ValidatedInput from "components/forms/ValidatedInput";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { EditIcon } from "assets/Icons/EditIcon";
import { PlusCircleIcon } from "assets/Icons/PlusCircleIcon";
import dot from "assets/images/dot.png";
import AddStaffModal from "./AddStaffModal";
import EditStaffModal from "./EditStaffModal";
import StaffPermission from "./StaffPermission";
import InviteScreen from "./InviteScreen";
import {
  useCreateStaffAccountMutation,
  useGetLocationsQuery,
  useGetStaffAccountsQuery,
  useGetStoreInformationQuery,
} from "services";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import "./style.scss";

import {
  selectCurrentUser,
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
  selectUserAssignedLocation,
  selectUserLocation,
} from "store/slice/AuthSlice";
import MultipleSelectField from "components/forms/MultipleSelectField";
import { UpgradeModal } from "components/UpgradeModal";
import { GrowthModal } from "components/GrowthModal";
import ExtraStaffModal from "./ExtraStaff/ExtraStaffModal";
export const hasViewOrManagePermission = (permissionList: any) => {
  for (const key in permissionList) {
    if (Object.hasOwnProperty.call(permissionList, key)) {
      const permissions = permissionList[key];
      if (permissions.view || permissions.manage) {
        return true;
      }
    }
  }
  return false;
};
export type CreateStaffFields = {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location_ids?: string[];
};

type IStaff = {
  name: string;
  email: string;
  phone: string;
  location_ids?: string[];
  id?: number;
};

const AddStaff = () => {
  const [staffList, setStaffList] = useState<Array<any>>([
    {
      name: "",
      email: "",
      phone: "",
      location_ids: [],
    },
  ]);
  const [permissionList, setPermissionList] = useState({
    products: {
      view: false,
      manage: false,
    },
    orders: {
      view: false,
      manage: false,
    },
    messaging: {
      view: false,
      manage: false,
    },
    analytics: {
      view: false,
    },
  });
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [activeStaff, setActiveStaff] = useState({
    name: "",
    email: "",
    phone: "",
    location_ids: [],
    index: 0,
  });
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const [isMoreStaffUpgrade, setIsMoreStaffUpgrade] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [openGrowthModal, setOpenGrowthModal] = useState(false);
  const [openExtraModal, setOpenExtraModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const methods = useForm<CreateStaffFields>({
    mode: "all",
  });
  const {
    formState: { isValid },
    handleSubmit,
    setValue,
    getValues,
    reset,
  } = methods;

  const firstName = getValues("firstName");
  const lastName = getValues("lastName");
  const location_ids = getValues("location_ids");
  const role = getValues("role");
  const email = getValues("email");
  const phone = getValues("phone");
  const user = useAppSelector(selectCurrentUser);
  const assignedLocations = useAppSelector(selectUserAssignedLocation);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const navigate = useNavigate();

  const {
    data: locationData,
    isLoading: loadLocation,
    isFetching: isFetchingLocatio,
    isError: isErrorLocation,
  } = useGetLocationsQuery();
  const userLocation = useAppSelector(selectUserLocation);
  const [createStaffAccount, { isLoading }] = useCreateStaffAccountMutation();
  const { data: staffData } = useGetStaffAccountsQuery({
    search: "",
    location_id: userLocation?.id,
  });
  const { data: storeData, isLoading: loadStore } =
    useGetStoreInformationQuery();
  // @ts-ignore
  const freeSlots = staffData?.slots?.available_staff_slots ?? 0;

  useEffect(() => {
    if (staffList.length === 1) {
      const newList = [];
      const staff = {
        name: `${firstName} ${lastName}`,
        email: email,
        phone: phone,
        location_ids: location_ids,
      };
      newList.push(staff);
      setStaffList(newList);
    }
  }, [firstName, lastName, role, email, phone, location_ids]);

  const onSubmit: SubmitHandler<CreateStaffFields> = async (data) => {
    if (isSubscriptionType === "pro" && staffList.length > freeSlots) {
      setOpenGrowthModal(true);
      setIsMoreStaffUpgrade(false);
    } else if (
      isSubscriptionType === "growth" &&
      staffList.length > freeSlots
    ) {
      setIsMoreStaffUpgrade(true);
      setOpenGrowthModal(true);
    } else if (
      isSubscriptionExpired ||
      isSubscriptionType === "free" ||
      isSubscriptionType === "trial" ||
      isSubscriptionType === "starter"
    ) {
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
    } else {
      if (hasViewOrManagePermission(permissionList)) {
        const payload = {
          staff: staffList.map((item) => ({
            ...item,
            location_ids: data.location_ids,
          })),
          role: data.role,
          permissions: permissionList,
        };

        try {
          let result = await createStaffAccount(payload);
          if ("data" in result) {
            showToast("Staff Added Successfully", "success");
            setInviteModal(true);
            if (typeof _cio !== "undefined") {
              _cio.track("web_staff_add", payload);
            }
            if (typeof mixpanel !== "undefined") {
              mixpanel.track("web_staff_add", payload);
            }
          } else {
            handleError(result);
          }
        } catch (error) {
          handleError(error);
        }
      } else {
        showToast("Set at least one permission", "error");
      }
    }
  };

  const handleAddMoreStaff = () => {
    setShowAddStaffModal(true);
  };

  const handleDeleteStaff = (staff: IStaff) => {
    let newList = [...staffList];
    const result: IStaff[] = newList.filter((item, i) => i !== staff.id);
    setStaffList(result);
  };

  useEffect(() => {
    if (staffData) {
    }
  }, [staffData]);

  useEffect(() => {
    setValue("location_ids", [`${userLocation?.id}`]);
  }, []);

  return (
    <div className="pd_create_staff">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form_section">
            <ModalHeader text="Add new staff" />

            <div className="form_field_container">
              <div className="order_details_container">
                <FormSectionHeader title="Staff Details" />
                <div className="px-[16px]">
                  <ValidatedInput
                    label="Staff Role Label"
                    name="role"
                    type="text"
                    placeholder="Enter staff role e.g Manager, Sales representative etc."
                  />

                  {staffList?.length === 1 ? (
                    <div>
                      {" "}
                      <div className="form-group-flex">
                        <ValidatedInput
                          name="firstName"
                          label="First Name"
                          type={"text"}
                          placeholder="Enter first name"
                        />
                        <ValidatedInput
                          name="lastName"
                          label="Last Name"
                          type={"text"}
                          placeholder="Enter last name"
                        />
                      </div>
                      <div className="form-group-flex">
                        <ValidatedInput
                          name="email"
                          label="Email Address"
                          type={"email"}
                          placeholder="Enter email address"
                        />
                        <ValidatedInput
                          name="phone"
                          label="Phone Number"
                          type={"number"}
                          placeholder="Enter phone number"
                        />
                      </div>
                      {Number(user?.is_staff) === 0 ? (
                        <MultipleSelectField
                          name="location_ids"
                          selectOption={
                            locationData
                              ? locationData?.data?.length
                                ? locationData?.data?.map((item: any) => {
                                    return {
                                      key: item.name,
                                      value: `${item.id}`,
                                    };
                                  })
                                : []
                              : []
                          }
                          label="Assign Locations"
                        />
                      ) : assignedLocations.length > 1 ? (
                        <MultipleSelectField
                          name="location_ids"
                          selectOption={
                            assignedLocations
                              ? assignedLocations?.length
                                ? assignedLocations?.map((item: any) => {
                                    return {
                                      key: item.name,
                                      value: `${item.id}`,
                                    };
                                  })
                                : []
                              : []
                          }
                          label="Assign Locations"
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    staffList?.map((item, index) => (
                      <div className="staff-details" key={index}>
                        <div>
                          <h3>{item?.name}</h3>
                          <div className="staff-details__email-section">
                            <span>{item?.email}</span>
                            <img src={dot} alt="dot" />
                            <span>{item?.phone}</span>
                          </div>
                        </div>
                        <div className="staff-details__actions">
                          <span
                            onClick={() => {
                              setShowEditStaffModal(true);
                              setActiveStaff({ ...item, id: index });
                            }}
                          >
                            <EditIcon />
                          </span>
                          <span
                            onClick={() => {
                              handleDeleteStaff({ ...item, id: index });
                            }}
                          >
                            {" "}
                            <TrashIcon />
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                  <div className={`add-more ${!isValid ? "" : "active"}`}>
                    <hr />
                    <Button
                      onClick={handleAddMoreStaff}
                      type="button"
                      disabled={!isValid}
                      startIcon={
                        <PlusCircleIcon
                          stroke={!isValid ? "#d4d7db" : "#009444"}
                        />
                      }
                    >
                      Add another staff
                    </Button>

                    <hr />
                  </div>
                </div>
              </div>

              <StaffPermission
                permissions={permissionList}
                setPermissions={setPermissionList}
              />
              <InviteScreen
                closeModal={() => {
                  setInviteModal(false);
                }}
                name={`${firstName} ${lastName}`}
                openModal={inviteModal}
              />
            </div>
          </div>
          <div className="submit_form_section">
            <Button onClick={() => navigate(-1)} className="discard">
              Discard
            </Button>
            <div className="button_container">
              <Button
                onClick={() => {
                  reset();
                  setPermissionList({
                    products: {
                      view: false,
                      manage: false,
                    },
                    orders: {
                      view: false,
                      manage: false,
                    },
                    messaging: {
                      view: false,
                      manage: false,
                    },
                    analytics: {
                      view: false,
                    },
                  });
                }}
                variant="contained"
                type="button"
                // disabled={!isValid}
                className="preview"
              >
                Clear Fields
              </Button>

              <LoadingButton
                loading={isLoading}
                variant="contained"
                className="add"
                type="submit"
                disabled={!isValid}
              >
                Continue
              </LoadingButton>
            </div>
          </div>
        </form>
      </FormProvider>

      {showAddStaffModal && (
        <AddStaffModal
          showModal={showAddStaffModal}
          setShowModal={() => {
            setShowAddStaffModal(false);
          }}
          addMoreStaff={setStaffList}
          staffList={staffList}
        />
      )}

      {showEditStaffModal && (
        <EditStaffModal
          showModal={showEditStaffModal}
          setShowModal={() => {
            setShowEditStaffModal(false);
          }}
          activeStaff={activeStaff}
          addMoreStaff={setStaffList}
          staffList={staffList}
        />
      )}
      {openUpgradeModal && (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          pro={isProUpgrade}
          title={`Add staff to mange your business on Bumpa`}
          subtitle={`Add up to 5 staff and oversee what they do with your business`}
          proFeatures={[
            "Add & manage up to 3 staff members",
            "No multilocation",
            "No point-of-sale software",
          ]}
          growthFeatures={[
            "Add & manage up to 5 staff members",
            "Add multiple store locations & manage staff actions across each",
            "Get point-of-sale software to process physical sales faster & automatically record them",
          ]}
          eventName="staff-account"
        />
      )}
      {openGrowthModal && (
        <GrowthModal
          openModal={openGrowthModal}
          closeModal={() => {
            setOpenGrowthModal(false);
          }}
          moreStaff={isMoreStaffUpgrade}
          title={`Need to Add More Than ${
            isSubscriptionType === "pro" ? 3 : 5
          } Staff?`}
          subtitle={`Add more staff from any locations with custom purchasing.`}
          growthFeatures={[
            "Add and manage unlimited number of staff",
            "Oversee what your staff do in different staff locations.",
            "View products & inventory managed by different staff members.",
          ]}
          buttonText={
            isMoreStaffUpgrade
              ? "Purchase Extra Staff Accounts"
              : "Upgrade to Growth"
          }
          setShowModal={() => setOpenExtraModal(true)}
          eventName="staff-account"
        />
      )}
      {openExtraModal && (
        <ExtraStaffModal
          openModal={openExtraModal}
          closeModal={() => setOpenExtraModal(false)}
        />
      )}
    </div>
  );
};

export default AddStaff;

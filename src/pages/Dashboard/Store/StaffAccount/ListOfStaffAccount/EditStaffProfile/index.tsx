import { useState, useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import ValidatedInput from "components/forms/ValidatedInput";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useGetLocationsQuery, useUpdateStaffAccountMutation } from "services";
import StaffPermission from "../../AddStaff/StaffPermission";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";

import "./style.scss";
import {
  selectCurrentUser,
  selectUserAssignedLocation,
  selectUserLocation,
} from "store/slice/AuthSlice";
import MultipleSelectField from "components/forms/MultipleSelectField";
import { hasViewOrManagePermission } from "../../AddStaff";

export type CreateStaffFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  location_ids: string[];
};

const EditStaffProfile = () => {
  const [updateStaffAccount, { isLoading }] = useUpdateStaffAccountMutation();
  const user = useAppSelector(selectCurrentUser);
  const assignedLocations = useAppSelector(selectUserAssignedLocation);

  const {
    data: locationData,
    isLoading: loadLocation,
    isFetching: isFetchingLocatio,
    isError: isErrorLocation,
  } = useGetLocationsQuery();
  const userLocation = useAppSelector(selectUserLocation);
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

  const location = useLocation();
  const navigate = useNavigate();
  const details = location?.state?.details;

  const methods = useForm<CreateStaffFields>({
    mode: "all",
  });
  const {
    formState: { isValid },
    handleSubmit,
    setValue,
    reset,
  } = methods;

  useEffect(() => {
    if (details) {
      const firstName = details?.name.split(" ")[0];
      const lastName = details?.name.split(" ")[1];
      setValue("role", details?.role, { shouldValidate: true });
      setValue("phone", details?.phone, { shouldValidate: true });
      setValue("email", details?.email, { shouldValidate: true });
      setValue("firstName", firstName, { shouldValidate: true });
      setValue("lastName", lastName, { shouldValidate: true });
      setValue(
        "location_ids",
        details?.locations?.map((item: any) => `${item.id}`)
      );

      const perms = { ...permissionList };
      perms.products.view = details?.permissions?.products?.view;
      perms.products.manage = details?.permissions?.products?.manage;
      perms.orders.view = details?.permissions?.orders?.view;
      perms.orders.manage = details?.permissions?.orders?.manage;
      perms.messaging.view = details?.permissions?.messaging?.view;
      perms.messaging.manage = details?.permissions?.messaging?.manage;
      perms.analytics.view = details?.permissions?.analytics?.view;
      setPermissionList(perms);
    }
  }, [details]);

  const onSubmit: SubmitHandler<CreateStaffFields> = async (data) => {
    if (hasViewOrManagePermission(permissionList)) {
      const payload = {
        name: `${data.firstName} ${data.lastName}`,
        role: data.role,
        email: data.email,
        phone: data.phone,
        permissions: permissionList,
        location_ids: data.location_ids,
      };

      try {
        let result = await updateStaffAccount({
          body: payload,
          id: details?.id,
        });

        if ("data" in result) {
          showToast("Staff Updated Successfully", "success");
          navigate("/dashboard/staff");
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    } else {
      showToast("Set at least one permission", "error");
    }
  };

  return (
    <div className="pd_edit_staff">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form_section">
            <ModalHeader text="Edit Staff" />

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
                  <div>
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
                        required={false}
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
                        required={false}
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
                </div>
              </div>

              <StaffPermission
                permissions={permissionList}
                setPermissions={setPermissionList}
              />
            </div>
          </div>
          <div className="submit_form_section">
            <Button
              className="discard"
              onClick={() => {
                navigate(-1);
              }}
            >
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
    </div>
  );
};

export default EditStaffProfile;

import ModalRight from "components/ModalRight";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "./style.scss";
import ValidatedInput from "components/forms/ValidatedInput";
import { Button } from "@mui/material";
import { useEffect } from "react";
import {
  selectCurrentUser,
  selectUserAssignedLocation,
  selectUserLocation,
} from "store/slice/AuthSlice";
import { useAppSelector } from "store/store.hooks";
import { useGetLocationsQuery } from "services";
import MultipleSelectField from "components/forms/MultipleSelectField";

interface IProp {
  setShowModal: () => void;
  addMoreStaff: (value: any) => void;
  showModal: boolean;
  staffList: Array<any>;
}

export type CreateStaffFeilds = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location_ids?: string[];
};

const AddStaffModal = ({
  setShowModal,
  showModal,
  addMoreStaff,
  staffList,
}: IProp) => {
  const user = useAppSelector(selectCurrentUser);
  const assignedLocations = useAppSelector(selectUserAssignedLocation);
  const {
    data: locationData,
    isLoading: loadLocation,
    isFetching: isFetchingLocatio,
    isError: isErrorLocation,
  } = useGetLocationsQuery();
  const userLocation = useAppSelector(selectUserLocation);
  const methods = useForm<CreateStaffFeilds>({
    mode: "all",
  });

  const {
    formState: { isValid },
    handleSubmit,
    setValue,
  } = methods;

  const onSubmit: SubmitHandler<CreateStaffFeilds> = async (data) => {
    const list = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      location_ids: data.location_ids,
    };
    let newList = [...staffList];
    newList.push(list);
    addMoreStaff(newList);
    setShowModal();
  };
  useEffect(() => {
    setValue("location_ids", [`${userLocation?.id}`]);
  }, []);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="add-modal">
        <ModalRight closeModal={setShowModal} openModal={showModal}>
          <div className="modal_right_children">
            <div className="top_section">
              <ModalRightTitle
                className="add-modal__right-title"
                closeModal={setShowModal}
                title="Add Another Staff"
              />

              <div className="add-modal__container">
                <div className="">
                  <ValidatedInput
                    name="firstName"
                    label="First Name"
                    type={"text"}
                    placeholder="Enter First Name"
                    containerClass="pd-staff-input"
                  />

                  <ValidatedInput
                    name="lastName"
                    label="Last Name"
                    type={"text"}
                    placeholder="Enter Last Name"
                    containerClass="pd-staff-input"
                  />

                  <ValidatedInput
                    name="email"
                    label="Email Address"
                    type={"email"}
                    placeholder="Enter Email Address"
                    containerClass="pd-staff-input"
                  />

                  <ValidatedInput
                    name="phone"
                    label="Phone Number"
                    type={"number"}
                    placeholder="Enter Phone Number"
                    containerClass="pd-staff-input"
                  />
                  <div className="form-group-flex pd-staff-input">
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
                </div>
              </div>
            </div>

            <div className="bottom_section">
              <div>
                <Button type="button" onClick={setShowModal} className="cancel">
                  Cancel
                </Button>
                <Button type="submit" className="save" disabled={!isValid}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </ModalRight>
      </form>
    </FormProvider>
  );
};

export default AddStaffModal;

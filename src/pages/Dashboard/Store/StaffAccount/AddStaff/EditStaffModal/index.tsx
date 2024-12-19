import { useEffect } from "react";
import ModalRight from "components/ModalRight";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "./style.scss";
import ValidatedInput from "components/forms/ValidatedInput";
import {
  selectCurrentUser,
  selectUserAssignedLocation,
  selectUserLocation,
} from "store/slice/AuthSlice";
import { useAppSelector } from "store/store.hooks";
import { useGetLocationsQuery } from "services";
import MultipleSelectField from "components/forms/MultipleSelectField";

export type CreateStaffFeilds = {
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  location_ids?: string[];
};

type IStaff = {
  name: string;
  email: string;
  phone: string;
  id?: number;
  location_ids?: string[];
};

interface IProp {
  setShowModal: () => void;
  showModal: boolean;
  activeStaff: IStaff;
  addMoreStaff: (value: IStaff[]) => void;
  staffList: IStaff[];
}

const EditStaffModal = ({
  setShowModal,
  showModal,
  activeStaff,
  staffList,
  addMoreStaff,
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

  const onSubmit: SubmitHandler<CreateStaffFeilds> = async (data) => {
    const list = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      locations_ids: data.location_ids,
    };

    let newList = [...staffList];
    const result: IStaff[] = newList.map((item, i) => {
      if (i == activeStaff.id) {
        item = list;
      }
      return item;
    });

    addMoreStaff(result);
    setShowModal();
  };

  const {
    formState: { isValid },
    handleSubmit,
    setValue,
  } = methods;

  useEffect(() => {
    if (activeStaff.name && activeStaff.email && activeStaff.phone) {
      const firstName = activeStaff.name.split(" ")[0];
      const lastName = activeStaff.name.split(" ")[1];
      setValue("phone", activeStaff.phone, { shouldValidate: true });
      setValue("email", activeStaff.email, { shouldValidate: true });
      setValue("firstName", firstName, { shouldValidate: true });
      setValue("lastName", lastName, { shouldValidate: true });
      setValue("location_ids", activeStaff?.location_ids);
    }
  }, [activeStaff]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="add-modal">
        <ModalRight closeModal={setShowModal} openModal={showModal}>
          <div className="modal_right_children">
            <div className="top_section">
              <ModalRightTitle
                className="add-modal__right-title"
                closeModal={setShowModal}
                title="Edit Staff Details"
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

            <div className="bottom_section add-modal__footer">
              <div>
                <button onClick={setShowModal}>Cancel</button>
                <button type="submit" disabled={!isValid}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </ModalRight>
      </form>
    </FormProvider>
  );
};

export default EditStaffModal;

import { useState } from "react";
import Button from "@mui/material/Button";
import { Skeleton, CircularProgress, IconButton } from "@mui/material";
import EmptyResponse from "components/EmptyResponse";

import { ChevronRight } from "assets/Icons/ChevronRight";
import { TrashIcon } from "assets/Icons/TrashIcon";

import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import ErrorMsg from "components/ErrorMsg";
import MessageModal from "components/Modal/MessageModal";

import { CreatePickupModal } from "./CreatePickupModal";
import { selectUserLocation } from "store/slice/AuthSlice";
import { useAppSelector, showToast } from "store/store.hooks";
import { handleError } from "utils";

import {
  useGetPickupLocationQuery,
  useDeletePickupLocationMutation,
} from "services";
import { PickupLocationType } from "services/api.types";

type ModalProps = {
  openModal: boolean;
  closeModal: () => void;
  type: string;
};

export const PickupModal = ({ openModal, closeModal, type }: ModalProps) => {
  const userLocation = useAppSelector(selectUserLocation);
  const { data, isLoading, isFetching, isError } = useGetPickupLocationQuery();
  const [deletePickup, { isLoading: loadDelete }] =
    useDeletePickupLocationMutation();

  const [selectedLocation, setSelectedLocation] =
    useState<PickupLocationType | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const deleteProductFnc = async () => {
    if (selectedLocation) {
      try {
        let result = await deletePickup(`${selectedLocation?.id}`);

        if ("data" in result) {
          showToast("Deleted successfully", "success");
          setOpenDeleteModal(false);
          setSelectedLocation(null);
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  return (
    <>
      <ModalRight
        closeOnOverlayClick={false}
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children automated_shipping_modal pickup_modal">
          <div className="top_section" id="scroller_top">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              title={"Pick-up Location"}
              extraChild={
                type === "dispatch" ? (
                  data?.data &&
                  data.data.filter((item) => {
                    if (type === "dispatch") {
                      return item.is_dispatch === 1;
                    }
                  }).length >= 1 ? (
                    ""
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => {
                        setOpenAddModal(true);
                      }}
                      className="primary_styled_button"
                    >
                      Add
                    </Button>
                  )
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setOpenAddModal(true);
                    }}
                    className="primary_styled_button"
                  >
                    Add
                  </Button>
                )
              }
            />

            <div className="display_pickup_location">
              <div className="location_container">
                {(isLoading || isFetching) &&
                  [1, 2, 3, 4].map((item) => (
                    <Skeleton key={item} height={60} />
                  ))}

                {isError && !isLoading && (
                  <ErrorMsg error={"Something went wrong"} />
                )}

                {!isLoading && !isFetching && !isError ? (
                  data &&
                  data?.data?.filter((item) => {
                    if (type === "dispatch") {
                      return item.is_dispatch === 1;
                    } else {
                      return item.is_dispatch !== 1;
                    }
                  })?.length ? (
                    <>
                      <h3 className="store_location">{userLocation?.name}</h3>
                      <div className="listed_locations">
                        {data?.data
                          ?.filter((item) => {
                            if (type === "dispatch") {
                              return item.is_dispatch === 1;
                            } else {
                              return item.is_dispatch !== 1;
                            }
                          })
                          ?.map((item) => (
                            <div
                              onClick={() => {
                                setSelectedLocation(item);
                                setOpenAddModal(true);
                              }}
                              className="single_dispatch_location"
                            >
                              <div className="text_box">
                                <p className="bold">{item.address}</p>
                                <p>{item.phone}</p>
                              </div>

                              <div className="flex gap-2">
                                <IconButton
                                  onClick={() => {
                                    setOpenAddModal(true);
                                  }}
                                >
                                  <ChevronRight />
                                </IconButton>

                                <IconButton
                                  onClick={(e) => {
                                    setOpenDeleteModal(true);
                                    setSelectedLocation(item);
                                    e.stopPropagation();
                                  }}
                                >
                                  <TrashIcon />
                                </IconButton>
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  ) : (
                    <EmptyResponse message=" Pickup List is Empty" />
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </ModalRight>

      <CreatePickupModal
        openModal={openAddModal}
        type={type}
        editFields={selectedLocation}
        setEditField={(val) => setSelectedLocation(val)}
        closeModal={() => {
          setOpenAddModal(false);
          setSelectedLocation(null);
        }}
      />

      <MessageModal
        openModal={openDeleteModal}
        closeModal={() => {
          setOpenDeleteModal(false);
          setSelectedLocation(null);
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
        description="Are you sure you want to delete?"
      />
    </>
  );
};

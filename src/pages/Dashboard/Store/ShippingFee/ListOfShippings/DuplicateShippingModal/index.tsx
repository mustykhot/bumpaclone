import Modal from "components/Modal";
import { useState } from "react";
import Button from "@mui/material/Button";
import "./style.scss";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import {
  Checkbox,
  CircularProgress,
  IconButton,
  Skeleton,
} from "@mui/material";
import { XIcon } from "assets/Icons/XIcon";

import { useDuplicateShippingMutation, useGetLocationsQuery } from "services";
import ErrorMsg from "components/ErrorMsg";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import { selectUserLocation } from "store/slice/AuthSlice";
type Props = {
  openModal: boolean;
  closeModal: () => void;
  shippingList: string[] | number[];
  setSelected: (val: string[] | number[]) => void;
};

export const DuplicateShippingModal = ({
  closeModal,
  openModal,
  shippingList,
  setSelected,
}: Props) => {
  const { data, isLoading, isError } = useGetLocationsQuery();
  const userLocation = useAppSelector(selectUserLocation);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [duplicateShipping, { isLoading: loadDuplicate }] =
    useDuplicateShippingMutation();

  const duplicateShippingFnc = async () => {
    try {
      let result = await duplicateShipping({
        location_ids: selectedLocation,
        shipping_ids: shippingList,
      });
      if ("data" in result) {
        showToast("Duplicated successfully", "success");
        setSelectedLocation([]);
        setSelected([]);
        closeModal();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleClick = (id: string) => {
    if (selectedLocation.includes(id)) {
      let filtered = selectedLocation.filter((item) => item !== id);
      setSelectedLocation(filtered);
    } else {
      setSelectedLocation((prev) => [...prev, id]);
    }
  };
  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={() => {
          closeModal();
          setSelectedLocation([]);
        }}
      >
        <div className="duplicate_shipping_modal_container">
          <div className="title_section">
            <div className="text_side">
              <div className="title_block">
                <h4>Duplicate Shipping Methods</h4>
                <IconButton
                  type="button"
                  onClick={() => {
                    closeModal();
                    setSelectedLocation([]);
                  }}
                  className="icon_button_container"
                >
                  <XIcon />
                </IconButton>
              </div>
              <div className="explain">
                <InfoCircleIcon />
                <p>
                  Select the locations you want you want the shipping methods
                  duplicated to
                </p>
              </div>
            </div>
          </div>
          <div className="cover_container">
            <>
              {isLoading &&
                [1, 2, 3, 4].map((item) => (
                  <Skeleton
                    key={item}
                    animation="wave"
                    width={"100%"}
                    height={"100%"}
                  />
                ))}
              {isError && !isLoading && !data && (
                <ErrorMsg message="Something went wrong" />
              )}
              {data && !isError && !isLoading
                ? data?.data
                    ?.filter((item) => item?.id !== userLocation?.id)
                    ?.map((item) => (
                      <div
                        onClick={() => {
                          handleClick(`${item.id}`);
                        }}
                        className="single_location"
                      >
                        <Checkbox
                          checked={selectedLocation.includes(`${item.id}`)}
                        />
                        <p>{item.name}</p>
                      </div>
                    ))
                : ""}
            </>
          </div>
          <div className="button_section">
            <Button
              disabled={
                isLoading ||
                loadDuplicate ||
                isError ||
                !selectedLocation.length
              }
              className={`add ${
                isLoading ||
                loadDuplicate ||
                isError ||
                !selectedLocation.length
                  ? "disable"
                  : ""
              }`}
              variant="contained"
              onClick={() => {
                duplicateShippingFnc();
              }}
            >
              {loadDuplicate ? (
                <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

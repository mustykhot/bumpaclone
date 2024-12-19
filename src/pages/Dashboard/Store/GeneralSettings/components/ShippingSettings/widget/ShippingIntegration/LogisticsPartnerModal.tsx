import { useEffect, useState } from "react";

import { Box, Tab, Button, Tabs, Skeleton } from "@mui/material";

import { SearchIcon } from "assets/Icons/SearchIcon";

import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import EmptyResponse from "components/EmptyResponse";
import { Toggle } from "components/Toggle";
import InputField from "components/forms/InputField";
import ErrorMsg from "components/ErrorMsg";

import {
  selectShipbubbleSettingsUpdateField,
  updateShipbubbleShippingSettingState,
} from "store/slice/ShippingSettingsSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { useGetShipbubbleCourierQuery } from "services";

import "./style.scss";

type ModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

type courierResultType = {
  name: string;
  pin_image: string;
  service_code: string;
  origin_country: string;
  international: boolean;
  domestic: boolean;
  on_demand: boolean;
  status: string;
};

const tabList = [
  { label: "Local", value: "local" },
  { label: "International", value: "international" },
];

export const LogisticsPartnerModal = ({
  openModal,
  closeModal,
}: ModalProps) => {
  const dispatch = useAppDispatch();
  const shipbubbleShippingSettingsUpdateFields = useAppSelector(
    selectShipbubbleSettingsUpdateField
  );

  const [tab, setTab] = useState<"local" | "international">("local");
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [resultToDisplay, setResultToDisplay] = useState<courierResultType[]>(
    []
  );
  const [searchedResult, setSearchedResult] = useState<courierResultType[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const { data, isLoading, isFetching, isError } =
    useGetShipbubbleCourierQuery();

  const handleSearch = (val: string) => {
    setSearchValue(val);
    if (val) {
      let filtered = data?.data?.filter((item) =>
        item.name.toLowerCase().includes(val.toLowerCase())
      );
      setSearchedResult(filtered || []);
    } else {
      setSearchedResult(data?.data || []);
    }
  };

  const handleChangeTab = (
    event: React.SyntheticEvent,
    newValue: "local" | "international"
  ) => {
    setTab(newValue);
  };

  useEffect(() => {
    if (data) {
      setSearchedResult(data?.data);
    }
  }, [data]);

  useEffect(() => {
    if (tab === "international") {
      let filteredList = searchedResult?.filter((item) => item.international);
      setResultToDisplay(filteredList || []);
    } else {
      let filteredList = searchedResult?.filter((item) => !item.international);
      setResultToDisplay(filteredList || []);
    }
  }, [tab, searchedResult]);

  return (
    <>
      <ModalRight
        closeOnOverlayClick={false}
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children automated_shipping_modal partner_modal">
          <div className="top_section" id="scroller_top">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              title={"Logistics Partners"}
              children={
                <p className="modal_description">
                  Select the logistics partners you’d like to work with.
                </p>
              }
            />

            <div className="display_partners">
              <div className="tab_container">
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={tab}
                    onChange={handleChangeTab}
                    variant="scrollable"
                    scrollButtons={false}
                  >
                    {tabList.map((item, i) => (
                      <Tab key={i} value={item.value} label={item.label} />
                    ))}
                  </Tabs>
                </Box>
              </div>

              <div className="partner_container">
                <div className="display_local_partner">
                  <InputField
                    value={searchValue}
                    placeholder="Search"
                    onChange={(e) => {
                      handleSearch(e.target.value);
                    }}
                    suffix={<SearchIcon />}
                  />

                  <div className="partner_list">
                    <div className="all_partner partner_flex">
                      <p>Use all Partners</p>
                      <Toggle
                        toggled={isAllSelected}
                        handlelick={() => {
                          if (isAllSelected) {
                            setIsAllSelected(false);
                            dispatch(
                              updateShipbubbleShippingSettingState({
                                couriers: [],
                              })
                            );
                          } else {
                            setIsAllSelected(true);
                            dispatch(
                              updateShipbubbleShippingSettingState({
                                couriers: resultToDisplay?.map(
                                  (item) => item.service_code
                                ),
                              })
                            );
                          }
                        }}
                      />
                    </div>

                    <>
                      {isError && <ErrorMsg error="Something went wrong" />}

                      {isLoading && !isError && (
                        <>
                          {[1, 2, 3].map((item) => (
                            <Skeleton height={30} />
                          ))}
                        </>
                      )}

                      {!isLoading && !isError ? (
                        resultToDisplay?.length ? (
                          <>
                            {resultToDisplay?.map((item) => (
                              <div className={`partner_flex`}>
                                <div className="courier-name">
                                  <img src={item.pin_image} alt="partner" />
                                  <p>{item.name}</p>
                                </div>

                                <Toggle
                                  toggled={shipbubbleShippingSettingsUpdateFields?.couriers?.includes(
                                    item.service_code
                                  )}
                                  handlelick={() => {
                                    if (
                                      shipbubbleShippingSettingsUpdateFields?.couriers?.includes(
                                        item.service_code
                                      )
                                    ) {
                                      let newList =
                                        shipbubbleShippingSettingsUpdateFields?.couriers?.filter(
                                          (courier) =>
                                            courier !== item.service_code
                                        );

                                      dispatch(
                                        updateShipbubbleShippingSettingState({
                                          couriers: newList,
                                        })
                                      );
                                    } else {
                                      dispatch(
                                        updateShipbubbleShippingSettingState({
                                          couriers: [
                                            ...shipbubbleShippingSettingsUpdateFields?.couriers,
                                            item.service_code,
                                          ],
                                        })
                                      );
                                    }
                                  }}
                                />
                              </div>
                            ))}
                          </>
                        ) : (
                          <EmptyResponse message=" Courier List is Empty" />
                        )
                      ) : (
                        ""
                      )}
                    </>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bottom_section">
            <Button type="button" className="save" onClick={closeModal}>
              Save changes
            </Button>
          </div>
        </div>
      </ModalRight>
    </>
  );
};

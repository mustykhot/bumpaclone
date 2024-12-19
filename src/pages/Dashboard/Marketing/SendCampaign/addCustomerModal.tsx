import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Button from "@mui/material/Button/Button";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import Chip from "@mui/material/Chip";
import { CircularProgress, IconButton, Skeleton } from "@mui/material";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { WarningIcon } from "assets/Icons/WarningIcon";
import { EditIcon } from "assets/Icons/EditIcon";
import { ChevronRight } from "assets/Icons/ChevronRight";
import { PlusIcon } from "assets/Icons/PlusIcon";
import InputField from "components/forms/InputField";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import Loader from "components/Loader";
import { useGetCustomersQuery } from "services";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  selectCustomerRecipient,
  selectSelectedAll,
  setCustomerRecipient,
  setSelectedAll,
} from "store/slice/CampaignSlice";
import { CreateCustomerModal } from "pages/Dashboard/Orders/widgets/customer/CreateCustomer";
import { BootstrapTooltip } from "pages/Dashboard/Transactions/TransactionHistoryTable";
import InvalidCustomersModal from "./InvalidCustomers";
import { isIdInList } from "utils";

type AddCustomerModalProps = {
  openModal: boolean;
  closeModal: () => void;
  reset: boolean;
  type: string;
  setSelectedIdsState: (ids: any[]) => void; // Function to update ArrayIds
  selectedIdsState: any[];
};

export type ICustomer = {
  name: string;
  checked: boolean;
  customer: string;
  valid: boolean;
  id: string;
};

export const AddCustomerModal = ({
  openModal,
  closeModal,
  reset,
  type,
  setSelectedIdsState,
  selectedIdsState,
}: AddCustomerModalProps) => {
  const [search, setSearch] = useState("");
  const [checkList, setCheckList] = useState([]);
  const [checkedArray, setCheckedArray] = useState<ICustomer[]>([]);
  const [openCreateCustomer, setOpenCreateCustomer] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const [customerId, setCustomerId] = useState<string | undefined>();
  const [selectedIds, setSelectedIds] = useState<any>();
  const [dataCount, setDataCount] = useState(15);
  const [hasMore, setHasMore] = useState(true);

  const location = useLocation();
  const customerRecipient = useAppSelector(selectCustomerRecipient);
  const selectedAll = useAppSelector(selectSelectedAll);

  const navigate = useNavigate();

  const state = location.state;
  const { data, isLoading } = useGetCustomersQuery({
    limit: dataCount,
    page: 1,
    search: search,
  });

  const dispatch = useAppDispatch();
  const handleSelected = (val: ICustomer, checked: boolean) => {
    const value = val;
    const newList = [...checkList];
    let newSelectedValues = [...checkedArray];
    let selectedIds = [...selectedIdsState];

    newList &&
      newList?.map((item: ICustomer) => {
        if (item.id === value.id) {
          if (checked) {
            newSelectedValues.push(item);
            // @ts-ignore
            selectedIds.push(item.id);
          } else {
            const newArray = newSelectedValues.filter(
              (item) => item.id !== value.id
            );
            newSelectedValues = newArray;
            // @ts-ignore
            selectedIds = selectedIds.filter((id) => id !== item?.id);
          }
        }
        return item;
      });

    setCheckedArray(newSelectedValues);
    setSelectedIdsState(selectedIds);
  };
  const handleSubmit = () => {
    dispatch(setCustomerRecipient([...customerRecipient, ...checkedArray]));
    closeModal();
  };

  const closeAllModals = () => {
    setIsEdit(false);
    setOpenCreateCustomer(false);
    setCustomerId(undefined);
  };

  const fetchMoreData = () => {
    setDataCount(dataCount + 15);
  };

  useEffect(() => {
    if (data) {
      const list: any = [];
      data?.customers?.data.map((item) => {
        if (type === "sms" && item.phone) {
          list.push({
            name: item.phone,
            checked: false,
            customer: item.name,
            valid: item.phone_valid,
            id: item.id,
          });
        } else if (type === "email" && item.email) {
          list.push({
            name: item.email,
            checked: false,
            customer: item.name,
            valid: item.email_valid,
            id: item.id,
          });
        }
      });
      setCheckList(list);
      // @ts-ignore
      setHasMore(data?.customers?.total > data?.customers?.data.length);
    }
  }, [data, type]);

  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children">
          <div className="top_section" id="scroller_top">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              className="remove_border"
              title="Add Customers"
              extraChild={
                <Button
                  variant="outlined"
                  startIcon={<PlusIcon stroke="#009444" />}
                  type="button"
                  onClick={() => {
                    setOpenCreateCustomer(true);
                  }}
                >
                  Add Customer
                </Button>
              }
            />
            {/* if type is phone and phonelist show, if type is email and email list */}

            {isLoading &&
              [1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => (
                <div className="loading_box" key={i}>
                  <div className="left_box">
                    <Skeleton animation="wave" width={"100%"} height={"100%"} />
                  </div>
                  <div className="right_box">
                    <div className="top_right_box">
                      <Skeleton animation="wave" width={"100%"} height={20} />
                    </div>
                  </div>
                </div>
              ))}

            {!isLoading && (
              <div>
                <div className="pd_select_customer">
                  <InputField
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    placeholder="Search"
                    containerClass="search_field"
                    suffix={<SearchIcon />}
                  />
                  <div className="select_box">
                    <Chip
                      color="info"
                      label={
                        selectedAll
                          ? `${
                              type === "sms"
                                ? // @ts-ignore
                                  data?.customers?.total -
                                  // @ts-ignore
                                  data?.campaignParams?.invalidPhonesCount
                                : type === "email"
                                ? // @ts-ignore
                                  data?.customers?.total -
                                  // @ts-ignore
                                  data?.campaignParams?.invalidEmailsCount
                                : data?.customers?.total // Fallback in case type is neither "sms" nor "email"
                            } selected`
                          : `${checkedArray?.length} Selected`
                      }
                    />
                    {checkedArray?.length || selectedAll ? (
                      <Button
                        onClick={() => {
                          setCheckedArray([]);
                          dispatch(setSelectedAll(false));
                        }}
                      >
                        Unselect all
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          dispatch(setSelectedAll(true));
                        }}
                      >
                        Select all
                      </Button>
                    )}
                  </div>

                  <div className="customer_list">
                    {selectedAll === true &&
                    ((type === "email" &&
                      // @ts-ignore
                      data?.campaignParams?.invalidEmailsCount > 0) ||
                      (type === "sms" &&
                        // @ts-ignore
                        data?.campaignParams?.invalidPhonesCount > 0)) ? (
                      <div
                        className="warning"
                        onClick={() => setShowInvalidModal(true)}
                      >
                        <div className="left_side">
                          <WarningIcon className="WarningIcon" />
                          <span>
                            {type === "sms"
                              ? // @ts-ignore
                                `${data?.campaignParams?.invalidPhonesCount} customers are not selected due to an invalid phone number. Click here to see affected customers`
                              : // @ts-ignore
                                `${data?.campaignParams?.invalidEmailsCount} customers are not selected due to an invalid email address. Click here to see affected customers`}
                          </span>
                        </div>
                        <div className="right_side">
                          <ChevronRight />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {checkList.length ? (
                      <InfiniteScroll
                        dataLength={checkList.length} // data length should match the checkList
                        next={fetchMoreData}
                        scrollableTarget={"scroller_top"}
                        hasMore={hasMore}
                        loader={
                          <div className="loading_state">
                            <CircularProgress
                              size="1.5rem"
                              sx={{ color: "#009444" }}
                            />
                          </div>
                        }
                      >
                        {checkList.map((item: ICustomer, i: number) => (
                          <div key={i} className="single_customer">
                            <div className="name_box">
                              <Checkbox
                                checked={
                                  isIdInList(checkedArray, item.id) ||
                                  (selectedAll && item.valid)
                                }
                                onChange={(e) => {
                                  setSelectedIds(item.id);
                                  handleSelected(item, e.target.checked);
                                }}
                                disabled={!item.valid}
                              />
                              <div>
                                <div className="flex">
                                  <p>{item.name}</p>
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
                                    title={
                                      !item.valid
                                        ? type === "sms"
                                          ? "This customer has an incorrect phone number"
                                          : type === "email"
                                          ? "This customer has an incorrect email"
                                          : undefined
                                        : undefined
                                    }
                                    placement="top"
                                  >
                                    <div className="warning-tip">
                                      {!item.valid && <WarningIcon />}
                                    </div>
                                  </BootstrapTooltip>
                                </div>

                                <p className="customer-name">{item.customer}</p>
                              </div>
                            </div>
                            {!item.valid && (
                              <Button
                                className="disabled_edit"
                                onClick={(e) => {
                                  setIsEdit(true);
                                  setCustomerId(item.id);
                                  setOpenCreateCustomer(true);
                                  e.stopPropagation();
                                }}
                              >
                                <EditIcon />
                                Edit
                              </Button>
                            )}
                          </div>
                        ))}
                      </InfiniteScroll>
                    ) : null}
                  </div>
                </div>
                <div className="bottom_section">
                  <Button
                    type="button"
                    className="cancel"
                    onClick={() => {
                      setCheckedArray([]);
                      dispatch(setCustomerRecipient([]));
                      closeModal();
                    }}
                  >
                    Cancel
                  </Button>
                  {selectedAll ? (
                    <Button
                      disabled={!selectedAll}
                      type="button"
                      className="save"
                      onClick={handleSubmit}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      disabled={!checkedArray.length}
                      type="button"
                      className="save"
                      onClick={handleSubmit}
                    >
                      Continue
                    </Button>
                  )}
                </div>{" "}
              </div>
            )}
          </div>
        </div>
      </ModalRight>

      {openCreateCustomer && (
        <CreateCustomerModal
          openModal={openCreateCustomer}
          closeModal={() => {
            closeAllModals();
          }}
          id={customerId}
          isEdit={isEdit}
        />
      )}

      {showInvalidModal && (
        <InvalidCustomersModal
          openModal={showInvalidModal}
          closeModal={() => setShowInvalidModal(false)}
          type={type}
        />
      )}
    </>
  );
};

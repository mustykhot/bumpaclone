import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button/Button";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import Chip from "@mui/material/Chip";
import { CircularProgress, Skeleton } from "@mui/material";
import { SearchIcon } from "assets/Icons/SearchIcon";
import InputField from "components/forms/InputField";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";

import {
  useGetCustomerGroupsQuery,
  useGetInvalidCustomersQuery,
  useLazyGetInvalidCustomersQuery,
} from "services";
import Loader from "components/Loader";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  selectCustomerRecipient,
  selectGroupRecipient,
  setCustomerRecipient,
  setGroupRecipient,
} from "store/slice/CampaignSlice";
import InvalidCustomerGroup from "./InvalidCustomers/InvalidCustomerGroup";
import {
  selectCustomerFilters,
  addCustomerFilter,
} from "store/slice/FilterSlice";

type AddCustomerGroupModalProps = {
  openModal: boolean;
  closeModal: () => void;
  reset: boolean;
  type: string;
  setSelectedIdsState: (ids: any[]) => void;
  selectedIdsState: number[];
};

export interface InvalidCustomerResponse {
  total: number;
  invalidEmailsCount: number;
  invalidPhonesCount: number;
  invalidEmails: string[];
  invalidPhones: string[];
}

type IGroup = {
  name: string;
  checked: boolean;
  customers: any;
  id: number[];
  count: number;
};
export const AddCustomerGroupModal = ({
  openModal,
  closeModal,
  reset,
  type,
  setSelectedIdsState,
  selectedIdsState,
}: AddCustomerGroupModalProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [checkList, setCheckList] = useState<any[]>([]);
  const [checkedArray, setCheckedArray] = useState<string[]>([]);
  const [customerList, setCustomerList] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[] | number>([]);
  const customerRecipient = useAppSelector(selectCustomerRecipient);
  const [dataCount, setDataCount] = useState(15);
  const [invalidDataCount, setInvalidDataCount] = useState(15);
  const [page, setPage] = useState(1);
  const customerFilters = useAppSelector(selectCustomerFilters);
  const { data, isLoading, isFetching } = useGetCustomerGroupsQuery({
    search: customerFilters?.search,
    limit: dataCount,
    page: page,
  });
  const [invalidList, setInvalidList] = useState<any[]>([]);
  const [invalidCount, setInvalidCount] = useState(0);
  const [showInvalidList, setShowInvalidList] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreInvalid, setHasMoreInvalid] = useState(true);
  const groupRecipient = useAppSelector(selectGroupRecipient);

  const [getInvalid, { data: invalid, error, isLoading: isLoadingInvalid }] =
    useLazyGetInvalidCustomersQuery();

  const dispatch = useAppDispatch();

  const fetchMoreData = () => {
    setPage(page + 1);
  };

  const fetchMoreInvalidData = () => {
    alert("more");
    setInvalidDataCount(invalidDataCount + 15);
  };

  const handleSelected = (val: IGroup, checked: boolean) => {
    const value = val;
    const newList = [...checkList];
    let newSelectedValues = [...checkedArray];
    let customerCheckedList = [...customerList];
    let selectedIds = [...selectedIdsState];

    newList.map((item: IGroup) => {
      if (item.name === value.name) {
        if (checked) {
          newSelectedValues.push(item?.name);
          customerCheckedList.push(item);
          // @ts-ignore
          selectedIds.push(item.id);
        } else {
          newSelectedValues = newSelectedValues.filter(
            (name) => name !== value.name
          );
          customerCheckedList = customerCheckedList.filter(
            (item: IGroup) => item.name !== value.name
          );
          // @ts-ignore
          selectedIds = selectedIds.filter((id) => id !== item?.id);
        }
      }
      return item;
    });

    setCheckedArray(newSelectedValues);
    setCustomerList(customerCheckedList);
    setSelectedIdsState(selectedIds);
  };

  const proceedSelect = () => {
    dispatch(setGroupRecipient(checkedArray));
    const uniqueCustomerDetails: any = new Set();

    customerList.forEach((item: any) => {
      item.customers.forEach((customer: any) => {
        if (type === "email") {
          if (customer.email) {
            uniqueCustomerDetails.add(customer?.email);
          }
        } else {
          if (customer.phone) {
            uniqueCustomerDetails.add(customer?.phone);
          }
        }
      });
    });
    const customerDetails: string[] = Array.from(uniqueCustomerDetails);
    closeModal();
  };
  const handleSubmit = async () => {
    if (selectedIdsState.length > 0) {
      try {
        const response: InvalidCustomerResponse = await getInvalid({
          customerGroups: selectedIdsState,
          limit: invalidDataCount,
          page: 1,
        }).unwrap();
        if (response.total > 0) {
          if (type === "email") {
            // @ts-ignore
            setInvalidList(response.invalidEmails.data);
            setInvalidCount(response.invalidEmailsCount);
            setHasMoreInvalid(
              response.invalidEmailsCount > response.invalidEmails.length
            );
            // @ts-ignore
            if (response.invalidEmails.data.length > 0) {
              setShowInvalidList(true);
            } else {
              proceedSelect();
            }
          } else if (type === "sms") {
            // @ts-ignore
            setInvalidList(response.invalidPhones.data);
            setInvalidCount(response.invalidPhonesCount);
            setHasMoreInvalid(
              response.invalidPhonesCount > response.invalidPhones.length
            );
            // @ts-ignore
            if (response.invalidPhones.data.length > 0) {
              setShowInvalidList(true);
            } else {
              proceedSelect();
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch invalid customers:", err);
      }
    }
  };

  useEffect(() => {
    if (data) {
      const list: any = [];
      if (page === 1) {
        // @ts-ignore
        [...data?.groups?.data, ...data?.default]?.forEach((item) => {
          list.push({
            name: item.name,
            customers: item.customers ? item.customers : [],
            checked: false,
            id: item.id,
            count: item.customers_count,
          });
        });
      } else {
        // @ts-ignore
        data?.groups?.data?.forEach((item) => {
          list.push({
            name: item.name,
            customers: item.customers ? item.customers : [],
            checked: false,
            id: item.id,
            count: item.customers_count,
          });
        });
      }
      // @ts-ignore
      setHasMore(!!data?.groups?.next_page_url);
      if (page === 1) {
        setCheckList(list);
      } else {
        setCheckList((prev) => [...prev, ...list]);
      }
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
              title="Add Customer Groups "
            />
            {isLoading &&
              [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="loading_box">
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
                    value={customerFilters?.search}
                    onChange={(e: any) => {
                      dispatch(
                        addCustomerFilter({
                          page: 1,
                          search: e.target.value,
                        })
                      );
                    }}
                    placeholder="Search"
                    containerClass="search_field"
                    suffix={<SearchIcon />}
                  />
                  <div className="select_box">
                    <Chip
                      color="info"
                      label={`${checkedArray.length} Selected`}
                    />
                    {checkedArray?.length ? (
                      <Button
                        onClick={() => {
                          setCheckedArray([]);
                          dispatch(setGroupRecipient([]));
                        }}
                      >
                        Unselect
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="customer_list">
                    <InfiniteScroll
                      dataLength={checkList?.length || 0}
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
                      {checkList.length > 0 ? (
                        checkList.map((item: IGroup, i: number) => {
                          if (item?.count) {
                            return (
                              <div key={i} className="single_customer">
                                <div className="name_box">
                                  <Checkbox
                                    checked={checkedArray?.includes(item.name)}
                                    onChange={(e) => {
                                      setSelectedIds(item.id);
                                      handleSelected(item, e.target.checked);
                                    }}
                                  />
                                  <p>{item.name}</p>
                                </div>
                                <p className="count">{item?.count} Customers</p>
                              </div>
                            );
                          }
                          return null;
                        })
                      ) : (
                        <p>No customer group found.</p>
                      )}
                    </InfiniteScroll>
                  </div>
                </div>
                <div className="bottom_section">
                  <Button
                    type="button"
                    className="cancel"
                    onClick={() => {
                      setCheckedArray([]);
                      dispatch(setGroupRecipient([]));
                      closeModal();
                    }}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    disabled={!checkedArray.length}
                    type="button"
                    className="save"
                    onClick={handleSubmit}
                    loading={isLoadingInvalid}
                  >
                    Continue
                  </LoadingButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </ModalRight>
      {showInvalidList && (
        <InvalidCustomerGroup
          openModal={showInvalidList}
          closeModal={() => setShowInvalidList(false)}
          type={type}
          invalidCount={invalidCount}
          invalidList={invalidList}
          proceed={proceedSelect}
          hasMore={hasMoreInvalid}
          fetchMoreInvalidData={fetchMoreInvalidData}
        />
      )}
    </>
  );
};

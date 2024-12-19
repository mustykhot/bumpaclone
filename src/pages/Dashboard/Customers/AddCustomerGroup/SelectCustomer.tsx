import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { Checkbox, Chip, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { useFormContext } from "react-hook-form";
import { useGetCustomerGroupsQuery, useGetCustomersQuery } from "services";
import InputField from "components/forms/InputField";
import { SearchIcon } from "assets/Icons/SearchIcon";
import "./style.scss";
import { CreateCustomerModal } from "pages/Dashboard/Orders/widgets/customer/CreateCustomer";
import EmptyResponse from "components/EmptyResponse";
import { LoadingProductBox } from "pages/Dashboard/Orders/widgets/product/SelectProductModal";
import ErrorMsg from "components/ErrorMsg";
import InfiniteScroll from "react-infinite-scroll-component";
import { MAil02Icon } from "assets/Icons/Mail02Icon";
import { PhoneIcon } from "assets/Icons/PhoneIcon";
import { removeFirstZero } from "utils";
import { useAppSelector } from "store/store.hooks";
import { BootstrapTooltip } from "pages/Dashboard/Transactions/TransactionHistoryTable";
import { WarningIcon } from "assets/Icons/WarningIcon";
import { EditIcon } from "assets/Icons/EditIcon";

export type SelectedType = {
  name: string;
  id: string | number;
};
type CustomerModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const SelectCustomerModal = ({
  openModal,
  closeModal,
}: CustomerModalProps) => {
  const [openCreateCustomer, setOpenCreateCustomer] = useState(false);
  const [selected, setSelected] = useState<SelectedType[] | []>([]);
  const { watch, setValue } = useFormContext();
  const [searchCustomers, setSearchCustomers] = useState("");
  const [activityList, setActivityList] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [dataCount, setDataCount] = useState(25);
  const [customerId, setCustomerId] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetCustomersQuery({
      limit: dataCount,
      page: 1,
      search: searchCustomers,
    });
  const addCustomerToForm = () => {
    setValue("customers", selected);
    closeModal();
  };
  const updateSelected = (item: SelectedType) => {
    const index = selected.findIndex(
      (el: SelectedType) => `${el.id}` === `${item.id}`
    );
    if (index !== -1) {
      const updated = [...selected];
      updated.splice(index, 1);
      setSelected(updated);
    } else {
      setSelected((prev) => [...prev, { name: item.name, id: `${item.id}` }]);
    }
  };

  const fetchMoreData = () => {
    setPage(page + 1);
    setDataCount(dataCount + 30);
  };

  const closeAllModals = () => {
    setIsEdit(false);
    setOpenCreateCustomer(false);
    setCustomerId(undefined);
  };

  useEffect(() => {
    if (data) {
      let list: any = data?.customers?.data;
      if (searchCustomers) {
        if (page === 1) {
          refetch();
          setActivityList(list);
        } else {
          setActivityList((prev) => [...prev, ...list]);
        }
      } else {
        if (page === 1) {
          setActivityList(list);
        } else {
          refetch();
          setActivityList((prev) => [...prev, ...list]);
        }
      }
    }
  }, [data, searchCustomers, page]);

  useEffect(() => {
    if (!isFetching && data) {
      let list = data?.customers?.data || [];

      if (page === 1) {
        setActivityList(list);
      } else {
        setActivityList((prev) => [...prev, ...list]);
      }
    }
  }, [isFetching, data, page]);

  useEffect(() => {
    if (watch("customers")) {
      setSelected(watch("customers"));
    }
  }, [watch("customers")]);
  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children pd_select_customer_modal_box">
          <div className="top_section" id="scroller_top">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              className="remove_border"
              title="Select Customers"
              extraChild={
                <Button
                  variant="outlined"
                  startIcon={<PlusIcon stroke="#009444" />}
                  onClick={() => {
                    setOpenCreateCustomer(true);
                  }}
                >
                  Add Customer
                </Button>
              }
            >
              <div className="search_field_box">
                <InputField
                  type={"text"}
                  containerClass="search_field"
                  value={searchCustomers}
                  onChange={(e: any) => {
                    setSearchCustomers(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search"
                  suffix={<SearchIcon />}
                />
                {selected?.length ? (
                  <Button
                    onClick={() => {
                      setSelected([]);
                    }}
                    className="unselect"
                  >
                    Unselect
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </ModalRightTitle>
            <div className="displayList">
              {isError && <ErrorMsg error={"Something went wrong"} />}

              {!isError && !isLoading ? (
                activityList && activityList?.length ? (
                  <div className="single_related_product">
                    <InfiniteScroll
                      dataLength={activityList?.length}
                      next={fetchMoreData}
                      scrollableTarget={"scroller_top"}
                      hasMore={hasMore}
                      loader={
                        <div className="loading_state">
                          <CircularProgress />
                        </div>
                      }
                    >
                      {activityList.map((item: any) => (
                        <div key={item.id} className="item">
                          <div className="checkbox_of_customers">
                            <Checkbox
                              checked={selected.some(
                                (el: any) => `${el.id}` === `${item.id}`
                              )}
                              onChange={() => {
                                updateSelected(item);
                              }}
                              disabled={!item.email_valid || !item.phone_valid}
                            />
                            <div className="text_name_box">
                              <div className="flex">
                                <p className="name">{item.name}</p>
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
                                    !item.phone_valid
                                      ? "This customer has an incorrect phone number"
                                      : !item.email_valid
                                      ? "This customer has an incorrect email"
                                      : !item.phone_valid || !item.email_valid
                                      ? "This customer has an incorrect email and phone number"
                                      : ""
                                  }
                                  placement="top"
                                >
                                  <div className="warning-tip">
                                    {(!item.email_valid ||
                                      !item.phone_valid) && (
                                      <WarningIcon className="warning_icon" />
                                    )}
                                  </div>
                                </BootstrapTooltip>
                              </div>
                              <div className="chips">
                                {item.phone && (
                                  <Chip
                                    icon={<PhoneIcon />}
                                    label={item.phone}
                                    color="default"
                                    className="chip"
                                    onClick={() => {
                                      window.open(
                                        `https://wa.me/234${removeFirstZero(
                                          item.phone
                                        )}`,
                                        "_blank"
                                      );
                                    }}
                                  />
                                )}
                                {item.email && (
                                  <Chip
                                    icon={<MAil02Icon stroke="#0059DE" />}
                                    label={item.email}
                                    color="info"
                                    className="chip"
                                    onClick={() => {
                                      window.open(
                                        `mailto:${item.email}`,
                                        "_blank"
                                      );
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                            {(!item.email_valid || !item.phone_valid) && (
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
                        </div>
                      ))}
                    </InfiniteScroll>
                  </div>
                ) : (
                  <EmptyResponse message="No customer found " />
                )
              ) : (
                ""
              )}

              {(isLoading || isFetching) &&
                [1, 2, 3, 4].map((item) => {
                  return <LoadingProductBox key={item} />;
                })}
            </div>
          </div>

          <div className=" bottom_section">
            <Button
              type="button"
              className="cancel"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </Button>
            <Button type="button" className="save" onClick={addCustomerToForm}>
              Continue{" "}
            </Button>
          </div>
        </div>
      </ModalRight>
      <CreateCustomerModal
        openModal={openCreateCustomer}
        closeModal={() => {
          closeAllModals();
        }}
        id={customerId}
        isEdit={isEdit}
        refetch={() => refetch()}
      />
    </>
  );
};

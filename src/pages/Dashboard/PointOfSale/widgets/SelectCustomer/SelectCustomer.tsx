import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Button from "@mui/material/Button";
import { Chip, CircularProgress, IconButton } from "@mui/material";

import { PlusIcon } from "assets/Icons/PlusIcon";
import { PhoneIcon } from "assets/Icons/PhoneIcon";
import { MAil02Icon } from "assets/Icons/Mail02Icon";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { BasketIcon } from "assets/Icons/BasketIcon";
import { ClockRewindIcon } from "assets/Icons/ClockRewindIcon";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";

import ModalRight from "components/ModalRight";
import InputField from "components/forms/InputField";
import ErrorMsg from "components/ErrorMsg";
import EmptyResponse from "components/EmptyResponse";
import { LoadingProductBox } from "pages/Dashboard/Orders/widgets/product/SelectProductModal";
import { CreateCustomerModal } from "./CreateCustomer";

import { useGetCustomersQuery } from "services";
import { removeFirstZero } from "utils";
import { useAppDispatch } from "store/store.hooks";
import { addCustomerDetails } from "store/slice/PosSlice";

import "./style.scss";

type SelectedType = {
  name: string;
  id: string;
};

type SelectCustomerProps = {
  openModal: boolean;
  closeModal: () => void;
};
const getAmountOfDays = (createdAt: string) => {
  var date1: any = new Date(createdAt);
  var date2: any = new Date();
  var dateDifferenceInMilliseconds = date2 - date1;
  var differenceInDays = dateDifferenceInMilliseconds / (1000 * 60 * 60 * 24);
  if (differenceInDays < 30) {
    return `${Math.ceil(differenceInDays)} day(s)`;
  } else {
    if (differenceInDays < 365) {
      let divide = differenceInDays / 30;
      return `${Math.round(divide)} month(s)`;
    } else {
      let divide = differenceInDays / 365;
      return `${Math.round(divide)} year(s)`;
    }
  }
};
const SelectCustomer = ({ openModal, closeModal }: SelectCustomerProps) => {
  const [selected, setSelected] = useState<SelectedType>({ name: "", id: "" });
  const [openCreateCustomer, setOpenCreateCustomer] = useState(false);
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [activityList, setActivityList] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching } = useGetCustomersQuery({
    limit: 25,
    page,
    search: search,
  });
  const fetchMoreData = () => {
    if (data?.customers?.last_page === page) {
      setHasMore(false);
    } else {
      setPage(page + 1);
    }
  };
  useEffect(() => {
    if (data) {
      if (search) {
        if (page === 1) {
          let list: any = data?.customers?.data;
          setActivityList(list);
        } else {
          let list: any = data?.customers?.data;
          setActivityList((prev) => [...prev, ...list]);
        }
      } else {
        if (page === 1) {
          let list: any = data?.customers?.data;
          setActivityList(list);
        } else {
          let list: any = data?.customers?.data;
          setActivityList((prev) => [...prev, ...list]);
        }
      }
    }
  }, [data, search]);

  return (
    <>
      <ModalRight openModal={openModal} closeModal={closeModal}>
        <div className="pd_pos_select_customer modal_right_children pd_select_customer_modal_box">
          <div className="top_section " id="scroller_top">
            <div className="customer_header">
              <div className="search_field_box pos_field_box">
                <IconButton
                  className="pos_pad_icon"
                  onClick={() => closeModal()}
                >
                  <BackArrowIcon />
                </IconButton>
                <div className="flex justify-between flex-wrap gap-2 items-center">
                  <p className="header">Select Customer</p>
                  <Button
                    variant={"outlined"}
                    onClick={() => {
                      setOpenCreateCustomer(true);
                    }}
                    startIcon={<PlusIcon stroke="#009444" />}
                  >
                    New Customer
                  </Button>
                </div>

                <InputField
                  type={"text"}
                  containerClass="search_field"
                  name="search"
                  value={search}
                  onChange={(e: any) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by name, phone and email address"
                  suffix={
                    isFetching ? (
                      <CircularProgress
                        size="1.5rem"
                        sx={{ color: "#9BA2AC" }}
                      />
                    ) : (
                      <SearchIcon />
                    )
                  }
                  className="pos_cust_search"
                />
              </div>
            </div>

            <div className="displayList display_pos_cus_list">
              {isError && <ErrorMsg error={"Something went wrong"} />}
              {!isError && !isLoading ? (
                activityList && activityList.length ? (
                  <div className="single_related_product">
                    <InfiniteScroll
                      dataLength={activityList.length}
                      next={fetchMoreData}
                      scrollableTarget={"scroller_top"}
                      hasMore={hasMore}
                      loader={<h4></h4>}
                    >
                      {activityList.map((item: any) => (
                        <div
                          onClick={() => {
                            setSelected({
                              name: item.name,
                              id: `${item.id}`,
                            });
                            dispatch(addCustomerDetails(item));
                            closeModal();
                          }}
                          key={item.id}
                          className="item pos_text_name_box"
                        >
                          <div className="checkbox_of_customers ">
                            <div className="text_name_box ">
                              <div className="chips">
                                <div className="top_chips">
                                  <p className="name">{item.name}</p>
                                  <div className="flex gap-2">
                                    <div className="clock_box">
                                      <BasketIcon />{" "}
                                      <p>{item.order_count || 0}</p>
                                    </div>
                                    <div className="clock_box">
                                      <ClockRewindIcon />{" "}
                                      <p>{getAmountOfDays(item.created_at)}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="top_chips">
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
                            </div>
                          </div>
                        </div>
                      ))}
                    </InfiniteScroll>
                  </div>
                ) : (
                  !isFetching && <EmptyResponse message="No customer found" />
                )
              ) : (
                ""
              )}

              {(isLoading || isFetching) &&
                [1, 2, 3, 4].map((item) => <LoadingProductBox key={item} />)}
            </div>
          </div>
        </div>
      </ModalRight>

      <CreateCustomerModal
        openModal={openCreateCustomer}
        closeModal={() => {
          setOpenCreateCustomer(false);
        }}
      />
    </>
  );
};

export default SelectCustomer;

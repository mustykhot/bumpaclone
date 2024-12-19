import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { Checkbox, Chip, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { useFormContext } from "react-hook-form";
import { useGetCustomersQuery } from "services";
import InputField from "components/forms/InputField";
import { SearchIcon } from "assets/Icons/SearchIcon";
import "./style.scss";
import ErrorMsg from "components/ErrorMsg";
import { LoadingProductBox } from "../Products";
import InfiniteScroll from "react-infinite-scroll-component";
import EmptyResponse from "components/EmptyResponse";
import { PhoneIcon } from "assets/Icons/PhoneIcon";
import { MAil02Icon } from "assets/Icons/Mail02Icon";
import { removeFirstZero } from "utils";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import CustomerDetails from "./CustomerDetails";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { addCustomerDetails } from "store/slice/PosSlice";

type SelectedType = {
  name: string;
  id: string;
};

type SelectCustomerProps = {
  openModal: boolean;
  closeModal: () => void;
};
const SelectCustomer = ({ openModal, closeModal }: SelectCustomerProps) => {
  const [selected, setSelected] = useState<SelectedType>({ name: "", id: "" });
  const dispatch = useAppDispatch();
  const [showSelected, setShowSelected] = useState(false);
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
        <div className="select-customer modal_right_children">
          <div className=" pd_select_customer_modal_box">
            <div className="top_section" id="scroller_top">
              <div className="customer_header">
                <div className="search_field_box pos_field_box">
                  <IconButton
                    className="pos_pad_icon"
                    onClick={() => closeModal()}
                  >
                    <BackArrowIcon />
                  </IconButton>
                  <p className="header">Select Customer</p>

                  <InputField
                    type={"text"}
                    containerClass="search_field"
                    value={search}
                    onChange={(e: any) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search by name, phone and email address"
                    suffix={<SearchIcon />}
                    className="pos_cust_search"
                  />
                </div>
              </div>

              <div className="displayList display_pos_cus_list">
                {isError && <ErrorMsg error={"Something went wrong"} />}
                {!isError && !isLoading ? (
                  activityList && activityList.length ? (
                    <div className="single_related_product  ">
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
                                <p className="name">{item.name}</p>
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
                            </div>
                          </div>
                        ))}
                      </InfiniteScroll>
                    </div>
                  ) : (
                    <EmptyResponse message="No customer found" />
                  )
                ) : (
                  ""
                )}

                {(isLoading || isFetching) &&
                  [1, 2, 3, 4].map((item) => <LoadingProductBox key={item} />)}
              </div>
            </div>
          </div>

          {/* {showSelected && (
            <CustomerDetails
              openModal={showSelected}
              closeModal={() => setShowSelected(false)}
            />
          )} */}
        </div>
      </ModalRight>
    </>
  );
};

export default SelectCustomer;

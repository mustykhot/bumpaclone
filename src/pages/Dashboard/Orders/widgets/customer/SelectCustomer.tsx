import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { Checkbox, Chip, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { useFormContext } from "react-hook-form";
import { useGetCustomersQuery } from "services";
import InputField from "components/forms/InputField";
import { SearchIcon } from "assets/Icons/SearchIcon";
import "./style.scss";
import { CreateCustomerModal } from "./CreateCustomer";
import ErrorMsg from "components/ErrorMsg";
import { LoadingProductBox } from "../product/SelectProductModal";
import InfiniteScroll from "react-infinite-scroll-component";
import EmptyResponse from "components/EmptyResponse";
import { PhoneIcon } from "assets/Icons/PhoneIcon";
import { MAil02Icon } from "assets/Icons/Mail02Icon";
import { removeFirstZero } from "utils";
import { useAppSelector } from "store/store.hooks";
type SelectedType = {
  name: string;
  id: string;
};
type CustomerModalProps = {
  openModal: boolean;
  closeModal: () => void;
  customerList?: SelectedType[];
  searchCustomers: string;
  setSearchCustomers: (val: string) => void;
};

export const SelectCustomerModal = ({
  openModal,
  closeModal,
  customerList,
  searchCustomers,
  setSearchCustomers,
}: CustomerModalProps) => {
  const [openCreateCustomer, setOpenCreateCustomer] = useState(false);
  const [selected, setSelected] = useState<SelectedType>({ name: "", id: "" });
  const { watch, setValue } = useFormContext();
  const [search, setSearch] = useState("");
  const [activityList, setActivityList] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching } = useGetCustomersQuery({
    limit: 25,
    page,
    search: search,
  });
  const addCustomerToForm = () => {
    setValue("customer", { name: selected.name, id: `${selected.id}` });
    closeModal();
  };

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

  useEffect(() => {
    if (watch("customer")) {
      setSelected(watch("customer"));
    }
  }, [watch("customer")]);
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
              title="Select Customer"
              extraChild={
                <Button
                  variant="outlined"
                  type="button"
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
                  value={search}
                  onChange={(e: any) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search"
                  suffix={
                    isFetching ? (
                      <CircularProgress
                        sx={{ color: "#9BA2AC" }}
                        size="1.5rem"
                      />
                    ) : (
                      <SearchIcon />
                    )
                  }
                />
              </div>
            </ModalRightTitle>
            <div className="displayList">
              {isError && <ErrorMsg error={"Something went wrong"} />}
              {/* {customerList?.map((item: any, i: number) => {
                return (
                  <div key={i} className="item">
                    <div>
                      <Checkbox
                        checked={item.id === selected.id}
                        onChange={() => {
                          setSelected({ name: item.name, id: `${item.id}` });
                        }}
                      />
                      <p className="name">{item.name}</p>
                    </div>
                  </div>
                );
              })} */}

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
                        <div key={item.id} className="item">
                          <div className="checkbox_of_customers">
                            <Checkbox
                              checked={`${item.id}` === selected.id}
                              onChange={() => {
                                setSelected({
                                  name: item.name,
                                  id: `${item.id}`,
                                });

                                setValue("customer_details", item);
                              }}
                            />
                            <div className="text_name_box">
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

          <div className=" bottom_section">
            <Button type="button" className="cancel" onClick={closeModal}>
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
          setOpenCreateCustomer(false);
        }}
      />
    </>
  );
};

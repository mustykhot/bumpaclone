import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { useEditOrdersMutation, useGetCustomersQuery } from "services";
import InputField from "components/forms/InputField";
import { SearchIcon } from "assets/Icons/SearchIcon";
import "./style.scss";
import { CreateCustomerModal } from "./CreateCustomer";
import ErrorMsg from "components/ErrorMsg";
import InfiniteScroll from "react-infinite-scroll-component";
import EmptyResponse from "components/EmptyResponse";
import { LoadingProductBox } from "../../widgets/product/SelectProductModal";
import { useParams } from "react-router-dom";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import Loader from "components/Loader";
import { OrderType } from "Models/order";
import moment from "moment";
type SelectedType = {
  name: string;
  id: string;
};
type CustomerModalProps = {
  openModal: boolean;
  closeModal: () => void;
  order: OrderType;
};

export const SelectCustomerModal = ({
  openModal,
  closeModal,
  order,
}: CustomerModalProps) => {
  const { id } = useParams();
  const [openCreateCustomer, setOpenCreateCustomer] = useState(false);
  const [selected, setSelected] = useState<SelectedType>({ name: "", id: "" });
  const [search, setSearch] = useState("");
  const [activityList, setActivityList] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [editOrder, { isLoading: loadEdit }] = useEditOrdersMutation();
  const { data, isLoading, isError, isFetching } = useGetCustomersQuery({
    limit: 25,
    page,
    search: search,
  });
  const addCustomerToForm = async () => {
    const payload = {
      ...order,
      order_date: moment(order.order_date).format("DD/MM/YYYY"),
      customer_id: selected.id,
    };
    try {
      let result = await editOrder({ body: payload, id });
      if ("data" in result) {
        showToast("Saved successfully", "success");
        closeModal();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
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

  return (
    <>
      {loadEdit && <Loader />}
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
                  suffix={<SearchIcon />}
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
                          <div>
                            <Checkbox
                              checked={`${item.id}` === selected.id}
                              onChange={() => {
                                setSelected({
                                  name: item.name,
                                  id: `${item.id}`,
                                });
                              }}
                            />
                            <p className="name">{item.name}</p>
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
              Save{" "}
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

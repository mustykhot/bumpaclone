import { Button, CircularProgress, Skeleton } from "@mui/material";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "./style.scss";
import { EditIcon } from "assets/Icons/EditIcon";
import { CustomerGroupType } from "services/api.types";
import { useNavigate } from "react-router-dom";
import InputField from "components/forms/InputField";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { useState, useEffect } from "react";
// import { CustomerType } from "services/api.types";
import { useGetSingleCustomerGroupQuery } from "services";
import InfiniteScroll from "react-infinite-scroll-component";
import EmptyResponse from "components/EmptyResponse";
import ErrorMsg from "components/ErrorMsg";

type CustomerGroupProfileProps = {
  openModal: boolean;
  closeModal: () => void;
  selectedGroup: null | CustomerGroupType;
  deleteProductFnc: (value: string, callback?: () => void) => void;
  loadDelete: boolean;
  selectedId: any;
};

export const CustomerGroupProfile = ({
  openModal,
  closeModal,
  selectedGroup,
  loadDelete,
  deleteProductFnc,
  selectedId,
}: CustomerGroupProfileProps) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const { data, isLoading, isFetching, isError } =
    useGetSingleCustomerGroupQuery({
      id: selectedId,
      limit: 15,
      page: page,
      search: search,
    });
  const [activityList, setActivityList] = useState<any[]>([]); // State to store customers list

  useEffect(() => {
    if (data) {
      const newCustomers =
        // @ts-ignore
        data?.group?.customers?.data || data?.group?.customers || [];
      const totalCustomers =
        // @ts-ignore
        data?.group?.customers?.total ||
        // @ts-ignore
        data?.group?.customers?.data?.total ||
        0;
      const currentLength = activityList.length;

      setHasMore(totalCustomers > currentLength);
      if (search) {
        if (page === 1) {
          setActivityList(newCustomers);
        } else {
          setActivityList((prev) => [...prev, ...newCustomers]);
        }
      } else {
        if (page === 1) {
          setActivityList(newCustomers);
        } else {
          setActivityList((prev) => [...prev, ...newCustomers]);
        }
      }
    }
  }, [data]);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const closeAll = () => {
    closeModal();
    setSearch("");
    setActivityList([]);
    setPage(1);
  };
  return (
    <>
      <ModalRight
        closeModal={() => {
          closeAll();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children pd_customer_group_profile">
          <div className="top_section" id="scroller_top">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
                setSearch("");
              }}
              title="Customer Group Details"
              extraChild={
                selectedGroup?.id && (
                  <Button
                    variant="outlined"
                    sx={{
                      width: "105px",
                      height: "36px",
                    }}
                    onClick={() => {
                      navigate(`/dashboard/customers/group/${selectedId}`);
                    }}
                    startIcon={<EditIcon stroke="#009444" />}
                  >
                    Edit
                  </Button>
                )
              }
            />

            <div className="customer_group_details">
              <div className="detail">
                <p className="light">Group Name</p>
                <p className="bold">{data?.group?.name} </p>
              </div>

              <div className="detail customer_list_container">
                <div className="flex">
                  <p className="light">Customers</p>
                  {/* @ts-ignore */}
                  <p className="bold">{data?.group?.customers?.data.length}</p>
                </div>

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
                <div className="list_customers">
                  {(isLoading || isFetching) &&
                    [1, 2, 3, 4].map((item) => <Skeleton key={item} />)}
                  {!isError && !isLoading ? (
                    activityList && activityList.length ? (
                      <InfiniteScroll
                        dataLength={activityList.length}
                        next={fetchMoreData}
                        scrollableTarget={"scroller_top"}
                        hasMore={hasMore}
                        loader={
                          <div className="loading_state">
                            <CircularProgress />
                          </div>
                        }
                      >
                        {activityList.length ? (
                          activityList.map((item: any) => (
                            <div
                              onClick={() => {
                                navigate(`/dashboard/customers/${item.id}`);
                              }}
                              className={`single_customer_box ${
                                isFetching && page === 1 && "loading"
                              }`}
                              key={item.id}
                            >
                              {item.name ? item.name : item?.first_name}
                            </div>
                          ))
                        ) : (
                          <p>No customers found</p>
                        )}
                      </InfiniteScroll>
                    ) : isFetching ? (
                      ""
                    ) : (
                      <EmptyResponse message="No customers found" />
                    )
                  ) : (
                    ""
                  )}

                  {isError && <ErrorMsg error={"Something went wrong"} />}
                </div>
              </div>
            </div>
          </div>
          {selectedGroup?.id && (
            <div className="bottom_section">
              <Button
                type="button"
                className="delete"
                onClick={() => {
                  deleteProductFnc(`${selectedGroup?.id}`, () => {
                    closeModal();
                  });
                }}
              >
                {loadDelete ? (
                  <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          )}
        </div>
      </ModalRight>
    </>
  );
};

import { useEffect, useState } from "react";
import TableComponent from "components/table";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { CircularProgress, IconButton } from "@mui/material";
import { SearchIcon } from "assets/Icons/SearchIcon";
import InputField from "components/forms/InputField";
import { Button } from "@mui/material";
import { CustomerGroupProfile } from "../CustomerGroupProfiile";
import { EditIcon } from "assets/Icons/EditIcon";
import {
  useDeleteCustomerGroupMutation,
  useGetCustomerGroupsQuery,
} from "services";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import moment from "moment";
import { EyeIcon } from "assets/Icons/EyeIcon";
import { useNavigate } from "react-router-dom";
import { CustomerGroupType } from "services/api.types";
import Loader from "components/Loader";
import AddIcon from "@mui/icons-material/Add";
import customer from "assets/images/customer.png";
import EmptyResponse from "components/EmptyResponse";
import {
  selectCustomerFilters,
  addCustomerFilter,
} from "store/slice/FilterSlice";

const headCell = [
  {
    key: "date",
    name: "Date Created",
  },
  {
    key: "name",
    name: "Group Name",
  },

  {
    key: "customerCount",
    name: "Customers",
  },

  {
    key: "action",
    name: "",
  },
];

const filterList = [
  { name: "All", value: "all" },
  { name: "Created Groups", value: "group" },
  { name: "Default Groups", value: "default" },
];

export const CustomerGroupTable = () => {
  const [selected, setSelected] = useState<string[] | number[]>([]);
  const [idTobeDeleted, setIdTobeDeleted] = useState(0);
  const [showNumbers, setShowNumbers] = useState(true);
  const [filterOption, setFilterOption] = useState<string | undefined>();
  const [dataCount, setDataCount] = useState(15);
  const [page, setPage] = useState(1);
  const [groupList, setGroupList] = useState<any[]>([]);
  const [defaultList, setDefaultList] = useState<any[]>([]);
  const [createdList, setCreatedList] = useState<any[]>([]);
  const [searchedGroupList, setSearchedGroupList] = useState<any[]>([]);
  const [filter, setFilter] = useState({ name: "All", value: "All" });
  const dispatch = useAppDispatch();
  const customerFilters = useAppSelector(selectCustomerFilters);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const { data, isLoading, isFetching, isError } = useGetCustomerGroupsQuery({
    search: customerFilters?.search,
    limit: dataCount,
    page: customerFilters?.page,
  });
  const [selectedGroup, setSelectedGroup] = useState<null | CustomerGroupType>(
    null
  );
  const [selectedId, setSelectedId] = useState<number>();

  const [deleteGroup, { isLoading: loadDelete }] =
    useDeleteCustomerGroupMutation();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const deleteInBulk = async () => {
    try {
      setIsDeleteLoading(true);
      const productRequests = selected?.map((id) => {
        return deleteProductFnc(`${id}`);
      });

      const responses = await Promise.all(productRequests);
      if (responses?.length) {
        setSelected([]);
        showToast("Groups successfully deleted", "success");
        // setOpenDeleteModal(false);
      }
    } catch (error) {
      showToast(
        "Failed to delete one or more group(s). Please try again.",
        "error"
      );
    } finally {
      setIsDeleteLoading(false);
    }
  };
  const deleteProductFnc = async (id: string, callback?: () => void) => {
    try {
      let result = await deleteGroup(id);
      if ("data" in result) {
        if (callback) {
          showToast("Deleted successfully", "success");
        }
        callback && callback();
      } else {
        handleError(result);
        callback && callback();
      }
    } catch (error) {
      handleError(error);
      callback && callback();
    }
  };
  const bulkDelete = () => {
    deleteInBulk();
  };

  const handleFilter = (value: string) => {
    if (value === "all") {
      setSearchedGroupList(groupList);
      setShowNumbers(true);
      setFilterOption("all");
    } else if (value === "group") {
      let searchList = createdList;
      setSearchedGroupList(searchList);
      setShowNumbers(true);
      setFilterOption("group");
    } else if (value === "default") {
      setFilterOption("default");
      setShowNumbers(false);
      let searchList = defaultList;
      setSearchedGroupList(searchList);
    }
  };

  useEffect(() => {
    if (data) {
      let combined = [];
      if (data.groups) {
        // @ts-ignore
        combined.push(...data.groups.data);
        // @ts-ignore
        setCreatedList(data?.groups.data);
        // @ts-ignore
        setSearchedGroupList(data?.groups.data);
      }
      if (data.default) {
        combined.push(...data.default);
        setDefaultList(data.default);
      }
      if (
        filterOption !== "group" &&
        customerFilters?.page == 1 &&
        !customerFilters?.search
      ) {
        setGroupList(combined);
        setSearchedGroupList(combined);
      }
    }
  }, [data]);

  return (
    <>
      {(loadDelete || isDeleteLoading) && <Loader />}
      {data &&
      data?.groups &&
      data?.groups?.length === 0 &&
      data?.default?.length === 0 &&
      !customerFilters?.search ? (
        <div className="empty_wrapper_for_emapty_state">
          <EmptyResponse
            message="Add customer group"
            image={customer}
            extraText="You can add a new customer group"
            btn={
              <div className="empty_btn_box">
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate("/dashboard/customers/creategroup");
                  }}
                  startIcon={<AddIcon />}
                  className="primary_styled_button"
                >
                  Add customer group
                </Button>
              </div>
            }
          />
        </div>
      ) : (
        <>
          <div className="table_action_container">
            <div className="left_section">
              {selected?.length ? (
                <div className="show_selected_actions">
                  <p>Selected: {selected?.length}</p>
                  <Button onClick={bulkDelete} startIcon={<TrashIcon />}>
                    Delete
                  </Button>
                  {/* <Button startIcon={<ArchiveIcon />}>Archive</Button> */}
                </div>
              ) : (
                <div className="filter_container">
                  {filterList.map((item, i) => (
                    <Button
                      key={i}
                      onClick={() => {
                        setFilter(item);
                        handleFilter(item.value);
                      }}
                      className={`filter_button ${
                        item.value === filter.value ? "active" : ""
                      }`}
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <div className="search_container">
              <InputField
                type={"text"}
                containerClass="search_field"
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
                suffix={<SearchIcon />}
              />
            </div>
          </div>
          <TableComponent
            page={customerFilters?.page}
            setPage={(val) => {
              dispatch(
                addCustomerFilter({
                  page: val,
                })
              );
            }}
            isError={isError}
            isLoading={isLoading || isFetching}
            headCells={headCell}
            selectMultiple={true}
            selected={selected}
            showPagination={showNumbers ? true : false}
            dataCount={dataCount}
            setDataCount={setDataCount}
            setSelected={setSelected}
            meta={{
              // @ts-ignore
              current: data?.groups?.current_page,
              perPage: 15,
              // @ts-ignore
              totalPage: data?.groups?.last_page,
            }}
            handleClick={(row: any) => {
              setSelectedGroup(row);
              setSelectedId(row.id);
              setOpenModal(true);
            }}
            tableData={searchedGroupList.map((row, i) => ({
              date: row.created_at ? moment(row.created_at).format("ll") : "",
              name: row.name,
              customers: row.customers,
              customerCount: row.customers_count,
              action: (
                <div className="flex gap-[28px] justify-end">
                  {row.id && (
                    <>
                      <IconButton
                        onClick={(e) => {
                          navigate(`/dashboard/customers/group/${row.id}`);
                          e.stopPropagation();
                        }}
                        type="button"
                        className="icon_button_container"
                      >
                        <EditIcon />
                      </IconButton>{" "}
                      <IconButton
                        onClick={(e) => {
                          setIdTobeDeleted(row.id);
                          deleteProductFnc(`${row.id}`);
                          e.stopPropagation();
                        }}
                        type="button"
                        className="icon_button_container"
                      >
                        {loadDelete && row.id === idTobeDeleted ? (
                          <CircularProgress size="1.5rem" />
                        ) : (
                          <TrashIcon />
                        )}
                      </IconButton>
                    </>
                  )}
                </div>
              ),
              id: row.id,
            }))}
          />
        </>
      )}

      <CustomerGroupProfile
        openModal={openModal}
        selectedGroup={selectedGroup}
        deleteProductFnc={deleteProductFnc}
        loadDelete={loadDelete}
        closeModal={() => {
          setOpenModal(false);
        }}
        selectedId={selectedId}
      />
    </>
  );
};

import { Button, IconButton } from "@mui/material";
import EmptyResponse from "components/EmptyResponse";
import { useState } from "react";
import discount from "assets/images/discount.png";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { useNavigate } from "react-router-dom";
import TableComponent from "components/table";
import { EditIcon } from "assets/Icons/EditIcon";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { SearchIcon } from "assets/Icons/SearchIcon";
import InputField from "components/forms/InputField";
import { ViewExpenseModal } from "../ViewExpense";
import { useGetExpensesQuery } from "services";
import { IExpense } from "Models/store";
import { LoadingButton } from "@mui/lab";
import MessageModal from "components/Modal/MessageModal";
import { handleError } from "utils";
import { showToast } from "store/store.hooks";
import { useDeleteExpenseMutation } from "services";
import moment from "moment";
import DateRangeDropDown from "components/DateRangeDropDown";
import { FillArrowIcon } from "assets/Icons/FillArrowIcon";

const headCell = [
  {
    key: "date",
    name: "Date Created",
  },
  {
    key: "category",
    name: "Expense Category",
  },

  {
    key: "amount",
    name: "Expense Amount",
  },
  {
    key: "note",
    name: "Additional Note",
  },

  {
    key: "action",
    name: "",
  },
];

export const ExpensesTable = () => {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | number[]>([]);
  const [dataCount, setDataCount] = useState("25");
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [activeId, setActiveId] = useState("");

  const [dateRange, setDateRange] = useState<any>(null);
  // table Actions
  const [search, setSearch] = useState("");
  const [activeExpense, setActiveExpense] = useState({} as IExpense);
  const navigate = useNavigate();

  const { data, isLoading, isFetching, isError } = useGetExpensesQuery({
    search: search,
    from: dateRange
      ? moment(new Date(dateRange[0]?.startDate)).format("DD/MM/Y")
      : "",
    to: dateRange
      ? moment(new Date(dateRange[0]?.endDate)).format("DD/MM/Y")
      : "",
  });

  const [deleteExpense, { isLoading: deleteLoading }] =
    useDeleteExpenseMutation();

  const handleShowDeleteModal = (id: string) => {
    setActiveId(id);
    setOpenDeleteModal(true);
  };

  const handleDeleteExpense = async () => {
    try {
      const result = await deleteExpense(activeId);
      if ("data" in result) {
        showToast("Expense Deleted Successfully", "success");
        setOpenDeleteModal(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleShowEditModal = (row: IExpense) => {
    setActiveExpense(row);
    setOpenModal(true);
  };

  return (
    <div className="pd_expenses_table">
      {data?.expenses?.data?.length === 0 && !search && !dateRange ? (
        <div className="empty_list_container">
          <EmptyResponse
            message="Expenses"
            image={discount}
            extraText="All your sent and unsent receipts would appear here."
            btn={
              <Button
                sx={{
                  padding: "12px 24px",
                }}
                variant="contained"
                startIcon={<PlusIcon />}
                className="primary_styled_button"
                onClick={() => {
                  navigate("create-expense");
                }}
              >
                Create Expense{" "}
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <MessageModal
            openModal={openDeleteModal}
            closeModal={() => {
              setOpenDeleteModal(false);
            }}
            icon={<TrashIcon />}
            btnChild={
              <LoadingButton
                disabled={deleteLoading}
                loading={deleteLoading}
                onClick={handleDeleteExpense}
                className="error"
              >
                {!deleteLoading && "Yes, delete"}
              </LoadingButton>
            }
            description="Are you sure you want to delete?"
          />
          <div className="table_section tabbed">
            <div className="table_action_container">
              <div className="left_section">
                <div className="filter_container">
                  <Button
                    onClick={() => {
                      setDateRange(null);
                      setSearch("");
                    }}
                    className={`filter_button `}
                  >
                    Clear Filters
                  </Button>

                  <DateRangeDropDown
                    origin={"left"}
                    setCustomState={setDateRange}
                    action={
                      <Button
                        variant="outlined"
                        endIcon={<FillArrowIcon stroke="#5C636D" />}
                        className="drop_btn"
                      >
                        {dateRange
                          ? `${moment(dateRange[0]?.startDate).format(
                              "D/MM/YYYY"
                            )} - ${moment(dateRange[0]?.endDate).format(
                              "D/MM/YYYY"
                            )}`
                          : "Select date range"}
                      </Button>
                    }
                  />
                </div>
              </div>
              <div className="search_container">
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
            </div>{" "}
            <TableComponent
              isError={isError}
              page={page}
              setPage={setPage}
              isLoading={isLoading || isFetching}
              headCells={headCell}
              // selectMultiple={true}
              // selected={selected}
              showPagination={true}
              dataCount={dataCount}
              setDataCount={setDataCount}
              setSelected={setSelected}
              handleClick={(row: any) => {
                handleShowEditModal(row);
              }}
              meta={{
                current: data?.expenses?.current_page,
                perPage: 10,
                totalPage: data?.expenses?.last_page,
              }}
              tableData={data?.expenses?.data.map(
                (row: IExpense, i: number) => ({
                  date: moment(row.formattedExpenseDate).format("D/MM/YYYY"),
                  category: row.category?.name,
                  amount: row.amount,
                  note: row.notes || "-",
                  action: (
                    <div className="flex gap-[28px] justify-end">
                      <IconButton
                        type="button"
                        className="icon_button_container"
                        onClick={(e) => {
                          handleShowEditModal(row);
                          e.stopPropagation();
                        }}
                      >
                        <EditIcon />
                      </IconButton>{" "}
                      <IconButton
                        type="button"
                        className="icon_button_container"
                        onClick={(e) => {
                          handleShowDeleteModal(row.id as string);
                          e.stopPropagation();
                        }}
                      >
                        <TrashIcon />
                      </IconButton>
                    </div>
                  ),
                  id: i,
                })
              )}
            />{" "}
          </div>
        </>
      )}
      <ViewExpenseModal
        expenseDetails={activeExpense}
        openModal={openModal}
        closeModal={() => {
          setOpenModal(false);
        }}
      />
    </div>
  );
};

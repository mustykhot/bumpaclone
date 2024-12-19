import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { IconButton } from "@mui/material";
import { Button } from "@mui/material";
import moment from "moment";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { PlusSquareIcon } from "assets/Icons/PlusSquareIcon";
import TableComponent from "components/table";
import InputField from "components/forms/InputField";
import MessageModal from "components/Modal/MessageModal";
import { useDeleteNewsLetterMutation, useGetNewsLetterQuery } from "services";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import {
  addCustomerFilter,
  selectCustomerFilters,
} from "store/slice/FilterSlice";

const headCell = [
  {
    key: "date",
    name: "Date Added",
  },
  {
    key: "email",
    name: "Email Address",
  },

  {
    key: "action",
    name: "",
  },
];

export const NewsLetterTable = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [dataCount, setDataCount] = useState("25");
  const navigate = useNavigate();
  // table Actions
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [idTobeDeleted, setIdTobeDeleted] = useState<number | string>("");
  const customerFilters = useAppSelector(selectCustomerFilters);
  const dispatch = useAppDispatch();
  const { data, isLoading, isFetching, isError } = useGetNewsLetterQuery({
    limit: Number(dataCount),
    page: customerFilters?.newsLetterPage,
    search: customerFilters?.newsLetterSearch,
  });

  const [deleteNewsLetter, { isLoading: loadDelete }] =
    useDeleteNewsLetterMutation();
  const deleteNewsletterFnc = async (
    id: number | string,
    callback?: () => void
  ) => {
    try {
      let result = await deleteNewsLetter(Number(id));
      if ("data" in result) {
        showToast("Deleted successfully", "success");
        callback && callback();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };
  const bulkDelete = () => {
    selected.forEach((item: any) => {
      deleteNewsletterFnc(item);
    });
    setSelected([]);
    setOpenDeleteModal(false);
  };

  return (
    <>
      <MessageModal
        openModal={openDeleteModal}
        closeModal={() => {
          setOpenDeleteModal(false);
        }}
        icon={<TrashIcon />}
        btnChild={
          <Button
            onClick={() => {
              if (idTobeDeleted) {
                deleteNewsletterFnc(`${idTobeDeleted}`, () => {
                  setOpenDeleteModal(false);
                  setSelected([]);
                });
              } else {
                bulkDelete();
              }
            }}
            className="error"
          >
            {loadDelete ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Yes, delete"
            )}
          </Button>
        }
        description="Are you sure you want to delete?"
      />
      <div className="table_action_container">
        <div className="left_section">
          {selected?.length ? (
            <div className="show_selected_actions">
              <p>Selected: {selected?.length}</p>
              <Button
                onClick={() => {
                  setIdTobeDeleted("");
                  setOpenDeleteModal(true);
                }}
                startIcon={<TrashIcon />}
              >
                Delete
              </Button>
            </div>
          ) : (
            <div className="filter_container"></div>
          )}
        </div>

        <div className="search_container">
          <InputField
            type={"text"}
            containerClass="search_field"
            value={customerFilters?.newsLetterSearch}
            onChange={(e: any) => {
              dispatch(
                addCustomerFilter({
                  newsLetterPage: 1,
                  newsLetterSearch: e.target.value,
                })
              );
            }}
            placeholder="Search by email"
            suffix={<SearchIcon />}
          />
        </div>
      </div>
      <TableComponent
        isError={isError}
        page={customerFilters?.newsLetterPage}
        setPage={(val) => {
          dispatch(
            addCustomerFilter({
              newsLetterPage: val,
            })
          );
        }}
        isLoading={isLoading || isFetching}
        headCells={headCell}
        selectMultiple={true}
        selected={selected}
        showPagination={true}
        dataCount={dataCount}
        setDataCount={setDataCount}
        setSelected={setSelected}
        meta={{
          current: data?.subscribers?.current_page,
          perPage: 10,
          totalPage: data?.subscribers?.last_page,
        }}
        tableData={data?.subscribers?.data.map((row, i) => ({
          date: moment(row.created_at).format("ll"),
          email: row.email,
          action: (
            <div className="flex gap-[28px] justify-end">
              <IconButton
                onClick={() => {
                  navigate(`/dashboard/customers/create?email=${row.email}`);
                }}
                type="button"
                className="icon_button_container"
              >
                <PlusSquareIcon />
              </IconButton>{" "}
              <IconButton
                onClick={() => {
                  setIdTobeDeleted(row.id);
                  setOpenDeleteModal(true);
                }}
                type="button"
                className="icon_button_container"
              >
                <TrashIcon />
              </IconButton>
            </div>
          ),
          id: row.id,
        }))}
      />
    </>
  );
};

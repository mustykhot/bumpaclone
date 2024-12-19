import { Button, CircularProgress, IconButton } from "@mui/material";
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
import { useGetCategoriesQuery, useDeleteCategoryMutation } from "services";
import { ICategory } from "Models/store";
import MessageModal from "components/Modal/MessageModal";
import { LoadingButton } from "@mui/lab";
import { handleError } from "utils";
import { showToast } from "store/store.hooks";
import { EditExpenseCategoryModal } from "../EditExpenseCategory";
import moment from "moment";

const headCell = [
  {
    key: "date",
    name: "Date Created",
  },
  {
    key: "name",
    name: "Category Title",
  },

  {
    key: "description",
    name: "Category Description",
  },

  {
    key: "action",
    name: "",
  },
];

export const ExpensesCategoryTable = () => {
  const [selected, setSelected] = useState<string | number[]>([]);
  const [dataCount, setDataCount] = useState("25");
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useGetCategoriesQuery({ search });
  // table Actions

  const [deleteCategory, { isLoading: deleteLoading }] =
    useDeleteCategoryMutation();
  const [activeId, setActiveId] = useState("");
  const [activeCategory, setActiveCategory] = useState({} as ICategory);
  const navigate = useNavigate();

  //delete category modal state
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  //edit category modal state
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleShowDeleteModal = (id: string) => {
    setActiveId(id);
    setOpenDeleteModal(true);
  };

  const handleShowEditModal = (row: ICategory) => {
    setActiveCategory(row);
    setOpenEditModal(true);
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(activeId);
      if ("data" in result) {
        showToast("Category Deleted Successfully", "success");
        setOpenDeleteModal(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
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
          <Button onClick={handleDeleteCategory} className="error">
            {deleteLoading ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Yes, delete"
            )}
          </Button>
        }
        description="Are you sure you want to delete?"
      />

      <div className="pd_expenses_table">
        {data && data.categories.length === 0 ? (
          <div className="empty_list_container">
            <EmptyResponse
              message="Expense Categories"
              image={discount}
              extraText="All your sent and unsent receipts would appear here."
              btn={
                <Button
                  sx={{
                    padding: "12px 24px",
                  }}
                  variant="contained"
                  startIcon={<PlusIcon />}
                  onClick={() => {
                    navigate("create-category");
                  }}
                >
                  Create Expense Category{" "}
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="table_section tabbed">
              <div className="table_action_container">
                <div className="left_section"></div>
                <div className="search_container">
                  <InputField
                    type={"text"}
                    containerClass="search_field"
                    value={search}
                    onChange={(e: any) => {
                      setSearch(e.target.value);
                    }}
                    placeholder="Search"
                    suffix={<SearchIcon />}
                  />
                </div>
              </div>{" "}
              <TableComponent
                isError={isError}
                headCells={headCell}
                selected={selected}
                showPagination={false}
                dataCount={dataCount}
                setDataCount={setDataCount}
                isLoading={isLoading}
                handleClick={(row: any) => {
                  handleShowEditModal(row);
                }}
                tableData={
                  data &&
                  data.categories.length > 0 &&
                  data?.categories.map((row: ICategory, i: number) => ({
                    date: moment(row.formattedCreatedAt).format("L"),
                    name: row.name,
                    description: row.description,
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
                  }))
                }
              />{" "}
            </div>
          </>
        )}
      </div>

      <EditExpenseCategoryModal
        categoryDetails={activeCategory}
        openModal={openEditModal}
        closeModal={() => {
          setOpenEditModal(false);
        }}
      />
    </>
  );
};

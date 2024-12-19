import { useState } from "react";
import EmptyResponse from "components/EmptyResponse";
import Button from "@mui/material/Button";
import { PlusIcon } from "assets/Icons/PlusIcon";
import taxes from "assets/images/taxes.png";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import ViewTaxDetails from "./ListTaxes/ViewTaxDetails";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { SearchIcon } from "assets/Icons/SearchIcon";
import InputField from "components/forms/InputField";
import TableComponent from "components/table";
import { CircularProgress, IconButton } from "@mui/material";
import { useDeleteTaxMutation, useGetTaxQuery } from "services";
import ErrorMsg from "components/ErrorMsg";
import moment from "moment";
import { EyeIcon } from "assets/Icons/EyeIcon";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import { TaxType } from "services/api.types";
import EditTaxModal from "./ListTaxes/EditTaxModal";
import Loader from "components/Loader";
import MessageModal from "components/Modal/MessageModal";
const headCell = [
  {
    key: "name",
    name: "Tax Name",
  },
  {
    key: "description",
    name: "Tax Description",
  },
  {
    key: "percentage",
    name: "Percentage",
  },
  {
    key: "date",
    name: "Date Created",
  },

  {
    key: "action",
    name: "",
  },
];

const filterList = ["All"];
const StoreTaxes = () => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[] | number[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const { data, isLoading, isFetching, isError } = useGetTaxQuery();
  const [idTobeDeleted, setIdTobeDeleted] = useState("");
  const [taxToView, setTaxToView] = useState<TaxType | null>(null);
  const [deleteTax, { isLoading: loadDelete }] = useDeleteTaxMutation();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const deleteInBulk = async () => {
    try {
      setIsDeleteLoading(true);
      const productRequests = selected?.map((id) => {
        return deleteTaxFnc(`${id}`);
      });

      const responses = await Promise.all(productRequests);
      if (responses?.length) {
        setSelected([]);
        showToast("Taxes successfully deleted", "success");
        setOpenDeleteModal(false);
      }
    } catch (error) {
      showToast(
        "Failed to delete one or more tax(s). Please try again.",
        "error"
      );
    } finally {
      setIsDeleteLoading(false);
    }
  };
  const deleteTaxFnc = async (id: string, callback?: () => void) => {
    try {
      let result = await deleteTax(id);
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
    // selected.forEach((item: any) => {
    //   deleteTaxFnc(item);
    // });
    // setSelected([]);
    // setOpenDeleteModal(false);
    deleteInBulk();
  };

  // if (loadDelete) {
  //   return <Loader />;
  // }
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
                deleteTaxFnc(`${idTobeDeleted}`, () => {
                  setOpenDeleteModal(false);
                  setSelected([]);
                  setIdTobeDeleted("");
                });
              } else {
                bulkDelete();
              }
            }}
            className="error"
            disabled={loadDelete || isDeleteLoading}
          >
            {loadDelete || isDeleteLoading ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Yes, delete"
            )}
          </Button>
        }
        description="Are you sure you want to delete selected taxes ?"
      />
      <div
        className={`pd_taxes ${
          data && data?.taxTypes?.length === 0 && !search ? "empty" : ""
        }`}
      >
        {data && data?.taxTypes?.length === 0 && !search ? (
          <EmptyResponse
            message="Create new tax"
            image={taxes}
            extraText="You can create your taxes here"
            btn={
              <div className="empty_btn_box">
                <Button
                  onClick={() => {
                    navigate("create");
                  }}
                  variant="contained"
                  startIcon={<PlusIcon />}
                >
                  Create new tax
                </Button>
              </div>
            }
          />
        ) : (
          <div className="">
            <div className="container__title-section">
              <h3 className="name_of_section">Taxes</h3>

              <div className="btn_flex">
                <Button
                  startIcon={<PlusIcon />}
                  className="btn_pry primary_styled_button"
                  variant={"contained"}
                  component={Link}
                  to="create"
                >
                  Create New Tax
                </Button>
              </div>
            </div>
            <div className="table_section">
              <div>
                <div className="table_action_container">
                  <div className="left_section">
                    {selected.length ? (
                      <div className="show_selected_actions">
                        <p>Selected: {selected.length}</p>
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
                      <div className="filter_container">
                        {filterList.map((item, i) => (
                          <Button
                            key={i}
                            onClick={() => {
                              setFilter(item);
                            }}
                            className={`filter_button ${
                              item === filter ? "active" : ""
                            }`}
                          >
                            {item}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* <div className="search_container">
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
                    </div> */}
                </div>
                <TableComponent
                  isError={isError}
                  isLoading={isLoading || isFetching}
                  headCells={headCell}
                  selectMultiple={true}
                  selected={selected}
                  showPagination={false}
                  setSelected={setSelected}
                  handleClick={(row: any) => {
                    setTaxToView(row);
                    setShowDetailsModal(true);
                  }}
                  tableData={data?.taxTypes?.map((row, i: number) => ({
                    ...row,
                    name: row.name,
                    description: row.description,
                    percent: row.percent,
                    percentage: `${row.percent}%`,
                    date: moment(row.created_at).format("ll"),
                    action: (
                      <div className="flex gap-[28px] justify-end">
                        <IconButton
                          type="button"
                          className="icon_button_container"
                          onClick={(e) => {
                            setIdTobeDeleted(`${row.id}`);
                            setOpenDeleteModal(true);
                            e.stopPropagation();
                          }}
                        >
                          <TrashIcon />
                        </IconButton>
                        {/* <IconButton
                          onClick={() => {
                            setTaxToView(row);
                            setShowDetailsModal(true);
                          }}
                          type="button"
                          className="icon_button_container"
                        >
                          <EyeIcon />
                        </IconButton> */}
                      </div>
                    ),
                    id: row.id,
                  }))}
                />
              </div>
            </div>

            {showDetailsModal && (
              <ViewTaxDetails
                taxToView={taxToView}
                setShowEditModal={() => {
                  setShowEditModal(true);
                  // setShowDetailsModal(false);
                }}
                showModal={showDetailsModal}
                deleteFnc={deleteTaxFnc}
                loadDelete={loadDelete}
                setShowModal={() => {
                  setShowDetailsModal(false);
                }}
              />
            )}
            {showEditModal && (
              <EditTaxModal
                showModal={showEditModal}
                taxToView={taxToView}
                setShowModal={() => {
                  setShowEditModal(false);
                  setShowDetailsModal(false);
                }}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default StoreTaxes;

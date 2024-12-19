import { useState } from "react";
import TableComponent from "components/table";
import { Chip, CircularProgress, MenuItem, Select } from "@mui/material";
import { SearchIcon } from "assets/Icons/SearchIcon";
import InputField from "components/forms/InputField";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DateRangeDropDown from "components/DateRangeDropDown";
import { FillArrowIcon } from "assets/Icons/FillArrowIcon";
import moment from "moment";
import { useGetTransactionQuery, useMatchOrderMutation } from "services";
import {
  capitalizeText,
  formatPrice,
  formatTransactionPrice,
  handleError,
  translateTransactionStatus,
} from "utils";
import { getOriginImage } from "pages/Dashboard/Orders";
import { useAppSelector } from "store/store.hooks";
import { selectUserLocation } from "store/slice/AuthSlice";
import { showToast } from "store/store.hooks";
import { getObjWithValidValues } from "utils/constants/general";
import { TransactionListType } from "services/api.types";
import {
  BootstrapTooltip,
  TransactionTypes,
} from "pages/Dashboard/Transactions/TransactionHistoryTable";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { UnpaidOrdersModal } from "pages/Dashboard/Transactions/UnpaidOrdersModal";
import { DetailsModal } from "pages/Dashboard/Transactions/DetailsModal";
import { GeneralModal } from "pages/Dashboard/ConnectedApps/widgets/Modals/GeneralModal";
import { LargeCartIcon } from "assets/Icons/LargeCartIcon";
import { SuccessfulConnectionModal } from "pages/Dashboard/ConnectedApps/widgets/Modals/SuccessfulConnectionModal";

const headCell = [
  {
    key: "image",
    name: "",
  },
  {
    key: "date",
    name: "Date",
  },
  {
    key: "order",
    name: "Order",
  },
  {
    key: "customer",
    name: "Customer",
  },

  {
    key: "price",
    name: "Amount",
  },

  {
    key: "type",
    name: "Transaction Type",
  },

  // {
  //   key: "source",
  //   name: "Transaction Source",
  // },

  {
    key: "status",
    name: "Transaction Status",
  },
  {
    key: "channel",
    name: "Transaction Source",
  },
];

export const TransactionHistoryTable = () => {
  const [page, setPage] = useState(1);
  const [dataCount, setDataCount] = useState("25");
  // table Actions
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<any>(null);
  const navigate = useNavigate();
  const userLocation = useAppSelector(selectUserLocation);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openUnpaidModal, setOpenUnpaidModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [activeTransaction, setActiveTransaction] =
    useState<TransactionListType | null>(null);
  const [orderToLink, setOrderToLink] = useState("");
  const [matchOrder, { isLoading: loadMatchOrder }] = useMatchOrderMutation();
  const transactionFnc = async () => {
    const payload = {
      order_id: orderToLink,
      transaction_id: activeTransaction?.transaction_id,
      customer_id: activeTransaction?.customer?.id,
    };
    try {
      let result = await matchOrder(getObjWithValidValues(payload));
      if ("data" in result) {
        if (result.data.error) {
          showToast(result.data.error, "error");
        } else {
          setOpenConfirm(false);
          setOpenUnpaidModal(false);
          setOpenDetailsModal(false);
          setOpenSuccessModal(true);
          setActiveTransaction(null);
          setOrderToLink("");
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };
  const {
    data: transactions,
    isLoading,
    isFetching,
    isError,
  } = useGetTransactionQuery({
    limit: Number(dataCount),
    search,
    page,
    channel: typeFilter,
    from_date: dateRange
      ? moment(new Date(dateRange[0]?.startDate)).format("DD/MM/Y")
      : "",
    to_date: dateRange
      ? moment(new Date(dateRange[0]?.endDate)).format("DD/MM/Y")
      : "",
    location_id: userLocation?.id,
  });

  return (
    <>
      <div className="table_action_container">
        <div className="left_section">
          <div className="filter_container">
            <Button
              onClick={() => {
                setDateRange(null);
                setTypeFilter("");
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
                      )} - ${moment(dateRange[0]?.endDate).format("D/MM/YYYY")}`
                    : "Select date range"}
                </Button>
              }
            />
          </div>
        </div>

        <div className="search_container">
          <Select
            displayEmpty
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
            }}
            className="my-select dark"
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem disabled value="">
              Transaction Type{" "}
            </MenuItem>
            {TransactionTypes.map((item, i) => {
              return (
                <MenuItem key={i} value={item.value}>
                  {item.key}
                </MenuItem>
              );
            })}
          </Select>
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
      </div>
      <TableComponent
        isError={isError}
        page={page}
        setPage={setPage}
        isLoading={isLoading || isFetching}
        headCells={headCell}
        showPagination={true}
        dataCount={dataCount}
        setDataCount={setDataCount}
        handleClick={(row: any) => {
          setActiveTransaction(row);
          setOpenDetailsModal(true);
        }}
        meta={{
          current: transactions?.transactions?.current_page,
          perPage: 10,
          totalPage: transactions?.transactions?.last_page,
        }}
        tableData={transactions?.transactions?.data.map((row) => {
          return {
            ...row,
            image: (
              <img
                src={getOriginImage(row.order?.origin)?.image}
                alt={getOriginImage(row.order?.origin)?.name}
                width={28}
                height={28}
              />
            ),
            transaction_id: row.id,

            date: moment(row.created_at).format("LLL"),
            // source: capitalizeText(row.channel),
            order: `${row.order ? `#${row?.order?.order_number}` : ""}`,
            customer: row?.order?.id ? (
              row?.method === "WALLET" ? (
                row?.recipient?.account_name || "None Selected"
              ) : (
                row.customer?.name || "None Selected"
              )
            ) : (
              <BootstrapTooltip
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, -8],
                        },
                      },
                    ],
                  },
                }}
                title="This transaction needs to be matched to an order."
                placement="top-start"
              >
                <div className="flex items-center gap-1">
                  {row?.method === "WALLET"
                    ? row?.recipient?.account_name || "None Selected"
                    : row.customer?.name || "None Selected"}
                  <InfoCircleIcon stroke="#FFB60A" />
                </div>
              </BootstrapTooltip>
            ),
            price: formatTransactionPrice(Number(row.amount), row.currency),

            type: (
              <Chip
                color={
                  translateTransactionStatus(capitalizeText(row.method) as any)
                    ?.color
                }
                label={
                  translateTransactionStatus(capitalizeText(row.method) as any)
                    ?.label
                }
              />
            ),
            status: (
              <Chip
                color={
                  row.status === "SUCCESSFUL"
                    ? "success"
                    : row.status === "PENDING"
                    ? "warning"
                    : row.status === "FAILED"
                    ? "error"
                    : "info"
                }
                label={
                  row.status === "PENDING" ? "PENDING SETTLEMENT" : row.status
                }
              />
            ),
            id: row.order ? row.order.id : "",
          };
        })}
      />
      <DetailsModal
        details={activeTransaction}
        openModal={openDetailsModal}
        setOpenUnpaidModal={setOpenUnpaidModal}
        closeModal={() => {
          setOpenDetailsModal(false);
        }}
      />
      <UnpaidOrdersModal
        openModal={openUnpaidModal}
        setOrderId={setOrderToLink}
        setOpenConfirm={setOpenConfirm}
        closeModal={() => {
          setOpenUnpaidModal(false);
        }}
      />
      <GeneralModal
        title="Confirm to match order"
        description={`Are you sure you want to match this order to the ${formatPrice(
          Number(activeTransaction?.amount)
        )} ${
          activeTransaction?.customer?.name
            ? `paid by ${activeTransaction?.customer?.name}`
            : ""
        }?`}
        image={<LargeCartIcon />}
        btnText={
          loadMatchOrder ? (
            <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
          ) : (
            "Yes, match order"
          )
        }
        btnAction={() => {
          transactionFnc();
        }}
        openModal={openConfirm}
        isCancel
        closeModal={() => {
          setOpenConfirm(false);
        }}
      />
      <SuccessfulConnectionModal
        openModal={openSuccessModal}
        btnAction={() => {
          setOpenSuccessModal(false);
        }}
        closeModal={() => {
          setOpenSuccessModal(false);
        }}
        btnText="Okay"
        title="Yes, match order"
        description="Your order has been matched successfully."
      />
    </>
  );
};

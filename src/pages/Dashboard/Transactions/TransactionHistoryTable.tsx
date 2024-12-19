import { useEffect, useState } from "react";
import { onMessageListener } from "firebase";
import TableComponent from "components/table";
import {
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
} from "@mui/material";
import { Button } from "@mui/material";
import moment from "moment";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { LargeCartIcon } from "assets/Icons/LargeCartIcon";
import { FillArrowIcon } from "assets/Icons/FillArrowIcon";
import { getOriginImage } from "pages/Dashboard/Orders";
import { DetailsModal } from "./DetailsModal";
import { UnpaidOrdersModal } from "./UnpaidOrdersModal";
import { GeneralModal } from "../ConnectedApps/widgets/Modals/GeneralModal";
import InputField from "components/forms/InputField";
import DateRangeDropDown from "components/DateRangeDropDown";
import { SuccessfulConnectionModal } from "../ConnectedApps/widgets/Modals/SuccessfulConnectionModal";
import { useGetTransactionQuery, useMatchOrderMutation } from "services";
import {
  capitalizeText,
  formatPrice,
  formatTransactionPrice,
  handleError,
  translateTransactionStatus,
} from "utils";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { getObjWithValidValues } from "utils/constants/general";
import { TransactionListType } from "services/api.types";
import { selectUserLocation } from "store/slice/AuthSlice";
import {
  addTransactionFilter,
  selectTransactionFilters,
} from "store/slice/FilterSlice";

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
  {
    key: "status",
    name: "Transaction Status",
  },
  {
    key: "channel",
    name: "Transaction Source",
  },
];
export const TransactionTypes = [
  { value: "MOBILE", key: "Mobile" },
  { value: "WEB", key: "Web" },
  { value: "TERMINAL", key: "Terminal" },
  { value: "POS", key: "Pos" },
];

export const BootstrapTooltip = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  )
)(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

type TransactionTableProps = {
  from?: string;
};

export const TransactionHistoryTable = ({ from }: TransactionTableProps) => {
  const [orderToLink, setOrderToLink] = useState("");
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openUnpaidModal, setOpenUnpaidModal] = useState(false);
  const transactionFilters = useAppSelector(selectTransactionFilters);
  const dispatch = useAppDispatch();
  const [activeTransaction, setActiveTransaction] =
    useState<TransactionListType | null>(null);
  const [dataCount, setDataCount] = useState("25");
  const [openConfirm, setOpenConfirm] = useState(false);
  const userLocation = useAppSelector(selectUserLocation);
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
    refetch,
  } = useGetTransactionQuery({
    limit: Number(dataCount),
    search: transactionFilters?.search,
    page: transactionFilters?.page,
    channel: transactionFilters?.channel,
    from_date: transactionFilters?.dateRange
      ? moment(new Date(transactionFilters?.dateRange[0]?.startDate)).format(
          "DD/MM/Y"
        )
      : "",
    to_date: transactionFilters?.dateRange
      ? moment(new Date(transactionFilters?.dateRange[0]?.endDate)).format(
          "DD/MM/Y"
        )
      : "",
    location_id: userLocation?.id,
  });

  onMessageListener()
    .then((payload: any) => {
      refetch();
    })
    .catch((err) => console.log("failed"));

  useEffect(() => {
    if (from === "fromTerminal") {
      dispatch(
        addTransactionFilter({
          channel: "TERMINAL",
        })
      );
    }
  }, [from, dispatch]);

  return (
    <>
      <div className="table_action_container">
        <div className="left_section">
          <div className="filter_container">
            <Button
              onClick={() => {
                dispatch(
                  addTransactionFilter({
                    channel: "",
                    dateRange: null,
                    search: "",
                  })
                );
              }}
              className={`filter_button `}
            >
              Clear Filters
            </Button>
            <DateRangeDropDown
              origin={"left"}
              setCustomState={(val: any) => {
                dispatch(
                  addTransactionFilter({
                    dateRange: val,
                  })
                );
              }}
              action={
                <Button
                  variant="outlined"
                  endIcon={<FillArrowIcon stroke="#5C636D" />}
                  className="drop_btn"
                >
                  {transactionFilters?.dateRange
                    ? `${moment(
                        transactionFilters?.dateRange[0]?.startDate
                      ).format("D/MM/YYYY")} - ${moment(
                        transactionFilters?.dateRange[0]?.endDate
                      ).format("D/MM/YYYY")}`
                    : "Select date range"}
                </Button>
              }
            />
          </div>
        </div>

        <div className="search_container">
          <Select
            displayEmpty
            value={transactionFilters?.channel}
            onChange={(e) => {
              dispatch(
                addTransactionFilter({
                  channel: e.target.value,
                })
              );
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
            value={transactionFilters?.search}
            onChange={(e: any) => {
              dispatch(
                addTransactionFilter({
                  search: e.target.value,
                  page: 1,
                })
              );
            }}
            placeholder="Search"
            suffix={<SearchIcon />}
          />
        </div>
      </div>
      <TableComponent
        isError={isError}
        page={transactionFilters?.page}
        setPage={(val) => {
          dispatch(
            addTransactionFilter({
              page: val,
            })
          );
        }}
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
            transaction_id: row.id,
            image: (
              <img
                src={getOriginImage(row.order?.origin)?.image}
                alt={getOriginImage(row.order?.origin)?.name}
                width={28}
                height={28}
              />
            ),
            date: moment(row.created_at).format("lll"),
            channel: capitalizeText(row.channel),
            order: `${row.order ? `#${row?.order?.order_number}` : ""}`,
            customer: row.order?.id ? (
              row?.method === "WALLET" ? (
                row?.recipient?.account_name || "Unnamed Customer"
              ) : row?.method === "TRANSFER" ? (
                row?.meta?.sender_name || "Unnamed Customer"
              ) : (
                row.customer?.name || "Unnamed Customer"
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
                    : row?.method === "TRANSFER"
                    ? row?.meta?.sender_name || "None Selected"
                    : row.customer?.name || "None Selected"}
                  <InfoCircleIcon stroke="#FFB60A" />
                </div>
              </BootstrapTooltip>
            ),
            price: row.is_customer_charged
              ? formatTransactionPrice(Number(row.amount_settled), row.currency)
              : formatTransactionPrice(Number(row?.amount), row.currency),
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

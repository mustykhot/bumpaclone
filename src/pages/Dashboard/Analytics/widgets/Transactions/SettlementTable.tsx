import { useEffect, useState } from "react";
import TableComponent from "components/table";
import { Chip } from "@mui/material";
import { SearchIcon } from "assets/Icons/SearchIcon";
import InputField from "components/forms/InputField";
import { Button } from "@mui/material";
import SettlementModal from "./SettlementModal";
import { useGetSettlementsQuery } from "services";
import moment from "moment";
import DateRangeDropDown from "components/DateRangeDropDown";
import { FillArrowIcon } from "assets/Icons/FillArrowIcon";
import { formatPrice } from "utils";
import { SettlementListType } from "services/api.types";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  selectSettlementData,
  setDataToSettlementData,
} from "store/slice/OrderSlice";
import { selectUserLocation } from "store/slice/AuthSlice";

const headCell = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "time",
    name: "Time",
  },
  {
    key: "bank",
    name: "Bank Account",
  },

  {
    key: "account",
    name: "Account Name",
  },
  {
    key: "account_number",
    name: "Account Number",
  },

  {
    key: "amount",
    name: "Amount",
  },
];

export const SettlementTable = () => {
  const [page, setPage] = useState(1);
  const [dataCount, setDataCount] = useState("25");
  // table Actions
  const [dateRange, setDateRange] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [settlementData, setSettlementData] =
    useState<SettlementListType | null>(null);
  const dispatch = useAppDispatch();
  const selectedSettlement = useAppSelector(selectSettlementData);
  const userLocation = useAppSelector(selectUserLocation);

  const {
    data: settlement,
    isLoading,
    isFetching,
    isError,
  } = useGetSettlementsQuery({
    limit: Number(dataCount),
    search,
    page,
    from_date: dateRange
      ? moment(new Date(dateRange[0]?.startDate)).format("DD/MM/Y")
      : "",
    to_date: dateRange
      ? moment(new Date(dateRange[0]?.endDate)).format("DD/MM/Y")
      : "",
    location_id: userLocation?.id,
  });

  useEffect(() => {
    if (selectedSettlement) {
      setSettlementData(selectedSettlement);
      setOpenModal(true);
    }
  }, [selectedSettlement]);

  return (
    <>
      <div className="table_action_container">
        <div className="left_section">
          <div className="filter_container">
            <Button
              onClick={() => {
                setDateRange(null);
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
          setSettlementData(row);
          setOpenModal(true);
          dispatch(setDataToSettlementData(row));
        }}
        meta={{
          current: settlement?.settlements?.current_page,
          perPage: 10,
          totalPage: settlement?.settlements?.last_page,
        }}
        tableData={settlement?.settlements?.data.map((row) => ({
          ...row,
          settled_date: row.transaction_date,
          date: moment(row.transaction_date).format("ll"),
          time: moment(row.transaction_date).format("LT"),
          account: row.account_name,
          account_number: row.account_number,
          bank: row.bank,
          amount: formatPrice(Number(row.total)),
          status: <Chip color="success" label={row.status} />,
          id: row.id,
        }))}
      />
      <SettlementModal
        openModal={openModal}
        settlementData={settlementData}
        closeModal={() => {
          setOpenModal(false);
        }}
      />
    </>
  );
};

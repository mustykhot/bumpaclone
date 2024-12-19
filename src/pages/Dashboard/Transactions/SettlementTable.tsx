import { useEffect, useState } from "react";
import moment from "moment";
import TableComponent from "components/table";
import InputField from "components/forms/InputField";
import DateRangeDropDown from "components/DateRangeDropDown";
import { Button } from "@mui/material";
import { Chip } from "@mui/material";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { FillArrowIcon } from "assets/Icons/FillArrowIcon";
import SettlementModal from "./SettlementModal";
import { useGetSettlementsQuery } from "services";
import { formatPrice } from "utils";
import { SettlementListType } from "services/api.types";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  selectSettlementData,
  setDataToSettlementData,
} from "store/slice/OrderSlice";
import { selectUserLocation } from "store/slice/AuthSlice";
import {
  addSettlementFilter,
  selectSettlementFilters,
} from "store/slice/FilterSlice";

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
  const [dataCount, setDataCount] = useState("25");
  const [openModal, setOpenModal] = useState(false);
  const [settlementData, setSettlementData] =
    useState<SettlementListType | null>(null);
  const dispatch = useAppDispatch();
  const selectedSettlement = useAppSelector(selectSettlementData);
  const userLocation = useAppSelector(selectUserLocation);
  const settlementFilters = useAppSelector(selectSettlementFilters);
  const {
    data: settlement,
    isLoading,
    isFetching,
    isError,
  } = useGetSettlementsQuery({
    limit: Number(dataCount),
    search: settlementFilters?.search,
    page: settlementFilters?.page,
    from_date: settlementFilters?.dateRange
      ? moment(new Date(settlementFilters?.dateRange[0]?.startDate)).format(
          "DD/MM/Y"
        )
      : "",
    to_date: settlementFilters?.dateRange
      ? moment(new Date(settlementFilters?.dateRange[0]?.endDate)).format(
          "DD/MM/Y"
        )
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
                dispatch(
                  addSettlementFilter({
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
                  addSettlementFilter({
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
                  {settlementFilters?.dateRange
                    ? `${moment(
                        settlementFilters?.dateRange[0]?.startDate
                      ).format("D/MM/YYYY")} - ${moment(
                        settlementFilters?.dateRange[0]?.endDate
                      ).format("D/MM/YYYY")}`
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
            value={settlementFilters?.search}
            onChange={(e: any) => {
              dispatch(
                addSettlementFilter({
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
        setPage={(val) => {
          dispatch(
            addSettlementFilter({
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

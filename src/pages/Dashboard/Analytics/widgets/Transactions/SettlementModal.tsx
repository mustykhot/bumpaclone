import { NairaIcon } from "assets/Icons/NairaIcon";
import { ShopingIcon } from "assets/Icons/Sidebar/ShopingIcon";
import ModalBottom from "components/ModalBottom";
import { SummaryCard } from "components/SummaryCard";
import TableComponent from "components/table";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import "./style.scss";
import { SettlementListType } from "services/api.types";
import { formatPrice, getCurrencyFnc } from "utils";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useGetSingleSettlementQuery } from "services";
import { useAppDispatch } from "store/store.hooks";
import { setDataToSettlementData } from "store/slice/OrderSlice";

type propType = {
  openModal: boolean;
  settlementData: any;
  closeModal: () => void;
};
const headCell = [
  {
    key: "order_number",
    name: "Order Number",
  },
  {
    key: "total",
    name: "Total",
  },

  {
    key: "date",
    name: "Date",
  },
];

const SettlementModal = ({
  closeModal,
  openModal,
  settlementData,
}: propType) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    data: settlement,
    isLoading,
    isFetching,
    isError,
  } = useGetSingleSettlementQuery(
    {
      date: settlementData?.settled_date
        ? moment(settlementData?.settled_date).format("YYYY-MM-DD")
        : "",
    },
    {
      skip: settlementData?.settled_date ? false : true,
    }
  );

  return (
    <ModalBottom
      closeModal={() => {
        dispatch(setDataToSettlementData(null));
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="pd_transaction_history_modal">
        <ModalHeader
          closeModal={() => {
            dispatch(setDataToSettlementData(null));
            closeModal();
          }}
          text={`Settlements for (${
            settlementData?.settled_date
              ? moment(settlementData?.settled_date).format("ll")
              : ""
          })`}
        />
        <div className="summary_container">
          <SummaryCard
            count={formatPrice(Number(settlementData?.total || 0))}
            title="Total Settlement Amount"
            icon={getCurrencyFnc()}
            color={"green"}
          />
          <SummaryCard
            count={`${settlement?.transactions?.length || 0}`}
            title="Total Settlements"
            icon={<ShopingIcon stroke="#0059DE" />}
            color={"blue"}
          />
        </div>
        <div className="table_container">
          <TableComponent
            headCells={headCell}
            showPagination={false}
            isLoading={isLoading || isFetching}
            isError={isError}
            handleClick={(row: any) => {
              navigate(`/dashboard/orders/${row.id}?backAction=${true}`);
            }}
            tableData={settlement?.transactions.map((row: any) => ({
              order: row.order_id,
              order_number: row?.order?.order_number,
              total: formatPrice(Number(row.amount)),
              date: moment(row.created_at).format("ll"),
              id: row.order_id,
            }))}
          />
        </div>
      </div>
    </ModalBottom>
  );
};

export default SettlementModal;

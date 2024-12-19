import { useState } from "react";
import { Button, Select, MenuItem, Chip } from "@mui/material";
import InputField from "components/forms/InputField";
import { SearchIcon } from "assets/Icons/SearchIcon";
import TableComponent from "components/table";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import "./style.scss";
import product from "assets/images/product.png";

const headCell = [
  {
    key: "image",
    name: "",
  },

  {
    key: "order",
    name: "Order ID & Name",
  },

  {
    key: "total",
    name: "Total",
  },
  {
    key: "status",
    name: "Status",
  },
  {
    key: "payment",
    name: "Payment",
  },
  {
    key: "shipping",
    name: "Shipping",
  },
  {
    key: "date",
    name: "Date",
  },
];
const filterList = [
  "All",
  "Open",
  "Processing",
  "Completed",
  "Cancelled",
  "Paid",
  "Unpaid",
  "Partially Paid",
];

export const SeeAllOrders = () => {
  const [page, setPage] = useState(1);
  const [dataCount, setDataCount] = useState("25");

  // table actions
  const [filter, setFilter] = useState("All");
  const [channel, setChannel] = useState("");
  const [search, setSearch] = useState("");
  return (
    <div className={`pd_invoice`}>
      <div className="invoice_container">
        <ModalHeader text="Orders" />

        <div className="table_section">
          <div className="table_action_container">
            <div className="left_section">
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
            </div>

            <div className="search_container">
              <Select
                displayEmpty
                value={channel}
                onChange={(e) => {
                  setChannel(e.target.value);
                }}
                className="my-select"
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem disabled value="">
                  Filter by Channel{" "}
                </MenuItem>
                <MenuItem value="hy">hy</MenuItem>
                <MenuItem value="yo">yo </MenuItem>
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
            // isError={isError}
            page={page}
            setPage={setPage}
            isLoading={false}
            headCells={headCell}
            selectMultiple={false}
            showPagination={true}
            dataCount={dataCount}
            setDataCount={setDataCount}
            tableData={Array(7)
              .fill("")
              .map((row, i) => ({
                image: (
                  <img
                    src={product}
                    width={40}
                    height={40}
                    style={{
                      borderRadius: "4px",
                    }}
                    alt="product"
                  />
                ),
                order: (
                  <div className="display_order">
                    <p className="title">#3454 • Ayodele Umechukwu</p>
                    <p className="description">White addidas shoe +20 items</p>
                  </div>
                ),
                total: "₦1,210,500",
                status: <Chip color="success" label={`Completed`} />,
                payment: <Chip color="success" label={`Partially Paid`} />,
                shipping: <Chip color="success" label={`Delivered`} />,
                date: "12/02/2023 at 12:06pm",
                id: i,
              }))}
          />
        </div>
      </div>
    </div>
  );
};

import TableComponent from "components/table";
import { Chip } from "@mui/material";
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
    key: "date",
    name: "Date",
  },
];
const RecentOrders = () => {
  return (
    <div>
      <TableComponent
        // isError={isError}
        isLoading={false}
        headCells={headCell}
        selectMultiple={false}
        showPagination={false}
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
            date: "12/02/2023 at 12:06pm",
            id: i,
          }))}
      />
    </div>
  );
};

export default RecentOrders;

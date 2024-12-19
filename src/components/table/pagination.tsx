import { Pagination } from "@mui/material";
import PaginationItem from "@mui/material/PaginationItem";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import "./style.scss";
export const Prev = () => <span>Previous</span>;
export const Next = () => <span>Next</span>;
function MyPagination({
  data,
  page = 1,
  setPage,
  dataCount,
  setDataCount,
  totalPage,
}: {
  data: any;
  page: number | undefined;
  setPage: any;
  dataCount?: any;
  setDataCount?: any;
  totalPage?: number;
}) {
  const handleChange = (event: SelectChangeEvent) => {
    setDataCount(event.target.value);
  };

  return (
    <div className="pagination_flex_container">
      <div className="entry">
        <p>Show</p>
        <FormControl
          className="select_data_count"
          sx={{ m: 1, minWidth: 120 }}
          size="small"
        >
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={dataCount}
            onChange={handleChange}
          >
            <MenuItem value={"10"}>10</MenuItem>
            <MenuItem value={"25"}>25</MenuItem>
            <MenuItem value={"50"}>50</MenuItem>
            <MenuItem value={"100"}>100</MenuItem>
          </Select>
        </FormControl>{" "}
        <p>Entries</p>
      </div>

      <div className="pagination-wrap">
        {totalPage && totalPage !== 1 && (
          <Pagination
            color="primary"
            page={page || 1}
            onChange={(e, val) => setPage(val)}
            count={totalPage}
            defaultPage={1}
            shape="rounded"
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: Prev, next: Next }}
                {...item}
              />
            )}
          />
        )}
      </div>
    </div>
  );
}

export default MyPagination;

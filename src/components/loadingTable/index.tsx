import { Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const LoadingTable = ({ rows = 10, cols = 4 }) => {
  return (
    <>
      <Box sx={{ width: "100%", mt: 2 }}>
        <Paper
          style={{ boxShadow: "none", borderRadius: "8px" }}
          sx={{ width: "100%", mb: 2 }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <TableBody>
                {Array.from(new Array(rows)).map((el, i) => {
                  return (
                    <TableRow key={"row-" + i} hover role="checkbox">
                      {Array.from(new Array(cols)).map((el, k) => (
                        <TableCell key={"col-" + k} align="left">
                          <Skeleton animation="wave" width="100%" height={20} />
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  );
};

export default LoadingTable;

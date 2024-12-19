import { useState } from "react";
import { IconButton } from "@mui/material";
import { TrashIcon } from "assets/Icons/TrashIcon";
import Chip from "@mui/material/Chip";
import TableComponent from "components/table";

const headCellTest = [
  {
    key: "name",
    name: "Full Name",
  },
  {
    key: "email",
    name: "Email Address",
  },
  {
    key: "status",
    name: "Status",
  },

  {
    key: "number",
    name: "Phone Number",
  },

  {
    key: "date",
    name: "Date joined",
  },
  {
    key: "delete",
    name: "",
  },
];
export const Demo = () => {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | number[]>([]);
  const [dataCount, setDataCount] = useState("25");
  // const [isStart, setIsStart] = useState(true);
  // const [step, setStep] = useState(0);
  return (
    <>
      {/* <JoyRideComponent
        setIsStart={setIsStart}
        setStep={setStep}
        isStart={isStart}
        step={step}
      /> */}
      <div id="table">
        <TableComponent
          // isError={isError}
          page={page}
          setPage={setPage}
          isLoading={false}
          headCells={headCellTest}
          selectMultiple={true}
          selected={selected}
          showPagination={true}
          dataCount={dataCount}
          setDataCount={setDataCount}
          setSelected={setSelected}
          //   meta={admins?._meta.pagination}
          tableData={Array(7)
            .fill("")
            .map((row, i) => ({
              name: "Raji Mustapha",
              email: "reajimustapha30@gmail.com",
              number: "08087525211",
              date: "2/30/1999",
              status: (
                // <Chip color={CHIP_COLOR["PROCESSING" || ""]} label={`Sent`} />
                <Chip color="info" label={`Sent`} />
              ),
              delete: (
                <IconButton
                  type="button"
                  className="icon_button_container"
                  onClick={() => {}}
                >
                  <TrashIcon />
                </IconButton>
              ),
              id: i,
            }))}
        />
      </div>
    </>
  );
};

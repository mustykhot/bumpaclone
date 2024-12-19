import { Button, Chip } from "@mui/material";
import DropDownWrapper from "components/DropDownWrapper";
import { useState, useEffect } from "react";
import "./style.scss";

const DisplayCustomerGroup = ({ groupList = [] }: { groupList?: string[] }) => {
  const [groups, setGroup] = useState<any[]>([]);
  useEffect(() => {
    const newArray = [...groupList.slice(0, 2), groupList.slice(2)];
    setGroup([...newArray]);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {groupList?.length ? (
        <div className="pd_display_cusomer_group">
          {
            // eslint-disable-next-line
            groups.map((item: string | string[], i) => {
              if (typeof item === "string") {
                return <Chip key={i} color="success" label={item} />;
              } else {
                if (item?.length) {
                  return (
                    <DropDownWrapper
                      closeOnChildClick
                      origin="right"
                      action={
                        <Button
                          sx={{
                            color: "#5C636D",
                            backgroundColor: " #EFF2F7",
                          }}
                        >
                          {`+ ${item?.length} more`}
                        </Button>
                      }
                    >
                      <ul className="list_group">
                        {item.map((el, i) => (
                          <li key={i}>{el}</li>
                        ))}
                      </ul>
                    </DropDownWrapper>
                  );
                }
              }
            })
          }
        </div>
      ) : (
        <p className="empty_group_list_display">Group List is empty</p>
      )}
    </>
  );
};

export default DisplayCustomerGroup;

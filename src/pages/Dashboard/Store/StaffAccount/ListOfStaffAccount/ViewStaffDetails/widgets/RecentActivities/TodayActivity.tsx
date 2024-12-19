import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import moment from "moment";
import EmptyResponse from "components/EmptyResponse";
import { Skeleton } from "@mui/material";

const TodayActivity = ({activities, isLoading}: any) => {
  const [expanded, setExpanded] = useState<boolean>(true);

  // const today = new Date().toISOString().split('T')[0];

  // const filteredData = activities?.filter((item: any) => item.created_at.startsWith(today));


  const handleChange = (checked?: boolean) => {
    if (checked === true || checked === false) {
      setExpanded(checked);
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <div className="pricing_section extra_sections staff-today-activities">
            { isLoading &&  [1, 2, 3].map((item) =>
        ( 
          <div className="skeleton">
          <Skeleton
            animation="wave"
            width={40}
            height={40}
          />
          <Skeleton
            animation="wave"
            height={20}
            width="100%"
            style={{ marginBottom: 6 }}
          />
          <Skeleton animation="wave" height={20} width="100%" />
        </div> 

        ))

}

{!isLoading &&
      <Accordion
        className="accordion"
        expanded={expanded}
        // onChange={() => {
        //   handleChange();
        // }}
      >
        <AccordionSummary
          className="accordion_summary"
          expandIcon={
            <ChevronDownIcon
              className={expanded ? "chevron-up" : ""}
              // onClick={handleChange}
            />
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <p>All Activities</p>
        </AccordionSummary>
        <AccordionDetails>
        <div className="staff-today-activities-details">
          {(activities && activities.length) ?  activities?.map((item: any) =>  <div className="records">
              <div>{item?.description}</div>
              <div>{moment(item?.created_at).format("MM/DD/YYYY [at] h:mma")}</div>
            </div>) : <EmptyResponse message="No record found" />}
          
          </div>
        </AccordionDetails>
      </Accordion>
}
    </div>
  );
};

export default TodayActivity;

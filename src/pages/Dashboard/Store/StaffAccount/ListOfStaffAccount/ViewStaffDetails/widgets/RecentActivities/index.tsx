import TodayActivity from "./TodayActivity";
import LastWeekActivity from "./LastWeekActivity";
import { useGetStaffActivitiesQuery } from "services";
import "./style.scss";
import { useLocation } from "react-router-dom";
import { Skeleton } from "@mui/material";

const RecentActivities = () => {
  const location = useLocation();
  const details = location?.state?.details;

  const { data, isLoading} = useGetStaffActivitiesQuery({ type: "", id: details?.id });

  return (
    <div className="recent-activities">
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
      <TodayActivity activities={data?.activities?.data} />
      {/* <LastWeekActivity activities={data?.activities?.data} /> */}
    </div>
  );
};

export default RecentActivities;

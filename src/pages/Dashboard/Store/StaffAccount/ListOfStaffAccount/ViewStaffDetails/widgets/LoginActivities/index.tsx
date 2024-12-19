import TodayActivity from "./TodayActivity";
import LastWeekActivity from "./LastWeekActivity";
import { useGetStaffActivitiesQuery } from "services";
import "./style.scss";
import { useLocation } from "react-router-dom";
import { Skeleton } from "@mui/material";

const LoginActivities = () => {
  const location = useLocation();
  const details = location?.state?.details

  const {data, isLoading} = useGetStaffActivitiesQuery({type: "login", id: details?.id})

  return (
    <div className="recent-activities">                  
      <TodayActivity activities={data?.activities?.data} isLoading={isLoading}/>
      {/* <LastWeekActivity activities={data?.activities?.data}/> */}
    </div>
  );
};

export default LoginActivities;

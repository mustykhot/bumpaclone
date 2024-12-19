import EmptyResponse from "components/EmptyResponse";
import Button from "@mui/material/Button";
import { PlusIcon } from "assets/Icons/PlusIcon";
import Staff from "assets/images/StaffAccount.png";
import "./style.scss";
import ListOfStaffAccount from "./ListOfStaffAccount/index";
import { Link } from "react-router-dom";

const StaffAccount = () => {
  //   const [isTaxEmpty, setIsTaxEmpty] = useState(false);

  return (
    <div className={`pd_staff ${true ? "empty" : ""}`}>
      {false ? (
        <EmptyResponse
          message="Add staff to your Bumpa store"
          image={Staff}
          extraText="You cam add your staff to your Bumpa store and assign them permissions."
          btn={
            <div className="empty_btn_box">
              <Button
                component={Link}
                to="add"
                variant="contained"
                startIcon={<PlusIcon />}
              >
                Add new staff
              </Button>
            </div>
          }
        />
      ) : (
        <ListOfStaffAccount />
      )}
    </div>
  );
};

export default StaffAccount;

import { IconButton } from "@mui/material";
import { AvatarIcon } from "assets/Icons/Avatar";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import { Chip } from "@mui/material";
import { removeFirstZero } from "utils";
import { MAil02Icon } from "assets/Icons/Mail02Icon";
import { PhoneIcon } from "assets/Icons/PhoneIcon";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  addCustomerDetails,
  selectCustomerDetails,
} from "store/slice/PosSlice";

const CustomerDetails = () => {
  const dispatch = useAppDispatch();
  const cartCustomer = useAppSelector(selectCustomerDetails);
  return (
    <div>
      <div className="pos_customer_details">
        <div className="">
          <IconButton
            className="pos_pad_icon"
            onClick={() => dispatch(addCustomerDetails(null))}
          >
            <BackArrowIcon />
          </IconButton>

          <div className="customer_card_wrapper">
            <div className="card">
              <h3>Customer Details</h3>
              <div className="avatar">
                <AvatarIcon className="avatar" />
              </div>
              <p className="pos_cust_name">{cartCustomer?.name}</p>
              <p className="pos_duration">
                Customer since:&nbsp;
                {Math.floor(
                  (new Date().getTime() -
                    new Date(cartCustomer?.created_at || "").getTime()) /
                    (1000 * 60 * 60 * 24)
                )}
                &nbsp;days ago
              </p>
              {cartCustomer?.phone && (
                <div className="chip_phone">
                  <Chip
                    icon={<PhoneIcon />}
                    label={cartCustomer?.phone}
                    color="default"
                    className="chip"
                    onClick={() => {
                      window.open(
                        `https://wa.me/234${removeFirstZero(
                          cartCustomer?.phone
                        )}`,
                        "_blank"
                      );
                    }}
                  />
                </div>
              )}
              {cartCustomer?.email && (
                <div className="chip_phone">
                  <Chip
                    icon={<MAil02Icon stroke="#0059DE" />}
                    label={cartCustomer?.email}
                    color="info"
                    className="chip"
                    onClick={() => {
                      window.open(`mailto:${cartCustomer?.email}`, "_blank");
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;

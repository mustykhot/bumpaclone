import { useState } from "react";
import { Button } from "@mui/material";
import { EditIcon } from "assets/Icons/EditIcon";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import "./style.scss";
import { TrashIcon } from "assets/Icons/TrashIcon";
import Avatar from "assets/images/Avatar.png";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import RecentActivities from "./widgets/RecentActivities";
import LoginActivities from "./widgets/LoginActivities";
import VerifiedIcon from "assets/Icons/VerifiedIcon";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import MessageModal from "components/Modal/MessageModal";
import { LoadingButton } from "@mui/lab";
import { useDeleteStaffAccountMutation } from "services";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import { selectUserLocation } from "store/slice/AuthSlice";

const tabList = [
  // { label: "Recent Orders", value: "orders" },
  { label: "Recent Activities", value: "activities" },
  { label: "Login Activities", value: "loginActivities" },
];

const ViewStaffDetails = () => {
  const [tab, setTab] = useState("activities");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const userLocation = useAppSelector(selectUserLocation);

  const location = useLocation();
  const navigate = useNavigate();
  const details = location?.state?.details;
  const [deleteStaffAccount, { isLoading: deleteLoading }] =
    useDeleteStaffAccountMutation();

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const handleDeleteStaff = async () => {
    try {
      const result = await deleteStaffAccount({ id: details?.id });
      if ("data" in result) {
        showToast("Staff Account Deleted Successfully", "success");
        setOpenDeleteModal(false);
        navigate("/dashboard/staff");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <MessageModal
        openModal={openDeleteModal}
        closeModal={() => {
          setOpenDeleteModal(false);
        }}
        icon={<TrashIcon />}
        btnChild={
          <LoadingButton
            disabled={deleteLoading}
            loading={deleteLoading}
            onClick={handleDeleteStaff}
            className="error"
          >
            {!deleteLoading && "Yes, delete"}
          </LoadingButton>
        }
        description="Are you sure you want to delete Staff Account?"
      />
      <div className="staff-details">
        <ModalHeader
          text="Staff Profile"
          button={
            <div className="action_buttons">
              <Button
                startIcon={<EditIcon stroke="#009444" />}
                variant="outlined"
                onClick={() => {
                  navigate(`/dashboard/staff/edit/${details?.id}`, {
                    state: { details },
                  });
                }}
              >
                Edit Profile{" "}
              </Button>{" "}
              <span
                onClick={() => {
                  setOpenDeleteModal(true);
                }}
              >
                <TrashIcon />
              </span>
            </div>
          }
        />

        <div className="staff-details__container">
          <div className="staff-details__left-section">
            <div className="staff-details__staff-profile">
              <div className="user">
                <img src={Avatar} alt="avatar" />
                <div>
                  <h5>{details?.name}</h5>
                  <span>{details?.role}</span>
                </div>
              </div>

              <div className="records-section">
                <div className="records">
                  {" "}
                  <div className="left-child">
                    <div>TOTAL RECORDED ORDERS</div>
                    <div>{details?.order_count}</div>
                  </div>
                  {/* <div className="right-child">
                  <Button variant="contained" component={Link} to="orders">
                    See All Orders
                  </Button>
                </div> */}
                </div>
              </div>
            </div>

            <div className="staff-details__activities">
              <div className="tab_container">
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={tab}
                    onChange={handleChangeTab}
                    variant="scrollable"
                    scrollButtons={false}
                  >
                    {tabList.map((item, i) => (
                      <Tab key={i} value={item.value} label={item.label} />
                    ))}
                  </Tabs>
                </Box>
              </div>

              <div className="tab-content-container">
                {/* {tab === "orders" && <RecentOrders />} */}
                {tab === "activities" && <RecentActivities />}
                {tab === "loginActivities" && <LoginActivities />}
              </div>
            </div>
          </div>
          <div className="staff-details__right-section">
            <div className="staff-details__staff-information">
              <div className="header">
                <h5>Staff Information</h5>
              </div>
              <div className="information-row">
                <div>Staff Role</div>
                <div>{details?.role}</div>
              </div>

              <div className="information-row">
                <div>Email Address</div>
                <div>{details?.email}</div>
              </div>

              <div className="information-row">
                <div>Phone Number</div>
                <div>{details?.phone}</div>
              </div>

              <div className="information-row">
                <div>Date Added</div>
                <div>{moment(details?.created_at).format("L")}</div>
              </div>
              <div className="information-row">
                <div>Staff Location</div>
                <div>
                  {details?.locations
                    ?.map((item: any) => item.name)
                    ?.join(", ")}
                </div>
              </div>
            </div>

            <div className="staff-details__staff-permissions">
              <div className="header">
                <h5>Staff Permissions</h5>
              </div>
              <div className="permissions-row">
                <div>Permissions</div>
                <div className="right-rules">
                  <div className="head1">View</div>
                  <div className="head2">Manage</div>
                </div>
              </div>

              <div className="permissions-row">
                <div>
                  <h5>Products</h5>
                  <p>Staff can view, add and edit Products.</p>
                </div>
                <div className="right-rules">
                  {" "}
                  <div>
                    {details?.permissions?.products?.view ? (
                      <VerifiedIcon />
                    ) : (
                      <div className="dash">-</div>
                    )}
                  </div>
                  <div>
                    {details?.permissions?.products?.manage ? (
                      <VerifiedIcon />
                    ) : (
                      <div className="dash">-</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="permissions-row">
                <div>
                  <h5>Orders</h5>
                  <p>Staff can view, create and edit Orders.</p>
                </div>
                <div className="right-rules">
                  <div>
                    {details?.permissions?.orders?.view ? (
                      <VerifiedIcon />
                    ) : (
                      <div className="dash">-</div>
                    )}
                  </div>
                  <div>
                    {details?.permissions?.orders?.manage ? (
                      <VerifiedIcon />
                    ) : (
                      <div className="dash">-</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="permissions-row">
                <div>
                  <h5>Messaging</h5>
                  <p>Staff can view, send and receive messages.</p>
                </div>

                <div className="right-rules">
                  <div>
                    {details?.permissions?.messaging?.view ? (
                      <VerifiedIcon />
                    ) : (
                      <div className="dash">-</div>
                    )}
                  </div>
                  <div>
                    {details?.permissions?.messaging?.manage ? (
                      <VerifiedIcon />
                    ) : (
                      <div className="dash">-</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="permissions-row">
                <div>
                  <h5>Analytics</h5>
                  <p>Staff can view store analytics.</p>
                </div>

                <div className="right-rules">
                  <div>
                    {details?.permissions?.analytics?.view ? (
                      <VerifiedIcon />
                    ) : (
                      <div className="dash">-</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewStaffDetails;

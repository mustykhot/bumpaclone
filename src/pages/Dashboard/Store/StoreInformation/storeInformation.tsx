import Button from "@mui/material/Button";
import { EditIcon } from "assets/Icons/EditIcon";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { useState, useEffect } from "react";
import { useGetStoreInformationQuery } from "services";
import Loader from "components/Loader";
import "./style.scss";
import EditInformation from "./editInformation";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "store/store.hooks";
import { selectCurrentStore } from "store/slice/AuthSlice";

export const StoreInformation = () => {
  const [isView, setIsView] = useState(true);
  // const { data, isLoading } = useGetStoreInformationQuery();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const access_token = searchParams.get("edit");
  const userStore = useAppSelector(selectCurrentStore);
  const edit = searchParams.get("edit");
  const navigate = useNavigate();
  useEffect(() => {
    if (edit) {
      setIsView(false);
      setTimeout(() => {
        searchParams.delete("edit"); // Remove param2 from the URL
        const newUrl = `${window.location.origin}${
          window.location.pathname
        }?${searchParams.toString()}`;
        window.history.replaceState(null, "", newUrl);
      }, 500);
    }
  }, [edit]);
  return (
    <>
      <div className="pd_google_business_profile">
        <ModalHeader
          text="Store Information"
          closeModal={() => {
            navigate("/dashboard");
          }}
          button={
            <div className="button_flex">
              <Button
                variant="outlined"
                startIcon={<EditIcon stroke="#009444" />}
                onClick={() => {
                  navigate("edit");
                }}
              >
                Edit Store Information
              </Button>
            </div>
          }
        />

        <div className="profile_container">
          <div className="left_section">
            <div className="details_container">
              <div className="about_store">
                <img src={userStore?.logo_url} alt="store" />
                <div className="text_box">
                  <h3>{userStore?.name}</h3>
                  {/* <p>Business Category: Fashion Industry</p> */}
                </div>
              </div>
              <div className="store_description tag_line">
                <h3>Business Name</h3>
                <p>{userStore?.business_name}</p>
              </div>
              <div className="store_description tag_line">
                <h3>Store Tagline</h3>
                <p>{userStore?.subtitle}</p>
              </div>
              <div className="store_description">
                <h3>Store Description</h3>
                <p>{userStore?.description}</p>
              </div>
            </div>
          </div>
          <div className="right_section">
            <div className="store_container">
              <h3>Store Information</h3>
              <div className="info_box">
                <div className="single_info">
                  <p className="light">Contact Phone</p>
                  <p className="bold">{userStore?.phone}</p>
                </div>
                <div className="single_info">
                  <p className="light">Address</p>
                  <p className="bold">{userStore?.address_formatted}</p>
                </div>{" "}
                <div className="single_info">
                  <p className="light">Zip-code </p>
                  <p className="bold">{userStore?.address?.zip}</p>
                </div>{" "}
                <div className="single_info">
                  <p className="light">Store Currency</p>
                  <p className="bold">{userStore?.currency}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

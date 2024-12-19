import { useState } from "react";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { Button } from "@mui/material";
import storefront from "assets/images/store-front.svg";
import "./style.scss";
import InputField from "components/forms/InputField";
import { useParams } from "react-router-dom";
import { useGetMarketPlaceSingleThemeQuery } from "services";
import ErrorMsg from "components/ErrorMsg";
import Loader from "components/Loader";
import { formatPrice } from "utils";

const pageList = ["Homepage", "Product Details"];
const PreviewTheme = () => {
  const { id } = useParams();
  const [pageView, setPageView] = useState("Homepage");
  const [coupon, setCoupon] = useState("");
  const {
    data: singleThemeData,
    isLoading: loadSingleTheme,
    isError: singleThemeError,
  } = useGetMarketPlaceSingleThemeQuery(`${id}`);

  if (singleThemeError) {
    return <ErrorMsg message="Something went wrong" />;
  }
  return (
    <>
      {loadSingleTheme && <Loader />}
      {singleThemeData && (
        <div className="pd_preview_theme">
          <ModalHeader text="Theme Preview" />
          <div className="page_btn_flex">
            {pageList.map((item) => (
              <Button
                onClick={() => {
                  setPageView(item);
                }}
                className={`${pageView === item ? "active" : ""}`}
              >
                {item}
              </Button>
            ))}
          </div>
          <div className="image_flex">
            <div className="image_box">
              <div className="page_btn_flex image">
                {pageList.map((item) => (
                  <Button
                    onClick={() => {
                      setPageView(item);
                    }}
                    className={`${pageView === item ? "active" : ""}`}
                  >
                    {item}
                  </Button>
                ))}
              </div>
              <img
                src={
                  pageView === "Homepage"
                    ? singleThemeData.preview_image
                    : singleThemeData.secondary_image
                }
                alt="preview"
              />
            </div>
            <div className="purchase_container">
              <div className="cover_purchase">
                <h3>Purchase Theme</h3>
                <div className="price_box">
                  <p className="price">Price</p>
                  <p className="amount">
                    {formatPrice(Number(singleThemeData?.price))}
                  </p>
                  <div className="coupon_box">
                    <InputField
                      label="Add Coupon Code"
                      onChange={(e) => {
                        setCoupon(e.target.value);
                      }}
                      placeholder="Enter Coupon"
                      suffix={<Button>Apply</Button>}
                    />
                  </div>
                </div>
                <Button className="primary_styled_button" variant="contained">
                  Buy Theme
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreviewTheme;

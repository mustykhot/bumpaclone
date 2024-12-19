import { useState, useEffect } from "react";
import "./style.scss";
import { Button } from "@mui/material";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { Link, useLocation } from "react-router-dom";
import { CouponTable } from "./widgets/CouponTable";
import { DiscountTable } from "./widgets/DiscountTable";

const mainTab = [
  {
    name: "Discounts",
    value: "discounts",
  },
  {
    name: "Coupons",
    value: "coupons",
  },
];
const Discounts = () => {
  const [tab, setTab] = useState("discounts");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlTab = searchParams.get("tab");

  useEffect(() => {
    if (urlTab) {
      setTab(urlTab);
    } else {
      setTab("discounts");
    }
  }, [urlTab]);

  return (
    <>
      <div className={`pd_discounts ${false ? "empty" : ""}`}>
        <div className="discounts_container">
          <div className="title_section">
            <h3 className="name_of_section">Discounts & Coupons</h3>
            {tab === "discounts" ? (
              <div className="btn_flex">
                <Button
                  startIcon={<PlusIcon />}
                  className="btn_pry primary_styled_button"
                  variant={"contained"}
                  component={Link}
                  to="create-discount"
                >
                  Create new discount
                </Button>
              </div>
            ) : (
              <Button
                component={Link}
                to="create-coupon"
                variant="contained"
                className="primary_styled_button"
                startIcon={<PlusIcon />}
              >
                Create new coupon
              </Button>
            )}
          </div>
          <div className="table_section tabbed">
            <div className="table_tab_container">
              {mainTab.map((item, i) => {
                return (
                  <Button
                    key={i}
                    onClick={() => {
                      setTab(item.value);
                      const newUrl = `${window.location.origin}${window.location.pathname}?tab=${item.value}`;
                      window.history.replaceState(null, "", newUrl);
                    }}
                    className={`${tab === item.value ? "active" : ""}`}
                  >
                    {item.name}
                  </Button>
                );
              })}
            </div>
            {tab === "discounts" && (
              <>
                <DiscountTable />
              </>
            )}
            {tab === "coupons" && (
              <>
                <CouponTable />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Discounts;

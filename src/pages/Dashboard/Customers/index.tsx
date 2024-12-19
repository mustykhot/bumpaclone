import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, CircularProgress, Skeleton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { MAil2Icon } from "assets/Icons/Mail2Icon";
import { CustomerIcon } from "assets/Icons/Sidebar/CustomerIcon";
import { User01Icon } from "assets/Icons/User01Icon";
import { CheckCircleLargeIcon } from "assets/Icons/CheckCircleLarge";
import { ExportCSVIcon } from "assets/Icons/ExportCSVIcon";
import MessageModal from "components/Modal/MessageModal";
import { UpgradeModal } from "components/UpgradeModal";
import { SummaryCard } from "components/SummaryCard";
import { SuccessfulConnectionModal } from "../ConnectedApps/widgets/Modals/SuccessfulConnectionModal";
import { CustomerTable } from "./widgets/CustomerTable";
import { CustomerGroupTable } from "./widgets/CustomerGroupTable";
import { NewsLetterTable } from "./widgets/NewsLetterTable";
import { useAllAnalyticsSummaryQuery, useExportCsvMutation } from "services";
import { formatNumber, handleError } from "utils";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
  selectToken,
} from "store/slice/AuthSlice";
import { useAppSelector } from "store/store.hooks";
import "./style.scss";

const tableTab = [
  {
    name: "Customers",
    value: "customers",
  },
  {
    name: "Customer Groups",
    value: "group",
  },
  {
    name: "Newsletter",
    value: "newsletter",
  },
];

const tableHeaders = ["Customer ID", "Date Added", "Name", "Email", "Phone"];
export const Customers = () => {
  // table actions
  const [tab, setTab] = useState("customers");

  const [loadDownload, setLoadDownload] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlTab = searchParams.get("tab");
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const { data: analytics, isLoading: analyticsLoading } =
    useAllAnalyticsSummaryQuery({ type: "customers" });
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const token = useAppSelector(selectToken);
  const [exportCsv, { isLoading }] = useExportCsvMutation();
  const [openExportedModal, setOpenExportedModal] = useState(false);

  const handleDownloadCSV = async () => {
    try {
      let result = await exportCsv();
      if ("data" in result) {
        setOpenDownloadModal(false);
        setOpenExportedModal(true);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddGroup = () => {
    navigate("creategroup");
  };

  const handleDownload = () => {
    if (isSubscriptionExpired) {
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
    }

    if (
      isSubscriptionType === "growth" ||
      isSubscriptionType === "trial" ||
      isSubscriptionType === "pro"
    ) {
      setOpenDownloadModal(true);
    } else {
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
    }
  };

  useEffect(() => {
    if (urlTab) {
      setTab(urlTab);
    } else {
      setTab("customers");
    }
  }, [urlTab]);

  return (
    <div className={`pd_customers ${false ? "empty" : ""}`}>
      <MessageModal
        openModal={openExportedModal}
        closeModal={() => {
          setOpenExportedModal(false);
        }}
        icon={<CheckCircleLargeIcon />}
        description="Your Customer Details export is successful and has been sent to your email for easy download."
      />
      <SuccessfulConnectionModal
        btnAction={() => {
          setOpenExportedModal(false);
        }}
        openModal={openExportedModal}
        closeModal={() => {
          setOpenExportedModal(false);
        }}
        btnText="Close"
        title="Export CSV Complete"
        description="Your Customer Details export is successful and has been sent to your email for easy download."
        reduceSpacing={true}
      />
      <MessageModal
        openModal={openDownloadModal}
        closeModal={() => {
          setOpenDownloadModal(false);
        }}
        icon={<ExportCSVIcon stroke="#5C636D" />}
        btnChild={
          <Button
            onClick={() => {
              handleDownloadCSV();
            }}
            className="primary_styled_button"
            variant="contained"
          >
            {isLoading ? (
              <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
            ) : (
              "Yes, Download"
            )}{" "}
          </Button>
        }
        description="Export all customers"
      />
      {openUpgradeModal && (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          pro={isProUpgrade}
          title={`Export Your Customer List Into a CSV`}
          subtitle={`Export your Customer details into a file you can easily convert.`}
          proFeatures={[
            "Download your customer list into a CSV",
            "Export Product & Order details into CSV",
            "Create 20 customer groups to send targeted marketing campaigns",
            "Send up to 500 invoices/receipts monthly",
          ]}
          growthFeatures={[
            "Download your customer list into a CSV",
            "Export Product & Order details into CSV",
            "Create 100 customer groups to send targeted marketing campaigns",
            "Send unlimited invoices/receipts.",
          ]}
          eventName="export-customer-csv"
        />
      )}
      <div className="customers_container">
        <div className="title_section">
          <h3 className="name_of_section">Customers</h3>
          <div className="btn_flex">
            {tab === "customers" && (
              <>
                <Button
                  variant="outlined"
                  onClick={handleDownload}
                  className="thick_border"
                  startIcon={<ExportCSVIcon />}
                >
                  Export CSV
                </Button>
              </>
            )}
            {tab === "group" && (
              <Button
                startIcon={<AddIcon />}
                className="btn_pry primary_styled_button"
                variant={"contained"}
                onClick={handleAddGroup}
              >
                Add Group
              </Button>
            )}
            {tab === "customers" && (
              <Button
                startIcon={<AddIcon />}
                className="btn_pry primary_styled_button"
                variant={"contained"}
                onClick={() => {
                  navigate("create");
                }}
              >
                Add new customer
              </Button>
            )}
          </div>
        </div>

        <div className="summary_section">
          {analyticsLoading ? (
            [1, 2, 3, 4].map((item) => (
              <div key={item} className="summary_skeleton">
                <Skeleton animation="wave" width={"100%"} />
                <Skeleton animation="wave" width={"100%"} />
                <Skeleton animation="wave" width={"100%"} />
              </div>
            ))
          ) : (
            <>
              {" "}
              <SummaryCard
                count={
                  analytics && analytics[0] && analytics[0]?.value
                    ? formatNumber(Number(analytics[0]?.value))
                    : 0
                }
                title={
                  analytics && analytics[0] && analytics[0]?.title
                    ? analytics[0]?.title
                    : "Total Customers"
                }
                icon={<User01Icon />}
                color={"green"}
              />
              <SummaryCard
                count={
                  analytics && analytics[1] && analytics[1]?.value
                    ? formatNumber(Number(analytics[1]?.value))
                    : 0
                }
                title={
                  analytics && analytics[1] && analytics[1]?.title
                    ? analytics[1]?.title
                    : "Customer Group"
                }
                icon={<CustomerIcon isActive={true} stroke="#0059DE" />}
                color={"blue"}
              />
              <SummaryCard
                count={
                  analytics && analytics[2] && analytics[2]?.value
                    ? formatNumber(Number(analytics[2]?.value))
                    : 0
                }
                title={
                  analytics && analytics[2] && analytics[2]?.title
                    ? analytics[2]?.title
                    : "Newsletter Subscribers"
                }
                icon={<MAil2Icon />}
                color={"yellow"}
              />
            </>
          )}
        </div>

        <div className="table_section tabbed">
          <div className="table_tab_container">
            {tableTab.map((item, i) => {
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
          {tab === "customers" && <CustomerTable />}
          {tab === "group" && <CustomerGroupTable />}
          {tab === "newsletter" && <NewsLetterTable />}
        </div>
      </div>
    </div>
  );
};

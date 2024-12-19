import moment from "moment";
import Button from "@mui/material/Button";
import { CircularProgress, Skeleton } from "@mui/material";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import { DownloadIcon } from "assets/Icons/DownloadIcon";
import { ExportCSVIcon } from "assets/Icons/ExportCSVIcon";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { StockIcon } from "assets/Icons/StockIcon";
import { TagIcon } from "assets/Icons/Sidebar/TagIcon";
import { Tag03Icon } from "assets/Icons/Tag03Icon";
import { TagMinusIcon } from "assets/Icons/TagMinusIcon";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { NairaIcon } from "assets/Icons/NairaIcon";
import MessageModal from "components/Modal/MessageModal";
import { SummaryCard } from "components/SummaryCard";
import { UpgradeModal } from "components/UpgradeModal";
import { PermissionsType } from "Models";
import { useAllAnalyticsSummaryQuery, useGetProductQuery } from "services";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
  selectPermissions,
  selectToken,
  selectUserLocation,
} from "store/slice/AuthSlice";
import { showToast, useAppSelector } from "store/store.hooks";
import {
  formatNumber,
  formatPrice,
  getCurrencyFnc,
  translateStatus,
} from "utils";
import { API_URL, thisYearEnd, thisYearStart } from "utils/constants/general";
import { InventoryTable } from "./widget/InventoryTable";
import { CollectionTable } from "./widget/CollectionTable";

const tableTab = [
  {
    name: "Inventory",
    value: "inventory",
  },
  {
    name: "Collections",
    value: "collections",
  },
];
const tableHeaders = [
  "Product ID",
  "Product Name",
  "Collection",
  "Variations",
  "Stock Quantity",
  "Price",
  "Status",
];

export const Products = () => {
  const [tab, setTab] = useState<string | null>(null);
  const [loadDownload, setLoadDownload] = useState(false);
  const userLocation = useAppSelector(selectUserLocation);

  const navigate = useNavigate();
  const {
    data: analytics,
    isLoading: analyticsLoading,
    refetch: refetchAnalytics,
  } = useAllAnalyticsSummaryQuery({
    type: "products",
    location_id: userLocation?.id,
  });
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlTab = searchParams.get("tab");
  const userPermission: PermissionsType = useAppSelector(selectPermissions);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const canManageProducts = isStaff ? userPermission?.products?.manage : true;
  const token = useAppSelector(selectToken);

  useEffect(() => {
    if (userPermission !== undefined) {
      setIsStaff(true);
    } else {
      setIsStaff(false);
    }
  }, [userPermission]);

  const handleDownloadCSV = async () => {
    try {
      setLoadDownload(true);
      const response = await fetch(
        `${API_URL}v2/products?location_id=${userLocation?.id}&limit=1000000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const data = await response.json();
      if (data && data?.products?.data && data?.products?.data.length) {
        let productList = data?.products?.data;
        const csvData = [
          tableHeaders,
          ...productList.map((row: any) => [
            row.id,
            row.title,
            row.tags,
            row.variations.length,
            row.quantity,
            row.price_formatted,
            translateStatus(row.status)?.label,
          ]),
        ];
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "products.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setLoadDownload(false);
        setOpenDownloadModal(false);
      }
    } catch (error) {
      setLoadDownload(false);
      showToast("Something went wrong", "error");
    }
  };

  const handleDownload = () => {
    if (isSubscriptionExpired) {
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
    }

    if (
      isSubscriptionType === "growth" ||
      isSubscriptionType === "pro" ||
      isSubscriptionType === "trial"
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
      setTab("inventory");
    }
  }, [urlTab]);

  return (
    <>
      <div className={`pd_products ${false ? "empty" : ""}`}>
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
              {loadDownload ? (
                <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
              ) : (
                "Yes, Download"
              )}
            </Button>
          }
          description="Download all products"
        />

        <div className="products_container">
          <div className="title_section">
            <h3 className="name_of_section">Products</h3>
            {canManageProducts &&
              (tab === "inventory" ? (
                <div className="btn_flex">
                  <Button
                    variant="outlined"
                    onClick={handleDownload}
                    className="thick_border"
                    startIcon={<ExportCSVIcon />}
                  >
                    Export CSV
                  </Button>

                  <Button
                    startIcon={<PlusIcon />}
                    className="btn_pry primary_styled_button"
                    variant={"contained"}
                    onClick={() => navigate("create")}
                  >
                    Add new product
                  </Button>
                </div>
              ) : (
                <Button
                  component={Link}
                  to="create-collection"
                  variant="contained"
                  startIcon={<PlusIcon />}
                  className="primary_styled_button"
                >
                  Create collection
                </Button>
              ))}
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
                <SummaryCard
                  count={
                    analytics && analytics[0] && analytics[0]?.value
                      ? analytics[0]?.value
                      : 0
                  }
                  title={
                    analytics && analytics[0] && analytics[0]?.title
                      ? analytics[0]?.title
                      : "Total Inventory Value"
                  }
                  icon={
                    <p className="text-[#000000] font-semibold text-[20px]">
                      {getCurrencyFnc()}
                    </p>
                  }
                  color={"blue"}
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
                      : "Product Sold"
                  }
                  icon={<TagMinusIcon />}
                  color={"red"}
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
                      : "Out Of Stock"
                  }
                  icon={<StockIcon stroke="#0059DE" />}
                  color={"blue"}
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
                    className={`${tab === item.value ? "active" : ""} `}
                  >
                    {item.name}
                  </Button>
                );
              })}
            </div>
            {tab === "inventory" && (
              <InventoryTable refetchAnalytics={refetchAnalytics} />
            )}
            {tab === "collections" && <CollectionTable />}
          </div>
        </div>
      </div>
      {openUpgradeModal && (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          pro={isProUpgrade}
          title={`Exports your Product List into CSV`}
          subtitle={`View your products breakdown better in a CSV.`}
          proFeatures={[
            "Download up to 500 Products List into a CSV",
            "No barcode generator/scanner software",
            "Get and compare Product Analytics",
            "No multilocation Product download",
          ]}
          growthFeatures={[
            "Download unlimited Product list into a CSV",
            "Generate unique barcodes for your products",
            "Get and compare Product Analytics.",
            "Download Products from different locations into a CSV",
          ]}
          eventName="export-product-csv"
        />
      )}
    </>
  );
};

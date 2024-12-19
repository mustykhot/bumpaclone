import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Chip, MenuItem, Select } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";

import { SendIcon } from "assets/Icons/SendIcon";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { CoinIcon } from "assets/Icons/CoinIcon";
import message from "assets/images/message.png";
import { Tag03Icon } from "assets/Icons/Tag03Icon";
import { TagIcon } from "assets/Icons/Sidebar/TagIcon";

import Loader from "components/Loader";
import { SummaryCard } from "components/SummaryCard";
import EmptyResponse from "components/EmptyResponse";
import TableComponent from "components/table";
import InputField from "components/forms/InputField";
import PageUpdateModal from "components/PageUpdateModal";
import { ViewCampaign } from "./widgets/ViewCampaign";
import { PurchaseCreditModal } from "./PurchaseCredit";

import {
  useGetCampaignsQuery,
  useGetLoggedInUserQuery,
  useGetStoreInformationQuery,
  useSetAppFlagMutation,
} from "services";
import { ICampaign } from "Models/marketing";
import { formatNumber, handleError } from "utils";
import { PAGEUPDATEVERSIONS } from "utils/constants/general";

import "./style.scss";
import InfoBox from "components/InfoBox";

const productPageUpdates: { title: string; description: string }[] = [
  {
    title: "View Reports:",
    description:
      "View final updates on SMS that have been Sent, Delivered, Failed or Rejected, twelve hours after sending the campaign through the View Report button.",
  },
  {
    title: "Resend SMS",
    description:
      "Only resend Failed messages after 12 hours of sending the first campaign.",
  },
  {
    title: "Learn More",
    description: "Read more about SMS best practices on our blog.",
  },
];

const headCell = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "title",
    name: "Campaign Title",
  },
  {
    key: "sent",
    name: "Sent ",
  },
  {
    key: "waiting",
    name: "Waiting ",
  },
  {
    key: "unsuccessful",
    name: "Unsuccessful",
  },
  {
    key: "recipient",
    name: "Recipient",
  },

  {
    key: "channel",
    name: "Channel",
  },
];

export const Marketing = () => {
  const [setAppFlag, { isLoading: loadFlag }] = useSetAppFlagMutation();
  const { data: userData } = useGetLoggedInUserQuery();

  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | number[]>([]);
  const [dataCount, setDataCount] = useState("25");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState({} as ICampaign);
  const [smsCount, setSmsCount] = useState(0);
  const [emailCount, setEmailCount] = useState(0);
  const [channel, setChannel] = useState("");
  const [search, setSearch] = useState("");
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const {
    data: storeData,
    isLoading: loadStore,
    isFetching: fetchStore,
    refetch,
  } = useGetStoreInformationQuery();

  const { data, isLoading, isFetching, isError } = useGetCampaignsQuery({
    search: search,
    channel: channel,
  });

  const { data: campaignData } = useGetCampaignsQuery({
    search: "",
    channel: "",
  });

  const updateAppFlag = async () => {
    let payload = {
      ...userData?.app_flags,
      webapp_updates: {
        ...userData?.app_flags?.webapp_updates,
        campaign_page: {
          version: PAGEUPDATEVERSIONS.CAMPAINGPAGE,
          status: true,
        },
      },
    };
    try {
      let result = await setAppFlag(payload);
      if ("data" in result) {
        setOpenUpdateModal(false);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
    setOpenUpdateModal(false);
  };

  useEffect(() => {
    if (data) {
      let smslength = data?.campaigns.filter(
        (item: any) => item.type === "sms"
      ).length;
      let emaillength = data?.campaigns.filter(
        (item: any) => item.type === "email"
      ).length;
      setSmsCount(smslength);
      setEmailCount(emaillength);
    }
  }, [data]);

  useEffect(() => {
    if (userData) {
      if (
        userData?.app_flags?.webapp_updates?.campaign_page?.version ===
        PAGEUPDATEVERSIONS.CAMPAINGPAGE
      ) {
        if (userData?.app_flags?.webapp_updates?.campaign_page?.status) {
          setOpenUpdateModal(false);
        } else {
          setOpenUpdateModal(true);
        }
      } else {
        setOpenUpdateModal(true);
      }
    }
  }, [userData]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      {(loadStore || fetchStore) && <Loader />}

      <ViewCampaign
        openModal={isViewOpen}
        closeModal={() => {
          setIsViewOpen(false);
        }}
        activeData={activeCampaign}
      />

      <PurchaseCreditModal
        openModal={openPurchaseModal}
        closeModal={() => {
          setOpenPurchaseModal(false);
        }}
      />

      <div
        className={`pd_marketing ${
          data?.campaigns.length === 0 && !search && !channel ? "empty" : ""
        } `}
      >
        {data?.campaigns.length === 0 && !search && !channel ? (
          <EmptyResponse
            message="Start a campaign"
            image={message}
            extraText="You can send campaign messages to your customers."
            // btn={
            //   <Button
            //     sx={{
            //       padding: "12px 24px",
            //     }}
            //     variant="contained"
            //     startIcon={<SendIcon />}
            //     component={Link}
            //     to="create"
            //   >
            //     Send your first campaign
            //   </Button>
            // }
          />
        ) : (
          <div className="marketing_container">
            <InfoBox
              color="yellow"
              text={
                "Sending campaigns are currently disabled due to ongoing checks. Please revisit later "
              }
            />
            <div className="title_section">
              <h3 className="name_of_section">Campaigns</h3>
              {/* <Button
                startIcon={<AddIcon />}
                component={Link}
                to="create"
                variant={"contained"}
                className="primary_styled_button"
              >
                New Campaign
              </Button> */}
            </div>
            <div className="credit_container">
              <div className="allocated">
                <CoinIcon />
                <p>
                  Allocated Credits:{" "}
                  <span>
                    {formatNumber(
                      Number(storeData?.store?.message_credits || 0)
                    )}
                  </span>
                </p>
              </div>
              <div className="purchased">
                <p>
                  Purchased Credit:{" "}
                  <span>
                    {formatNumber(
                      Number(storeData?.store?.purchased_messaging_credits || 0)
                    )}
                  </span>
                </p>
                <Button
                  variant="outlined"
                  onClick={() => setOpenPurchaseModal(true)}
                >
                  Get Credit
                </Button>
              </div>
            </div>

            <div className="summary_section">
              <SummaryCard
                count={
                  campaignData
                    ? formatNumber(Number(campaignData?.campaigns.length))
                    : 0
                }
                title={"Total Campaigns"}
                icon={<Tag03Icon />}
                color={"green"}
                handleClick={() => {
                  setChannel("");
                }}
              />
              <SummaryCard
                count={formatNumber(Number(emailCount))}
                title={"Total Email Campaigns"}
                icon={<TagIcon isActive={true} stroke="#0059DE" />}
                color={"blue"}
                handleClick={() => {
                  setChannel("email");
                }}
              />
              <SummaryCard
                count={formatNumber(Number(smsCount))}
                title={"Total Sms Campaigns"}
                icon={<TagIcon isActive={true} stroke="#FFB60A" />}
                color={"yellow"}
                handleClick={() => {
                  setChannel("sms");
                }}
              />
            </div>

            <div className="table_section">
              <div className="table_action_container">
                <div className="left_section"></div>

                <div className="search_container">
                  <Select
                    displayEmpty
                    value={channel}
                    onChange={(e) => {
                      setChannel(e.target.value);
                    }}
                    className="my-select"
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem disabled value="">
                      Filter by Channel{" "}
                    </MenuItem>
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="sms">SMS </MenuItem>
                  </Select>
                  <InputField
                    type={"text"}
                    containerClass="search_field"
                    value={search}
                    onChange={(e: any) => {
                      setSearch(e.target.value);
                    }}
                    placeholder="Search"
                    suffix={<SearchIcon />}
                  />
                </div>
              </div>
              <TableComponent
                isError={isError}
                page={page}
                align="center"
                setPage={setPage}
                isLoading={isLoading || isFetching}
                headCells={headCell}
                selectMultiple={false}
                selected={selected}
                showPagination={false}
                dataCount={dataCount}
                setDataCount={setDataCount}
                setSelected={setSelected}
                handleClick={(row: any, rowIndex: number) => {
                  setIsViewOpen(true);
                  setActiveCampaign(data?.campaigns[rowIndex] as ICampaign);
                }}
                tableData={data?.campaigns.map((row, i) => ({
                  date: moment(row.created_at).format("L"),
                  title: row.name,
                  sent: row.sent,
                  waiting: row.waiting,
                  unsuccessful: row.unsuccessful,
                  recipient: row.recipients_count,
                  channel: <Chip color="info" label={row.type} />,
                  type: row.type,
                }))}
              />
            </div>
          </div>
        )}
      </div>

      <PageUpdateModal
        updates={productPageUpdates}
        openModal={openUpdateModal}
        isLoading={loadFlag}
        size={"large"}
        btnAction={() => {
          window.open(
            "https://www.getbumpa.com/blog/sending-bulk-sms-to-your-customers-is-now-better-on-bumpa",
            "_blank"
          );
        }}
        closeModal={() => {
          updateAppFlag();
        }}
      />
    </>
  );
};

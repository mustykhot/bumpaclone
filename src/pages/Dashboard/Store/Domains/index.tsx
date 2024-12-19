import { Button, Chip, IconButton, MenuItem, Select } from "@mui/material";
import "./style.scss";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Link02Icon } from "assets/Icons/Link02Icon";
import { EditIcon } from "assets/Icons/EditIcon";
import EmptyResponse from "components/EmptyResponse";
import domain from "assets/images/domain.png";
import { EditDefaultUrlModal } from "./EditDefaultUrl";
import { useEffect, useState } from "react";
import { showToast, useAppSelector } from "store/store.hooks";
import { selectCurrentStore } from "store/slice/AuthSlice";
import InputField from "components/forms/InputField";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { LinkBrokenIcon } from "assets/Icons/LinkBrokenIcon";
import TableComponent from "components/table";
import { GlobeIcon } from "assets/Icons/Sidebar/GlobeIcon";
import moment from "moment";
import { useGetDomainListQuery } from "services";
import Lottie from "react-lottie";
import { defaultOptions } from "utils/constants/general";

const headCell = [
  {
    key: "icon",
    name: "",
  },
  {
    key: "domains",
    name: "Domains",
  },
  {
    key: "status",
    name: "Status",
  },
  {
    key: "registered_date",
    name: "Registered Date",
  },
  {
    key: "expiry_date",
    name: "Expiry Date",
  },
];

export const Domains = () => {
  const [openEditDefaultUrl, setOpenEditDefaultUrl] = useState(false);
  const [page, setPage] = useState(1);
  const [dataCount, setDataCount] = useState("25");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [play, setPlay] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const statusUrl = searchParams.get("status");
  const userStore = useAppSelector(selectCurrentStore);
  const { data, isLoading, isFetching, isError } = useGetDomainListQuery({
    limit: Number(dataCount),
    id: userStore?.id || "",
    page,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (statusUrl) {
      if (statusUrl === "success") {
        setPlay(true);
        setTimeout(() => {
          setPlay(false);
          searchParams.delete("status");
          const newUrl = `${window.location.origin}${
            window.location.pathname
          }?${searchParams.toString()}`;
          window.history.replaceState(null, "", newUrl);
        }, 2000);
      } else if (statusUrl === "failed") {
        showToast("Payment Unsuccessful", "error");
        setTimeout(() => {
          navigate("buy");
        }, 1000);
      }
    }
    // eslint-disable-next-line
  }, [statusUrl]);

  return (
    <>
      {play && (
        <div className="lottie_absolute_div">
          <Lottie
            isStopped={!play}
            options={defaultOptions}
            height={"100%"}
            width={"100%"}
          />
        </div>
      )}
      <div className="pd_domains">
        <div className="title_section">
          <div className="left_side">
            <h3 className="name_of_section">Domain</h3>
            <p className="page_description">
              Give your website that unique and memorable URL
            </p>
          </div>
          <div className="btn_flex">
            <Button
              startIcon={<Link02Icon />}
              onClick={() => {
                navigate("connect");
              }}
              variant={"outlined"}
            >
              Connect domain
            </Button>
            <Button
              startIcon={<PlusIcon />}
              variant={"contained"}
              className="primary_styled_button"
              onClick={() => {
                navigate("buy");
              }}
            >
              Buy domain
            </Button>
          </div>
        </div>

        <div className="display_default_domain">
          <div className="left_side">
            <p className="url">Bumpa URL</p>
            <div className="link">
              <Link
                to={
                  userStore?.domain
                    ? `${userStore?.url_link}`
                    : `https://${userStore?.subdomain}.bumpa.shop`
                }
                target="_blank"
              >
                {userStore?.domain
                  ? `${userStore?.url_link}`
                  : `${userStore?.subdomain}.bumpa.shop`}
              </Link>
            </div>
          </div>
          {/* <Button
            onClick={() => {
              setOpenEditDefaultUrl(true);
            }}
            startIcon={<EditIcon stroke="#5C636D" />}
          >
            Edit URL
          </Button> */}
        </div>

        {false ? (
          <div className="empty_wrapper">
            <EmptyResponse
              message="Custom Domain"
              image={domain}
              extraText="You don’t have any domain connected to your Bumpa Store."
              btn={
                <div className="empty_btn_box">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      navigate("connect");
                    }}
                    startIcon={<Link02Icon />}
                  >
                    Connect Domain
                  </Button>
                  <Button
                    className="primary_styled_button"
                    variant="contained"
                    startIcon={<PlusIcon />}
                    onClick={() => {
                      navigate("buy");
                    }}
                  >
                    Buy Domain
                  </Button>
                </div>
              }
            />
          </div>
        ) : (
          <div className="table_section">
            <div className="table_action_container">
              <div className="left_section">
                <p className="domain_table_title">Custom Domains</p>
              </div>
              {/* <div className="search_container">
                <Select
                  displayEmpty
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                  className="my-select dark"
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem disabled value="">
                    Filter by Status
                  </MenuItem>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
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
              </div> */}
            </div>

            <TableComponent
              isError={isError}
              isLoading={isLoading || isFetching}
              page={page}
              setPage={setPage}
              headCells={headCell}
              selectMultiple={false}
              showPagination={true}
              dataCount={dataCount}
              setDataCount={setDataCount}
              handleClick={(row: any) => {
                  navigate(`${row.id}`);
              }}
              meta={{
                current: data?.meta?.current_page,
                perPage: data?.meta?.per_page,
                totalPage: data?.meta?.last_page,
              }}
              tableData={data?.data.map((row: any, i: number) => ({
                icon: (
                  <IconButton
                    className={`icon_button_container ${false ? "active" : ""}`}
                  >
                    {userStore?.domain === row.domain_name ? (
                      <GlobeIcon isActive={true} stroke="#ffffff" />
                    ) : (
                      <LinkBrokenIcon stroke="#848D99" />
                    )}
                  </IconButton>
                ),
                domains: (
                  <p className="isConnect">
                    {row.domain_name}
                    {userStore?.domain === row.domain_name ? (
                      <span className="connected_tag">Published</span>
                    ) : (
                      ""
                    )}{" "}
                  </p>
                ),
                registered_date: row.registration_date
                  ? moment(row.registration_date).format("ll")
                  : "",
                expiry_date: row.domain_expires_a
                  ? moment(row.domain_expires_at).format("ll")
                  : "",
                status: (
                  <Chip
                    color={row.status === "active" ? "success" : "error"}
                    label={row.status}
                  />
                ),
                plain_status: row.status,
                id: row.id,
              }))}
            />
          </div>
        )}
      </div>

      <EditDefaultUrlModal
        openModal={openEditDefaultUrl}
        closeModal={() => {
          setOpenEditDefaultUrl(false);
        }}
      />
    </>
  );
};

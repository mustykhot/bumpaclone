import { Button, CircularProgress, IconButton, Skeleton } from "@mui/material";
import { XCircleIcon } from "assets/Icons/XCircleIcon";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { useNavigate, useParams } from "react-router-dom";
import "./style.scss";
import { GlobeIcon } from "assets/Icons/Sidebar/GlobeIcon";
import { formatPrice, handleError } from "utils";
import moment from "moment";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import TableComponent from "components/table";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { EditIcon } from "assets/Icons/EditIcon";
import { PlusCircleIcon } from "assets/Icons/PlusCircleIcon";
import { SuccessMarkIcon } from "assets/Icons/SuccessMarkIcon";
import SuccessCheck from "assets/Icons/SuccessCheck";
import { ErrorMarkIcon } from "assets/Icons/ErrorMarkIcon";
import ErrorAlert from "assets/Icons/ErrorAlert";
import { CancelSubscriptionRedIcon } from "assets/Icons/CancelSubscriptionRedIcon";
import { ClearIcon } from "assets/Icons/ClearIcon";
import { RefrshIcon } from "assets/Icons/RefreshIcon";
import { CheckIcon } from "assets/Icons/CheckIcon";
import { GeneralModal } from "pages/Dashboard/ConnectedApps/widgets/Modals/GeneralModal";
import { Globe02Icon } from "assets/Icons/Globe02Icon";
import { useState } from "react";
import { SuccessfulConnectionModal } from "pages/Dashboard/ConnectedApps/widgets/Modals/SuccessfulConnectionModal";
import { AddDnsModal } from "../AddDnsModal/AddDnsModal";
import {
  useDeleteDnsMutation,
  useGetDnsListQuery,
  useGetDomainPaymentListQuery,
  useGetSingleDomainQuery,
  usePublishUrlMutation,
} from "services";
import ErrorMsg from "components/ErrorMsg";
import { selectCurrentStore } from "store/slice/AuthSlice";
import { showToast, useAppSelector } from "store/store.hooks";
import Loader from "components/Loader";
import MessageModal from "components/Modal/MessageModal";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { InfoCircleXLIcon } from "assets/Icons/InfoCircleXLIcon";
const dnsHeadCell = [
  {
    key: "record",
    name: "DNS Record",
  },
  {
    key: "type",
    name: "Type",
  },
  {
    key: "value",
    name: "Value",
  },
  {
    key: "ttl",
    name: "TTL",
  },
  {
    key: "action",
    name: "",
  },
];
const historyHeadCell = [
  {
    key: "status",
    name: "",
  },
  {
    key: "domain",
    name: "",
  },
  {
    key: "date",
    name: "",
  },
  {
    key: "amount",
    name: "",
  },
];
export const DomainDetails = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [dataCount, setDataCount] = useState("25");
  const userStore = useAppSelector(selectCurrentStore);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openDnsModal, setOpenDnsModal] = useState(false);
  const { data, isLoading, isFetching, isError } = useGetSingleDomainQuery(id);
  const {
    data: dnsData,
    isLoading: loadDns,
    isError: dnsError,
  } = useGetDnsListQuery(id);

  const {
    data: paymentData,
    isLoading: loadPayment,
    isError: paymentError,
  } = useGetDomainPaymentListQuery(userStore?.id);
  const [editFields, setEditFields] = useState<any>(null);
  const [publishDomain, { isLoading: loadPublish }] = usePublishUrlMutation();
  const [idTobeDeleted, setIdTobeDeleted] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteDns, { isLoading: loadDelete }] = useDeleteDnsMutation();

  const handlePublish = async () => {
    try {
      let result = await publishDomain({
        domainId: id || "",
        storeId: userStore?.id || "",
      });
      if ("data" in result) {
        if (result && result.data.status === false) {
          showToast(result.data.message, "error");
        } else {
          showToast("Successfully published", "success");
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const deleteDnsFnc = async (host_id: string, callback?: () => void) => {
    try {
      let result = await deleteDns({ id: id, host_id: host_id });
      if ("data" in result) {
        showToast("Deleted successfully", "success");
        setOpenDeleteModal(false);
      } else {
        handleError(result);
      }
      setIdTobeDeleted("");
    } catch (error) {
      handleError(error);
      setIdTobeDeleted("");
    }
  };

  if (isError) {
    <ErrorMsg error={"Something went wrong"} />;
  }

  return (
    <>
      {loadPublish && <Loader />}
      <div className="pd_domain_details">
        {data && !data?.meta?.can_manage_dns && (
          <div className="warning">
            <div className="helper_icone">
              <InfoCircleXLIcon />
            </div>
            <p className="warning_text">
              To manage your domain purchased on Bumpa, click{" "}
              <a href="mailto:support@getbumpa.com" target="_blank">
                here.
              </a>{" "}
              Kindly reach out to your domain provider if you purchased your
              domain externally.
            </p>
          </div>
        )}
        <ModalHeader
          text="Custom Domain Details"
          closeModal={() => {
            navigate(-1);
          }}
        />

        <div className="domain_detail_cover_section">
          <div className="domain_summary section">
            {isLoading ? (
              <div className="summary_skeleton">
                <Skeleton animation="wave" width={"100%"} />
                <Skeleton animation="wave" width={"100%"} />
                <Skeleton animation="wave" width={"100%"} />
              </div>
            ) : (
              <>
                <div className="display_selected_domain">
                  <div className="left_text">
                    <GlobeIcon isActive={true} />
                    <p>{data?.data?.domain_name}</p>
                  </div>
                  {/* {data?.data?.is_alive === 0 && userStore?.domain === data?.data?.domain_name && !data?.data.has_expired && (
                    <Button
                      onClick={() => {
                        handlePublish();
                      }}
                    >
                      Publish Domain
                    </Button>
                  )} */}
                  {data?.meta?.is_live === 0 ||
                  userStore?.domain === data?.data?.domain_name ||
                  data?.meta.has_expired ? (
                    ""
                  ) : (
                    <Button
                      onClick={() => {
                        handlePublish();
                      }}
                    >
                      Publish Domain
                    </Button>
                  )}
                </div>
                <div className="amount_breakdown">
                  <div className="single_breakdown">
                    <p>Registered Date:</p>
                    <h3>
                      {moment(data?.data?.created_at).format(
                        "dddd Do MMMM, YYYY"
                      )}
                    </h3>
                  </div>
                  <div className="single_breakdown">
                    <p>Expiry Date:</p>
                    <h3>
                      {moment(data?.data?.expired_at).format(
                        "dddd Do MMMM, YYYY"
                      )}
                    </h3>
                  </div>
                  <div className="single_breakdown">
                    <p>Duration</p>
                    <h3>{data?.data.duration} year</h3>
                  </div>
                  <div className="single_breakdown">
                    <p>Next Billing Period</p>
                    <h3>{moment(data?.data?.renewal_date).format("lll")}</h3>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="dns_record_section section">
            <div className="section_header">
              <p>Domain DNS Record</p>
              {data && data?.meta?.can_manage_dns && (
                <Button
                  startIcon={<PlusCircleIcon stroke="#ffffff" />}
                  className="primary_styled_button"
                  variant="contained"
                  onClick={() => {
                    setOpenDnsModal(true);
                  }}
                >
                  Add DNS Record
                </Button>
              )}
            </div>
            <div className="dns_table">
              <TableComponent
                isError={dnsError || (dnsData && dnsData?.status === false)}
                isLoading={loadDns}
                headCells={dnsHeadCell}
                selectMultiple={false}
                showPagination={false}
                handleClick={(row: any) => {}}
                tableData={dnsData?.data?.hosts.map((row, i) => ({
                  record: row.name,
                  type: row.type,
                  value: row.address,
                  ttl: row.ttl,
                  action: (
                    <div className="flex gap-[28px] justify-end">
                      {data && data?.meta?.can_manage_dns && (
                        <>
                          {row.type !== "A" && row.type !== "CNAME" && (
                            <>
                              <IconButton
                                onClick={(e) => {
                                  setEditFields({
                                    type: row.type,
                                    host_name: row.name,
                                    ttl: row.ttl,
                                    address: row.address,
                                    host_id: `${row.host_id}`,
                                  });
                                  setOpenDnsModal(true);
                                  e.stopPropagation();
                                }}
                                type="button"
                                className="icon_button_container"
                              >
                                <EditIcon />
                              </IconButton>

                              <IconButton
                                onClick={(e) => {
                                  setIdTobeDeleted(`${row.host_id}`);
                                  setOpenDeleteModal(true);
                                  e.stopPropagation();
                                }}
                                type="button"
                                className="icon_button_container"
                              >
                                <TrashIcon />
                              </IconButton>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  ),
                  id: i,
                }))}
              />
            </div>
          </div>
          <div className="history_section section">
            <FormSectionHeader title="Purchase History" />
            <div className="history_table">
              <TableComponent
                isError={paymentError}
                isLoading={loadPayment}
                headCells={historyHeadCell}
                selectMultiple={false}
                showPagination={true}
                showHead={false}
                page={page}
                setPage={setPage}
                dataCount={dataCount}
                setDataCount={setDataCount}
                meta={{
                  current: paymentData?.meta?.current_page,
                  perPage: paymentData?.meta?.per_page,
                  totalPage: paymentData?.meta?.last_page,
                }}
                tableData={paymentData?.data.map((row, i) => ({
                  status: (
                    <div className="purchase_history">
                      {row.status === "success" ? (
                        <>
                          <div className={`check success`}>
                            <CheckIcon stroke="#009444" />
                          </div>
                          <p className="payment_status">Payment Successful</p>
                        </>
                      ) : (
                        <>
                          <div className={`check failed`}>
                            <ClearIcon stroke="#D90429" />{" "}
                          </div>
                          <p className="payment_status">Payment Failed</p>
                          <div
                            onClick={() => {
                              navigate(
                                `/dashboard/domains/buy?defaultDomain=${row.domain_name}`
                              );
                            }}
                            className="retry"
                          >
                            <RefrshIcon stroke="#009444" /> <p>Try again</p>
                          </div>
                        </>
                      )}
                    </div>
                  ),
                  domain: `${row.domain_name}`,
                  date: moment(row.payment_date || "").format("lll"),
                  amount: `${formatPrice(Number(row.amount || 0))}`,
                  id: row.id,
                }))}
              />
            </div>
          </div>
        </div>

        <GeneralModal
          title="Publish Domain"
          description="Your customers can only visit your store using this domain URL"
          image={<Globe02Icon />}
          btnText="Publish Domain"
          btnAction={() => {}}
          openModal={openModal}
          closeModal={() => {
            setOpenModal(false);
          }}
        />
        <AddDnsModal
          openModal={openDnsModal}
          closeModal={() => {
            setOpenDnsModal(false);
          }}
          defaultFields={editFields}
          setDefaultFields={setEditFields}
        />

        <SuccessfulConnectionModal
          openModal={openSuccessModal}
          closeModal={() => {
            setOpenSuccessModal(false);
          }}
          btnText="Visit Website"
          btnAction={() => {}}
          title="Congratulations"
          description="Your website https://www.website.com is now live and your customers can now start shopping on your website."
        />
        <MessageModal
          openModal={openDeleteModal}
          closeModal={() => {
            setOpenDeleteModal(false);
          }}
          icon={<TrashIcon stroke="#5C636D" />}
          btnChild={
            <Button
              onClick={() => {
                deleteDnsFnc(idTobeDeleted);
              }}
              className="error"
            >
              {loadDelete ? (
                <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
              ) : (
                "Yes, delete"
              )}
            </Button>
          }
          description="Are you sure you want to delete?"
        />
      </div>
    </>
  );
};

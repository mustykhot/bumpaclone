import { useState, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { LoadingButton } from "@mui/lab";

import { MailIcon } from "assets/Icons/MailIcon";
import { SMSIcon } from "assets/Icons/SMSIcon";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { CoinIcon } from "assets/Icons/CoinIcon";

import NormalFileInput from "components/forms/NormalFileInput";
import ValidatedInput from "components/forms/ValidatedInput";
import TextEditor from "components/forms/TextEditor";
import ValidatedTextArea from "components/forms/ValidatedTextArea";
import Loader from "components/Loader";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { CampaignPreviewModal } from "./campaignPreviewModal";
import { AddCustomerModal, ICustomer } from "./addCustomerModal";
import { AddCustomerGroupModal } from "./addCustomerGroupModal";

import {
  selectCustomerRecipient,
  selectGroupRecipient,
  selectSelectedAll,
  setCampaigns,
  setCustomerRecipient,
  setGroupRecipient,
} from "store/slice/CampaignSlice";
import { useAppSelector, useAppDispatch } from "store/store.hooks";
import { MARKETINGROUTES } from "utils/constants/apiroutes";
import { IMAGEURL } from "utils/constants/general";
import { selectCurrentStore } from "store/slice/AuthSlice";
import {
  useEstimateCampaignCreditMutation,
  useGetStoreInformationQuery,
} from "services";
import { formatNumber, handleError } from "utils";
import { selectProfile } from "store/slice/ProfileSlice";

import "./style.scss";
import InfoBox from "components/InfoBox";

export type SendCampaignFields = {
  name: string;
  body: string | any;
  title: string;
  sms_header?: string;
};

export type FormFields = {
  type: string;
  title: string;
  name: string;
  campaignImage: any;
  body: any;
  recipients: string[];
  sms_header?: string;
};

const campaignTypeList = [
  { name: "Email  campaign", type: "email", icon: <MailIcon /> },
  { name: "SMS  campaign", type: "sms", icon: <SMSIcon /> },
];

const getCharacterCount = (text: string) => {
  if (text) {
    const length = text.length;
    const paragraphs = Math.floor(length / 130) + 1;
    return `${length}/${paragraphs}`;
  }
};
export const SendCampaign = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isPurchased = searchParams.get("isPurchased");

  const [campaignType, setCampaignType] = useState<string>("email");
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [formFields, setFormFields] = useState<FormFields | null>(null);
  const [openAddCustomer, setOpenAddCustomer] = useState(false);
  const [openAddCustomerGroup, setOpenAddCustomerGroup] = useState(false);

  const [campaignImage, setCampaignImage] = useState("");
  const [resetCustomer, setResetCustomer] = useState(false);
  const [credit, setCredit] = useState("");
  const userStore = useAppSelector(selectCurrentStore);
  const storeProfile = useAppSelector(selectProfile);

  const dispatch = useAppDispatch();
  const state = location.state;
  const customerRecipient = useAppSelector(selectCustomerRecipient);
  const groupRecipient = useAppSelector(selectGroupRecipient);
  const [ArrayIds, setArrayIds] = useState<any[]>([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<any[]>([]);
  const [estimate, { isLoading }] = useEstimateCampaignCreditMutation();
  const selectedAll = useAppSelector(selectSelectedAll);

  const {
    data: storeData,
    isLoading: loadStore,
    isFetching: fetchStore,
    refetch,
  } = useGetStoreInformationQuery();

  const navigate = useNavigate();
  const methods = useForm<SendCampaignFields>({
    mode: "all",
  });

  const {
    formState: { isValid },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = methods;
  const onSubmit: SubmitHandler<SendCampaignFields> = async (data) => {
    let customerRecipients = customerRecipient?.map((item) => {
      return item.name;
    });
    setFormFields({
      ...data,
      type: campaignType,
      campaignImage,
      recipients: [...customerRecipients],
    });

    try {
      const payload = {
        name: data?.name,
        subject: data?.title,
        type: campaignType,
        content: data?.body,
        recipients: selectedAll ? [] : [...customerRecipients],
        send_all: selectedAll,
        banner: IMAGEURL + campaignImage,
        from_name: userStore?.name,
        from_email: storeProfile?.email,
        status: "active",
        groups: ArrayIds,
      };
      let result = await estimate(payload);
      localStorage.setItem(
        "campaignObj",
        JSON.stringify({
          ...data,
          type: campaignType,
          campaignImage,
          recipients: [...customerRecipients],
        })
      );
      if ("data" in result) {
        localStorage.setItem(
          "campaignObj",
          JSON.stringify({
            ...data,
            type: campaignType,
            campaignImage,
            recipients: [...customerRecipients],
            credit: `${result?.data?.credits}`,
          })
        );
        setCredit(`${result?.data?.credits}`);
      } else {
        handleError(result);
      }

      setOpenPreviewModal(true);
    } catch (error) {
      handleError(error);
      setOpenPreviewModal(true);
    }
  };

  const onUpload = (value: string) => {
    setCampaignImage(value);
  };

  const resetDefaultUpload = () => {
    setCampaignImage("");
  };

  useEffect(() => {
    if (state?.activeData) {
      setCampaignType(state?.activeData?.type);
      setValue("title", state?.activeData?.subject, { shouldValidate: true });
      setCampaignImage(
        state?.activeData?.banner && state?.activeData?.banner !== IMAGEURL
          ? state?.activeData?.banner
          : ""
      );
      setValue("name", state?.activeData?.name, { shouldValidate: true });
      setValue("body", state?.activeData?.content, { shouldValidate: true });
    }
    // eslint-disable-next-line
  }, [state]);

  useEffect(() => {
    if (userStore) {
      setValue("sms_header", userStore?.business_name);
    }
  }, [userStore]);

  useEffect(() => {
    if (isPurchased) {
      setOpenPreviewModal(true);
    }
  }, [isPurchased]);

  return (
    <>
      {loadStore ? (
        <Loader />
      ) : (
        <div className="pd_send_campaign">
          <CampaignPreviewModal
            openModal={openPreviewModal}
            fields={formFields}
            setFields={setFormFields}
            userStore={storeData?.store}
            closeModal={() => {
              setOpenPreviewModal(false);
            }}
            setValue={setValue}
            setCampaignType={setCampaignType}
            setCampaignImage={setCampaignImage}
            ArrayIds={ArrayIds}
            credit={credit}
            setCredit={setCredit}
          />

          <FormProvider {...methods}>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
              <div className="form_section">
                <ModalHeader
                  text="Send campaign"
                  closeModal={() => {
                    navigate(-1);
                    dispatch(setCustomerRecipient([]));
                    dispatch(
                      setCampaigns({
                        name: "",
                        type: "",
                        status: "",
                        recipients: [],
                        subject: "",
                        content: "",
                        banner: "",
                        created_at: "",
                      })
                    );
                  }}
                  button={
                    <div className="credit_container">
                      <CoinIcon />
                      <p>
                        Credit:
                        <span>
                          {formatNumber(
                            Number(storeData?.store?.message_credits || 0) +
                              Number(
                                storeData?.store?.purchased_messaging_credits ||
                                  0
                              )
                          )}
                        </span>
                      </p>
                    </div>
                  }
                />
                <div className="form_field_container">
                  <div className="type_container">
                    <label className="add_label">Select Campaign Type</label>
                    <div className="select_type">
                      {campaignTypeList.map((item, i) => {
                        return (
                          <Button
                            startIcon={item.icon}
                            variant="contained"
                            key={item.type}
                            onClick={() => {
                              setCampaignType(item.type);
                              dispatch(setCustomerRecipient([]));
                            }}
                            className={`${
                              campaignType === item.type ? "active" : ""
                            }`}
                          >
                            {item.name}
                          </Button>
                        );
                      })}
                    </div>

                    {campaignType === "email" && (
                      <div className="note">
                        <InfoCircleIcon />
                        <p>Email campaign costs 2 credit per email</p>
                      </div>
                    )}

                    {campaignType === "sms" && (
                      <div className="note mb-4">
                        <InfoCircleIcon />
                        <p>
                          SMS campaigns cost 4 messaging credits per paragraph
                          (160 characters) including the SMS Header
                        </p>
                      </div>
                    )}

                    {campaignType === "sms" && (
                      <div className="alert-message">
                        <InfoBox
                          color="yellow"
                          text={
                            <p>
                              For better sms deliverability, it is recommended
                              you send your sms campaigns within the hours of
                              8:00am - 8:00pm.{" "}
                              <a
                                target="_blank"
                                href="https://www.getbumpa.com/blog/sending-bulk-sms-to-your-customers-is-now-better-on-bumpa"
                              >
                                Learn more
                              </a>
                            </p>
                          }
                        />
                      </div>
                    )}
                  </div>
                  <div className="image_field_container">
                    {campaignType === "email" && (
                      <Accordion defaultExpanded className="accordion">
                        <AccordionSummary
                          expandIcon={<ChevronDownIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          className="accordion_summary"
                        >
                          <p>Campaign Image</p>
                        </AccordionSummary>
                        <AccordionDetails>
                          <NormalFileInput
                            type="img"
                            aspect={800 / 150}
                            isReactHook
                            uploadPath={`${MARKETINGROUTES.UPLOAD_CAMPAIGN_IMAGE}`}
                            labelText="Attach Image"
                            accept="image/png, image/gif, image/jpeg"
                            name={`campaignImage`}
                            dimensions="800px x 150px"
                            cropWidth={800}
                            cropHeight={150}
                            required={false}
                            onFileUpload={onUpload}
                            resetDefaultUpload={resetDefaultUpload}
                            defaultImg={
                              campaignImage ? `${IMAGEURL}${campaignImage}` : ""
                            }
                          />
                        </AccordionDetails>
                      </Accordion>
                    )}
                    <Accordion defaultExpanded className="accordion">
                      <AccordionSummary
                        expandIcon={<ChevronDownIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        className="accordion_summary"
                      >
                        <p>Campaign Details</p>
                      </AccordionSummary>
                      <AccordionDetails>
                        <ValidatedInput
                          name="name"
                          placeholder="Enter Campaign Name"
                          label="Name"
                          type={"text"}
                        />

                        {campaignType === "email" ? (
                          <ValidatedInput
                            name="title"
                            placeholder="Enter Campaign Subject"
                            label="Subject"
                            type={"text"}
                            required={true}
                          />
                        ) : (
                          <ValidatedInput
                            name="sms_header"
                            placeholder="e.g Melon Anniversary Sales"
                            label="SMS Header"
                            type={"text"}
                            disabled
                            belowText={
                              <div className="below_text">
                                <div className="text">
                                  <InfoCircleIcon stroke="#848D99" />
                                  <p>
                                    This is the first line of text your
                                    customers will see to recognise your
                                    business
                                  </p>
                                </div>
                                {watch("sms_header") && (
                                  <p className="count">
                                    {`${watch("sms_header")?.length}`}
                                  </p>
                                )}
                              </div>
                            }
                          />
                        )}

                        {campaignType === "sms" ? (
                          <ValidatedTextArea
                            name="body"
                            height="h-[120px]"
                            label="Body"
                            belowText={
                              <div className="below_text">
                                <div className="text">
                                  <InfoCircleIcon stroke="#848D99" />
                                  <p>
                                    Emojis and special characters like '*!','"@"
                                    are are not supported
                                  </p>
                                </div>

                                <p className="count">
                                  {watch("body") &&
                                    getCharacterCount(
                                      `${watch("body")}${watch("sms_header")}`
                                    )}
                                </p>
                              </div>
                            }
                          />
                        ) : (
                          <TextEditor name="body" label="Body" />
                        )}

                        <div className="customer_flex_box">
                          <div
                            onClick={() => {
                              setOpenAddCustomer(true);
                            }}
                            className="pick_cutomer"
                          >
                            <label>Add Customer</label>
                            <div>
                              <p>
                                {selectedAll
                                  ? "All Customers"
                                  : customerRecipient.length
                                  ? customerRecipient
                                      .map((item) => item.customer)
                                      .join(", ")
                                  : "Select customers"}
                              </p>
                              <ChevronDownIcon />
                            </div>
                          </div>
                          <div
                            onClick={() => {
                              setOpenAddCustomerGroup(true);
                            }}
                            className="pick_cutomer"
                          >
                            <label>Add Customer Group</label>
                            <div>
                              <p>
                                {groupRecipient.length
                                  ? groupRecipient.join(", ")
                                  : "Select customers group"}
                              </p>
                              <ChevronDownIcon />
                            </div>
                          </div>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                </div>
              </div>

              <div className="submit_form_section">
                <div className="button_container2">
                  <Button
                    onClick={() => {
                      reset();
                      setResetCustomer(true);
                      setCampaignImage("");
                      setCampaignType("email");
                      dispatch(setCustomerRecipient([]));
                      dispatch(setGroupRecipient([]));
                      navigate(-1);
                    }}
                    className="discard"
                  >
                    Cancel
                  </Button>
                </div>
                <div className="button_container">
                  <Button
                    variant="contained"
                    onClick={() => {
                      reset();
                      setResetCustomer(true);
                      setCampaignImage("");
                      setCampaignType("email");
                      dispatch(setCustomerRecipient([]));
                      dispatch(setGroupRecipient([]));
                      // setRecipientArray([]);
                    }}
                    type="button"
                    className="preview"
                  >
                    Clear Fields
                  </Button>

                  <LoadingButton
                    loading={isLoading}
                    variant="contained"
                    className="add"
                    type="submit"
                    disabled={
                      isLoading ||
                      !isValid ||
                      (customerRecipient.length === 0 &&
                        ArrayIds.length === 0 &&
                        !selectedAll)
                    }
                  >
                    Preview and Send
                  </LoadingButton>
                </div>
              </div>

              {openAddCustomer && (
                <AddCustomerModal
                  openModal={openAddCustomer}
                  closeModal={() => {
                    setOpenAddCustomer(false);
                  }}
                  reset={resetCustomer}
                  type={campaignType}
                  selectedIdsState={selectedCustomerIds}
                  setSelectedIdsState={setSelectedCustomerIds}
                />
              )}

              {openAddCustomerGroup && (
                <AddCustomerGroupModal
                  openModal={openAddCustomerGroup}
                  closeModal={() => {
                    setOpenAddCustomerGroup(false);
                  }}
                  reset={resetCustomer}
                  type={campaignType}
                  selectedIdsState={ArrayIds}
                  setSelectedIdsState={setArrayIds}
                />
              )}
            </form>
          </FormProvider>
        </div>
      )}
    </>
  );
};

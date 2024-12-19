import { Button, CircularProgress } from "@mui/material";
import { CopyIcon } from "assets/Icons/CopyIcon";
import InputField from "components/forms/InputField";
import { useCopyToClipboardHook } from "hooks/useCopyToClipboardHook";
import { SuccessfulConnectionModal } from "pages/Dashboard/ConnectedApps/widgets/Modals/SuccessfulConnectionModal";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { useConnectDomainMutation } from "services";
import { handleError } from "utils";
import { showToast, useAppSelector } from "store/store.hooks";
import { selectIsSubscriptionExpired, selectIsSubscriptionType } from "store/slice/AuthSlice";
import { UpgradeModal } from "components/UpgradeModal";

export const ConnectDomain = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [domain, setDomain] = useState("");
  const { isCopied, handleCopyClick } = useCopyToClipboardHook("15.236.222.29");
  const [openModal, setOpenModal] = useState(false);
  const [connectDomain, { isLoading }] = useConnectDomainMutation();
  const pattern = /\.[a-zA-Z]{2,}/;

  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [isStarterUpgrade, setIsStarterUpgrade] = useState(false);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);

  const handleStep = () => {
    if (step < 3) {
      if (step === 1) {
        if (
          isSubscriptionExpired ||
          isSubscriptionType === "free"
        ) {
          setIsStarterUpgrade(true);
          setOpenUpgradeModal(true);
        } else {
          setStep(step + 1);
        }
      } else {
        setStep(step + 1);
      }
    } else if (step === 3) {
      handleConnect();
    }
  };

  const handleConnect = async () => {
    let payload = {
      domain_name: domain,
    };
    try {
      let result = await connectDomain(payload);
      if ("data" in result) {
        if (result.data.status) {
          showToast("Connected successfully", "success");
          setOpenModal(true);
        } else {
          showToast(result.data.message, "error");
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="pd_connect_domain">
      <ModalHeader
        text="Connect Domain"
        closeModal={() => {
          if (step === 1) {
            navigate(-1);
          } else {
            setStep(step - 1);
          }
        }}
      />

      <p className="connect_description">
        A custom domain is the address that your website can be found on. When
        you connect your domain to your bumpa store, it will replace the link to
        your store with your domain name.
      </p>

      <div className="step_cover_box">
        <h3 className="step_title">Step {step}</h3>
        {step === 1 && (
          <div className="step_box one">
            <p className="step_description">Enter your domain name</p>
            <InputField
              name="name"
              label="Domain name"
              placeholder="Enter your domain name"
              value={domain}
              onChange={(e: any) => {
                setDomain(e.target.value);
              }}
              prefix={<p className="url_suffix">https://</p>}
            />
          </div>
        )}
        {step === 2 && (
          <div className="step_box two">
            <p className="step_description">
              Copy and paste the IP address below in your A-record on your
              domain registrar
            </p>
            <div className="copy_ip">
              <h3 className="ip_text">15.236.222.29</h3>
              <Button
                onClick={() => {
                  handleCopyClick();
                }}
                startIcon={<CopyIcon stroke="#009444" />}
              >
                {isCopied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step_box one">
            <p className="step_description">
              Fill in your domain CNAME details in your domain registrar. This
              is what your CNAME details should look like.
            </p>
            <div className="cname_box">
              <div className="text_flex">
                <p className="light">Record Type</p>
                <p className="bold">CName</p>
              </div>
              <div className="text_flex">
                <p className="light">Host Name:</p>
                <p className="bold">www</p>
              </div>{" "}
              <div className="text_flex">
                <p className="light">Address:</p>
                <p className="bold">yourstorewebsite.com</p>
              </div>{" "}
              <div className="text_flex">
                <p className="light">TTL:</p>
                <p className="bold">Automatic</p>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={() => {
            handleStep();
          }}
          disabled={step === 1 && !domain.match(pattern) ? true : false}
          variant="contained"
          className="continue_btn"
        >
          {isLoading ? (
            <CircularProgress size={"1.5rem"} sx={{ color: "#ffffff" }} />
          ) : (
            "Continue"
          )}
        </Button>
      </div>

      <SuccessfulConnectionModal
        openModal={openModal}
        closeModal={() => {
          setOpenModal(false);
        }}
        isPending={true}
        btnText={"Continue"}
        btnAction={() => {
          navigate("/dashboard/domains");
        }}
        title={"Connection in Progress"}
        description={`Your domain is being connected. You’ll be notified once your website is live on ${domain}`}
      />
      {openUpgradeModal && (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          starter={isStarterUpgrade}
          title={`Connect Your Custom Domain to Your Website`}
          subtitle={`Remove the .bumpa.shop in your website link and change it to a .com., .ng or any domain you prefer`}
          starterFeatures={[
            "Purchase a domain",
            "Sell up to 100 products on your website.",
            "No Instagram DM connection",
            "Get a 1 location website",
          ]}
          proFeatures={[
            "Free .com.ng domain on 1-year plan",
            "Sell up to 500 products on your website",
            "Upload business logo on website link",
            "Get one location website",
          ]}
          growthFeatures={[
            "Free.com.ng domain",
            "Sell an unlimited number of products",
            "Upload business logo on website link",
            "Get a 2 in 1 website to sell across different store locations",
          ]}
          eventName="custom-domain"
        />
      )}
    </div>
  );
};

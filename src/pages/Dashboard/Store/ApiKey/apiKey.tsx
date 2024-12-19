import Button from "@mui/material/Button";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import { useEffect, useState } from "react";
import { useGenerateApiKeyMutation, useGetApikeyQuery } from "services";
import InputField from "components/forms/InputField";
import { CircularProgress, Skeleton } from "@mui/material";
import { useCopyToClipboardHook } from "hooks/useCopyToClipboardHook";
import { showToast, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import "./style.scss";
import EmptyResponse from "components/EmptyResponse";
import ErrorMsg from "components/ErrorMsg";
import {
  selectIsSubscriptionDets,
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import { UpgradeModal } from "components/UpgradeModal";

const DisplayToken = ({ item }: { item: any }) => {
  // const { isCopied, handleCopyClick } = useCopyToClipboardHook(item.id);
  return (
    <div className="single_transaction_box">
      <div className="top_side">
        <h4>{item.name}</h4>
        {/* <Button onClick={handleCopyClick} variant="outlined">
          {isCopied ? "Copied" : "Copy Token"}
        </Button>{" "} */}
      </div>
    </div>
  );
};

export const ApiKey = () => {
  const [apikey, setApiKey] = useState("");
  const [token_name, setTokenName] = useState("");
  const { isCopied, handleCopyClick } = useCopyToClipboardHook(apikey);
  const [generateKey, { isLoading: loadGenerate }] =
    useGenerateApiKeyMutation();
  const { data, isLoading, isFetching, isError } =
    useGetApikeyQuery("auth/token");

  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);
  const isSubscriptionDets = useAppSelector(selectIsSubscriptionDets);

  const generateFnc = async () => {
    if (
      isSubscriptionExpired ||
      isSubscriptionType === "free" ||
      (isSubscriptionType === "starter" &&
        isSubscriptionDets.interval !== "annually")
    ) {
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
    } else {
      try {
        let result = await generateKey({ token_name });
        if ("data" in result) {
          showToast("Generated successfuly", "success");
          setApiKey(result.data?.token);
        } else {
          handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  return (
    <>
      <div className="pd_create_store_information generate_api_key pd_api_key">
        <div className="form_section">
          <ModalHeader text="Api Key" />
          <div className="form_field_container">
            <div className="order_details_container">
              <FormSectionHeader title="Generate Api Key" />
              <div className="px-[16px]">
                <div className="">
                  <InputField
                    name="token_name"
                    placeholder="Token Name"
                    label="Token Name"
                    type={"text"}
                    value={token_name}
                    onChange={(e) => {
                      setTokenName(e.target.value);
                    }}
                  />
                  <InputField
                    name="code"
                    placeholder="Api key appears here"
                    label="Api Key"
                    type={"text"}
                    value={apikey}
                    disabled
                    extralabel={
                      <Button
                        disabled={loadGenerate}
                        onClick={() => {
                          if (token_name) {
                            generateFnc();
                          } else {
                            showToast("Input Token Name", "error");
                          }
                        }}
                        sx={{ height: "24px" }}
                      >
                        {loadGenerate ? (
                          <CircularProgress
                            size="1.5rem"
                            sx={{ zIndex: 10, color: "#009444" }}
                          />
                        ) : (
                          "Generate key"
                        )}
                      </Button>
                    }
                    suffix={
                      apikey && (
                        <Button onClick={handleCopyClick} className="copy_key">
                          {isCopied ? "Copied" : "Copy Key"}
                        </Button>
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="transaction_section section">
            <h3 className="title">Api Keys</h3>
            {isLoading || isFetching ? (
              [1, 2, 3, 4].map((item) => (
                <Skeleton
                  animation="wave"
                  width={"100%"}
                  height={30}
                  key={item}
                />
              ))
            ) : isError ? (
              <ErrorMsg error="Something went wrong" />
            ) : data?.token && data?.token?.length ? (
              data?.token?.map((item: any, i: number) => {
                if (item.name) {
                  return <DisplayToken item={item} key={i} />;
                }
              })
            ) : (
              <EmptyResponse message="No record found" />
            )}
          </div>
        </div>
        {openUpgradeModal && (
          <UpgradeModal
            openModal={openUpgradeModal}
            closeModal={() => setOpenUpgradeModal(false)}
            pro={isProUpgrade}
            title={`Connect your favorite tools to Bumpa with API Keys`}
            subtitle={`Connect shipping companies, Woo Commerce, and more with API Keys.`}
            proFeatures={[
              "Connect Shipbubble or Fez to Bumpa",
              "Connect Facebook Pixel to your website",
              "Cannot connect WooCommerce to Bumpa",
              "Cannot connect Google Analytics",
            ]}
            growthFeatures={[
              "Connect Shipbubble or Fez to Bumpa",
              "Connect Facebook Pixel to your website",
              "Connect WooCommerce to Bumpa",
              "Connect Google Analytics to your website",
            ]}
            eventName="api-key"
          />
        )}
      </div>
    </>
  );
};

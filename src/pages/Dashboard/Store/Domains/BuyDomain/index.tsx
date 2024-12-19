import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import "./style.scss";
import InputField from "components/forms/InputField";
import { useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { SuccessMarkIcon } from "assets/Icons/SuccessMarkIcon";
import { ErrorMarkIcon } from "assets/Icons/ErrorMarkIcon";
import { formatPrice, handleError } from "utils";
import { useLocation, useNavigate } from "react-router-dom";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import { GlobeIcon } from "assets/Icons/Sidebar/GlobeIcon";
import { EditIcon } from "assets/Icons/EditIcon";
import { useAppSelector, showToast } from "store/store.hooks";
import { selectCurrentUser } from "store/slice/AuthSlice";
import { SuccessfulConnectionModal } from "pages/Dashboard/ConnectedApps/widgets/Modals/SuccessfulConnectionModal";
import { selectCurrentStore } from "store/slice/AuthSlice";
import {
  useSearchDomainMutation,
  useInitiateDomainPaymentMutation,
} from "services";
import { SearchDomainType } from "services/api.types";
import { AnimatePresence, motion } from "framer-motion";
import { REDIRECT_URL } from "utils/constants/general";

const domainList = [
  { domain: "myfashionstore.com", price: "N30,000/year" },
  { domain: "myfashionstore.com", price: "N30,000/year" },
  { domain: "myfashionstore.com", price: "N30,000/year" },
  { domain: "myfashionst.com.ng", price: "N30,000/year" },
];

const extractSpan = (text: string) => {
  const firstDotIndex = text.indexOf(".");
  const firstPart = text.substring(0, firstDotIndex);
  const secondPart = text.substring(firstDotIndex);
  return (
    <p>
      {firstPart}
      <span>{secondPart}</span> is available
    </p>
  );
};

export const BuyDomain = () => {
  const [name, setName] = useState("");
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState("success");
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultDomain = searchParams.get("defaultDomain");
  const userStore = useAppSelector(selectCurrentStore);
  const [buyDomain, { isLoading }] = useInitiateDomainPaymentMutation();
  const [searchDomain, { isLoading: loadSearch }] = useSearchDomainMutation();
  const [domainSearchList, setDomainSearchList] = useState<SearchDomainType[]>(
    []
  );
  const [successDomain, setSuccessDomain] = useState<SearchDomainType | null>(
    null
  );
  const [finalSelectedDomain, setFinalSelectedDomain] =
    useState<SearchDomainType | null>(null);
  const [cancelPreviousRequest, setCancelPreviousRequest] = useState<any>(null);

  const handleSearchDomain = async (searchValue: string) => {
    if (cancelPreviousRequest) {
      // Cancel previous request if it exists
      cancelPreviousRequest.abort();
    }

    searchParams.delete("defaultDomain");
    const newUrl = `${window.location.origin}${
      window.location.pathname
    }?${searchParams.toString()}`;
    window.history.replaceState(null, "", newUrl);

    const pattern = /\.[a-zA-Z]{2,}/;
    const match = searchValue.match(pattern);

    if (match) {
      let payload = {
        searchTerm: searchValue,
      };
      const controller = new AbortController();
      setCancelPreviousRequest(controller);
      try {
        let result = await searchDomain({
          body: payload,
          id: userStore?.id || "",
          signal: controller.signal,
        });
        if ("data" in result) {
          let mainDomain = result.data.data.filter(
            (item) =>
              item.domainName.toLowerCase() === searchValue.toLowerCase()
          );
          setSuccessDomain(mainDomain[0]);
          let otherList = result.data.data.filter(
            (item) =>
              item.domainName.toLowerCase() !== searchValue.toLowerCase()
          );
          setDomainSearchList(otherList);
        } else {
          // handleError(result);
        }
      } catch (error) {
        handleError(error);
      }
    } else {
      setDomainSearchList([]);
      setSuccessDomain(null);
    }
  };

  const handleBuy = async () => {
    let payload = {
      domain: finalSelectedDomain?.domainName || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email_address: user?.email || "",
      redirect_url: `${REDIRECT_URL}dashboard/domains`,
    };
    try {
      let result = await buyDomain({
        body: payload,
        id: userStore?.id || "",
      });
      if ("data" in result) {
        if (result?.data?.data?.is_free) {
          navigate("/dashboard/domains?status=success");
        } else {
          window.open(result?.data?.data?.authorization_url, "_blank");
        }
        if (typeof _cio !== "undefined") {
          _cio.track("web_purchase_domain");
        }
        if (typeof mixpanel !== "undefined") {
          mixpanel.track("web_purchase_domain");
        }
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (name) {
    }
  }, [name]);
  useEffect(() => {
    if (defaultDomain) {
      setStep(1);
      setName(defaultDomain);
      handleSearchDomain(defaultDomain);

      // searchParams.delete("defaultDomain");
      // const newUrl = `${window.location.origin}${
      //   window.location.pathname
      // }?${searchParams.toString()}`;
      // window.history.replaceState(null, "", newUrl);
    }
  }, [defaultDomain]);

  return (
    <div className="pd_buy_domain">
      <div className="form_section">
        <ModalHeader
          text="Buy Domain"
          closeModal={() => {
            if (step === 1) {
              navigate(-1);
            } else {
              setStep(1);
            }
          }}
        />
        {step === 1 && (
          <div className="form_field_container step_one">
            <InputField
              name="name"
              label="Domain Name"
              placeholder="Enter domain"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                handleSearchDomain(e.target.value);
              }}
              prefix={
                loadSearch ? (
                  <CircularProgress size="1rem" sx={{ zIndex: 10 }} />
                ) : (
                  ""
                )
              }
            />

            {successDomain ? (
              <>
                {successDomain.isAvailable && (
                  <>
                    {" "}
                    <div className={`check_status_box success `}>
                      <div className="left_text">
                        <SuccessMarkIcon />
                        <p>
                          <span>{successDomain.domainName}</span> is available
                        </p>
                      </div>
                      <div className="right_text">
                        <p> {formatPrice(Number(successDomain.price))}/year </p>
                        <Button
                          onClick={() => {
                            setFinalSelectedDomain(successDomain);
                            setStep(2);
                          }}
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {!successDomain.isAvailable && (
                  <>
                    <div className={`check_status_box error`}>
                      <div className="left_text">
                        <ErrorMarkIcon />
                        <p>
                          <span>{successDomain.domainName}</span> is already
                          taken
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              ""
            )}

            {domainSearchList && domainSearchList.length ? (
              <div className="available_box">
                <p className="available_title">AVAILABLE DOMAINS</p>
                <div className="available_list">
                  {domainSearchList.map((domain, i: number) => {
                    return (
                      <div className="single_domain" key={i}>
                        <div className="left_text">
                          {extractSpan(domain.domainName)}
                        </div>
                        <div className="right_text">
                          <p> {formatPrice(Number(domain.price))}/year </p>
                          <Button
                            onClick={() => {
                              setFinalSelectedDomain(domain);
                              setStep(2);
                            }}
                          >
                            Select
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        )}
        {step === 2 && (
          <div className="form_field_container step_two">
            <FormSectionHeader title="Domain" />
            <div className="domain_summary">
              <div className="display_selected_domain">
                <div className="left_text">
                  <GlobeIcon isActive={true} />
                  <p>{finalSelectedDomain?.domainName}</p>
                </div>
                <Button
                  onClick={() => {
                    setStep(1);
                    setFinalSelectedDomain(null);
                  }}
                  startIcon={<EditIcon stroke="#009444" />}
                >
                  Change
                </Button>
              </div>
              <div className="amount_breakdown">
                <div className="single_breakdown">
                  <p>Amount:</p>
                  <h3>
                    {formatPrice(Number(finalSelectedDomain?.price || 0))}
                  </h3>
                </div>
                <div className="single_breakdown">
                  <p>Duration:</p>
                  <h3>1 year</h3>
                </div>
                <div className="single_breakdown">
                  <p>Billing Period</p>
                  <h3>Yearly</h3>
                </div>
              </div>
            </div>

            <FormSectionHeader title="Checkout Information" />
            <div className="checkout_summary">
              <div className="form-group-flex">
                <InputField
                  name="first_name"
                  label="First Name"
                  placeholder=""
                  value={user?.first_name}
                  disabled={true}
                />
                <InputField
                  name="last_name"
                  label="Last Name"
                  placeholder=""
                  value={user?.last_name}
                  disabled={true}
                />
              </div>
              <InputField
                name="email"
                label="Email"
                placeholder=""
                value={user?.email}
                disabled={true}
              />

              <Button
                variant={"contained"}
                onClick={() => {
                  handleBuy();
                }}
                className="primary_styled_button"
              >
                {isLoading ? (
                  <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
                ) : (
                  "Make Payment"
                )}
              </Button>
            </div>
          </div>
        )}

        <SuccessfulConnectionModal
          openModal={openModal}
          closeModal={() => {
            setOpenModal(false);
          }}
          isMeta={isPaymentSuccess}
          isFailed={isFailed}
          btnText={isFailed ? "Try again" : "Continue"}
          btnAction={() => {
            if (isFailed) {
            } else {
            }
          }}
          title={isFailed ? "Payment Failed" : "Woohooo!"}
          description={
            isFailed
              ? "You were not able to purchase www.fashionstore.com due to insufficient balance."
              : "You have successfully purchased a domain."
          }
        />
      </div>
    </div>
  );
};

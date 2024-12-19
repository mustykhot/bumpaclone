import { AnimatePresence, motion } from "framer-motion";
import Button from "@mui/material/Button";
import { CircularProgress, IconButton, Radio } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";
import { CircleCorrectIcon } from "assets/Icons/CircleCorrectIcon";
import { CircleCancelIcon } from "assets/Icons/CircleCancelIcon";
import { ExportIcon } from "assets/Icons/ExportIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import { LogoIcon } from "assets/Icons/LogoIcon";
import { SaleIcon } from "assets/Icons/Sidebar/SaleIcon";
import ErrorMsg from "components/ErrorMsg";
import InputField from "components/forms/InputField";
import Loader from "components/Loader";
import { SubmitButton } from "components/forms/SubmitButton";
import { useGetUser } from "hooks/getUserHook";
import {
  useDiscountValidityMutation,
  useGetPlansQuery,
  useGetStoreInformationQuery,
  useInitiatePaymentMutation,
} from "services";
import {
  capitalizeText,
  formatPrice,
  formatPriceNoCurrency,
  handleError,
} from "utils";
import { REDIRECT_URL, getObjWithValidValues } from "utils/constants/general";
import { FeatureModal } from "./featureModal";
import ComparePlansModal from "../widget/ComparePlans";
import paystack from "assets/images/paystack.png";

export type singlePlan = {
  name: string;
  price: string | ReactNode;
  id: string;
  description: string;
  features: string[];
  type: string;
  slug?: string;
  parent_name?: string;
  amount?: number;
};

export type ValidDiscountType = {
  amount: number;
  created_at: string;
  discount_code: string;
  end_date: string;
  id: number;
  name: string;
  percentage: string;
  plans: string;
  start_date: string;
  status: string;
  updated_at: string;
  prorated_amount: number;
};

export type singleTime = {
  name: string;
  price: string | ReactNode;
  id: string;
  description: string;
  features: null;
  type?: string;
  slug?: string;
  parent_name?: string;
  amount?: number;
};

export type singlepPlanProps = {
  item: singlePlan | singleTime;
  selectedPlan: string;
  setSelectedPlan: (value: string) => void;
  features?: string[];
  setFinalSelectedPlan?: React.Dispatch<any>;
  type?: string;
  slug?: string;
  otherCharacteristics?: any;
  checkDisabled?: boolean;
  checkIfEqual?: boolean;
  step?: any;
  amount?: number;
};

export const SinglePlanComponent = ({
  item,
  selectedPlan,
  setSelectedPlan,
  features,
  setFinalSelectedPlan,
  otherCharacteristics,
  checkDisabled = false,
  checkIfEqual = false,
  step,
}: singlepPlanProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const featureList = features ? features : item.features;

  return (
    <div
      className={`pd_single_plan ${
        checkIfEqual || checkDisabled ? "remove_cursor" : ""
      } ${
        (selectedPlan === item.slug || selectedPlan === item.id) &&
        !checkDisabled
          ? "active"
          : ""
      } ${
        step === 0 &&
        (selectedPlan === item.slug || selectedPlan === item.id) &&
        !checkDisabled
          ? "active_plan"
          : ""
      } ${item.slug === "growth" ? "growth" : ""}`}
    >
      <label className="box">
        <Radio
          onChange={() => {
            if (!checkDisabled) {
              setSelectedPlan(item.slug ? item.slug : item.id);
              setFinalSelectedPlan &&
                setFinalSelectedPlan(otherCharacteristics);
            }
          }}
          checked={selectedPlan === item.id || selectedPlan === item.slug}
        />
        <div className="text_container">
          <div className="title_section">
            <h3 className="title">
              {item.parent_name ? item.parent_name : item.name}{" "}
              {checkIfEqual && <span className="current"> Current Plan</span>}
            </h3>
            {step == 0 && (
              <p>
                {item.slug === "growth"
                  ? formatPriceNoCurrency(150000)
                  : item.amount && formatPriceNoCurrency(item.amount)}
                <span>
                  {item.slug === "growth" ? "/ biannually" : "/ quarter"}
                </span>
              </p>
            )}
            {step === 1 && <p>{item.price}</p>}
          </div>
          <p className="description">{item.description}</p>
          {featureList && (
            <>
              <Button
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              >
                View Features
              </Button>
              <div className="feature_container">
                <AnimatePresence>
                  {isOpen && (
                    <motion.ul
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ type: "just" }}
                    >
                      {featureList.map((el) => (
                        <li key={el}>{el}</li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
        <input
          hidden
          value={item.slug ? item.slug : item.id}
          id={item.slug ? item.slug : item.id}
          type={"radio"}
          onChange={(e) => {
            setSelectedPlan(e.target.value);
            setFinalSelectedPlan && setFinalSelectedPlan(otherCharacteristics);
          }}
        />
      </label>
    </div>
  );
};

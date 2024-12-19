import { AnimatePresence, motion } from "framer-motion";
import { Button, Radio } from "@mui/material";
import React, { useState } from "react";
import "./style.scss";
import { singlePlan, singleTime } from "../../plan";

export type singlepPlanProps = {
  item: singlePlan | singleTime;
  selectedPlan: string;
  setSelectedPlan: (value: string) => void;
  features?: string[];
  setFinalSelectedPlan?: React.Dispatch<any>;
  type?: string;
  otherCharacteristics?: any;
  checkDisabled?: boolean;
  checkIfEqual?: boolean;
  step?: any;
  hidePrice?: boolean;
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
  hidePrice,
}: singlepPlanProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const featureList = features ? features : item.features;

  return (
    <div
      className={`pd_single_plan ${
        checkIfEqual || checkDisabled ? "remove_cursor" : ""
      } ${
        (selectedPlan === item.type || selectedPlan === item.id) &&
        !checkDisabled
          ? "active"
          : ""
      } ${item.type === "growth" ? "growth" : ""}`}
    >
      <label className="box">
        <Radio
          onChange={() => {
            if (!checkDisabled) {
              setSelectedPlan(item.type ? item.type : item.id);
              setFinalSelectedPlan &&
                setFinalSelectedPlan(otherCharacteristics);
            }
          }}
          checked={selectedPlan === item.id || selectedPlan === item.type}
        />
        <div className="text_container">
          <div className="title_section">
            <h3 className="title">
              {item.name}{" "}
              {checkIfEqual && <span className="current">Current Plan</span>}
            </h3>
            {!hidePrice && item.price}
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
          value={item.type ? item.type : item.id}
          id={item.type ? item.type : item.id}
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

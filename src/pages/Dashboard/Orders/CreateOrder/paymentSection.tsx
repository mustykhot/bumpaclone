import { ReactNode, useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import { Button } from "@mui/material";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { useFormContext } from "react-hook-form";
import { BankIcon } from "assets/Icons/BankIcon";
import { BankNoteIcon } from "assets/Icons/BankNoteIcon";
import { TransactionWalletIcon } from "assets/Icons/TransactionWalletIcon";
import { TransactionPosIcon } from "assets/Icons/TransactionPosIcon";
import { ChevronDownIcon } from "assets/Icons/ChevronDownIcon";
import SelectField from "components/forms/SelectField";
import TextEditor from "components/forms/TextEditor";
import ValidatedInput from "components/forms/ValidatedInput";
import { TransactionsToMatchModal } from "pages/Dashboard/PointOfSale/widgets/TransactionsToMatchModal";
import { TransactionListType } from "services/api.types";
import { formatPrice } from "utils";

// type ProductSectionProps = {};
export const TRANSACTION_MODES_WITH_ICON: {
  label: string;
  value: string;
  icon: ReactNode;
}[] = [
  {
    label: "Bank Transfer - Terminal",
    value: "TERMINAL",
    icon: <BankIcon stroke="#5C636D" />,
  },
  { label: "Cash", value: "CASH", icon: <BankNoteIcon /> },
  { label: "Pos", value: "POS", icon: <TransactionPosIcon /> },
  {
    label: "Other Bank Transfers",
    value: "BANK",
    icon: <TransactionWalletIcon />,
  },
];

export const payment_status = [
  {
    value: "PAID",
    key: "Paid",
  },
  {
    value: "UNPAID",
    key: "Unpaid",
  },
  {
    value: "PARTIALLY_PAID",
    key: "Partially Paid",
  },
];

export const PaymentSection = ({
  selectedPaymentStatus,
  setSelectedPaymentStatus,
}: {
  selectedPaymentStatus: string;
  setSelectedPaymentStatus: (val: string) => void;
}) => {
  const [openMatchModal, setOpenMatchModal] = useState(false);
  const [expanded, setExpanded] = useState<boolean>(true);
  const { watch, setValue } = useFormContext();

  useEffect(() => {
    setValue("payment_method", "TERMINAL");
    setValue("hasPayment", "PAID");
  }, []);

  return (
    <>
      <div className="pd_payment_section accordion_sections">
        <Accordion className="accordion" expanded={expanded}>
          <AccordionSummary
            className="accordion_summary"
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <p>Payment</p>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              {/* <div className="form-group-flex"> */}
              <div className="payment_button_box">
                <label>Payment Status</label>
                <div className="payment_btn_flex">
                  {payment_status.map((item) => (
                    <Button
                      onClick={() => {
                        setValue("terminal", null);
                        setSelectedPaymentStatus(item.value);
                        setValue("hasPayment", item.value);
                        if (item.value === "UNPAID") {
                          setValue("payment_method", "");
                        } else {
                          setValue("payment_method", "TERMINAL");
                        }
                      }}
                      className={`${
                        selectedPaymentStatus === item.value ? "active" : ""
                      }`}
                    >
                      {item.key}
                    </Button>
                  ))}
                </div>
              </div>
              {(watch("hasPayment") === "PAID" ||
                watch("hasPayment") === "PARTIALLY_PAID") && (
                <>
                  <div className="form-group-flex wrapper">
                    <SelectField
                      required={false}
                      name="payment_method"
                      selectOption={TRANSACTION_MODES_WITH_ICON.map((item) => {
                        return {
                          value: item.value,
                          key: item.label,
                          icon: item.icon,
                        };
                      })}
                      handleCustomChange={(val) => {
                        if (val !== "TERMINAL") {
                          setValue("terminal", null);
                        }
                      }}
                      label="Select payment method"
                    />

                    {watch("payment_method") !== "TERMINAL" &&
                      watch("hasPayment") === "PARTIALLY_PAID" && (
                        <ValidatedInput
                          name="payment_amount"
                          label="Amount Paid"
                          type={"number"}
                        />
                      )}
                    {watch("payment_method") === "TERMINAL" && (
                      <div className="cover_customer_select select_terminal">
                        <div
                          onClick={() => {
                            setOpenMatchModal(true);
                          }}
                          className="pick_cutomer"
                        >
                          <label>Select Terminal Payment</label>
                          <div>
                            <p>
                              {watch("terminal") ? (
                                `${
                                  watch("terminal")?.meta?.sender_name
                                } - ${formatPrice(
                                  Number(watch("terminal")?.amount)
                                )}`
                              ) : (
                                <span>Select Payment</span>
                              )}
                            </p>
                            <ChevronDownIcon />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              <TextEditor
                label="Additional Notes"
                required={false}
                name="note"
              />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      <TransactionsToMatchModal
        openModal={openMatchModal}
        closeModal={() => {
          setOpenMatchModal(false);
        }}
        isSkip={false}
        actionFnc={(transaction: TransactionListType) => {
          setValue("terminal", transaction);
          setOpenMatchModal(false);
        }}
      />
    </>
  );
};

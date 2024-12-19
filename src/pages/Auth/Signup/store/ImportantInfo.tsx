import { Checkbox, FormControlLabel } from "@mui/material";
import "./style.scss";
import { RadioIcon } from "assets/Icons/RadioIcon";
import { RadioCheckedIcon } from "assets/Icons/RadioCheckedIcon";
import { TagIcon } from "assets/Icons/TagIcon";
import { CoinsHandIcon } from "assets/Icons/CoinsHandIcon";
import { FileIcon } from "assets/Icons/FileIcon";
import { UserCircleIcon } from "assets/Icons/UserCircleIcon";
import { CoinStackedIcon } from "assets/Icons/CoinStackedIcon";
import { PresentationChartIcon } from "assets/Icons/PresentationChartIcon";
import { FastForwardIcon } from "assets/Icons/FastForwardIcon";
import { MarkerPin02Icon } from "assets/Icons/MarkerPin02Icon";
import { SectionTitle } from "../widget/SectionTitle";

type ImportantInfoProps = {
  display: string;
  onCheckboxChange: (value: string, checked: boolean) => void;
  selectedItems: string[];
};

const checkList = [
  {
    text: "Create a website & run sales",
    value: "website_run_sales",
    icon: <TagIcon />,
  },
  {
    text: "Record daily sales & expenses",
    value: "record_sales_expenses",
    icon: <CoinsHandIcon stroke="#009444" />,
  },
  {
    text: "Create invoices & receipts",
    value: "invoices_receipts",
    icon: <FileIcon stroke="#009444" />,
  },
  {
    text: "Manage my inventory and staff across different locations",
    value: "inventory_locations",
    icon: <MarkerPin02Icon />,
  },
  {
    text: "Record customer details & send bulk SMS/Emails to them",
    value: "campaigns_customers",
    icon: <UserCircleIcon />,
  },
  {
    text: "Process local and international payments for my business",
    value: "business_analytics",
    icon: <CoinStackedIcon stroke="#009444" />,
  },
  {
    text: "Get detailed business analytics",
    value: "manage_staff_terminal",
    icon: <PresentationChartIcon />,
  },
  {
    text: "Automate my sales & order process",
    value: "order_processing",
    icon: <FastForwardIcon />,
  },
];

export const ImportantInfo = ({
  display,
  onCheckboxChange,
  selectedItems,
}: ImportantInfoProps) => {
  const handleCheckboxChange = (value: string, checked: boolean) => {
    onCheckboxChange(value, checked);
  };

  return (
    <div className={`${display} pd_formsection`}>
      <div className="content_wrapper">
        <SectionTitle title="What are the 3 most important things you want to use Bumpa for?" />
        <div className="checkbox_container">
          {checkList.map((item, i) => (
            <div
              className={`checkbox_wrapper ${
                selectedItems.includes(item.value) ? "checked" : ""
              }`}
              key={i}
            >
              <FormControlLabel
                key={item.value}
                control={
                  <Checkbox
                    className="check_box visually-hidden"
                    checked={selectedItems.includes(item.value)}
                    onChange={(e) =>
                      handleCheckboxChange(item.value, e.target.checked)
                    }
                    icon={<RadioIcon />}
                    checkedIcon={<RadioCheckedIcon />}
                  />
                }
                label={
                  <div className="text_box">
                    <div className="text_box-icon">{item.icon}</div>
                    <p>{item.text}</p>
                  </div>
                }
                labelPlacement="start"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

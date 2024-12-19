import "./style.scss";
import { CheckVerifiedIcon } from "assets/Icons/CheckVerifiedIcon";
import { CoinsHandIcon } from "assets/Icons/CoinsHandIcon";
import { FileAttachmentIcon } from "assets/Icons/FileAttachmentIcon";
import { GlobeIcon } from "assets/Icons/Sidebar/GlobeIcon";
import { HardDriveIcon } from "assets/Icons/HardDriveIcon";
import { MarkerPin02Icon } from "assets/Icons/MarkerPin02Icon";
import { PaletteIcon } from "assets/Icons/PaletteIcon";
import { PresentationChartIcon } from "assets/Icons/PresentationChartIcon";
import { SaleIcon } from "assets/Icons/Sidebar/SaleIcon";
import { ScanIcon } from "assets/Icons/ScanIcon";
import { SendIcon } from "assets/Icons/SendIcon";
import { ServerIcon } from "assets/Icons/ServerIcon";
import { ShoppingCartIcon } from "assets/Icons/ShoppingCartIcon";
import { Tag03Icon } from "assets/Icons/Tag03Icon";
import { UserCircleIcon } from "assets/Icons/UserCircleIcon";
import { SubmitButton } from "components/forms/SubmitButton";
import { singlePlan } from "../../plan";

export type columnSinglepPlanProps = {
  item: singlePlan;
  setSelectedPlan: (value: singlePlan) => void;
  isLoading: boolean;
  recommendedPlan: string;
};

const planCheckList = [
  {
    type: "starter",
    checkList: [
      {
        icon: PaletteIcon,
        text: "Business website + customisation",
      },
      {
        icon: SendIcon,
        text: "100 messaging credits",
      },
      {
        icon: ShoppingCartIcon,
        text: "Unlimited sales and expenses record",
      },
      {
        icon: ServerIcon,
        text: "Integrations: Shipbubble, Fez, Facebook Pixel etc",
      },
      {
        icon: FileAttachmentIcon,
        text: "1000 invoices/receipts monthly",
      },
      {
        icon: SaleIcon,
        text: "Unlimited discounts and coupons",
      },
    ],
  },
  {
    type: "pro",
    checkList: [
      {
        icon: CheckVerifiedIcon,
        text: "Everything in Starter",
      },
      {
        icon: GlobeIcon,
        text: "Free .com.ng domain (on yearly plan)",
      },
      {
        icon: SendIcon,
        text: "200 messaging credits",
      },
      {
        icon: FileAttachmentIcon,
        text: "2000 invoices/receipts monthly",
      },
      {
        icon: ServerIcon,
        text: "Integrations: Shipbubble, Fez, Google Analytics, Facebook Pixel etc",
      },
      {
        icon: UserCircleIcon,
        text: "3 staff account",
      },
      {
        icon: PresentationChartIcon,
        text: "Comprehensive business analytics",
      },
    ],
  },
  {
    type: "growth",
    checkList: [
      {
        icon: CheckVerifiedIcon,
        text: "Everything in other plans",
      },
      {
        icon: FileAttachmentIcon,
        text: "Issue 2000 invoices/receipts",
      },
      {
        icon: SendIcon,
        text: "1000 messaging credits",
      },
      {
        icon: MarkerPin02Icon,
        text: "2 Store location management",
      },
      {
        icon: CoinsHandIcon,
        text: "Naira + US Dollar (payments & settlement)",
      },
      {
        icon: HardDriveIcon,
        text: "In store check out (Point of Sale)",
      },
      {
        icon: ScanIcon,
        text: "Barcode generator/scanner software",
      },
      {
        icon: ServerIcon,
        text: "Integrations: Shipbubble, Fez, Google Analytics, Facebook Pixel etc",
      },
      {
        icon: UserCircleIcon,
        text: "5 staff account",
      },
    ],
  },
];

export const ColumnSinglePlanComponent = ({
  item,
  setSelectedPlan,
  isLoading,
  recommendedPlan,
}: columnSinglepPlanProps) => {
  const recommended = item.slug === recommendedPlan;
  const currentPlanCheckList =
    planCheckList.find((plan) => plan.type === item.slug)?.checkList || [];

  return (
    <div
      className={`pd_columnSingle_plan ${
        recommended ? "recommendedWrap" : "notRecommendedWrap"
      }`}
    >
      {recommended && (
        <div className="recommended">
          <div className="recommended-tag">
            <span>RECOMMENDED</span>
          </div>
        </div>
      )}
      <div className="title_feature_button">
        <div className="title_feature">
          <div className="title_section">
            <h3 className="title">{`Bumpa ${item.slug}`}</h3>
            <p className="description">{item.description}</p>
          </div>
          <div className="feature_section">
            {currentPlanCheckList &&
              currentPlanCheckList.length > 0 &&
              currentPlanCheckList.map((feature, i) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    className={`feature_section-each ${
                      recommended ? "recommended-icon" : ""
                    }`}
                    key={i}
                  >
                    <div className="feature_section-each-icon">
                      <IconComponent
                        stroke={recommended ? "#009444" : "#5C636D"}
                        isActive={recommended}
                        strokeWidth={1.5}
                      />
                    </div>
                    <p>{feature.text}</p>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="button-container">
          <SubmitButton
            text={"Select Plan"}
            isLoading={isLoading}
            disabled={isLoading}
            handleClick={() => {
              setSelectedPlan(item);
            }}
            type={"button"}
          />
        </div>
      </div>
    </div>
  );
};

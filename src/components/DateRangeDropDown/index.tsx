import { Button } from "@mui/material";
import {
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { DateRange } from "react-date-range";
import "./style.scss";
import { UpgradeModal } from "components/UpgradeModal";
import {
  selectIsSubscriptionExpired,
  selectIsSubscriptionType,
} from "store/slice/AuthSlice";
import { showToast, useAppSelector } from "store/store.hooks";
import {
  getDaysBetweenDates,
  lastMonthEnd,
  lastMonthStart,
  lastQuarterEnd,
  lastQuarterStart,
  lastWeekEnd,
  lastWeekStart,
  lastYearEnd,
  lastYearStart,
  thisMonthEnd,
  thisMonthStart,
  thisQuarterEnd,
  thisQuarterStart,
  thisWeekEnd,
  thisWeekStart,
  thisYearEnd,
  thisYearStart,
} from "utils/constants/general";

type Props = {
  from?: string;
  action: ReactNode;
  className?: string;
  closeOnChildClick?: boolean;
  position?: "top" | "bottom";
  closeOnOutsideClick?: boolean;
  extraClick?: Function;
  hover?: boolean;
  origin?: "left" | "right";
  setCustomState?: any;
  compareDateRange?: any;
  dateRangeType?: string;
  setDateRangeType?: (val: string) => void;
  resetCompare?: () => void;
  minDate?: Date;
  defaultDates?: {
    startDate: Date;
    endDate: Date;
  };
};

const DateRangeDropDown = ({
  action,
  className,
  closeOnChildClick = false,
  closeOnOutsideClick = true,
  hover,
  position = "bottom",
  origin = "left",
  extraClick = () => {},
  setCustomState,
  compareDateRange,
  setDateRangeType,
  dateRangeType,
  defaultDates,
  resetCompare,
  from,
  minDate,
}: Props) => {
  const [showDropDown, setshowDropDown] = useState(false);
  const [compareRangeType, setCompareRangeType] = useState("");
  const ref = useRef() as MutableRefObject<HTMLDivElement>;
  const [state, setState] = useState([
    {
      startDate: defaultDates
        ? defaultDates?.startDate
        : compareDateRange
        ? lastYearStart
        : thisYearStart,
      endDate: defaultDates
        ? defaultDates?.endDate
        : compareDateRange
        ? lastYearEnd
        : thisYearEnd,
      key: "selection",
    },
  ]);

  const customChangeDate = (start: Date, end: Date) => {
    setState([
      {
        startDate: start,
        endDate: end,
        key: "selection",
      },
    ]);
  };

  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [isProUpgrade, setIsProUpgrade] = useState(false);
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);
  const isSubscriptionExpired = useAppSelector(selectIsSubscriptionExpired);

  const handleApply = async () => {
    if (
      from !== "referrals" &&
      (isSubscriptionExpired ||
        isSubscriptionType === "free" ||
        isSubscriptionType === "starter")
    ) {
      setshowDropDown(false);
      setIsProUpgrade(true);
      setOpenUpgradeModal(true);
    } else {
      if (compareDateRange) {
        let dateRangeDiff = getDaysBetweenDates(
          compareDateRange[0]?.startDate,
          compareDateRange[0]?.endDate
        );
        let stateRangeDiff = getDaysBetweenDates(
          state[0]?.startDate,
          state[0]?.endDate
        );
        if (dateRangeDiff === stateRangeDiff) {
          setCustomState(state);
          setshowDropDown(false);
        } else if (dateRangeType === compareRangeType) {
          setCustomState(state);
          setshowDropDown(false);
        } else {
          showToast("Please select date with equal range", "error");
        }
      } else {
        setCustomState(state);
        setshowDropDown(false);
      }
    }
  };

  useEffect(() => {}, [state]);

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (closeOnOutsideClick) {
        if (showDropDown && ref.current && !ref.current?.contains(e.target)) {
          setshowDropDown(false);
        }
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [showDropDown, closeOnOutsideClick]);

  return (
    <div ref={ref} className={`drop-down-date-picker ${className || ""}`}>
      <div
        onClick={() => {
          extraClick();
          setshowDropDown(!showDropDown);
        }}
        onMouseEnter={() => {
          hover && setshowDropDown(true);
        }}
        onMouseLeave={() => {
          hover && setshowDropDown(false);
        }}
        className="drop-down-action"
      >
        {action}
      </div>
      <div
        className={`drop_down_cover ${
          origin === "right" ? "from_right" : "from_left"
        } ${showDropDown ? "show-drop-down" : ""} 
        
        ${position === "top" ? "from_top" : "from_bottom"}
        `}
      >
        <div
          onClick={(e) =>
            e.target === e.currentTarget && setshowDropDown(false)
          }
          className={`drop-down-content    `}
        >
          <div className="date_range_cover">
            <div className="quick_range">
              <Button
                onClick={() => {
                  customChangeDate(lastWeekStart, lastWeekEnd);
                }}
              >
                Last week
              </Button>
              <Button
                onClick={() => {
                  customChangeDate(thisWeekStart, thisWeekEnd);
                }}
              >
                This week
              </Button>
              <Button
                onClick={() => {
                  customChangeDate(lastMonthStart, lastMonthEnd);
                  setDateRangeType && setDateRangeType("month");
                  setCompareRangeType("month");
                }}
              >
                Last Month
              </Button>
              <Button
                onClick={() => {
                  customChangeDate(thisMonthStart, thisMonthEnd);
                  setDateRangeType && setDateRangeType("month");
                  setCompareRangeType("month");
                }}
              >
                This Month
              </Button>
              <Button
                onClick={() => {
                  customChangeDate(lastQuarterStart, lastQuarterEnd);
                  setDateRangeType && setDateRangeType("quarter");
                  setCompareRangeType("quarter");
                }}
              >
                Last Quarter
              </Button>
              <Button
                onClick={() => {
                  customChangeDate(thisQuarterStart, thisQuarterEnd);
                  setDateRangeType && setDateRangeType("quarter");
                  setCompareRangeType("quarter");
                }}
              >
                This Quarter
              </Button>
              <Button
                onClick={() => {
                  customChangeDate(lastYearStart, lastYearEnd);
                  setCompareRangeType("yaer");
                  setDateRangeType && setDateRangeType("yaer");
                }}
              >
                Last Year
              </Button>
              <Button
                onClick={() => {
                  customChangeDate(thisYearStart, thisYearEnd);
                  setDateRangeType && setDateRangeType("yaer");
                  setCompareRangeType("yaer");
                }}
              >
                This Year
              </Button>
            </div>
            <div className="range_box">
              <DateRange
                editableDateInputs={true}
                onChange={(item: any) => setState([item.selection])}
                moveRangeOnFirstSelection={false}
                maxDate={compareDateRange && compareDateRange[0]?.startDate}
                minDate={minDate}
                ranges={state}
                color={"#009444"}
                rangeColors={["#009444"]}
              />{" "}
            </div>
          </div>

          <div className="button_flex_box">
            <Button
              variant="outlined"
              onClick={() => {
                handleApply();
              }}
            >
              Apply
            </Button>
            {compareDateRange ? (
              ""
            ) : (
              <Button
                variant="outlined"
                onClick={() => {
                  setState([
                    {
                      startDate: thisYearStart,
                      endDate: thisYearEnd,
                      key: "selection",
                    },
                  ]);

                  setCustomState([
                    {
                      startDate:
                        from === "wallet" || "referrals" ? "" : thisYearStart,
                      endDate:
                        from === "wallet" || "referrals" ? "" : thisYearEnd,
                      key: "selection",
                    },
                  ]);
                  setshowDropDown(false);
                }}
              >
                Reset
              </Button>
            )}
            {compareDateRange && (
              <Button
                variant="outlined"
                onClick={() => {
                  resetCompare && resetCompare();
                  setshowDropDown(false);
                }}
              >
                Clear
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={() => {
                setshowDropDown(false);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
      {openUpgradeModal && (
        <UpgradeModal
          openModal={openUpgradeModal}
          closeModal={() => setOpenUpgradeModal(false)}
          pro={isProUpgrade}
          title={`View detailed analytics on a Bumpa plan`}
          subtitle={`Compare different datasets and get better business insights.`}
          proFeatures={[
            "Get Analytics on Campaigns & Compare Data",
            "No business summary via email",
            "Get business tips via Bumpa AI",
            "Cannot integrate Google Analytics",
          ]}
          growthFeatures={[
            "Get Analytics on Campaigns & Compare Data",
            "Get monthly business summary via email",
            "Get business tips via Bumpa AI",
            "Integrate Google Analytics",
          ]}
          eventName="analytics"
        />
      )}
    </div>
  );
};

export default DateRangeDropDown;

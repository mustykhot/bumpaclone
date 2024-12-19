import { useState, useEffect } from "react";

import uuid from "react-uuid";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  IconButton,
} from "@mui/material";

import { Toggle } from "components/Toggle";

import { CalenderIcon } from "assets/Icons/CalenderIcon";
import { XIcon } from "assets/Icons/XIcon";
import { CircleAddIcon } from "assets/Icons/CircleAddIcon";
import { ChevronRight } from "assets/Icons/ChevronRight";
import { ContentHeader } from "../../settings";

import InputField from "components/forms/InputField";
import NormalSelectField from "components/forms/NormalSelectField";
import NormalMultipleSelectField from "components/forms/NormalMultipleSelectField";
import { IndicatorComponent } from "components/IndicatorComponent";

import { useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  selectSettingsField,
  selectSettingsUpdateField,
  updateShippingSettingState,
} from "store/slice/ShippingSettingsSlice";

import "./style.scss";

type DateTimeType = {
  day: string;
  times: { startTime: string; endTime: string; id: string }[];
};

type handleChangeTimeType = ({
  day,
  timeId,
  value,
  type,
}: {
  day: string;
  timeId: string;
  value?: { startTime: string; endTime: string };
  type: "add" | "remove";
}) => void;

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const hasValidTimeEntry = (timeObj: DateTimeType) => {
  if (Array.isArray(timeObj.times)) {
    return timeObj.times.some((time) => time.startTime && time.endTime);
  }
  return false;
};

function checkSchedule(schedule: any) {
  console.log(schedule, "schedule");
  const allDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const weekend = ["Saturday", "Sunday"];

  const days = schedule.map((item: any) => item.day.toLocaleLowerCase());

  if (allDays.every((day) => days.includes(day.toLocaleLowerCase()))) {
    return "everyday";
  } else if (
    weekdays.every((day) => days.includes(day)) &&
    weekend.every((day) => !days.includes(day))
  ) {
    return "weekdays";
  } else if (
    weekend.every((day) => days.includes(day)) &&
    weekdays.every((day) => !days.includes(day))
  ) {
    return "weekend";
  }

  return "";
}

export const WEEKDAYOPTIONS = [
  { key: "Monday", value: "monday" },
  { key: "Tuesday", value: "tuesday" },
  { key: "Wednesday", value: "wednesday" },
  { key: "Thursday", value: "thursday" },
  { key: "Friday", value: "friday" },
];

export const WEEKENDOPTIONS = [
  { key: "Saturday", value: "saturday" },
  { key: "Sunday", value: "sunday" },
];

export const CALENDEROPTIONS = [
  {
    key: "Everyday of the week",
    value: "everyday",
    icon: <CalenderIcon />,
  },
  {
    key: "Weekdays (Monday - Friday)",
    value: "weekdays",
    icon: <CalenderIcon />,
  },
  {
    key: "Weekends (Saturday - Sunday)",
    value: "weekends",
    icon: <CalenderIcon />,
  },
];

const REMINDEROPTIONS = Array.from({ length: 30 }, (_, index) => ({
  value: `${index + 1}`,
  key: `${index + 1} day${index === 0 ? "" : "s"} to delivery`,
}));

const TimeComponent = ({
  timeObj,
  day,
  handleChangeTime,
}: {
  day: string;
  timeObj: { startTime: string; endTime: string; id: string };
  handleChangeTime: handleChangeTimeType;
}) => {
  const [time, setTime] = useState({ startTime: "", endTime: "" });

  return (
    <div className="single_time">
      {timeObj.endTime && timeObj.startTime ? (
        <div className="display_time">
          <p>
            {timeObj.startTime} - {timeObj.endTime}
          </p>

          <IconButton
            onClick={() => {
              handleChangeTime({ day, timeId: timeObj.id, type: "remove" });
            }}
            className="p-0"
          >
            <XIcon stroke="#9BA2AC" />
          </IconButton>
        </div>
      ) : (
        <div className="input_time">
          <input
            onChange={(e) => {
              setTime({
                startTime: e.target.value,
                endTime: time.endTime,
              });
            }}
            value={time.startTime}
            type="time"
            placeholder="Start time"
          />

          <ChevronRight className="chevron" stroke="#9BA2AC" />

          <input
            onChange={(e) => {
              setTime({
                startTime: time.startTime,
                endTime: e.target.value,
              });
            }}
            value={time.endTime}
            type="time"
            placeholder="End time"
          />
          <IconButton
            onClick={() => {
              handleChangeTime({
                day: day,
                value: { startTime: time.startTime, endTime: time.endTime },
                type: "add",
                timeId: timeObj.id,
              });
              setTime({ startTime: "", endTime: "" });
            }}
            disabled={time.endTime && time.startTime ? false : true}
          >
            <CircleAddIcon
              stroke={time.endTime && time.startTime ? "#009444" : "#9BA2AC"}
            />
          </IconButton>
        </div>
      )}
    </div>
  );
};

const DaysComponent = ({
  dayObj,
  handleChangeTime,
  revertSetTimeObjToAll,
  setTimeObjToAll,
  i,
}: {
  dayObj: DateTimeType;
  handleChangeTime: handleChangeTimeType;
  revertSetTimeObjToAll: (dayObj: DateTimeType) => void;
  setTimeObjToAll: (dayObj: DateTimeType) => void;
  i: number;
}) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="single_time_row">
      <div className="day">
        <p>{dayObj.day}</p>
      </div>

      <div className="time_section">
        <div className="time_flex">
          {dayObj.times.map((item) => (
            <TimeComponent
              timeObj={item}
              day={dayObj.day}
              handleChangeTime={handleChangeTime}
              key={item.id}
            />
          ))}
        </div>

        {i === 0 && hasValidTimeEntry(dayObj) && (
          <div className="check_box">
            <Checkbox
              checked={checked}
              size="small"
              onChange={() => {
                setChecked(!checked);
                if (checked) {
                  revertSetTimeObjToAll(dayObj);
                } else {
                  setTimeObjToAll(dayObj);
                }
              }}
            />
            <p>Apply same time for all days</p>
          </div>
        )}
      </div>
    </div>
  );
};

const DeliverySettings = () => {
  const dispatch = useAppDispatch();
  const shippingSettingsFields = useAppSelector(selectSettingsField);
  const shippingSettingsUpdateFields = useAppSelector(
    selectSettingsUpdateField
  );

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [calender, setCalender] = useState("");

  const handleAccordionChange = (checked?: boolean) => {
    if (typeof checked === "boolean") {
      dispatch(updateShippingSettingState({ use_delivery_timeline: checked }));
    } else {
      dispatch(
        updateShippingSettingState({
          use_delivery_timeline:
            !shippingSettingsUpdateFields?.use_delivery_timeline,
        })
      );
    }
  };

  const handleChangeTime = ({
    day,
    timeId,
    value,
    type,
  }: {
    day: string;
    timeId: string;
    value?: { startTime: string; endTime: string };
    type: "add" | "remove";
  }) => {
    let prevShippingFields = shippingSettingsUpdateFields?.delivery_days;

    if (!prevShippingFields) {
      return;
    }

    const dayIndex = prevShippingFields.findIndex((item) => item.day === day);

    if (dayIndex !== -1) {
      let updatedList = [...prevShippingFields];

      let newTimes = [...updatedList[dayIndex].times];

      if (type === "add" && value) {
        const timeIndex = newTimes.findIndex((time) => time.id === timeId);

        if (timeIndex !== -1) {
          newTimes[timeIndex] = {
            ...newTimes[timeIndex],
            startTime: value.startTime,
            endTime: value.endTime,
          };
        } else {
          newTimes.push({
            startTime: value.startTime,
            endTime: value.endTime,
            id: `${uuid()}`,
          });
        }

        newTimes.push({
          startTime: "",
          endTime: "",
          id: `${uuid()}`,
        });

        updatedList[dayIndex] = {
          ...updatedList[dayIndex],
          times: newTimes,
        };
      } else if (type === "remove" && timeId) {
        const timeIndex = newTimes.findIndex((time) => time.id === timeId);

        if (timeIndex !== -1) {
          newTimes.splice(timeIndex, 1);
          if (newTimes.length === 0) {
            newTimes.push({
              startTime: "",
              endTime: "",
              id: `${uuid()}`,
            });
          }
        }

        updatedList[dayIndex] = {
          ...updatedList[dayIndex],
          times: newTimes,
        };
      }

      updatedList.sort((a, b) => {
        return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
      });

      dispatch(
        updateShippingSettingState({
          delivery_days: updatedList,
        })
      );
    }
  };

  const setTimeObjToAll = (dayObj: DateTimeType) => {
    let prevShippingFields = shippingSettingsUpdateFields?.delivery_days;

    if (!prevShippingFields) {
      return;
    }

    const newTimeList = dayObj.times
      .filter((el) => el.startTime && el.endTime)
      .map((time) => ({
        startTime: time.startTime,
        endTime: time.endTime,
      }));

    newTimeList.push({
      startTime: "",
      endTime: "",
    });

    let updatedList = prevShippingFields.map((item) => {
      if (item.day !== dayObj.day) {
        return {
          ...item,
          times: newTimeList.map((time) => ({
            ...time,
            id: `${uuid()}`,
          })),
        };
      }
      return item;
    });

    updatedList.sort((a, b) => {
      return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
    });

    dispatch(
      updateShippingSettingState({
        delivery_days: updatedList,
      })
    );
  };

  const revertSetTimeObjToAll = (dayObj: DateTimeType) => {
    let prevShippingFields = shippingSettingsUpdateFields?.delivery_days;

    if (!prevShippingFields) {
      return;
    }

    const normalTimeList = [
      {
        startTime: "",
        endTime: "",
      },
    ];

    let updatedList = prevShippingFields.map((item) => {
      if (item.day !== dayObj.day) {
        return {
          ...item,
          times: normalTimeList.map((time) => ({
            ...time,
            id: `${uuid()}`,
          })),
        };
      }
      return item;
    });

    updatedList.sort((a, b) => {
      return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
    });

    dispatch(
      updateShippingSettingState({
        delivery_days: updatedList,
      })
    );
  };

  const handleSelectedDaysChanged = (val: string[]) => {
    setSelectedDays(val);

    let newArrayObj = val
      .filter(
        (day) =>
          !shippingSettingsUpdateFields?.delivery_days?.some(
            (obj) => obj.day === day
          )
      )
      .map((item) => {
        return {
          day: item,
          times: [{ startTime: "", endTime: "", id: `${uuid()}` }],
        };
      });

    let updatedList: DateTimeType[];

    if (shippingSettingsUpdateFields?.delivery_days?.length) {
      updatedList = [
        ...shippingSettingsUpdateFields?.delivery_days,
        ...newArrayObj,
      ];
    } else {
      updatedList = [...newArrayObj];
    }

    updatedList.sort((a, b) => {
      return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
    });

    const filteredList = updatedList.filter((item) => val.includes(item.day));

    dispatch(
      updateShippingSettingState({
        delivery_days: filteredList,
      })
    );
  };

  useEffect(() => {
    if (shippingSettingsFields) {
      let calenderDay = checkSchedule(
        shippingSettingsFields?.delivery_days || []
      );

      console.log(calenderDay, "calenderDay");

      setCalender(calenderDay);

      let daysList = shippingSettingsFields?.delivery_days?.map((item) =>
        item.day.toLowerCase()
      );

      if (daysList?.length) {
        setSelectedDays(daysList);
      }

      let temporaryDateTime = shippingSettingsFields.delivery_days?.map(
        (item) => {
          return {
            ...item,
            day: item.day.toLowerCase(),
            times: [
              ...(item.times || []),
              {
                startTime: "",
                endTime: "",
                id: `${uuid()}`,
              },
            ],
          };
        }
      );

      if (temporaryDateTime?.length) {
        dispatch(
          updateShippingSettingState({
            delivery_days: temporaryDateTime,
          })
        );
      }
    }
  }, [shippingSettingsFields]);

  return (
    <div className="pd_delivery_settings">
      <div className="content_area">
        <Accordion
          className="accordion"
          expanded={
            shippingSettingsUpdateFields?.use_delivery_timeline || false
          }
          onChange={() => {
            handleAccordionChange();
          }}
        >
          <AccordionSummary
            className="accordion_summary"
            aria-controls="panel1a-content"
            id="panel1a-header"
            expandIcon={
              <Toggle
                toggled={
                  shippingSettingsUpdateFields?.use_delivery_timeline || false
                }
                handlelick={handleAccordionChange}
              />
            }
          >
            <ContentHeader
              title="Delivery Timelines"
              description="You can set up delivery days and time"
            />
          </AccordionSummary>

          <AccordionDetails className="accordion_details">
            <div className="form-group-flex">
              <NormalSelectField
                name="type"
                selectOption={CALENDEROPTIONS}
                label="Calendar"
                value={calender}
                onChange={(val: any) => {
                  setCalender(val);
                }}
              />

              <NormalMultipleSelectField
                name="days"
                selectOption={
                  calender === "everyday"
                    ? [...WEEKDAYOPTIONS, ...WEEKENDOPTIONS]
                    : calender === "weekdays"
                    ? WEEKDAYOPTIONS
                    : WEEKDAYOPTIONS
                }
                required={false}
                label="Select Days"
                value={selectedDays}
                handleCustomChange={(val) => {
                  handleSelectedDaysChanged(val);
                }}
              />
            </div>

            {shippingSettingsUpdateFields?.delivery_days?.length ? (
              <>
                <IndicatorComponent description="Leave time field empty if time doesn’t apply to your business" />

                <div className="set_time_section">
                  {shippingSettingsUpdateFields.delivery_days.map((item, i) => (
                    <DaysComponent
                      dayObj={item}
                      handleChangeTime={handleChangeTime}
                      key={item.day}
                      i={i}
                      revertSetTimeObjToAll={revertSetTimeObjToAll}
                      setTimeObjToAll={setTimeObjToAll}
                    />
                  ))}
                </div>

                <div className="check_box margin">
                  <Checkbox
                    checked={
                      shippingSettingsUpdateFields?.same_day_delivery || false
                    }
                    size="small"
                    onChange={() => {
                      dispatch(
                        updateShippingSettingState({
                          same_day_delivery:
                            !shippingSettingsUpdateFields?.same_day_delivery,
                        })
                      );
                    }}
                  />
                  <p>No same day delivery</p>
                </div>
              </>
            ) : (
              ""
            )}

            <div className="form-group-flex">
              <InputField
                name="days"
                type="number"
                value={shippingSettingsUpdateFields?.processing_days || ""}
                placeholder="1"
                label="Set processing days"
                extraClass="process-days"
                onChange={(e) => {
                  dispatch(
                    updateShippingSettingState({
                      processing_days: e.target.value,
                    })
                  );
                }}
                suffix={<IconButton className="days_btn">days</IconButton>}
              />

              <NormalSelectField
                name="type"
                selectOption={REMINDEROPTIONS}
                label="Set reminder"
                value={shippingSettingsUpdateFields?.reminder_days || ""}
                handleCustomChange={(e) => {
                  dispatch(
                    updateShippingSettingState({
                      reminder_days: e.target.value,
                    })
                  );
                }}
              />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default DeliverySettings;

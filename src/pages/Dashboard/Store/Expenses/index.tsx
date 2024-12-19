import { useEffect } from "react";
import { Button } from "@mui/material";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ExpensesTable } from "./ExpensesTable";
import "./style.scss";
import { ExpensesCategoryTable } from "./ExpensesCategory";
import { useAppDispatch } from "store/store.hooks";
import { setCategoryId } from "store/slice/Expense";

const sectionTab = [
  {
    name: "Expenses",
    value: "expense",
  },
  {
    name: "Expense Category",
    value: "category",
  },
];

export const Expenses = () => {
  const [tab, setTab] = useState("expense");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlTab = searchParams.get("tab");
  useEffect(() => {
    dispatch(setCategoryId(""));
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (urlTab) {
      setTab(urlTab);
    } else {
      setTab("expense");
    }
  }, [urlTab]);

  return (
    <div className="pd_expenses">
      <div className="title_section">
        <h3 className="name_of_section">Expenses & Expense Categories</h3>
        <div className="btn_flex">
          {tab === "expense" ? (
            <Button
              startIcon={<PlusIcon />}
              variant={"contained"}
              className="primary_styled_button"
              onClick={() => {
                navigate("create-expense");
              }}
            >
              Create new expense{" "}
            </Button>
          ) : (
            <Button
              startIcon={<PlusIcon />}
              className="primary_styled_button"
              variant={"contained"}
              onClick={() => {
                navigate("create-category");
              }}
            >
              Create new category{" "}
            </Button>
          )}
        </div>
      </div>

      <div className="expense_cover_container">
        <div className="tab_container">
          {sectionTab.map((item, i) => {
            return (
              // <Button
              //   key={i}
              //   onClick={() => {
              //     setTab(item.value);
              //   }}
              //   className={`${tab === item.value ? "active" : ""}`}

              // >
              //   {item.name}
              // </Button>
              <Button
                key={i}
                onClick={() => {
                  setTab(item.value);
                  const newUrl = `${window.location.origin}${window.location.pathname}?tab=${item.value}`;
                  window.history.replaceState(null, "", newUrl);
                }}
                className={`${tab === item.value ? "active" : ""} `}
              >
                {item.name}
              </Button>
            );
          })}
        </div>

        {tab === "expense" && <ExpensesTable />}
        {tab === "category" && <ExpensesCategoryTable />}
      </div>
    </div>
  );
};

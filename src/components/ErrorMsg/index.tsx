import { ErrorType } from "services/api.types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import "./style.scss";
import ErrorAlert from "assets/Icons/ErrorAlert";
import { ReactNode } from "react";

function ErrorMsg({
  error,
  button,
  icon,
  message,
}: {
  error?:
    | ErrorType
    | FetchBaseQueryError
    | SerializedError
    | undefined
    | string;
  button?: ReactNode;
  icon?: ReactNode;
  message?: string;
}) {
  let err = error as ErrorType | string;
  return (
    <div
      className="error-msg"
      style={{ margin: "2rem auto", minHeight: "50vh" }}
    >
      {icon || <ErrorAlert />}
      <h2 className="text-xl font-semibold">{message || "Oops, Error"}</h2>
      <p>
        {typeof err === "string"
          ? err
          : err?.status === "FETCH_ERROR"
          ? "Connection failed please try again later."
          : err?.error?.data?.message}
      </p>
      {button && button}
    </div>
  );
}

export default ErrorMsg;

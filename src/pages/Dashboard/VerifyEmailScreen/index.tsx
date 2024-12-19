import { useLocation, useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import "./style.scss";
import { useState, useEffect } from "react";
import { useConfirmMailMutation, useVerifyMailQuery } from "services";
import Loader from "components/Loader";
import { showToast } from "store/store.hooks";
import ErrorMsg from "components/ErrorMsg";
import { handleError } from "utils";
import { CheckCircleIcon } from "assets/Icons/CheckCircleIcon";
// eslint-disable-next-line
const VerifyEmailScreen = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [url, setUrl] = useState("");
  const [confirmMail, { isLoading: isLoadingMail }] = useConfirmMailMutation();
  const { data, isLoading, isError } = useVerifyMailQuery(url, {
    skip: url ? false : true,
  });
  const confirmEmailFnc = async () => {
    try {
      let result = await confirmMail({});
      if ("data" in result) {
        showToast("Mail Successfully sent", "success");
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    let pathname = location.pathname;
    let preparepath = `auth${pathname.slice(10)}${location.search}`;
    setUrl(preparepath);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (data) {
      showToast("Email Verified successfully", "success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }
    // eslint-disable-next-line
  }, [data]);

  return (
    <div className="pd_email_verify_page">
      {isLoading && <Loader />}
      {isError && (
        <ErrorMsg
          error={"Email Couldn't be verified"}
          button={
            <Button
              onClick={confirmEmailFnc}
              variant="contained"
              className="primary_styled_button"
            >
              {isLoadingMail ? (
                <CircularProgress size="1.5rem" sx={{ color: "#ffffff" }} />
              ) : (
                "Resend Verifiction mail"
              )}
            </Button>
          }
        />
      )}
      {isLoading && <p className="load_text">Verifying Email ... </p>}
      {data && (
        <ErrorMsg
          icon={<CheckCircleIcon />}
          message="Email Verified"
          button={
            <Button
              onClick={() => {
                navigate("/dashboard");
              }}
              variant="contained"
              className="primary_styled_button"
            >
              Go to dashboard
            </Button>
          }
        />
      )}
    </div>
  );
};

export default VerifyEmailScreen;

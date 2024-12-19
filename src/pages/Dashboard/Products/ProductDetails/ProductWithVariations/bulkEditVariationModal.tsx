import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import Modal from "components/Modal";
import { formatNumberWithCommas } from "components/forms/ValidatedInput";
import InputField from "components/forms/InputField";
import "./style.scss";
type BulkEditVariationModalProps = {
  openModal: boolean;
  title: string;
  closeModal: () => void;
  actionFnc: (number: number | string) => void;
  isLoading: boolean;
  inputVal: string;
  setInputVal: (val: string) => void;
};

export const BulkEditVariationModal = ({
  closeModal,
  openModal,
  actionFnc,
  title,
  isLoading,
  inputVal,
  setInputVal,
}: BulkEditVariationModalProps) => {
  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={() => {
          closeModal();
          setInputVal("");
        }}
      >
        <div className="change_value_container">
          <div className="title_section">
            <h6>{title} </h6>
          </div>
          <div className="form_section">
            <InputField
              label={"Input Value"}
              value={inputVal}
              type="text"
              disabled={isLoading}
              onChange={(e) => {
                if (
                  !isNaN(parseInt(e.target.value?.replace(/,/g, ""))) ||
                  e.target.value?.length === 0
                ) {
                  if (e.target.value?.length === 0) {
                    setInputVal("");
                  } else {
                    setInputVal(
                      formatNumberWithCommas(
                        parseFloat(e.target.value.replace(/,/g, ""))
                      )
                    );
                  }
                }
              }}
            />

            <div className="btn_flex">
              <Button
                onClick={() => {
                  setInputVal("");
                  closeModal();
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (inputVal) {
                    actionFnc(inputVal);
                  }
                }}
                className="primary_styled_button"
                variant="contained"
              >
                {isLoading ? (
                  <CircularProgress size="1.2rem" sx={{ color: "#ffffff" }} />
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

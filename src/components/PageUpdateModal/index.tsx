import { Button, CircularProgress, IconButton } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "assets/Icons/XIcon";
import update from "assets/images/update.png";
import smallupdate from "assets/images/smallupdate.png";
import "./style.scss";

type PropType = {
  openModal: boolean;
  closeModal: () => void;
  isLoading: boolean;
  updates?: { title: string; description: string }[];
  imageUrl?: any;
  btnText?: string;
  btnAction?: () => void;
  size: "small" | "large";
  title?: string;
  description?: string;
};

const PageUpdateModal = ({
  openModal,
  closeModal,
  isLoading,
  title,
  description,
  imageUrl,
  btnText,
  btnAction,
  size,
  updates,
}: PropType) => {
  return (
    <>
      <AnimatePresence>
        {openModal && window.location.origin === "https://app.getbumpa.com" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "just" }}
            className={`pd_update_modal_container ${size}`}
          >
            {size === "small" ? (
              <div className="cover_update_container">
                <IconButton
                  onClick={() => {
                    closeModal();
                  }}
                  disabled={isLoading}
                  className="cancel_box"
                >
                  {isLoading ? (
                    <CircularProgress
                      size="1.5rem"
                      sx={{ zIndex: 10, color: "#222D37" }}
                    />
                  ) : (
                    <XIcon />
                  )}
                </IconButton>

                <img
                  src={imageUrl || smallupdate}
                  alt="update"
                  className="image_box"
                />
                <div className="text_section">
                  {}
                  <h4 className="title">{title}</h4>
                  <p className="description">{description}</p>
                </div>
                <Button
                  disabled={isLoading}
                  variant="contained"
                  className="primary_styled_button"
                  onClick={() => {
                    if (btnAction) {
                      btnAction();
                    } else {
                      closeModal();
                    }
                  }}
                >
                  {btnText || "Learn more"}
                </Button>
              </div>
            ) : (
              <div className="cover_update_container_large">
                <IconButton
                  onClick={() => {
                    closeModal();
                  }}
                  disabled={isLoading}
                  className="cancel_box"
                >
                  {isLoading ? (
                    <CircularProgress
                      size="1.5rem"
                      sx={{ zIndex: 10, color: "#222D37" }}
                    />
                  ) : (
                    <XIcon />
                  )}{" "}
                </IconButton>

                <img src={update} alt="update" className="image_box" />
                <div className="text_section">
                  {updates?.map((item) => (
                    <div className="single_text">
                      <h4 className="title">{item.title}</h4>
                      <p className="description">{item.description}</p>
                    </div>
                  ))}

                  <Button
                    disabled={isLoading}
                    variant="contained"
                    className="primary_styled_button"
                    onClick={() => {
                      if (btnAction) {
                        btnAction();
                      } else {
                        closeModal();
                      }
                    }}
                  >
                    {btnText || "Learn more"}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PageUpdateModal;

import Modal from "components/Modal";
import "./style.scss";
import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  selectToggleVideoModal,
  selectVideoLink,
  selectVideoTitle,
  setVideoLink,
  setVideoTitle,
  setVideoToggle,
} from "store/slice/VideoWidgetSlice";
import { IconButton } from "@mui/material";
import { BackArrowIcon } from "assets/Icons/BackArrowIcon";

export const VideoWidget = () => {
  const videoLink = useAppSelector(selectVideoLink);
  const videoTitle = useAppSelector(selectVideoTitle);
  const toggleVideoModal = useAppSelector(selectToggleVideoModal);
  const dispatch = useAppDispatch();
  return (
    <Modal
      className="white_bg increase-z"
      closeModal={() => {
        dispatch(setVideoToggle(false));
        dispatch(setVideoTitle(""));
        dispatch(setVideoLink(""));
      }}
      openModal={toggleVideoModal}
    >
      <div className="watch_tutorial_container">
        <div className={`modal_header `}>
          <div className="back_button">
            <IconButton
              type="button"
              onClick={() => {
                dispatch(setVideoToggle(false));
                dispatch(setVideoTitle(""));
                dispatch(setVideoLink(""));
              }}
              className="icon_button_container"
            >
              <BackArrowIcon />
            </IconButton>
            <div className="content">
              <p>{videoTitle}</p>
            </div>
          </div>
        </div>
        <div className="video_box">{videoLink}</div>
      </div>
    </Modal>
  );
};

import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.types";
type initialStateType = {
  videoLink: any;
  videoTitle?: string;
  toggleVideoModal: boolean;
};
const initialState: initialStateType = {
  videoLink: "",
  videoTitle: "",
  toggleVideoModal: false,
};
const videoWidgetSlice = createSlice({
  name: "videoWidget",
  initialState,
  reducers: {
    setVideoLink(state, action) {
      state.videoLink = action.payload;
    },
    setVideoTitle(state, action) {
      state.videoTitle = action.payload;
    },
    setVideoToggle(state, action) {
      state.toggleVideoModal = action.payload;
    },
  },
});
const { actions, reducer } = videoWidgetSlice;
export const { setVideoLink, setVideoToggle, setVideoTitle } = actions;
export const selectVideoLink = (state: RootState) =>
  state.videoWidget.videoLink;
export const selectVideoTitle = (state: RootState) =>
  state.videoWidget.videoTitle;
export const selectToggleVideoModal = (state: RootState) =>
  state.videoWidget.toggleVideoModal;

export default reducer;

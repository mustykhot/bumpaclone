import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IStoreProfile } from "Models/store";
import { RootState } from "../store.types";

type ProfileType = {
  profile: IStoreProfile;
  profileAvatar: string;
  maintenanceModeStatus: boolean;
};

const profileState: ProfileType = {
  profile: {
    name: "",
    email: "",
    phone: "",
    id: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    new_password: "",
    old_password: "",
    pinterest: "",
    snapchat: "",
    telegram: "",
    twitter: "",
    avatar: "",
  },
  profileAvatar: "",
  maintenanceModeStatus: false,
};

const ProfileSlice = createSlice({
  name: "storeProfile",
  initialState: profileState,
  reducers: {
    setProfile: (state, { payload }: PayloadAction<IStoreProfile>) => {
      state.profile = payload;
    },
    setProfileAvatar: (state, { payload }: PayloadAction<string>) => {
      state.profileAvatar = payload;
    },
    setMaintenanceModeStatus: (state, { payload }: PayloadAction<boolean>) => {
      state.maintenanceModeStatus = payload;
    },
  },
});

const { actions, reducer } = ProfileSlice;
export const { setProfile, setProfileAvatar, setMaintenanceModeStatus } =
  actions;

// selector to select user details from the store
export const selectProfile = (state: RootState) => state.profile.profile;
export const selectProfileAvatar = (state: RootState) =>
  state.profile.profileAvatar;
export const selectMaintenanceModeStatus = (state: RootState) =>
  state.profile.maintenanceModeStatus;

export default reducer;

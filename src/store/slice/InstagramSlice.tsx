import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store.types";
import { MetaIntegration } from "services/api.types";

type InstagramType = {
    messageList: any;
    showIgDm: boolean;
    metaData: MetaIntegration;
    activeIndex: number;
    conversationList: any;
    webhookMessage: any;
    profileDataList: any;
    profilePicture: any;
};

const instagramState: InstagramType = {
    messageList: [],
    showIgDm: false,
    metaData: {
        success: false,
        integration: {
            id: "",
            store_id: 0,
            client_id: "",
            page_id: "",
            igid: "",
            token: "",
            page_access_token: "",
            avatar: "",
            expires_at: "",
            provider: "",
            scopes: [],
            created_at: "",
            updated_at: "",
            status: "",
            debug_message: "",
        },
    },
    activeIndex: 0,
    webhookMessage: {},
    conversationList: [],
    profileDataList: [],
    profilePicture: []
};

const InstagramSlice = createSlice({
    name: "instagram",
    initialState: instagramState,
    reducers: {
        setMessageList: (state, { payload }: PayloadAction<any>) => {
            state.messageList = payload;
        },

        setShowIgDm: (state, { payload }: PayloadAction<boolean>) => {
            state.showIgDm = payload;
        },

        setMetaData: (state, { payload }: PayloadAction<MetaIntegration>) => {
            state.metaData = payload;
        },

        setActiveIndex: (state, { payload }: PayloadAction<number>) => {
            state.activeIndex = payload;
        },
        setWebhookMessage: (state, { payload }: PayloadAction<any>) => {
            state.webhookMessage = payload;
        },
        setConversationList: (state, { payload }: PayloadAction<any>) => {
            state.conversationList = payload;
        },
        setProfileDataList: (state, { payload }: PayloadAction<any>) => {
            state.profileDataList = payload;
        },
        setProfilePicture: (state, { payload }: PayloadAction<any>) => {
            state.profilePicture = payload;
        },
    },
});

const { actions, reducer } = InstagramSlice;
export const {
    setMessageList,
    setShowIgDm,
    setMetaData,
    setActiveIndex,
    setWebhookMessage,
    setConversationList,
    setProfileDataList,
    setProfilePicture
} = actions;

export const selectMessageList = (state: RootState) =>
    state.instagram.messageList;
export const selectShowIgDm = (state: RootState) => state.instagram.showIgDm;
export const selectMetaData = (state: RootState) => state.instagram.metaData;
export const selectActiveIndex = (state: RootState) =>
    state.instagram.activeIndex;
export const selectWebhookMessage = (state: RootState) =>
    state.instagram.webhookMessage;
export const selectConversationList = (state: RootState) =>
    state.instagram.conversationList;
export const selectProfileDataList = (state: RootState) =>
    state.instagram.profileDataList;
export const selectProfilePicture = (state: RootState) =>
    state.instagram.profilePicture;

export default reducer;

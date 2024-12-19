import { createApi, fetchBaseQuery, BaseQueryFn, } from "@reduxjs/toolkit/query/react";


import {
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
} from "@reduxjs/toolkit/dist/query";
import { IConversationsList, ICustomerProfile } from "Models/messenger";


const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_BASE_META_URL,
    prepareHeaders: (headers) => {
        return headers;
    },

});


export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    {},
    FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    return result;
};


export const messengerApi = createApi({
    baseQuery: baseQueryWithReauth,
    reducerPath: "messengerApi",
    tagTypes: [
        "instagram"
    ],
    endpoints: (builder) => ({
        // Start of Instagarm DM Integration
        getInstagramConversation: builder.query<{ data: IConversationsList[]; paging?: {next: string} }, { pageAccessToken: string; limit: number; pageId: string; nextUrl?: string  }>({
            query: ({ pageAccessToken, limit = 4, pageId, nextUrl}) => ({
                url: !nextUrl ? `${pageId}/conversations?access_token=${pageAccessToken}&platform=instagram&limit=${limit}&fields=id,updated_time,participants,messages{id,created_time,from,to,is_unsupported,message,attachments,reactions,shares{link,template,name,description,id},story}` : `${pageId}/conversations?access_token=${pageAccessToken}&platform=instagram&limit=${limit}&fields=id,updated_time,participants,messages{id,created_time,from,to,is_unsupported,message,attachments,reactions,shares{link,template,name,description,id},story}${nextUrl}`,
                method: "GET",
            }),
            // providesTags: ["instagram"],
        }),

        getInstagramConversationPaginatedData: builder.query<{ data: IConversationsList[]; paging?: {next: string} }, { url: string  }>({
            query: ({ url}) => ({
                url: url,
                method: "GET",
            }),
            // providesTags: ["instagram"],
        }),

        getInstagramUserProfilePicture: builder.query<ICustomerProfile, { pageAccessToken: string; igSid: string }>({
            query: ({ pageAccessToken, igSid }) => ({
                url: `${igSid}?access_token=${pageAccessToken}&fields=name,profile_pic,follower_count,is_verified_user,is_user_follow_business,is_business_follow_user`,
                method: "GET",
            }),
            // providesTags: ["instagram"],
            //   retry: false
        }),

        getNewInstagramUserProfilePicture: builder.mutation<ICustomerProfile, { pageAccessToken: string; igSid: string }>({
            query: ({ pageAccessToken, igSid }) => ({
                url: `${igSid}?access_token=${pageAccessToken}&fields=name,profile_pic,follower_count,is_verified_user,is_user_follow_business,is_business_follow_user`,
                method: "GET",
            }),
            // providesTags: ["instagram"],
            //   retry: false
        }),


        getInstagramMessageInformation: builder.query<void, { pageAccessToken: string; messageId: string }>({
            query: ({ pageAccessToken, messageId }) => ({
                url: `${messageId}?fields=id,created_time,from,to,is_unsupported,message,attachments,reactions,shares{link,template,name,description,id},story&access_token=${pageAccessToken}`,
                method: "GET",
            }),
            // providesTags: ["instagram"],
        }),

        sendInstagramMessage: builder.mutation<void, { body: any; pageAccessToken: string; }>({
            query: ({ body, pageAccessToken }) => ({
                url: `me/messages?access_token=${pageAccessToken}`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body
            }),
        }),

        // End of Instagarm DM Integration

    })

})

export const {
    useGetInstagramConversationQuery,
    useGetInstagramUserProfilePictureQuery,
    // useGetConversationMessagesQuery,
    useGetInstagramMessageInformationQuery,
    useSendInstagramMessageMutation,
    useGetInstagramConversationPaginatedDataQuery,
    useGetNewInstagramUserProfilePictureMutation
} = messengerApi;




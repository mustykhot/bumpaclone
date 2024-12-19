export const test = "";

// the first type is what is coming from backend, the second is what you are sending to backen

// for mutation
// login: builder.mutation<{ meta: meta; data: UserType }, {}>({
//     query: (credentials) => ({
//       url: "/auth/sign-in",
//       method: "POST",
//       body: credentials,
//     }),
//   }),

// if it includes id and body:
// sendMsg: builder.mutation<
// {meta: meta; data: ConversationType},
// {body: {text?: string; file?: string[]}; id: string}
// >({
// query: ({body, id}) => ({
//   url: `/chats/conversations/${id}/send-message`,
//   method: 'PUT',
//   body,
// }),
// invalidatesTags: ['chatmessage'],
// }),

// if it includes only id:
// getReview: builder.query<
// {meta: meta; data: ReviewType[]},
// string | undefined
// >({
// query: id =>
//   `reviews/${id}/visa-service?population=${JSON.stringify(
//     TRANSACTIONS_QUERY,
//   )}`,
// providesTags: ['chatmessage'],
// }),

// usage:
// const [login, { isLoading }] = useLoginMutation();
// const onSubmit: SubmitHandler<LoginFields> = async (data) => {
//   try {
//     let res = await login(data).unwrap();
//     // res.data.account_verified
//     if (true) {
//       dispatch(setUserToken(res.meta?.token));
//       setFetchUser(true);
//     } else {
//       showToast('Please verify your account, before logging in', 'error');
//     }
//   } catch (error) {
//     handleError(error);
//   }
// };

// if it includes body and id:

// const [editService, {isLoading}] = useEditServiceMutation();
// const onSubmit: SubmitHandler<ServiceFeilds> = async data => {
//   let values = {
//     ...otherFormFeilds,
//     ...data,
//     category: data.category,
//     images: data?.images?.filter(el => el),
//     documents: data?.documents?.filter(el => el),
//   };
//   try {
//     await editService({
//       body: values,
//       id: id,
//     }).unwrap();
//     showToast('Service edited successfully');
//   } catch (error) {
//     handleError(error);
//   }
// };

// for query

// getUserChats: builder.query<{meta: meta; data: ConversationType[]}, void>({
//     query: () => `chats/conversations/me`,
//     providesTags: ['chatmessage'],
//   }),

// if it includes id:
// getReview: builder.query<
// {meta: meta; data: ReviewType[]},
// string | undefined
// >({
// query: id =>
//   `reviews/${id}/visa-service?population=${JSON.stringify(
//     TRANSACTIONS_QUERY,
//   )}`,
// providesTags: ['chatmessage'],
// }),

// usage

// const {data, isFetching, isError, error} = useGetTransactionsQuery();

// const {data, isFetching, isError, error} = useGetTransactionsQuery({
//     currency,
//     ...removeEmpty(params || {}),
//     page,
//   });

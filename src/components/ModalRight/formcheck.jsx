// import { useMutation } from "@apollo/client";
// import { useState, ChangeEvent, FormEvent } from "react";
// import Input from "../../../atoms/form/Input";
// import PhoneInput from "../../../atoms/form/PhoneInput";
// import Select from "../../../atoms/form/Select";
// import CloseIcon from "../../../atoms/vectors/Closeicon";
// import { toastMessage } from "../../../entities";
// import FormTable from "../../../organisms/FormTable";
// import { TableWrap } from "./style";
// import { useNavigate } from "react-router";
// import Button from "../../../atoms/Button";
// import ManualFormMobile from "./manualFormMobile";
// import { INVITE_MEMBERS } from "../../../services/apollo-client/mutations/onboarding.mutation";
// export type AddMemberFormType = {
//   title: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   callingCode: string;
//   phoneNumber: string;
// };
// export const AddMemberInitialValues: AddMemberFormType = {
//   title: "Mr",
//   firstName: "",
//   lastName: "",
//   email: "",
//   callingCode: "234",
//   phoneNumber: "",
// };
// function ManualForm() {
//   const navigate = useNavigate();
//   const [formValues, setFormValues] = useState<AddMemberFormType[]>([]);
//   const handleFeildsChange =
//     (name: keyof AddMemberFormType, index: number) =>
//     (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const { value } = e.target;
//       let newFormValues: Array<AddMemberFormType> = [...formValues];
//       newFormValues[index][name] = value;
//       setFormValues([...newFormValues]);
//     };
//   const handlePhoneChange = (
//     index: number,
//     field: "callingCode" | "phoneNumber",
//     phoneValue: string
//   ) => {
//     let newFormValues: Array<AddMemberFormType> = formValues;
//     newFormValues[index][field] = phoneValue.split(" ").join("");
//     setFormValues([...newFormValues]);
//   };
//   const removeFormFields = (i: number) => {
//     let newFormValues = [...formValues];
//     newFormValues.splice(i, 1);
//     setFormValues(newFormValues);
//   };
//   const [inviteMembers, { loading }] = useMutation(INVITE_MEMBERS, {
//     onCompleted: ({ inviteMembers: data }) => {
//       toastMessage("members created successfully");
//       navigate("/onboarding/savings");
//     },
//     onError: (error) => {
//       toastMessage(error.message, "error");
//     },
//   });
//   return (
//     <>
//       <TableWrap>
//         <form
//           onSubmit={(e: FormEvent<HTMLFormElement>) => {
//             e.preventDefault();
//             inviteMembers({
//               variables: {
//                 members: formValues.map((item) => {
//                   const otherData = {
//                     callingCode: `+${item.callingCode}`,
//                   };
//                   return {
//                     ...item,
//                     ...otherData,
//                   };
//                 }),
//               },
//             });
//           }}
//         >
//           <FormTable
//             emptyMessage="No member added."
//             headings={[
//               {
//                 name: "Title",
//                 key: "title",
//               },
//               {
//                 name: "First name",
//                 key: "firstName",
//               },
//               {
//                 name: "Last name",
//                 key: "lastName",
//               },
//               {
//                 name: "Email address",
//                 key: "email",
//               },
//               {
//                 name: "Phone number",
//                 key: "phone",
//               },
//             ]}
//             tableData={formValues.map((el, i) => ({
//               title: (
//                 <div className="w-[130px] select">
//                   <Select
//                     value={el.title}
//                     onChange={handleFeildsChange("title", i)}
//                     options={["Mr", "Mrs"]}
//                   />
//                 </div>
//               ),
//               firstName: (
//                 <Input
//                   value={el.firstName}
//                   onChange={handleFeildsChange("firstName", i)}
//                   placeholder="First Name"
//                 />
//               ),
//               lastName: (
//                 <Input
//                   value={el.lastName}
//                   onChange={handleFeildsChange("lastName", i)}
//                   placeholder="Last Name"
//                 />
//               ),
//               email: (
//                 <Input
//                   value={el.email}
//                   onChange={handleFeildsChange("email", i)}
//                   type={"email"}
//                   placeholder="Email"
//                 />
//               ),
//               phone: (
//                 <div className="flex space-x-2">
//                   <PhoneInput
//                     label=""
//                     placeholder="00 0000 0000"
//                     code={el.callingCode}
//                     value={el.phoneNumber}
//                     codeChange={(value: string) =>
//                       handlePhoneChange(i, "callingCode", String(value))
//                     }
//                     valueChange={(value: string) =>
//                       handlePhoneChange(i, "phoneNumber", String(value))
//                     }
//                   />
//                   {i !== 0 && (
//                     <button onClick={() => removeFormFields(i)} type="button">
//                       <CloseIcon
//                         color="white"
//                         bg="#EB5757"
//                         style={{ transform: "scale(0.65)" }}
//                       />
//                     </button>
//                   )}
//                 </div>
//               ),
//             }))}
//           />
//           <button
//             type="button"
//             onClick={() => {
//               setFormValues((prev) => [...prev, AddMemberInitialValues]);
//             }}
//             className="btn-text flex space-x-3 mt-3 font-semibold"
//           >
//             + Add Member
//           </button>
//           <div className="ml-auto w-fit mt-8 mb-8">
//             <Button loading={loading} type="submit">
//               Next
//             </Button>
//           </div>
//         </form>
//       </TableWrap>
//       <ManualFormMobile
//         inviteMembers={inviteMembers}
//         formValues={formValues}
//         loading={loading}
//         setForms={setFormValues}
//         removeMember={removeFormFields}
//       />
//     </>
//   );
// }
// export default ManualForm;

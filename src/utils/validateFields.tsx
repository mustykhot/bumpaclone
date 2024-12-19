import { useCallback } from "react";
import { debounce } from "lodash";
import { useEditCustomerGroupMutation } from "services";

export function useValidateField() {
  const [editCustomerGroup] = useEditCustomerGroupMutation();

  const validateField = useCallback(
    debounce(
      async (
        fieldName,
        value,
        id,
        dryRunCustomer,
        fieldsToUpdate = ["email", "phone"],
        setEmailError,
        setPhoneError
      ) => {
        try {
          const response = await dryRunCustomer({
            body: { [fieldName]: value },
            id: id,
            dryRun: true,
          }).unwrap();

          if (fieldsToUpdate.includes("email")) {
            setEmailError(undefined);
          }
          if (fieldsToUpdate.includes("phone")) {
            setPhoneError(undefined);
          }
        } catch (error: any) {
          if (fieldsToUpdate.includes("email")) {
            setEmailError(error.data.errors.email);
          }
          if (fieldsToUpdate.includes("phone")) {
            setPhoneError(error.data.errors.phone);
          }
        }
      },
      300
    ),
    []
  );

  return validateField;
}

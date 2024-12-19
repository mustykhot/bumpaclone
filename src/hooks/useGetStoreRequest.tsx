import { useGetStoreInformationQuery } from "services";

export const useGetStoreRequest = (skip: boolean = false) => {
  const { data, isLoading, isError, error } = useGetStoreInformationQuery(
    undefined,
    {
      skip,
    }
  );

  return { data, isLoading, isError, error };
};

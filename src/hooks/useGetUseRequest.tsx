import { useGetLoggedInUserQuery } from "services";

export const useGetUserRequest = (skip: boolean = false) => {
  const { data, isLoading, isError, error } = useGetLoggedInUserQuery(
    undefined,
    {
      skip,
    }
  );

  return { data, isLoading, isError, error };
};

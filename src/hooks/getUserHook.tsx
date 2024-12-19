import { useMemo } from "react";
import { selectCurrentUser, selectStoreId } from "store/slice/AuthSlice";
import { useAppSelector } from "store/store.hooks";

export const useGetUser = () => {
  const user = useAppSelector(selectCurrentUser);
  const store_id = useAppSelector(selectStoreId);
  const isLoggedIn = user ? true : false;
  return useMemo(
    () => ({ user, isLoggedIn, store_id }),
    // eslint-disable-next-line
    [user]
  );
};

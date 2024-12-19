import { useEffect, useState } from "react";
import { useGetStoreInformationQuery } from "services";

const useShowInvoiceRestriction = () => {
  const [isRestricted, setIsRestricted] = useState<boolean>(false);

  const { data: storeData, isLoading: loadStore } =
    useGetStoreInformationQuery();

  useEffect(() => {
    if (storeData?.store?.meta?.receipt) {
      const downloadCount = storeData.store.meta.receipt.download_count ?? 0;
      const maxDownloads = storeData.store.meta.receipt.max_download ?? 0;

      setIsRestricted(maxDownloads - downloadCount <= 0);
    }
  }, [storeData]);

  return isRestricted;
};

export default useShowInvoiceRestriction;

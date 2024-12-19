import { useGetProductQuery, useGetTaxQuery } from "services";
import LeftPosProductArea from "./LeftProductArea";
import RightCheckoutArea from "./RightCheckoutArea";
import "./style.scss";
import { useEffect, useState } from "react";
import { Stack, TextField } from "@mui/material";
import Loader from "components/Loader";
import { selectToken, selectUserLocation } from "store/slice/AuthSlice";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { addToPosCart, getPosTotals } from "store/slice/PosSlice";
import { API_URL, IMAGEURL } from "utils/constants/general";
import { PRODUCTROUTES } from "utils/constants/apiroutes";
import { onMessageListener } from "firebase";

const OrderPointOfSale = () => {
  const [search, setSearch] = useState("");
  const [barcodes, setBarcodes] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState("");
  const token = useAppSelector(selectToken);
  const [dataCount, setDataCount] = useState(30);
  const userLocation = useAppSelector(selectUserLocation);
  const dispatch = useAppDispatch();
  const [isLoadingBarCode, setIsLoadingBarCode] = useState(false);
  const [reload, setReload] = useState(false);
  const {
    data: taxDataList,
    isLoading: loadTax,
    isError: isTaxError,
  } = useGetTaxQuery();
  const { data, isLoading, isFetching, isError, refetch } = useGetProductQuery({
    limit: Number(dataCount),
    page: 1,
    search,
    collection: search ? "" : selectedTag,
    location_id: userLocation?.id,
  });

  const refetchFnc = () => {
    refetch();
  };

  const fetchBarcodeData = async (code: string) => {
    setIsLoadingBarCode(true);
    try {
      const response = await fetch(
        `${API_URL}v2/${PRODUCTROUTES.PRODUCT}?location_id=${userLocation?.id}&barcodes=${code}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        setIsLoadingBarCode(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setIsLoadingBarCode(false);
      if (data && data?.products?.data?.length) {
        let dataToAddToCart = data?.products?.data[0];

        if (dataToAddToCart?.variations?.length) {
          let variantToAddList = dataToAddToCart?.variations.filter(
            (el: any) => el.barcode === code
          );
          let variantToAdd = variantToAddList[0];
          let payload = {
            id: variantToAdd.id,
            name: dataToAddToCart.name,
            itemId: dataToAddToCart.id,
            url: dataToAddToCart.url,
            price: Number(variantToAdd.price),
            variant: variantToAdd.id,
            total: Number(variantToAdd.price),
            options: variantToAdd.variant,
            quantity: 1,
            stock: variantToAdd.quantity,
            unit: dataToAddToCart.unit,
            amountLeft: Number(dataToAddToCart.quantity) - 1,
            variantName: `${dataToAddToCart.name}(${variantToAdd.variant})`,
            description: dataToAddToCart.description,
            image: variantToAdd.image
              ? `${IMAGEURL}${variantToAdd.image}`
              : dataToAddToCart.alt_image_url,
          };
          if (variantToAdd.quantity !== 0) {
            dispatch(addToPosCart(payload));
          }
        } else {
          let payload = {
            id: dataToAddToCart.id,
            quantity: 1,
            name: dataToAddToCart.name,
            unit: dataToAddToCart.unit,
            url: dataToAddToCart.url,
            description: dataToAddToCart.description,
            price: Number(dataToAddToCart.price),
            variant: null,
            total: Number(dataToAddToCart.price),
            stock: dataToAddToCart.quantity,
            image: dataToAddToCart.alt_image_url,
            amountLeft: Number(dataToAddToCart.quantity) - 1,
          };
          if (dataToAddToCart.quantity !== 0) {
            dispatch(addToPosCart(payload));
          }
        }
        dispatch(getPosTotals());
        setBarcodes("");
      }
    } catch (error: any) {
      setIsLoadingBarCode(false);
      showToast("Something went wrong", "error");
      throw error;
    }
  };
  function onChangeBarcode(event: any) {
    setBarcodes(event.target.value);
  }

  onMessageListener()
    .then((payload: any) => {
      refetch();
    })
    .catch((err) => console.log("failed"));

  return (
    <div className="pd_point_of_sale">
      {/* {isLoadingBarCode && <Loader />} */}
      <LeftPosProductArea
        page={page}
        search={search}
        setSelectedTag={setSelectedTag}
        selectedTag={selectedTag}
        data={data}
        setPage={setPage}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        setSearch={setSearch}
        setDataCount={setDataCount}
        dataCount={dataCount}
        onChangeBarcode={onChangeBarcode}
        barcodes={barcodes}
        isLoadingBarCode={isLoadingBarCode}
        fetchBarcodeData={fetchBarcodeData}
      />
      <RightCheckoutArea
        taxDataList={taxDataList?.taxTypes}
        refetchFnc={refetchFnc}
      />
    </div>
  );
};

export default OrderPointOfSale;

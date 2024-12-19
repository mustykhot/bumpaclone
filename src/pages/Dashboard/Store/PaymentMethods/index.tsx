import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import "./style.scss";
import Loader from "components/Loader";
import { Bank } from "pages/Dashboard/ConnectedApps/widgets/Bank";
import { Paystack } from "pages/Dashboard/ConnectedApps/widgets/Paystack";
import { Terminal } from "pages/Dashboard/ConnectedApps/widgets/Terminal";
import {
  useGetPaymentMethodsQuery,
  useSavePaymentSettingsMutation,
} from "services";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";
import {
  selectShouldNavigateToPaymentMethods,
  setShouldNavigateToPaymentMethods,
} from "store/slice/TerminalSlice";

const tabList = [
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
];

export const PaymentMethods = () => {
  const dispatch = useAppDispatch();
  const shouldNavigate = useAppSelector(selectShouldNavigateToPaymentMethods);

  const [tab, setTab] = useState("online");

  const [savePayment, { isLoading: loadSave }] =
    useSavePaymentSettingsMutation();
  const {
    data,
    isLoading: isPaymentMethodsDataLoading,
    refetch: refetchPaymentMethods,
  } = useGetPaymentMethodsQuery();

  useEffect(() => {
    if (shouldNavigate) {
      setTab("offline");
      dispatch(setShouldNavigateToPaymentMethods(false));
    }
  }, [shouldNavigate, dispatch]);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const savePaymentFnc = async (body: {
    paystack: boolean;
    bank_transfer: boolean;
    terminal: boolean;
    callback?: () => void;
  }) => {
    const payload = {
      paystack: body.paystack,
      bank_transfer: body.bank_transfer,
      terminal: body.terminal,
    };
    try {
      let result = await savePayment(payload);
      if ("data" in result) {
        showToast("Payment Method Updated Successfully", "success");
        await refetchPaymentMethods();
        body.callback && body.callback();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  if (isPaymentMethodsDataLoading) {
    return <Loader />;
  }

  return (
    <>
      {loadSave && <Loader />}
      <div className="pd_payment_methods">
        <div className="pd_payment_methods--title">
          <h3>Payment Methods</h3>
          <p>Connect the payment methods that suits your business</p>
        </div>
        <div className="tabs_container">
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tab}
              onChange={handleChangeTab}
              variant="scrollable"
              scrollButtons={false}
            >
              {tabList.map((item, i) => (
                <Tab key={i} value={item.value} label={item.label} />
              ))}
            </Tabs>
          </Box>
        </div>
        <div className="tab_container">
          {tab === "online" && (
            <>
              <div className="tab_container--info">
                <h4>Available on web checkout</h4>
                <p>
                  These are the payment methods your customer sees when they are
                  about to checkout on your website. Charges can be passed to
                  customers. Payment received through these methods will be
                  confirmed automatically.
                </p>
              </div>
              <div className="tab_container--cards">
                {data?.data?.online?.paystack?.display && (
                  <Paystack
                    loadSave={false}
                    data={data}
                    savePaymentFnc={savePaymentFnc}
                  />
                )}
              </div>
            </>
          )}
          {tab === "offline" && (
            <>
              <div className="tab_container--info">
                <h4>Available on offline checkout</h4>
                <p>
                  These are the payment methods that will be shared with the
                  customers to receive payment for orders created or physical
                  POS checkout. These have to be confirmed manually and the
                  orders updated.
                </p>
              </div>
              <div className="tab_container--cards">
                {data?.data?.offline?.bank_transfer?.display && (
                  <Bank
                    loadSave={false}
                    data={data}
                    savePaymentFnc={savePaymentFnc}
                  />
                )}
                {data?.data.offline.terminal.display && (
                  <Terminal data={data} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

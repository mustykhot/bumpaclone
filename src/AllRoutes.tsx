import React, { ReactNode, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import * as Sentry from "@sentry/react";
import { ErrorBoundaryFallback } from "components/ErrorBoundaryFallback";
import ScrollToTop from "components/scrollToTop";
import { useGetUser } from "hooks/getUserHook";
import { PermissionsType } from "Models";
import NotFound from "pages/404/404";
import ActivateStaffAccount from "pages/Auth/ActivateStaffAccount";
import { CreateNewPassowrd } from "pages/Auth/CreateNewPassword";
import { Login } from "pages/Auth/Login";
import { RecoverAccount } from "pages/Auth/RecoverAccount";
import { ResetPassword } from "pages/Auth/ResetPassword";
import SignUp from "pages/Auth/Signup";
import { Success } from "pages/Auth/Signup/plan/success";
import { SetupStore } from "pages/Auth/Signup/store";
import BankPage from "pages/Bank/bank";
import { Analytics } from "pages/Dashboard/Analytics";
import { ConnectedApps } from "pages/Dashboard/ConnectedApps";
import { Customers } from "pages/Dashboard/Customers";
import { AddCustomerGroup } from "pages/Dashboard/Customers/AddCustomerGroup";
import { EditCustomerGroup } from "pages/Dashboard/Customers/AddCustomerGroup/edit";
import { AddNewCustomer } from "pages/Dashboard/Customers/AddNewCustomer";
import { EditCustomer } from "pages/Dashboard/Customers/AddNewCustomer/edit";
import { CustomerProfile } from "pages/Dashboard/Customers/CustomerProfiile";
import { ImportCustomer } from "pages/Dashboard/Customers/ImportCustomer";
import Discounts from "pages/Dashboard/Discounts";
import CreateCoupon from "pages/Dashboard/Discounts/CreateCoupon";
import CreateDiscount from "pages/Dashboard/Discounts/CreateDiscount";
import { ViewCoupon } from "pages/Dashboard/Discounts/ViewCoupon";
import { ViewDiscount } from "pages/Dashboard/Discounts/ViewDiscount";
import { Home } from "pages/Dashboard/Home";
import InstagramDm from "pages/Dashboard/InstagramDm";
import Location from "pages/Dashboard/Location";
import CreateLocation from "pages/Dashboard/Location/CreateLocation";
import LocationDetails from "pages/Dashboard/Location/LocationDetails";
import { Marketing } from "pages/Dashboard/Marketing";
import { SendCampaign } from "pages/Dashboard/Marketing/SendCampaign";
import { Orders } from "pages/Dashboard/Orders";
import CreateInvoiceNote from "pages/Dashboard/Orders/CreateInvoiceNote";
import EditInvoiceNote from "pages/Dashboard/Orders/CreateInvoiceNote/edit";
import { CreateOrder } from "pages/Dashboard/Orders/CreateOrder";
import { EditOrder } from "pages/Dashboard/Orders/CreateOrder/edit";
import OrderDetails from "pages/Dashboard/Orders/OrderDetails";
import OrderPointOfSale from "pages/Dashboard/PointOfSale";
import { Products } from "pages/Dashboard/Products";
import { DuplicateProductForm } from "pages/Dashboard/Products/AddProduct/duplicateProduct";
import { EditProductForm } from "pages/Dashboard/Products/AddProduct/editProduct";
import { CreateCollection } from "pages/Dashboard/Products/CreateCollection";
import { EditCollection } from "pages/Dashboard/Products/CreateCollection/edit";
import { CretaeProduct } from "pages/Dashboard/Products/CreateProduct";
import { EditBulkProductList } from "pages/Dashboard/Products/EditBulkProductList";
import { ImportProducts } from "pages/Dashboard/Products/ImportProducts";
import ProductDetails from "pages/Dashboard/Products/ProductDetails";
import SingleVariantPage from "pages/Dashboard/Products/ProductDetails/ProductWithVariations/SingleVariantPage";
import { ViewCollection } from "pages/Dashboard/Products/ViewCollection";
import { Profile } from "pages/Dashboard/Profile";
import { Referrals } from "pages/Dashboard/Store/Referrals";
import { ApiKey } from "pages/Dashboard/Store/ApiKey/apiKey";
import { BankDetails } from "pages/Dashboard/Store/BankDetails/bankDetails";
import { Domains } from "pages/Dashboard/Store/Domains";
import { BuyDomain } from "pages/Dashboard/Store/Domains/BuyDomain";
import { ConnectDomain } from "pages/Dashboard/Store/Domains/ConnectDomain";
import { DomainDetails } from "pages/Dashboard/Store/Domains/DomainDetails";
import { Expenses } from "pages/Dashboard/Store/Expenses";
import { CreateExpense } from "pages/Dashboard/Store/Expenses/CreateExpense";
import { CreateExpenseCategory } from "pages/Dashboard/Store/Expenses/CreateExpenseCategory";
import { PaymentMethods } from "pages/Dashboard/Store/PaymentMethods";
import ShippingFee from "pages/Dashboard/Store/ShippingFee";
import CreateFreeShipping from "pages/Dashboard/Store/ShippingFee/CreateFreeShipping";
import CreateShipping from "pages/Dashboard/Store/ShippingFee/CreateShipping";
import StaffAccount from "pages/Dashboard/Store/StaffAccount";
import AddStaff from "pages/Dashboard/Store/StaffAccount/AddStaff";
import EditStaffProfile from "pages/Dashboard/Store/StaffAccount/ListOfStaffAccount/EditStaffProfile";
import ViewStaffDetails from "pages/Dashboard/Store/StaffAccount/ListOfStaffAccount/ViewStaffDetails";
import { SeeAllOrders } from "pages/Dashboard/Store/StaffAccount/ListOfStaffAccount/ViewStaffDetails/SeeAllOrders";
import StoreCustomisation from "pages/Dashboard/Store/StoreCustomisation";
import CustomiseTheme from "pages/Dashboard/Store/StoreCustomisation/CustomiseTheme";
import StoreForePreview from "pages/Dashboard/Store/StoreCustomisation/CustomiseTheme/StoreFrontPreview";
import EditInformation from "pages/Dashboard/Store/StoreInformation/editInformation";
import { StoreInformation } from "pages/Dashboard/Store/StoreInformation/storeInformation";
import StoreTaxes from "pages/Dashboard/Store/StoreTaxes";
import CreateTax from "pages/Dashboard/Store/StoreTaxes/CreateTax";
import { Subscription } from "pages/Dashboard/Subscription";
import { TransactionsSection } from "pages/Dashboard/Transactions";
import VerifyEmailScreen from "pages/Dashboard/VerifyEmailScreen";
import { WrappedEntry } from "pages/Wrapped/WrappedEntry";
import { SelectPlan } from "pages/Dashboard/Subscription/selectPlan";
import GeneralSettings from "pages/Dashboard/Store/GeneralSettings/index";

import { useGetInstagramMessageInformationQuery } from "services/messenger.api";
import { selectCurrentUser, selectPermissions } from "store/slice/AuthSlice";
import {
  selectMetaData,
  selectWebhookMessage,
} from "store/slice/InstagramSlice";
import { showNotificationToast, useAppSelector } from "store/store.hooks";
import { DashboardLayout } from "Templates/DashboardLayout";
import CustomizeThemePage from "pages/Dashboard/Store/StoreCustomisation/customize";
import PreviewTheme from "pages/Dashboard/Store/StoreCustomisation/Preview";

Sentry.init({
  dsn: "https://57d4c0d3202520e7d6c751d094b1e44c@o364176.ingest.sentry.io/4506139457224704",
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
  ],
  tracesSampleRate: 1.0,
});

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useGetUser();
  let location = useLocation();
  const selectedMetaData = useAppSelector(selectMetaData);
  const selectedWebhookMessage = useAppSelector(selectWebhookMessage);
  const pageAccessToken = selectedMetaData?.integration
    ?.page_access_token as string;
  const [messageId, setMessageId] = useState("");
  const [messageInformationSkip, setMessageInformationSkip] = useState(true);

  const { data: singleMessageData } = useGetInstagramMessageInformationQuery(
    { pageAccessToken, messageId },
    { skip: messageInformationSkip }
  );

  useEffect(() => {
    if (messageId && pageAccessToken) {
      setMessageInformationSkip(false);
    }
  }, [messageId, pageAccessToken]);

  useEffect(() => {
    if (selectedWebhookMessage) {
      setMessageId(selectedWebhookMessage?.message?.mid);
    }
  }, [selectedWebhookMessage]);

  useEffect(() => {
    if (singleMessageData) {
      if ("from" in singleMessageData && "message" in singleMessageData) {
        if (singleMessageData !== undefined) {
          const dataFrom = JSON.parse(
            JSON.stringify((singleMessageData as { from: any })?.from)
          );
          const dataMessage = JSON.parse(
            JSON.stringify((singleMessageData as { message: any })?.message)
          );
          if (location?.pathname !== "/dashboard/messages") {
            showNotificationToast(
              `You have a new message from ${dataFrom.username}: ${dataMessage} `
            );
          }
        }
      }
    }
  }, [singleMessageData]);

  return (
    <>
      {isLoggedIn ? (
        children
      ) : (
        <Navigate
          to={`/login?redirectTo=${location.pathname}`}
          state={{ from: location }}
        />
      )}
    </>
  );
};

export const AllRoutes = () => {
  const userPermission: PermissionsType = useAppSelector(selectPermissions);
  const [isStaff, setIsStaff] = useState(false);
  const user = useAppSelector(selectCurrentUser);
  const canViewOrder = isStaff ? userPermission?.orders?.view : true;
  const canManageOrder = isStaff ? userPermission?.orders?.manage : true;
  const canViewProducts = isStaff ? userPermission?.products?.view : true;
  const canManageProducts = isStaff ? userPermission?.products?.manage : true;
  const canViewMessaging = isStaff ? userPermission?.messaging?.view : true;
  const canManageMessaging = isStaff ? userPermission?.messaging?.manage : true;
  const canViewAnalytics = isStaff ? userPermission?.analytics?.view : true;

  useEffect(() => {
    if (userPermission !== undefined) {
      setIsStaff(true);
    } else {
      setIsStaff(false);
    }
  }, [userPermission]);

  return (
    <>
      <Sentry.ErrorBoundary fallback={ErrorBoundaryFallback}>
        <BrowserRouter>
          <ScrollToTop />
          <SentryRoutes>
            {/* Basic Routes */}
            {/* wrapped */}
            <Route path="/wrapped" element={<WrappedEntry />} />

            <Route path="/" element={<Login />} />
            <Route path="/bank" element={<BankPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/setup-store"
              element={
                <PrivateRoute>
                  <SetupStore />
                </PrivateRoute>
              }
            />
            <Route path="/recover-account" element={<RecoverAccount />} />
            <Route path="/success" element={<Success />} />
            <Route path="/forgot-password" element={<ResetPassword />} />
            <Route
              path="/password/reset/:token"
              element={<CreateNewPassowrd />}
            />
            <Route
              path="/activate-staff-account"
              element={<ActivateStaffAccount />}
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              {/* Dashboard */}
              <Route path="" element={<Home />} />
              <Route
                path="email/verify/:id/:token"
                element={<VerifyEmailScreen />}
              />
              {/* pos */}
              <Route path="pos" element={<OrderPointOfSale />} />
              {/* Marketing */}
              {canViewMessaging && (
                <Route path="campaigns">
                  <Route path="" element={<Marketing />} />
                  {/* <Route path="create" element={<SendCampaign />} /> */}
                </Route>
              )}
              {/* Customers */}
              <Route path="customers">
                <Route path="" element={<Customers />} />
                <Route path=":id" element={<CustomerProfile />} />
                <Route path="edit/:id" element={<EditCustomer />} />
                <Route path="import" element={<ImportCustomer />} />
                <Route path="create" element={<AddNewCustomer />} />
                <Route path="creategroup" element={<AddCustomerGroup />} />
                <Route path="group/:id" element={<EditCustomerGroup />} />
              </Route>
              {/* Orders */}
              {canViewOrder && (
                <Route path="orders">
                  <Route path="" element={<Orders />} />
                  {canManageOrder && (
                    <Route path="create" element={<CreateOrder />} />
                  )}
                  <Route path=":id" element={<OrderDetails />} />
                  {canManageOrder && (
                    <Route path="edit/:id" element={<EditOrder />} />
                  )}
                  {canManageOrder && (
                    <Route path="create-note" element={<CreateInvoiceNote />} />
                  )}
                  {canManageOrder && (
                    <Route path="edit-note/:id" element={<EditInvoiceNote />} />
                  )}
                </Route>
              )}
              {/* Products */}
              {canViewProducts && (
                <Route path="products">
                  {canViewProducts && <Route path="" element={<Products />} />}

                  {canManageProducts && (
                    <Route path="bulk-edit" element={<EditBulkProductList />} />
                  )}
                  {canManageProducts && (
                    <Route path="bulk" element={<EditBulkProductList />} />
                  )}
                  {canManageProducts && (
                    <Route path="import" element={<ImportProducts />} />
                  )}
                  {canManageProducts && (
                    <Route path="create" element={<CretaeProduct />} />
                  )}
                  {canManageProducts && (
                    <Route path="edit/:id" element={<EditProductForm />} />
                  )}
                  {canManageProducts && (
                    <Route
                      path="duplicate/:id"
                      element={<DuplicateProductForm />}
                    />
                  )}
                  {canManageProducts && (
                    <Route
                      path="create-collection"
                      element={<CreateCollection />}
                    />
                  )}
                  {canManageProducts && (
                    <Route
                      path="edit-collection/:id"
                      element={<EditCollection />}
                    />
                  )}
                  <Route path=":id" element={<ProductDetails />} />
                  <Route path="variant/:id" element={<SingleVariantPage />} />
                  <Route path="collection/:id" element={<ViewCollection />} />
                </Route>
              )}
              {/* Instagram DM */}
              {canViewMessaging && (
                <Route path="messages">
                  <Route path="" element={<InstagramDm />} />
                </Route>
              )}
              {/* Analytics */}
              {canViewAnalytics && (
                <Route path="analytics">
                  <Route path="" element={<Analytics />} />
                </Route>
              )}
              {/* Connected Apps */}
              {Number(user?.is_staff) === 0 && (
                <Route path="apps">
                  <Route path="" element={<ConnectedApps />} />
                  {/* <Route path="google" element={<GoogleBusinessProfile />} /> */}
                </Route>
              )}
              {/* transaction */}
              <Route path="transactions" element={<TransactionsSection />} />

              {/* discounts/coupons */}
              {Number(user?.is_staff) === 0 && (
                <Route path="discounts">
                  <Route path="" element={<Discounts />} />
                  <Route path="create-discount" element={<CreateDiscount />} />
                  <Route path="create-coupon" element={<CreateCoupon />} />
                  <Route path=":id" element={<ViewDiscount />} />
                  <Route path="coupons/:id" element={<ViewCoupon />} />
                </Route>
              )}
              {/* payment methods */}
              {Number(user?.is_staff) === 0 && (
                <Route path="payment-methods" element={<PaymentMethods />} />
              )}
              {/* stores */}
              {Number(user?.is_staff) === 0 && (
                <Route path="store">
                  <Route path="" element={<StoreInformation />} />
                  <Route path="edit" element={<EditInformation />} />
                  <Route
                    path="general-settings"
                    element={<GeneralSettings />}
                  />
                  <Route
                    path="store-information"
                    element={<StoreInformation />}
                  />
                  <Route
                    path="store-information/edit"
                    element={<EditInformation />}
                  />
                  <Route path="bankdetails" element={<BankDetails />} />
                  <Route path="apikey" element={<ApiKey />} />
                  <Route path="expenses">
                    <Route path="" element={<Expenses />} />
                    <Route path="create-expense" element={<CreateExpense />} />
                    <Route
                      path="create-category"
                      element={<CreateExpenseCategory />}
                    />
                  </Route>

                  {/* store locations */}
                  <Route path="location">
                    <Route path="" element={<Location />} />
                    <Route path="create" element={<CreateLocation />} />
                    <Route path=":id" element={<LocationDetails />} />
                  </Route>

                  {/* Stores Taxes */}
                  <Route path="taxes">
                    <Route path="" element={<StoreTaxes />} />
                    <Route path="create" element={<CreateTax />} />
                  </Route>

                  {/* Stores Shipping Fee */}
                  <Route path="shipping-fees">
                    <Route path="" element={<ShippingFee />} />
                    <Route path="create" element={<CreateShipping />} />
                    <Route
                      path="create-free-shipping"
                      element={<CreateFreeShipping />}
                    />
                  </Route>
                </Route>
              )}
              {/* Stores Customisation */}
              {Number(user?.is_staff) === 0 && (
                <Route path="customisation">
                  <Route path="" element={<StoreCustomisation />} />
                  <Route path=":id" element={<CustomizeThemePage />} />
                  <Route path="preview/:id" element={<PreviewTheme />} />
                </Route>
              )}
              {/* Domains */}
              {Number(user?.is_staff) === 0 && (
                <Route path="domains">
                  <Route path="" element={<Domains />} />
                  <Route path=":id" element={<DomainDetails />} />
                  <Route path="buy" element={<BuyDomain />} />
                  <Route path="connect" element={<ConnectDomain />} />
                </Route>
              )}
              {/* Referrals */}
              {Number(user?.is_staff) === 0 && (
                <Route path="referrals">
                  <Route path="" element={<Referrals />} />
                </Route>
              )}
              {/* Stores Staff Account */}
              {Number(user?.is_staff) === 0 && (
                <Route path="staff">
                  <Route path="" element={<StaffAccount />} />
                  <Route path="add" element={<AddStaff />} />
                  <Route path="details/:id" element={<ViewStaffDetails />} />
                  <Route path="details/:id/orders" element={<SeeAllOrders />} />
                  <Route path="edit/:id" element={<EditStaffProfile />} />
                </Route>
              )}
              {/* Subscription */}
              {Number(user?.is_staff) === 0 && (
                <Route path="subscription">
                  <Route path="" element={<Subscription />} />
                  <Route path="select-plan" element={<SelectPlan />} />
                </Route>
              )}
              {/* Profile */}
              <Route path="profile">
                <Route path="" element={<Profile />} />
              </Route>
              {/* Bumpa Wallet */}
              {/* <Route path="wallet">
              <Route path="" element={<Wallet />} />
            </Route> */}
            </Route>
            <Route path="*" element={<NotFound />} />
          </SentryRoutes>
        </BrowserRouter>
      </Sentry.ErrorBoundary>
    </>
  );
};

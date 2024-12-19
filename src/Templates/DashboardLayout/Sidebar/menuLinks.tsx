import { To } from "react-router-dom";
import { BarIcon } from "assets/Icons/BarIcon";
import { BoxIcon } from "assets/Icons/BoxIcon";
import { AnnouncementIcon } from "assets/Icons/Sidebar/AnnouncementIcon";
import { ApiIcon } from "assets/Icons/Sidebar/ApiIcon";
import { BankSetupIcon } from "assets/Icons/Sidebar/BankIcon";
import { BankShippingIcon } from "assets/Icons/Sidebar/BankShipping";
import { CustomerIcon } from "assets/Icons/Sidebar/CustomerIcon";
import { ExpensesIcon } from "assets/Icons/Sidebar/ExpensesIcon";
import { GlobeIcon } from "assets/Icons/Sidebar/GlobeIcon";
import { GridIcon } from "assets/Icons/Sidebar/GridIcon";
import { InstagramDmIcon } from "assets/Icons/Sidebar/InstagramDmIcon";
import { LayersThreeIcon } from "assets/Icons/Sidebar/LayersThreeIcon";
import { LocationIcon } from "assets/Icons/Sidebar/LocationIcon";
import { MessageIcon } from "assets/Icons/Sidebar/MessageIcon";
import { PalatteIcon } from "assets/Icons/Sidebar/PaletteIcon";
import { PaymentMethodIcon } from "assets/Icons/Sidebar/PaymentMethodIcon";
import { SaleIcon } from "assets/Icons/Sidebar/SaleIcon";
import { ServerIcon } from "assets/Icons/Sidebar/SeverIcon";
import { ShopingIcon } from "assets/Icons/Sidebar/ShopingIcon";
import { TagIcon } from "assets/Icons/Sidebar/TagIcon";
import { TaxIcon } from "assets/Icons/Sidebar/TaxIcon";
import { TransactionIcon } from "assets/Icons/Sidebar/TransactionIcon";
import { UserIcon } from "assets/Icons/Sidebar/UserIcon";
import { SettingsIcon } from "assets/Icons/Sidebar/SettingsIcon";

const DashboardMenuLinks: {
  icon: any;
  name: string;
  link?: To;
  active?: string;
  isSubmenu?: boolean;
  submenu?: {
    name: string;
    link: To;
  }[];
}[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    link: "/dashboard",
  },

  // {
  //   icon: <ShopingIcon />,
  //   name: "Orders",
  //   active: "orders",
  //   isSubmenu: true,
  //   submenu: [
  //     {
  //       name: "Create Orders",
  //       link: "orders/create",
  //     },
  //     {
  //       name: "Invoice & Receipt",
  //       link: "orders/invoice",
  //     },
  //   ],
  // },
  // {
  //   icon: <TagIcon />,
  //   name: "Products",
  //   active: "products",
  //   isSubmenu: true,
  //   submenu: [
  //     {
  //       name: "Settlement",
  //       link: "products/settlement",
  //     },
  //   ],
  // },
  {
    icon: <TagIcon title="Products" />,
    name: "Products",
    link: "products",
  },
  {
    icon: <ShopingIcon title="Orders" />,
    name: "Orders",
    link: "orders",
  },
  {
    icon: <CustomerIcon title="Customers" />,
    name: "Customers",
    link: "customers",
  },
  {
    icon: <InstagramDmIcon title="Messages" className="inactive" />,
    name: "Messages",
    link: "messages",
  },
  // {
  //   icon: <InstagramDmIcon className="inactive" />,
  //   name: "Instagram DM",
  //   active: "instagram",
  //   isSubmenu: false,
  // },

  {
    icon: <BarIcon title="Analytics" />,
    name: "Analytics",
    link: "analytics",
  },
  {
    icon: <MessageIcon title="Campaigns" />,
    name: "Campaigns",
    link: "campaigns",
  },
  {
    icon: <SaleIcon title="Discounts & Coupons" />,
    name: "Discounts & Coupons",
    link: "discounts",
  },
  {
    icon: <TransactionIcon title="Transactions" />,
    name: "Transactions",
    link: "transactions",
  },
  {
    icon: <ServerIcon title="Connected Apps" />,
    name: "Connected Apps",
    link: "apps",
  },
  {
    icon: <PaymentMethodIcon title="Payment Methods" />,
    name: "Payment Methods",
    link: "payment-methods",
  },
];

export const StoreMenuLinks: {
  icon: any;
  name: string;
  link?: To;
  active?: string;
  isSubmenu?: boolean;
  submenu?: {
    name: string;
    link: To;
  }[];
}[] = [
  {
    icon: <ShopingIcon />,
    name: " Store Information",
    link: "store/store-information",
  },

  {
    icon: <AnnouncementIcon />,
    name: "Referrals",
    link: "referrals",
  },
  {
    icon: <UserIcon />,
    name: "Staff Account",
    link: "staff",
  },

  {
    icon: <LocationIcon />,
    name: "Location",
    link: "store/location",
  },

  {
    icon: <SettingsIcon />,
    name: "General Settings",
    link: "store/general-settings",
  },

  {
    icon: <PalatteIcon />,
    name: "Site Customisation",
    link: "customisation",
  },

  {
    icon: <BankShippingIcon />,
    name: "Shipping",
    link: "store/shipping-fees",
  },

  {
    icon: <TaxIcon />,
    name: "Taxes",
    link: "store/taxes",
  },

  {
    icon: <LayersThreeIcon />,
    name: "Subscription",
    link: "subscription",
  },

  {
    icon: <BankSetupIcon />,
    name: "Bank Details",
    link: "store/bankdetails",
  },

  {
    icon: <ExpensesIcon />,
    name: "Expenses",
    link: "store/expenses",
  },

  {
    icon: <GlobeIcon />,
    name: "Domains",
    link: "domains",
  },

  {
    icon: <ApiIcon />,
    name: "Api Key",
    link: "store/apikey",
  },
];
export default DashboardMenuLinks;

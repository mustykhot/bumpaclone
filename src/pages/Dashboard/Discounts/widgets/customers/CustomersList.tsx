import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export type customerType = {
  name: string;
  email?: string;
  phoneNumber: string;
  handle?: string;
  address?: string;
  id: string;
  groups?: {
    names?: Array<string>;
  };
};

export type groupType = {
  name: string;
  numOfCustomers: number;
  id: string;
};

export const demoCustomerGroup: groupType[] = [
  {
    name: "Top 15% customers by order count",
    numOfCustomers: 10,
    id: "1",
  },
  {
    name: "Newsletter subscribed customers",
    numOfCustomers: 15,
    id: "2",
  },
  {
    name: "Newest customers",
    numOfCustomers: 20,
    id: "3",
  },
  {
    name: "International customers",
    numOfCustomers: 25,
    id: "4",
  },
  {
    name: "Customers with no orders",
    numOfCustomers: 18,
    id: "5",
  },
];

export const demoCustomer: customerType[] = [
  {
    name: "Felz Essien",
    email: "felz@gmail.com",
    phoneNumber: "08033647823",
    handle: "@dev_felz",
    address: "28, Peace Highway",
    id: "1",
    groups: {
      names: ["top 1 %, top 10% of customers by amount Spent"],
    },
  },
  {
    name: "Raji Raj",
    email: "felz@gmail.com",
    phoneNumber: "08033647823",
    handle: "@dev_felz",
    address: "28, Peace Highway",
    id: "2",
    groups: {
      names: ["top 1 %, top 10% of customers by amount Spent"],
    },
  },
  {
    name: "John Doe",
    email: "felz@gmail.com",
    phoneNumber: "08033647823",
    handle: "@dev_felz",
    address: "28, Peace Highway",
    id: "3",
    groups: {
      names: ["top 1 %, top 10% of customers by amount Spent"],
    },
  },
  {
    name: "Jane Doe",
    email: "jane@gmail.com",
    phoneNumber: "08033647823",
    handle: "@dev_felz",
    address: "28, Peace Highway",
    id: "4",
    groups: {
      names: ["top 1 %, top 10% of customers by amount Spent"],
    },
  },
  {
    name: "Becky G",
    email: "felz@gmail.com",
    phoneNumber: "08033647823",
    handle: "@dev_felz",
    address: "28, Peace Highway",
    id: "5",
    groups: {
      names: ["top 1 %, top 10% of customers by amount Spent"],
    },
  },
];

export const CustomersList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [customer, setCustomer] = useState<string[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<customerType[]>(
    []
  );
  const { setValue } = useFormContext();
  const [group, setGroup] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<groupType[]>([]);

  useEffect(() => {
    if (customer?.length) {
      let filtered = demoCustomer.filter((item) => {
        return customer?.includes(item.id);
      });
      setSelectedCustomers(filtered);
    }
  }, [customer]);

  useEffect(() => {
    setValue("customers", customer);
  }, [customer, setValue]);
};

export const CustomersGroupList = () => {
  const { setValue } = useFormContext();
  const [group, setGroup] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<groupType[]>([]);

  useEffect(() => {
    if (group?.length) {
      let filtered = demoCustomerGroup.filter((item) => {
        return group?.includes(item.id);
      });
      setSelectedGroup(filtered);
    }
  }, [setSelectedGroup]);

  useEffect(() => {
    setValue("customers", group);
  }, [group, setValue]);
};

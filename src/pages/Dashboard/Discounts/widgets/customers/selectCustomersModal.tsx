import { useState } from "react";
import Button from "@mui/material/Button";
import { Checkbox } from "@mui/material";
import ModalRight from "components/ModalRight";
import InputField from "components/forms/InputField";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { SearchIcon } from "assets/Icons/SearchIcon";

import {
  demoCustomer,
  customerType,
  groupType,
  demoCustomerGroup,
} from "./CustomersList";
import "./style.scss";

type CustomerModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

const mainTab = [
  { name: "Customers", value: "customers" },
  { name: "Customer Group", value: "customer_group" },
];

const SingleCustomer = ({
  customer,
  selectedCustomersId,
  setSelectedCustomersId,
}: {
  customer: customerType;
  selectedCustomersId: string[];
  setSelectedCustomersId: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const updateSelectedCustomer = (id: string) => {
    if (selectedCustomersId.includes(id)) {
      const filteredList = selectedCustomersId.filter((item) => item !== id);
      setSelectedCustomersId(filteredList);
    } else {
      setSelectedCustomersId((prev) => [...prev, id]);
    }
  };

  return (
    <div className="single_related_product">
      <div className="related_product_flex">
        <div className="left_container">
          {
            <Checkbox
              checked={selectedCustomersId.includes(customer.id)}
              onChange={(e) => {
                updateSelectedCustomer(customer.id);
              }}
            />
          }
          <p className="price">{customer.name}</p>
        </div>
        <div className="right_container">
          <div className="bottom">
            <p className="count">{}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
const SingleCustomerGroup = ({
  group,
  selectedGroupsId,
  setSelectedGroupsId,
}: {
  group: groupType;
  selectedGroupsId: string[];
  setSelectedGroupsId: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const updateSelectedGroup = (id: string) => {
    if (selectedGroupsId.includes(id)) {
      const filteredList = selectedGroupsId.filter((item) => item !== id);
      setSelectedGroupsId(filteredList);
    } else {
      setSelectedGroupsId((prev) => [...prev, id]);
    }
  };

  return (
    <div className="single_related_product">
      <div className="related_product_flex">
        <div className="left_container">
          {
            <Checkbox
              checked={selectedGroupsId.includes(group.id)}
              onChange={(e) => {
                updateSelectedGroup(group.id);
              }}
            />
          }
          <p className="price">{group.name}</p>
        </div>
        <div className="right_container">
          <div className="bottom">
            <p className="count">{}</p>
            <p>{group.numOfCustomers} customers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SelectCustomersModal = ({
  openModal,
  closeModal,
}: CustomerModalProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [customerList, setCustomerList] = useState<any>([]);
  const [customersGroupList, setCustomersGroupList] = useState<any>([]);

  const [tab, setTab] = useState("customers");

  const selectAllGroups = (items: any) => {
    const allIds = items.map((item: any) => item.id);
    setCustomersGroupList(allIds);
  };
  const selectAllCustomers = (items: any) => {
    const allIds = items.map((item: any) => item.id);
    setCustomerList(allIds);
  };
  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children customer_modal">
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              title={
                tab === "customers"
                  ? "Select Customers"
                  : "Select Customer Group"
              }
              children={
                <div className="customer_tab">
                  {mainTab.map((item, i) => {
                    return (
                      <Button
                        key={i}
                        onClick={() => {
                          setTab(item.value);
                        }}
                        className={`${
                          tab === item.value ? "active" : "cx_tab"
                        }`}
                      >
                        {item.name}
                      </Button>
                    );
                  })}
                </div>
              }
            />
            {tab === "customers" && (
              <div className="add_related_product_container">
                <InputField
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                  placeholder="Color"
                  containerClass="search_field"
                  suffix={<SearchIcon />}
                />
                {/* have 2 tabs here, customer/group.  */}
                <div className="selected_count">
                  <p>{customerList?.length} Selected</p>
                  {customerList?.length >= 1 ? (
                    <Button
                      onClick={() => {
                        setCustomerList([]);
                      }}
                      className="unselect"
                    >
                      Unselect
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        selectAllCustomers(demoCustomer);
                      }}
                      className="unselect"
                    >
                      select All
                    </Button>
                  )}
                </div>

                <div className="list_product_to_add_container">
                  {demoCustomer.map((item: customerType) => {
                    return (
                      <SingleCustomer
                        selectedCustomersId={customerList}
                        setSelectedCustomersId={setCustomerList}
                        customer={item}
                        key={item.id}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            {tab === "customer_group" && (
              <div className="add_related_product_container">
                <InputField
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                  placeholder="Color"
                  containerClass="search_field"
                  suffix={<SearchIcon />}
                />
                {/* have 2 tabs here, customer/group.  */}
                <div className="selected_count">
                  <p>{customersGroupList?.length} Selected</p>
                  {customersGroupList?.length >= 1 ? (
                    <Button
                      onClick={() => {
                        setCustomersGroupList([]);
                      }}
                      className="unselect"
                    >
                      Unselect All
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        selectAllGroups(demoCustomerGroup);
                      }}
                      className="unselect"
                    >
                      select All
                    </Button>
                  )}
                </div>

                <div className="list_product_to_add_container">
                  {demoCustomerGroup.map((item: groupType) => {
                    return (
                      <SingleCustomerGroup
                        selectedGroupsId={customersGroupList}
                        setSelectedGroupsId={setCustomersGroupList}
                        group={item}
                        key={item.id}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="productOptionSubmit bottom_section">
            <Button type="button" className="cancel" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="button" className="save" onClick={closeModal}>
              Save
            </Button>
          </div>
        </div>
      </ModalRight>
    </>
  );
};

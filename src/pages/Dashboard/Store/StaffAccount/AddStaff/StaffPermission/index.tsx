import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { SwitchComponent } from "components/SwitchComponent";

type IProp = {
  permissions: any;
  setPermissions: (value: any) => void;
};

const StaffPermission = ({ permissions, setPermissions }: IProp) => {
  const permisionsArr = [
    {
      title: "Products",
      message: "Staff can view, add and edit Products.",
      checkedView: permissions.products.view,
      checkedManage: permissions.products.manage,
    },
    {
      title: "Orders",
      message: "Staff can view, add and edit Orders.",
      checkedView: permissions.orders.view,
      checkedManage: permissions.orders.manage,
    },
    {
      title: "Messaging",
      message: "Staff can view, send and receive messages.",
      checkedView: permissions.messaging.view,
      checkedManage: permissions.messaging.manage,
    },
    {
      title: "Analytics",
      message: "Staff can view store analytics.",
      checkedView: permissions.analytics.view,
    },
  ];

  const [permissionsList, setPermissionsList] = useState(permisionsArr);

  const handleViewSwitch = (i: number) => {
    const newList = [...permissionsList];
    newList.forEach((item, index: number) => {
      if (index === i) {
        item.checkedView = !item.checkedView;
        if (!item.checkedView) {
          item.checkedManage = item.checkedView;
        }
      }
    });

    const permissionsVal = { ...permissions };
    permissionsVal.products.view = newList[0].checkedView;
    permissionsVal.orders.view = newList[1].checkedView;
    permissionsVal.messaging.view = newList[2]?.checkedView;
    permissionsVal.analytics.view = newList[3].checkedView;
    permissionsVal.products.manage = newList[0].checkedManage;
    permissionsVal.orders.manage = newList[1].checkedManage;
    permissionsVal.messaging.manage = newList[2]?.checkedManage;

    setPermissions(permissionsVal);
    setPermissionsList(newList);
  };

  const handleManageSwitch = (i: number) => {
    const newList = [...permissionsList];
    newList.forEach((item, index: number) => {
      if (index === i) {
        item.checkedManage = !item.checkedManage;

        if (item.checkedManage) {
          item.checkedView = item.checkedManage;
        }
      }
    });

    const permissionsVal = { ...permissions };
    permissionsVal.products.manage = newList[0].checkedManage;
    permissionsVal.orders.manage = newList[1].checkedManage;
    permissionsVal.messaging.manage = newList[2]?.checkedManage;
    permissionsVal.products.view = newList[0].checkedView;
    permissionsVal.orders.view = newList[1].checkedView;
    permissionsVal.messaging.view = newList[2]?.checkedView;
    permissionsVal.analytics.view = newList[3].checkedView;

    setPermissions(permissionsVal);
    setPermissionsList(newList);
  };

  useEffect(() => {
    const permissionsListValue = [...permissionsList];

    permissionsListValue[0].checkedView = permissions.products.view;
    permissionsListValue[0].checkedManage = permissions.products.manage;

    permissionsListValue[1].checkedView = permissions.orders.view;
    permissionsListValue[1].checkedManage = permissions.orders.manage;

    permissionsListValue[2].checkedView = permissions.messaging.view;
    permissionsListValue[2].checkedManage = permissions.messaging.manage;

    permissionsListValue[3].checkedView = permissions.analytics.view;

    setPermissionsList(permissionsListValue);
  }, [permissions]);

  return (
    <div className="pd_payment_section accordion_sections">
      <Accordion className="accordion" expanded={true}>
        <AccordionSummary
          className="accordion_summary"
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <p>Staff Permissions</p>
        </AccordionSummary>
        <AccordionDetails>
          <div className="permission-details">
            <div className="permissions permissions-header">
              <div>Permissions</div>
              <div>View</div>
              <div>Manage</div>
            </div>
            {permissionsList?.map((item, index) => (
              <div className="permissions">
                <div>
                  <h5>{item.title}</h5>
                  <p>{item.message}</p>
                </div>
                <div>
                  <SwitchComponent
                    checked={item.checkedView}
                    onChange={() => handleViewSwitch(index)}
                    index={index}
                    value={item.checkedView}
                  />
                </div>
                <div>
                  {index !== 3 && (
                    <SwitchComponent
                      checked={item.checkedManage}
                      onChange={() => handleManageSwitch(index)}
                      index={index}
                      value={item.checkedManage}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default StaffPermission;

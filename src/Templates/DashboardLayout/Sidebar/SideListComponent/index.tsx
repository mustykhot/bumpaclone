import { ReactNode } from "react";
import "./style.scss";
type SideListComponentProps = {
  children: ReactNode;
  styles?: {
    top: string;
  };
};

export const SideListComponent = ({
  children,
  styles,
}: SideListComponentProps) => (
  <div className="pd_sidelist_component" style={{ ...styles, zIndex: 4000 }}>
    {children}
  </div>
);

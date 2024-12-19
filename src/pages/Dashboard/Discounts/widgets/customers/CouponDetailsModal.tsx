import { useState } from "react";
import { IconButton } from "@mui/material";
import { Button, Chip } from "@mui/material";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
// import "./style.scss";
import { CustomerDetailsModal } from "./CustomerDetailsModal";
import { EditIcon } from "assets/Icons/EditIcon";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { CopyIcon } from "assets/Icons/CopyIcon";
import { UsersIcon } from "assets/Icons/UsersIcon";
// import { Recipients } from "../Recipients";
type CouponDetailsProps = {
    openModal: boolean;
    closeModal: () => void;
};


export const CouponDetailsModal = ({ openModal, closeModal }: CouponDetailsProps) => {
    const [openViewCustomers, setOpenViewCustomers] = useState(false)

    return (
        <>
            
            <ModalRight
                closeModal={() => {
                    closeModal();
                }}
                openModal={openModal}
            >
                <div className="modal_right_children pd_view_campaign pd_coupon_details">
                    <div className="top_section">
                        <ModalRightTitle
                            closeModal={() => {
                                closeModal();
                            }}
                            title="Coupon Details"
                            extraChild={(
                                <div>
                                    <Button
                                        variant="outlined"
                                        startIcon={<EditIcon stroke={"#009444"} />}
                                        style={{ marginRight: "10px" }}
                                    >
                                        &nbsp; Edit &nbsp;
                                    </Button>
                                    <IconButton
                                        type="button"
                                        className="icon_button_container"
                                        onClick={() => { }}
                                    >
                                        <TrashIcon />
                                    </IconButton>
                                </div>


                            )


                            }
                        >


                        </ModalRightTitle>

                        <div className="notification_details">
                            <div className="body">
                                <div className="px-[32px]">
                                    <div className="single_detail">
                                        <p className="light_text">Coupon Name</p>
                                        <h3 className="bold_text">Black Friday Sales</h3>
                                    </div>
                                    <div className="single_detail">
                                        <p className="light_text">Coupon Code</p>
                                        <div className="copy_code">
                                            <h3 className="bold_text pr-4">TJCYEND7H</h3>
                                            <IconButton
                                                type="button"
                                                className="icon_button_container"
                                            >
                                                <CopyIcon />
                                            </IconButton>
                                        </div>
                                    </div>
                                    <div className="single_detail">
                                        <p className="light_text">Discount Type</p>
                                        <h4 className="bold_text">Percentage discount</h4>
                                    </div>
                                    <div className="single_detail">
                                        <p className="light_text">Discount</p>
                                        <h4 className="bold_text">20%</h4>
                                    </div>
                                    <div className="single_detail">
                                        <p className="light_text">Number of Use</p>
                                        <h4 className="bold_text">85</h4>
                                    </div>
                                    <div className="single_detail">
                                        <p className="light_text">Number of Use</p>
                                        <h4 className="bold_text">All orders above N20,0000</h4>
                                    </div>
                                    <div className="single_detail">
                                        <p className="light_text">Coupon Status</p>
                                        <Chip label="Active" color="success" className="chip_size" />
                                    </div>
                                    <div className="single_detail">
                                        <p className="light_text">Discount Validity</p>
                                        <h4 className="bold_text">12/02/2023 - 18/03/2023</h4>
                                    </div>


                                    <Button
                                        startIcon={<UsersIcon  />}
                                        variant="outlined"
                                        className="view_customers"
                                        onClick={() => {
                                            setOpenViewCustomers(true)
                                        }}
                                    >
                                        View Customers{" "}
                                    </Button>{" "}


                                </div>

                            </div>



                        </div>
                    </div>


                </div>
            </ModalRight>
            <CustomerDetailsModal
                openModal={openViewCustomers}
                closeModal={() => {
                    setOpenViewCustomers(false)
                }}
            />
         
        </>
    );
};

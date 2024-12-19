import { useState, useEffect } from "react";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { Button, Chip } from "@mui/material";
import { useGetSingleWalletTransactionsDetailsQuery } from "services";
import { Skeleton } from "@mui/material";

import "./style.scss";
import { ReceiptIcon } from "assets/Icons/ReceiptIcon";

type ModalProps = {
  openModal: boolean;
  closeModal: () => void;
  activeId: string;
};

export const WalletTransDetails = ({
  openModal,
  closeModal,
  activeId,
}: ModalProps) => {
  const { data, isLoading: loadingTransaction } =
    useGetSingleWalletTransactionsDetailsQuery({ transactionId: activeId });

  useEffect(() => {
    if (data) {
    }
  }, [data]);

  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children trans_modal">
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              title="Transaction Details"
            />
            <div className="wallet_bank_body trans_moadal_body trans_details">
              <div
                className={`trans_wrap ${
                  data?.data?.status == "FAILED"
                    ? "trans-failed"
                    : "trans-success"
                }`}
              >
                <span>Amount</span>
                {loadingTransaction ? (
                  <div className="flex space-x-2 justify-center">
                    <Skeleton animation="wave" width={"1rem"} />
                    <Skeleton animation="wave" width={"1rem"} />
                    <Skeleton animation="wave" width={"1rem"} />
                    <Skeleton animation="wave" width={"1rem"} />
                    <Skeleton animation="wave" width={"1rem"} />
                  </div>
                ) : (
                  <h2>N{data?.data?.amount}</h2>
                )}
              </div>
              <div className="trans_dets_table">
                <div className="single_transaction">
                  <p>Transaction Type</p>
                  {loadingTransaction ? (
                    <div className="flex space-x-2">
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                    </div>
                  ) : (
                    <h2>Withdrawal</h2>
                  )}
                </div>
                <div className="single_transaction">
                  <p>Bank</p>
                  {loadingTransaction ? (
                    <div className="flex space-x-2">
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                    </div>
                  ) : (
                    <h2>First Bank of Nigeria</h2>
                  )}
                </div>
                <div className="single_transaction">
                  <p>Recipient</p>
                  {loadingTransaction ? (
                    <div className="flex space-x-2">
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                    </div>
                  ) : (
                    <h2>Raji Mustapha</h2>
                  )}
                </div>
                <div className="single_transaction">
                  <p>Account Number</p>
                  {loadingTransaction ? (
                    <div className="flex space-x-2">
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                    </div>
                  ) : (
                    <h2>0192348234</h2>
                  )}
                </div>
                <div className="single_transaction">
                  <p>Transaction Status</p>
                  {/* <h2> */}
                  {loadingTransaction ? (
                    <div className="flex space-x-2">
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                      <Skeleton animation="wave" width={"1rem"} />
                    </div>
                  ) : (
                    <div className="status">
                      <Chip
                        color={
                          data?.data?.status == "FAILED" ? "warning" : "success"
                        }
                        label={data?.data?.status}
                        // className="transchip"
                      />
                    </div>
                  )}

                  {/* </h2> */}
                </div>
              </div>
              <Button variant="contained" className="trans_btn flex gap-x-2">
                <ReceiptIcon />
                Download Receipt
              </Button>
            </div>
          </div>
        </div>
      </ModalRight>
    </>
  );
};

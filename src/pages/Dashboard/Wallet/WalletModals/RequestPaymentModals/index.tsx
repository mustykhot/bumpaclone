import { useState, useEffect } from "react";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import Button from "@mui/material/Button";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import WalletEmpty from 'assets/images/Wallet-empty-icon.png'
import { PlusIcon } from "assets/Icons/PlusIcon";
import UnpaidOrders from "./UnpaidOrders";
import { useGetUnpaidPaymentRequestQuery } from 'services';
import { WalletTransactionIcon } from 'assets/Icons/WalletTransactionIcon';
import moment from "moment";
import {
    Skeleton
} from "@mui/material";

type RequestPaymentsModalProps = {
    openModal: boolean;
    closeModal: () => void;
};

const RequestPaymentModals = ({ openModal,
    closeModal }: RequestPaymentsModalProps) => {
    const [showUnpaidOrdersModal, setShowUnpaidOrdersModal] = useState(false)
    const [unPaidrequestList, setUnpaidRequestList] = useState<any[]>([])
    const [timeLeft, setTimeLeft] = useState('')
    const [isExpired, setIsExpired] = useState(false)
    const [expiredTime, setExpiredTime] = useState(false)
    const { data: unpaidPaymentRequestData, isLoading: loadingUnpaidPaymentRequest } = useGetUnpaidPaymentRequestQuery({ provider: 'fincra' });

    useEffect(() => {
        let intervalId: any;
    
        const updateTimer = () => {
          if (unpaidPaymentRequestData) {
            setUnpaidRequestList(unpaidPaymentRequestData?.data)
            const givenDate = moment(unpaidPaymentRequestData?.data?.temporary_virtual_account?.expires_at);
            const now = moment();
            const notExpired = now.isBefore(givenDate);
    
            if (notExpired) {
              const duration = moment.duration(givenDate.diff(now));
              const hours = duration.hours();
              const minutes = duration.minutes();
              const seconds = duration.seconds();
    
              const formattedTimeLeft = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}}`;
              setTimeLeft(formattedTimeLeft);
    
              if (hours < 3) {
                setExpiredTime(true);
              } else {
                setExpiredTime(false);
              }
            } else {
              setIsExpired(true);
              setExpiredTime(true);
              clearInterval(intervalId);
            }
          }
        };
    
        intervalId = setInterval(updateTimer, 1000);
    
        return () => clearInterval(intervalId);
      }, [unpaidPaymentRequestData]);

    return (
        <div>
            <ModalRight
                closeModal={() => {
                    closeModal();
                }}
                openModal={openModal}
            >
                <div className="modal_right_children h-full ">
                    <div className="top_section">
                        <ModalRightTitle
                            closeModal={() => {
                                closeModal();
                            }}
                            title="Collect Payment"
                            extraChild={
                                <Button
                                    onClick={() => { setShowUnpaidOrdersModal(true) }}
                                    type="button"
                                    className="manage-withdrawal"
                                    disabled={false}
                                    variant="outlined"
                                    startIcon={<PlusIcon stroke='#009444' />}
                                >
                                    New Payment Request
                                </Button>
                            }
                        />

                        <div>
                            <div className='wallet-payment-receipt'>

                                <div>
                                    {loadingUnpaidPaymentRequest ? <div className="chart_sekeleton_container p-4">
                                        {[1, 2, 3, 4].map((item) => (
                                            <Skeleton
                                                animation="wave"
                                                key={item}
                                                width={"100%"}
                                                height={40}
                                            />
                                        ))}
                                    </div> :
                                        (
                                            unPaidrequestList.length ? unPaidrequestList?.map((item: any, index: number) => (
                                                <div key={index} className='mb-2 mt-4 px-2'>
                                                    <div className='flex items-center py-2 px-4 bg-light rounded-[8px]' >
                                                        <div className='flex space-x-2 items-center'>
                                                            <div>
                                                                <WalletTransactionIcon />
                                                            </div>
                                                            <div>
                                                                <div className='text-base font-medium text-black-02'>{item?.customer_details?.first_name} {item?.customer_details?.last_name}</div>
                                                                <div className='text-xs mt-1 text-grey-01'>Order #{item?.order?.id}</div>
                                                            </div>
                                                        </div>
                                                        <div className='ml-auto text-right'>
                                                            <div className='font-medium text-black-02'>N{item?.amount}</div>
                                                            <div className='text-xs mt-1 text-grey-01'>Time left: <span className={`${expiredTime ? 'text-error' : 'text-primary'}`}>{isExpired ? 'Expired' : timeLeft}</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                            ) :
                                                (<div className="my-44 text-center">
                                                    <img className="mx-auto" src={WalletEmpty} alt="empty-wallet" />
                                                    <div className="mt-6 text-grey-01">You have no unpaid request payment</div>
                                                    <div className="mt-4">
                                                        <Button
                                                            onClick={() => { setShowUnpaidOrdersModal(true) }}
                                                            type="button"
                                                            disabled={false}
                                                            variant="contained"
                                                            startIcon={<PlusIcon />}

                                                        >
                                                            New Payment Request
                                                        </Button>
                                                    </div>
                                                </div>))
                                    }
                                </div>

                            </div>
                        </div>


                    </div>


                </div>
            </ModalRight>

            {showUnpaidOrdersModal && <UnpaidOrders openModal={showUnpaidOrdersModal} closeModal={() => { setShowUnpaidOrdersModal(false) }} />}
        </div>
    )
}

export default RequestPaymentModals;
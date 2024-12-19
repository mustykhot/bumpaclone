import { useState, useEffect } from 'react';
import './style.scss'
import DropDownWrapper from "components/DropDownWrapper";
import Button from "@mui/material/Button";
import { SettingsIcon } from 'assets/Icons/Sidebar/SettingsIcon';
import { PinLockIcon } from 'assets/Icons/PinLockIcon';
import { LockIcon } from 'assets/Icons/LockIcon';
import { BankIcon1 } from 'assets/Icons/BankIcon1';
import { StatementIcon } from 'assets/Icons/StatementIcon';
import { FaceIdIcon } from 'assets/Icons/FaceIdIcon';
import { TransactionLimitModal } from './WalletModals/TransactionModals/TransactionLimitModal';
import UpdatePinModal from './WalletModals/PinModals/ChangePinModal';
import { WalletBankDetails } from './WalletModals/BankModal/BankDetailsModal';
import { StatementModal } from './WalletModals/AccountStatementModals/StatementModal';
import { CoinsHand } from 'assets/Icons/CoinsHand';
import { SendIcon } from 'assets/Icons/SendIcon';
import { NigeriaFlag } from 'assets/Icons/NigeriaFlag';
import {
  MenuItem,
  Select,
  Skeleton
} from "@mui/material";
import { CopyIcon2 } from 'assets/Icons/CopyIcon2';
import PocketPiggy from 'assets/images/Pocket-Piggy.png'
import AccesssLogo from 'assets/images/Access-logo.svg'
import Chart from "react-apexcharts";
import { dashboardBarChartOption } from "utils/analyticsOptions";
import { ApexOptions } from "apexcharts";
import { Indicator } from "components/Indicator";
import { WalletWithdrawalIcon } from 'assets/Icons/WalletWithdrawalIcon';
import { WalletSettlementIcon } from 'assets/Icons/WalletSettlementIcon'
import { WalletTransactionIcon } from 'assets/Icons/WalletTransactionIcon';
import {
  SALESCHANNELFILTER,
} from "utils/constants/general";
import DateRangeDropDown from 'components/DateRangeDropDown';
import { FillArrowIcon } from 'assets/Icons/FillArrowIcon';
import { DateIcon } from 'assets/Icons/DateIcon';
import { useAppDispatch, useAppSelector } from 'store/store.hooks';
import { selectIsWalletTour, setIsWalletTour } from 'store/slice/NotificationSlice';
import { WalletJoyRideComponent } from 'components/JoyRideComponent/WalletJoyRideComponent';
import VerifyIdentityModal from './WalletModals/IdentityModals/VerifyIdentityModal';
import WalletWithdrawalModals from './WalletModals/WalletWithdrawalModals';
import WithdrawalPinModal from "./WalletModals/WalletWithdrawalModals/WithdrawalPinModal";
import { WalletTransDetails } from './WalletModals/TransDetailsModals/TransDetailsModal';
import { useGetWalletDetailsQuery, useGetWalletTransactionsQuery, useGetUnpaidPaymentRequestQuery, useGetWalletTransactionAnalyticsQuery } from 'services';
import { setWalletDetails } from "store/slice/WalletSlice";
import moment from "moment";
import { useCopyToClipboardHook } from 'hooks/useCopyToClipboardHook';
import PinSuccessModal from './WalletModals/PinModals/PinSuccessModal';
import RequestPaymentModals from './WalletModals/RequestPaymentModals';
import WalletIcon from 'assets/Icons/WalletIcon';
import StatementSuccessModal from './WalletModals/AccountStatementModals/StatementSucessModal';
import { thisYearEnd, thisYearStart } from "utils/constants/general";
import { capitalizeText, formatWalletBalance } from 'utils';


const Wallet = () => {
  const [showUpdatePinModal, setShowUpdatePinModal] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [showBankDetails, setShowBankDetails] = useState(false)
  const [showStatementModal, setShowStatementModal] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [isVerified, setIsVerified] = useState(true)
  const [inProgress, setInProgress] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [showTransactionDetails, setShowTransactionDetails] = useState(false)
  const [currencyValue, setCurrencyValue] = useState('NGN')
  const isWalletTour = useAppSelector(selectIsWalletTour);
  const [startTour, setStartTour] = useState(false);
  const [step, setStep] = useState(0);
  const [walletFirstTimer, setWalletFirstTimer] = useState(false);
  const [firstTimer, setFirstTimer] = useState(false)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [barStyleOptions, setBarStyleOptions] = useState<ApexOptions>(
    dashboardBarChartOption
  );
  const [barWidth, setBarWidth] = useState<any>(undefined);
  const [series, setSeries] = useState<any>([]);
  const [filter, setFilter] = useState('all');
  const [openWithdrawalModal, setOpenWithdrawalModal] = useState(false)
  const [showWithdrawalPinModal, setShowWithdrawalPinModal] = useState(false)
  const { data, isLoading } = useGetWalletDetailsQuery({ provider: 'fincra' })
  const { data: unpaidPaymentRequestData, isLoading: loadingUnpaidPaymentRequest } = useGetUnpaidPaymentRequestQuery({ provider: 'fincra' });
  const { data: transactionAnalyticsData, isLoading: loadingTransactionAnalytics } = useGetWalletTransactionAnalyticsQuery({ provider: 'fincra' })
  const [transactionList, setTransactionList] = useState<any[]>([])
  const [activeTransactionId, setActiveTransactionId] = useState('')
  const [pinSuccess, setPinSuccess] = useState(false)
  const [showPinSuccess, setShowPinSuccess] = useState(false)
  const [statementSucess, setStatementSucess] = useState(false)
  const [showStatementSucessModal, setshowStatementSucessModal] = useState(false)
  const { handleCopyClick } = useCopyToClipboardHook(
    data
      ? data?.data?.account_number
      : ""
  );
  const [showRequestPaymentModal, setShowRequestPaymentModal] = useState(false)
  const [unPaidrequestList, setUnpaidRequestList] = useState<any[]>([])
  const [walletTransactionAnalyticsList, setWalletTransactionAnalyticsList] = useState<any>({})
  const [timeLeft, setTimeLeft] = useState('')
  const [isExpired, setIsExpired] = useState(false)
  const [expiredTime, setExpiredTime] = useState(false)
  const [walletType, setWalletType] = useState('')
  const [dateRange, setDateRange] = useState<any>([
    {
      startDate: '',
      endDate: '',
      key: "selection",
    },
  ]);
  const { data: transactionData, isLoading: loadingTransaction } = useGetWalletTransactionsQuery({
    provider: 'fincra',
    type: walletType,
    filter,
    from: (dateRange[0].startDate && dateRange[0].endDate)
      ? moment(new Date(dateRange[0]?.startDate)).format("Y-MM-DD")
      : "",
    to: (dateRange[0].startDate && dateRange[0].endDate)
      ? moment(new Date(dateRange[0]?.endDate)).format("Y-MM-DD")
      : ""
  })

  useEffect(() => {
    if (dateRange[0].startDate && dateRange[0].endDate) {
      setFilter('')
    }
  }, [dateRange])

  const dateLabel: any = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec'
  }

  const dispatch = useAppDispatch()

  useEffect(() => {
    const delay = 5000;
    const timeoutId = setTimeout(() => {
      const visitedBefore = localStorage.getItem('visitedWalletPage');

      if (!visitedBefore) {
        localStorage.setItem('visitedWalletPage', 'true');
        setWalletFirstTimer(true);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (walletFirstTimer) {
      dispatch(setIsWalletTour(true));

    }
  }, [walletFirstTimer])


  useEffect(() => {
    if (isWalletTour) {
      if (screenWidth > 1300) {
        setStartTour(true);
      }
    }
    else {
      setStartTour(false)
    }

    // eslint-disable-next-line
  }, [isWalletTour]);

  const setBarSeriesOption = (analytics: any) => {
    if (analytics) {
      setSeries([
        {
          name: "Settlements",
          data: walletTransactionAnalyticsList?.monthly_totals?.map(
            (item: any) => Number(item.settlement_amount_total)
          ),
        },
        {
          name: "Withdrawals",
          data: walletTransactionAnalyticsList?.monthly_totals?.map(
            (item: any) => Number(item.withdrawal_amount_total)
          ),
        },
      ]);
      setBarStyleOptions({
        ...barStyleOptions,
        xaxis: {
          ...barStyleOptions.xaxis,
          categories:
            walletTransactionAnalyticsList?.monthly_totals?.map(
              (item: any) => dateLabel[item?.month]
            ),
        },
      });
    }
  };

  useEffect(() => {
    setBarSeriesOption(walletTransactionAnalyticsList?.monthly_totals);
    // eslint-disable-next-line
  }, []);


  useEffect(() => {
    if (data) {
      dispatch(setWalletDetails(data?.data))
    }
  }, [data])

  useEffect(() => {
    if (transactionData) {
      setTransactionList(transactionData.transactions?.data)
    }
  }, [transactionData])

  useEffect(() => {
    if (pinSuccess) {
      setShowPinSuccess(true)
      setShowUpdatePinModal(false)
    }
  }, [pinSuccess])


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


  useEffect(() => {
    if (transactionAnalyticsData) {
      setWalletTransactionAnalyticsList(transactionAnalyticsData?.data)
    }
  }, [transactionAnalyticsData])



  useEffect(() => {
    if (statementSucess) {
      setshowStatementSucessModal(true)
      setShowStatementModal(false)
    }
  }, [statementSucess])

  const closePinModal = () => {
    setShowUpdatePinModal(false)
    setPinSuccess(false)
  }
  const closeStatemnetSucessModal = () => {
    setShowStatementModal(false)
    setshowStatementSucessModal(false)
    setStatementSucess(false)
  }

  const closeSuccessModal = () => {
    setShowPinSuccess(false)
    setPinSuccess(false)
  }
  return (
    <>
      <div className="pd_wallet">
        {/* wallet tour */}
        <WalletJoyRideComponent
          setIsStart={setStartTour}
          setStep={setStep}
          isStart={startTour}
          step={step}
        />
        <div className="flex justify-between">
          <h3 className="name_of_section">Bumpa Wallet</h3>
          <div>
            <DropDownWrapper
              origin="right"
              className="wallet_dropdown rounded-[6px]"
              action={
                <Button
                  className='wallet-settings'
                  startIcon={<SettingsIcon />}
                  id="first_wallet_tour_step"
                >

                  <p className="text-base"
                  >Settings</p>
                </Button>
              }
            >
              <div className="cover_buttons">
                <ul className="select_list  btn_list wallet-settings-list">
                  <li>
                    <Button
                      startIcon={
                        <span className="span">
                          <PinLockIcon />
                        </span>
                      }
                      onClick={() => setShowUpdatePinModal(true)}
                    >
                      Change PIN
                    </Button>
                  </li>
                  <li>
                    <Button
                      startIcon={
                        <span className="span">
                          <LockIcon />
                        </span>
                      }
                      onClick={() => setShowTransactionModal(true)}
                    >
                      Transaction Limit
                    </Button>
                  </li>
                  <li>
                    <Button
                      onClick={() => { setShowBankDetails(true) }}
                      startIcon={
                        <span className="span">
                          <BankIcon1 />
                        </span>
                      }
                    >
                      Bank Account Details
                    </Button>
                  </li>
                  <li>
                    <Button
                      onClick={() => { setShowVerifyModal(true) }}
                      startIcon={
                        <span className="span">
                          <FaceIdIcon />
                        </span>
                      }
                    >
                      Identity Verification
                    </Button>
                  </li>
                  <li>
                    <Button
                      onClick={() => { setShowStatementModal(true) }}
                      startIcon={
                        <span className="span">
                          <StatementIcon />
                        </span>
                      }
                    >
                      Generate Statement of Account
                    </Button>
                  </li>

                  {/* test wallet walkthrough ride */}
                  <li>
                    <Button
                      onClick={() => { dispatch(setIsWalletTour(!isWalletTour)) }}
                      startIcon={
                        <span className="span">
                          <StatementIcon />
                        </span>
                      }
                    >
                      Wallet Walkthrough
                    </Button>
                  </li>

                </ul>
              </div>
            </DropDownWrapper>
          </div>
        </div>

        <div className='wallet-top mt-4'>
          <div className='wallet-balance'>
            <div className='flex justify-between'>
              <div className='balance-heading'>
                <div className='text-grey-02 font-medium tracking-widest'>WALLET BALANCE</div>
                {isLoading ? <div className='flex space-x-2 mt-3'>
                  <Skeleton animation="wave" width={'1rem'} />
                  <Skeleton animation="wave" width={'1rem'} />
                  <Skeleton animation="wave" width={'1rem'} />
                  <Skeleton animation="wave" width={'1rem'} />
                </div>
                  :
                  <div className='text-primary mt-3'>
                    <span className='font-medium text-2xl'>₦</span> <span className='font-semibold text-4xl'>{firstTimer ? '0.' : `${data?.data?.balance ? formatWalletBalance(data?.data?.balance as number)?.whole : data?.data?.balance}.`}</span><span className='font-medium text-2xl'>{formatWalletBalance(data?.data?.balance as number)?.decimal}</span>
                  </div>
                }
                {/* <div className='mt-2'>
                  <span className='font-light text-base text-grey-01'>{firstTimer ? 'No Pending Balance:' : 'Pending Balance:'}</span>
                  {!firstTimer && <span className='font-medium text-base text-grey-01'> N150,000.00</span>}
                </div> */}
              </div>
              <div>
                <div className='flex items-center space-x-3 bg-white rounded-[8px] py-2 px-3 shadow'>
                  <NigeriaFlag />

                  <span className='text-black-02'>NGN</span></div>
              </div>
            </div>

            <div className='mt-10 flex space-x-4 w-[100%]'>
              <Button
                className='basis-1/2'
                variant={"contained"}
                onClick={() => {
                  setShowRequestPaymentModal(true)
                }}
                startIcon={<CoinsHand stroke={"#fff"} />}
                id="second_wallet_tour_step"
              >
                Request Payment
              </Button>
              <Button
                className='withdrawal-button basis-1/2'
                onClick={() => {
                  setOpenWithdrawalModal(true)
                }}
                startIcon={<SendIcon stroke={"#222D37"} />}
                id="third_wallet_tour_step"
              >
                Withdraw
              </Button>
            </div>
          </div>


          <div className='wallet-bank flex flex-col'>
            <div className='px-6 pt-6'>
              <div>
                <img src={AccesssLogo} alt='logo' />
              </div>

              <div className='flex mt-4 items-center'>
                <div className='text-sm text-grey-02 basis-1/3'>Account Number</div>
                <div className='flex space-x-6 items-center basis-2/3'>
                  <div className='font-semibold text-black-02 text-xl'>{isLoading ? <div className='flex space-x-2'>
                    <Skeleton animation="wave" width={'1rem'} />
                    <Skeleton animation="wave" width={'1rem'} />
                    <Skeleton animation="wave" width={'1rem'} />
                    <Skeleton animation="wave" width={'1rem'} />
                  </div> : (firstTimer ? '********' : data?.data?.account_number)}</div>
                  {!firstTimer && <div onClick={() => {
                    handleCopyClick();
                  }}>
                    <span className='flex space-x-2 cursor-pointer bg-grey-00 py-1 px-3 rounded-[8px]'><span><CopyIcon2 /></span> <span className='text-grey-01 font-medium'>Copy</span></span>
                  </div>}
                </div>
              </div>

              <div className='flex mt-4 items-center'>
                <div className='text-sm text-grey-02 basis-1/3'>Account Name</div>
                <div className='font-semibold text-black-02 text-xl basis-2/3'>{isLoading ? <div className='flex space-x-2'>
                  <Skeleton animation="wave" width={'1rem'} />
                  <Skeleton animation="wave" width={'1rem'} />
                  <Skeleton animation="wave" width={'1rem'} />
                  <Skeleton animation="wave" width={'1rem'} />
                </div> : data?.data?.bank_name}</div>
              </div>
            </div>

            <div className='flex justify-center border-t mt-auto py-2 space-x-2 items-center'>
              <span className='text-sm font-medium'>powered by</span>
              <img src={PocketPiggy} alt="" />
            </div>

          </div>

        </div>

        <div className='wallet-bottom mt-8'>

          <div className='h-[56rem] flex flex-col space-y-8'>
            {/* transaction analytics */}
            <div className='basis-2/4 overflow-y-auto'>
              <div className="chart_section h-[100%]">
                <div className="transaction_summary">
                  <div className="detail mt-6">
                    <p className="title">
                      Transactions
                    </p>
                    {transactionAnalyticsData?.data ? <p className="amount mt-1">
                      ₦{walletTransactionAnalyticsList?.annual_total ? (`${formatWalletBalance(walletTransactionAnalyticsList?.annual_total)?.whole}.${formatWalletBalance(walletTransactionAnalyticsList?.annual_total)?.decimal}`) : walletTransactionAnalyticsList?.annual_total}
                    </p> : null
                    }
                    {transactionAnalyticsData?.data ? <Indicator
                      indicatorText={`${walletTransactionAnalyticsList?.recent_settlement_total_growth_rate}% from last month`}
                      isIncrease={
                        true
                      }
                      className='mt-1'
                    /> : null
                    }
                  </div>
                </div>
                <div className="chart_container">
                  {loadingTransactionAnalytics ? <div className="chart_sekeleton_container">
                    {[1, 2, 3, 4].map((item) => (
                      <Skeleton
                        animation="wave"
                        key={item}
                        width={"100%"}
                        height={40}
                      />
                    ))}
                  </div> : <> <Chart
                    options={barStyleOptions}
                    series={series}
                    height={300}
                    width={barWidth}
                    type="bar"
                  />
                    {!transactionAnalyticsData?.data
                      ? <div className="empty_chart_modal">
                        <div className="empty_chart_box">
                          No transactions data available
                        </div>
                      </div> : null
                    }
                  </>
                  }
                </div>
              </div>
            </div>

            {/* transaction list */}

            <div className='wallet-transaction basis-2/4 overflow-y-auto'>
              <div className='flex transaction-header border-b px-6 bg-grey-table-hover px-6 py-4 rounded-t-[8px]'>
                <div className='text-grey-01 font-medium'>Transaction History</div>
                {/* <div className='ml-auto text-primary cursor-pointer text-sm font-medium'>View All</div> */}
              </div>
              <div className='border-b'>
                <div className='px-6 py-4 search_container'>
                  <div className="filter_container flex items-center space-x-2">

                    <Button
                      onClick={() => {
                        setFilter('all');
                        setWalletType('')
                        setDateRange([
                          {
                            startDate: '',
                            endDate: '',
                            key: "selection",
                          },
                        ])
                      }}
                      className={`all-filter ${filter === 'all' ? 'active-class' : ''}`}
                    >
                      All
                    </Button>

                    <DateRangeDropDown
                      origin={"left"}
                      from='wallet'
                      setCustomState={setDateRange}
                      className={`bg-grey-05 rounded-[8px] text-grey-01 `}
                      action={
                        <Button
                          endIcon={<DateIcon />}
                          className="drop_btn flex space-x-4 text-grey-01 py-2 px-2"
                        >
                          {(dateRange[0].startDate && dateRange[0].endDate)
                            ? `${moment(dateRange[0]?.startDate).format(
                              "D/MM/YYYY"
                            )} - ${moment(dateRange[0]?.endDate).format(
                              "D/MM/YYYY"
                            )}`
                            : "Date"}
                        </Button>
                      }
                    />

                    <Select
                      displayEmpty
                      value={''}
                      onChange={(e) => {
                        setFilter('')
                        setWalletType(e.target.value)
                      }}
                      className={`my-select dark ${walletType !== 'Type' && walletType !== '' ? 'active-class' : ''}`}
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem disabled value="">
                        {(walletType ? capitalizeText(walletType) : walletType) || 'Type'}
                      </MenuItem>
                      <MenuItem value="WALLET CREDIT">Wallet Credit</MenuItem>
                      <MenuItem value="WALLET DEBIT">Wallet Debit</MenuItem>
                      <MenuItem value="PURCHASE">
                        Purchase
                      </MenuItem>
                      <MenuItem value="CHARGEBACK">Charge Back</MenuItem>
                      <MenuItem value="REFUND">
                        Refund
                      </MenuItem>
                      <MenuItem value="FEES">Fees</MenuItem>
                      <MenuItem value="TAX">
                        Tax
                      </MenuItem>
                      <MenuItem value="TRANSFER">Transfer</MenuItem>
                    </Select>

                  </div>
                </div>
              </div>


              <div className='w-[100%] overflow-x-auto'>
                {loadingTransaction ? <div className="chart_sekeleton_container p-4">
                  {[1, 2, 3, 4].map((item) => (
                    <Skeleton
                      animation="wave"
                      key={item}
                      width={"100%"}
                      height={40}
                    />
                  ))}
                </div> :
                  <>{!transactionList?.length ?
                    <div className='flex flex-col justify-center items-center mt-16'>
                      <div><WalletIcon /></div>
                      <div className='text-grey-01'>No wallet history</div>
                    </div> :
                    (transactionList?.map((item: any, index: number) => (
                      <div key={index} className='border-b'
                        onClick={() => { setShowTransactionDetails(true); setActiveTransactionId(item?.id) }}
                      >
                        <div className='flex items-center py-4 px-6' >
                          <div className='flex space-x-2 items-center'>
                            <div>
                              {index === 1 ? <WalletTransactionIcon /> : (index === 2 || index === 3) ? <WalletWithdrawalIcon /> : <WalletSettlementIcon />}
                            </div>
                            <div>
                              <div className='text-base font-medium text-black-02'>{item?.customer?.name}</div>
                              <div className='text-xs mt-1 text-grey-01'>{moment(item?.created_at).format("LL")} {moment(item?.created_at).format("LT")}</div>
                            </div>
                          </div>
                          <div className='ml-auto text-right'>
                            <div className={`font-medium ${index === 3 ? 'text-error' : index === 2 ? 'text-black-02' : 'text-primary'}`}>N{item?.amount}</div>
                            <div className='text-xs mt-1 text-grey-01'>Balance: 156,800</div>
                          </div>
                        </div>
                      </div>
                    )
                    )
                    )} </>}
              </div>
            </div>
          </div>

          {/* unpaid request list */}
          <div>
            <div className='wallet-payment-receipt  w-[100%] h-[56rem]'>
              <div className='payment-header border-b px-6 bg-grey-table-hover px-6 py-4 rounded-t-[8px]'>
                <div className='text-grey-01 font-medium'>Unpaid Payment Requests</div>
              </div>

              <div className='w-[100%] h-[100%] overflow-x-auto'>
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
                      (<div className='flex flex-col justify-center items-center h-[100%]'>
                        <div className='flex flex-col justify-center items-center rounded-[16px] shadow p-8'>
                          <div className='text-grey-01 font-medium'>No pending payment request</div>
                          <div className="save mt-3">
                            <Button type="button" onClick={() => {
                              setShowRequestPaymentModal(true)
                            }} variant='contained' className="save" >
                              Request payment
                            </Button>
                          </div>
                        </div>
                      </div>))
                }
              </div>

            </div>
          </div>
        </div>

      </div>

      {showUpdatePinModal && (
        <UpdatePinModal
          openModal={showUpdatePinModal}
          closeModal={() => closePinModal()}
          isSuccess={pinSuccess}
          setIsSucess={setPinSuccess}
        />
      )}
      {pinSuccess && (
        <PinSuccessModal
          openModal={showPinSuccess}
          closeModal={() => closeSuccessModal()}
        />
      )}

      {showTransactionModal && (
        <TransactionLimitModal
          openModal={showTransactionModal}
          closeModal={() => setShowTransactionModal(false)}
        />
      )}
      {showBankDetails && (
        <WalletBankDetails
          openModal={showBankDetails}
          closeModal={() => setShowBankDetails(false)}
        />
      )}
      {showStatementModal && (
        <StatementModal
          openModal={showStatementModal}
          closeModal={() => setShowStatementModal(false)}
          isStatementSuccess={statementSucess}
          setIsStatementSucess={setStatementSucess}
        />
      )}

      {showStatementSucessModal && (
        <StatementSuccessModal
          openModal={showStatementSucessModal}
          closeModal={() => closeStatemnetSucessModal()}
        />
      )}

      {showVerifyModal && (
        <VerifyIdentityModal
          openModal={showVerifyModal}
          closeModal={() => setShowVerifyModal(false)}
          isVerified={isVerified}
          inProgress={inProgress}
        />
      )}
      {showVerifyModal && (
        <VerifyIdentityModal
          openModal={showVerifyModal}
          closeModal={() => setShowVerifyModal(false)}
          isVerified={isVerified}
          inProgress={inProgress}
        />
      )}

      {showTransactionDetails && (
        <WalletTransDetails
          openModal={showTransactionDetails}
          closeModal={() => setShowTransactionDetails(false)}
          activeId={activeTransactionId}
        />
      )}

      {openWithdrawalModal && <WalletWithdrawalModals openModal={openWithdrawalModal}
        closeModal={() => setOpenWithdrawalModal(false)} openPinModal={() => { setShowWithdrawalPinModal(true); setOpenWithdrawalModal(false) }} />}

      {showWithdrawalPinModal && <WithdrawalPinModal openModal={showWithdrawalPinModal} closeModal={() => setShowWithdrawalPinModal(false)} />}

      {showRequestPaymentModal && <RequestPaymentModals openModal={showRequestPaymentModal} closeModal={() => { setShowRequestPaymentModal(false) }} />}
    </>
  )
};

export default Wallet;
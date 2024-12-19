import Modal from 'components/Modal';
import CloseSqIcon from 'assets/Icons/CloseSqIcon';
import { Button, Checkbox, IconButton } from '@mui/material';
import igbumpa from "/igbumpa.png"
import vidbtn from "/vidbtn.png"
import "./metacheck.scss"
import { useState } from 'react';
import { BackArrowIcon } from 'assets/Icons/BackArrowIcon';

type ModalProps = {
    openModal: boolean;
    closeModal: () => void;
    startMetaConnection: () => void;
};
const TOTALSTEPS = 2;
const checkList = [
    {text:"Switch your Instagram account to a professional account.", link:"https://www.getbumpa.com/blog/how-to-switch-your-instagram-account-to-a-professional-account"},
    {text:"Connect your Instagram account to your Facebook account.", link:"https://www.getbumpa.com/blog/how-to-connect-your-facebook-account-to-your-instagram-account-with-pictures"},
    {text:"Enable Instagram notifications." },
    {text:"Grant access to messages on Instagram. ", link:"https://www.getbumpa.com/blog/how-to-connect-your-facebook-account-to-your-instagram-account-with-pictures"},
    {text:"Create/Connect a business Facebook Page to your Instagram account.", link:"https://www.getbumpa.com/blog/how-to-connect-your-facebook-account-to-your-instagram-account-with-pictures"}
]

const MetaChecks = ({ openModal, closeModal, startMetaConnection }: ModalProps) => {
    const [presentStep, setPresentStep] = useState(1);
    const [checkboxStates, setCheckboxStates] = useState(new Array(checkList.length).fill(false));

    const handleCheckboxChange = (index: number) => {
        const updatedCheckboxStates = [...checkboxStates];
        updatedCheckboxStates[index] = !updatedCheckboxStates[index];
        setCheckboxStates(updatedCheckboxStates);
    };
    
    const goNext = (num: number) => {
        setPresentStep(
            presentStep <= TOTALSTEPS ? presentStep + num : presentStep
        );
    };

   
    return (
        <>
            <Modal
                openModal={openModal}
                closeModal={() => {
                    closeModal()
                }}
            >
                <div className="meta_mdl_wrap">
                    <div className={presentStep > 1 ? 'close_btn two_btn' : 'close_btn'} >
                        {presentStep > 1 && (
                            <IconButton type="button" className="back_btn_wrap "
                                onClick={() => goNext(-1)}
                            >
                                <BackArrowIcon className='back_btn' />
                            </IconButton>
                        )}

                        <IconButton type="button" className="back_btn_wrap"
                            onClick={() => closeModal()}
                        >
                            <CloseSqIcon />
                        </IconButton>

                    </div>
                    <div className={presentStep > 1 ? "details_wrap second_wrap" : "details_wrap"}>
                        {presentStep == 1 && (
                            <div className="first_content">
                                <img src={igbumpa} alt="IgXBumpa" />
                                <h2>Instagram Connection</h2>
                                <p className='first_p para'>Take all your Bumpa tools to your Instagram DM and transform how you sell on IG.</p>

                                <div className="bullet_pts">
                                    <ul>
                                        <li>Sell Products faster on Instagram when you power your DM with Bumpa tools.</li>
                                        <li>Automatically record all IG sales & get business analytics from Instagram.</li>
                                        <li>Establish yourself as a Pro IG vendor with receipts & invoices you can easily share on Instagram.</li>
                                        <li>Easy pick up any IG conversation from where they stop with a simple search on Bumpa</li>
                                        <li>Secure your Instagram contacts & conversations even if you lose your IG account.</li>
                                    </ul>
                                </div>
                                <Button className='cnct_meta_btn'
                                    onClick={() => goNext(1)}
                                >
                                    Connect to Meta
                                </Button>
                            </div>
                        )}
                        {presentStep == 2 && (
                            <div className="check_content">
                                <h2 className='content_h2'>How to connect</h2>
                                <p className='para para_2'>Connecting starts with your Instagram and Facebook page. Tick off each item to connect successfully.</p>
                                <a href='https://www.getbumpa.com/blog/step-by-step-guide-to-connect-your-bumpa-account-to-your-instagram-app' target='_blank'>
                                        <div className="btn_wrapper">
                                    <Button className='tut_btn'>
                                        <img src={vidbtn} alt="play btn" className='play_btn' />
                                        <span>Watch video tutorial </span>
                                    </Button>
                                </div> 
                                </a>
                           
                                {checkList.map((item, i) => (
                                    <div className="checkbox_wrapper" key={i}>
                                    <Checkbox className='check_box'
                                        checked={checkboxStates[i]}
                                        onChange={() => handleCheckboxChange(i)}
                                    
                                    />
                                    <div className="text_box">
                                    <p>{item.text}</p>
                                    {item.link && (
                                    <a href={item.link} target='_blank'>Learn More</a>
                                    )}
                                    </div>
                                </div>  
                                ))}
                              
                              <Button 
                                    onClick={() => startMetaConnection()}
                                    disabled={checkboxStates.some(state => !state)}
                                    className={`cnect_btn ${checkboxStates.some(state => !state) ? 'disabledButton' : ''}`}

                                >
                                    Connect to Meta
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

        </>
    )
}

export default MetaChecks
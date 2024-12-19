import { useState } from "react";
import Modal from "components/Modal";
import { Button, IconButton } from "@mui/material";
import CloseSqIcon from "assets/Icons/CloseSqIcon";
import "./modal.scss"
import logo from 'assets/images/wrapped/logo.png'

type propType = {
    openModal: boolean;
    closeModal: () => void;
};
export const AcademyModal = ({ openModal, closeModal }: propType) => {
    return (
        <>
            <Modal
                closeModal={() => {
                    closeModal();
                }}
                openModal={openModal}
            >
                <div className="acedemy_modal">
                    <div className="close" onClick={() => closeModal()}>
                        <IconButton type="button" className="">
                            <CloseSqIcon  stroke="#4F4F4F"/>
                        </IconButton>
                    </div>
                    <div className="header_flex flex">

                        <img src={logo} className="logo"/>
                        <span> Business academy</span>
                    </div>
                    <div className="modal_body">
                        <h2>Satisfied with your Results?</h2>
                        <h4>Take free business growth courses from Bumpa Academy to prepare yourself for bigger doings in 2024.</h4>
                    </div>
                    <Button
                        variant="contained"
                        className="try_btn"
                    >
                        <a href="https://academy.getbumpa.com" target="_blank">

                        Visit Bumpa Academy
                        </a>
                    </Button>
                    <p
                    onClick={() => closeModal()}
                    >I'll do that later.</p>
                </div>
            </Modal>
        </>
    )
}
import { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "assets/Icons/XIcon";
import bf from "assets/images/bf.svg";
import "./style.scss";
import { selectIsSubscriptionDets } from "store/slice/AuthSlice";
import { useAppSelector } from "store/store.hooks";

type PropType = {
  openModal: boolean;
  closeModal: () => void;
  size: "small" | "large";
};

const BlackFridayModal = ({ openModal, closeModal, size }: PropType) => {
  const isSubscriptionDets = useAppSelector(selectIsSubscriptionDets);
  const [link, setLink] = useState("");
  const handleCloseModal = () => {
    const discountCode = "BLACKFRIDAY24";
    localStorage.setItem("20%ModalClosed", "true");
    localStorage.setItem("savedNewDiscountCode", discountCode);
    closeModal();
  };
  useEffect(() => {
    const checkAndRemoveDiscountCode = () => {
      const currentDate = new Date();
      const decemberFirst = new Date(currentDate.getFullYear(), 11, 1, 0, 0, 0);
      if (currentDate >= decemberFirst) {
        localStorage.removeItem("savedNewDiscountCode");
        localStorage.setItem("20%ModalClosed", "true");
      }
    };
    checkAndRemoveDiscountCode();
  }, []);
  const isModalClosed = localStorage.getItem("20%ModalClosed") === "true";

  useEffect(() => {
    if (isSubscriptionDets && isSubscriptionDets.plan.slug) {
      const updatedSlug = isSubscriptionDets.plan.slug;
      if (isSubscriptionDets.plan_id === 12) {
        setLink(
          `/dashboard/subscription/select-plan?type=renew&slug=${updatedSlug}`
        );
      } else {
        setLink(`/dashboard/subscription/select-plan?type=upgrade`);
      }
    }
  }, [isSubscriptionDets]);

  return (
    <>
      <AnimatePresence>
        {openModal &&
          !isModalClosed &&
          window.location.pathname.includes("/dashboard") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "just" }}
              className={`pd_bf_banner ${size} bf_banner`}
            >
              <div className="bf_cover">
                <IconButton
                  onClick={() => closeModal()}
                  className="bf_cancel_box"
                >
                  <XIcon />
                </IconButton>

                <img src={bf} alt="black friday" />
                <div className="text_section">
                  <h4 className="title">
                    Save 20% with our Black Friday Deal!
                  </h4>
                  <p className="description">
                    Use code <span>BLACKFRIDAY24</span> to get 20% off on on all
                    Bumpa subscription plans
                  </p>
                </div>
                <a
                  href={link ? link : "/dashboard/subscription/select-plan"}
                  className="claim_btn"
                  onClick={handleCloseModal}
                >
                  Click To Claim
                </a>
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </>
  );
};

export default BlackFridayModal;

import { useEffect } from "react";
import { ClearIcon } from "assets/Icons/ClearIcon";
import Modal from "components/Modal";
import Features from "./Features";
import "./style.scss";

type propType = {
  openModal: boolean;
  closeModal: () => void;
};

const ComparePlansModal = ({ closeModal, openModal }: propType) => {
  useEffect(() => {
    if (openModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [openModal]);

  return (
    <Modal closeModal={closeModal} openModal={openModal}>
      <div className="compare_plans_modal">
        <div className="title_box">
          <h3>Compare Plans</h3>
          <ClearIcon handleClick={closeModal} />
        </div>
        <table className="feature_table fixed_header mobile_too">
          <thead>
            <tr>
              <th className="non_mobile">Solutions</th>
              <th className="non_mobile">Features</th>
              <th className="starter_yellow">Bumpa Starter</th>
              <th>Bumpa Pro</th>
              <th>Bumpa Growth</th>
            </tr>
          </thead>
        </table>
        <div className="feature_container">
          <Features />
        </div>
      </div>
    </Modal>
  );
};

export default ComparePlansModal;

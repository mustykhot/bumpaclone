import Modal from "components/Modal";
import './style.scss'

const ImageModal = ({ imageSource, openModal, setOpenmodal }: { imageSource: string; openModal: boolean; setOpenmodal: () => void }) => {
    return (
        <Modal className="modal-image" closeModal={() => {setOpenmodal() }} openModal={openModal} >
          <div className="modal-image-content" onClick={() => setOpenmodal()}>
          <img src={imageSource} />
          </div>
        </Modal>
    );
}

export default ImageModal;
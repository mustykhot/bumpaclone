import { useState } from "react";
import "./style.scss";
import { Button, CircularProgress } from "@mui/material";
import ModalRight from "components/ModalRight";
import InputField from "components/forms/InputField";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import TextAreaField from "components/forms/TextAreaField";
import NormalFileInput from "components/forms/NormalFileInput";
import { COLLECTIONROUTES } from "utils/constants/apiroutes";
import { useCreateCollectionMutation } from "services";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import Loader from "components/Loader";
type AddProductOptionsModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const AddProductCollectionModal = ({
  openModal,
  closeModal,
}: AddProductOptionsModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [createCollection, { isLoading }] = useCreateCollectionMutation();
  const submitHandler = async () => {
    let payload: { tag: string; description: string; image_path?: string } = {
      tag: "",
      description: "",
      image_path: "",
    };
    if (image) {
      payload = {
        tag: title,
        description: description,
        image_path: image,
      };
    } else {
      payload = {
        tag: title,
        description: description,
      };
    }
    try {
      let result = await createCollection(payload);
      if ("data" in result) {
        showToast("Created successfully", "success");
        setTitle("");
        setDescription("");
        setImage("");
        closeModal();
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };
  // if (isLoading) {
  //   return <Loader />;
  // }
  return (
    <ModalRight
      closeModal={() => {
        closeModal();
      }}
      openModal={openModal}
    >
      <div className="modal_right_children">
        <div className="top_section">
          <ModalRightTitle
            closeModal={() => {
              closeModal();
            }}
            title="Create Product Collection"
          />
          <div className="pl-[32px] pr-[32px] ">
            <NormalFileInput
              labelText="Collection Image"
              extraType="collection"
              name="image_path"
              type="img"
              uploadPath={COLLECTIONROUTES.UPLAOD_COLLECTION_IMAGE}
              onFileUpload={(val) => {
                setImage(val);
              }}
              cropWidth={500}
              cropHeight={500}
              aspect={500 / 500}
            />
            <InputField
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              label="Collection Name"
              placeholder="Enter Collection Name"
            />
            <TextAreaField
              value={description}
              height={"h-[120px]"}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              label="Collection Description"
            />
          </div>
        </div>

        <div className="productOptionSubmit bottom_section">
          <Button type="button" className="cancel" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            type="button"
            className="save"
            onClick={() => {
              submitHandler();
            }}
          >
            {isLoading ? (
              <CircularProgress size="1.5rem" sx={{ color: "white" }} />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};

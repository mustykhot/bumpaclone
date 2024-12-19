import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import { LoadingButton } from "@mui/lab";

import "./style.scss";
import { FormSectionHeader } from "../AddProduct/widget/FormSectionHeader";
import ValidatedInput from "components/forms/ValidatedInput";
import ValidatedTextArea from "components/forms/ValidatedTextArea";
import FileInput from "components/forms/FileInput";
import { COLLECTIONROUTES } from "utils/constants/apiroutes";
import { CollectionProduct } from "./collectionProduct";
import { showToast } from "store/store.hooks";
import { handleError } from "utils";
import { useCreateCollectionMutation } from "services";
import Loader from "components/Loader";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { QuickAddProductModal } from "pages/Dashboard/Orders/widgets/addProduct/QuickAddProduct";
import { getObjWithValidValues } from "utils/constants/general";
type CreateCollectionProps = {};
export type CreateCollectionField = {
  tag: string;
  description: string;
  image_path?: string;
  products?: number[];
  productsList?: any;
};

export const CreateCollection = ({}: CreateCollectionProps) => {
  const [createCollection, { isLoading }] = useCreateCollectionMutation();
  const [openProductModal, setOpenProductModal] = useState(false);
  const navigate = useNavigate();
  const methods = useForm<CreateCollectionField>({
    mode: "all",
  });
  const {
    formState: { isValid },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = methods;
  const onSubmit: SubmitHandler<CreateCollectionField> = async (data) => {
    const payload = {
      tag: data.tag,
      description: data.description,
      image_path: data.image_path,
      products: data.products,
    };
    try {
      let result = await createCollection(getObjWithValidValues(payload));
      if ("data" in result) {
        showToast("Created successfully", "success");
        navigate(-1);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="pd_create_collection">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form_section">
            <ModalHeader text="Create Product Collection" />{" "}
            <div className="form_field_container">
              <div className="collection_image_section">
                <FormSectionHeader title="Collection Image" />
                <div className="px-[16px]">
                  <FileInput
                    type="img"
                    extraType="collection"
                    name="image_path"
                    required={false}
                    dimensions="500px x 500px"
                    aspect={500 / 500}
                    cropWidth={500}
                    cropHeight={500}
                    uploadPath={COLLECTIONROUTES.UPLAOD_COLLECTION_IMAGE}
                  />
                </div>
              </div>
              <div className="collection_details_section">
                <FormSectionHeader title="Collection  Details" />
                <div className="px-[16px]">
                  <ValidatedInput
                    name="tag"
                    placeholder="Enter Name"
                    label="Colection Name"
                    type={"text"}
                  />
                  <ValidatedTextArea
                    name="description"
                    height="h-[120px]"
                    required={false}
                    label="Collection Description"
                  />
                </div>
              </div>
              <div className="collection_details_section">
                <FormSectionHeader title="Products" />
                <div className="px-[16px]">
                  <CollectionProduct
                    setOpenProductModal={setOpenProductModal}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="submit_form_section">
            <Button
              onClick={() => {
                reset();
              }}
              className="discard"
            >
              Discard
            </Button>
            <div className="button_container">
              <LoadingButton
                variant="contained"
                className="add"
                type="submit"
                disabled={!isValid}
              >
                Save
              </LoadingButton>
            </div>
          </div>
        </form>
      </FormProvider>
      {/* <AddProductModal
        openModal={openProductModal}
        closeModal={() => {
          setOpenProductModal(false);
        }}
      /> */}
      <QuickAddProductModal
        openModal={openProductModal}
        defaultExtraFnc={(item: any) => {
          let prevIds: any = watch("products") ? watch("products") : [];
          let prevProducts: any = watch("productsList")
            ? watch("productsList")
            : [];

          setValue("products", [...prevIds, item.id]);
          setValue("productsList", [...prevProducts, item]);
        }}
        closeModal={() => {
          setOpenProductModal(false);
        }}
      />
    </div>
  );
};

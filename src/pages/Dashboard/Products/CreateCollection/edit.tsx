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
import {
  useCreateCollectionMutation,
  useEditCollectionMutation,
  useGetSingleCollectionQuery,
} from "services";
import Loader from "components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ErrorMsg from "components/ErrorMsg";
import { QuickAddProductModal } from "pages/Dashboard/Orders/widgets/addProduct/QuickAddProduct";
import { getObjWithValidValues } from "utils/constants/general";
type CreateCollectionProps = {};
export type CreateCollectionField = {
  tag: string;
  description: string;
  image_path: string;
  products: number[];
  productsList?: any;
};

export const EditCollection = ({}: CreateCollectionProps) => {
  const { id } = useParams();
  const [editCollection, { isLoading }] = useEditCollectionMutation();
  const [openProductModal, setOpenProductModal] = useState(false);
  const navigate = useNavigate();
  const {
    data,
    isLoading: loadSingle,
    isError,
  } = useGetSingleCollectionQuery(id);
  const methods = useForm<CreateCollectionField>({
    mode: "all",
  });
  const {
    formState: { isValid },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = methods;
  const onSubmit: SubmitHandler<CreateCollectionField> = async (data) => {
    const payload = {
      tag: data.tag,
      description: data.description,
      image_path: data.image_path,
      products: data.products,
    };
    try {
      let result = await editCollection({
        body: getObjWithValidValues(payload),
        id,
      });
      if ("data" in result) {
        showToast("Updated successfully", "success");
        navigate(-1);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (data) {
      const { collection } = data;
      setValue("tag", collection.tag);
      setValue("description", collection.description);
      setValue(
        "image_path",
        collection.image_path ? collection.image_path : ""
      );
      // setValue("products", collection.products);
      const ids = collection.products.map((item) => item.id);
      setValue("productsList", collection.products);
      setValue("products", ids);
    }
  }, [data]);

  if (isError) {
    return <ErrorMsg error={"Something went wrong"} />;
  }
  if (isLoading || loadSingle) {
    return <Loader />;
  }

  return (
    <>
      {data && (
        <div className="pd_create_collection">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form_section">
                <ModalHeader text="Edit Collection" />{" "}
                <div className="form_field_container">
                  <div className="collection_image_section">
                    <FormSectionHeader title="Collection Image" />
                    <div className="px-[16px]">
                      <FileInput
                        type="img"
                        extraType="collection"
                        required={false}
                        name="image_path"
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
                  >
                    Save
                  </LoadingButton>
                </div>
              </div>
            </form>
          </FormProvider>
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
      )}
    </>
  );
};

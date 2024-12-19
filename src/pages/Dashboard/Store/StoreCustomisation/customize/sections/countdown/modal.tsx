import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import { UploadIcon } from "assets/Icons/UploadIcon";
import InputField from "components/forms/InputField";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import SearchSelect from "components/forms/SearchSelect";
import { IMAGE_TYPES, IMG_BASE_URL } from "utils/constants/general";
import { handleError } from "utils";
import {
  useGetCollectionsQuery,
  useGetProductQuery,
  useUploadGeneralImageMutation,
} from "services";
import "../style.scss";

type ModalType = {
  openModal: boolean;
  closeModal: () => void;
  saveChanges: (data: any) => void;
  data: any;
};

export const CountDownModal = ({
  openModal,
  closeModal,
  data,
  saveChanges,
}: ModalType) => {
  const [bgImage, setBgImage] = useState<any>(null);
  const [postGeneralImage, { isLoading: isUploading }] =
    useUploadGeneralImageMutation();
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [endDate, setEndDate] = useState<any>(null);
  const [linkTo, setLinkTo] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");
  const [countdownLink, setCountdownLink] = useState<any>(null);
  const [holdLinkTo, setHoldLinkTo] = useState<any>(null);
  const linkToOptions = [
    { label: "Collection", value: "Collection" },
    { label: "Product", value: "Product" },
  ];
  const {
    data: productData,
    isLoading,
    isFetching,
  } = useGetProductQuery({
    search: searchValue,
  });
  const {
    data: collectionsData,
    isLoading: loadCollections,
    isFetching: fetchCollections,
  } = useGetCollectionsQuery({ search: "" });
  useEffect(() => {
    if (data) {
      setBgImage(data?.bg_image);
      setTitle(data?.title);
      setSubTitle(data?.sub_title);
      data?.end_date && setEndDate(data?.end_date);
      setHoldLinkTo(data?.link_to);
      if (data?.link_to?.tag) {
        setLinkTo(linkToOptions[0]);
        setCountdownLink({
          label: data?.link_to?.tag,
          value: data?.link_to?.tag,
        });
      } else if (data?.link_to?.product_id) {
        setLinkTo(linkToOptions[1]);
        setCountdownLink({
          label: data?.link_to?.product_name,
          value: data?.link_to?.product_id,
        });
      }
    }
  }, [data]);

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imgFile = e?.target?.files[0];

      if (imgFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBgImage(reader.result);
          uploadImage(reader.result);
        };
        reader?.readAsDataURL(imgFile);
      }
    }
  };
  const uploadImage = async (base64Img: any) => {
    try {
      let payload = {
        url: `/media/image/upload`,
        image: { image: base64Img, name: "countdownBg" },
      };
      let result = await postGeneralImage(payload);
      if ("data" in result) {
        const imgPath = `${IMG_BASE_URL}${result?.data?.image?.path}`;
        setBgImage(imgPath);
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleFormSubmit = () => {
    var linkToUse = {
      product_id: null,
      product_slug: null,
      product_name: null,
      tag: null,
    };
    if (linkTo?.value === linkToOptions[0].value) {
      linkToUse.tag = countdownLink?.label;
    } else if (linkTo?.value === linkToOptions[1].value) {
      const selected = countdownLink?.info
        ? JSON.parse(countdownLink?.info)
        : null;
      linkToUse.product_id = selected ? selected?.id : holdLinkTo?.product_id;
      linkToUse.product_slug = selected
        ? selected?.slug
        : holdLinkTo?.product_slug;
      linkToUse.product_name = selected
        ? selected?.name
        : holdLinkTo?.product_name;
    }

    const payload = {
      show: true,
      bg_image: bgImage,
      title: title,
      sub_title: subTitle,
      end_date: endDate,
      link_to: linkToUse,
    };

    saveChanges(payload);
    closeModal();
  };

  const collectionOptions = collectionsData
    ? collectionsData?.tags?.map((item: any) => ({
        label: item?.tag,
        value: item?.description,
        info: JSON.stringify(item),
      }))
    : [];

  const productOptions = productData
    ? productData?.products?.data?.map((item: any) => ({
        label: item?.name,
        value: item?.id,
        info: JSON.stringify(item),
      }))
    : [];

  const optionToUse =
    linkTo?.value === linkToOptions[0].value
      ? collectionOptions
      : productOptions;

  const isDisabled = () => {
    var value = false;
    if (!title) value = true;
    if (!subTitle) value = true;
    if (!bgImage) value = true;
    if (!endDate) value = true;
    if (linkTo?.value && !countdownLink?.value) value = true;
    if (isUploading) value = true;

    return value;
  };
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
            title="Countdown"
            children={
              <p className="modal_description">
                Add a countdown/coming soon section to your website.
              </p>
            }
          />

          <div className="customize_modal_body countdown_modal">
            <div className="bg_image_upload">
              <div className="preview">
                <img src={bgImage} alt="" />
              </div>
              <div className="uploader">
                <p>
                  Recommended:
                  <br />
                  Orientation: Landscape | Max file size: 150kb
                </p>

                <input
                  id="countdownBgImgUpload"
                  type="file"
                  onChange={handleSelectImage}
                  accept={IMAGE_TYPES}
                />
                <Button
                  className="btn button_component btn_tertiary"
                  startIcon={
                    isUploading ? (
                      <CircularProgress
                        size="1.5rem"
                        sx={{ color: "#9BA2AC" }}
                      />
                    ) : (
                      <UploadIcon />
                    )
                  }
                >
                  <label htmlFor="countdownBgImgUpload">Upload image</label>
                </Button>
              </div>
            </div>
            <InputField
              type="text"
              value={title}
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
            />

            <InputField
              type="text"
              value={subTitle}
              placeholder="Sub Title"
              onChange={(e) => setSubTitle(e.target.value)}
            />

            <InputField
              type="datetime-local"
              value={endDate}
              placeholder="Sub Title"
              onChange={(e) => setEndDate(e.target.value)}
            />

            <div className="link_to">
              <div className="item">
                <p>
                  Link to (Optional)
                  {linkTo?.label && (
                    <span onClick={() => setLinkTo(null)}>Clear</span>
                  )}
                </p>
                <SearchSelect
                  placeholder="Select..."
                  defaultValue={linkTo}
                  options={linkToOptions}
                  onChange={(selected) => {
                    setLinkTo(selected);
                    setCountdownLink(null);
                  }}
                  menuPlacement="top"
                />
              </div>

              {linkTo?.label && (
                <div className="item">
                  <p>Select {linkTo?.label}</p>
                  <SearchSelect
                    placeholder="Select..."
                    defaultValue={countdownLink}
                    onChange={(selected) => setCountdownLink(selected)}
                    onInputChange={(value) => setSearchValue(value)}
                    options={optionToUse}
                    isLoading={
                      isFetching ||
                      isLoading ||
                      loadCollections ||
                      fetchCollections
                    }
                    menuPlacement="top"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className=" bottom_section">
          <Button type="button" className="cancel" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            type="button"
            className="save"
            onClick={() => {
              handleFormSubmit();
            }}
            disabled={isDisabled()}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </ModalRight>
  );
};

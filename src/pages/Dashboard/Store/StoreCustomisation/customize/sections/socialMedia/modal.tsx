import { useState } from "react";
import { IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import { TrashIcon } from "assets/Icons/TrashIcon";
import InputField from "components/forms/InputField";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import SearchSelect from "components/forms/SearchSelect";
import "../style.scss";

type ModalType = {
  openModal: boolean;
  closeModal: () => void;
  socialLinks: {
    name: string;
    handle: string;
  }[];
  setSocialLinks: (data: any) => void;
  saveChanges: () => void;
};

export const SocialMediaModal = ({
  openModal,
  closeModal,
  socialLinks,
  saveChanges,
  setSocialLinks,
}: ModalType) => {
  const [selected, setSelected] = useState<any>(null);
  const [handle, setHandle] = useState("");

  const addToSocials = () => {
    if (selected && handle) {
      setSocialLinks([...socialLinks, { name: selected.value, handle }]);
      setSelected(null);
      setHandle("");
    }
  };

  const removeFromSocials = (index: number) => {
    const socials = [...socialLinks];

    if (index > -1) {
      socials.splice(index, 1);
    }

    setSocialLinks(socials);
  };

  const socialOptions = [
    { label: "WhatsApp", value: "whatsapp" },
    { label: "X", value: "x" },
    { label: "Instagram", value: "instagram" },
    { label: "Facebook", value: "facebook" },
    { label: "Tiktok", value: "tiktok" },
  ];

  const selectOptions = socialOptions?.filter((opt: any) =>
    socialLinks?.every((soc: any) => soc.name !== opt.value)
  );

  const isDisabled = () => {
    var value = false;

    if (socialLinks?.length < 1) value = true;

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
            title="Social media handles"
            children={
              <p className="modal_description">
                Add your social media handles to your website.{" "}
              </p>
            }
          />

          <div className="customize_modal_body social_media_modal">
            <div className="list">
              {socialLinks?.map((item, index) => (
                <div key={index} className="item">
                  <p className="title">
                    {item.name} | <span>{item.handle}</span>
                  </p>

                  <IconButton
                    className="icon p-0"
                    onClick={() => removeFromSocials(index)}
                  >
                    <TrashIcon stroke="#d90429" />
                  </IconButton>
                </div>
              ))}
            </div>

            {selectOptions?.length > 0 && (
              <div className="form">
                <div className="input_flex">
                  <SearchSelect
                    placeholder="Select..."
                    defaultValue={selected}
                    onChange={(value) => setSelected(value)}
                    readOnly={false}
                    options={selectOptions}
                    extraClass={"form_group_container"}
                  />
                  <InputField
                    type="text"
                    placeholder={
                      selected?.value === "whatsapp"
                        ? "+23490129012"
                        : "my_store"
                    }
                    value={handle}
                    readOnly={false}
                    onChange={(e) => setHandle(e.target.value)}
                    containerClass={"form_element"}
                  />{" "}
                </div>

                <Button
                  disabled={!selected || !handle}
                  type="button"
                  className="btn_tertiary"
                  onClick={addToSocials}
                >
                  Add
                </Button>
              </div>
            )}
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
              saveChanges();
              closeModal();
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

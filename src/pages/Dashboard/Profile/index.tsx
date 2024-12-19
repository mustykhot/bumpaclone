// External Libraries
import { useState, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";

// Icons & Images
import { EditIcon } from "assets/Icons/EditIcon";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { WhatsappIcon } from "assets/Icons/WhatsappIcon";
import { TwitterIcon } from "assets/Icons/TwitterIcon";
import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";
import instagram from "assets/images/instagram.png";
import facebook from "assets/images/facebook.png";
import snapchat from "assets/images/snapchat.png";

// Custom Components
import ValidatedInput from "components/forms/ValidatedInput";
import InputField from "components/forms/InputField";
import NormalFileInput from "components/forms/NormalFileInput";
import Loader from "components/Loader";
import ErrorMsg from "components/ErrorMsg";
import { ModalHeader } from "../Home/Widgets/ModalHeader";
import { FormSectionHeader } from "../Products/AddProduct/widget/FormSectionHeader";
import { DeleteAccountModal } from "./DeleteAccount/DeleteAccount";

// Services & API Hooks
import {
  useGetStoreProfileQuery,
  useUpdateStoreProfileMutation,
  useUpdateStoreProfilePasswordMutation,
  useGetStoreInformationQuery,
} from "services";

// Utils & Helpers
import { handleError } from "utils";
import { SETTINGSROUTES } from "utils/constants/apiroutes";
import { useSingleUploadHook } from "hooks/useSingleUploadHook";

// Store Hooks & Actions
import { setProfile } from "store/slice/ProfileSlice";
import { setUserDetails } from "store/slice/AuthSlice";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { selectProfileAvatar } from "store/slice/ProfileSlice";

// Styles
import "./style.scss";

type ProfileField = {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  telegram: string;
  snapchat: string;
  twitter: string;
  date_of_birth: string;
};

export const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordValidate, setPasswordValidate] = useState("");
  const [newErr, setNewErr] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bvnVerificationComplete, setBvnVerificationComplete] = useState(false);
  const dispatch = useAppDispatch();
  const { uploadImage, uploadLoading } = useSingleUploadHook();
  const { isLoading, data: user, isError } = useGetStoreProfileQuery();
  const [updateStoreProfile, { isLoading: editLoading }] =
    useUpdateStoreProfileMutation();
  const [updateStoreProfilePassword, { isLoading: updatePasswordLoading }] =
    useUpdateStoreProfilePasswordMutation();
  const profileAvatar = useAppSelector(selectProfileAvatar);

  const methods = useForm<ProfileField>({
    mode: "all",
  });
  const {
    formState: { isValid },
    handleSubmit,
    setValue,
  } = methods;
  const {
    data: storeData,
    isLoading: loadStore,
    isError: storeError,
  } = useGetStoreInformationQuery();

  const onSubmit: SubmitHandler<ProfileField> = async (data) => {
    let paylod = {
      name: data.name,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      date_of_birth: data.date_of_birth,
      social: {
        whatsapp: data.whatsapp,
        snapchat: data.snapchat,
        telegram: data.telegram,
        twitter: data.twitter,
        facebook: data.facebook,
        instagram: data.instagram,
      },
    };
    try {
      let result = await updateStoreProfile(paylod);
      if ("data" in result) {
        setIsEdit(false);
        showToast("Profile Updated Successfully", "success");
        dispatch(setUserDetails(result.data.user));
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const localChangeHandler = async (file: Blob) => {
    uploadImage("profile-avatar", file);
  };

  const handleEditProfile = () => {
    setIsEdit(true);
  };

  const onUpload = (value: string) => {
    setAvatarUrl(value);
  };

  useEffect(() => {
    if (user) {
      dispatch(setProfile(user));
      setValue("name", user?.name ? user.name : "");
      setValue("first_name", user?.first_name ? user.first_name : "");
      setValue("last_name", user?.last_name ? user.last_name : "");
      setValue("email", user?.email ? user.email : "");
      setValue("date_of_birth", user?.date_of_birth ? user.date_of_birth : "");
      setValue("phone", user?.phone ? user.phone : "");

      if (user.bvn_verified_at) {
        setBvnVerificationComplete(true);
      }
    }
    // eslint-disable-next-line
  }, [user]);
  useEffect(() => {
    if (storeData?.store?.settings?.social) {
      setValue("instagram", storeData.store.settings.social.instagram);
      setValue("facebook", storeData.store.settings.social.facebook);
      setValue("whatsapp", storeData.store.settings.social.whatsapp);
      setValue("twitter", storeData.store.settings.social.twitter);
      setValue("snapchat", storeData.store.settings.social.snapchat);
      setValue("telegram", storeData.store.settings.social.telegram);
    }
  }, [storeData]);

  useEffect(() => {
    if (newPassword.length < 8 && confirmPassword) {
      setPasswordValidate("Password must have at least 8 characters");
    } else {
      setPasswordValidate("");
      if (newPassword !== confirmPassword && isEdit) {
        setNewErr("Password mismatch");
      } else {
        setNewErr("");
      }
    }
    // eslint-disable-next-line
  }, [confirmPassword, newPassword]);

  const handleChangePassword = async () => {
    try {
      if (newPassword === confirmPassword) {
        const payload = {
          old_password: oldPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        };

        let result = await updateStoreProfilePassword(payload);
        if ("data" in result) {
          showToast("Password Changed Successfully", "success");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          handleError(result);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const resetDefaultUpload = () => {
    setAvatarUrl("");
  };

  if (isError) {
    return <ErrorMsg />;
  }
  return (
    <div className="pd_profile">
      {isLoading && <Loader />}
      <DeleteAccountModal
        openModal={openModal}
        closeModal={() => {
          setOpenModal(false);
        }}
      />
      {user && (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form_section">
              <ModalHeader
                text="Profile"
                button={
                  !isEdit && (
                    <div className="btn_flex ">
                      <Button
                        startIcon={<EditIcon stroke="#009444" />}
                        variant="outlined"
                        onClick={handleEditProfile}
                      >
                        Edit Profile
                      </Button>
                      <Button
                        startIcon={<TrashIcon stroke="#009444" />}
                        variant="outlined"
                        onClick={() => {
                          setOpenModal(true);
                        }}
                      >
                        Delete Account
                      </Button>
                    </div>
                  )
                }
              />

              <div className="form_field_container">
                <div className="section">
                  <FormSectionHeader title="Profile Picture" />
                  <div className="px-[16px]">
                    {!user?.avatar && !avatarUrl ? (
                      <NormalFileInput
                        disabled={!isEdit}
                        uploadPath={`${SETTINGSROUTES.UPLAOD_PROFILE_AVATAR}`}
                        labelText="Upload Profile Photo"
                        name="image"
                        type="img"
                        resetDefaultUpload={resetDefaultUpload}
                        onFileUpload={onUpload}
                        addCrop={false}
                        extraType="profile"
                      />
                    ) : (
                      <div className="user_image_box">
                        <img
                          src={user?.avatar || avatarUrl || profileAvatar}
                          className="user_image"
                          alt="user"
                        />
                        <label htmlFor="user_image">
                          {uploadLoading ? (
                            <CircularProgress
                              size="1.5rem"
                              sx={{ color: "#000000" }}
                            />
                          ) : (
                            "Change profile picture"
                          )}
                          <input
                            onChange={(e) => {
                              let file = e.target.files && e.target?.files[0];
                              if (file) {
                                localChangeHandler(file);
                              }
                            }}
                            name="user_image"
                            id="user_image"
                            hidden
                            type="file"
                            disabled={!isEdit}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <div className="section">
                  <FormSectionHeader title="Personal Information" />
                  {isEdit && bvnVerificationComplete && (
                    <div className="input_extra_indicator top_indicator">
                      <InfoCircleIcon stroke="#848D99" />
                      <p className="disabledNote">
                        To edit your personal information, please reach out to{" "}
                        <a href="mailto: support@getbumpa.com">Bumpa Support</a>
                      </p>
                    </div>
                  )}

                  <div className="px-[16px]">
                    <div className="form-group-flex">
                      <ValidatedInput
                        label="First Name"
                        name="first_name"
                        required={true}
                        placeholder="First Name"
                        disabled={!isEdit || bvnVerificationComplete}
                        showDisabledNote={bvnVerificationComplete}
                        disabledNote="Name cannot be changed after BVN verification."
                        innerClass={
                          isEdit && bvnVerificationComplete
                            ? "disabled_grey"
                            : ""
                        }
                      />
                      <ValidatedInput
                        label="Last Name"
                        name="last_name"
                        required={true}
                        placeholder="Last Name"
                        disabled={!isEdit || bvnVerificationComplete}
                        showDisabledNote={bvnVerificationComplete}
                        disabledNote="Name cannot be changed after BVN verification."
                        innerClass={
                          isEdit && bvnVerificationComplete
                            ? "disabled_grey"
                            : ""
                        }
                      />
                    </div>
                    <ValidatedInput
                      label="Date of Birth"
                      name="date_of_birth"
                      placeholder="Enter your date of birth"
                      type="date"
                      required={true}
                      disabled={!isEdit || bvnVerificationComplete}
                      showDisabledNote={bvnVerificationComplete}
                      innerClass={
                        isEdit && bvnVerificationComplete ? "disabled_grey" : ""
                      }
                      disabledNote="Date of Birth cannot be changed after BVN verification."
                    />
                    <ValidatedInput
                      label="Email"
                      name="email"
                      required={true}
                      placeholder="Enter email address"
                      disabled={!isEdit}
                      // innerClass={isEdit ? "disabled_grey" : ""}
                    />
                    <ValidatedInput
                      label="Phone Number"
                      required={true}
                      name="phone"
                      placeholder="Enter phone number"
                      disabled={!isEdit}
                    />
                  </div>
                </div>
                <div className="section">
                  <FormSectionHeader title="Social Profile" />

                  <div className="px-[16px]">
                    <div className="form-group-flex">
                      <ValidatedInput
                        label="Instagram Profile"
                        name="instagram"
                        required={false}
                        placeholder="Instagram Profile"
                        prefix={
                          <img
                            src={instagram}
                            width={24}
                            height={24}
                            className="social_svg"
                            alt="user"
                          />
                        }
                        disabled={!isEdit}
                      />
                      <ValidatedInput
                        label="Facebook Profile"
                        name="facebook"
                        required={false}
                        placeholder="Facebook Profile"
                        prefix={
                          <img
                            src={facebook}
                            width={24}
                            height={24}
                            className="social_svg"
                            alt="user"
                          />
                        }
                        disabled={!isEdit}
                      />
                    </div>
                    <div className="form-group-flex">
                      <ValidatedInput
                        label="Whatsapp Profile"
                        name="whatsapp"
                        required={false}
                        placeholder="Whatsapp Profile"
                        prefix={<WhatsappIcon className="social_svg" />}
                        disabled={!isEdit}
                      />
                      <ValidatedInput
                        label="Twitter Profile"
                        name="twitter"
                        required={false}
                        placeholder="Twitter Profile"
                        prefix={<TwitterIcon className="social_svg" />}
                        disabled={!isEdit}
                      />
                    </div>{" "}
                    <div className="form-group-flex">
                      <ValidatedInput
                        label="Snapchat Profile"
                        name="snapchat"
                        required={false}
                        placeholder="Snapchat Profile"
                        prefix={
                          <img
                            src={snapchat}
                            width={24}
                            height={24}
                            className="social_svg"
                            alt="user"
                          />
                        }
                        disabled={!isEdit}
                      />
                      <ValidatedInput
                        label="Telegram"
                        name="telegram"
                        required={false}
                        placeholder="Telegram"
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="section">
                  <FormSectionHeader title="Change Password" />
                  <div className="px-[16px]">
                    <InputField
                      label="Old Password"
                      name="oldPassword"
                      value={oldPassword}
                      onChange={(e: any) => {
                        setOldPassword(e.target.value);
                      }}
                      placeholder="Enter old Password"
                      disabled={!isEdit}
                      type="password"
                    />
                    <div className="form-group-flex">
                      <InputField
                        label="New Password"
                        name="newPassword"
                        value={newPassword}
                        errMsg={passwordValidate}
                        onChange={(e: any) => {
                          setNewPassword(e.target.value);
                        }}
                        placeholder="Enter new Password"
                        disabled={!isEdit}
                        type="password"
                      />
                      <InputField
                        label="Confirm Password"
                        name="confirmPassword"
                        value={confirmPassword}
                        errMsg={newErr || passwordValidate}
                        onChange={(e: any) => {
                          setConfirmPassword(e.target.value);
                        }}
                        placeholder="Re-enter new Password"
                        disabled={!isEdit}
                        type="password"
                      />
                    </div>

                    {isEdit && (
                      <div className="password_btn">
                        <LoadingButton
                          loading={updatePasswordLoading}
                          variant="contained"
                          className="add"
                          type="button"
                          onClick={handleChangePassword}
                          disabled={
                            !confirmPassword ||
                            !confirmPassword ||
                            !newPassword ||
                            !oldPassword
                          }
                        >
                          Change Password
                        </LoadingButton>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {isEdit && (
              <div className="submit_form_section">
                <Button className="discard">Discard</Button>
                <div className="button_container">
                  <Button
                    onClick={() => {
                      setIsEdit(false);
                    }}
                    variant="contained"
                    type="button"
                    className="preview"
                  >
                    Discard
                  </Button>

                  <LoadingButton
                    loading={editLoading}
                    variant="contained"
                    className="add"
                    type="submit"
                    disabled={!isValid}
                  >
                    Save
                  </LoadingButton>
                </div>
              </div>
            )}
          </form>
        </FormProvider>
      )}
    </div>
  );
};

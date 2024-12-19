import { useState } from "react";

import { useAppDispatch } from "store/store.hooks";
import { showToast } from "store/store.hooks";
import { setProfileAvatar } from "store/slice/ProfileSlice";
import { useUploadProfileAvatarMutation } from "services";
import { handleError } from "utils";

export const useSingleUploadHook = () => {
  const [uploadProfileAvatar, { isLoading: uploadLoading }] =
    useUploadProfileAvatarMutation();
  const [uploadedImage, setUploadedImage] = useState("");

  const dispatch = useAppDispatch();

  const uploadImage = async (component: string, file: any) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener("load", async function () {
        const resultImage = await reader.result;
        if (component === "profile-avatar") {
          const payload = {
            name: file?.name,
            data: resultImage,
          };
          const result = await uploadProfileAvatar({
            admin_avatar: JSON.stringify(payload),
          });
          if ("data" in result) {
            showToast("Profile Avatar Changed Successfully", "success");
            dispatch(setProfileAvatar(result?.data?.user?.avatar));
            setUploadedImage(result?.data?.user?.avatar);
          } else {
            handleError(result);
          }
        }
      });
    } catch (error) {
      handleError(error);
    }
  };

  return { uploadImage, uploadLoading, uploadedImage };
};

import { useState } from "react";

export const useCopyToClipboardHook = (text: string) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyTextToClipboard = async () => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  };
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard()
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  return { isCopied, handleCopyClick };
};

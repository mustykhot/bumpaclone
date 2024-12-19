import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";
import "./style.scss";

export const generateId = () => Math.random().toString(36).substr(2, 9);

type Props = {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  containerStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  error?: boolean;
};

const OtpInput = ({
  length = 4,
  onChange = () => {},
  error,
  containerStyle,
  inputStyle,
}: Props) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const updateOtp = (index: number, value: string) => {
    setOtp(otp.map((n, i) => (i === index ? value : n)));
  };

  useEffect(() => {
    onChange(otp.join(""));
  }, [otp]);

  const [inputIds] = useState(
    Array(length)
      .fill("")
      .map((_field) => generateId())
  );

  const otpInputs = Array(length)
    .fill("")
    .map(() => useRef(null));

  useEffect(() => {
    inputFocus(0);
  }, []);

  const handleInput = (
    value: string,
    index: number,
    e: FormEvent<HTMLInputElement>
  ) => {
    if (/\D/.test(value)) {
      if (value === "Backspace") {
        // delete the current input
        updateOtp(index, "");
        // if current input is empty, focus the previous input and delete it
        if (otp[index] === "" && index > 0) {
          updateOtp(index - 1, "");
          inputFocus(index - 1);
        }
      }
      return;
    }

    updateOtp(index, value);

    if (index !== otp?.length - 1) {
      inputFocus(index + 1);
    }
  };

  // @ts-ignore-next-line
  const inputFocus = (index: number) => otpInputs[index].current?.focus();

  return (
    <div style={{ ...containerStyle }} className="otp-input-wrap">
      {inputIds.map((id, index) => (
        <div
          style={{ ...inputStyle }}
          className={`input-container  ${error ? "invalid" : ""}`}
          key={`otp-input-${id}`}
          onClick={() => inputFocus(index)}
        >
          <input
            maxLength={1}
            id={id}
            ref={otpInputs[index]}
            value={otp[index]}
            onKeyDown={(e) => handleInput(e.key, index, e)}
          />
        </div>
      ))}
    </div>
  );
};

export default OtpInput;

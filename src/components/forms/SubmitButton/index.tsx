import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import "./style.scss";
type SubmitButtonProps = {
  type?: "button" | "submit" | "reset" | undefined;
  isLoading?: boolean;
  disabled?: boolean;
  text: string;
  // variant?: "text" | "contained" | "outlined";
  handleClick?: () => void;
};

export const SubmitButton = ({
  type = "button",
  text,
  isLoading,
  disabled,
  handleClick,
}: SubmitButtonProps) => (
  <Button
    type={type}
    className={"submit_button"}
    onClick={handleClick}
    variant="contained"
    disabled={disabled}
  >
    {isLoading ? <CircularProgress className="white" /> : text}
  </Button>
);

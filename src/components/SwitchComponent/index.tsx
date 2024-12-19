import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 45,
  height: 24,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 20,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      left: 10,
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#009444" : "#009444",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 18,
    height: 20,
    borderRadius: 8,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 40 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
})) as typeof Switch;

type Prop = {
  onChange: (newValue: boolean, index?: number) => void;
  checked: boolean;
  index?: number;
  value?: boolean;
  id?: string;
};

export const SwitchComponent = ({
  onChange,
  checked,
  index,
  value,
  id,
}: Prop) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    if (index !== undefined) {
      onChange(newValue, index);
    } else {
      onChange(newValue);
    }
  };

  return (
    <AntSwitch
      onChange={handleChange}
      inputProps={{ "aria-label": "ant design" }}
      checked={checked}
      value={value}
      id={id}
    />
  );
};

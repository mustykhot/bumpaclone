import "./style.scss";
type ToggleProps = {
  toggled: boolean;
  handlelick?: any;
  disabled?: boolean;
};

export const Toggle = ({ toggled, handlelick, disabled }: ToggleProps) => {
  return (
    <label className="pd_toggle">
      <input
        type="checkbox"
        checked={toggled}
        disabled={disabled}
        onChange={(e) => {
          handlelick && handlelick(!e.target.checked);
        }}
      />
      <span />
    </label>
  );
};

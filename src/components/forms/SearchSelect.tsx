import Select from "react-select";
import "./style.scss";
type Props = {
  async?: boolean;
  label?: string;
  placeholder?: string;
  defaultValue?: any;
  onChange: (value: any) => void;
  onInputChange?: (value: string) => void;
  menuPlacement?: any;
  readOnly?: boolean;
  isLoading?: boolean;
  isMulti?: boolean;
  options: any;
  errorMessage?: string;
  extraClass?: string;
};

const SearchSelect = ({
  async,
  label,
  placeholder,
  defaultValue,
  onChange,
  onInputChange,
  menuPlacement = "bottom",
  readOnly,
  isLoading,
  options,
  errorMessage,
  extraClass,
  ...rest
}: Props) => (
  <div className={`form_group_container_search_select ${extraClass}`}>
    <div className="form-group">
      {label && <label>{label}</label>}
      <Select
        classNamePrefix="select_container"
        placeholder={placeholder}
        value={defaultValue}
        options={options}
        onChange={onChange}
        onInputChange={onInputChange}
        isDisabled={readOnly}
        isLoading={isLoading}
        menuPlacement={menuPlacement || "bottom"}
        {...rest}
      />
    </div>

    {errorMessage && <span className="error_message">{errorMessage}</span>}
  </div>
);

export default SearchSelect;

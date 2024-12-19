import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
export const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: ["right", "center", "justify"] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
  ],
};
type Props = {
  placeholder?: string;
  disabled?: boolean;
  minLength?: number;
  label?: string;
  value?: string;
  handleChange: (val: string) => void;
};
const NormalTextEditor = ({
  label,
  disabled = false,
  placeholder,
  value,
  handleChange,
}: Props) => {
  return (
    <div className={`quill_container`}>
      {label && <label>{label}</label>}
      <ReactQuill
        readOnly={disabled}
        placeholder={placeholder}
        value={value}
        modules={modules}
        onChange={(val) => handleChange(val)}
        defaultValue={"<p></p>"}
      />
    </div>
  );
};

export default NormalTextEditor;

import { InfoCircleIcon } from "assets/Icons/InfoCircleIcon";

const SectionTitle = ({
  title,
  desc,
  errors,
}: {
  title: string;
  desc: string;
  errors?: string[];
}) => {
  return (
    <div className="section_title">
      <h6>{title}</h6>
      <p>{desc}</p>

      {errors && errors?.length > 0 && (
        <div className="errors">
          {errors?.map((item, i) => (
            <p key={i}>
              <InfoCircleIcon stroke="#d90429" />
              {item}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionTitle;

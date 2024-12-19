import { Card } from "@mui/material";
import "./style.scss";
import { CheckCircleIcon } from "assets/Icons/CheckCircleIcon";

type SelectableCardProps = {
  option: {
    image: string;
    limit: string;
    requiredDocs: string[];
    value: number;
  };
  isSelected: boolean;
  onSelect: (value: number) => void;
};

export const SelectableCard = ({
  option,
  isSelected,
  onSelect,
}: SelectableCardProps) => {
  return (
    <Card
      variant="outlined"
      className={`selectable-card ${isSelected ? "active" : ""}`}
      onClick={() => onSelect(option.value)}
    >
      <img src={option.image} alt={`Tier ${option.value}`} />
      <h4>
        Daily settlement limit is <span>{option.limit}</span>
      </h4>
      <div className="docs">
        <h5>Documents required</h5>
        {option.requiredDocs.map((doc, i) => (
          <div className="docs--each" key={i}>
            <CheckCircleIcon />
            <p>{doc}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

import React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { MarkIcon } from "assets/Icons/MarkIcon";
import { FEATURESLIST } from "utils/constants/general";
import NewMobileFeatures from "./NewMobileFeatures";

const Features = () => {
  const renderFeatureText = (text: string) => {
    const parts = text.split(/(\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <React.Fragment key={index}>
            <br />
            <span style={{ fontStyle: "italic" }}>{part}</span>
          </React.Fragment>
        );
      } else {
        return <React.Fragment key={index}>{part}</React.Fragment>;
      }
    });
  };

  return (
    <section id="compare" className="compare_feature">
      <table className="feature_table">
        <tbody>
          {FEATURESLIST.map((item, i) => (
            <React.Fragment key={i}>
              {item.features.map((feature, index) => (
                <tr key={`${i}-${index}`}>
                  {index === 0 && (
                    <td
                      className="tdetails title"
                      rowSpan={item.features.length}
                    >
                      {item.title}
                    </td>
                  )}
                  <td className="tdetails">{renderFeatureText(feature)}</td>
                  <td className="tdetails">
                    {item.starter[index] === "mark" ? (
                      <MarkIcon />
                    ) : item.starter[index] === "cancel" ? (
                      <ClearIcon sx={{ color: "red" }} />
                    ) : (
                      <p>{renderFeatureText(item.starter[index])}</p>
                    )}
                  </td>
                  <td className="tdetails">
                    {item.pro[index] === "mark" ? (
                      <MarkIcon />
                    ) : item.pro[index] === "cancel" ? (
                      <ClearIcon sx={{ color: "red" }} />
                    ) : (
                      <p>{renderFeatureText(item.pro[index])}</p>
                    )}
                  </td>
                  <td className="tdetails">
                    {item.growth[index] === "mark" ? (
                      <MarkIcon />
                    ) : item.growth[index] === "cancel" ? (
                      <ClearIcon sx={{ color: "red" }} />
                    ) : (
                      <p>{renderFeatureText(item.growth[index])}</p>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="solution-row">
                <td colSpan={5}></td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="mobile_feature">
        <NewMobileFeatures />
      </div>
    </section>
  );
};

export default Features;

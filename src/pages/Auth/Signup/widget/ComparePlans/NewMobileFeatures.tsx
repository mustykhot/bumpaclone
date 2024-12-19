import ClearIcon from "@mui/icons-material/Clear";
import { MarkIcon } from "assets/Icons/MarkIcon";
import "./mobilestyle.scss";
import { MobileList } from "utils/constants/general";

const NewMobileFeatures = () => {
  return (
    <>
      <div className="mobile_feature_table mobile">
        <div className="tbody">
          {MobileList.map((item, i) => (
            <div key={i}>
              {item.category ? (
                <p className="mobile_cat">{item.category}</p>
              ) : (
                ""
              )}
              <p className="mobile_feat">{item.feature}</p>
              <div key={i} className="trow trow_body">
                <div className="tdetails">
                  <ul>
                    {item.starter.map((item, i) =>
                      item === "mark" ? (
                        <li key={i}>
                          <MarkIcon />
                        </li>
                      ) : item === "cancel" ? (
                        <li key={i}>
                          <ClearIcon sx={{ color: "red" }} />
                        </li>
                      ) : (
                        <li key={i}>{item}</li>
                      )
                    )}
                  </ul>
                </div>

                <div className="tdetails">
                  <ul>
                    {item.pro.map((item, i) => (
                      <li key={i}>
                        {Array.isArray(item) ? (
                          <ul className="disc_list">
                            {item.map((subItem, index) => (
                              <li key={index} className="no_list">
                                {subItem}
                              </li>
                            ))}
                          </ul>
                        ) : item === "mark" ? (
                          <MarkIcon />
                        ) : item === "cancel" ? (
                          <ClearIcon sx={{ color: "red" }} />
                        ) : (
                          <p>{item}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="tdetails">
                  {item.growth.map((item, i) => (
                    <div key={i} className="mobile_list_li">
                      {Array.isArray(item) ? (
                        <ul className="disc_list">
                          {item.map((subItem, index) => (
                            <li key={index} className="no_list">
                              {subItem}
                            </li>
                          ))}
                        </ul>
                      ) : item === "mark" ? (
                        <MarkIcon />
                      ) : item === "cancel" ? (
                        <ClearIcon sx={{ color: "red" }} />
                      ) : (
                        <p>
                          {item}{" "}
                          <span className="extra">
                            {item === "2 Locations" &&
                              "*Additional charge for extra locations"}
                          </span>
                          <span className="extra">
                            {item === "5 Staff Account" &&
                              "*Additional charge for extra staff"}
                          </span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NewMobileFeatures;

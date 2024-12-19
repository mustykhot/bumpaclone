import { useState } from "react";
import Button from "@mui/material/Button";
import RemoveIcon from "@mui/icons-material/Remove";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { AnimatePresence, motion } from "framer-motion";
import { MarkIcon } from "assets/Icons/MarkIcon";
import { MobileFeatureType } from "Models";

const MobileFeature = ({ item }: { item: MobileFeatureType }) => {
  const [open, setOpen] = useState(true);

  const renderFeatureText = (text: string) => {
    const parts = text.split(/(\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        return <><br /><br /> <span style={{ fontStyle: "italic" }}>{part}</span></>;
      } else {
        return part;
      }
    });
  };

  return (
    <section className="single_mobile_feature">
      <h3 className="name title">{item.title}</h3>
      <p className="desc">{item.description}</p>
      <p className="price">{item.price}</p>
      <Button
        onClick={() => setOpen(!open)}
        startIcon={open ? <RemoveIcon /> : <AddIcon />}
      >
        {open ? "Hide Features" : "Show Features"}
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ type: "just" }}
            className="table_box"
          >
            <h3 className="feature_title title">Features</h3>
            {item.features.map(
              (
                feature: {
                  name: string;
                  description: string;
                },
                i: number
              ) => (
                <div key={i} className="feature_flex">
                  <div className="large">
                    <p>{feature.name}</p>
                  </div>
                  <div className="small">
                    {feature.description === "mark" ? (
                      <MarkIcon />
                    ) : feature.description === "cancel" ? (
                      <ClearIcon sx={{ color: "red" }} />
                    ) : (
                      <p>{renderFeatureText(feature.description)}</p>
                    )}
                  </div>
                </div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MobileFeature;

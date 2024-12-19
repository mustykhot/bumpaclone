import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { Checkbox } from "@mui/material";
import { useState } from "react";
import { hasMatchingId } from "utils";
import { useFormContext } from "react-hook-form";
type TaxModalProps = {
  openModal: boolean;
  closeModal: () => void;
};
const taxList = [
  { name: "Value Added Tax", tax: "7.5%", id: 1 },
  { name: "Consumption Tax", tax: "3.5%", id: 2 },
  { name: "Consumer Tax", tax: "2%", id: 3 },
];
export const SelectTaxModal = ({ openModal, closeModal }: TaxModalProps) => {
  const { setValue } = useFormContext();
  const [selected, setSelected] = useState<any>({ name: "", tax: "", id: 0 });
  const updateSelected = (value: any) => {
    setSelected(value);
  };
  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children">
          <div className="top_section">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              title="Select taxes"
            />
            <div className="displayList">
              {taxList.map((item, i) => {
                return (
                  <div key={i} className="item">
                    <div>
                      <Checkbox
                        checked={item.tax === selected.tax}
                        onChange={() => {
                          updateSelected(item);
                          setValue("tax", item);
                        }}
                      />
                      <p className="name">{item.name}</p>
                    </div>
                    <p>{item.tax}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className=" bottom_section">
            <Button type="button" className="cancel" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="button" className="save" onClick={closeModal}>
              Continue{" "}
            </Button>
          </div>
        </div>
      </ModalRight>
    </>
  );
};

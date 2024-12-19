import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { hasMatchingId } from "utils";
import { CreateTaxModal } from "./CreateTax";
import { useGetTaxQuery } from "services";
import { useFormContext } from "react-hook-form";
import { TaxType } from "services/api.types";
type TaxModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const SelectTaxModal = ({ openModal, closeModal }: TaxModalProps) => {
  const { setValue, watch } = useFormContext();
  const [openCreateTax, setOpenCreateTax] = useState(false);
  const [selected, setSelected] = useState<TaxType[]>(
    watch("taxes") ? watch("taxes") : []
  );
  const { data, isLoading, isError } = useGetTaxQuery();

  const updateSelected = (item: any) => {
    if (hasMatchingId(selected, item.id)) {
      const filteredList = selected.filter((el: any) => el.id !== item.id);
      setSelected(filteredList);
    } else {
      setSelected((prev: any) => [...prev, item]);
    }
  };

  const onSubmit = () => {
    setValue("taxes", selected);
    const getTotalTax = selected.reduce((total: number, item: TaxType) => {
      return total + item.percent;
    }, 0);
    setValue("taxPercent", getTotalTax);
    closeModal();
  };
  useEffect(() => {
    if (watch("taxes")) {
      setSelected(watch("taxes"));
    }
  }, [watch("taxes")]);
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
              extraChild={
                <Button
                  variant="outlined"
                  startIcon={<PlusIcon stroke="#009444" />}
                  onClick={() => {
                    setOpenCreateTax(true);
                  }}
                >
                  New Tax
                </Button>
              }
            />
            <div className="displayList">
              {data &&
                data?.taxTypes?.map((item, i) => {
                  return (
                    <div key={i} className="item">
                      <div>
                        <Checkbox
                          checked={hasMatchingId(selected, item.id)}
                          onChange={() => {
                            updateSelected(item);
                          }}
                        />
                        <p className="name">{item.name}</p>
                      </div>
                      <p>{item.percent}%</p>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className=" bottom_section">
            <Button type="button" className="cancel" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="button" className="save" onClick={onSubmit}>
              Continue{" "}
            </Button>
          </div>
        </div>
      </ModalRight>
      <CreateTaxModal
        openModal={openCreateTax}
        closeModal={() => {
          setOpenCreateTax(false);
        }}
      />
    </>
  );
};

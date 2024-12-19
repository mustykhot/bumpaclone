import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { Checkbox } from "@mui/material";
import { useState } from "react";
import { PlusIcon } from "assets/Icons/PlusIcon";
import { hasMatchingId } from "utils";
import { useGetTaxQuery } from "services";
import { useFormContext } from "react-hook-form";
import { TaxType } from "services/api.types";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { addTaxes, addTotalTax, selectTaxList } from "store/slice/PosSlice";

type TaxModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const SelectTaxModal = ({ openModal, closeModal }: TaxModalProps) => {
  const dispatch = useAppDispatch();
  const taxList = useAppSelector(selectTaxList);
  const [selected, setSelected] = useState<TaxType[]>(taxList);
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
    dispatch(addTaxes(selected));
    const getTotalTax = selected.reduce((total: number, item: TaxType) => {
      return total + item.percent;
    }, 0);
    dispatch(addTotalTax(getTotalTax));
    closeModal();
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
    </>
  );
};

import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useGetCollectionsQuery } from "services";
import InputField from "components/forms/InputField";
import { SearchIcon } from "assets/Icons/SearchIcon";
import "./style.scss";
import EmptyResponse from "components/EmptyResponse";
import { LoadingProductBox } from "pages/Dashboard/Orders/widgets/product/SelectProductModal";
import ErrorMsg from "components/ErrorMsg";

export type SelectedType = {
  tag: string;
  id: string | number;
};
type CustomerModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

export const SelectColletionsModal = ({
  openModal,
  closeModal,
}: CustomerModalProps) => {
  const [selected, setSelected] = useState<SelectedType[] | []>([]);
  const { watch, setValue } = useFormContext();
  const [searchCollections, setSearchCollections] = useState("");
  const {
    data: collections,
    isLoading,
    isFetching,
    isError,
  } = useGetCollectionsQuery({
    search: searchCollections,
  });
  const addCollectionsToForm = () => {
    // let previous = watch("customers");

    setValue("tags", selected);
    closeModal();
  };
  const updateSelected = (item: SelectedType) => {
    const index = selected.findIndex(
      (el: SelectedType) => `${el.id}` === `${item.id}`
    );
    if (index !== -1) {
      const updated = [...selected];
      updated.splice(index, 1);
      setSelected(updated);
    } else {
      setSelected((prev) => [...prev, { tag: item.tag, id: `${item.id}` }]);
    }
  };

  useEffect(() => {
    if (watch("tags")) {
      setSelected(watch("tags"));
    }
  }, [watch("tags")]);
  return (
    <>
      <ModalRight
        closeModal={() => {
          closeModal();
        }}
        openModal={openModal}
      >
        <div className="modal_right_children pd_select_customer_modal_box">
          <div className="top_section" id="scroller_top">
            <ModalRightTitle
              closeModal={() => {
                closeModal();
              }}
              className="remove_border"
              title="Select Collections"
            >
              <div className="search_field_box">
                <InputField
                  type={"text"}
                  containerClass="search_field"
                  value={searchCollections}
                  onChange={(e: any) => {
                    setSearchCollections(e.target.value);
                  }}
                  placeholder="Search"
                  suffix={<SearchIcon />}
                />
                {selected?.length ? (
                  <Button
                    onClick={() => {
                      setSelected([]);
                    }}
                    className="unselect"
                  >
                    Unselect
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </ModalRightTitle>
            <div className="displayList">
              {isError && <ErrorMsg error={"Something went wrong"} />}

              {!isError && !isLoading ? (
                collections && collections?.tags?.length ? (
                  <div className="single_related_product">
                    {collections?.tags?.map((item: any) => (
                      <div key={item.id} className="item">
                        <div>
                          <Checkbox
                            checked={selected.some(
                              (el: any) => `${el.id}` === `${item.id}`
                            )}
                            onChange={() => {
                              updateSelected({ tag: item.tag, id: item.id });
                            }}
                          />
                          <p className="name">{item.tag}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyResponse message="No collection found " />
                )
              ) : (
                ""
              )}

              {(isLoading || isFetching) &&
                [1, 2, 3, 4].map((item) => {
                  return <LoadingProductBox key={item} />;
                })}
            </div>
          </div>

          <div className=" bottom_section">
            <Button
              type="button"
              className="cancel"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="save"
              onClick={addCollectionsToForm}
            >
              Continue{" "}
            </Button>
          </div>
        </div>
      </ModalRight>
    </>
  );
};

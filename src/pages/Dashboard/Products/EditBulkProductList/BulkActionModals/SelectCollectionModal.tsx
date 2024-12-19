import Button from "@mui/material/Button";
import ModalRight from "components/ModalRight";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import { Checkbox } from "@mui/material";
import { useState, useEffect } from "react";
import { hasMatchingId } from "utils";
import InputField from "components/forms/InputField";
import { SearchIcon } from "assets/Icons/SearchIcon";
import { useGetCollectionsQuery } from "services";
import { CollectionType } from "services/api.types";
import ErrorMsg from "components/ErrorMsg";
import { LoadingProductBox } from "pages/Dashboard/Orders/widgets/product/SelectProductModal";
import EmptyResponse from "components/EmptyResponse";
type TaxModalProps = {
  openModal: boolean;
  closeModal: () => void;
  defaultCollections: any;
  rowIndex?: number;
  handleChange: any;
};

export const SelectCollectionModal = ({
  openModal,
  closeModal,
  defaultCollections,
  rowIndex,
  handleChange,
}: TaxModalProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [collectionList, setCollectionList] = useState<CollectionType[]>([]);
  const { data, isLoading, isError } = useGetCollectionsQuery({
    search: searchValue,
  });
  const [selected, setSelected] = useState<any>([]);
  const updateSelected = (item: any) => {
    if (hasMatchingId(selected, item.id)) {
      const filteredList = selected.filter((el: any) => el.id !== item.id);
      setSelected(filteredList);
    } else {
      setSelected((prev: any) => [...prev, item]);
    }
  };
  useEffect(() => {
    if (defaultCollections && defaultCollections.length) {
      setSelected(defaultCollections);
    }
  }, [defaultCollections]);

  const onSubmit = () => {
    handleChange(
      "tags",
      rowIndex,
      selected.map((item: any) => item)
    );
    closeModal();
    setSelected([]);
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
              title="Select Collection"
            />
            <div className="add_related_product_container ">
              <InputField
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                placeholder="Color"
                containerClass="search_field"
                suffix={<SearchIcon />}
              />
              <div className="selected_count">
                <p>{selected.length} Selected</p>
                {selected.length >= 1 ? (
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

              <div className="list_product_to_add_container displayList px-0">
                {isLoading &&
                  [1, 2, 3, 4].map((item) => <LoadingProductBox key={item} />)}
                {isError && <ErrorMsg error={"Something went wrong"} />}

                {!isError && !isLoading ? (
                  data && data?.tags?.length ? (
                    data?.tags?.map((item: any, i: number) => {
                      return (
                        <div key={i} className="item">
                          <div>
                            <Checkbox
                              checked={hasMatchingId(selected, item.id)}
                              onChange={() => {
                                updateSelected(item);
                              }}
                            />
                            <p className="name">{item.tag}</p>
                          </div>
                          <p className="count">
                            {item.products_count} Products
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <EmptyResponse message="No Collection Available" />
                  )
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="displayList">
              {/* <InputField
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                placeholder="Search"
                containerClass="search_field"
                suffix={<SearchIcon />}
              /> */}

              {/* {data && data?.tags?.length
                ? collectionList.map((item) => {
                    return (
                      <div className="item">
                        <div>
                          {" "}
                          <Checkbox
                            checked={hasMatchingId(selected, item.id)}
                            onChange={() => {
                              updateSelected(item);
                            }}
                          />
                          <p className="name">{item.name}</p>
                        </div>
                        <p className="count">{item.count} Products</p>
                      </div>
                    );
                  })
                : []} */}
            </div>
          </div>

          <div className=" bottom_section">
            <Button type="button" className="cancel" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="button" className="save" onClick={onSubmit}>
              Save{" "}
            </Button>
          </div>
        </div>
      </ModalRight>
    </>
  );
};

import { useState, useEffect } from "react";
import ModalRight from "components/ModalRight";
import {Button } from "@mui/material";
import { ModalRightTitle } from "components/ModalRight/modalRightTitle";
import "./style.scss";
import { FormGroup, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { ILayout } from "Models/customisation";



interface IProp {
  setShowModal: () => void;
  showModal: boolean;
  customiseData: ILayout
  setCustomiseData: (val: ILayout) => void
}

const ProductListing = [
  {
    label: "Latest products first",
    value: "latest_products_first",
    checked: false
  },
  {
    label: "Lowest price to highest price",
    value: "lowest_to_highest_price",
    checked: false
  },
  {
    label: "Highest price to lowest price",
    value: "higher_to_lower_price",
    checked: false
  },
  {
    label: "Products with higher sales to lower sales",
    value: "higher_to_lower_sales",
    checked: false
  },
  {
    label: "Products with lower sales to higher sales",
    value: "lowest_to_highest_sales",
    checked: false
  },
  {
    label: "Random order",
    value: "random_products",
    checked: false
  }
]



const ProductListNotification = ({ setShowModal, showModal, customiseData, setCustomiseData }: IProp) => {
  const [list, setList] = useState(ProductListing)
  const [selectedValue, setSelectedValue] = useState("")

  const handleChange = (index: number) => {
    let newList = [...list]
    newList.map((item, i) => {
      if (i === index) {
        item.checked = true
        setSelectedValue(item.value)
      }
      else {
        item.checked = false
      }
    })
    setList(newList)

  }

  const handleSave = () => {
    let dataValue: ILayout = { ...customiseData }
    dataValue.product_listing = selectedValue
    setCustomiseData(dataValue)
    setShowModal()
  };

  useEffect(() => {
    if (customiseData && customiseData.product_listing) {
      let newList = [...list]
      newList.map((item) => item.value === customiseData?.product_listing ? item.checked = true : item.checked)
      setList(newList)
      setSelectedValue(customiseData?.product_listing)
    }
  }, [customiseData])

  return (
    <div className="product-modal">
      <ModalRight closeModal={setShowModal} openModal={showModal}>
        <div className="modal_right_children">
          <div className="top_section">
            <ModalRightTitle
              className="product-modal__right-title"
              closeModal={setShowModal}
              title="Product Listing"
              extraChild={
                <div>
                  Select the order you want your products displayed on your
                  website.
                </div>
              }
            />

            <div className="product-modal__container">
              <FormGroup>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                >
                  {list.map((item, index) => (
                    <FormControlLabel
                      value={item.value}
                      className={"radio_label"}
                      control={<Radio checked={item.checked} onChange={() => { handleChange(index) }} />}
                      label={item.label}
                      key={index}
                    />
                  ))}
                </RadioGroup>


                </FormGroup>
            </div>
          </div>
          <div className="bottom_section product-modal__footer">
            <div>   
            <Button type="button" className="cancel" onClick={setShowModal}>Cancel</Button>
              <Button type="button" onClick={handleSave} disabled={!selectedValue? true : false} className="save">Save Changes</Button>
            </div>
          </div>
        </div>
      </ModalRight>
    </div>
  );
};

export default ProductListNotification;

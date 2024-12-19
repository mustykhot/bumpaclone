import { ModalHeader } from "pages/Dashboard/Home/Widgets/ModalHeader";
import { Button, IconButton } from "@mui/material";
import "./style.scss";
import { LinkBrokenIcon } from "assets/Icons/LinkBrokenIcon";
import { EditIcon } from "assets/Icons/EditIcon";
import store from "assets/images/store.png";
import product from "assets/images/product-L.png";
import { PhoneIcon } from "assets/Icons/PhoneIcon";
import { GlobeIcon } from "assets/Icons/GlobeIcon";
import { MarkerPinIcon } from "assets/Icons/MarkerPinIcon";

const productList = [
  { name: "Product name", count: 2, price: "£120.84", image: product },
  { name: "Product name", count: 2, price: "£120.84", image: product },
  { name: "Product name", count: 2, price: "£120.84", image: product },
  { name: "Product name", count: 2, price: "£120.84", image: product },
  { name: "Product name", count: 2, price: "£120.84", image: product },
  { name: "Product name", count: 2, price: "£120.84", image: product },
  { name: "Product name", count: 2, price: "£120.84", image: product },
  { name: "Product name", count: 2, price: "£120.84", image: product },
];
export const GoogleBusinessProfile = () => (
  <div className="pd_google_business_profile">
    <ModalHeader
      text="Google My Business Profile"
      button={
        <div className="button_flex">
          <Button
            variant="contained"
            className="disconnect"
            startIcon={<LinkBrokenIcon stroke="#ffffff" />}
          >
            Disconnect
          </Button>
          <Button variant="outlined" startIcon={<EditIcon stroke="#009444" />}>
            Edit Store Details
          </Button>
        </div>
      }
    />

    <div className="profile_container">
      <div className="left_section">
        <div className="details_container">
          <div className="about_store">
            <img src={store} alt="store" />
            <div className="text_box">
              <h3>TheMayor Stock Collections</h3>
              <p>Business Category: Fashion Industry</p>
            </div>
          </div>
          <div className="store_description">
            <h3>Store Description</h3>
            <p>
              Direct repair of aneurysm, pseudoaneurysm, or excision (partial or
              total) and graft insertion, with or without patch graft; for
              aneurysm, pseudoaneurysm, and associated occlusive disease,
              abdominal aorta involving iliac vessels (common, hypogastric,
              external)
            </p>
          </div>
        </div>
        <div className="product_container">
          <div className="title_box">
            <h3>Products displayed on Google (10)</h3>
            <Button>Edit selection</Button>
          </div>
          <div className="product_flex">
            {productList.map((item, i) => (
              <div key={i} className="product_box">
                <div
                  className="image"
                  style={{ backgroundImage: `url(${item.image})` }}
                ></div>
                <div className="text_box">
                  <p className="name">{item.name}</p>
                  <p className="count">{item.count} in stock</p>
                  <h5>{item.price}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="right_section">
        <div className="store_container">
          <h3>Store Information</h3>
          <div className="store_details">
            <div className="flex">
              <IconButton className="icon_button_container">
                <PhoneIcon />
              </IconButton>
              <p>08087427344</p>
            </div>{" "}
            <div className="flex">
              <IconButton className="icon_button_container">
                <MarkerPinIcon />
              </IconButton>
              <p>No. 10 Ijaoye Street Jibowu, Lagos State</p>
            </div>{" "}
            <div className="flex">
              <IconButton className="icon_button_container">
                <GlobeIcon stroke="#5C636D" />
              </IconButton>
              <p>themayorstock.bumpa.shop</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

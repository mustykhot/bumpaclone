import { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { useFormContext } from "react-hook-form";
import { RelatedProductModal } from "./relatedProductModal";
import { IndicatorComponent } from "components/IndicatorComponent";
import { Button } from "@mui/material";
import { Toggle } from "components/Toggle";

export type relatedProductType = {
  name: string;
  image: string;
  count: string;
  price: string;
  isPublished: boolean;
  id: string;
  variant?: {
    name: string;
    image: string;
    count: string;
    price: string;
    id: string;
    isPublished: boolean;
  }[];
};

export const demoProduct: relatedProductType[] = [
  {
    name: "Skechers runner",
    count: "20",
    price: "N23,300",
    image:
      "https://ik.imagekit.io/uknntomzctt/Rectangle_386_z5Gwgvq8e.png?ik-sdk-version=javascript-1.4.3&updatedAt=1677689117650",
    isPublished: false,
    id: "1",
  },
  {
    name: "Skechers runner",
    count: "20",
    price: "N23,300",
    image:
      "https://ik.imagekit.io/uknntomzctt/Rectangle_386_z5Gwgvq8e.png?ik-sdk-version=javascript-1.4.3&updatedAt=1677689117650",
    isPublished: true,
    id: "2",
  },
  {
    name: "Skechers runner",
    count: "20",
    price: "N23,300",
    id: "3",
    image:
      "https://ik.imagekit.io/uknntomzctt/Rectangle_386_z5Gwgvq8e.png?ik-sdk-version=javascript-1.4.3&updatedAt=1677689117650",
    isPublished: true,
  },
  {
    name: "Skechers runner",
    count: "20",
    price: "N23,300",
    id: "20",
    image:
      "https://ik.imagekit.io/uknntomzctt/Rectangle_386_z5Gwgvq8e.png?ik-sdk-version=javascript-1.4.3&updatedAt=1677689117650",
    isPublished: true,
    variant: [
      {
        name: "Skechers runner",
        count: "20",
        price: "N23,300",
        image:
          "https://ik.imagekit.io/uknntomzctt/Rectangle_386_z5Gwgvq8e.png?ik-sdk-version=javascript-1.4.3&updatedAt=1677689117650",
        isPublished: true,
        id: "4",
      },
      {
        name: "Skechers runner",
        count: "20",
        price: "N23,300",
        image:
          "https://ik.imagekit.io/uknntomzctt/Rectangle_386_z5Gwgvq8e.png?ik-sdk-version=javascript-1.4.3&updatedAt=1677689117650",
        isPublished: true,
        id: "5",
      },
      {
        name: "Skechers runner",
        count: "20",
        price: "N23,300",
        id: "6",
        image:
          "https://ik.imagekit.io/uknntomzctt/Rectangle_386_z5Gwgvq8e.png?ik-sdk-version=javascript-1.4.3&updatedAt=1677689117650",
        isPublished: true,
      },
    ],
  },
];

export const RelatedProduct = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [relatedProduct, setRelatedProduct] = useState<string[]>([]);
  const [relatedProductsSelected, setRelatedProductSelected] = useState<
    relatedProductType[]
  >([]);
  const { setValue } = useFormContext();

  const handleChange = (checked?: boolean) => {
    if (checked === true || checked === false) {
      setExpanded(checked);
    } else {
      setExpanded(!expanded);
    }
    if (checked === false && !relatedProduct.length) {
      setOpenModal(true);
    }
  };

  useEffect(() => {
    if (relatedProduct.length) {
      let filtered = demoProduct.filter((item) => {
        if (item.variant) {
          return false;
        } else {
          return relatedProduct?.includes(item.id);
        }
      });
      setRelatedProductSelected(filtered);
    }
  }, [relatedProduct]);

  useEffect(() => {
    setValue("relatedProducts", relatedProduct);
  }, [relatedProduct, setValue]);

  return (
    <div className="extra_sections">
      <RelatedProductModal
        setRelatedProduct={setRelatedProduct}
        relatedProduct={relatedProduct}
        openModal={openModal}
        closeModal={() => {
          setOpenModal(false);
        }}
      />

      <Accordion
        className="accordion"
        expanded={expanded}
        onChange={() => {
          handleChange();
        }}
      >
        <AccordionSummary
          className="accordion_summary"
          expandIcon={<Toggle toggled={expanded} handlelick={handleChange} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className="flex items-center">
            <p>Related Products</p>
            <IndicatorComponent hover={true} text={"hello"} />
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="related_products_container">
            {relatedProductsSelected.map((product) => {
              return (
                <div className="single_product" key={product.id}>
                  <img src={product.image} alt="product" />
                  <div className="text_box">
                    <p className="name">{product.name}</p>
                    <p className="price">{product.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            variant="outlined"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Edit selections
          </Button>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

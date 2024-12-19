import "./style.scss";
import { AddProductForm } from "../AddProduct";

type CretaeProductProps = {};

export const CretaeProduct = ({}: CretaeProductProps) => (
  <div className="pd_create_product">
    <AddProductForm />
  </div>
);

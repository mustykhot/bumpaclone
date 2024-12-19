import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { TrashIcon } from "assets/Icons/TrashIcon";
import SearchSelect from "components/forms/SearchSelect";
import { SwitchComponent } from "components/SwitchComponent";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import SectionTitle from "../section-title";
import { useGetProductQuery } from "services";
import {
  selectThemeConfigData,
  setThemeConfigData,
} from "store/slice/ThemeSlice";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import { CONFIG_KEYS } from "utils/constants/general";

const ProductsHighlight = () => {
  const dispatch = useAppDispatch();
  const themeConfigData = useAppSelector(selectThemeConfigData);
  const [categorise, setCategorise] = useState(false);
  const [featureProducts, setFeatureProducts] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<
    {
      label: string;
      value: string;
      name: string;
    }[]
  >([]);
  const [randomise, setRandomise] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { data, isLoading, isFetching } = useGetProductQuery({
    search: searchValue,
  });

  const updateHighlight = (key: string, data: any) => {
    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.productsHighlight]: {
          ...themeConfigData?.products_highlight,
          [key]: data,
        },
      })
    );
  };

  const addToFeatured = (selected: any) => {
    let filtered: any = selected;
    filtered = JSON.parse(filtered?.info);
    const data = [...featuredProducts, filtered];
    setFeaturedProducts(data);
    updateHighlight("featured_products", data);
  };

  const removeFromFeatured = (index: number) => {
    const products = [...featuredProducts];
    if (index > -1) {
      products.splice(index, 1);
    }
    setFeaturedProducts(products);
    updateHighlight("featured_products", products);
  };

  useEffect(() => {
    if (themeConfigData) {
      setCategorise(themeConfigData?.products_highlight?.categorise);
      setFeatureProducts(
        themeConfigData?.products_highlight?.featured_products?.length > 0
          ? true
          : false
      );
      setFeaturedProducts(
        themeConfigData?.products_highlight?.featured_products || []
      );
      setRandomise(themeConfigData?.products_highlight?.randomise);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeConfigData]);

  return (
    <div className="section">
      <FormSectionHeader title="PRODUCTS HIGHLIGHT" />

      <div className="section_content">
        <div className="categorise_products_highlight">
          <SectionTitle
            title="Categorise Products"
            desc="This arranges your products highlight in categories like Featured, Best sellers, Discounted, etc."
          />
          <SwitchComponent
            checked={categorise}
            onChange={() => {
              setCategorise(!categorise);
              updateHighlight("categorise", !categorise);
            }}
          />
        </div>
      </div>

      <div className="section_content">
        <div className="featured_products">
          <div className="d_flex">
            <SectionTitle
              title="Featured Products"
              desc="Toggle to select up to 8 products to be featured on the highlight."
            />

            <SwitchComponent
              checked={featureProducts}
              onChange={() => {
                setFeatureProducts(!featureProducts);
              }}
            />
          </div>

          {featureProducts && (
            <>
              <div className="list">
                {featuredProducts?.map((item, index) => (
                  <div key={index} className="item">
                    <p className="title">{item?.name}</p>

                    <IconButton
                      className="icon p-0"
                      onClick={() => removeFromFeatured(index)}
                    >
                      <TrashIcon stroke="#d90429" />
                    </IconButton>
                  </div>
                ))}
              </div>

              {featuredProducts?.length < 8 && (
                <SearchSelect
                  placeholder="Select product..."
                  defaultValue={null}
                  onChange={(value) => addToFeatured(value)}
                  onInputChange={(value) => setSearchValue(value)}
                  options={
                    data
                      ? data?.products?.data
                          ?.map((item: any) => ({
                            label: item?.name,
                            value: item?.id,
                            info: JSON.stringify(item),
                          }))
                          ?.filter((opt: any) =>
                            featuredProducts.every(
                              (pro: any) => pro?.name !== opt?.label
                            )
                          )
                      : []
                  }
                  isLoading={isLoading || isFetching}
                />
              )}
            </>
          )}
        </div>
      </div>

      <div className="section_content">
        <div className="randomise_order">
          <SectionTitle
            title="Randomise Order"
            desc="This displays the products in the highlight in a random order."
          />
          <SwitchComponent
            checked={randomise}
            onChange={() => {
              setRandomise(!randomise);
              updateHighlight("randomise", !randomise);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsHighlight;

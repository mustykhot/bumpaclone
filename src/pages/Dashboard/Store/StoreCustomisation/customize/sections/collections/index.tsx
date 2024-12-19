import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { TrashIcon } from "assets/Icons/TrashIcon";
import { FormSectionHeader } from "pages/Dashboard/Products/AddProduct/widget/FormSectionHeader";
import SectionTitle from "../section-title";
import NormalSelectField from "components/forms/NormalSelectField";
import { useAppDispatch, useAppSelector } from "store/store.hooks";
import {
  selectThemeConfigData,
  setThemeConfigData,
} from "store/slice/ThemeSlice";
import { CONFIG_KEYS } from "utils/constants/general";
import { AnyObject } from "Models";
import { useGetCollectionsQuery } from "services";
import { findFontOption } from "utils";

const FeaturedCollections = () => {
  const dispatch = useAppDispatch();
  const themeConfigData = useAppSelector(selectThemeConfigData);
  const [featuredCollections, setFeaturedCollections] = useState<AnyObject[]>(
    []
  );
  const {
    data: collectionData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetCollectionsQuery({ search: "" });

  useEffect(() => {
    if (themeConfigData) {
      setFeaturedCollections(themeConfigData?.featured_collections || []);
    }
  }, [themeConfigData]);

  const addToFeatured = (selected: any) => {
    let collectionObj = findFontOption(
      selected,
      collectionData?.tags?.map((item: any) => ({
        value: item?.tag,
        ...item,
      }))
    );
    let filtered: any = collectionObj;
    delete filtered?.value;
    const data = [...featuredCollections, filtered];
    setFeaturedCollections(data);
    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.featuredCollections]: data,
      })
    );
  };

  const removeFromFeatured = (index: number) => {
    const collections = [...featuredCollections];

    if (index > -1) {
      collections.splice(index, 1);
    }

    setFeaturedCollections(collections);
    dispatch(
      setThemeConfigData({
        ...themeConfigData,
        [CONFIG_KEYS.featuredCollections]: collections,
      })
    );
  };

  const selectOptions = collectionData?.tags
    ?.map((item: any) => ({
      key: item?.tag,
      value: item?.tag,
    }))
    ?.filter((opt: any) =>
      featuredCollections.every((col: any) => col.tag !== opt.value)
    );

  return (
    <div className="section">
      <FormSectionHeader title="FEATURED COLLECTIONS" />

      <div className="section_content">
        <SectionTitle
          title="Product Collections"
          desc="Select up to 6 product collections to be randomly featured across your website."
        />

        <div className="featured_collections">
          <div className="list">
            {featuredCollections?.map((item, index) => (
              <div key={index} className="item">
                <p className="title">{item?.tag}</p>

                <IconButton
                  className="icon"
                  onClick={() => removeFromFeatured(index)}
                >
                  <TrashIcon stroke="#d90429" />
                </IconButton>
              </div>
            ))}
          </div>

          {featuredCollections?.length < 6 && (
            <NormalSelectField
              name="collection"
              isLoading={isLoading || isFetching}
              placeholder="Select collection..."
              selectOption={selectOptions || []}
              handleCustomChange={(e) => {
                addToFeatured(e.target.value);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCollections;

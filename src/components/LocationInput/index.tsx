import { CircularProgress } from "@mui/material";
import { MapIcon } from "assets/Icons/MapIcon";
import InputField from "components/forms/InputField";
import { useState } from "react";
import "./style.scss";
import { showToast } from "store/store.hooks";

const LocationInput = ({ setValue }: { setValue: (value: any) => void }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const handleSearchLocation = async (value: string) => {
    if (value) {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&key=${
            import.meta.env.VITE_REACT_APP_BUMPA_API_KEY
          }`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        console.log(data, "dataa");
      } catch (error) {
        setIsLoading(false);
        showToast("Something went wrong", "error");
      }
    }
  };

  return (
    <div className="pd_location_input">
      <InputField
        label="Location"
        placeholder="Search location"
        value={searchValue}
        onChange={(e) => {
          // setSearchValue(e.target.value);
          handleSearchLocation(e.target.value);
        }}
        suffix={
          isLoading && (
            <CircularProgress size="1.5rem" sx={{ color: "#009444" }} />
          )
        }
      />
      {searchResult.length ? (
        <div className="show_search_result">
          {[1, 2, 3].map((item) => (
            <div className="single_search">
              <MapIcon />
              <p>16 Amaechi Onuoha Cres, Ikate, Lagos 106104, Lagos</p>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default LocationInput;

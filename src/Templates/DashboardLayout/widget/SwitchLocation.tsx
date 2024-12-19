import { Button } from "@mui/material";
import { PrimaryFillIcon } from "assets/Icons/PrimaryFillIcon";
import DropDownWrapper from "components/DropDownWrapper";
import Loader from "components/Loader";
import { useGetUserLocationsQuery, useSwitchLocationMutation } from "services";
import { selectUserLocation, setUserLocation } from "store/slice/AuthSlice";
import { showToast, useAppDispatch, useAppSelector } from "store/store.hooks";
import { handleError } from "utils";

const SwitchLocation = () => {
  const {
    data: userLocationData,
    isLoading: loadLocation,
    isFetching: isFetchingLocatio,
    isError: isErrorLocation,
  } = useGetUserLocationsQuery();
  const dispatch = useAppDispatch();
  const userLocation = useAppSelector(selectUserLocation);
  const [switchLocation, { isLoading: switchLoading }] =
    useSwitchLocationMutation();
  const switchlocationFnc = async (item: any) => {
    try {
      let result = await switchLocation(item.id);
      if ("data" in result) {
        showToast("Location Switched successfully", "success");
        dispatch(
          setUserLocation({
            ...item,
            name: item.name,
            id: item.id,
          })
        );
      } else {
        handleError(result);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      {switchLoading && <Loader />}

      {userLocationData?.data?.assigned_locations?.length ? (
        <DropDownWrapper
          origin="left"
          className="navbar_dropdown location_picker"
          closeOnChildClick
          action={
            <Button className="pick_location_btn" endIcon={<PrimaryFillIcon />}>
              Location: <span> {userLocation?.name} </span>
            </Button>
          }
        >
          <div className="cover_buttons">
            <ul className="select_list btn_list">
              {userLocationData?.data?.assigned_locations?.map((item: any) => (
                <li key={item.id}>
                  <Button
                    className="mobile_location_btn"
                    onClick={() => {
                      switchlocationFnc({
                        name: item.name,
                        id: item.id,
                      });
                    }}
                  >
                    {item.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </DropDownWrapper>
      ) : (
        ""
      )}
    </>
  );
};

export default SwitchLocation;

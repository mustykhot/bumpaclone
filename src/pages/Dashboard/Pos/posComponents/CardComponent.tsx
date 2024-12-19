import "../style.scss";
import { Button, FormControl, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { IMAGEURL } from "utils/constants/general";
import { formatPrice, truncateString } from "utils";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

type Props = {
  id?: any;
  name?: string;
  price?: number | string;
  open?: boolean;
  // setOpen?: React.Dispatch<React.SetStateAction<boolean>>,
  setOpen?: any;
  products?: any;
  options?: {
    [key: string]: string[];
  };
};
interface SelectedOptions {
  [key: number]: { [key: string]: string };
}

export type orderFields = {
  // added_options: any;
  // product: any;
  myOptions: any;
};

const CardComponent = (props: Props) => {
  const [option, setOption] = useState<any>("");
  const [activeCard, setActiveCard] = useState(null);
  const [close, setClose] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value);
  };

  const handleCardClick = (id: any) => {
    props.setOpen(true);
    setActiveCard(id);
  };

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

  const handleSelectChange = (
    productId: number,
    optionType: string,
    selectedValue: string
  ) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [productId]: {
        ...prevState[productId],
        [optionType]: selectedValue,
      },
    }));
    // setSelectedOptions((prevState) => ({
    //   ...prevState,
    //   [options]: {
    //     ...prevState[options],
    //     [optionType]: selectedValue,
    //   },
    // }));
  };
  const handleForm = () => {
    setSelectedOptions([]);
    setClose(true);
    const optionsToSend: { productId: string; [key: string]: string }[] = [];

    Object.entries(selectedOptions).forEach(([productId, options]) => {
      const productOptions: { productId: string; [key: string]: string } = {
        productId: String(productId),
      };

      Object.entries(options).forEach(([optionType, selectedValue]) => {
        productOptions[optionType] = selectedValue as string;
      });

      optionsToSend.push(productOptions);
    });
    setValue("myOptions", optionsToSend);
  };

  // close card when close is treu
  useEffect(() => {
    if (close) {
      props.setOpen(false);
      setActiveCard(null);
    }
  }, [close]);
  // close card when active card is null
  useEffect(() => {
    if (!activeCard) {
      setClose(false);
    }
  }, [activeCard]);

  const methods = useForm<orderFields>({
    mode: "all",
  });
  const {
    formState: { isValid },
    handleSubmit,
    setValue,
  } = methods;

  const onSubmit: SubmitHandler<orderFields> = (data) => {};
  return (
    <FormProvider {...methods}>
      {props.products.map((item: any, i: any) => (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            key={i}
            id={item.id}
            className={
              activeCard && activeCard !== item.id
                ? "p_card overlay_card"
                : activeCard && activeCard === item.id
                ? "p_card card_open"
                : "p_card"
            }
            onClick={() => {
              handleCardClick(item.id);
              // setValue("product", item.id)
            }}
          >
            <div className="img_container">
              <img src={`${IMAGEURL}${item.image}`} alt="item" />
            </div>
            <div className="p_details">
              <p className="p_name">{item.name}</p>
              <p className="p_price">{formatPrice(Number(item.price))}</p>
            </div>
            {props.open && activeCard && item.id === activeCard && (
              <div
                className={
                  item.options.length >= 2
                    ? "variation"
                    : item.options.length === 1
                    ? "variation one_option"
                    : "variation no_options"
                }
              >
                <FormControl sx={{ m: 1, minWidth: "100%", margin: 0 }}>
                  {item.options.map((option: any) => (
                    <Select
                      key={option.name}
                      value={
                        selectedOptions[item.id]?.[option.name]
                          ? selectedOptions[item.id]?.[option.name]
                          : option.name
                      }
                      onChange={(event) => {
                        handleSelectChange(
                          item.id,
                          option.name,
                          event.target.value as string
                        );
                      }}
                      displayEmpty
                      renderValue={(value) => (value ? value : option.name)}
                      inputProps={{ "aria-label": "Without label" }}
                      size="small"
                      className="pos_select"
                    >
                      {option.values.map((value: any) => (
                        <MenuItem key={value} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  ))}
                  <div className="cart_btn mt-2">
                    <Button
                      variant="contained"
                      className="w-full"
                      type="submit"
                      onClick={() => {
                        handleForm();
                        // setValue("added_options", selectedOptions)
                      }}
                    >
                      Add To Cart
                    </Button>
                  </div>
                </FormControl>
              </div>
            )}
          </div>
        </form>
      ))}
    </FormProvider>
  );
};

export default CardComponent;

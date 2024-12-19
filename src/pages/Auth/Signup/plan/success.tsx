import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import { Button } from "@mui/material";
import "./style.scss";
import EmptyResponse from "components/EmptyResponse";
import { CheckCircleBrokenIcon } from "assets/Icons/CheckCircleBrokenIcon";
import { HardDriveIcon } from "assets/Icons/HardDriveIcon";
import { LocationIcon } from "assets/Icons/LocationIcon";
import { UserCircleIcon } from "assets/Icons/UserCircleIcon";
import animationData from "assets/images/confetti.json";
import confetti from "assets/images/confetti.png";

export const Success = () => {
  const [play, setPlay] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const plan = queryParams.get("plan");
  const type = queryParams.get("type");

  const successOptions = {
    loop: 2,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const benefits = [
    {
      icon: LocationIcon,
      benefit1: "Manage up to 2 locations",
      benefit2: "Move & duplicate inventory",
    },
    {
      icon: UserCircleIcon,
      benefit1: "Manage up to 5 staff",
      benefit2: "Total control of your staff",
    },
    {
      stroke: "#009444",
      strokeWidth: 1,
      icon: HardDriveIcon,
      benefit1: "Point of sale",
      benefit2: "Print & scan barcode",
    },
  ];

  const getNavigationLink = (type: string) => {
    switch (type) {
      case "theme":
        return {
          link: "/dashboard/customisation",
          title: "Theme Purchase Succesful",
          description:
            "Kindly click the button to proceed to the customization page, where you can activate and customize your theme",
        };
      case "credit":
        return {
          link: "/dashboard/campaigns",
          title: "Messaging Credits Purchased Successfully.",
          description: "Send more messaging campaigns without stress!",
        };
      default:
        return {
          link: "/dashboard",
          title: "Welcome to Bumpa",
          description:
            "You are on your way to managing your business like a pro.",
        };
    }
  };

  useEffect(() => {
    setPlay(true);
  }, []);

  return (
    <div className="pd_successpayment">
      {play && (
        <div className="lottie_absolute_div">
          <Lottie
            isStopped={!play}
            options={successOptions}
            height={"100%"}
            width={"100%"}
          />
        </div>
      )}
      {plan === "growth" ? (
        <div className="growthsuccess">
          <CheckCircleBrokenIcon className="icon" />
          <h3 className="growthsuccess__text">Payment Successful</h3>
          <div className="growthsuccess__box">
            <h2 className="growthsuccess__box--title">
              Welcome to Bumpa Growth
            </h2>
            <p className="growthsuccess__box--desc">
              You can now make use of these tools to run your business more
              efficiently
            </p>
            <div className="growthsuccess__benefits">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="growthsuccess__benefits--each">
                    <IconComponent
                      className="benefit-icon"
                      stroke={benefit.stroke}
                      strokeWidth={benefit.strokeWidth}
                    />
                    <p>{benefit.benefit1}</p>
                    <p>{benefit.benefit2}</p>
                  </div>
                );
              })}
            </div>
            <p className="growthsuccess__box--more">
              and you can do so much more
            </p>
          </div>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/dashboard?fromGrowth=true");
            }}
            className="primary_styled_button"
          >
            Continue
          </Button>
        </div>
      ) : (
        <EmptyResponse
          message={getNavigationLink(type || "").title}
          image={confetti}
          extraText={getNavigationLink(type || "").description}
          btn={
            <Button
              variant="contained"
              onClick={() => {
                navigate(getNavigationLink(type || "").link);
              }}
              className="primary_styled_button"
            >
              Continue
            </Button>
          }
        />
      )}
    </div>
  );
};

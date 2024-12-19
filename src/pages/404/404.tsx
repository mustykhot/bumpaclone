import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SentimentDissatisfiedSharpIcon from "@mui/icons-material/SentimentDissatisfiedSharp";
import { Button } from "@mui/material";
import { LogoIcon } from "assets/Icons/LogoIcon";
import { useGetUser } from "hooks/getUserHook";
import "./style.scss";
import DashboardMenuLinks, {
  StoreMenuLinks,
} from "Templates/DashboardLayout/Sidebar/menuLinks";

const checkRouteMatch = (route: string): boolean => {
  const isStoreRoute = route.startsWith("/dashboard/store");

  if (isStoreRoute) {
    return StoreMenuLinks.some((menuItem) => {
      if (menuItem.link && route === `/dashboard/${menuItem.link}`) {
        return true;
      }

      if (menuItem.isSubmenu && menuItem.submenu) {
        return menuItem.submenu.some(
          (subMenuItem) => route === `/dashboard/${subMenuItem.link}`
        );
      }

      return false;
    });
  }

  return DashboardMenuLinks.some((menuItem) => {
    if (menuItem.link && route === `/dashboard/${menuItem.link}`) {
      return true;
    }

    if (menuItem.isSubmenu && menuItem.submenu) {
      return menuItem.submenu.some(
        (subMenuItem) => route === `/dashboard/${subMenuItem.link}`
      );
    }

    return false;
  });
};

const NotFound = () => {
  const navigate = useNavigate();
  let location = useLocation();
  const { isLoggedIn } = useGetUser();
  const reRouteUser = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate(
        `/login?${
          checkRouteMatch(location.pathname)
            ? `redirectTo=${location.pathname}`
            : ""
        }  `
      );
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      reRouteUser();
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, []);
  return (
    <div className="pd_not_found">
      <div className="inner">
        <LogoIcon className="logo" />
        <div className="content">
          <div className="title_box">
            <p>404</p>
            <SentimentDissatisfiedSharpIcon
              sx={{ mb: 1 }}
              color="primary"
            />{" "}
          </div>
          <br />
          <p>
            {isLoggedIn
              ? "We are very sorry for the inconvenience, it looks like the page you are trying to access is broken or never existed"
              : "We are very sorry for the inconvenience, it looks like are not logged in, click the button below to proceed to login page"}
          </p>
          <br />
          <Button
            className="go-home-btn"
            variant="contained"
            onClick={() => {
              reRouteUser();
            }}
          >
            Go Home
          </Button>
        </div>
        <div className="footer">&copy; {new Date().getFullYear()} Bumpa</div>
      </div>
    </div>
  );
};

export default NotFound;

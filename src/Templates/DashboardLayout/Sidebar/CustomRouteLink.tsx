import {
  MutableRefObject,
  ReactNode,
  useRef,
  useState,
  useEffect,
} from "react";
import { Link, To, useLocation, useMatch, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { OPACITYVARIANT } from "utils/constants/general";
import { useAppSelector } from "store/store.hooks";
import { selectIsLoggedIn } from "store/slice/AuthSlice";

export type CustomLinkProps = {
  to?: To;
  active?: boolean;
  activeMenu?: string;
  isSubmenu?: boolean;
  submenu?: {
    name: string;
    link: To | any;
  }[];
  baseUrl?: string;
  children: ReactNode;
  onClick?: Function;
  isCollapseNavigation?: boolean;
  setIsCollapseNavigation?: (value: boolean) => void;
  setIsMobileNavigationOpen?: (value: boolean) => void;
  asideRef?: MutableRefObject<HTMLDivElement>;
};
// custom link wrapper using the useMatch to determine the active side menu
export default function CustomLink({
  children,
  to,
  baseUrl = "/dashboard",
  active,
  isSubmenu = false,
  submenu,
  isCollapseNavigation,
  setIsCollapseNavigation,
  setIsMobileNavigationOpen,
  activeMenu,
  asideRef,
  onClick = () => {},
  ...props
}: CustomLinkProps) {
  let match = useMatch(to !== baseUrl ? baseUrl + "/" + to + "/*" : baseUrl);
  const [isSubMenuOpen, setisSubMenuOpen] = useState(false);
  const isLoggedInAsPro = useAppSelector(selectIsLoggedIn);
  const [showDropDown, setshowDropDown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (showDropDown && ref.current && !ref.current.contains(e.target)) {
        setshowDropDown(false);
      }
    };
    document.addEventListener("click", checkIfClickedOutside);
    return () => {
      document.removeEventListener("click", checkIfClickedOutside);
    };
  }, [showDropDown]);

  return to ? (
    <Link
      className={`menu-link hover:bg-[#F9FBFF]  ${
        !isSubmenu && match ? "active" : ""
      } ${isSubmenu && match && "text-primary"}`}
      to={isLoggedInAsPro ? to || "" : "/dashboard/account-status"}
      {...props}
      onClick={() => {
        setIsMobileNavigationOpen && setIsMobileNavigationOpen(false);
      }}
    >
      <div className="children_container">{children}</div>
    </Link>
  ) : (
    <div
      ref={ref}
      onClick={() => {
        if (isCollapseNavigation) {
          setIsCollapseNavigation && setIsCollapseNavigation(false);
          setshowDropDown(true);
        }
      }}
      className={`menu-link wrapper-container ${active ? " active" : ""}`}
      {...props}
    >
      <div
        onClick={() => {
          setisSubMenuOpen(!isSubMenuOpen);
          navigate(
            isLoggedInAsPro ? `${activeMenu}` : "/dashboard/account-status"
          );
          setIsMobileNavigationOpen &&
            !isSubmenu &&
            setIsMobileNavigationOpen(false);
        }}
        className={`children_container sub_menu ${
          isSubMenuOpen ? "active" : ""
        }`}
      >
        {children}
      </div>
      <AnimatePresence>
        {isSubmenu && isSubMenuOpen && (
          <motion.ul
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ type: "just" }}
            className={`submenu`}
          >
            {submenu?.map((el) => (
              <>
                {!isCollapseNavigation && (
                  <motion.li
                    variants={OPACITYVARIANT}
                    initial="init"
                    animate="visible"
                    exit="init"
                    className={`submenu_item ${
                      location.pathname.slice(11) === el.link
                        ? "submenu-active"
                        : ""
                    }`}
                    key={el.name}
                  >
                    <Link
                      onClick={() => {
                        setIsMobileNavigationOpen &&
                          setIsMobileNavigationOpen(false);
                      }}
                      to={
                        isLoggedInAsPro ? el.link : "/dashboard/account-status"
                      }
                    >
                      <span>{el.name}</span>
                    </Link>
                  </motion.li>
                )}
              </>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { useRenewPlanMutation, useGetStoreInformationQuery } from "services";
import { useAppSelector } from "store/store.hooks";
import { selectStoreId } from "store/slice/AuthSlice";
import { handleError } from "utils";
import { getObjWithValidValues, REDIRECT_URL } from "utils/constants/general";
import Button from "@mui/material/Button";
import { selectIsSubscriptionType } from "store/slice/AuthSlice";

type RenewButtonProps = {
  className?: string;
  startIcon?: React.ReactNode;
  variant?: "text" | "outlined" | "contained";
};

const RenewButton: React.FC<RenewButtonProps> = ({
  className,
  startIcon,
  variant = "text",
}) => {
  const store_id = useAppSelector(selectStoreId);
  const { data: storeData } = useGetStoreInformationQuery();
  const current_plan_id = storeData?.store.subscription?.[0]?.plan?.id;
  const current_plan_slug = storeData?.store.subscription?.[0]?.plan?.slug;
  const isSubscriptionType = useAppSelector(selectIsSubscriptionType);

  const [renew, { isLoading: isRenewLoading }] = useRenewPlanMutation();
  const navigate = useNavigate();

  const onRenew = async () => {
    navigate(
      `/dashboard/subscription/select-plan?type=renew&slug=${isSubscriptionType}`
    );
  };

  return (
    <Button
      onClick={onRenew}
      disabled={isRenewLoading}
      className={className}
      variant={variant}
      startIcon={startIcon}
    >
      Renew Subscription
    </Button>
  );
};

export default RenewButton;

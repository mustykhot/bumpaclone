import { Button } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import "./style.scss";
import { ExportIcon } from "assets/Icons/ExportIcon";
import Loader from "components/Loader";
import { useGetPlansQuery } from "services";
import { SectionTitle } from "../widget/SectionTitle";
import ComparePlansModal from "../widget/ComparePlans";
import { ColumnSinglePlanComponent } from "../widget/PlanComponents/ColumnSinglePlanComponent";

type PlanInfoProps = {
  display: string;
  handleSubmit: (data: any) => void;
  isSubmitLoading: boolean;
  recommendedPlan: string;
};

export const PlanInfo = ({
  display,
  handleSubmit,
  isSubmitLoading,
  recommendedPlan,
}: PlanInfoProps) => {
  const { data, isLoading } = useGetPlansQuery();
  const { setValue, getValues } = useFormContext();
  const [openModal, setOpenModal] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handlePlanSelection = (plan: any) => {
    setLoadingPlan(plan.slug);
    setValue("plan", plan.slug);
    if (plan.slug === "starter") {
      setValue("planId", data?.data.starter[0]?.id);
    }
    if (plan.slug === "pro") {
      setValue("planId", data?.data.pro[0]?.id);
    }
    if (plan.slug === "growth") {
      setValue("planId", data?.data.growth[0]?.id);
    }
    handleSubmit(getValues());
  };

  return (
    <div className={`${display} pd_formsection`}>
      <SectionTitle
        title="One more thing..."
        description="What subscription plan has features that suit your business needs?"
        extraDesc="NB: Ticking any of this does not initiate payment."
        pre
      />
      <ComparePlansModal
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
      />
      {isLoading && <Loader />}
      <div className="plan_section">
        <div className="title_container">
          <Button
            onClick={() => {
              setOpenModal(true);
            }}
            variant="outlined"
            type="button"
            startIcon={<ExportIcon />}
          >
            Compare Plans
          </Button>
        </div>
        <div className="select_plan">
          {data && (
            <>
              <ColumnSinglePlanComponent
                item={data?.data.starter[0]}
                setSelectedPlan={handlePlanSelection}
                isLoading={
                  isSubmitLoading && loadingPlan === data?.data.starter[0].slug
                }
                recommendedPlan={recommendedPlan}
              />
              <ColumnSinglePlanComponent
                item={data?.data.pro[0]}
                setSelectedPlan={handlePlanSelection}
                isLoading={
                  isSubmitLoading && loadingPlan === data?.data.pro[0].slug
                }
                recommendedPlan={recommendedPlan}
              />
              <ColumnSinglePlanComponent
                item={data?.data.growth[1]}
                setSelectedPlan={handlePlanSelection}
                isLoading={
                  isSubmitLoading && loadingPlan === data?.data.growth[1].slug
                }
                recommendedPlan={recommendedPlan}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

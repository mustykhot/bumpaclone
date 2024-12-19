import { LineChartCard } from "components/LineChartCard";
import "./style.scss";
import { useSalesAnalyticsQuery } from "services";
import moment from "moment";
import ErrorMsg from "components/ErrorMsg";
import Loader from "components/Loader";
import { LineMainChartCard } from "components/LineMainChartCard";
type CampaignAnalyticsProps = {
  dateRange: any | null;
  selectedCompareDate: any | null;
};

export const CampaignAnalytics = ({
  dateRange,
  selectedCompareDate,
}: CampaignAnalyticsProps) => {
  return (
    <>
      <div className="pd_campaign_analytics">
        <LineMainChartCard
          dataset="total_campaigns"
          type="campaigns"
          dateRange={dateRange}
          selectedCompareDate={selectedCompareDate}
          fileName="Total-Campaigns"
        />

        <LineMainChartCard
          dataset="sent_campaigns"
          type="campaigns"
          dateRange={dateRange}
          selectedCompareDate={selectedCompareDate}
          fileName="Sent-Campaigns"
        />
        <LineMainChartCard
          dataset="email_campaigns"
          type="campaigns"
          dateRange={dateRange}
          fileName="Email-Campaigns"
          selectedCompareDate={selectedCompareDate}
        />
        <LineMainChartCard
          dataset="sms_campaigns"
          type="campaigns"
          fileName="Sms-Campaigns"
          dateRange={dateRange}
          selectedCompareDate={selectedCompareDate}
        />
        <LineMainChartCard
          dataset="failed_email_campaigns"
          fileName="Failed-Email-Campaigns"
          type="campaigns"
          dateRange={dateRange}
          selectedCompareDate={selectedCompareDate}
        />
        <LineMainChartCard
          dataset="failed_sms_campaigns"
          fileName="Failed-Sms-Campaigns"
          type="campaigns"
          dateRange={dateRange}
          selectedCompareDate={selectedCompareDate}
        />
      </div>
    </>
  );
};

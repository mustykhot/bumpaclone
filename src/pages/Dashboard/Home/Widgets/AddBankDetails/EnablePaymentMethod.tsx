import { Button } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import paystack from "assets/images/paystack2.png";
import { SwitchComponent } from "components/SwitchComponent";

type EnablePaymentMethodProps = {
  display: string;
  handleSubmitStep2: () => void;
};

const EnablePaymentMethod = ({
  display,
  handleSubmitStep2,
}: EnablePaymentMethodProps) => {
  const { control, watch } = useFormContext();

  const understandTermsChecked = watch("understand_terms");

  return (
    <div className={`${display} pd_formsection pd_paymentMethod`}>
      <div className="payment_method_container">
        <div className="payment_method_container_title">
          <div className="icon_text">
            <img src={paystack} alt="Paystack" />
            <p>Online Payment Gateway</p>
          </div>
        </div>
        <p className="payment_method_container_text">
          This allows you to receive payments via Paystack on your website. You
          can add other payment methods later.
        </p>
        <div className="payment_method_modal_listContainer">
          <h3>How Online Payments Work on Bumpa</h3>
          <ul>
            <li>Confirms payment in 30 seconds.</li>
            <li>
              Has five payment options: Bank Transfer, Card, QR Code, USSD.
            </li>
            <li>It shows a Bumpa-Paystack account on your website.</li>
            <li>Automatically records the sale once payment is made.</li>
            <li>Comes with a 1.5% transaction charge. </li>
            <li>Receive the payment in your account in less than 24 hours.</li>
          </ul>
        </div>
        <div className="payment_method_modal_switchContainer">
          <div className="payment_method_modal_switchEach">
            <p>Allow customer to pay transaction charges</p>
            <Controller
              name="charge_customer"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <SwitchComponent
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <div className="payment_method_modal_switchEach">
            <p>
              I understand & accept the terms listed above for using Paystack.
            </p>
            <Controller
              name="understand_terms"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <SwitchComponent
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
        <div className="payment_method_modal_paystack">
          <p>Powered by Paystack</p>
        </div>
        <div className="payment_method_modal_buttonContainer">
          <Button
            variant="contained"
            className="primary_styled_button"
            disabled={!understandTermsChecked}
            onClick={handleSubmitStep2}
          >
            Connect Online Payment Gateway
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnablePaymentMethod;

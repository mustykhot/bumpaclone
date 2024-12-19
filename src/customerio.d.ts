declare var _cio: {
  track: (eventName: string, eventData?: any) => void;
  identify: (userData: {
    id?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    referral?: string;
    cio_subscription_preferences?: string;
    email_verified?: boolean;
    subscription_intent?: string;
    free_trial_activated?: boolean;
    website_launched?: boolean;
    payment_method_added?: boolean;
    store_information_added?: boolean;
    shipping_added?: boolean;
    web_onboarding_complete?: boolean;
    source?: string;
    medium?: string;
  }) => void;
  // Add other methods and properties if needed
};

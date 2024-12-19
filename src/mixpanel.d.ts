declare var mixpanel: {
    track: (eventName: string, eventData?: any) => void;
    identify: (val: string) => void;
    people: {
      set: (property: string, value: any) => void;
    };
    // Add other methods and properties if needed
  };
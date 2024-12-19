import React, { Component, ErrorInfo, ReactNode } from "react";
import ErrorMsg from "./index";


interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error.message);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorMsg error={this.state.error?.message} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

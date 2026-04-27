import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  private reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;

    if (error) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <AlertCircle className="size-16 text-red-500" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-white">
                Something went wrong
              </h1>
              <p className="text-gray-400 text-sm">
                An unexpected error occurred. Try refreshing the page or going
                back to the home page.
              </p>
              {error.message && (
                <p className="text-red-400 text-xs font-mono bg-gray-900 rounded px-3 py-2 mt-3 break-words">
                  {error.message}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={this.reset}>
                Try again
              </Button>
              <Button asChild>
                <a href="/">Go to home</a>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

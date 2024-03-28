import {
  Component,
  cloneElement,
  type ReactNode,
  type ReactElement,
} from "react";

export class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactElement },
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error != null) {
      return cloneElement(this.props.fallback, {
        message: Reflect.get(this.state.error, "message") as string,
      });
    }

    return this.props.children;
  }
}

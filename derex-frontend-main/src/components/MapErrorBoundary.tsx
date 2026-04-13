"use client";

import { Component, ReactNode } from "react";
import { Icon } from "@iconify/react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class MapErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full h-full bg-neutral-100 flex flex-col items-center justify-center text-neutral-500 gap-2">
            <Icon icon="heroicons:exclamation-triangle" width="32" />
            <span className="text-sm">Error al cargar el mapa</span>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

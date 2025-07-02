import { ReactNode } from "react";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="w-full sm:px-6 lg:px-8 max-w-screen-xl mx-auto text-white">
      {children}
    </div>
  );
}

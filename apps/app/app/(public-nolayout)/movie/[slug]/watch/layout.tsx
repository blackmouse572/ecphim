import type { ReactNode } from "react";

type WatchLayoutProperties = {
  readonly children: ReactNode;
};

const WatchLayout = ({ children }: WatchLayoutProperties) => <>{children}</>;

export default WatchLayout;

import type { ReactNode } from "react";
import { Footer } from "@/app/components/footer";

type WatchLayoutProperties = {
  readonly children: ReactNode;
};

const WatchLayout = ({ children }: WatchLayoutProperties) => (
  <>
    {children} <Footer />
  </>
);


export default WatchLayout;

import type { ReactNode } from "react";
import { PublicLayout } from "../components/public-layout";

type RootLayoutProperties = {
	readonly children: ReactNode;
};
const RootLayout = ({ children }: RootLayoutProperties) => (
	<PublicLayout>{children}</PublicLayout>
);
export default RootLayout;

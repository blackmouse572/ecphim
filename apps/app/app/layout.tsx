import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { env } from "@/env";
import "./styles.css";
import { AnalyticsProvider } from "@repo/analytics/provider";
import { DesignSystemProvider } from "@repo/design-system";
import { fonts } from "@repo/design-system/lib/fonts";
import { Toolbar } from "@repo/feature-flags/components/toolbar";
import { createMetadata } from "@repo/seo/metadata";
import type { ReactNode } from "react";

type RootLayoutProperties = {
	readonly children: ReactNode;
};
export const generateMetadata = async () =>
	createMetadata({
		title: "EcPhim - Xem phim online miễn phí",
		category: "Phim Online",
		description:
			"EcPhim là trang web xem phim online miễn phí, chất lượng cao, cập nhật nhanh nhất Thuyết minh, lồng tiếng chất lượng Full HD. Hơn 1000 bộ phim, series, anime, hoạt hình với phụ đề tiếng Việt.",
		keywords: [
			"phim online",
			"xem phim online",
			"phim miễn phí",
			"motchill",
			"rophim",
			"phimmoizz",
			"phim14",
			"phim3s",
			"phim47",
			"phimnet",
			"phu de",
			"netflix",
		],

		openGraph: {
			title: "EcPhim - Xem phim online miễn phí",
			description:
				"EcPhim là trang web xem phim online miễn phí, chất lượng cao, cập nhật nhanh nhất Thuyết minh, lồng tiếng chất lượng Full HD. Hơn 1000 bộ phim, series, anime, hoạt hình với phụ đề tiếng Việt.",
			type: "website",
		},
	});

const RootLayout = ({ children }: RootLayoutProperties) => (
	<html className={fonts} lang="en" suppressHydrationWarning>
		<body>
			<AnalyticsProvider>
				<DesignSystemProvider
					helpUrl={env.NEXT_PUBLIC_DOCS_URL}
					privacyUrl={new URL(
						"/legal/privacy",
						env.NEXT_PUBLIC_WEB_URL,
					).toString()}
					termsUrl={new URL("/legal/terms", env.NEXT_PUBLIC_WEB_URL).toString()}
				>
					<NuqsAdapter>{children}</NuqsAdapter>
				</DesignSystemProvider>
			</AnalyticsProvider>
			<Toolbar />
		</body>
	</html>
);

export default RootLayout;

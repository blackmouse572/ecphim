import {
  MotionFadeIn,
  MotionItem,
  MotionList,
  MotionPage,
} from "@repo/design-system/components/motion";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "./components/header";

const title = "EcPhim";
const description = "Cinematic experience.";

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  return (
    <MotionPage>
      <Header page="Browse" pages={["Movies", "TV Shows"]}>
        <></>
      </Header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <MotionList className="grid auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Link href="/movie/ngoi-truong-xac-song" className="block h-full">
            <MotionItem className="group hover:-translate-y-2 relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-muted/50 shadow-lg ring-1 ring-white/10 transition-all hover:shadow-primary/20 hover:shadow-xl">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <img
                src="https://phimimg.com/upload/vod/20250325-1/6985255433cba78af7f28fe63c5126c9.jpg"
                alt="All of Us Are Dead"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute right-0 bottom-0 left-0 z-20 p-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-primary px-2 py-0.5 font-bold text-[10px] text-black uppercase tracking-wider">
                    Series
                  </span>
                  <span className="font-medium text-white/80 text-xs">
                    2022
                  </span>
                </div>
                <h3 className="mb-1 line-clamp-1 text-headline-sm text-white">
                  Ngôi Trường Xác Sống
                </h3>
                <p className="line-clamp-2 text-caption text-white/60">
                  All of Us Are Dead
                </p>
              </div>
            </MotionItem>
          </Link>

          {/* Mock items for grid */}
          {Array.from({ length: 3 }).map((_, i) => (
            <MotionItem
              key={i}
              className="relative flex aspect-[2/3] items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-muted/20 p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
              <div className="z-10 text-center">
                <div className="mb-2 text-display-sm opacity-10">{i + 2}</div>
                <div className="text-caption text-muted-foreground">
                  Coming Soon
                </div>
              </div>
            </MotionItem>
          ))}
        </MotionList>

        <MotionFadeIn className="mt-8 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent p-1">
          <div className="flex items-center justify-between rounded-xl bg-background/80 p-8 backdrop-blur-sm">
            <div>
              <h3 className="mb-2 text-headline-sm">Premium Experience</h3>
              <p className="max-w-xl text-body text-muted-foreground">
                Enjoy 4K HDR streaming with Dolby Atmos sound. No ads, cancel
                anytime.
              </p>
            </div>
            <button className="rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90">
              Upgrade Now
            </button>
          </div>
        </MotionFadeIn>
      </div>
    </MotionPage>
  );
};

export default App;

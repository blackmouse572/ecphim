import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { env } from "@/env";
import { AvatarStack } from "./components/avatar-stack";
import { Cursors } from "./components/cursors";
import { Header } from "./components/header";
import { MotionPage, MotionList, MotionItem, MotionFadeIn } from "@repo/design-system/components/motion";
import Link from "next/link";

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
            <MotionItem className="group relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-muted/50 shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20 ring-1 ring-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              
              <img 
                src="https://phimimg.com/upload/vod/20250325-1/6985255433cba78af7f28fe63c5126c9.jpg" 
                alt="All of Us Are Dead"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                    Series
                  </span>
                  <span className="text-xs font-medium text-white/80">2022</span>
                </div>
                <h3 className="text-headline-sm text-white mb-1 line-clamp-1">Ngôi Trường Xác Sống</h3>
                <p className="text-caption text-white/60 line-clamp-2">All of Us Are Dead</p>
              </div>
            </MotionItem>
          </Link>
          
          {/* Mock items for grid */}
          {Array.from({ length: 3 }).map((_, i) => (
            <MotionItem key={i} className="aspect-[2/3] rounded-2xl bg-muted/20 border border-white/5 p-6 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
               <div className="text-center z-10">
                 <div className="text-display-sm opacity-10 mb-2">{i + 2}</div>
                 <div className="text-caption text-muted-foreground">Coming Soon</div>
               </div>
            </MotionItem>
          ))}
        </MotionList>
        
        <MotionFadeIn className="mt-8 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent p-1 border border-primary/20">
          <div className="bg-background/80 backdrop-blur-sm rounded-xl p-8 flex items-center justify-between">
            <div>
              <h3 className="text-headline-sm mb-2">Premium Experience</h3>
              <p className="text-body text-muted-foreground max-w-xl">
                Enjoy 4K HDR streaming with Dolby Atmos sound. No ads, cancel anytime.
              </p>
            </div>
            <button className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors">
              Upgrade Now
            </button>
          </div>
        </MotionFadeIn>
      </div>
    </MotionPage>
  );
};

export default App;

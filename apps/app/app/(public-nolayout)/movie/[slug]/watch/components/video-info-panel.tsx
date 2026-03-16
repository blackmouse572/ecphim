"use client";

import Link from "next/link";
import type { ICategory, ICountry } from "@/types/response";

interface VideoInfoPanelProps {
  quality: string;
  language: string;
  duration: string;
  status: string;
  country?: ICountry[];
  category?: ICategory[];
}

export function VideoInfoPanel({
  quality,
  language,
  duration,
  status,
  country,
  category,
}: VideoInfoPanelProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/2 p-6">
      <h4 className="mb-4 font-700 text-title text-white"> Thông tin phim</h4>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Chất lượng:</span>
          <span className="font-mono text-white">{quality}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Ngôn ngữ:</span>
          <span className="font-mono text-white">{language}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Thời lượng:</span>
          <span className="font-mono text-white">{duration}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Trạng thái:</span>
          <span className="font-mono text-green-400 capitalize">{status}</span>
        </div>

        {!!country && country.length > 0 ? (
          <div className="border-white/10 border-t pt-3">
            <div className="mb-2 text-white/60">Quốc gia:</div>
            <div className="flex flex-wrap gap-1">
              {country.map((c) => (
                <Link
                  key={c._id}
                  href={`/discover?cntry=${c.slug}`}
                  className="rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-white/80 text-xs transition-all hover:border-white/50 hover:bg-white/10 hover:text-white"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {!!category && category.length > 0 ? (
          <div className="border-white/10 border-t pt-3">
            <div className="mb-2 text-white/60">Thể loại:</div>
            <div className="flex flex-wrap gap-1">
              {category.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/discover?ctg=${cat.slug}`}
                  className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-blue-200 text-xs transition-all hover:border-blue-400/60 hover:bg-blue-500/20 hover:text-blue-100"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

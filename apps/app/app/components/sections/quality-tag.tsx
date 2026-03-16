import { Badge } from "@repo/design-system/components/ui/badge";
import { cn } from "@repo/design-system/lib/utils";
import type { IMovie } from "../../../types/response";

const className = "rounded-sm font-mono text-xs";
export function QualityTag(props: { movie: IMovie; className?: string }) {
  switch (props.movie.quality) {
    case "HD":
      return (
        <Badge className={cn(className, props.className)} intent="warning">
          HD
        </Badge>
      );
    case "SD":
      return (
        <Badge className={cn(className, props.className)} intent="secondary">
          SD
        </Badge>
      );
    case "CAM":
      return (
        <Badge className={cn(className, props.className)} intent="danger">
          CAM
        </Badge>
      );
    default:
      return (
        <Badge className={cn(className, props.className)} intent="outline">
          {props.movie.quality}
        </Badge>
      );
  }
}

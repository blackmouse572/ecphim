declare module "@ntxmjs/react-custom-video-player" {
  import { ComponentType } from "react";

  interface VideoPlayerProps {
    src: string;
    poster?: string;
    title?: string;
    className?: string;
    autoPlay?: boolean;
    controls?: boolean;
    playsInline?: boolean;
    crossOrigin?: string;
    style?: React.CSSProperties;
    preload?: string;
    controlsList?: string;
    width?: string | number;
    height?: string | number;
  }

  export const VideoPlayer: ComponentType<VideoPlayerProps>;
}

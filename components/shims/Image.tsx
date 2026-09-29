import React from "react";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function Image({
  src,
  alt,
  width,
  height,
  fill,
  priority,
  className = "",
  style = {},
  ...props
}: ImageProps) {
  const combinedStyle: React.CSSProperties = fill
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        ...style,
      }
    : {
        ...style,
      };

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      className={className}
      style={combinedStyle}
      {...props}
    />
  );
}

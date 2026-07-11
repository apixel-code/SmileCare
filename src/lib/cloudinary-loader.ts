"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * next/image loader for Cloudinary-hosted assets.
 * Pass a Cloudinary publicId as `src`; transformations are appended so images
 * are auto-optimised (format, quality) and resized per requested width.
 *
 * Usage: <Image loader={cloudinaryLoader} src={publicId} ... />
 */
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

export function cloudinaryLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  // Already a full URL (e.g. dev stock photos) → return untouched.
  if (/^https?:\/\//.test(src)) return src;

  const params = [
    "f_auto",
    "c_limit",
    `w_${width}`,
    `q_${quality ?? "auto"}`,
  ].join(",");
  const publicId = src.replace(/^\/+/, "");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${params}/${publicId}`;
}

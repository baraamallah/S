import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertGoogleDriveUrl(url: string): string {
  if (!url || !url.includes("drive.google.com")) {
    return url;
  }
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    const fileId = match[1];
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  return url;
}

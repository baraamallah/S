import { cn } from "@/lib/utils";

export default function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("text-accent", className)}
    >
      <path d="M12,0.5L14.5,8.5L22.5,10L16.5,15.5L18,23.5L12,19.5L6,23.5L7.5,15.5L1.5,10L9.5,8.5L12,0.5Z" />
    </svg>
  );
}

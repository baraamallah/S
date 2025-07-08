import { cn } from "@/lib/utils";
import Image from "next/image";

export default function CuteCat({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none", className)}>
      <Image
        src="https://placehold.co/200x200.png"
        alt="A realistic cat"
        width={200}
        height={200}
        className="drop-shadow-lg object-contain"
        data-ai-hint="cute cat"
      />
    </div>
  );
}

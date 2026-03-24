import { BottomNav } from "@/app/_components/bottom-nav";
import { Loader2 } from "lucide-react";

export default async function LoadingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex h-14 items-center px-5">
        <p
          className="text-[22px] uppercase leading-[1.15] text-foreground"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          GFIT
        </p>
      </div>

      <div className="flex flex-1 w-full items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>

      <BottomNav activePage="profile" />
    </div>
  );
}

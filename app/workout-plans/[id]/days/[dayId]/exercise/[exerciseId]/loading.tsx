import { BottomNav } from "@/app/_components/bottom-nav";
import { Loader2 } from "lucide-react";
import { BackButton } from "../../_components/back-button";

export default async function LoadingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex items-center justify-between px-5 py-4">
        <BackButton />
        <h1 className="font-heading text-lg font-semibold text-foreground" />
        <div className="size-6" />
      </div>

      <div className="flex flex-1 w-full items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>

      <BottomNav activePage="calendar" />
    </div>
  );
}

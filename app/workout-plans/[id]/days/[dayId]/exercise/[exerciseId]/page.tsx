import { redirect } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import {
  getHomeData,
  getWorkoutExercise,
} from "@/app/_lib/api/fetch-generated";
import { BottomNav } from "@/app/_components/bottom-nav";
import { BackButton } from "../../_components/back-button";
import { getToday } from "@/app/_lib/get-today";
import { Clock, Zap } from "lucide-react";

export default async function WorkoutDayExercisePage({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const { exerciseId } = await params;

  const [workoutExerciseData, homeData] = await Promise.all([
    getWorkoutExercise(exerciseId),
    getHomeData((await getToday()).format("YYYY-MM-DD")),
  ]);

  const needsOnboarding =
    homeData.status === 200 && !homeData.data.activeWorkoutPlanId;

  if (needsOnboarding) redirect("/onboarding");

  if (workoutExerciseData.status !== 200) redirect("/");

  const {
    name,
    reps,
    sets,
    restTimeInSeconds,
    observation,
    trainingTechnique,
  } = workoutExerciseData.data;

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex items-center justify-between px-5 py-4">
        <BackButton />
        <h1 className="font-heading text-lg font-semibold text-foreground">
          {name}
        </h1>
        <div className="size-6" />
      </div>

      <div className="p-5 flex flex-col gap-5">
        <div className="flex flex-row gap-2 flex-wrap">
          <span className="rounded-full bg-muted px-2.5 py-1 font-heading text-xs font-semibold uppercase text-muted-foreground">
            {sets} séries
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1 font-heading text-xs font-semibold uppercase text-muted-foreground">
            {reps} reps
          </span>
          <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-heading text-xs font-semibold uppercase text-muted-foreground">
            <Clock className="size-3.5" />
            {restTimeInSeconds}s
          </span>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 font-heading text-xs font-semibold uppercase text-primary flex items-center gap-1">
            <Zap className="size-3.5 text-primary fill-primary" />
            {trainingTechnique}
          </span>
        </div>

        {/* Observations */}
        <div className="flex flex-col gap-2 rounded w-fit">
          <h1 className="font-heading font-bold text-foreground uppercase">
            Observações
          </h1>
          {observation ?? "—"}
        </div>
      </div>

      <BottomNav activePage="calendar" />
    </div>
  );
}

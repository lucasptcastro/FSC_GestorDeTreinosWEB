"use client";
import { CircleCheckBig, CircleHelp, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryStates, parseAsBoolean, parseAsString } from "nuqs";
import { type GetWorkoutDay200ExercisesItem } from "@/app/_lib/api/fetch-generated";
import { useTransition } from "react";
import { completeExerciseAction } from "../_actions";
import clsx from "clsx";

interface ExerciseCardProps {
  exercise: GetWorkoutDay200ExercisesItem;
  workoutPlanId: string;
}

export function ExerciseCard({ exercise, workoutPlanId }: ExerciseCardProps) {
  const [isPending, startTransition] = useTransition();

  const [, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString,
  });

  const handleHelp = () => {
    setChatParams({
      chat_open: true,
      chat_initial_message: `Como executar o exercício ${exercise.name} corretamente?`,
    });
  };

  const handleComplete = () => {
    if (isPending || exercise.completed) return;

    startTransition(async () => {
      await completeExerciseAction(
        exercise.id,
        workoutPlanId,
        exercise.workoutDayId,
      );
    });
  };

  const isCompleted = exercise.completed;

  return (
    <>
      <div
        className={clsx(
          "flex flex-col gap-3 rounded-xl border border-border p-5 transition-opacity duration-300",
          {
            "animate-pulse": isPending,
          },
        )}
        role="button"
        tabIndex={0}
        onClick={handleComplete}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleComplete();
        }}
        aria-disabled={isPending || isCompleted}
      >
        <div className="flex items-center justify-between">
          <span className="font-heading text-base font-semibold text-foreground">
            {exercise.name}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleHelp}
            disabled={isPending || isCompleted}
          >
            <CircleHelp className="size-5 text-muted-foreground" />
          </Button>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-muted px-2.5 py-1 font-heading text-xs font-semibold uppercase text-muted-foreground">
            {exercise.sets} séries
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1 font-heading text-xs font-semibold uppercase text-muted-foreground">
            {exercise.reps} reps
          </span>
          <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-heading text-xs font-semibold uppercase text-muted-foreground">
            <Zap className="size-3.5" />
            {exercise.restTimeInSeconds}s
          </span>
        </div>

        {isPending && (
          <div className="mt-2 text-xs text-primary animate-pulse">
            Marcando exercício como concluído...
          </div>
        )}

        <div className="flex items-center justify-between">
          {isCompleted && (
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-green-700">
              <span>Exercício concluído!</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}

          {!isCompleted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleComplete}
              disabled={isPending || isCompleted}
            >
              {isPending ? (
                <Loader2 className="animate-spin size-5 text-foreground" />
              ) : (
                <CircleCheckBig className="size-5 text-foreground" />
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

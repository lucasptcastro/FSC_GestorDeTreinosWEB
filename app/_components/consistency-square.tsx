interface ConsistencySquareProps {
  completed: boolean;
  started: boolean;
  isToday: boolean;
  isRest: boolean;
}

export function ConsistencySquare({
  completed,
  started,
  isToday,
  isRest,
}: ConsistencySquareProps) {
  if (completed) {
    return <div className="size-5 rounded-md bg-primary" />;
  }

  if (started) {
    return <div className="size-5 rounded-md bg-primary/20" />;
  }

  if (isRest) {
    return (
      <div className="size-5 overflow-hidden rounded-md border border-border">
        <svg
          viewBox="0 0 20 20"
          className="size-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="4"
            y1="16"
            x2="16"
            y2="4"
            className="stroke-primary"
            strokeWidth="2"
          />
          <line
            x1="8"
            y1="20"
            x2="20"
            y2="8"
            className="stroke-primary"
            strokeWidth="2"
          />
          <line
            x1="0"
            y1="12"
            x2="12"
            y2="0"
            className="stroke-primary"
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  }

  if (isToday) {
    return <div className="size-5 rounded-md border-[1.6px] border-primary" />;
  }

  return <div className="size-5 rounded-md border border-border" />;
}

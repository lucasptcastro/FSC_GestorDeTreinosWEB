"use client";

import { useEffect } from "react";

export function TimezoneSetter() {
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.cookie = `timezone=${tz};path=/;max-age=31536000`;
  }, []);

  return null;
}

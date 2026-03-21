import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { cookies } from "next/headers";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function getToday() {
  const cookieStore = await cookies();
  const tz = cookieStore.get("timezone")?.value || "America/Sao_Paulo";
  return dayjs().tz(tz);
}

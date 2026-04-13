import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

export const formatDate = (date: Date | string) => {
  return dayjs(date).format("d MMMM YYYY");
};

export function getLastDayOfTheMonthInSpanish() {
  const now = dayjs().locale("es");
  const lastMonthDate = now.endOf("month");
  return lastMonthDate.format("DD [de] MMMM [del] YYYY");
}

export function getLastDayOfTheMonthInEnglish() {
  const now = dayjs().locale("en");
  const lastMonthDate = now.endOf("month");
  return lastMonthDate
    .format("MMMM D, YYYY")
    .replace(/^\w/, (c) => c.toUpperCase());
}

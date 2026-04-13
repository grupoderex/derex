"use client";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { type Locale } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { type PropsSingle } from "react-day-picker"; // 👈 Reemplaza el tipo
import { es, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

type SingleDatePickerProps = Omit<PropsSingle, "mode"> & {
  locale?: Locale;
  fromYear?: number;
  toYear?: number;
};
export function SingleDatePicker({
  locale,
  fromYear,
  toYear,
  ...props
}: SingleDatePickerProps) {
  const { i18n, t } = useTranslation("translations");

  const startMonth = fromYear ? new Date(fromYear, 0) : undefined;
  const endMonth = toYear ? new Date(toYear, 11) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full text-foreground bg-neutral-100 justify-start text-left font-normal border-input hover:bg-gray-50 hover:text-primary flex items-center",
            !props.selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
          {props.selected ? (
            format(props.selected, "PPP", {
              locale: locale ?? (i18n.language === "es" ? es : enUS),
            })
          ) : (
            <span>{t("selectDate")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          captionLayout="dropdown"
          mode="single"
          startMonth={startMonth}
          endMonth={endMonth}
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
}

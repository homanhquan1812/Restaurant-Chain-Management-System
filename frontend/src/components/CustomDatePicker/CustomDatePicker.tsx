"use client";

import * as React from "react";
import {
  format,
  getMonth,
  getYear,
  setMonth,
  setYear
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "../../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/ui/select";
import { useTranslation } from "react-i18next";

interface CustomDatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  startYear?: number;
  endYear?: number;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder,
  className,
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 20,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date>(value || new Date());

  const months = [
    t("datepicker.month") + " 1",
    t("datepicker.month") + " 2",
    t("datepicker.month") + " 3",
    t("datepicker.month") + " 4",
    t("datepicker.month") + " 5",
    t("datepicker.month") + " 6",
    t("datepicker.month") + " 7",
    t("datepicker.month") + " 8",
    t("datepicker.month") + " 9",
    t("datepicker.month") + " 10",
    t("datepicker.month") + " 11",
    t("datepicker.month") + " 12"
  ];

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onChange(date);
      setOpen(false);
    }
  };

  const handleMonthChange = (month: string) => {
    const monthIndex = months.findIndex(m => m === month);
    const newDate = setMonth(selectedDate, monthIndex);
    setSelectedDate(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(selectedDate, parseInt(year));
    setSelectedDate(newDate);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full bg-white border border-neutral-300 justify-start text-left font-normal focus-visible:ring-1 focus-visible:ring-blue-500",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "yyyy-MM-dd") : <span>{placeholder || t("datepicker.placeholder")}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <div className="flex justify-between items-center gap-2 px-3 py-2">
          <Select
            value={months[getMonth(selectedDate)]}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("datepicker.month")} />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={getYear(selectedDate).toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("datepicker.year")} />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          month={selectedDate}
          onMonthChange={setSelectedDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { countries } from "../../constants/country";
import type { Country } from "../../constants/country";
import type { Dispatch, SetStateAction } from "react";

interface SelectLanguageProps {
  handleClick: () => void;
  showMenu: string;
  setShowMenu: Dispatch<SetStateAction<string>>;
}

export default function SelectLanguage({
  handleClick,
  showMenu,
  setShowMenu,
}: SelectLanguageProps) {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Country | null>(null);

  const handleChangeLanguage = (country: Country) => {
    setShowMenu("");
    i18next.changeLanguage(country.short);
    setCurrentLanguage(country);
    // Lưu ngôn ngữ đã chọn vào localStorage
    localStorage.setItem("i18nextLng", country.short);
  };

  useEffect(() => {
    // Lấy ngôn ngữ hiện tại khi component mount
    const current = countries.find((item) => item.short === i18n.language);
    setCurrentLanguage(current ?? countries[0]);
  }, [i18n.language]);

  return (
    <DropdownMenu
      open={showMenu === "login"}
      onOpenChange={(open) => setShowMenu(open ? "login" : "")}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" onClick={handleClick} className="p-0 h-8 w-10">
          {currentLanguage?.avatar ? (
            <img
              src={currentLanguage.avatar}
              alt={currentLanguage.name}
              className="h-8 w-10 object-cover rounded-md border border-neutral-300"
            />
          ) : (
            <div className="h-8 w-10 bg-gray-300 rounded-md animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-44 border border-neutral-300 shadow-md rounded-md bg-white"
      >
        {countries.map((country) => (
          <DropdownMenuItem
            key={country.id}
            onClick={() => handleChangeLanguage(country)}
            className={`flex gap-2 items-center cursor-pointer ${currentLanguage?.id === country.id ? "bg-neutral-100" : ""}`}
          >
            <img
              src={country.avatar}
              alt={country.name}
              className="h-6 w-8 object-cover rounded-md border border-neutral-300"
            />
            <span>{country.name}</span>
            {currentLanguage?.id === country.id && (
              <span className="ml-auto text-xs text-green-600">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

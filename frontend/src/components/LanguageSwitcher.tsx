import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

// Flag icons
const EnglishFlag = () => (
  <svg
    className="w-5 h-5 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 30"
  >
    <clipPath id="a">
      <path d="M0 0v30h60V0z" />
    </clipPath>
    <clipPath id="b">
      <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
    </clipPath>
    <g clipPath="url(#a)">
      <path d="M0 0v30h60V0z" fill="#012169" />
      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0 0l60 30m0-30L0 30"
        clipPath="url(#b)"
        stroke="#C8102E"
        strokeWidth="4"
      />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

const VietnameseFlag = () => (
  <svg
    className="w-5 h-5 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 900 600"
  >
    <rect width="900" height="600" fill="#da251d" />
    <g transform="translate(450,300)" fill="#ff0">
      <g id="g">
        <g id="s">
          <path id="t" d="M0,-100 v100 h50" transform="rotate(18,0,-100)" />
          <use href="#t" transform="scale(-1,1)" />
        </g>
        <use href="#s" transform="rotate(72)" />
        <use href="#s" transform="rotate(144)" />
        <use href="#s" transform="rotate(216)" />
        <use href="#s" transform="rotate(288)" />
      </g>
    </g>
  </svg>
);

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentLanguage = i18n.language || "en";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
      >
        {currentLanguage === "en" ? <EnglishFlag /> : <VietnameseFlag />}
        <span>{currentLanguage === "en" ? "English" : "Tiếng Việt"}</span>
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <button
            onClick={() => changeLanguage("en")}
            className={`flex items-center w-full px-4 py-2 text-sm ${
              currentLanguage === "en"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700"
            } hover:bg-gray-100`}
          >
            <EnglishFlag />
            <span>{t("common.english")}</span>
          </button>
          <button
            onClick={() => changeLanguage("vi")}
            className={`flex items-center w-full px-4 py-2 text-sm ${
              currentLanguage === "vi"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700"
            } hover:bg-gray-100`}
          >
            <VietnameseFlag />
            <span>{t("common.vietnamese")}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;

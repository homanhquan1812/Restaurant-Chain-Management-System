"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { CustomDatePicker } from "../../components/CustomDatePicker/CustomDatePicker";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { ComboboxCustom } from "../../components/Combobox/Combobox";

const FilterBar: React.FC = () => {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState("all");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState("all");
  const [productType, setProductType] = useState("all");
  const [productBrand, setProductBrand] = useState("all");

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row flex-wrap gap-4">
      {/* Name input */}
      <ComboboxCustom
        data={[]}
        value={keyword}
        onChange={setKeyword}
        placeholder={t("products.search.placeholder")}
        className="w-full sm:flex-1 border border-neutral-300"
      />

      {/* Brand */}
      <Select value={productBrand} onValueChange={setProductBrand}>
        <SelectTrigger className="bg-white w-full sm:flex-1 border border-neutral-300">
          <SelectValue placeholder={t("products.search.allBrands")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("products.search.allBrands")}</SelectItem>
          {/* Populate dynamic brand list here */}
        </SelectContent>
      </Select>

      {/* Date Picker */}
      {/* <CustomDatePicker
        value={date}
        onChange={setDate}
      /> */}

      {/* Product Type */}
      <Select value={productType} onValueChange={setProductType}>
        <SelectTrigger className="bg-white w-full sm:flex-1 border border-neutral-300">
          <SelectValue placeholder={t("products.search.allCategories")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("products.search.allCategories")}</SelectItem>
        </SelectContent>
      </Select>

      {/* Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          className="bg-blue-500 text-white hover:bg-blue-600"
          onClick={() =>
            console.log({ keyword, date, status, productType, productBrand })
          }
        >
          {t("products.search.search")}
        </Button>
        <Button
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-50"
          onClick={() => {
            setKeyword("all");
            setDate(undefined);
            setStatus("all");
            setProductType("all");
            setProductBrand("all");
          }}
        >
          {t("products.search.reset")}
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;

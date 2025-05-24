"use client";

import React, { useEffect, useState } from "react";
import { ComboboxCustom } from "../../components/Combobox/Combobox";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { getAllBrands } from "../../services/brand.service";
import { useTranslation } from "react-i18next";

const FilterBar: React.FC = () => {
  const { t } = useTranslation();

  const [keyword, setKeyword] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [status, setStatus] = useState("all");

  const [brands, setBrands] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandData] = await Promise.all([
          getAllBrands(),
          // getAllManagers(),
          // getAllLocations()
        ]);
        setBrands(brandData);
        // setManagers(managerData);
        // setLocations(locationData);
      } catch (error) {
        console.error("Fetch filter data error:", error);
      }
    };

    fetchData();
  }, []);

  const statusOptions = [
    { value: "all", label: t("brand.search.allStatuses") },
    { value: "active", label: t("brand.active") },
    { value: "inactive", label: t("brand.inactive") },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row flex-wrap gap-4">
      {/* Keyword Search */}
      <ComboboxCustom
        data={[]}
        value={keyword}
        onChange={setKeyword}
        placeholder={t("brand.search.placeholder")}
        className="w-full sm:flex-1 border border-neutral-300"
      />

      {/* Location */}
      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
        <SelectTrigger className="w-full sm:flex-1 border border-neutral-300 bg-white">
          <SelectValue placeholder={t("branch.search.allLocations")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("branch.search.allLocations")}</SelectItem>
          {locations.map((loc) => (
            <SelectItem key={loc.id} value={loc.id}>
              {loc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Manager */}
      <Select value={selectedManager} onValueChange={setSelectedManager}>
        <SelectTrigger className="w-full sm:flex-1 border border-neutral-300 bg-white">
          <SelectValue placeholder={t("branch.search.allManagers")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("branch.search.allManagers")}</SelectItem>
          {managers.map((mgr) => (
            <SelectItem key={mgr.id} value={mgr.id}>
              {mgr.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Brand */}
      <Select value={selectedBrand} onValueChange={setSelectedBrand}>
        <SelectTrigger className="w-full sm:flex-1 border border-neutral-300 bg-white">
          <SelectValue placeholder={t("branch.search.allBrands")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("branch.search.allBrands")}</SelectItem>
          {brands.map((b) => (
            <SelectItem key={b.id} value={b.id}>
              {b.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status */}
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-full sm:flex-1 border border-neutral-300 bg-white">
          <SelectValue placeholder={t("branch.search.allStatuses")} />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          className="bg-blue-500 text-white"
          onClick={() =>
            console.log({
              keyword,
              selectedLocation,
              selectedManager,
              selectedBrand,
              status,
            })
          }
        >
          {t("common.search")}
        </Button>
        <Button
          variant="outline"
          className="border-red-500 text-red-500"
          onClick={() => {
            setKeyword("");
            setSelectedLocation("");
            setSelectedManager("");
            setSelectedBrand("");
            setStatus("all");
          }}
        >
          {t("common.reset")}
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;

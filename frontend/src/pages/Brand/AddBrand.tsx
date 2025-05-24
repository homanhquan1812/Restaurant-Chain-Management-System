import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { LuImageUp } from "react-icons/lu";
import { X } from "lucide-react";
import { createBrand } from "../../services/brand.service";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLoading } from "../../contexts/LoadingContext";

const AddBrand: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const [logo, setLogo] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("Active");
  const [openingHour, setOpeningHour] = useState("");
  const [closingHour, setClosingHour] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!logo) newErrors.logo = "Logo is required";
    if (!name.trim()) newErrors.name = "Required";
    if (!description.trim()) newErrors.description = "Required";
    if (!link.trim()) newErrors.link = "Required";
    if (!openingHour) newErrors.openingHour = "Required";
    if (!closingHour) newErrors.closingHour = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    setLoading(true);
    const formData = new FormData();
    if (logo) formData.append("logo_url", logo); // gửi file gốc
    formData.append("name", name);
    formData.append("description", description);
    formData.append("opening_hours", openingHour);
    formData.append("closed_hours", closingHour);
    formData.append("website_url", link);
    formData.append("status", status);

    await createBrand(formData); // gọi hàm mới bên service
    toast.success(t("brand.brandAdded"));
    navigate("/brand");
  } catch (err) {
    console.error("Error creating brand:", err);
    toast.error(t("brand.deleteError"));
  } finally {
    setLoading(false); // thêm
  }
};

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 mx-auto space-y-6">
      <div
        className="text-sm text-blue-600 cursor-pointer"
        onClick={() => navigate("/brand")}
      >
        ← {t("brand.brandList")}
      </div>

      <h1 className="text-3xl font-bold text-neutral-800">{t("brand.addNewBrand")}</h1>

      <div className="bg-white rounded-xl p-8 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Logo */}
          <div className="flex flex-col items-center space-y-2">
            <label htmlFor="logo-upload" className="cursor-pointer">
              <div className="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                {logo ? (
                  <>
                    <img
                      src={URL.createObjectURL(logo)}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover rounded-full overflow-hidden"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setLogo(null);
                      }}
                      className="absolute top-1 right-1 bg-white rounded-full shadow p-1 hover:bg-red-500 hover:text-white transition-all overflow-visible"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <LuImageUp className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </label>
            <span className="text-sm text-blue-600 font-medium">
              {t("brand.logo")} <span className="text-red-500">*</span>
            </span>
            {errors.logo && (
              <span className="text-red-500 text-xs">{errors.logo}</span>
            )}
          </div>

          {/* Brand Name */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">
                {t("brand.name")} <span className="text-red-500">*</span>
              </label>
              {errors.name && (
                <span className="text-red-500 text-xs">{errors.name}</span>
              )}
            </div>
            <input
              type="text"
              placeholder={t("brand.search.placeholder")}
              className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">
                {t("brand.description")} <span className="text-red-500">*</span>
              </label>
              {errors.description && (
                <span className="text-red-500 text-xs">{errors.description}</span>
              )}
            </div>
            <textarea
              placeholder={t("brand.description")}
              className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Website */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">
                {t("brand.website")} <span className="text-red-500">*</span>
              </label>
              {errors.link && (
                <span className="text-red-500 text-xs">{errors.link}</span>
              )}
            </div>
            <input
              type="url"
              placeholder="https://..."
              className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          {/* Opening Hour */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">
                {t("brand.opening")} <span className="text-red-500">*</span>
              </label>
              {errors.openingHour && (
                <span className="text-red-500 text-xs">{errors.openingHour}</span>
              )}
            </div>
            <input
              type="time"
              className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              value={openingHour}
              onChange={(e) => setOpeningHour(e.target.value)}
            />
          </div>

          {/* Closing Hour */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">
                {t("brand.closed")} <span className="text-red-500">*</span>
              </label>
              {errors.closingHour && (
                <span className="text-red-500 text-xs">{errors.closingHour}</span>
              )}
            </div>
            <input
              type="time"
              className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              value={closingHour}
              onChange={(e) => setClosingHour(e.target.value)}
            />
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-sm font-medium block">{t("brand.status")}</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("brand.search.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">{t("brand.active")}</SelectItem>
                <SelectItem value="Inactive">{t("brand.inactive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-8 py-2 rounded-md hover:bg-blue-600"
            >
              {t("brand.addBrand")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBrand;

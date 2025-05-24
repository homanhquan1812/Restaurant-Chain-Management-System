import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { getAllBrands } from "../../services/brand.service";
import { createRcmsStaff } from "../../services/rcms.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useTranslation } from "react-i18next";
import type { Brand } from "../../services/brand.service";
import { useLoading } from "../../contexts/LoadingContext";

const AddBrandManager: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [avatar, setAvatar] = useState<File | null>(null);

  const [form, setForm] = useState<Record<string, string>>({
    full_name: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    salary: "",
    brand_id: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    Object.entries(form).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = t("common.required");
    });
    if (!avatar) newErrors.avatar = t("common.required");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (avatar) data.append("avatar", avatar);

      await createRcmsStaff(data);
      toast.success(t("brandManager.addedSuccess"));
      navigate("/brand-manager");
    } catch (err) {
      console.error(err);
      toast.error(t("brandManager.addError"));
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getAllBrands().then(setBrands).catch(console.error);
  }, []);

  return (
    <div className="p-6 mx-auto space-y-6">
      <div
        className="text-sm text-blue-600 cursor-pointer"
        onClick={() => navigate("/brand-manager")}
      >
        ← {t("brandManager.back")}
      </div>

      <h1 className="text-3xl font-bold text-neutral-800">{t("brandManager.addTitle")}</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-8 shadow-md grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Avatar Upload */}
        <div className="col-span-full flex flex-col items-center space-y-2">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <div className="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {avatar ? (
                <>
                  <img
                    src={URL.createObjectURL(avatar)}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover rounded-full"
                  />
                  <button
                    type="button"
                    onClick={() => setAvatar(null)}
                    className="absolute top-1 right-1 bg-white rounded-full shadow p-1 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <span className="text-gray-400 text-2xl">+</span>
              )}
            </div>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.type.startsWith("image/")) {
                  setAvatar(file);
                } else {
                  toast.error(t("common.imageInvalid"));
                }
              }}
            />
          </label>
          <span className="text-sm text-blue-600 font-medium">
            {t("brandManager.uploadAvatar")}{" "}
            <span className="text-xs text-red-500">*</span>
          </span>
          {errors.avatar && (
            <span className="text-red-500 text-xs">{errors.avatar}</span>
          )}
        </div>

        {/* Form fields */}
        {[
          { name: "full_name", label: t("common.fullName") },
          { name: "username", label: t("common.username") },
          { name: "password", label: t("common.password"), type: "password" },
          { name: "email", label: t("common.email") },
          { name: "phone", label: t("common.phone") },
          { name: "salary", label: t("common.salary"), type: "number" },
          { name: "address", label: t("common.address") },
        ].map(({ name, label, type = "text" }) => (
          <div key={name}>
            <label className="text-sm font-medium">
              {label} <span className="text-xs text-red-500">*</span>
            </label>
            <input
              name={name}
              type={type}
              className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              value={form[name]}
              onChange={handleInput}
            />
            {errors[name] && (
              <span className="text-red-500 text-xs">{errors[name]}</span>
            )}
          </div>
        ))}

        {/* DOB */}
        <div>
          <label className="text-sm font-medium">
            {t("common.dob")} <span className="text-xs text-red-500">*</span>
          </label>
          <input
            type="date"
            name="dob"
            className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
            value={form.dob}
            onChange={handleInput}
          />
          {errors.dob && (
            <span className="text-red-500 text-xs">{errors.dob}</span>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm font-medium">
            {t("common.gender")} <span className="text-xs text-red-500">*</span>
          </label>
          <Select
            value={form.gender}
            onValueChange={(val) => setForm({ ...form, gender: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("common.selectGender")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">{t("common.male")}</SelectItem>
              <SelectItem value="Female">{t("common.female")}</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <span className="text-red-500 text-xs">{errors.gender}</span>
          )}
        </div>

        {/* Brand */}
        <div>
          <label className="text-sm font-medium">
            {t("common.brand")} <span className="text-xs text-red-500">*</span>
          </label>
          <Select
            value={form.brand_id}
            onValueChange={(val) => setForm({ ...form, brand_id: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("common.selectBrand")} />
            </SelectTrigger>
            <SelectContent>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.brand_id && (
            <span className="text-red-500 text-xs">{errors.brand_id}</span>
          )}
        </div>

        {/* Submit */}
        <div className="col-span-full text-center pt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-8 py-2 rounded-md hover:bg-blue-600"
          >
            {t("common.submit")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBrandManager;

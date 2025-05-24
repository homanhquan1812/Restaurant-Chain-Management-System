import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { addCustomer } from "../../redux/slices/customerSlice";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { LuImageUp } from "react-icons/lu";
import { CustomDatePicker } from "../../components/CustomDatePicker/CustomDatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import PhoneInput from "../../components/PhoneInput/PhoneInput";

const AddCustomer: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [photo, setPhoto] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState<Date | undefined>();
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [brandId, setBrandId] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = "Required";
    if (!username.trim()) newErrors.username = "Required";
    if (!email.trim()) newErrors.email = "Required";
    if (!password.trim()) newErrors.password = "Required";
    if (!phone.trim()) newErrors.phone = "Required";
    if (!gender) newErrors.gender = "Required";
    if (!address.trim()) newErrors.address = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const avatar = photo ? await convertFileToBase64(photo) : "";

      await dispatch(
        addCustomer({
          full_name: fullName,
          username,
          password,
          email,
          phone,
          gender,
          address,
          brand_id: "3e11197e-e478-4f55-8434-db67de945d64",
          // giữ các field bên dưới để backend có thể mở rộng về sau
          dob: dob ? dob.toISOString() : "",
          // role: "Customer",
          // member_information_id: "",
          // brand_name: "",
          // status: "Active",
        })
      ).unwrap();

      toast.success(t("customer.customerAdded"));
      navigate("/customer");
    } catch (err) {
      console.error("Error creating customer:", err);
      toast.error(t("customer.addError"));
    }
  };

  return (
    <div className="p-6 mx-auto space-y-6">
      <div
        className="text-sm text-blue-600 cursor-pointer"
        onClick={() => navigate("/customer")}
      >
        ← {t("customer.customerList")}
      </div>

      <h1 className="text-3xl font-bold text-neutral-800">
        {t("customer.addNewCustomer")}
      </h1>

      <div className="bg-white rounded-xl p-8 shadow-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Avatar Upload */}
          {/* <div className="md:col-span-2 flex flex-col items-center space-y-2">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                {photo ? (
                  <>
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover rounded-full"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setPhoto(null);
                      }}
                      className="absolute top-1 right-1 bg-white rounded-full shadow p-1 hover:bg-red-500 hover:text-white"
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
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
            <span className="text-sm text-blue-600 font-medium">
              {t("products.uploadImage")}
            </span>
          </div> */}

          {/* Full Name */}
          <div>
            <label className="text-sm font-medium block mb-1">
              {t("customer.fullName")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="text-sm font-medium block mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium block mb-1">
              {t("customer.email")} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium block mb-1">
              {t("common.password")} <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          {/* Phone */}
          <PhoneInput
            value={phone}
            onChange={setPhone}
            error={errors.phone}
            label={t("customer.phone")}
          />
          {/* Gender */}
          <div>
            <label className="text-sm font-medium block mb-1">
              {t("customer.gender")} <span className="text-red-500">*</span>
            </label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("customer.gender")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">{t("customer.male")}</SelectItem>
                <SelectItem value="Female">{t("customer.female")}</SelectItem>
                <SelectItem value="Other">{t("customer.other")}</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-sm font-medium block mb-1">
              {t("customer.dateOfBirth")}
            </label>
            <CustomDatePicker
              value={dob}
              onChange={setDob}
              placeholder={t("customer.dateOfBirth") || "Pick a date"}
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium block mb-1">
              {t("customer.address")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
          </div>

          {/* Submit */}
          <div className="text-center md:col-span-2 pt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-8 py-2 rounded-md hover:bg-blue-600"
            >
              {t("customer.addCustomer")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;

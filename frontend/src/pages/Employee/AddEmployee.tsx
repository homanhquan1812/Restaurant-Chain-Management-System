import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuImageUp } from "react-icons/lu";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { createEmployee } from "../../services/employee.service";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { CustomDatePicker } from "../../components/CustomDatePicker/CustomDatePicker";

const AddEmployee: React.FC = () => {
  const navigate = useNavigate();
  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [brand, setBrand] = useState("");
  const [branch, setBranch] = useState("");
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [gender, setGender] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    // if (!photo) newErrors.photo = "Required";
    if (!fullName) newErrors.fullName = "Required";
    if (!username) newErrors.username = "Required";
    if (!password) newErrors.password = "Required";
    if (!email) newErrors.email = "Required";
    if (!phoneNumber) newErrors.phoneNumber = "Required";
    if (!brand) newErrors.brand = "Required";
    if (!branch) newErrors.branch = "Required";
    if (!position) newErrors.position = "Required";
    if (!salary) newErrors.salary = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      await createEmployee({
        id: "",
        full_name: fullName,
        username,
        password,
        email,
        phone: phoneNumber,
        gender,
        position,
        salary: Number(salary),
        brand_id: "TODO",
        branch_id: "TODO",
        avatar: photo ? await convertToBase64(photo) : "",
        role: "Employee",
        address: "",
        date_added: dob ? format(dob, "yyyy-MM-dd") : "",
        status: "Active",
        member_information_id: "",
        display_id: "",
        brand_name: brand,
        branch_address: branch,
        logo_url: "",
      });
      toast.success("Employee created successfully!");
      navigate("/employee");
    } catch (error) {
      toast.error("Failed to create employee. Please check required fields or try again.");
      console.error("Failed to create employee:", error);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 mx-auto space-y-6">
      <div
        className="text-sm text-blue-600 cursor-pointer"
        onClick={() => navigate("/employee")}
      >
        ← Back to Employee List
      </div>

      <h1 className="text-3xl font-bold text-neutral-800">Add New Employee</h1>

      <div className="bg-white rounded-xl p-8 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Photo */}
          <div className="flex flex-col items-center space-y-2">
            <label htmlFor="photo-upload" className="cursor-pointer">
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
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
            <span className="text-sm text-blue-600 font-medium">
              Upload Photo <span className="text-red-500">*</span>
            </span>
            {errors.photo && (
              <span className="text-red-500 text-xs">{errors.photo}</span>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              />
              {errors.fullName && (
                <p className="text-xs text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="text-sm font-medium">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              />
              {errors.username && (
                <p className="text-xs text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="XXX-XXX-XXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              />
              {errors.phoneNumber && (
                <p className="text-xs text-red-500">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="text-sm font-medium">
                Brand <span className="text-red-500">*</span>
              </label>
              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Phuc Long Company">Phuc Long Company</SelectItem>
                </SelectContent>
              </Select>
              {errors.brand && (
                <p className="text-xs text-red-500">{errors.brand}</p>
              )}
            </div>

            {/* Branch */}
            <div>
              <label className="text-sm font-medium">
                Branch <span className="text-red-500">*</span>
              </label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sài Gòn">Sài Gòn</SelectItem>
                </SelectContent>
              </Select>
              {errors.branch && (
                <p className="text-xs text-red-500">{errors.branch}</p>
              )}
            </div>

            {/* Position */}
            <div>
              <label className="text-sm font-medium">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              />
              {errors.position && (
                <p className="text-xs text-red-500">{errors.position}</p>
              )}
            </div>

            {/* Salary */}
            <div>
              <label className="text-sm font-medium">
                Salary <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              />
              {errors.salary && (
                <p className="text-xs text-red-500">{errors.salary}</p>
              )}
            </div>

            {/* DOB */}
            <div>
              <label className="text-sm font-medium">Date of Birth</label>
              <CustomDatePicker
                value={dob}
                onChange={setDob}
                placeholder="Select date"
              />
            </div>


            {/* Gender */}
            <div>
              <label className="text-sm font-medium">Gender</label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="--- Choose Gender ---" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-8 py-2 rounded-md hover:bg-blue-600"
            >
              Add Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;

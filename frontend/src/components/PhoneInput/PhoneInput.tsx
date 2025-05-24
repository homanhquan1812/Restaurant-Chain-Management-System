import React from "react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
  label = "Phone number",
  required = true,
}) => {
  const [localError, setLocalError] = React.useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Chỉ cho phép số
    if (!/^\d*$/.test(newValue)) return;

    // Gán giá trị
    onChange(newValue);

    // Kiểm tra lỗi
    if (required && newValue.trim() === "") {
      setLocalError("Phone number is required");
    } else if (!/^0\d{9}$/.test(newValue)) {
      setLocalError("Phone number must start with 0 and be 10 digits long");
    } else {
      setLocalError("");
    }
  };

  return (
    <div>
      <label className="text-sm font-medium block mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="tel"
        value={value}
        onChange={handleChange}
        className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
        maxLength={10}
      />
      {(error || localError) && (
        <p className="text-red-500 text-xs">{error || localError}</p>
      )}
    </div>
  );
};

export default PhoneInput;

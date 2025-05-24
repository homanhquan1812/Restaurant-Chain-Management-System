import { useRef, useState } from "react";
import grinderImage from "../../../../public/assets/images/coffee-grinder.png"; // Đảm bảo đúng path
import emailIllustration from "../../../../public/assets/images/email.png"; // Email icon minh hoạ
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import { verifyResetCode } from "../../../services/auth.service";
import { setResetToken } from "../../../redux/slices/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function VerifyCode({
  email,
  onVerified,
}: {
  email: string;
  onVerified: (token: string) => void;
}) {  
  const navigate = useNavigate();
  const [values, setValues] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null));
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const code = values.join("");
      if (code.length !== 6) {
        toast.warning("Vui lòng nhập đủ 6 chữ số mã xác minh.");
        return;
      }

      try {
        const res = await verifyResetCode(email, code);
        toast.success("Xác minh thành công!");
        onVerified(res.data.token);
      } catch {
        toast.error("Mã xác minh không hợp lệ hoặc đã hết hạn.");
      }
    };
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    if (value && index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1]!.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCE2D1] px-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl shadow-lg overflow-hidden bg-white ">
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-[#F1F2FE] relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 text-sm text-gray-600 hover:underline"
          >
            &lt; Back
          </button>

          <div className="mt-16 flex flex-col items-center">
            <img
              src={emailIllustration}
              alt="Email Illustration"
              className="w-20 mb-6"
            />
            <h2 className="text-2xl md:text-3xl font-bold text-[#4B3B39] mb-2 text-center">
              Kiểm tra thư của bạn
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Chúng tôi đã gửi mã xác minh đến email của bạn
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center w-full"
            >
            <div className="grid grid-cols-6 gap-2 w-full max-w-xs mb-6">
              {values.map((val, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    (inputsRef.current[i] as HTMLInputElement | null) = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="aspect-square w-full border-2 border-gray-400 rounded-xl text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#4B3B39]"
                />
              ))}
            </div>
              <button
                type="submit"
                className="w-full max-w-md py-2 bg-[#4B3B39] text-white rounded-full text-sm font-medium hover:bg-[#3a2e2c] transition"
              >
                Xác nhận
              </button>

              <button
                type="button"
                onClick={() => console.log("Resend code")}
                className="mt-4 text-sm text-[#4B3B39] underline hover:text-[#3a2e2c]"
              >
                Không nhận được mã xác minh?
              </button>
            </form>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:block md:w-1/2 bg-[#4B3B39] relative">
          <img
            src={grinderImage}
            alt="Coffee grinder"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

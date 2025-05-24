import { useState } from "react";
import { useNavigate } from "react-router-dom";
import grinderImage from "../../../../public/assets/images/coffee-grinder.png";
import { forgotPassword } from "../../../services/auth.service"; // import API
import { toast } from "react-toastify";


export default function EmailInput({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      toast.success("Đã gửi mã xác minh đến email.");
      onSuccess(email); // Gọi callback truyền lên
    } catch (err) {
      toast.error("Email không hợp lệ hoặc không tồn tại. Vui lòng kiểm tra lại.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCE2D1] px-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl shadow-lg overflow-hidden bg-white">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-[#F1F2FE] relative">
          {/*  Fix vị trí nút Back */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 text-sm text-gray-600 hover:underline"
          >
            &lt; Back
          </button>

          <div className="mt-14"> {/* Để tránh đè lên nút back */}
            <h2 className="text-3xl font-bold text-[#4B3B39] mb-4">
              Đặt lại mật khẩu
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã xác minh để đặt lại mật khẩu của bạn.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3B39]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#4B3B39] text-white rounded-full text-sm hover:bg-[#3a2e2c] transition"
              >
                Gửi hướng dẫn
              </button>
            </form>
          </div>
        </div>

        {/* Right: Image */}
        <div className="hidden md:block md:w-1/2 bg-[#4B3B39] relative">
          <img
            src={grinderImage}
            alt="Coffee Grinder"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

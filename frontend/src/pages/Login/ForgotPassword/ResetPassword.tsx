import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import grinderImage from "../../../../public/assets/images/coffee-grinder.png"; // Đảm bảo đúng path
import { resetPassword } from "../../../services/auth.service";
import { toast } from "react-toastify";

export default function ResetPassword({
  email,
  token,
}: {
  email: string;
  token: string;
}) {  
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp");
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      await resetPassword(email, token, password, confirm);
      toast.success("Đặt lại mật khẩu thành công!");
      navigate("/", {
        replace: true,
        state: {
          resetSuccess: true,
        },
      });
    } catch (err) {
      setError("Đặt lại mật khẩu thất bại. Token không hợp lệ hoặc đã hết hạn.");
      toast.error("Đặt lại mật khẩu thất bại. Token không hợp lệ hoặc đã hết hạn.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCE2D1] px-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl shadow-lg overflow-hidden bg-white">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-[#F1F2FE] relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 text-sm text-gray-600 hover:underline"
          >
            &lt; Back
          </button>

          <div className="mt-14">
            <h2 className="text-3xl font-bold text-[#4B3B39] mb-4">
              Tạo mật khẩu mới
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Mật khẩu mới của bạn phải khác mật khẩu trước đó
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mật khẩu mới
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3B39]"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Xác nhận mật khẩu mới
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm password"
                  required
                  className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B3B39]"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-[#4B3B39] text-white rounded-full text-sm font-medium hover:bg-[#3a2e2c] transition"
              >
                Đặt lại mật khẩu
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

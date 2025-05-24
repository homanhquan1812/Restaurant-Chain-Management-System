import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import grinderImage from "../../../../public/assets/images/coffee-grinder.png"; // Đảm bảo path đúng
import emailIllustration from "../../../../public/assets/images/email.png"; // Icon minh hoạ

export default function VerifyCodeLoading() {
  const navigate = useNavigate();
const location = useLocation();
const email = location.state?.email;
const token = location.state?.token;

useEffect(() => {
  setTimeout(() => {
    navigate("/reset-password", {
      state: { email, token }
    });
  }, 2000);
}, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCE2D1] px-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl shadow-lg overflow-hidden bg-white">
        {/* Left: Loading text & animation */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-[#F1F2FE] px-8 relative">
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
              Vui lòng đợi trong giây lát
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Sẽ mất vài giây để chúng tôi xác nhận mã xác minh
            </p>

            <div className="flex gap-2 mt-2">
              {[...Array(4)].map((_, i) => (
                <span
                  key={i}
                  className="w-3 h-3 bg-[#4B3B39] rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                ></span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Coffee grinder image */}
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

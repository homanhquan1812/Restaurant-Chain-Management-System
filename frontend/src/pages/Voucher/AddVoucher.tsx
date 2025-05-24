import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../redux/hooks";
import { addVoucher } from "../../redux/slices/voucherSlice";
import { useLoading } from "../../contexts/LoadingContext";

const AddVoucher: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [discountType, setDiscountType] = useState("Drink");
  const [type, setType] = useState("Promotion");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Active");
  const [brandId, setBrandId] = useState(
    "68b50680-d17d-4470-b2cf-306dd234e982"
  ); // Default brand ID
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = "Required";
    if (!code.trim()) newErrors.code = "Required";
    if (!description.trim()) newErrors.description = "Required";
    if (!discountPercent.trim()) newErrors.discountPercent = "Required";
    if (!startDate) newErrors.startDate = "Required";
    if (!endDate) newErrors.endDate = "Required";
    if (!type.trim()) newErrors.type = "Required";
    if (!discountType.trim()) newErrors.discountType = "Required";
    if (!brandId.trim()) newErrors.brandId = "Required";

    // Validate dates
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    // Validate discount percent
    if (
      discountPercent &&
      (Number(discountPercent) <= 0 || Number(discountPercent) > 100)
    ) {
      newErrors.discountPercent = "Discount percent must be between 1 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      await dispatch(
        addVoucher({
          title,
          code,
          description,
          discount_percent: Number(discountPercent),
          discount_type: discountType,
          type,
          start_date: startDate,
          end_date: endDate,
          status,
          brand_id: brandId,
        })
      ).unwrap();

      navigate("/voucher");
    } catch (error) {
      console.error("Failed to add voucher:", error);
      alert(t("vouchers.addError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="main-content">
          <div className="dashboard-body p-6">
            <div className="mx-auto space-y-6">
              <div
                className="text-sm text-blue-600 cursor-pointer"
                onClick={() => navigate("/voucher")}
              >
                ← {t("vouchers.voucherList")}
              </div>

              <h1 className="text-3xl font-bold text-neutral-800">
                {t("vouchers.addNewVoucher")}
              </h1>

              <div className="bg-white rounded-xl p-8 shadow-md px-[250px]">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium">
                          {t("vouchers.title")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {errors.title && (
                          <span className="text-red-500 text-xs">
                            {errors.title}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                        placeholder="e.g. Spring Specials"
                      />
                    </div>

                    {/* Voucher Code */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium">
                          {t("vouchers.code")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {errors.code && (
                          <span className="text-red-500 text-xs">
                            {errors.code}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                        placeholder="e.g. SPRING25DRINKS"
                      />
                    </div>

                    {/* Voucher Type */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium">
                          {t("vouchers.type")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {errors.type && (
                          <span className="text-red-500 text-xs">
                            {errors.type}
                          </span>
                        )}
                      </div>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
                      >
                        <option value="Promotion">Promotion</option>
                        <option value="Coupon">Coupon</option>
                        <option value="Discount">Discount</option>
                      </select>
                    </div>

                    {/* Discount Type */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium">
                          {t("vouchers.discountType")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {errors.discountType && (
                          <span className="text-red-500 text-xs">
                            {errors.discountType}
                          </span>
                        )}
                      </div>
                      <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
                      >
                        <option value="Drink">Drink</option>
                        <option value="Food">Food</option>
                        <option value="All">All</option>
                      </select>
                    </div>

                    {/* Discount Percent */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium">
                          {t("vouchers.discountPercent")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {errors.discountPercent && (
                          <span className="text-red-500 text-xs">
                            {errors.discountPercent}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                        placeholder="e.g. 25"
                        min="1"
                        max="100"
                      />
                    </div>

                    {/* Start Date */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium">
                          {t("vouchers.startDate")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {errors.startDate && (
                          <span className="text-red-500 text-xs">
                            {errors.startDate}
                          </span>
                        )}
                      </div>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                      />
                    </div>

                    {/* End Date */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium">
                          {t("vouchers.endDate")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {errors.endDate && (
                          <span className="text-red-500 text-xs">
                            {errors.endDate}
                          </span>
                        )}
                      </div>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm mb-1 font-medium">
                        {t("vouchers.status")}
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
                      >
                        <option value="Active">{t("vouchers.active")}</option>
                        <option value="Inactive">
                          {t("vouchers.inactive")}
                        </option>
                      </select>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium">
                          {t("vouchers.description")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {errors.description && (
                          <span className="text-red-500 text-xs">
                            {errors.description}
                          </span>
                        )}
                      </div>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 h-32"
                        placeholder={`${t("common.enter")} ${t("vouchers.description")}`}
                      />
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-8 py-2 rounded-md hover:bg-blue-600"
                    >
                      {t("vouchers.addVoucher")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVoucher;

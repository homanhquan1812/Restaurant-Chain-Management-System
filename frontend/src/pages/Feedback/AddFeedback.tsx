import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addFeedback } from "../../redux/slices/feedbackSlice";
import { fetchBranches } from "../../redux/slices/branchSlice";
import { fetchProducts } from "../../redux/slices/productSlice";
import { useLoading } from "../../contexts/LoadingContext";
import type { RootState } from "../../redux/store";

const AddFeedback: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { t } = useTranslation();
  const { items: branches } = useAppSelector(
    (state: RootState) => state.branches
  );
  const { items: products } = useAppSelector(
    (state: RootState) => state.products
  );

  const [status, setStatus] = useState("Pending");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [content, setContent] = useState("");
  const [branchId, setBranchId] = useState("");
  const [solvedBy, setSolvedBy] = useState("");
  const [feedbackType, setFeedbackType] = useState("Complaint");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchProducts());
  }, [dispatch]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!customerPhone.trim()) newErrors.customerPhone = "Required";
    if (!customerName.trim()) newErrors.customerName = "Required";
    if (!feedbackType.trim()) newErrors.feedbackType = "Required";
    if (!content.trim()) newErrors.content = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckPhone = () => {
    // Simulate checking phone number in database
    console.log("Checking phone:", customerPhone);
    // In a real app, you would fetch customer data based on phone number
    if (customerPhone.length >= 10) {
      setCustomerName("John Doe");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      await dispatch(
        addFeedback({
          customer_id: customerPhone, // Using phone as customer ID for simplicity
          customer_name: customerName,
          customer_phone: customerPhone,
          branch_id: branchId || "",
          type: feedbackType,
          content: content,
          status: status,
          solved_by: solvedBy || "",
        })
      ).unwrap();

      navigate("/feedback");
    } catch (error) {
      console.error("Failed to add feedback:", error);
      alert(t("feedback.addError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="main-content">
          <div className="dashboard-body p-6">
            <div className="mx-auto">
              <h1 className="text-2xl font-bold text-neutral-800 mb-6">
                {t("feedback.addNewFeedback")}
              </h1>

              <div className="bg-white rounded-xl p-8 shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Status */}
                    {/* <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("feedback.status")}
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
                      >
                        <option value="Pending">{t("feedback.pending")}</option>
                        <option value="Resolved">
                          {t("feedback.resolved")}
                        </option>
                        <option value="In Progress">
                          {t("feedback.inProgress")}
                        </option>
                      </select>
                    </div> */}
                    <div className="hidden md:block"></div>{" "}
                    {/* Empty div for grid alignment */}
                    {/* Customer Phone */}
                    {/* <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("feedback.customerPhone")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="flex-1 border border-gray-300 rounded-l-md px-4 py-2"
                          placeholder="077-XXX-XXXX"
                        />
                        <button
                          type="button"
                          onClick={handleCheckPhone}
                          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
                        >
                          {t("common.check")}
                        </button>
                      </div>
                      {errors.customerPhone && (
                        <span className="text-red-500 text-xs mt-1">
                          {errors.customerPhone}
                        </span>
                      )}
                    </div> */}
                    {/* Customer Name - CHUYỂN THÀNH SELECT ĐỂ LẤY NAME +ID BE CHỈ CHO PHÉP  GỬI PAYLOAD VS CUSTOMER_IID */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("feedback.customerName")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                        placeholder={`${t("common.enter")} ${t("feedback.customerName")}`}
                      />
                      {errors.customerName && (
                        <span className="text-red-500 text-xs mt-1">
                          {errors.customerName}
                        </span>
                      )}
                    </div>
                    {/* Content */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">
                        {t("feedback.content")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 h-32"
                        placeholder={`${t("common.enter")} ${t("feedback.content")}`}
                      />
                      {errors.content && (
                        <span className="text-red-500 text-xs mt-1">
                          {errors.content}
                        </span>
                      )}
                    </div>
                    {/* Branch Responsible */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("feedback.branchResponsible")}
                      </label>
                      <select
                        value={branchId}
                        onChange={(e) => setBranchId(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
                      >
                        <option value="">{t("feedback.chooseBranch")}</option>
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.address || "Unknown Branch"}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Staff Responsible */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("feedback.staffResponsible")}
                      </label>
                      <select
                        value={solvedBy}
                        onChange={(e) => setSolvedBy(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
                      >
                        <option value="">{t("feedback.chooseStaff")}</option>
                        <option value="f6b8d0f6-a8b0-c2d4-e6f8-a0b2c4d6e8f0">
                          Olivia Wilson
                        </option>
                        <option value="a7c9e1a7-b0c2-d4e6-f8a0-b2c4d6e8f0a2">
                          Ethan Davis
                        </option>
                        <option value="b8d0f2b8-c2d4-e6f8-a0b2-c4d6e8f0a2b4">
                          Isabella Miller
                        </option>
                      </select>
                    </div>
                    {/* Feedback Type */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("feedback.type")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={feedbackType}
                        onChange={(e) => setFeedbackType(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
                      >
                        <option value="Complaint">
                          {t("feedback.complaint")}
                        </option>
                        <option value="Suggestion">
                          {t("feedback.suggestion")}
                        </option>
                        <option value="Praise">{t("feedback.praise")}</option>
                      </select>
                      {errors.feedbackType && (
                        <span className="text-red-500 text-xs mt-1">
                          {errors.feedbackType}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-8 py-2 rounded-md hover:bg-blue-600"
                    >
                      {t("feedback.addFeedback")}
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

export default AddFeedback;

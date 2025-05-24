import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchFeedbackById,
  editFeedback,
} from "../../redux/slices/feedbackSlice";
import { fetchBranches } from "../../redux/slices/branchSlice";
import { fetchProducts } from "../../redux/slices/productSlice";
import { useLoading } from "../../contexts/LoadingContext";
import type { RootState } from "../../redux/store";

const EditFeedback: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { t } = useTranslation();
  const { selectedFeedback, loading, error } = useAppSelector(
    (state: RootState) => state.feedbacks
  );
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

    if (id) {
      setLoading(true);
      dispatch(fetchFeedbackById(id)).finally(() => {
        setLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (selectedFeedback) {
      console.log("Selected feedback:", selectedFeedback);
      setStatus(selectedFeedback.status || "Pending");
      setCustomerPhone(selectedFeedback.customer_phone || "");
      setCustomerName(selectedFeedback.customer_name || "");
      setContent(selectedFeedback.content || "");
      setBranchId(selectedFeedback.branch_id || "");
      setSolvedBy(selectedFeedback.solved_by || "");
      setFeedbackType(selectedFeedback.type || "Complaint");
    }
  }, [selectedFeedback]);

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
    if (!validateForm() || !id) return;

    try {
      setLoading(true);

      await dispatch(
        editFeedback({
          id,
          feedback: {
            customer_id: customerPhone, // Using phone as customer ID for simplicity
            customer_name: customerName,
            customer_phone: customerPhone,
            content: content,
            status: status,
            type: feedbackType,
            branch_id: branchId || "",
            solved_by: solvedBy || "",
          },
        })
      ).unwrap();

      navigate("/feedback");
    } catch (error) {
      console.error("Failed to update feedback:", error);
      alert(t("feedback.updateError"));
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!selectedFeedback && !loading)
    return (
      <div className="p-4 text-red-500">{t("feedback.noFeedbackFound")}</div>
    );

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="main-content">
          <div className="dashboard-body p-6">
            <div className="mx-auto">
              <h1 className="text-2xl font-bold text-neutral-800 mb-6">
                {t("feedback.editFeedback")}
              </h1>

              <div className="bg-white rounded-xl p-8 shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Resolved">Resolved</option>
                        <option value="In Progress">In Progress</option>
                      </select>
                    </div>
                    <div className="hidden md:block"></div>{" "}
                    {/* Empty div for grid alignment */}
                    {/* Customer Phone */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Customer Phone <span className="text-red-500">*</span>
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
                          Check
                        </button>
                      </div>
                      {errors.customerPhone && (
                        <span className="text-red-500 text-xs mt-1">
                          {errors.customerPhone}
                        </span>
                      )}
                    </div>
                    {/* Customer Name */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Customer Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                        placeholder="Enter name"
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
                        Content <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 h-32"
                        placeholder="Enter feedback content"
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
                        Branch Responsible
                      </label>
                      <select
                        value={branchId}
                        onChange={(e) => setBranchId(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
                      >
                        <option value="">--- Choose Branch ---</option>
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
                        Staff Responsible
                      </label>
                      <select
                        value={solvedBy}
                        onChange={(e) => setSolvedBy(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
                      >
                        <option value="">--- Choose Staff ---</option>
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
                        Feedback Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={feedbackType}
                        onChange={(e) => setFeedbackType(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
                      >
                        <option value="Complaint">Complaint</option>
                        <option value="Suggestion">Suggestion</option>
                        <option value="Praise">Praise</option>
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
                      {t("common.update")}
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

export default EditFeedback;

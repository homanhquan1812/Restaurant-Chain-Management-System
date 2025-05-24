import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FilterBar from "./FilterBar";
import FeedbackTable from "./FeedbackTable";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchFeedbacks,
  removeFeedback,
} from "../../redux/slices/feedbackSlice";
import { useLoading } from "../../contexts/LoadingContext";
import type { RootState } from "../../redux/store";

import type { FeedbackItem } from "../../types/FeedbackItem";

const FeedbackList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { t } = useTranslation();
  const {
    items: rawFeedbacks,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.feedbacks);

  const feedbacks = useMemo<FeedbackItem[]>(() => {
    // Kiểm tra xem rawFeedbacks có phải là một mảng không
    if (!Array.isArray(rawFeedbacks)) {
      console.error("rawFeedbacks is not an array:", rawFeedbacks);
      return [];
    }

    return rawFeedbacks.map((f) => ({
      id: f.id,
      displayId: f.display_id,
      type: f.type || "Complaint",
      fullName: f.customer_name || "",
      phoneNumber: f.customer_phone || "",
      feedback: f.content || "",
      createAt: f.date_added ? new Date(f.date_added).toLocaleString() : "",
      updateAt: f.updated_at ? new Date(f.updated_at).toLocaleString() : "",
      status: f.status || "Pending",
      responsible: {
        branchResponsible: f.branch_address || "",
        employeeResponsible: f.staff_name,
      },
      branchAddress: f.branch_address || "",
      brandName: f.brand_name || "",
      staffName: f.staff_name || "",
      customerName: f.customer_name || "",

      // Các trường bổ sung
      customerId: f.customer_id,
      branchId: f.branch_id,
      solvedBy: f.solved_by,
    }));
  }, [rawFeedbacks]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchFeedbacks()).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleAddNew = () => {
    navigate("/feedback/add");
  };

  const handleEdit = (id: string) => {
    navigate(`/feedback/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t("feedback.deleteConfirm"))) {
      setLoading(true);
      try {
        await dispatch(removeFeedback(id)).unwrap();
      } catch (error) {
        console.error("Failed to delete feedback:", error);
        alert(t("feedback.deleteError"));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-neutral-800">
                {t("feedback.feedbackList")}
              </h1>
              <button
                onClick={handleAddNew}
                className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600"
              >
                {t("feedback.addNewFeedback")}
              </button>
            </div>

            <FilterBar />

            {loading && <p>{t("feedback.loadingFeedbacks")}</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && feedbacks.length === 0 && (
              <p>{t("feedback.noFeedbackFound")}</p>
            )}

            <FeedbackTable
              items={feedbacks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
  );
};

export default FeedbackList;

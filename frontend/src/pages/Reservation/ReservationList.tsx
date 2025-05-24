import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import FilterBar from "./FilterBar";
import ReservationTable from "./ReservationTable";
import type { ReservationItem } from "../../types/ReservationItem";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchReservations,
  removeReservation,
} from "../../redux/slices/reservationSlice";
import type { RootState } from "../../redux/store";
import { useLoading } from "../../contexts/LoadingContext";

const ReservationList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const {
    items: rawReservations,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.reservations);

  const reservations = useMemo<ReservationItem[]>(() => {
    // Kiểm tra xem rawReservations có phải là một mảng không
    if (!Array.isArray(rawReservations)) {
      console.error("rawReservations is not an array:", rawReservations);
      return [];
    }

    return rawReservations.map((r) => ({
      id: r.id,
      displayId: r.display_id,
      fullName: r.full_name,
      phoneNumber: r.phone,
      branchId: r.branch_id,
      reservationDate: new Date(r.reservation_date).toLocaleDateString(),
      reservationTime: r.reservation_time,
      numberOfCustomers: r.number_of_customer,
      status: r.status,
      place: r.place,
      dateAdded: r.date_added,
      brandName: r.brand_name,
      branchAddress: r.branch_address,

      // Các trường bổ sung cho tương thích ngược
      customerName: r.full_name,
      customerId: r.customer_id,
      branchName: r.branch_name,
      partySize: r.number_of_customer,
      specialRequests: r.special_requests,
    }));
  }, [rawReservations]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchReservations()).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleDeleteReservation = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      try {
        setLoading(true);
        await dispatch(removeReservation(id)).unwrap();
      } catch (error) {
        console.error("Failed to delete reservation:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-4">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-800">
          Reservation Lists
        </h1>
        <button
          onClick={() => navigate("/reservation/add")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md transition-colors"
        >
          Add New Reservation
        </button>
      </div>

      <FilterBar />

      {loading && <p>Loading reservations...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && reservations.length === 0 && (
        <p>No reservations found.</p>
      )}

      <ReservationTable
        items={reservations}
        onEdit={(id) => navigate(`/reservation/edit/${id}`)}
        onDelete={handleDeleteReservation}
      />
    </div>
    </div>

  );
};

export default ReservationList;

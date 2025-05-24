import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchReservationById,
  editReservation,
} from "../../redux/slices/reservationSlice";
import { fetchBranches } from "../../redux/slices/branchSlice";
import { useLoading } from "../../contexts/LoadingContext";
import type { RootState } from "../../redux/store";

const EditReservation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { selectedReservation, loading, error } = useAppSelector(
    (state: RootState) => state.reservations
  );
  const { items: branches } = useAppSelector(
    (state: RootState) => state.branches
  );

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [branchId, setBranchId] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [numberOfCustomers, setNumberOfCustomers] = useState(1);
  const [place, setPlace] = useState("Indoor");
  const [status, setStatus] = useState("Pending");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    dispatch(fetchBranches());

    if (id) {
      setLoading(true);
      dispatch(fetchReservationById(id)).finally(() => {
        setLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (selectedReservation) {
      setFullName(selectedReservation.full_name || "");
      setPhone(selectedReservation.phone || "");
      setBranchId(selectedReservation.branch_id);
      setReservationDate(selectedReservation.reservation_date.split("T")[0]);
      setReservationTime(selectedReservation.reservation_time);
      setNumberOfCustomers(selectedReservation.number_of_customer);
      setPlace(selectedReservation.place || "Indoor");
      setStatus(selectedReservation.status);
    }
  }, [selectedReservation]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = "Required";
    if (!phone.trim()) newErrors.phone = "Required";
    if (!branchId) newErrors.branchId = "Required";
    if (!reservationDate) newErrors.reservationDate = "Required";
    if (!reservationTime) newErrors.reservationTime = "Required";
    if (numberOfCustomers < 1)
      newErrors.numberOfCustomers = "Must be at least 1";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !id) return;

    try {
      setLoading(true);

      await dispatch(
        editReservation({
          id,
          reservation: {
            full_name: fullName,
            phone: phone,
            branch_id: branchId,
            reservation_date: reservationDate,
            reservation_time: reservationTime,
            number_of_customer: numberOfCustomers,
            place: place,
            status: status,
          },
        })
      ).unwrap();

      navigate("/reservation");
    } catch (error) {
      console.error("Failed to update reservation:", error);
      alert("Failed to update reservation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!selectedReservation && !loading)
    return <div className="p-4 text-red-500">Reservation not found.</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="main-content">
          <div className="dashboard-body p-6">
            <div className="mx-auto space-y-6">
              <div
                className="text-sm text-blue-600 cursor-pointer"
                onClick={() => navigate("/reservation")}
              >
                ← Back to Reservation List
              </div>

              <h1 className="text-3xl font-bold text-neutral-800">
                Edit Reservation
              </h1>

              <div className="bg-white rounded-xl p-8 shadow-md px-[250px]">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        {errors.fullName && (
                          <span className="text-red-500 text-xs">
                            {errors.fullName}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                        placeholder="Enter full name"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        {errors.phone && (
                          <span className="text-red-500 text-xs">
                            {errors.phone}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                        placeholder="Enter phone number"
                      />
                    </div>

                    {/* Branch */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium">
                          Branch <span className="text-red-500">*</span>
                        </label>
                        {errors.branchId && (
                          <span className="text-red-500 text-xs">
                            {errors.branchId}
                          </span>
                        )}
                      </div>
                      <select
                        value={branchId}
                        onChange={(e) => setBranchId(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
                      >
                        <option value="">Select a branch</option>
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.address || "Unknown Branch"}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Number of Customers */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium">
                          Number of Customers{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {errors.numberOfCustomers && (
                          <span className="text-red-500 text-xs">
                            {errors.numberOfCustomers}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        value={numberOfCustomers}
                        onChange={(e) =>
                          setNumberOfCustomers(Number(e.target.value))
                        }
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                        min="1"
                      />
                    </div>

                    {/* Reservation Date */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium">
                          Reservation Date{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {errors.reservationDate && (
                          <span className="text-red-500 text-xs">
                            {errors.reservationDate}
                          </span>
                        )}
                      </div>
                      <input
                        type="date"
                        value={reservationDate}
                        onChange={(e) => setReservationDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                      />
                    </div>

                    {/* Reservation Time */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium">
                          Reservation Time{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {errors.reservationTime && (
                          <span className="text-red-500 text-xs">
                            {errors.reservationTime}
                          </span>
                        )}
                      </div>
                      <input
                        type="time"
                        value={reservationTime}
                        onChange={(e) => setReservationTime(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm mb-1 font-medium">
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    {/* Place */}
                    <div>
                      <label className="block text-sm mb-1 font-medium">
                        Place
                      </label>
                      <select
                        value={place}
                        onChange={(e) => setPlace(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
                      >
                        <option value="Indoor">Indoor</option>
                        <option value="Outdoor">Outdoor</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-8 py-2 rounded-md hover:bg-blue-600"
                    >
                      Save Changes
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

export default EditReservation;

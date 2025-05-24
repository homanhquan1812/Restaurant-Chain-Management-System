import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchCustomerById,
  editCustomer,
} from "../../redux/slices/customerSlice";
import { useLoading } from "../../contexts/LoadingContext";
import type { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import { CustomDatePicker } from "../../components/CustomDatePicker/CustomDatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const EditCustomer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();

  const { selectedCustomer, loading, error } = useAppSelector(
    (state: RootState) => state.customers
  );

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState<Date | undefined>();
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [avatarBase64, setAvatarBase64] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(fetchCustomerById(id)).finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    if (selectedCustomer) {
      setFullName(selectedCustomer.full_name);
      setUsername(selectedCustomer.username);
      setEmail(selectedCustomer.email);
      setPassword(selectedCustomer.password);
      setPhone(selectedCustomer.phone || "");
      setGender(selectedCustomer.gender || "");
      setAddress(selectedCustomer.address || "");
      setStatus(selectedCustomer.status || "");
      if (selectedCustomer.dob) {
        const parsed = new Date(selectedCustomer.dob);
        if (!isNaN(parsed.getTime())) {
          setDob(parsed);
        }
      }
      setAvatarBase64(selectedCustomer.avatar || "");
    }
  }, [selectedCustomer]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = "Required";
    if (!username.trim()) newErrors.username = "Required";
    if (!email.trim()) newErrors.email = "Required";
    if (!password.trim()) newErrors.password = "Required";
    if (!phone.trim()) newErrors.phone = "Required";
    if (!gender) newErrors.gender = "Required";
    if (!address.trim()) newErrors.address = "Required";
    if (!status.trim()) newErrors.status = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !id) return;

    try {
      setLoading(true);

      await dispatch(
        editCustomer({
          id,
          customer: {
            full_name: fullName,
            username,
            password,
            email,
            phone,
            gender,
            dob: dob ? dob.toISOString() : "",
            avatar: avatarBase64,
            address,
            // status,
          },
        })
      );

    toast.success("Customer updated successfully!");
    navigate("/customer", { state: { updated: true } });

    } catch (error) {
      console.error("Failed to update customer:", error);
      toast.error("Failed to update customer. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!selectedCustomer && !loading)
    return <div className="p-4 text-red-500">Customer not found.</div>;

  return (
    <div className="p-6 mx-auto space-y-6">
      <div
        className="text-sm text-blue-600 cursor-pointer"
        onClick={() => navigate("/customer")}
      >
        ← Back to Customer List
      </div>

      <h1 className="text-3xl font-bold text-neutral-800">Edit Customer</h1>

      <div className="bg-white rounded-xl p-8 shadow-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium block mb-1">Full Name *</label>
            <input
              type="text"
              className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="text-sm font-medium block mb-1">Username *</label>
            <input
              type="text"
              className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium block mb-1">Email *</label>
            <input
              type="email"
              className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium block mb-1">Password *</label>
            <input
              type="password"
              className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium block mb-1">Phone *</label>
            <input
              type="tel"
              className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm font-medium block mb-1">Gender *</label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-sm font-medium block mb-1">Date of Birth</label>
            <CustomDatePicker
              value={dob}
              onChange={setDob}
              placeholder="Pick a date"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium block mb-1">Address *</label>
            <input
              type="text"
              className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
          </div>

          {/* Status */}
          {/* <div>
            <label className="text-sm font-medium block mb-1">Status *</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-red-500 text-xs">{errors.status}</p>}
          </div> */}

          {/* Submit */}
          <div className="text-center md:col-span-2 pt-4">
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
  );
};

export default EditCustomer;

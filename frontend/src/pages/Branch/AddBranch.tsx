import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { createBranch } from "../../services/branch.service";
import { useAppDispatch } from "../../redux/hooks";
import { fetchBranches } from "../../redux/slices/branchSlice";
import { toast } from "react-toastify";
import { getAllEmployees, type Employee } from "../../services/employee.service";
import { useTranslation } from "react-i18next";

interface AddBranchProps {
  brandId: string;
}

const AddBranch: React.FC<AddBranchProps> = ({ brandId }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [managers, setManagers] = useState<Employee[]>([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    address: "",
    manager: "",
    quantity: "",
    status: "Active",
  });

  const dispatch = useAppDispatch();

  const statuses = ["Active", "Inactive"];

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const employees = await getAllEmployees();
        const branchManagers = employees.filter((e) => e.role === "Branch Manager");
        setManagers(branchManagers);
      } catch (error) {
        console.error("Failed to fetch managers:", error);
        toast.error("Failed to load managers");
      }
    };

    if (open) fetchManagers();
  }, [open]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createBranch({
        brand_id: brandId,
        address: form.address,
        phone: form.location,
        status: form.status,
      });

      toast.success("Branch created successfully!");
      dispatch(fetchBranches());
      setOpen(false);
    } catch (error) {
      console.error("Create branch failed:", error);
      toast.error("Failed to create branch.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-blue-500 text-white px-5 py-2 rounded-md">{t("branch.addNewBranch")}</button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{t("branch.addBranch")}</DialogTitle>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Name */}
          <div>
          <label className="text-sm font-medium block mb-1">{t("branch.name")}</label>
          <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Location */}
          <div>
          <label className="text-sm font-medium block mb-1">{t("branch.city")}</label>
          <input
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
          <label className="text-sm font-medium block mb-1">{t("branch.address")}</label>
          <input
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Manager */}
          <div>
          <label className="text-sm font-medium block mb-1">{t("branch.manager")}</label>
          <Select value={form.manager} onValueChange={(val) => handleChange("manager", val)}>
              <SelectTrigger className="w-full bg-gray-100">
              <SelectValue placeholder={t("branch.search.allManagers") || "Select manager"} />
              </SelectTrigger>
              <SelectContent>
                {managers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div>
          <label className="text-sm font-medium block mb-1">{t("branch.staffCount")}</label>
          <input
              value={form.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Status */}
          <div>
          <label className="text-sm font-medium block mb-1">{t("branch.status")}</label>
          <Select value={form.status} onValueChange={(val) => handleChange("status", val)}>
              <SelectTrigger className="w-full bg-gray-100">
              <SelectValue placeholder={t("branch.search.status") || "Select status"} />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <div className="sm:col-span-2 mt-4 text-center">
            <button type="submit" className="bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold">
            {t("branch.addBranch")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBranch;

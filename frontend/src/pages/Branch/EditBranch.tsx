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
import type { BranchItem } from "../../types/BranchItem";
import { getBrandById, updateBranch } from "../../services/branch.service";
import { getAllEmployees } from "../../services/employee.service";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface EditBranchProps {
  trigger: React.ReactNode;
  branch: BranchItem;
}

const EditBranch: React.FC<EditBranchProps> = ({ trigger, branch }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: branch.name,
    location: branch.location,
    address: branch.address,
    manager: branch.manager, // should be managerId
    quantity: branch.employees.toString(),
    status: branch.status || "Prepare",
  });

  const [brandInfo, setBrandInfo] = useState<{ name: string; count: number } | null>(null);
  const [managerOptions, setManagerOptions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchBrandInfo = async () => {
      if (branch.brandId) {
        const info = await getBrandById(branch.brandId);
        if (info) {
          setBrandInfo({
            name: info.brand_name,
            count: info.total_branches,
          });
        }
      }
    };
    if (open) fetchBrandInfo();
  }, [open, branch.brandId]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const staff = await getAllEmployees();
        const filtered = staff.filter(
          (emp) =>
            emp.role.trim().toLowerCase() === "branch manager" &&
            emp.brand_id === branch.brandId
        );
        setManagerOptions(filtered.map((m) => ({ id: m.id, name: m.full_name })));
      } catch (error) {
        console.error("Failed to fetch managers", error);
        setManagerOptions([]);
      }
    };

    if (open) fetchManagers();
  }, [open, branch]);

  const statuses = ["Prepare", "Open", "Closed"];

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateBranch(branch.id, {
        address: form.address,
        phone: "0123456789", // optional
        status: form.status,
      });
      toast.success(t("branch.branchUpdated"));
      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(t("branch.deleteError"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle>{t("branch.editBranch")}</DialogTitle>

        {brandInfo && (
          <div className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">{t("branch.brand")}:</span> {brandInfo.name} —{" "}
            <span className="italic">{brandInfo.count} branch(es)</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm font-medium block mb-1">{t("branch.name")}</label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md bg-gray-100"
              disabled
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">{t("branch.city")}</label>
            <input
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md bg-gray-100"
              disabled
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium block mb-1">{t("branch.address")}</label>
            <input
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Manager Dropdown */}
          <div>
            <label className="text-sm font-medium block mb-1">{t("branch.manager")}</label>
            <Select value={form.manager} onValueChange={(val) => handleChange("manager", val)}>
              <SelectTrigger className="w-full bg-gray-100">
                <SelectValue placeholder={t("branch.search.allManagers")} />
              </SelectTrigger>
              <SelectContent>
                {managerOptions.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Staff count */}
          <div>
            <label className="text-sm font-medium block mb-1">{t("branch.staffCount")}</label>
            <input
              value={form.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md bg-gray-100"
              disabled
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium block mb-1">{t("branch.status")}</label>
            <Select value={form.status} onValueChange={(val) => handleChange("status", val)}>
              <SelectTrigger className="w-full bg-gray-100">
                <SelectValue placeholder={t("branch.status")} />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(`branch.${s.toLowerCase()}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2 mt-4 text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold"
            >
              {t("common.update")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBranch;

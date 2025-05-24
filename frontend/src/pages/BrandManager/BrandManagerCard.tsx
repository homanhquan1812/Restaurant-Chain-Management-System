
import React from "react";
import type { EmployeeItem } from "../../types/EmployeeItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../components/ui/alert-dialog";
import { useAppDispatch } from "../../redux/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteStaffThunk } from "../../redux/slices/rcmsSlice";
import { useTranslation } from "react-i18next";
import { useLoading } from "../../contexts/LoadingContext";
import { toast } from "react-toastify";

interface BrandManagerCardProps {
  employee: EmployeeItem;
}

const BrandManagerCard: React.FC<BrandManagerCardProps> = ({ employee }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { t } = useTranslation();

  return (
    <div className="w-full bg-white rounded-lg shadow-md border border-neutral-300 flex flex-col items-center px-4 py-2">
      <div className="w-full flex justify-between items-center px-2">
        <div className="flex space-x-2">
          <button onClick={() => navigate(`/brand-manager/edit/${employee.id}`)} className="text-blue-500 hover:text-blue-700">
            <FontAwesomeIcon icon={faPen} />
          </button>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <button className="text-red-500 hover:text-red-700">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md bg-white rounded-xl border border-neutral-200 shadow-xl p-6">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg font-semibold text-neutral-800">
                  {t("brand.confirmDeleteTitle")}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-neutral-500">
                  {t("brand.confirmDeleteDesc")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4 flex justify-end gap-2">
                <AlertDialogCancel className="border border-neutral-300 rounded-md px-4 py-2 text-sm hover:bg-neutral-100">
                  {t("common.cancel")}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await dispatch(deleteStaffThunk(employee.id)).unwrap();
                      toast.success(t("brand.brandDeleted"));
                    } catch {
                      toast.error(t("brand.deleteError"));
                    } finally {
                      setLoading(false);
                      setOpen(false);
                    }
                  }}

                  className="bg-red-500 text-white rounded-md px-4 py-2 text-sm hover:bg-red-600"
                >
                  {t("common.confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {employee.brandLogo && (
          <img src={employee.brandLogo} alt="Brand Logo" className="w-10 h-10 rounded-full border" />
        )}
      </div>

      <div className="mt-1">
        {employee.avatarUrl && (
          <img src={employee.avatarUrl} alt={employee.name} className="w-24 h-24 object-cover rounded-full border" />
        )}
      </div>

      <div className="text-center mt-4 space-y-1">
        <h3 className="text-lg font-semibold text-gray-800">{employee.name}</h3>
        <p className="text-sm text-gray-600">{t("brand.role")}</p>
        <p className="text-gray-500 text-sm">{t("common.phone")}: {employee.phone}</p>
        <p className="text-blue-600 text-sm hover:underline cursor-pointer">{employee.email}</p>
      </div>
    </div>
  );
};

export default BrandManagerCard;

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
import { deleteEmployeeThunk } from "../../redux/slices/employeeSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface EmployeeCardProps {
  employee: EmployeeItem;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-neutral-300 relative flex flex-col items-center px-4 py-2">
      {/* Header: Logo + Nút Edit & Delete */}
        <div className="relative w-full flex items-center justify-between px-2">
        {/* Nút chức năng */}
        <div className="flex space-x-2">
            <button       
              onClick={() => navigate(`/employee/edit/${employee.id}`)}
              className="text-blue-500 hover:text-blue-700"
            >
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
                    Delete Employee
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-neutral-500">
                    Are you sure you want to delete this employee? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4 flex justify-end gap-2">
                  <AlertDialogCancel className="border border-neutral-300 rounded-md px-4 py-2 text-sm hover:bg-neutral-100">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      dispatch(deleteEmployeeThunk(employee.id));
                      setOpen(false);
                    }}
                    className="bg-red-500 text-white rounded-md px-4 py-2 text-sm hover:bg-red-600"
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>

            </AlertDialog>

        </div>
        {/* Logo thương hiệu */}
        {employee.brandLogo && (
          <img
            src={employee.brandLogo}
            alt="Brand Logo"
            className="w-10 h-10 rounded-full border border-neutral-300 bg-white"
          />
        )}

        </div>

      {/* Ảnh đại diện */}
      <div className="mt-1">
        {employee.avatarUrl && (
          <img
            src={employee.avatarUrl}
            alt={employee.name}
            className="w-24 h-24 object-cover rounded-full border border-neutral-300"
          />
        )}
      </div>

      {/* Thông tin nhân viên */}
      <div className="text-center mt-4 space-y-1">
        <h3 className="text-lg font-semibold text-gray-800">{employee.name}</h3>
        <p className="text-sm text-gray-600">{employee.role}</p>
        <p className="text-gray-500 text-sm">Branch: {employee.branch}</p>
        <p className="text-gray-500 text-sm">Phone: {employee.phone}</p>
        <p className="text-blue-600 text-sm hover:underline cursor-pointer">{employee.email}</p>
      </div>
    </div>
  );
};

export default EmployeeCard;

import React from "react";
import type { ReservationItem } from "../../types/ReservationItem";
import GenericTable from "../../components/Table/GenericTable";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ReservationTableProps {
  items: ReservationItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ReservationTable: React.FC<ReservationTableProps> = ({
  items,
  onEdit,
  onDelete,
}) => {
  const renderStatus = (status: ReservationItem["status"]) => {
    const colorMap: Record<ReservationItem['status'], string> = {
      Waiting: 'bg-yellow-100 text-yellow-700',
      Confirmed: 'bg-sky-100 text-blue-700',
      Completed: 'bg-green-100 text-green-700',
      Cancelled: 'bg-red-100 text-red-700',
      Active: 'bg-sky-100 text-blue-700',
      Cancel: 'bg-gray-300 text-gray-600',
    };

    // Mặc định nếu không tìm thấy status trong colorMap
    const colorClass = colorMap[status] || "bg-gray-100 text-gray-700";

    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-sm ${colorClass} whitespace-nowrap`}
      >
        {status}
      </span>
    );
  };

  const columns: {
    key: keyof ReservationItem | "action" | "_index";
    label: string;
    width?: string;
    align?: "center" | "left" | "right";
    render?: (item: ReservationItem) => React.ReactNode;
  }[] = [
    {
      key: "_index",
      label: "No.",
      align: "center",
      render: (item) => (
        <span className="text-gray-600 text-sm">
          {items.findIndex((i) => i.id === item.id) + 1}
        </span>
      ),
    },
    {
      key: "displayId",
      label: "ID",
      render: (item) => (
        <div
          className="max-w-20 font-semibold text-sm overflow-hidden whitespace-nowrap text-ellipsis"
          title={item.displayId}
        >
          {item.displayId}
        </div>
      ),
    },
    {
      key: "fullName",
      label: "Full Name",
      render: (item) => (
        <div
          className="max-w-28 font-semibold text-sm overflow-hidden whitespace-nowrap text-ellipsis"
          title={item.fullName}
        >
          {item.fullName}
        </div>
      ),
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      render: (item) => (
        <div
          className="text-sm overflow-hidden whitespace-nowrap text-ellipsis"
          title={item.phoneNumber}
        >
          {item.phoneNumber}
        </div>
      ),
    },
    {
      key: "reservationDate",
      label: "Date",
      render: (item) => (
        <div
          className="text-sm overflow-hidden whitespace-nowrap text-ellipsis"
          title={`${item.reservationDate}`}
        >
          {item.reservationDate}
        </div>
      ),
    },
    {
      key: "reservationTime",
      label: "Time",
      render: (item) => (
        <div
          className="text-sm overflow-hidden whitespace-nowrap text-ellipsis"
          title={item.reservationTime}
        >
          {item.reservationTime}
        </div>
      ),
    },
    {
      key: "branchAddress",
      label: "Branch",
      render: (item) => (
        <div
          className="max-w-40 text-sm overflow-hidden whitespace-nowrap text-ellipsis"
          title={item.branchAddress}
        >
          {item.branchAddress}
        </div>
      ),
    },
    {
      key: "numberOfCustomers",
      label: "People",
      render: (item) => (
        <div className="text-center">{item.numberOfCustomers}</div>
      ),
    },
    {
      key: "place",
      label: "In/Outdoor",
      align: "center",
      render: (item) => renderStatus(item.place),
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (item) => renderStatus(item.status),
    },
    {
      key: "action",
      label: "Action",
      align: "center",
      render: (item) => (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onEdit(item.id)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FontAwesomeIcon icon={faPen} size="sm" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-red-500 hover:text-red-700"
          >
            <FontAwesomeIcon icon={faTrash} size="sm" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <GenericTable<ReservationItem>
        items={items}
        columns={columns}
        itemsPerPage={10}
      />
    </div>
  );
};

export default ReservationTable;

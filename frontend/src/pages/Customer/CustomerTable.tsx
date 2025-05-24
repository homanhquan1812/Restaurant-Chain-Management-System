import React from "react";
import { useTranslation } from "react-i18next";
import type { CustomerItem } from "../../types/CustomerItem";
import GenericTable from "../../components/Table/GenericTable";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CustomerTableProps {
  items: CustomerItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  items,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const renderStatus = (status: CustomerItem["status"]) => {
    const colorMap: Record<CustomerItem["status"], string> = {
      Completed: "bg-green-100 text-green-700",
      Inactive: "bg-gray-200 text-gray-600",
      Active: "bg-green-100 text-green-700",
    };

    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-sm ${colorMap[status]} whitespace-nowrap`}
      >
        {status}
      </span>
    );
  };

  const columns: {
    key: keyof CustomerItem | "action" | "_index" | "phone";
    label: string;
    width?: string;
    align?: "center" | "left" | "right";
    render?: (item: CustomerItem) => React.ReactNode;
  }[] = [
    {
      key: "_index",
      label: t("orders.no"),
      align: "center",
      render: (item) => (
        <span className="text-gray-600 text-sm">
          {items.findIndex((i) => i.id === item.id) + 1}
        </span>
      ),
    },
    {
      key: "id",
      label: t("orders.id"),
      render: (item) => (
        <div
          className="max-w-20 font-semibold text-sm overflow-hidden whitespace-nowrap text-ellipsis"
          title={item.id}
        >
          {item.displayId}
        </div>
      ),
    },
    {
      key: "fullName",
      label: t("customer.fullName"),
      render: (item) => (
        <div
          className="w-fit font-semibold text-sm overflow-hidden whitespace-nowrap text-ellipsis"
          title={item.fullName}
        >
          {item.fullName}
        </div>
      ),
    },
    {
      key: "email",
      label: t("customer.email"),
      render: (item) => (
        <div
          className="w-fit text-sm overflow-hidden whitespace-nowrap text-ellipsis"
          title={item.email}
        >
          {item.email}
        </div>
      ),
    },
    {
      key: "phone",
      label: t("customer.phone"),
      render: (item) => (
        <div
          className="text-sm overflow-hidden whitespace-nowrap text-ellipsis"
          title={item.phone}
        >
          {item.phone}
        </div>
      ),
    },
    {
      key: "dateJoined",
      label: t("customer.memberSince"),
      render: (item) => (
        <div
          className="text-sm overflow-hidden whitespace-nowrap text-ellipsis"
          title={item.dateJoined}
        >
          {item.dateJoined}
        </div>
      ),
    },
    // {
    //   key: "totalOrder",
    //   label: t("customer.totalOrders"),
    // },
    // {
    //   key: "totalReservation",
    //   label: t("common.reservation"),
    // },
    // {
    //   key: "status",
    //   label: t("customer.status"),
    //   render: (item) => renderStatus(item.status),
    // },
    {
      key: "action",
      label: t("common.actions"),
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
      <GenericTable<CustomerItem>
        items={items}
        columns={columns}
        itemsPerPage={10}
      />
    </div>
  );
};

export default CustomerTable;

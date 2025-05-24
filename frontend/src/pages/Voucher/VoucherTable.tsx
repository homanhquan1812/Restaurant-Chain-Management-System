import React from "react";
import { useTranslation } from "react-i18next";
import type { VoucherItem } from "../../types/VoucherItem";
import GenericTable from "../../components/Table/GenericTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

interface VoucherTableProps {
  items: VoucherItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const VoucherTable: React.FC<VoucherTableProps> = ({
  items,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const renderStatus = (status: VoucherItem["status"]) => {
    const colorMap: Record<string, string> = {
      Active: "bg-green-100 text-green-700",
      Expired: "bg-gray-200 text-gray-600",
      Inactive: "bg-yellow-100 text-yellow-700",
    };

    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-sm ${colorMap[status] || "bg-gray-100 text-gray-500"} whitespace-nowrap`}
      >
        {t(`vouchers.${status.toLowerCase()}`)}
      </span>
    );
  };

  const columns: {
    key: keyof VoucherItem | "action" | "_index";
    label: string;
    align?: "center" | "left" | "right";
    render?: (item: VoucherItem) => React.ReactNode;
  }[] = [
    {
      key: "_index",
      label: t("vouchers.no"),
      align: "center",
      render: (item) => (
        <span className="text-gray-600 text-sm">
          {items.findIndex((i) => i.id === item.id) + 1}
        </span>
      ),
    },
    {
      key: "id",
      label: t("vouchers.id"),
      render: (item) => (
        <div
          className="max-w-20 font-medium text-sm overflow-hidden whitespace-nowrap text-ellipsis"
          title={item.id}
        >
          {item.displayId}
        </div>
      ),
    },
    {
      key: "type",
      label: t("vouchers.type"),
      render: (item) => (
        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-md bg-blue-100 text-blue-700 whitespace-nowrap">
          {item.type}
        </span>
      ),
    },
    {
      key: "title",
      label: t("vouchers.title"),
      render: (item) => (
        <div
          className="text-sm overflow-hidden whitespace-nowrap text-ellipsis"
          title={item.title}
        >
          {item.title}
        </div>
      ),
    },
    {
      key: "code",
      label: t("vouchers.code"),
      render: (item) => (
        <span className="text-sm">
          {item.code ? (
            item.code
          ) : (
            <span className="text-gray-400 italic">N/A</span>
          )}
        </span>
      ),
    },
    {
      key: "brand",
      label: t("products.brand"),
      render: (item) => (
        <div
          className="max-w-28 text-sm overflow-hidden whitespace-nowrap text-ellipsis"
          title={item.brand}
        >
          {item.brand}
        </div>
      ),
    },
    {
      key: "description",
      label: t("vouchers.description"),
      render: (item) => (
        <div
          className="text-sm overflow-hidden text-ellipsis"
          title={item.description}
        >
          {item.description}
        </div>
      ),
    },
    {
      key: "discountType",
      label: t("vouchers.type"),
      render: (item) => (
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-md ${
            item.discountType.toLowerCase() === "drink"
              ? "bg-green-100 text-green-700"
              : item.discountType.toLowerCase() === "food"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
          }`}
        >
          {item.discountType}
        </span>
      ),
    },
    {
      key: "discountValue",
      label: t("vouchers.value"),
      render: (item) => <span className="text-sm">{item.discountValue}</span>,
    },
    {
      key: "startDate",
      label: t("vouchers.startDate"),
      render: (item) => <span className="text-sm">{item.startDate}</span>,
    },
    {
      key: "endDate",
      label: t("vouchers.endDate"),
      render: (item) => <span className="text-sm">{item.endDate}</span>,
    },

    {
      key: "status",
      label: t("vouchers.status"),
      render: (item) => renderStatus(item.status),
    },
    {
      key: "action",
      label: t("common.action"),
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
      <GenericTable<VoucherItem>
        items={items}
        columns={columns}
        itemsPerPage={5}
      />
    </div>
  );
};

export default VoucherTable;

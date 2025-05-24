import React, {useState, useEffect} from 'react';
import type { BranchItem } from '../../types/BranchItem';
import GenericTable from '../../components/Table/GenericTable';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import EditBranch from './EditBranch'
import { useTranslation } from "react-i18next";
import { deleteBranch } from "../../services/branch.service";
import { toast } from "react-toastify";

interface BranchTableProps {
  items: BranchItem[];
}

const BranchTable: React.FC<BranchTableProps> = ({ items }) => {
  const [editingBranch, setEditingBranch] = useState<BranchItem | null>(null)
  const { t } = useTranslation();
  useEffect(() => {
    if (editingBranch) {
      document.getElementById("__editBranchTrigger__")?.click();
    }
  }, [editingBranch]);
  
  const handleDelete = async (item: BranchItem) => {
    const confirmDelete = window.confirm(
      `${t("branch.deleteConfirm")} "${item.name}"`
    );
    if (!confirmDelete) return;
  
    try {
      await deleteBranch(item.id);
      toast.success(`${t("branch.branchDeleted")} "${item.name}"`);
      window.location.reload(); // hoặc refetch
    } catch (error) {
      toast.error(t("branch.deleteError"));
    }
  };
  

  const renderStatus = (status: BranchItem['status']) => {
    const colorMap: Record<string, string> = {
      Active: 'bg-green-100 text-green-700',
      Inactive: 'bg-gray-200 text-gray-600',
      Stop: 'bg-red-100 text-red-700',
      Prepare: 'bg-yellow-100 text-yellow-700',
    };

    return (
      <span className={`inline-block px-3 py-1 rounded-full text-sm ${colorMap[status] || 'bg-gray-200 text-gray-600'} whitespace-nowrap`}>
    {t(`branch.${status.toLowerCase()}`)}
    </span>
    );
  };

  const columns: {
    key: keyof BranchItem | 'action' | '_index';
    label: string;
    align?: 'center' | 'left' | 'right';
    render?: (item: BranchItem) => React.ReactNode;
  }[] = [
    {
      key: '_index',
      label: t("common.no") || "No.",
      align: 'left',
      render: (item) => <span className="text-gray-600 text-sm">{items.findIndex(i => i.id === item.id) + 1}</span>,
    },
    {
      key: "location",
      label: t("branch.city"),
      render: (item) => (
        <div className="text-sm text-wrap" title={item.location}>
          {item.location}
        </div>
      ),
    },
    // {
    //   key: "address",
    //   label: "Address",
    //   render: (item) => (
    //     <div className="text-sm overflow-hidden whitespace-nowrap text-ellipsis " title={item.address}>
    //       {item.address}
    //     </div>
    //   ),
    // },
    {
      key: "brand",
      label: t("branch.brand"),
      align : 'center',
      render: (item) => (
        <div className="text-sm overflow-hidden whitespace-nowrap text-ellipsis" title={item.brand}>
          {item.brand}
        </div>
      ),
    },
    {
      key: "manager",
      label: t("branch.manager"),
      align : 'center',
      render: (item) => (
        <div className="text-sm overflow-hidden whitespace-nowrap text-ellipsis" title={item.manager}>
          {item.manager}
        </div>
      ),
    },
    {
      key: "employees",
      label: t("branch.staffCount"),
      align : 'center',
      render: (item) => (
        <div className="text-sm">{item.employees}</div>
      ),
    },

    {
      key: "status",
      label: t("branch.status"),
      render: (item) => renderStatus(item.status),
    },
    {
      key: 'action',
      label: t("common.action") || "Action",
      align: "center",
      render: (item) => (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setEditingBranch(item)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FontAwesomeIcon icon={faPen} size="sm" />
          </button>

          <button
            onClick={() => handleDelete(item)}
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
      <GenericTable<BranchItem> items={items} columns={columns} itemsPerPage={10} />
      {editingBranch && (
        <EditBranch
          branch={editingBranch}
          trigger={
            <button className="hidden" id="__editBranchTrigger__" />
          }
        />
      )}
    </div>
  );
};

export default BranchTable;

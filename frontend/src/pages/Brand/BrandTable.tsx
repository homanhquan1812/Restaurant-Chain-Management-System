import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import type { BrandItem } from '../../types/BrandItem';
import GenericTable from '../../components/Table/GenericTable';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faFileAlt, faLink } from "@fortawesome/free-solid-svg-icons";
import BlogListModal from "./Blog/BlogListModal";
import { deleteBrand } from "../../services/brand.service";
import { useAppDispatch } from "../../redux/hooks";
import { fetchBrands } from "../../redux/slices/brandSlice";
import { LuImageUp } from "react-icons/lu";
import { Share2 } from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLoading } from "../../contexts/LoadingContext";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "../../components/ui/alert-dialog";

interface BrandTableProps {
  items: BrandItem[];
  onDeleted?: () => void;
}

const BrandTable: React.FC<BrandTableProps> = ({ items, onDeleted}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showBlogModal, setShowBlogModal] = useState(false);
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const handleEdit = (item: BrandItem) => {
    navigate(`/brand/edit/${item.id}`);
  };
const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const handleDelete = async (item: BrandItem) => {
    const confirmed = window.confirm(`${t("brand.deleteConfirm")} "${item.name}"?`);
    if (!confirmed) return;

    try {
      setLoading(true); // thêm
      await deleteBrand(item.id);
      toast.success(`${t("brand.brandDeleted")}: "${item.name}"`);
      dispatch(fetchBrands());
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(t("brand.deleteError"));
    } finally {
      setLoading(false); // thêm
    }
  };

  const columns: {
    key: keyof BrandItem | 'action' | '_index';
    label: string;
    align?: 'center' | 'left' | 'right';
    render?: (item: BrandItem) => React.ReactNode;
  }[] = [
    {
      key: '_index',
      label: t("brand.no"),
      align: 'left',
      render: (item) => <span className="text-gray-600 text-sm">{items.findIndex(i => i.id === item.id) + 1}</span>,
    },
    {
      key: "displayId",
      label: "ID",
      align: "center",
      render: (item) => (
        <span className="text-gray-700 text-sm font-mono">{item.displayId}</span>
      ),
    },
    {
      key: "logo",
      label: t("brand.logo"),
      align: 'center',
      render: (item) => (
        <div className="flex justify-center w-12 h-12">
          {item.logo ? (
            <img
              src={item.logo}
              alt="Brand Logo"
              className="object-contain rounded-md"
            />
          ) : (
            <LuImageUp className="text-gray-400 w-6 h-6" />
          )}
        </div>
      )
    },
    {
      key: "name",
      label: t("brand.name"),
      render: (item) => (
        <div className="text-sm font-semibold">{item.name}</div>
      ),
    },
    {
      key: "link",
      label: t("brand.website"),
      render: (item) => (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700"
        >
          <FontAwesomeIcon icon={faLink} size="sm" />
        </a>
      ),
    },
    {
      key: "description",
      label: t("brand.description"),
      render: (item) => (
        <div className="text-sm">{item.description}</div>
      ),
    },
    {
      key: "opening_hours",
      label: t("brand.opening"),
      render: (item) => (
        <span className="font-medium text-green-600">{item.opening_hours}</span>
      ),
    },
    {
      key: "closed_hours",
      label: t("brand.closed"),
      render: (item) => (
        <span className="font-medium text-red-600">{item.closed_hours}</span>
      ),
    },
    {
      key: "date_added",
      label: t("brand.createdDate") || "Created Date",
      align: "center",
      render: (item) => (
        <span className="text-sm text-gray-700">
          {new Date(item.date_added).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "status",
      label: t("brand.status"),
      render: (item) => {
        const colorMap: Record<string, string> = {
          Active: 'bg-green-100 text-green-700',
          Inactive: 'bg-gray-200 text-gray-600',
        };
        return (
          <span className={`inline-block px-3 py-1 rounded-full text-sm ${colorMap[item.status] || 'bg-gray-200 text-gray-600'} whitespace-nowrap`}>
            {t(`brand.${item.status.toLowerCase()}`)}
          </span>
        );
      },
    },
{
  key: 'action',
  label: t("common.action"),
  align: "center",
  render: (item) => (
    <div className="flex justify-center space-x-4">
      <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700">
        <FontAwesomeIcon icon={faPen} size="sm" />
      </button>

      <AlertDialog open={openDialogId === item.id} onOpenChange={(open) => setOpenDialogId(open ? item.id : null)}>
        <AlertDialogTrigger asChild>
          <button className="text-red-500 hover:text-red-700">
            <FontAwesomeIcon icon={faTrash} size="sm" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-md bg-white rounded-xl border border-neutral-200 shadow-xl p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-neutral-800">
              {t("brand.confirmDeleteTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-neutral-500">
              {t("brand.confirmDeleteDesc", { name: item.name })}
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
                  await deleteBrand(item.id);
                  toast.success(t("brand.brandDeleted"));
                  if (onDeleted) await onDeleted();
                  await dispatch(fetchBrands());
                } catch {
                  toast.error(t("brand.deleteError"));
                } finally {
                  setLoading(false);
                  setOpenDialogId(null);
                }
              }}
              className="bg-red-500 text-white rounded-md px-4 py-2 text-sm hover:bg-red-600"
            >
              {t("common.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <button onClick={() => setShowBlogModal(true)} className="text-gray-600 hover:text-gray-800">
        <FontAwesomeIcon icon={faFileAlt} size="sm" />
      </button>

      <button
        onClick={() => navigate(`/branch?brandId=${item.id}`)}
        className="text-green-600 hover:text-green-800"
        title={t("brand.branches")}
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  )
}

  ];

  return (
    <div className="space-y-4">
      <GenericTable<BrandItem> items={items} columns={columns} itemsPerPage={10} />
      <BlogListModal open={showBlogModal} onClose={() => setShowBlogModal(false)} />
    </div>
  );
};

export default BrandTable;

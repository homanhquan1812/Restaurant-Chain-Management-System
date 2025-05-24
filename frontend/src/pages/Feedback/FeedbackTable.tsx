import React from "react";
import { useTranslation } from "react-i18next";
import type { FeedbackItem } from "../../types/FeedbackItem";
import GenericTable from "../../components/Table/GenericTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../../components/ui/tooltip'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

interface FeedbackTableProps {
  items: FeedbackItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const FeedbackTable: React.FC<FeedbackTableProps> = ({
  items,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const renderStatus = (status: FeedbackItem["status"]) => {
    const colorMap: Record<string, string> = {
      Pending: "bg-yellow-100 text-yellow-700",
      Done: "bg-green-100 text-green-700",
      Resolved: "bg-green-100 text-green-700",
    };

    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-sm ${colorMap[status] || "bg-gray-200 text-gray-600"} whitespace-nowrap`}
      >
        {t(`feedback.${status.toLowerCase()}`)}
      </span>
    );
  };

  const columns: {
    key: keyof FeedbackItem | "action" | "_index";
    label: string;
    align?: "center" | "left" | "right";
    render?: (item: FeedbackItem) => React.ReactNode;
  }[] = [
    {
      key: "_index",
      label: t("feedback.no"),
      align: "center",
      render: (item) => (
        <span className="text-gray-600 text-sm">
          {items.findIndex((i) => i.id === item.id) + 1}
        </span>
      ),
    },
    {
      key: "displayId",
      label: t("feedback.id"),
      render: (item) => (
        <div className="truncate text-xs sm:text-sm font-mono sm:w-auto" title={item.displayId}>
          {item.displayId}
        </div>
      )
    },
    {
      key: "type",
      label: t("feedback.type"),
      render: (item) => {
        const typeColorMap: Record<string, string> = {
          Complaint: "bg-red-100 text-red-700",
          Suggestion: "bg-blue-100 text-blue-700",
        };

        return (
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm ${typeColorMap[item.type] || "bg-gray-200 text-gray-600"} whitespace-nowrap`}
          >
            {t(`feedback.${item.type.toLowerCase()}`)}
          </span>
        );
      },
    },
    {
      key: "fullName",
      label: t("feedback.customerName"),
      render: (item) => (
        <div
          className="text-sm overflow-hidden whitespace-nowrap text-ellipsis"
          title={item.fullName}
        >
          {item.fullName}
        </div>
      ),
    },
    // {
    //   key: 'email',
    //   label: 'Email',
    //   render: (item) => (
    //     <div className="max-w-[200px] text-sm overflow-hidden whitespace-nowrap text-ellipsis" title={item.email}>
    //       {item.email}
    //     </div>
    //   ),
    // },
    {
      key: "phoneNumber",
      label: t("feedback.phoneNumber"),
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
      key: 'responsible',
      label: 'Responsible',
      render: (item) => (
        <div className="text-xs sm:text-sm leading-snug space-y-1">
          {item.brandName && (
            <div>
              <span className="font-semibold text-blue-600">              
                {item.brandName}
              </span>
            </div>
          )}
          {item.branchAddress && (
            <div>
              <span className="font-semibold text-gray-600 max-w-20"></span>
              {item.branchAddress}
            </div>
          )}
          {item.staffName && (
            <div>
              <span className="font-semibold">Staff:</span>{' '}
              <span className="font-semibold text-orange-500">{item.staffName}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'feedback',
      label: 'Feedback',
      render: (item) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-pointer text-gray-500 hover:text-gray-700 flex justify-center">
                <FontAwesomeIcon icon={faInfoCircle} size="sm" />
              </div>
            </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8} className="max-w-50 p-2 bg-white text-black border-1 border-gray-300 rounded text-sm text-center space-y-1">
              {item.feedback}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },   
    {
      key: "status",
      label: t("feedback.status"),
      render: (item) => renderStatus(item.status),
    },
    {
      key: 'createAt',
      label: 'Created At',
      render: (item) => {
        const [date, time] = item.createAt.split(', ')
        return (
          <div className="text-center leading-snug text-xs sm:text-sm">
            <div>{date}</div>
            <div className="text-gray-500">{time}</div>
          </div>
        )
      }
    },
    {
      key: 'updateAt',
      label: 'Updated At',
      render: (item) => {
        if (!item.updateAt) return <div className="text-center text-xs text-gray-400">-</div>
        const [date, time] = item.updateAt.split(', ')
        return (
          <div className="text-center leading-snug text-xs sm:text-sm">
            <div>{date}</div>
            <div className="text-gray-500">{time}</div>
          </div>
        )
      }
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
      <GenericTable<FeedbackItem>
        items={items}
        columns={columns}
        itemsPerPage={5}
      />
    </div>
  );
};

export default FeedbackTable;

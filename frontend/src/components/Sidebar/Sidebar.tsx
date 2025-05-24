import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {
  Home,
  List,
  User,
  BookOpen,
  MessageSquare,
  Package,
  LayoutGrid,
  Share2,
  Users,
  Ticket,
  LogOut,
} from "lucide-react";
import { ROLES } from "../../constants/roles";
import { canAccessRoute } from "../../constants/canAccess";
import { logout } from "../../services/auth.service";

// Sidebar items with translation keys
const sidebarItems = [
  { key: "dashboard.title", icon: Home, link: "/dashboard" },
  { key: "orders.title", icon: List, link: "/order-list" },
  { key: "customer.title", icon: User, link: "/customer" },
  { key: "reservation.title", icon: BookOpen, link: "/reservation" },
  { key: "feedback.title", icon: MessageSquare, link: "/feedback" },
  { key: "products.title", icon: Package, link: "/product" },
  { key: "brand.title", icon: LayoutGrid, link: "/brand" },
  { key: "brandManager.title", icon: Users, link: "/brand-manager" },
  { key: "branch.title", icon: Share2, link: "/branch" },
  { key: "employee.title", icon: Users, link: "/employee" },
  { key: "vouchers.title", icon: Ticket, link: "/voucher" },
];

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = !!onClose;
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className={`fixed top-0 left-0 z-40 h-screen bg-white flex flex-col overflow-y-auto
      ${isMobile ? "w-full" : "w-64"} p-6 border-r border-gray-200`}
    >
      {/* Logo + Close */}
      <div className="flex items-start justify-start gap-2 mb-6">
        {/* Logo + Text */}
        <div className="flex items-center gap-2 ml-5">
          <img
            src="/utopia_logo.svg"
            alt="Utopia Logo"
            className="object-contain w-8 h-8"
          />
          <h1 className="font-bold text-xl leading-none flex items-center">
            <span className="text-blue-600">UTO</span>
            <span className="text-[#4B5563]">PIA</span>
          </h1>
        </div>

        {/* Close button (mobile only) */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-gray-600 hover:text-black"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Sidebar Item */}
      <nav className="flex flex-col items-start gap-3 pb-6 flex-grow">
        {sidebarItems
          .filter(item => canAccessRoute(role, item.link))
          .map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.link;
          return (
            <Link
              key={index}
              to={item.link}
              onClick={onClose}
              className={`flex items-center w-full rounded-md transition-all px-3 md:px-3 sm:px-4 py-2 md:py-2 sm:py-3 text-sm sm:text-base ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
              }`}
            >
              <div
                className={`w-1 h-5 rounded bg-blue-600 mr-3 ${
                  isActive ? "block" : "invisible"
                }`}
              ></div>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-3" strokeWidth={2} />
              <span>{t(item.key)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-sm sm:text-lg px-3 md:px-3 sm:px-4 py-2 md:py-2 sm:py-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
        >
          <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>{t("common.logout")}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

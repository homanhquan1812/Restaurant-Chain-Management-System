import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { FaCircleUser } from "react-icons/fa6";

interface User {
  full_name: string;
  role: string;
  username: string;
  brand_name?: string;
  branch_address?: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  if (!user) return null;

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className=" focus:outline-none flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition-all duration-200">
            <FaCircleUser className="w-8 h-8 text-gray-600" />
            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="text-sm font-medium text-gray-800 truncate max-w-[120px]">
                {user.full_name}
              </span>
              <span className="text-xs text-gray-500 truncate max-w-[120px]">
                {user.role}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:inline" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-64 rounded-md shadow-xl border border-gray-200 bg-white p-1"
          align="end"
        >
          <DropdownMenuLabel className="text-sm text-gray-900 font-semibold px-3 py-2">
            My Account
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-2 h-px bg-gray-200 mx-2" />

          <DropdownMenuItem className="text-sm text-gray-700 px-3 py-2 cursor-default hover:bg-transparent">
            <span className="font-medium">Name:</span> {user.full_name}
          </DropdownMenuItem>
          <DropdownMenuItem className="text-sm text-gray-700 px-3 py-2 cursor-default hover:bg-transparent">
            <span className="font-medium">Role:</span> {user.role}
          </DropdownMenuItem>

          {user.brand_name && (
            <DropdownMenuItem className="text-sm text-gray-700 px-3 py-2 cursor-default hover:bg-transparent">
              <span className="font-medium">Brand:</span> {user.brand_name}
            </DropdownMenuItem>
          )}
          {user.branch_address && (
            <DropdownMenuItem className="text-sm text-gray-700 px-3 py-2 cursor-default hover:bg-transparent">
              <span className="font-medium">Branch:</span>{" "}
              {user.branch_address}
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="my-2 h-px bg-gray-200 mx-2" />

          <DropdownMenuItem
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="text-sm px-3 py-2 text-red-600 font-semibold hover:bg-red-50 cursor-pointer rounded"
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfile;

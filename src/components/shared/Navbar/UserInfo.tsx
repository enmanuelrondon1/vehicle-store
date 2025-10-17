// src/components/shared/Navbar/UserInfo.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useDarkMode } from "@/context/DarkModeContext";

interface UserInfoProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };
  isMobile?: boolean;
}

const UserInfo = ({ user, isMobile = false }: UserInfoProps) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={`${
        isMobile ? "p-3 rounded-xl" : "flex items-center gap-2"
      } ${
        isMobile ? (isDarkMode ? "bg-gray-800/50" : "bg-gray-100/50") : ""
      }`}
    >
      {user.image && (
        <Image
          src={user.image}
          alt="Avatar"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover"
        />
      )}
      <div className={isMobile ? "" : "hidden lg:block"}>
        <p className="text-sm font-medium truncate max-w-32">{user.name || user.email}</p>
        {user.role && isMobile && <p className="text-xs opacity-70">{user.role}</p>}
      </div>
    </div>
  );
};

UserInfo.displayName = "UserInfo";
export default UserInfo;
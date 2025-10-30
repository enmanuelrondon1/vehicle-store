// src/components/shared/Navbar/UserInfo.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Crown } from "lucide-react"; // Añadimos un icono para el rol de admin

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
  const displayName = user.name || user.email || "Usuario";
  const isAdmin = user.role === "admin";

  return (
    <div className={`flex items-center gap-3 ${isMobile ? "p-3 rounded-lg bg-muted" : ""}`}>
      <div className="relative">
        {user.image ? (
          <Image
            src={user.image}
            alt="Avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border-2 border-border"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-muted border-2 border-border flex items-center justify-center">
            <span className="text-lg font-heading font-bold text-muted-foreground">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {isAdmin && (
          <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-accent text-accent-foreground">
            <Crown className="w-3 h-3" />
          </div>
        )}
      </div>
      <div className={`${isMobile ? "text-center" : "hidden lg:block"}`}>
        <p className="text-sm font-semibold text-foreground truncate max-w-[150px]">
          {displayName}
        </p>
        {isAdmin && (
          <p className="text-xs text-accent font-medium">Administrador</p>
        )}
      </div>
    </div>
  );
};

UserInfo.displayName = "UserInfo";
export default UserInfo;
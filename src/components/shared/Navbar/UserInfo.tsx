// src/components/shared/Navbar/UserInfo.tsx
"use client";
import React from "react";
import Image from "next/image";
import { Shield } from "lucide-react";

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
          <div className="relative transition-transform duration-200 hover:scale-105">
            <Image
              src={user.image}
              alt="Avatar"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border-2 border-border"
            />
          </div>
        ) : (
          <div
            className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center transition-transform duration-200 hover:scale-105 hover:rotate-3"
            style={{ background: "var(--gradient-accent)" }}
          >
            <span className="text-lg font-heading font-bold text-accent-foreground">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {isAdmin && (
          <div
            className="absolute -bottom-1 -right-1 p-1 rounded-full glow-effect transition-transform duration-200 hover:scale-125"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
          >
            <Shield className="w-3 h-3" />
          </div>
        )}
      </div>

      <div className={`${isMobile ? "text-center" : "hidden lg:block"}`}>
        <p className="text-sm font-semibold text-foreground truncate max-w-[150px] hover:text-accent transition-colors duration-200">
          {displayName}
        </p>
        {isAdmin && (
          <p className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--accent)" }}>
            <Shield className="w-3 h-3" />
            Administrador
          </p>
        )}
      </div>
    </div>
  );
};

UserInfo.displayName = "UserInfo";
export default UserInfo;
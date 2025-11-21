// src/components/shared/Navbar/UserInfo.tsx (versión mejorada)
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Crown, Shield } from "lucide-react";

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
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Image
              src={user.image}
              alt="Avatar"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border-2 border-border"
            />
            {/* Efecto de brillo en el avatar */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 70%)'
              }}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        ) : (
          <motion.div
            className="w-10 h-10 rounded-full bg-muted border-2 border-border flex items-center justify-center"
            style={{ background: 'var(--gradient-accent)' }}
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span className="text-lg font-heading font-bold text-accent-foreground">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </motion.div>
        )}
        {isAdmin && (
          <motion.div
            className="absolute -bottom-1 -right-1 p-1 rounded-full glow-effect"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}
            whileHover={{ scale: 1.2, rotate: 15 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <Shield className="w-3 h-3" />
          </motion.div>
        )}
      </div>
      <div className={`${isMobile ? "text-center" : "hidden lg:block"}`}>
        <motion.p 
          className="text-sm font-semibold text-foreground truncate max-w-[150px]"
          whileHover={{ color: 'var(--accent)' }}
          transition={{ duration: 0.2 }}
        >
          {displayName}
        </motion.p>
        {isAdmin && (
          <motion.p 
            className="text-xs font-medium flex items-center gap-1"
            style={{ color: 'var(--accent)' }}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Shield className="w-3 h-3" />
            Administrador
          </motion.p>
        )}
      </div>
    </div>
  );
};

UserInfo.displayName = "UserInfo";
export default UserInfo;
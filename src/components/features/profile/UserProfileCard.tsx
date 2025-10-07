"use client";

import React from 'react';
import Image from 'next/image';
import { User } from 'next-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Shield } from 'lucide-react';

interface UserProfileCardProps {
  user: User;
}

const UserProfileCard = ({ user }: UserProfileCardProps) => {
  const userRole = user.role === 'admin' ? 'Administrador' : 'Usuario';
  const roleVariant = user.role === 'admin' ? 'destructive' : 'secondary';

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col items-center justify-center text-center p-6 bg-gray-50 dark:bg-gray-800/50">
        <div className="relative mb-4">
          <Image
            src={user.image || `https://ui-avatars.com/api/?name=${user.name || user.email}&background=random`}
            alt="Foto de perfil"
            width={100}
            height={100}
            className="rounded-full border-4 border-white dark:border-gray-900 shadow-lg"
          />
        </div>
        <CardTitle className="text-2xl">{user.name}</CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={roleVariant} className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            {userRole}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Mail className="w-4 h-4 mr-3" />
          <span>{user.email}</span>
        </div>
        {/* Puedes añadir más información del perfil aquí */}
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
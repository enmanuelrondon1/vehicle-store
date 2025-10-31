// src/hooks/use-users-panel.ts
"use client";

import { useState, useEffect, useMemo } from 'react';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  provider: string;
  createdAt: string;
  vehicleCount: number;
  lastSignInAt: string | null;
}

interface Filters {
  searchTerm: string;
  sortBy: string;
}

interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface ApiResponse {
  success: boolean;
  data?: UserData[];
  error?: string;
}

export const useUsersPanel = () => {
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    sortBy: 'newest',
  });
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/users");
        const result: ApiResponse = await response.json();

        if (result.success && result.data) {
          setAllUsers(result.data);
          setError(null);
        } else {
          throw new Error(result.error || "No se pudieron cargar los usuarios.");
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido al cargar usuarios";
        setError(errorMessage);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = allUsers.filter(user =>
      user.fullName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.searchTerm.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name-asc':
          return a.fullName.localeCompare(b.fullName);
        case 'name-desc':
          return b.fullName.localeCompare(a.fullName);
        default:
          return 0;
      }
    });

    return sorted;
  }, [allUsers, filters]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, endIndex);
  }, [filteredAndSortedUsers, pagination]);

  useEffect(() => {
    const totalItems = filteredAndSortedUsers.length;
    setPagination(p => ({
      ...p,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / p.itemsPerPage),
      currentPage: 1,
    }));
  }, [filteredAndSortedUsers.length, pagination.itemsPerPage]);

  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const setItemsPerPage = (items: number) => {
    setPagination(prev => ({ ...prev, itemsPerPage: items, currentPage: 1 }));
  };

  const nextPage = () => {
    setPagination(p => ({ ...p, currentPage: Math.min(p.currentPage + 1, p.totalPages) }));
  };

  const prevPage = () => {
    setPagination(p => ({ ...p, currentPage: Math.max(p.currentPage - 1, 1) }));
  };

  const updateUserRoleInState = (userId: string, newRole: string) => {
    setAllUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const removeUserFromState = (userId: string) => {
    setAllUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  return {
    users: paginatedUsers,
    isLoading,
    error,
    filters,
    updateFilters,
    pagination,
    goToPage,
    updateUserRoleInState,
    setItemsPerPage,
    nextPage,
    prevPage,
    removeUserFromState,
  };
};
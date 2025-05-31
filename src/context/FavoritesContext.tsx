// src/context/FavoritesContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Definimos el tipo para el contexto
interface FavoritesContextType {
  favorites: Set<string>;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

// Creamos el contexto con un valor inicial por defecto
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

// Proveedor del contexto
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Cargar favoritos desde localStorage solo en el lado del cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
          const parsedFavorites = JSON.parse(savedFavorites);
          // Validar que parsedFavorites sea un array de strings
          if (Array.isArray(parsedFavorites) && parsedFavorites.every((id) => typeof id === "string")) {
            setFavorites(new Set(parsedFavorites));
          }
        }
      } catch (error) {
        console.error("Error al cargar favoritos desde localStorage:", error);
        setFavorites(new Set());
      }
    }
  }, []);

  // Sincronizar favoritos con localStorage cada vez que cambien
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)));
    }
  }, [favorites]);

  // Función para agregar un favorito
  const addFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.add(id);
      return newFavorites;
    });
  };

  // Función para eliminar un favorito
  const removeFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.delete(id);
      return newFavorites;
    });
  };

  // Función para alternar un favorito (agregar o eliminar)
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
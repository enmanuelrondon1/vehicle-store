// src/components/features/vehicles/detail/sections/VehicleDocumentation.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  FileText,
  Shield,
  Car,
  Eye,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VehicleDocumentationProps {
  documentation: string[];
}

// Mapeo de documentos a iconos específicos para mejor UX
const getDocumentIcon = (doc: string) => {
  const lowerDoc = doc.toLowerCase();
  if (lowerDoc.includes("seguro") || lowerDoc.includes("garantía")) {
    return <Shield className="w-4 h-4" />;
  }
  if (lowerDoc.includes("matrícula") || lowerDoc.includes("registro")) {
    return <Car className="w-4 h-4" />;
  }
  return <FileText className="w-4 h-4" />;
};

// Mapeo de documentos a colores según su importancia
const getDocumentVariant = (doc: string) => {
  const lowerDoc = doc.toLowerCase();
  if (lowerDoc.includes("seguro") || lowerDoc.includes("garantía")) {
    return "success";
  }
  if (lowerDoc.includes("matrícula") || lowerDoc.includes("registro")) {
    return "primary";
  }
  return "muted";
};

// Componente para cada documento
const DocumentItem: React.FC<{ doc: string; index: number }> = ({ doc, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const variant = getDocumentVariant(doc);
  const icon = getDocumentIcon(doc);
  
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer card-hover",
        isHovered && "glow-effect"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3 p-4">
        <motion.div 
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300",
            variant === "success" ? "bg-success-10 text-success" :
            variant === "primary" ? "bg-primary-10 text-primary" :
            "bg-muted text-muted-foreground"
          )}
          whileHover={{ rotate: 15 }}
        >
          {icon}
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{doc}</p>
          <p className="text-xs text-muted-foreground">Verificado</p>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-success" />
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <Eye className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <motion.div 
        className={cn(
          "absolute bottom-0 left-0 h-1 transition-all duration-300",
          variant === "success" ? "bg-success" :
          variant === "primary" ? "bg-primary" :
          "bg-muted"
        )}
        initial={{ width: 0 }}
        animate={{ width: isHovered ? "100%" : "0%" }}
      />
    </motion.div>
  );
};

const VehicleDocumentationComponent: React.FC<VehicleDocumentationProps> = ({
  documentation,
}) => {
  const [showAllDocs, setShowAllDocs] = useState(false);
  const [isMobileVisible, setIsMobileVisible] = useState(false);

  const hasDocs = documentation && documentation.length > 0;

  const initialDocs = hasDocs ? documentation.slice(0, 4) : [];
  const remainingDocs = hasDocs ? documentation.slice(4) : [];
  const hasMoreDocs = hasDocs && documentation.length > 4;

  // Variants para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (!hasDocs) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="card-premium shadow-xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <motion.div 
                className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <FileText className="w-10 h-10 text-muted-foreground" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-3 text-gradient-primary">
                Sin documentación disponible
              </h3>
              <p className="text-muted-foreground max-w-md">
                Este vehículo no tiene información de documentación disponible
                en este momento.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {/* Botón Acordeón para Móvil */}
      <div className="sm:hidden border-b mb-4">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between py-6 text-left h-auto"
          onClick={() => setIsMobileVisible(!isMobileVisible)}
        >
          <span className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 rounded-full bg-primary-10 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="font-semibold text-lg">Documentación</span>
          </span>
          {isMobileVisible ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Contenido Principal (Card) */}
      <AnimatePresence>
        {(isMobileVisible || true) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn("sm:block", isMobileVisible ? "block" : "hidden")}
          >
            <Card className="card-premium shadow-xl overflow-hidden">
              <CardHeader className="pb-4 hidden sm:flex">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FileText className="w-6 h-6 text-primary-foreground" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      Documentación Incluida
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {documentation.length} documentos verificados
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 sm:pt-0">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {initialDocs.map((doc, index) => (
                    <DocumentItem key={index} doc={doc} index={index} />
                  ))}
                </motion.div>

                <AnimatePresence>
                  {showAllDocs && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
                    >
                      {remainingDocs.map((doc, index) => (
                        <DocumentItem
                          key={index + 4}
                          doc={doc}
                          index={index + 4}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {hasMoreDocs && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 text-center"
                  >
                    <Button
                      variant="outline"
                      onClick={() => setShowAllDocs(!showAllDocs)}
                      className="w-full btn-accent"
                    >
                      {showAllDocs
                        ? "Ver menos"
                        : `Ver todos los documentos (${documentation.length} totales)`}
                    </Button>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 p-6 rounded-xl card-glass"
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-primary-10 flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Shield className="w-5 h-5 text-primary" />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        Verificación de documentos
                        <Badge className="badge-premium">
                          Seguro
                        </Badge>
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Todos los documentos han sido verificados por nuestro
                        equipo para garantizar su autenticidad.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Info className="w-3 h-3" />
                        <span>Proceso de verificación completado</span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <AlertCircle className="w-5 h-5 text-primary" />
                    </motion.div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const VehicleDocumentation = React.memo(VehicleDocumentationComponent);
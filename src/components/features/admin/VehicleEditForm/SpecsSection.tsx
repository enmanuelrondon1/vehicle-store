// src/components/features/admin/VehicleEditForm/SpecsSection.tsx
"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { VehicleCategory, TRANSMISSION_TYPES_LABELS, FUEL_TYPES_LABELS, DRIVE_TYPE_LABELS } from "@/types/shared";
import { COMMON_COLORS } from "@/constants/form-constants";
import { VehicleDataBackend } from "@/types/types";
import { InputField } from "@/components/shared/forms/InputField";
import { SelectField } from "@/components/shared/forms/SelectField";
import { Palette, Wrench, Gauge, Droplet, GitBranch, DoorOpen, Armchair, Weight } from "lucide-react";

interface SpecsSectionProps {
  formData: Partial<VehicleDataBackend>;
  handleChange: (field: string, value: any) => void;
  getInputClassName: (field: string) => string;
  isFieldValid: (field: string) => boolean;
  getFieldError: (field: string) => string | undefined;
  handleBlur: (field: string) => void;
  isSubmitting: boolean;
}

export function SpecsSection({
  formData,
  handleChange,
  getInputClassName,
  isFieldValid,
  getFieldError,
  handleBlur,
  isSubmitting,
}: SpecsSectionProps) {
  // --- 1. ESTADOS LOCALES PARA INPUTS NUMÉRICOS (Solución al problema del '0') ---
  const [doorsDisplay, setDoorsDisplay] = useState('');
  const [seatsDisplay, setSeatsDisplay] = useState('');
  const [loadCapacityDisplay, setLoadCapacityDisplay] = useState('');

  // --- 2. EFECTOS PARA SINCRONIZAR ESTADOS LOCALES ---
  useEffect(() => {
    setDoorsDisplay(formData.doors == null ? '' : String(formData.doors));
  }, [formData.doors]);

  useEffect(() => {
    setSeatsDisplay(formData.seats == null ? '' : String(formData.seats));
  }, [formData.seats]);

  useEffect(() => {
    setLoadCapacityDisplay(formData.loadCapacity == null ? '' : String(formData.loadCapacity));
  }, [formData.loadCapacity]);

  // --- 3. LÓGICA CONDICIONAL (sin cambios, ya es eficiente) ---
  const requiresDoorsSeats = useMemo(() => {
    const categoriesWithDoorsSeats = [VehicleCategory.CAR, VehicleCategory.SUV, VehicleCategory.VAN, VehicleCategory.BUS];
    return formData.category && categoriesWithDoorsSeats.includes(formData.category as VehicleCategory);
  }, [formData.category]);

  const displacementOptions = useMemo(() => {
    const carDisplacements = ["1.0", "1.2", "1.3", "1.4", "1.5", "1.6", "1.8", "2.0", "2.2", "2.4", "2.5", "2.7", "3.0", "3.5", "4.0", "4.6", "5.0"].map(d => ({ value: `${d}L`, label: `${d}L` }));
    const motorcycleDisplacements = ["110cc", "125cc", "150cc", "200cc", "250cc", "300cc", "400cc", "500cc", "600cc", "750cc", "1000cc"].map(d => ({ value: d, label: d }));
    return formData.category === VehicleCategory.MOTORCYCLE ? motorcycleDisplacements : carDisplacements;
  }, [formData.category]);

  // --- 4. MANEJADORES DE EVENTOS REFACTORIZADOS ---
  const handleColorChange = useCallback((value: string) => handleChange("color", value), [handleChange]);
  const handleEngineChange = useCallback((value: string) => handleChange("engine", value), [handleChange]);
  const handleDisplacementChange = useCallback((value: string) => handleChange("displacement", value), [handleChange]);
  const handleTransmissionChange = useCallback((value: string) => handleChange("transmission", value), [handleChange]);
  const handleFuelTypeChange = useCallback((value: string) => handleChange("fuelType", value), [handleChange]);
  const handleDriveTypeChange = useCallback((value: string) => handleChange("driveType", value), [handleChange]);

  // --- 5. MANEJADORES `onBlur` PARA CAMPOS NUMÉRICOS ---
  const handleDoorsBlur = useCallback(() => {
    const value = Number(doorsDisplay);
    handleChange("doors", doorsDisplay.trim() === '' || isNaN(value) ? null : value);
    handleBlur("doors");
  }, [doorsDisplay, handleChange, handleBlur]);

  const handleSeatsBlur = useCallback(() => {
    const value = Number(seatsDisplay);
    handleChange("seats", seatsDisplay.trim() === '' || isNaN(value) ? null : value);
    handleBlur("seats");
  }, [seatsDisplay, handleChange, handleBlur]);

  const handleLoadCapacityBlur = useCallback(() => {
    const value = Number(loadCapacityDisplay);
    handleChange("loadCapacity", loadCapacityDisplay.trim() === '' || isNaN(value) ? null : value);
    handleBlur("loadCapacity");
  }, [loadCapacityDisplay, handleChange, handleBlur]);

  return (
    // 6. CONTENEDOR UNIFICADO CON HOVER Y GRID RESPONSIVO
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start p-6 -m-6 rounded-lg transition-all duration-300 hover:bg-muted/20">
      
      <InputField
        label="Color"
        required
        error={getFieldError("color")}
        success={isFieldValid("color")}
        icon={<Palette className="w-4 h-4" />}
        tooltip="Color principal del vehículo"
      >
        <SelectField
          name="color"
          value={formData.color || ""}
          onValueChange={handleColorChange}
          onBlur={() => handleBlur("color")}
          placeholder="Selecciona el color"
          options={COMMON_COLORS.map(color => ({ value: color, label: color }))}
        />
      </InputField>

      {/* Campo Condicional: Especificar Color */}
      {formData.color === "Otro" && (
        <div className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <InputField
            label="Especificar Color"
            required
            error={getFieldError("colorOther")}
            success={isFieldValid("colorOther")}
            icon={<Palette className="w-4 h-4" />}
            counter={{ current: (formData as any).colorOther?.length || 0, max: 30 }}
          >
            <Input
              id="colorOther"
              name="colorOther"
              value={(formData as any).colorOther || ""}
              onChange={(e) => handleChange("colorOther", e.target.value)}
              onBlur={() => handleBlur("colorOther")}
              maxLength={30}
              className={getInputClassName("colorOther")}
              placeholder="Escribe el color"
              disabled={isSubmitting}
            />
          </InputField>
        </div>
      )}

      <InputField
        label="Motor / Descripción"
        error={getFieldError("engine")}
        success={isFieldValid("engine")}
        icon={<Wrench className="w-4 h-4" />}
        tooltip="Opcional. Ej: 1.6L 4 cilindros, V8 5.0L (mínimo 4 caracteres)"
        counter={{ current: formData.engine?.length || 0, max: 100 }}
      >
        <Input
          id="engine"
          name="engine"
          value={formData.engine || ""}
          onChange={(e) => handleEngineChange(e.target.value)}
          onBlur={() => handleBlur("engine")}
          maxLength={100}
          className={getInputClassName("engine")}
          placeholder="Ej: 1.6L 4 cilindros"
          disabled={isSubmitting}
        />
      </InputField>

      <InputField
        label="Cilindraje"
        error={getFieldError("displacement")}
        success={isFieldValid("displacement")}
        icon={<Gauge className="w-4 h-4" />}
        tooltip="Opcional. Formato: 2.0L o 150cc"
      >
        <SelectField
          name="displacement"
          value={formData.displacement || ""}
          onValueChange={handleDisplacementChange}
          onBlur={() => handleBlur("displacement")}
          placeholder="Selecciona el cilindraje"
          options={displacementOptions}
          disabled={isSubmitting}
        />
      </InputField>

      <InputField
        label="Transmisión"
        error={getFieldError("transmission")}
        success={isFieldValid("transmission")}
        icon={<GitBranch className="w-4 h-4" />}
        tooltip="Tipo de transmisión"
      >
        <SelectField
          name="transmission"
          value={formData.transmission || ""}
          onValueChange={handleTransmissionChange}
          onBlur={() => handleBlur("transmission")}
          placeholder="Selecciona la transmisión"
          options={Object.entries(TRANSMISSION_TYPES_LABELS).map(([key, label]) => ({ value: key, label }))}
        />
      </InputField>

      <InputField
        label="Combustible"
        error={getFieldError("fuelType")}
        success={isFieldValid("fuelType")}
        icon={<Droplet className="w-4 h-4" />}
        tooltip="Tipo de combustible"
      >
        <SelectField
          name="fuelType"
          value={formData.fuelType || ""}
          onValueChange={handleFuelTypeChange}
          onBlur={() => handleBlur("fuelType")}
          placeholder="Selecciona el combustible"
          options={Object.entries(FUEL_TYPES_LABELS).map(([key, label]) => ({ value: key, label }))}
        />
      </InputField>

      <InputField
        label="Tracción"
        error={getFieldError("driveType")}
        success={isFieldValid("driveType")}
        icon={<Gauge className="w-4 h-4" />} // Icono más representativo
        tooltip="Tipo de tracción"
      >
        <SelectField
          name="driveType"
          value={formData.driveType || ""}
          onValueChange={handleDriveTypeChange}
          onBlur={() => handleBlur("driveType")}
          placeholder="Selecciona la tracción"
          options={Object.entries(DRIVE_TYPE_LABELS).map(([key, label]) => ({ value: key, label }))}
        />
      </InputField>

      {/* Campos Condicionales con Animación y Solución de Input Número */}
      {requiresDoorsSeats && (
        <>
          <div className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
            <InputField
              label="Número de Puertas"
              required
              error={getFieldError("doors")}
              success={isFieldValid("doors")}
              icon={<DoorOpen className="w-4 h-4" />}
              tooltip="Cantidad de puertas"
            >
              <Input
                id="doors"
                name="doors"
                type="number"
                value={doorsDisplay} // Estado local
                onChange={(e) => setDoorsDisplay(e.target.value)} // Actualiza estado local
                onBlur={handleDoorsBlur} // Manejador específico
                className={getInputClassName("doors")}
                placeholder="Ej: 4"
                min={0}
                max={10}
                disabled={isSubmitting}
              />
            </InputField>
          </div>

          <div className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
            <InputField
              label="Número de Asientos"
              required
              error={getFieldError("seats")}
              success={isFieldValid("seats")}
              icon={<Armchair className="w-4 h-4" />}
              tooltip="Cantidad de asientos"
            >
              <Input
                id="seats"
                name="seats"
                type="number"
                value={seatsDisplay} // Estado local
                onChange={(e) => setSeatsDisplay(e.target.value)} // Actualiza estado local
                onBlur={handleSeatsBlur} // Manejador específico
                className={getInputClassName("seats")}
                placeholder="Ej: 5"
                min={1}
                max={50}
                disabled={isSubmitting}
              />
            </InputField>
          </div>
        </>
      )}

      {formData.category === VehicleCategory.TRUCK && (
        <div className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <InputField
            label="Capacidad de Carga (kg)"
            required
            error={getFieldError("loadCapacity")}
            success={isFieldValid("loadCapacity")}
            icon={<Weight className="w-4 h-4" />}
            tooltip="Capacidad máxima de carga"
          >
            <Input
              id="loadCapacity"
              name="loadCapacity"
              type="number"
              value={loadCapacityDisplay} // Estado local
              onChange={(e) => setLoadCapacityDisplay(e.target.value)} // Actualiza estado local
              onBlur={handleLoadCapacityBlur} // Manejador específico
              className={getInputClassName("loadCapacity")}
              placeholder="Ej: 1000"
              min={0}
              max={50000}
              disabled={isSubmitting}
            />
          </InputField>
        </div>
      )}
    </div>
  );
}
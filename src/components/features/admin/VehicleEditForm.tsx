// src/components/features/admin/VehicleEditForm.tsx
"use client";

import { useState } from "react";
import { Vehicle } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  VEHICLE_CATEGORIES_LABELS,
  TRANSMISSION_TYPES_LABELS,
  FUEL_TYPES_LABELS,
  VEHICLE_CONDITIONS_LABELS,
  DRIVE_TYPE_LABELS,
  WARRANTY_LABELS,
} from "@/types/shared";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface VehicleEditFormProps {
  vehicle: Vehicle;
}

export default function VehicleEditForm({ vehicle }: VehicleEditFormProps) {
  const [formData, setFormData] = useState(vehicle);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.info("Guardando cambios...");

    try {
      const response = await fetch(`/api/admin/vehicles/${vehicle._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error al actualizar el vehículo"
        );
      }

      const result = await response.json();
      if (result.success) {
        toast.success(result.message || "Vehículo actualizado con éxito");
      } else {
        toast.error(result.error || "Ocurrió un error inesperado");
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al guardar los cambios"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            Editando: {vehicle.brand} {vehicle.model} {vehicle.year}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input id="brand" value={formData.brand} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input id="model" value={formData.model} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Versión</Label>
              <Input id="version" value={formData.version || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Año</Label>
              <Input id="year" type="number" value={formData.year} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input id="price" type="number" value={formData.price} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileage">Kilometraje</Label>
              <Input id="mileage" type="number" value={formData.mileage} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input id="color" value={formData.color} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="engine">Motor</Label>
              <Input id="engine" value={formData.engine} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displacement">Cilindraje</Label>
              <Input id="displacement" value={formData.displacement || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doors">Puertas</Label>
              <Input id="doors" type="number" value={formData.doors} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seats">Asientos</Label>
              <Input id="seats" type="number" value={formData.seats} onChange={handleChange} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input id="location" value={formData.location} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(VEHICLE_CATEGORIES_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmisión</Label>
              <Select
                value={formData.transmission}
                onValueChange={(value) => handleSelectChange("transmission", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo de transmisión" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TRANSMISSION_TYPES_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuelType">Combustible</Label>
              <Select
                value={formData.fuelType}
                onValueChange={(value) => handleSelectChange("fuelType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo de combustible" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FUEL_TYPES_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Condición</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => handleSelectChange("condition", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la condición" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(VEHICLE_CONDITIONS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="driveType">Tracción</Label>
              <Select
                value={formData.driveType || ""}
                onValueChange={(value) => handleSelectChange("driveType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de tracción" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DRIVE_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="warranty">Garantía</Label>
              <Select
                value={formData.warranty}
                onValueChange={(value) => handleSelectChange("warranty", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de garantía" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(WARRANTY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
            />
          </div>
          {/* Aquí se agregarán más campos como checkboxes y manejo de imágenes */}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
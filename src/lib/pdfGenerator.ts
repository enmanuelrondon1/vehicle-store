// src/lib/pdfGenerator.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import type { VehicleDataFrontend } from '@/types/types';

export const generateVehiclePdf = async (vehicle: VehicleDataFrontend): Promise<void> => {
  const doc = new jsPDF();

  // --- Cabecera ---
  // Aquí puedes agregar tu logo. Deberás tenerlo en formato base64.
  // const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...";
  // doc.addImage(logoBase64, 'PNG', 150, 10, 45, 15);

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Ficha Técnica del Vehículo', 14, 20);
  doc.setLineWidth(0.5);
  doc.line(14, 23, 196, 23);

  // --- Información Principal ---
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${vehicle.brand} ${vehicle.model}`, 14, 35);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Año: ${vehicle.year}`, 14, 42);

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 102, 204); // Color azul
  doc.text(`$${vehicle.price.toLocaleString()}`, 150, 35);
  doc.setTextColor(0, 0, 0); // Reset color

  // --- Imagen y QR Code ---
  try {
    // La imagen principal del vehículo
    if (vehicle.images && vehicle.images[0]) {
      // Nota: Para que esto funcione de forma robusta, la imagen debe ser accesible
      // públicamente o necesitarás un proxy para evitar problemas de CORS.
      // Usamos una API para evitar el bloqueo de CORS en el navegador.
      const imageUrl = `https://images.weserv.nl/?url=${encodeURIComponent(vehicle.images[0])}&w=400`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const imageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      doc.addImage(imageBase64, 'JPEG', 14, 55, 90, 60);
    }
  } catch (e) {
    console.error("Error al cargar la imagen del vehículo:", e);
    doc.text("Imagen no disponible", 35, 85);
  }

  try {
    // Generar QR Code que enlaza al anuncio
    const vehicleUrl = `${window.location.origin}/vehicle/${vehicle._id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(vehicleUrl, { width: 200 });
    doc.addImage(qrCodeDataUrl, 'PNG', 150, 55, 40, 40);
    doc.setFontSize(8);
    doc.text('Ver anuncio online', 155, 100);
  } catch (e) {
    console.error("Error al generar el QR code:", e);
  }

  // --- Tablas de Especificaciones y Vendedor ---
  const vehicleSpecData = [
    ['Kilometraje', `${vehicle.mileage.toLocaleString()} km`],
    ['Condición', vehicle.condition],
    ['Transmisión', vehicle.transmission],
    ['Combustible', vehicle.fuelType],
    ['Color', vehicle.color],
    ['Motor', vehicle.engine || 'N/A'],
    ['Ubicación', vehicle.location],
  ];

  const sellerData = [
    ['Nombre', vehicle.sellerContact.name],
    ['Email', vehicle.sellerContact.email],
    ['Teléfono', vehicle.sellerContact.phone],
  ];

  autoTable(doc, {
    head: [['Especificaciones del Vehículo', '']],
    body: vehicleSpecData,
    startY: 125,
    theme: 'grid',
    headStyles: { fillColor: [22, 160, 133] },
  });

  autoTable(doc, {
    head: [['Información del Vendedor', '']],
    body: sellerData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
  });

  // --- Pie de Página con Marca de Agua ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pageCount = (doc as any).internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    // Marca de agua
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    doc.text('Generado por VehicleStore', (doc as any).internal.pageSize.getWidth() / 2, 285, { align: 'center' });
    // Numeración de página
    doc.text(`Página ${i} de ${pageCount}`, 196, 290, { align: 'right' });
  }

  // --- Guardar el PDF ---
  const fileName = `ficha-tecnica-${vehicle.brand}-${vehicle.model}.pdf`;
  doc.save(fileName);
};
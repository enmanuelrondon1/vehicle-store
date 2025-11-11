/**
 * Convierte un array de objetos a una cadena de texto en formato CSV.
 * @param data - El array de objetos a convertir.
 * @returns Una cadena de texto en formato CSV.
 */
function convertToCSV<T extends object>(data: T[]): string {
  if (!data || data.length === 0) {
    return "";
  }

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(",")]; // Encabezados del CSV

  for (const row of data) {
    const values = headers.map((header) => {
      const value = (row as any)[header];
      // Escapa las comillas dobles y envuelve el valor en comillas si contiene comas
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}

/**
 * Genera y descarga un archivo CSV a partir de un array de objetos.
 * @param data - El array de objetos a exportar.
 * @param filename - El nombre del archivo a descargar (ej. "vehiculos.csv").
 */
export function exportToCSV<T extends object>(data: T[], filename: string): void {
  const csvString = convertToCSV(data);
  
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
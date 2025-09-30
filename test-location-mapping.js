// Script de prueba para verificar el mapeo de ubicaciones

// Simular LOCATION_LABELS con los datos actualizados
const LOCATION_LABELS = {
  // Estados venezolanos (originales)
  amazonas: "Amazonas",
  anzoategui: "Anzoátegui",
  apure: "Apure",
  aragua: "Aragua",
  barinas: "Barinas",
  bolivar: "Bolívar",
  carabobo: "Carabobo",
  cojedes: "Cojedes",
  "delta-amacuro": "Delta Amacuro",
  "distrito-capital": "Distrito Capital",
  falcon: "Falcón",
  guarico: "Guárico",
  lara: "Lara",
  merida: "Mérida",
  miranda: "Miranda",
  monagas: "Monagas",
  "nueva-esparta": "Nueva Esparta",
  portuguesa: "Portuguesa",
  sucre: "Sucre",
  tachira: "Táchira",
  trujillo: "Trujillo",
  vargas: "Vargas",
  yaracuy: "Yaracuy",
  zulia: "Zulia",
  
  // Ciudades/estados mexicanos (basados en los datos reales de vehicles.json)
  "leon": "León",
  "ciudad-de-mexico": "Ciudad de México",
  "monterrey": "Monterrey",
  "queretaro": "Querétaro",
  "puebla": "Puebla",
};

// Crear el mismo mapeo que useVehicleFiltering
const locationStringToSlugMap = {};
Object.entries(LOCATION_LABELS).forEach(([slug, label]) => {
  locationStringToSlugMap[label.toLowerCase().trim()] = slug;
  locationStringToSlugMap[slug.toLowerCase().trim()] = slug;
});

// Datos reales de ubicaciones de vehicles.json
const realLocations = [
  "León",
  "Ciudad de México", 
  "Monterrey",
  "Querétaro",
  "Puebla"
];

console.log("=== MAPEO DE UBICACIONES ===");
console.log("LOCATION_LABELS:", LOCATION_LABELS);
console.log("\nlocationStringToSlugMap:", locationStringToSlugMap);

console.log("\n=== PRUEBAS DE MAPEO ===");
realLocations.forEach(location => {
  const slug = locationStringToSlugMap[location.toLowerCase().trim()];
  console.log(`"${location}" -> "${slug}"`);
  if (!slug) {
    console.log(`  ❌ ERROR: No se pudo mapear "${location}"`);
  }
});

console.log("\n=== VERIFICACIÓN DE SLUGS EN LOCATION_LABELS ===");
const usedSlugs = new Set();
realLocations.forEach(location => {
  const slug = locationStringToSlugMap[location.toLowerCase().trim()];
  if (slug) usedSlugs.add(slug);
});

usedSlugs.forEach(slug => {
  const existsInLabels = LOCATION_LABELS[slug] !== undefined;
  console.log(`Slug "${slug}" existe en LOCATION_LABELS: ${existsInLabels}`);
  if (!existsInLabels) {
    console.log(`  ❌ ERROR: El slug "${slug}" no existe en LOCATION_LABELS`);
  }
});
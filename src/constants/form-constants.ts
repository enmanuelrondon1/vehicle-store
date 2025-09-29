

// src/constants/form-constants.ts
import { VehicleCategory } from "@/types/shared";

// ===============================
// INTERFACES
// ===============================

export interface Bank {
  name: string;
  url: string;
}

export interface FeatureCategory {
  iconName: string;
  color: string;
  features: string[];
}

export interface FormStep {
  label: string;
  iconName: string; // Cambiado a string para evitar JSX en constantes
  description: string;
}

export interface CategoryData {
  brands: Record<string, string[]>; // ¡CAMBIO CLAVE! Ahora es un objeto de marca -> modelos
}

// ===============================
// BANCOS VENEZOLANOS
// ===============================

export const banks: Bank[] = [
  // Bancos Públicos
  { name: "Banco de Venezuela", url: "https://www.bancodevenezuela.com" },
  { name: "Banco del Tesoro", url: "https://www.bt.gob.ve" },
  { name: "Banco Bicentenario del Pueblo", url: "https://www.bicentenariobu.com.ve" },
  { name: "Banco de la Fuerza Armada (Banfanb)", url: "https://www.banfanb.com.ve" },
  { name: "Banco Agrícola de Venezuela", url: "https://www.bav.com.ve" },

  // Bancos Privados
  { name: "Banesco", url: "https://www.banesco.com" },
  { name: "Banco Mercantil", url: "https://www.mercantilbanco.com" },
  { name: "BBVA Provincial", url: "https://www.provincial.com" },
  { name: "Banco del Caribe (Bancaribe)", url: "https://www.bancaribe.com.ve" },
  { name: "Banco Exterior", url: "https://www.bancoexterior.com" },
  { name: "Banco Caroní", url: "https://www.bancocaroni.com.ve" },
  { name: "Banco Sofitasa", url: "https://www.sofitasa.com" },
  { name: "Banco Plaza", url: "https://www.bancoplaza.com" },
  { name: "Banco Fondo Común (BFC)", url: "https://www.bfc.com.ve" },
  { name: "100% Banco", url: "https://www.100banco.com" },
  { name: "DelSur Banco Universal", url: "https://www.delsur.com.ve" },
  { name: "Banco Activo", url: "https://www.bancoactivo.com" },
  { name: "Bancamiga", url: "https://www.bancamiga.com" },
  { name: "Banplus", url: "https://www.banplusonline.com" },
  { name: "Banco Nacional de Crédito (BNC)", url: "https://www.bnc.com.ve" },
  { name: "Banco Venezolano de Crédito", url: "https://www.venezolano.com" },
  { name: "Banco Internacional de Desarrollo", url: "https://www.bid.com.ve" },
];

// ===============================
// DATOS GEOGRÁFICOS Y CONTACTO
// ===============================

export const VENEZUELAN_STATES = [
  "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar",
  "Carabobo", "Cojedes", "Delta Amacuro", "Distrito Capital", "Falcón",
  "Guárico", "Lara", "Mérida", "Miranda", "Monagas", "Nueva Esparta",
  "Portuguesa", "Sucre", "Táchira", "Trujillo", "Vargas", "Yaracuy", "Zulia"
].sort();

export const phoneCodes = ["0412", "0424", "0414", "0426", "0416"];

// ===============================
// ATRIBUTOS DE VEHÍCULOS
// ===============================

export const COMMON_COLORS = [
  "Blanco",
  "Negro",
  "Gris",
  "Plata",
  "Azul",
  "Rojo",
  "Verde",
  "Amarillo",
  "Marrón",
  "Naranja",
  "Vino Tinto",
  "Beige",
].sort();

// ===============================
// PASOS DEL FORMULARIO
// ===============================

export const formSteps: FormStep[] = [
  {
    label: "Información Básica",
    iconName: "Car",
    description: "Marca, modelo y año"
  },
  {
    label: "Precio y Condición",
    iconName: "DollarSign",
    description: "Valor y estado del vehículo"
  },
  {
    label: "Especificaciones",
    iconName: "FileText",
    description: "Detalles técnicos y motor"
  },
  {
    label: "Contacto",
    iconName: "MapPin",
    description: "Tus datos de vendedor"
  },
  {
    label: "Multimedia y Extras",
    iconName: "Camera",
    description: "Fotos y características"
  },
  {
    label: "Publicar",
    iconName: "CheckCircle",
    description: "Pago y confirmación"
  }
];

// ===============================
// CATEGORÍAS DE VEHÍCULOS
// ===============================

export const CATEGORY_DATA: Record<VehicleCategory, CategoryData> = {
  [VehicleCategory.CAR]: {
    brands: [
      { brand: "Toyota", models: ["Corolla", "Camry", "Yaris", "Prius", "Avalon", "Mirai", "86", "Supra", "Crown", "Century", "C-HR", "Vios", "Aygo", "iQ", "Etios", "Starlet", "Tercel", "Cressida", "Celica", "MR2", "Previa"] },
      { brand: "Honda", models: ["Civic", "Accord", "Fit", "Insight", "Clarity", "City", "Brio", "Amaze", "Legend", "S2000", "NSX", "CR-Z", "Accord Hybrid"] },
      { brand: "Ford", models: ["Fiesta", "Focus", "Fusion", "Mustang", "Taurus", "GT", "Falcon", "Fairlane", "LTD", "Crown Victoria", "Contour", "Probe", "Escort", "Orion"] },
      { brand: "Chevrolet", models: ["Spark", "Aveo", "Sonic", "Cruze", "Malibu", "Impala", "Camaro", "Corvette", "Cobalt", "Cavalier", "Beretta", "Corsica", "Monte Carlo", "Caprice", "Bel Air"] },
      { brand: "Nissan", models: ["Versa", "Sentra", "Altima", "Maxima", "370Z", "GT-R", "Sunny", "Pulsar", "Bluebird", "Laurel", "Cedric", "Gloria", "Cima", "Fuga", "Skyline"] },
      { brand: "Volkswagen", models: ["Gol", "Voyage", "Polo", "Virtus", "Jetta", "Passat", "Arteon", "Beetle", "Golf", "Scirocco", "Corrado", "Phaeton", "ID.3", "ID.7"] },
      { brand: "Hyundai", models: ["Accent", "Elantra", "Sonata", "Ioniq", "Veloster", "i10", "i20", "i30", "Genesis", "Equus", "Aslan", "Grandeur", "Azera"] },
      { brand: "Kia", models: ["Rio", "Forte", "Cerato", "Optima", "K5", "Stinger", "Picanto", "Ceed", "ProCeed", "Cadenza", "K900", "Quoris", "Opirus"] },
      { brand: "Mazda", models: ["Mazda2", "Mazda3", "Mazda6", "MX-5 Miata", "RX-7", "RX-8", "323", "626", "929", "Cosmo", "Atenza", "Axela"] },
      { brand: "Mitsubishi", models: ["Mirage", "Lancer", "Eclipse Cross", "Galant", "Diamante", "Debonair", "Proudia", "Dignity", "i-MiEV"] },
      { brand: "Renault", models: ["Sandero", "Logan", "Symbol", "Clio", "Megane", "Talisman", "Laguna", "Safrane", "Vel Satis", "Fluence", "Wind"] },
      { brand: "Peugeot", models: ["208", "308", "408", "508", "106", "206", "306", "406", "607", "605", "504", "505", "RCZ"] },
      { brand: "Fiat", models: ["Mobi", "Argo", "Cronos", "Tipo", "500", "Punto", "Bravo", "Linea", "Marea", "Tempra", "Croma", "124 Spider"] },
      { brand: "BMW", models: ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "Serie 7", "Serie 8", "Z4", "i3", "i4", "i7", "M1", "2002"] },
      { brand: "Mercedes-Benz", models: ["Clase A", "Clase B", "Clase C", "Clase E", "Clase S", "Clase CL", "Clase CLS", "Clase SL", "Clase SLC", "Maybach"] },
      { brand: "Audi", models: ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "S1", "S3", "S4", "S5", "S6", "S7", "S8", "RS3", "RS4", "RS5", "RS6", "RS7"] },
      { brand: "Chery", models: ["Tiggo 2", "Tiggo 4", "Tiggo 7", "Tiggo 8", "Arrizo 5", "Arrizo 6", "Arrizo 8", "Fulwin", "QQ", "Cowin", "E5"] },
      { brand: "Geely", models: ["Emgrand", "Borui", "Binrui", "Xingyue", "Boyue", "Haoyue", "Jiaji", "Vision", "GC9", "MK", "CK"] },
      { brand: "BYD", models: ["Dolphin", "Seal", "Han", "Seagull", "Qin", "Tang", "Song", "Yuan", "E2", "E3", "F3", "F6", "G5"] },
      { brand: "Changan", models: ["Alsvin", "Eado", "Raeton", "Benben", "Alsvin V7", "Eado Plus", "Raeton Plus", "UNI-V"] },
      { brand: "Otra", models: ["Otro"] }
    ].reduce((acc, { brand, models }) => {
      acc[brand] = [...new Set([...models, "Otro"])];
      return acc;
    }, {} as Record<string, string[]>)
  },
  
 [VehicleCategory.MOTORCYCLE]: {
    brands: [
      { brand: "Yamaha", models: ["YBR 125", "FZ16", "FZ25", "MT-03", "MT-07", "MT-09", "MT-10", "MT-15", "R15", "R3", "R6", "R1", "R7", "XTZ 250", "XTZ 125", "XTZ 150", "NMAX", "XMAX", "TMAX", "Tricity", "BW'S", "Crypton", "Soul GT", "Aerox"] },
      { brand: "Honda", models: ["CG 125", "CG 150", "CG 160", "CB 125", "CB 150", "CB 250", "CB 300", "CB 500", "CB 650", "CB 1000", "CBR 250", "CBR 500", "CBR 600", "CBR 650", "CBR 1000", "CRF 250", "CRF 450", "XRE 300", "PCX 150", "PCX 160", "ADV 150", "FORZA 350", "SH 150", "SH 300", "Gold Wing", "Africa Twin", "Rebel", "Shadow", "VTX", "Valkyrie"] },
      { brand: "Suzuki", models: ["GN 125", "GSX-R 600", "GSX-R 750", "GSX-R 1000", "GSX-S 750", "GSX-S 1000", "V-Strom 250", "V-Strom 650", "V-Strom 1050", "DR-Z 400", "Hayabusa", "Bandit", "Boulevard", "Intruder", "VanVan", "Address", "Burgman"] },
      { brand: "Kawasaki", models: ["Ninja 300", "Ninja 400", "Ninja 650", "Ninja ZX-6R", "Ninja ZX-10R", "Z400", "Z650", "Z900", "Z1000", "Versys 300", "Versys 650", "Versys 1000", "KLR 650", "Vulcan", "W800", "Eliminator", "Concours", "Voyager"] },
      { brand: "Bajaj", models: ["Pulsar 125", "Pulsar 150", "Pulsar 180", "Pulsar 200", "Pulsar 220", "Pulsar NS 200", "Pulsar RS 200", "Dominar 250", "Dominar 400", "Boxer 150", "Discover 125", "Avenger 160", "Avenger 220", "CT 100", "Platina", "V15", "V12"] },
      { brand: "TVS", models: ["Apache RTR 160", "Apache RTR 180", "Apache RTR 200", "Apache RR 310", "Raider 125", "HLX 125", "Ntorq 125", "Jupiter", "Wego", "Scooty", "Star City", "Sport", "Phoenix"] },
      { brand: "Hero", models: ["Splendor", "Passion", "Glamour", "Super Splendor", "Xtreme", "Xpulse", "Karizma", "Hunk", "Achiever", "CBZ", "Ignitor", "Impulse", "Pleasure", "Maestro", "Duet"] },
      { brand: "KTM", models: ["Duke 125", "Duke 200", "Duke 250", "Duke 390", "RC 125", "RC 200", "RC 390", "Adventure 250", "Adventure 390", "1290 Super Duke", "1290 Super Adventure", "390 Adventure", "790 Adventure", "890 Adventure", "450 EXC", "350 EXC"] },
      { brand: "Ducati", models: ["Monster", "Scrambler", "Hypermotard", "Supersport", "Panigale", "Multistrada", "Diavel", "Streetfighter", "DesertX", "Superleggera", "Streetfighter V4", "Monster SP", "Multistrada V4"] },
      { brand: "BMW", models: ["G 310 R", "G 310 GS", "F 750 GS", "F 850 GS", "R 1250 GS", "S 1000 RR", "R 18", "R nineT", "K 1600", "C 400", "C 650", "F 800", "R 1200", "HP4", "M 1000 RR"] },
      { brand: "Harley-Davidson", models: ["Street 500", "Street 750", "Sportster", "Softail", "Touring", "CVO", "LiveWire", "Electra Glide", "Road King", "Street Glide", "Road Glide", "Fat Boy", "Heritage Classic", "Breakout"] },
      { brand: "Empire Keeway", models: ["Arsenal", "Horse", "Owen", "RKV", "Superlight", "TX"] },
      { brand: "Bera", models: ["BRZ 200", "León", "Mustang", "SBR", "X1"] },
      { brand: "Otra", models: ["Otro"] }
    ].reduce((acc, { brand, models }) => {
      acc[brand] = [...new Set([...models, "Otro"])];
      return acc;
    }, {} as Record<string, string[]>)
  },

 [VehicleCategory.TRUCK]: {
    brands: [
      { brand: "Toyota", models: ["Hilux", "Tacoma", "Tundra", "T100", "Dyna", "Toyoace", "Coaster", "HiAce", "TownAce", "DA100", "DA115", "FA100", "FA150", "FA200", "FA300", "FA400", "FC", "FD", "FG", "Land Cruiser 70 Series"] },
      { brand: "Ford", models: ["Ranger", "F-150", "F-250", "F-350", "F-450", "F-550", "F-650", "F-750", "F-53", "F-59", "F-Series Super Duty", "LCF", "E-Series", "Cargo", "F-650/F-750 SD"] },
      { brand: "Chevrolet", models: ["Colorado", "Silverado 1500", "Silverado 2500", "Silverado 3500", "Silverado 4500HD", "Silverado 5500HD", "Silverado 6500HD", "T-Series", "W-Series", "Express Cutaway", "LUV", "S-10", "SSR"] },
      { brand: "Nissan", models: ["Frontier", "Titan", "Titan XD", "NT400", "NT500", "NT450 Clipper", "UD Trucks", "Atlas", "Cabstar", "Clipper", "Condor", "Homy"] },
      { brand: "RAM", models: ["1500", "2500", "3500", "4500", "5500", "ProMaster", "ProMaster City", "3500 Chassis Cab", "4500 Chassis Cab", "5500 Chassis Cab", "Power Wagon", "Rampage"] },
      { brand: "GMC", models: ["Canyon", "Sierra 1500", "Sierra 2500", "Sierra 3500", "Sierra 4500HD", "Sierra 5500HD", "Savana Cutaway", "Syclone", "Typhoon", "Sonoma", "Jimmy"] },
      { brand: "Isuzu", models: ["D-Max", "Elf", "NPR", "NQR", "NRR", "FVR", "FTR", "GVR", "Giga", "CVR", "CXR", "CYR", "Forward", "H-Series", "Rodeo", "Amigo", "Ascender"] },
      { brand: "Hino", models: ["300 Series", "Dutro", "500 Series", "600 Series", "700 Series", "SG2J", "SG8J", "AK8J", "FC9J", "FD8J", "FF8J", "195h", "295h", "695h"] },
      { brand: "Mitsubishi", models: ["L200", "L300", "Fuso Canter", "Fuso Fighter", "Fuso Super Great", "Fuso Shogun", "Raider", "Mighty Max", "Strada"] },
      { brand: "Mercedes-Benz", models: ["Sprinter", "Vito", "Viano", "Travego", "Intouro", "Tourismo", "Citaro", "Atego", "Axor", "Actros", "Arocs", "Econic", "Unimog", "Zetros"] },
      { brand: "Volvo", models: ["VNR", "VNL", "VHD", "VNX", "VAH", "FM", "FH", "FMX", "FE", "FL", "VN", "9700", "9900", "7900", "BZL"] },
      { brand: "Freightliner", models: ["Cascadia", "Coronado", "122SD", "M2", "SD", "114SD", "108SD", "Business Class M2", "Argosy", "Columbia", "Century Class", "Classic"] },
      { brand: "Kenworth", models: ["T180", "T280", "T380", "T680", "T880", "W900", "T800", "C500", "T440", "K100", "K200", "L700", "W900L"] },
      { brand: "Peterbilt", models: ["325", "337", "389", "579", "567", "348", "367", "365", "357", "362", "320", "330", "340", "384"] },
      { brand: "International", models: ["CV Series", "MV Series", "LT Series", "RH Series", "HX Series", "HV Series", "Durastar", "ProStar", "LoneStar", "PayStar", "TranStar"] },
      { brand: "JAC", models: ["T6", "T8", "T9", "N55", "N56", "N75", "N350", "N400", "X200", "X500", "X600", "X700", "X800"] },
      { brand: "Foton", models: ["Tunland", "Aumark", "Ollin", "Auman", "Forland", "Aumark TX", "View", "Midi", "Toano", "Sauvana"] },
      { brand: "Dongfeng", models: ["Rich", "Patrol", "Captain", "Kingland", "KR", "KL", "Tianlong", "KC", "Mengshi", "Voyah", "Aeolus"] },
      { brand: "Otra", models: ["Otro"] }
    ].reduce((acc, { brand, models }) => {
      acc[brand] = [...new Set([...models, "Otro"])];
      return acc;
    }, {} as Record<string, string[]>)
  },

 [VehicleCategory.SUV]: {
    brands: [
      { brand: "Toyota", models: ["RAV4", "Highlander", "4Runner", "Fortuner", "Land Cruiser", "Prado", "Sequoia", "C-HR", "Corolla Cross", "Venza", "Harrier", "Rush", "FJ Cruiser", "Land Cruiser 70", "Mega Cruiser"] },
      { brand: "Honda", models: ["CR-V", "HR-V", "Pilot", "Passport", "BR-V", "WR-V", "Elevate", "Crosstour", "Element", "ZDX"] },
      { brand: "Ford", models: ["Escape", "Bronco", "Bronco Sport", "Explorer", "Expedition", "Edge", "EcoSport", "Flex", "Excursion", "Freestyle", "Territory"] },
      { brand: "Chevrolet", models: ["Trax", "Trailblazer", "Equinox", "Blazer", "Tahoe", "Suburban", "Traverse", "Captiva", "Orlando", "HHR", "Avalanche"] },
      { brand: "Nissan", models: ["Kicks", "Rogue", "Pathfinder", "Armada", "X-Trail", "Murano", "Juke", "Qashqai", "Xterra", "Patrol", "Terrano"] },
      { brand: "Volkswagen", models: ["T-Cross", "Taos", "Tiguan", "Atlas", "Touareg", "ID.4", "ID.5", "ID.6", "T-Roc", "Tharu", "Talagon"] },
      { brand: "Hyundai", models: ["Creta", "Tucson", "Santa Fe", "Palisade", "Kona", "Venue", "AX1", "Alcazar", "Maxcruz", "Galloper", "Terracan"] },
      { brand: "Kia", models: ["Seltos", "Sportage", "Sorento", "Telluride", "EV6", "EV9", "Niro", "Soul", "Borrego", "Mohave", "Carens"] },
      { brand: "Mazda", models: ["CX-3", "CX-30", "CX-5", "CX-9", "CX-50", "CX-90", "CX-8", "CX-4", "Tribute", "Navajo"] },
      { brand: "Mitsubishi", models: ["Outlander", "Eclipse Cross", "Montero Sport", "Pajero", "Pajero Sport", "ASX", "RVR", "Montero", "Shogun"] },
      { brand: "Subaru", models: ["Crosstrek", "Forester", "Outback", "Ascent", "XV", "B9 Tribeca", "SVX", "BRAT", "Baja"] },
      { brand: "Jeep", models: ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator", "Wagoneer", "Grand Wagoneer", "Commander", "Liberty"] },
      { brand: "Land Rover", models: ["Range Rover Evoque", "Range Rover Velar", "Range Rover Sport", "Range Rover", "Discovery", "Defender", "Freelander", "Discovery Sport"] },
      { brand: "BMW", models: ["X1", "X2", "X3", "X4", "X5", "X6", "X7", "XM", "iX3", "iX", "X4 M", "X5 M", "X6 M"] },
      { brand: "Mercedes-Benz", models: ["GLA", "GLB", "GLC", "GLE", "GLS", "G-Class", "GL-Class", "M-Class", "R-Class", "EQB", "EQC", "EQE SUV", "EQS SUV"] },
      { brand: "Audi", models: ["Q3", "Q5", "Q7", "Q8", "Q2", "Q4 e-tron", "Q5 e-tron", "Q7 e-tron", "Q8 e-tron", "RS Q3", "RS Q8"] },
      { brand: "Volvo", models: ["XC40", "XC60", "XC90", "XC70", "C40", "EX30", "EX90", "XC20", "XC100"] },
      { brand: "Great Wall", models: ["Haval H6", "Haval Jolion", "Poer", "Tank 300", "Tank 400", "Tank 500", "Tank 700", "Wingle", "Cannon", "Ora"] },
      { brand: "Chery", models: ["Tiggo 2", "Tiggo 3x", "Tiggo 4", "Tiggo 5x", "Tiggo 7", "Tiggo 7 Pro", "Tiggo 8", "Tiggo 8 Pro", "Tiggo 9", "Omoda 5", "Jaecoo 7", "Arrizo Star", "Fengyun"] },
      { brand: "Changan", models: ["CS35 Plus", "CS55 Plus", "CS75 Plus", "CS95", "Uni-K", "Uni-T", "Oshan X7", "Hunter", "Kaicene"] },
      { brand: "Otra", models: ["Otro"] }
    ].reduce((acc, { brand, models }) => {
      acc[brand] = [...new Set([...models, "Otro"])];
      return acc;
    }, {} as Record<string, string[]>)
  },

 [VehicleCategory.BUS]: {
    brands: [
      { brand: "Mercedes-Benz", models: ["Sprinter", "Vito", "Viano", "Travego", "Intouro", "Tourismo", "Citaro", "Conecto", "Integro", "Capacity", "O345", "O405", "O500", "OC500", "OF series"] },
      { brand: "Volvo", models: ["B8R", "B11R", "B13R", "9700", "9900", "7900", "BZL", "8700", "8900", "8500", "B12", "B9", "B10", "B15", "Olympian", "Super Olympian"] },
      { brand: "Scania", models: ["K-Series", "F-Series", "L-Series", "Interlink", "Touring", "Citywide", "OmniLink", "OmniExpress", "OmniCity", "Higer", "Irizar", "Marcopolo"] },
      { brand: "Hino", models: ["SG2J", "SG8J", "AK8J", "FC9J", "FD8J", "FF8J", "Liesse II", "Melpha", "Selega", "S'elega", "Blue Ribbon", "Rainbow", "Poncho", "Dutro bus"] },
      { brand: "Isuzu", models: ["ELF Bus", "Novo Bus", "Gala Bus", "Erga", "Erga Mio", "Journey", "Journey-J", "Cubic", "Citibus", "Gala Mio", "LV series", "MU series"] },
      { brand: "MAN", models: ["Lion's Coach", "Lion's City", "Lion's Intercity", "Lion's Regio", "Lion's Classic", "Neoplan", "Stadtbus", "ÜL series", "NM series", "NG series"] },
      { brand: "Iveco", models: ["Daily", "Crossway", "Eurocargo", "Euroclass", "Evadys", "Magelys", "Domino", "Domino HD", "Mago", "Voyager", "Urbanway", "Streetway"] },
      { brand: "Marcopolo", models: ["Paradiso G7", "Paradiso G8", "Viaggio G7", "Viaggio G8", "Torino", "Senior", "Audace", "Ideale", "Viale", "Andare", "Multego", "XM", "XD"] },
      { brand: "Busscar", models: ["Vissta Buss", "Urbanuss", "El Buss", "Jum Buss", "Ideal", "Microbuss", "Omnibus", "Panorámico DD", "Vissta Buss LE", "Elegance"] },
      { brand: "Agrale", models: ["MA 8.7", "MA 9.2", "MA 10.0", "MA 17.0", "MT series", "A series", "V series"] },
      { brand: "Yutong", models: ["ZK6118H", "ZK6122H", "ZK6129H", "ZK6852H", "ZK6906H", "ZK6100H", "IC series", "T series", "U series", "V series", "E series"] },
      { brand: "Toyota", models: ["Coaster", "Hiace Commuter", "Dyna Bus", "Toyoace Bus", "Publica", "Liteace", "Townace", "HiAce bus versions"] },
      { brand: "Otra", models: ["Otro"] }
    ].reduce((acc, { brand, models }) => {
      acc[brand] = [...new Set([...models, "Otro"])];
      return acc;
    }, {} as Record<string, string[]>)
  },

 [VehicleCategory.VAN]: {
    brands: [
      { brand: "Toyota", models: ["Hiace", "Proace", "Proace City", "Liteace", "Townace", "Masterace", "Qualis", "Innova", "Kijang", "Avanza", "Rush", "Sienna", "Estima", "Noah", "Voxy"] },
      { brand: "Ford", models: ["Transit", "Transit Custom", "Tourneo Custom", "E-Series", "Transit Connect", "Aerostar", "Windstar", "Freestar", "Galaxy", "Tourneo"] },
      { brand: "Chevrolet", models: ["Express", "N300", "Astro", "Lumina APV", "Venture", "Uplander", "Montana", "HHR", "City Express", "Trax", "Orlando"] },
      { brand: "Nissan", models: ["Urvan", "NV350", "NV200", "NV400", "Caravan", "Serena", "Elgrand", "Lafesta", "Liberty", "AD", "Vanette", "Prairie", "Cube"] },
      { brand: "Hyundai", models: ["H1", "Starex", "Porter", "County", "Solati", "Mighty", "Libero", "Staria", "Custo", "Universe", "Aero Town", "e-Mighty"] },
      { brand: "Kia", models: ["Pregio", "Carnival", "Bongo", "Besta", "Sedona", "Carens", "Soul", "Niro", "Ray", "Venga", "Joice", "Towner", "AMC"] },
      { brand: "Isuzu", models: ["ELF Van", "D-Max Van", "Fargo", "Como", "Oasis", "Bison", "Rodeo", "Amigo", "MU", "Wizard", "VehiCROSS"] },
      { brand: "Mercedes-Benz", models: ["Sprinter", "Vito", "Viano", "Marco Polo", "V-Class", "Metris", "Vito Tourer", "Viano Ambiente", "eVito", "eSprinter"] },
      { brand: "Iveco", models: ["Daily", "Eurocargo", "Eurocargo ML", "Eurostar", "Eurotech", "Stralis", "Trakker", "Acco", "PowerStar", "Massif", "Campagnola"] },
      { brand: "Peugeot", models: ["Partner", "Expert", "Boxer", "Bipper", "Rifter", "Traveller", "807", "1007", "3008", "5008", "e-Partner", "e-Expert"] },
      { brand: "Renault", models: ["Kangoo", "Master", "Trafic", "Espace", "Scenic", "Grand Scenic", "Modus", "Twingo", "Wind", "Avantime", "Vel Satis", "Fuego"] },
      { brand: "Fiat", models: ["Ducato", "Talento", "Doblò", "Scudo", "Ulysse", "Qubo", "Idea", "Multipla", "500L", "500X", "Freemont", "Sedici", "Stilo"] },
      { brand: "Changan", models: ["Star 5", "Star 7", "Star 9", "Honor", "Nebula", "UNI-K", "Oshan X5", "X7", "Hunter", "Kaicene", "Lumin", "Benben"] },
      { brand: "Chery", models: ["Q22L", "K50", "V22", "Fulwin", "Arrizo", "Tiggo", "Omoda", "Jaecoo", "Karry", "Eastar", "CrossEastar", "V5", "A5"] },
      { brand: "Otra", models: ["Otro"] }
    ].reduce((acc, { brand, models }) => {
      acc[brand] = [...new Set([...models, "Otro"])];
      return acc;
    }, {} as Record<string, string[]>)
  },
};

// ===============================
// MODELOS POR MARCA
// ===============================

// Ya no necesitamos MODELS_BY_BRAND. La información ahora está dentro de CATEGORY_DATA.
// export const MODELS_BY_BRAND: Record<string, string[]> = { ... };


// ===============================
// CARACTERÍSTICAS DE VEHÍCULOS
// ===============================

// Características BASE que aplican a todos los vehículos
const BASE_FEATURES = {
  Básico: {
    iconName: "Car",
    color: "text-blue-600",
    features: [
      "Aire Acondicionado",
      "Radio AM/FM",
      "Alarma",
      "Seriales Intactos",
    ],
  },
  Seguridad: {
    iconName: "Shield",
    color: "text-green-600", 
    features: [
      "Cinturones de Seguridad",
      "Luces Antiniebla",
    ],
  },
};

// Características específicas por tipo de vehículo
const VEHICLE_SPECIFIC_FEATURES = {
  [VehicleCategory.CAR]: {
    Básico: {
      iconName: "Car",
      color: "text-blue-600",
      features: [
        ...BASE_FEATURES.Básico.features,
        "Vidrios Eléctricos", 
        "Dirección Hidráulica",
        "Caucho de Repuesto",
        "Llave de Repuesto",
      ],
    },
    Comodidad: {
      iconName: "Users",
      color: "text-purple-600",
      features: [
        "Tapicería de Cuero", "Asientos de Tela", "Volante Ajustable",
        "Espejos Eléctricos", "Vidrios Polarizados", "Techo Solar",
        "Bluetooth", "Sistema de Sonido Premium", "Arranque por Botón",
        "Asientos Calefaccionados", "Control de Crucero", "GPS Integrado",
      ],
    },
    Seguridad: {
      iconName: "Shield",
      color: "text-green-600",
      features: [
        ...BASE_FEATURES.Seguridad.features,
        "Frenos ABS", "Airbags Frontales", "Airbags Laterales", 
        "Frenos de Disco", "Cámara de Reversa", "Sensores de Estacionamiento",
        "Control de Estabilidad", "Blindaje",
      ],
    },
    Tecnología: {
      iconName: "Zap",
      color: "text-indigo-600",
      features: [
        "Android Auto", "Apple CarPlay", "Cargador Inalámbrico",
        "Pantalla Táctil", "Sistema de Navegación", "Conectividad WiFi",
      ],
    },
  },

  [VehicleCategory.MOTORCYCLE]: {
    Básico: {
      iconName: "Navigation",
      color: "text-orange-600",
      features: [
        "Arranque Eléctrico", "Arranque a Patada", "Luces LED",
        "Odómetro Digital", "Indicador de Combustible", "Seriales Intactos",
        "Llaves de Repuesto",
      ],
    },
    Seguridad: {
      iconName: "Shield",
      color: "text-green-600",
      features: [
        "Frenos de Disco Delanteros", "Frenos de Disco Traseros", 
        "Sistema ABS", "Alarma", "Candado de Disco", "Espejos Retrovisores",
        "Luces Intermitentes",
      ],
    },
    Comodidad: {
      iconName: "Users",
      color: "text-purple-600",
      features: [
        "Asiento para Pasajero", "Parrilla Trasera", "Protector de Motor",
        "Protector de Tanque", "Puños Ergonómicos", "Windshield/Parabrisas",
      ],
    },
    Accesorios: {
      iconName: "Package",
      color: "text-cyan-600",
      features: [
        "Baúl/Maleta", "Alforjas Laterales", "Soporte para Celular",
        "Cargador USB", "Kit de Herramientas", "Funda/Cobertor",
      ],
    },
  },

  [VehicleCategory.TRUCK]: {
    Básico: {
      iconName: "Truck",
      color: "text-gray-600",
      features: [
        ...BASE_FEATURES.Básico.features,
        "Dirección Hidráulica", "Vidrios Eléctricos", "Caucho de Repuesto",
        "Herramientas Básicas",
      ],
    },
    Comercial: {
      iconName: "Package",
      color: "text-orange-600",
      features: [
         "Ganchos de Remolque",
        "Compartimento de Carga", "Carrocería de Estacas", "Carrocería Cerrada",
        "Sistema Hidráulico", "Grúa Incorporada", "Rampa de Carga",
      ],
    },
    Seguridad: {
      iconName: "Shield",
      color: "text-green-600",
      features: [
        ...BASE_FEATURES.Seguridad.features,
        "Frenos ABS", "Frenos de Aire", "Airbags", "Luces de Emergencia",
        "Reflectores de Seguridad", "Sistema de Monitoreo",
      ],
    },
    Operación: {
      iconName: "Wrench",
      color: "text-red-600",
      features: [
        "Transmisión Manual", "Transmisión Automática", "Diferencial Bloqueado",
        "Tracción 4x4", "Compresor de Aire", "Toma de Fuerza (PTO)",
      ],
    },
  },

  [VehicleCategory.SUV]: {
    Básico: {
      iconName: "Car",
      color: "text-blue-600",
      features: [
        ...BASE_FEATURES.Básico.features,
        "Vidrios Eléctricos", "Dirección Hidráulica", 
        "Caucho de Repuesto", "Llantas de Aleación",
      ],
    },
    Comodidad: {
      iconName: "Users",
      color: "text-purple-600",
      features: [
        "Tapicería de Cuero", "Asientos de Tela", "Tercera Fila de Asientos",
        "Asientos Plegables", "Volante Ajustable", "Espejos Eléctricos",
        "Vidrios Polarizados", "Techo Solar/Panorámico", "Bluetooth",
        "Sistema de Sonido Premium", "Arranque por Botón", "Control de Clima Dual",
      ],
    },
    Seguridad: {
      iconName: "Shield",
      color: "text-green-600",
      features: [
        ...BASE_FEATURES.Seguridad.features,
        "Frenos ABS", "Airbags Frontales", "Airbags Laterales", "Airbags de Cortina",
        "Frenos de Disco", "Cámara de Reversa", "Sensores de Estacionamiento",
        "Control de Estabilidad", "Control de Tracción", "Barras de Protección",
      ],
    },
    "Tracción y Terreno": {
      iconName: "Navigation",
      color: "text-emerald-600",
      features: [
        "Tracción 4x4", "Tracción 4x2", "Diferencial Bloqueado",
        "Control de Descenso", "Modos de Manejo", "Protectores de Bajos",
        "Ganchos de Remolque",
      ],
    },
  },

  [VehicleCategory.BUS]: {
    Básico: {
      iconName: "Users",
      color: "text-blue-600",
      features: [
        "Aire Acondicionado", "Sistema de Audio", "Puertas Automáticas",
        "Escalones Antideslizantes", "Ventanas Panorámicas", "Asientos Reclinables",
      ],
    },
    Pasajeros: {
      iconName: "Users",
      color: "text-purple-600",
      features: [
        "Capacidad de Pasajeros (especificar)", "Asientos Acolchados",
        "Portaequipajes", "Baño Incorporado", "TV/Entretenimiento",
        "WiFi para Pasajeros", "Cortinas", "Iluminación LED Interior",
      ],
    },
    Seguridad: {
      iconName: "Shield",
      color: "text-green-600",
      features: [
        ...BASE_FEATURES.Seguridad.features,
        "Frenos ABS", "Salidas de Emergencia", "Extintor de Incendios",
        "Botiquín de Primeros Auxilios", "Cámara de Reversa", "GPS de Rastreo",
        "Sistema de Comunicación",
      ],
    },
    Operación: {
      iconName: "Wrench",
      color: "text-red-600",
      features: [
        "Transmisión Manual", "Transmisión Automática", 
        "Sistema Hidráulico", "Suspensión Neumática", "Motor Trasero",
        "Motor Delantero",
      ],
    },
  },

  [VehicleCategory.VAN]: {
    Básico: {
      iconName: "Package",
      color: "text-gray-600",
      features: [
        ...BASE_FEATURES.Básico.features,
        "Vidrios Eléctricos", "Dirección Hidráulica", "Caucho de Repuesto",
      ],
    },
    Configuración: {
      iconName: "Users",
      color: "text-purple-600",
      features: [
        "Configuración de Pasajeros", "Configuración de Carga", "Configuración Mixta",
        "Asientos Removibles", "Divisor de Carga", "Ventanas Laterales",
        "Puertas Corredizas", "Puerta Trasera Doble",
      ],
    },
    Seguridad: {
      iconName: "Shield",
      color: "text-green-600",
      features: [
        ...BASE_FEATURES.Seguridad.features,
        "Frenos ABS", "Airbags Frontales", "Frenos de Disco", "Cámara de Reversa",
        "Sensores de Estacionamiento", "Sistema de Alarma",
      ],
    },
    Carga: {
      iconName: "Package",
      color: "text-orange-600",
      features: [
        "Capacidad de Carga (especificar kg)", "Anclajes de Carga",
        "Piso Antideslizante", "Iluminación de Carga", "Ganchos de Amarre",
        "Rampa de Acceso",
      ],
    },
  },
};

// ===============================
// FUNCIONES UTILITARIAS
// ===============================

// Función para obtener características según el tipo de vehículo
export const getAvailableFeatures = (category: VehicleCategory): Record<string, FeatureCategory> => {
  return VEHICLE_SPECIFIC_FEATURES[category] || {};
};

// Función para obtener todas las características disponibles (para admin/debugging)
export const getAllFeatures = (): string[] => {
  const allFeatures: string[] = [];
  
  Object.values(VEHICLE_SPECIFIC_FEATURES).forEach(vehicleFeatures => {
    Object.values(vehicleFeatures).forEach(category => {
      allFeatures.push(...category.features);
    });
  });
  
  return [...new Set(allFeatures)].sort();
};

// Función para validar si una característica es válida para un tipo de vehículo
export const isFeatureValidForCategory = (feature: string, category: VehicleCategory): boolean => {
  const categoryFeatures = getAvailableFeatures(category);
  
  return Object.values(categoryFeatures).some(featureCategory =>
    featureCategory.features.includes(feature)
  );
};

// Función para migrar características existentes al cambiar de categoría
export const migrateFeatures = (
  currentFeatures: string[],
  fromCategory: VehicleCategory,
  toCategory: VehicleCategory
): string[] => {
  if (fromCategory === toCategory) return currentFeatures;
  
  return currentFeatures.filter(feature => 
    isFeatureValidForCategory(feature, toCategory)
  );
};
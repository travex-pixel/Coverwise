/**
 * Compact Australian vehicle reference data for guided entry.
 * `value` is an approximate new-vehicle retail value in AUD used only by
 * the demonstration pricing engine. Variants are indicative, not exhaustive;
 * customers can always type a variant manually.
 */
export interface VehicleModel {
  name: string;
  value: number;
  variants: string[];
  from?: number;
}

export interface VehicleMake {
  name: string;
  models: VehicleModel[];
}

const sedanVariants = ["Base", "Mid", "Premium", "Sport"];

export const VEHICLE_MAKES: VehicleMake[] = [
  {
    name: "Subaru",
    models: [
      {
        name: "Forester",
        value: 45000,
        from: 1997,
        variants: ["2.5i", "2.5i-L", "2.5i Premium", "2.5i Sport", "2.5i-S", "Hybrid L", "Hybrid S"],
      },
      { name: "Outback", value: 48000, from: 1996, variants: ["AWD", "AWD Sport", "AWD Touring", "AWD Sport XT", "AWD Touring XT"] },
      { name: "Impreza", value: 33000, from: 1993, variants: ["2.0L", "2.0R", "2.0S"] },
      { name: "Crosstrek", value: 38000, from: 2023, variants: ["2.0L", "2.0R", "2.0S", "Hybrid L", "Hybrid S"] },
      { name: "XV", value: 36000, from: 2012, variants: ["2.0i", "2.0i-L", "2.0i Premium", "2.0i-S", "Hybrid L", "Hybrid S"] },
      { name: "WRX", value: 52000, from: 1994, variants: ["AWD", "RS", "tS"] },
      { name: "BRZ", value: 44000, from: 2012, variants: ["Coupe", "Coupe S", "tS"] },
    ],
  },
  {
    name: "Toyota",
    models: [
      { name: "Corolla", value: 32000, from: 1990, variants: ["Ascent Sport", "SX", "ZR", "Ascent Sport Hybrid", "ZR Hybrid"] },
      { name: "Camry", value: 42000, from: 1990, variants: ["Ascent", "Ascent Sport", "SX", "SL"] },
      { name: "RAV4", value: 48000, from: 1994, variants: ["GX", "GXL", "XSE", "Cruiser", "Edge"] },
      { name: "HiLux", value: 58000, from: 1990, variants: ["Workmate", "SR", "SR5", "Rogue", "GR Sport"] },
      { name: "Kluger", value: 62000, from: 2003, variants: ["GX", "GXL", "Grande"] },
      { name: "LandCruiser Prado", value: 80000, from: 1996, variants: ["GX", "GXL", "VX", "Kakadu", "Altitude"] },
      { name: "Yaris Cross", value: 34000, from: 2020, variants: ["GX", "GXL", "Urban"] },
      { name: "C-HR", value: 44000, from: 2017, variants: ["GXL", "Koba", "GR Sport"] },
    ],
  },
  {
    name: "Mazda",
    models: [
      { name: "CX-5", value: 46000, from: 2012, variants: ["Maxx", "Maxx Sport", "Touring", "GT SP", "Akera"] },
      { name: "CX-3", value: 32000, from: 2015, variants: ["Neo Sport", "Maxx Sport", "Evolve", "sTouring", "Akari"] },
      { name: "CX-30", value: 40000, from: 2020, variants: ["Pure", "Evolve", "Touring", "Astina"] },
      { name: "Mazda3", value: 36000, from: 2004, variants: ["Pure", "Evolve", "Touring", "GT", "Astina"] },
      { name: "CX-60", value: 68000, from: 2023, variants: ["Evolve", "GT", "Azami"] },
      { name: "BT-50", value: 56000, from: 2006, variants: ["XS", "XT", "XTR", "GT", "SP"] },
    ],
  },
  {
    name: "Hyundai",
    models: [
      { name: "i30", value: 33000, from: 2007, variants: ["Active", "Elite", "N Line", "N Line Premium", "N"] },
      { name: "Tucson", value: 45000, from: 2004, variants: ["Base", "Elite", "Highlander", "N Line"] },
      { name: "Kona", value: 38000, from: 2017, variants: ["Base", "Premium", "N Line", "Electric"] },
      { name: "Santa Fe", value: 60000, from: 2000, variants: ["Base", "Elite", "Highlander", "Calligraphy"] },
      { name: "IONIQ 5", value: 72000, from: 2021, variants: ["Dynamiq", "Techniq", "Epiq", "N"] },
    ],
  },
  {
    name: "Kia",
    models: [
      { name: "Sportage", value: 46000, from: 2005, variants: ["S", "SX", "SX+", "GT-Line"] },
      { name: "Cerato", value: 30000, from: 2009, variants: ["S", "Sport", "Sport+", "GT"] },
      { name: "Seltos", value: 38000, from: 2019, variants: ["S", "Sport", "Sport+", "GT-Line"] },
      { name: "Sorento", value: 60000, from: 2003, variants: ["S", "Sport", "Sport+", "GT-Line"] },
      { name: "EV6", value: 78000, from: 2022, variants: ["Air", "GT-Line", "GT"] },
    ],
  },
  {
    name: "Ford",
    models: [
      { name: "Ranger", value: 62000, from: 2011, variants: ["XL", "XLS", "XLT", "Sport", "Wildtrak", "Raptor"] },
      { name: "Everest", value: 70000, from: 2015, variants: ["Ambiente", "Trend", "Sport", "Platinum"] },
      { name: "Puma", value: 36000, from: 2020, variants: ["Base", "ST-Line", "ST-Line V"] },
      { name: "Mustang", value: 70000, from: 2015, variants: ["EcoBoost", "GT", "Dark Horse"] },
    ],
  },
  {
    name: "Volkswagen",
    models: [
      { name: "Golf", value: 42000, from: 1990, variants: ["Life", "Style", "R-Line", "GTI", "R"] },
      { name: "Tiguan", value: 52000, from: 2008, variants: ["Life", "Elegance", "R-Line", "R"] },
      { name: "Polo", value: 32000, from: 1996, variants: ["Life", "Style", "GTI"] },
      { name: "T-Roc", value: 45000, from: 2020, variants: ["Style", "R-Line", "R"] },
      { name: "Amarok", value: 70000, from: 2011, variants: ["Core", "Life", "Style", "PanAmericana", "Aventura"] },
    ],
  },
  {
    name: "Honda",
    models: [
      { name: "CR-V", value: 48000, from: 1997, variants: ["VTi", "VTi X", "VTi L", "VTi LX", "e:HEV RS"] },
      { name: "Civic", value: 48000, from: 1990, variants: ["VTi LX", "e:HEV LX", "Type R"] },
      { name: "HR-V", value: 40000, from: 2015, variants: ["Vi X", "e:HEV L"] },
      { name: "Accord", value: 65000, from: 1990, variants: ["VTi-LX", "e:HEV RS"] },
    ],
  },
  {
    name: "Mitsubishi",
    models: [
      { name: "Outlander", value: 48000, from: 2003, variants: ["ES", "LS", "Aspire", "Exceed", "Exceed Tourer", "PHEV"] },
      { name: "Triton", value: 55000, from: 1990, variants: ["GLX", "GLX+", "GLS", "GSR"] },
      { name: "ASX", value: 32000, from: 2010, variants: ["ES", "MR", "LS", "GSR", "Exceed"] },
      { name: "Pajero Sport", value: 58000, from: 2015, variants: ["GLX", "GLS", "Exceed", "GSR"] },
    ],
  },
  {
    name: "Nissan",
    models: [
      { name: "X-Trail", value: 48000, from: 2001, variants: ["ST", "ST-L", "Ti", "Ti-L", "e-Power"] },
      { name: "Qashqai", value: 42000, from: 2014, variants: ["ST", "ST+", "ST-L", "Ti", "e-Power"] },
      { name: "Navara", value: 56000, from: 1997, variants: ["SL", "ST", "ST-X", "PRO-4X", "Warrior"] },
      { name: "Patrol", value: 95000, from: 1990, variants: ["Ti", "Ti-L", "Warrior"] },
    ],
  },
  {
    name: "Tesla",
    models: [
      { name: "Model 3", value: 62000, from: 2019, variants: ["RWD", "Long Range", "Performance"] },
      { name: "Model Y", value: 68000, from: 2022, variants: ["RWD", "Long Range", "Performance"] },
    ],
  },
  {
    name: "BMW",
    models: [
      { name: "X3", value: 90000, from: 2004, variants: ["xDrive20", "xDrive30", "M50"] },
      { name: "3 Series", value: 85000, from: 1990, variants: ["320i", "330i", "M340i"] },
      { name: "X1", value: 68000, from: 2010, variants: ["sDrive18i", "xDrive20i", "xDrive23i"] },
      { name: "1 Series", value: 60000, from: 2004, variants: ["118", "120", "M135"] },
    ],
  },
  {
    name: "Mercedes-Benz",
    models: [
      { name: "GLC", value: 105000, from: 2015, variants: ["GLC 200", "GLC 300", "GLC 43"] },
      { name: "C-Class", value: 95000, from: 1993, variants: ["C 200", "C 300", "C 43"] },
      { name: "A-Class", value: 65000, from: 2013, variants: ["A 180", "A 200", "A 250", "A 35"] },
      { name: "GLA", value: 72000, from: 2014, variants: ["GLA 200", "GLA 250", "GLA 35"] },
    ],
  },
  {
    name: "Audi",
    models: [
      { name: "Q5", value: 90000, from: 2009, variants: ["40 TDI", "45 TFSI", "SQ5"] },
      { name: "A3", value: 58000, from: 1997, variants: ["35 TFSI", "40 TFSI", "S3"] },
      { name: "Q3", value: 65000, from: 2012, variants: ["35 TFSI", "40 TFSI", "RSQ3"] },
    ],
  },
  {
    name: "Isuzu",
    models: [
      { name: "D-MAX", value: 58000, from: 2008, variants: ["SX", "LS-M", "LS-U", "X-Terrain", "Blade"] },
      { name: "MU-X", value: 62000, from: 2013, variants: ["LS-M", "LS-U", "LS-T", "X-Terrain"] },
    ],
  },
  {
    name: "MG",
    models: [
      { name: "ZS", value: 28000, from: 2018, variants: ["Excite", "Essence", "EV Excite", "EV Essence"] },
      { name: "MG4", value: 42000, from: 2023, variants: ["Excite 51", "Excite 64", "Essence 64", "XPower"] },
      { name: "HS", value: 36000, from: 2020, variants: ["Vibe", "Excite", "Essence"] },
    ],
  },
  {
    name: "BYD",
    models: [
      { name: "Atto 3", value: 48000, from: 2022, variants: ["Standard Range", "Extended Range"] },
      { name: "Seal", value: 58000, from: 2023, variants: ["Dynamic", "Premium", "Performance"] },
      { name: "Sealion 6", value: 52000, from: 2024, variants: ["Dynamic", "Premium"] },
    ],
  },
  {
    name: "Lexus",
    models: [
      { name: "NX", value: 85000, from: 2014, variants: ["NX 250", "NX 350h", "NX 450h+"] },
      { name: "RX", value: 110000, from: 1998, variants: ["RX 350", "RX 350h", "RX 500h"] },
      { name: "UX", value: 62000, from: 2019, variants: ["UX 250h", "UX 300e"] },
    ],
  },
  {
    name: "Holden",
    models: [
      { name: "Commodore", value: 38000, from: 1990, variants: sedanVariants },
      { name: "Astra", value: 26000, from: 1996, variants: ["R", "RS", "RS-V"] },
      { name: "Colorado", value: 48000, from: 2008, variants: ["LS", "LT", "LTZ", "Z71"] },
    ],
  },
];

export const MAKE_NAMES = VEHICLE_MAKES.map((m) => m.name);

export function findMake(name: string) {
  return VEHICLE_MAKES.find((m) => m.name.toLowerCase() === name.toLowerCase());
}

export function findModel(make: string, model: string) {
  return findMake(make)?.models.find((m) => m.name.toLowerCase() === model.toLowerCase());
}

/** Approximate current market value used only by the demo pricing engine. */
export function estimateVehicleValue(make: string, model: string, year: number, asOfYear: number) {
  const ref = findModel(make, model);
  const base = ref?.value ?? 35000;
  const age = Math.max(0, asOfYear - year);
  // Steeper depreciation in early years, flattening with age.
  const factor = age === 0 ? 0.94 : Math.max(0.12, 0.94 * Math.pow(0.87, age));
  return Math.round((base * factor) / 100) * 100;
}

export function yearsFor(make: string, model: string, currentYear: number) {
  const ref = findModel(make, model);
  const from = Math.max(1990, ref?.from ?? 1990);
  const to = currentYear + 1;
  const years: number[] = [];
  for (let y = to; y >= from; y--) years.push(y);
  return years;
}

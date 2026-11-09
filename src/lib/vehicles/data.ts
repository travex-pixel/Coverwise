/**
 * Australian vehicle reference data for guided entry.
 *
 * Each model carries an approximate new-vehicle retail value in AUD (used only
 * by the demonstration pricing engine), the first model year sold in
 * Australia, and indicative variant names. Lists are broad rather than
 * exhaustive: customers can always type a variant that isn't listed, or
 * choose "Other make".
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

type M = [name: string, value: number, from: number, variants: string[]];

function make(name: string, models: M[]): VehicleMake {
  return { name, models: models.map(([n, value, from, variants]) => ({ name: n, value, from, variants })) };
}

const GRADES = ["Base", "Mid", "Premium", "Sport"];

export const VEHICLE_MAKES: VehicleMake[] = [
  make("Toyota", [
    ["Corolla", 32000, 1990, ["Ascent Sport", "SX", "ZR", "Ascent Sport Hybrid", "SX Hybrid", "ZR Hybrid", "GR"]],
    ["Corolla Cross", 38000, 2022, ["GX", "GXL", "Atmos", "GX Hybrid", "GXL Hybrid", "Atmos Hybrid"]],
    ["Camry", 42000, 1990, ["Ascent", "Ascent Sport", "SX", "SL", "Ascent Hybrid", "SL Hybrid"]],
    ["RAV4", 48000, 1994, ["GX", "GXL", "XSE", "Cruiser", "Edge", "GX Hybrid", "GXL Hybrid", "Cruiser Hybrid"]],
    ["HiLux", 58000, 1990, ["Workmate", "SR", "SR5", "Rogue", "Rugged X", "GR Sport"]],
    ["Kluger", 62000, 2003, ["GX", "GXL", "Grande", "GX Hybrid", "GXL Hybrid", "Grande Hybrid"]],
    ["LandCruiser Prado", 80000, 1996, ["GX", "GXL", "VX", "Kakadu", "Altitude"]],
    ["LandCruiser 300", 110000, 2021, ["GX", "GXL", "VX", "Sahara", "Sahara ZX", "GR Sport"]],
    ["LandCruiser 70", 85000, 1990, ["Workmate", "GX", "GXL"]],
    ["Yaris", 28000, 1999, ["Ascent Sport", "SX", "ZR", "GR"]],
    ["Yaris Cross", 34000, 2020, ["GX", "GXL", "Urban", "GX Hybrid", "Urban Hybrid"]],
    ["C-HR", 44000, 2017, ["GXL", "Koba", "GR Sport"]],
    ["Fortuner", 60000, 2015, ["GX", "GXL", "Crusade"]],
    ["86", 42000, 2012, ["GT", "GTS"]],
    ["GR86", 46000, 2022, ["GT", "GTS"]],
    ["Supra", 95000, 2019, ["GT", "GTS"]],
    ["bZ4X", 68000, 2024, ["FWD", "AWD"]],
    ["Aurion", 40000, 2006, ["AT-X", "Sportivo", "Prodigy", "Presara"]],
  ]),
  make("Mazda", [
    ["CX-5", 46000, 2012, ["Maxx", "Maxx Sport", "Touring", "GT", "GT SP", "Akera"]],
    ["CX-3", 32000, 2015, ["Neo Sport", "Maxx Sport", "Evolve", "sTouring", "Akari", "Akari LE"]],
    ["CX-30", 40000, 2020, ["Pure", "Evolve", "Touring", "Astina"]],
    ["CX-60", 68000, 2023, ["Evolve", "GT", "Azami"]],
    ["CX-70", 80000, 2024, ["GT", "Azami"]],
    ["CX-80", 78000, 2024, ["Pure", "Touring", "GT", "Azami"]],
    ["CX-90", 95000, 2023, ["Touring", "GT", "Azami"]],
    ["CX-8", 50000, 2018, ["Sport", "Touring", "GT", "Asaki"]],
    ["CX-9", 60000, 2007, ["Sport", "Touring", "GT", "Azami", "Azami LE"]],
    ["Mazda2", 26000, 2002, ["Pure", "Evolve", "GT"]],
    ["Mazda3", 36000, 2004, ["Pure", "Evolve", "Touring", "GT", "Astina", "G25 Astina"]],
    ["Mazda6", 48000, 2002, ["Sport", "Touring", "GT SP", "Atenza"]],
    ["MX-5", 48000, 1990, ["Roadster", "Roadster GT", "RF", "RF GT"]],
    ["BT-50", 56000, 2006, ["XS", "XT", "XTR", "GT", "SP", "Thunder"]],
  ]),
  make("Hyundai", [
    ["i30", 33000, 2007, ["Active", "Elite", "N Line", "N Line Premium", "N", "Sedan N"]],
    ["i20", 26000, 2010, ["Active", "N"]],
    ["Tucson", 45000, 2004, ["Base", "Elite", "Highlander", "N Line", "Premium"]],
    ["Kona", 38000, 2017, ["Base", "Premium", "N Line", "N Line Premium", "Electric", "N"]],
    ["Santa Fe", 60000, 2000, ["Base", "Elite", "Highlander", "Calligraphy"]],
    ["Palisade", 70000, 2020, ["Elite", "Highlander", "Calligraphy"]],
    ["Venue", 28000, 2019, ["Base", "Active", "Elite"]],
    ["IONIQ 5", 72000, 2021, ["Dynamiq", "Techniq", "Epiq", "N"]],
    ["IONIQ 6", 74000, 2023, ["Dynamiq", "Techniq", "Epiq"]],
    ["Staria", 55000, 2021, ["Load", "Elite", "Highlander"]],
    ["Elantra", 30000, 2001, ["Active", "Elite", "SR"]],
    ["Accent", 20000, 2000, ["Active", "Sport"]],
  ]),
  make("Kia", [
    ["Sportage", 46000, 2005, ["S", "SX", "SX+", "GT-Line"]],
    ["Cerato", 30000, 2009, ["S", "Sport", "Sport+", "GT"]],
    ["K4", 34000, 2025, ["S", "Sport", "Sport+", "GT-Line"]],
    ["Seltos", 38000, 2019, ["S", "Sport", "Sport+", "GT-Line"]],
    ["Sorento", 60000, 2003, ["S", "Sport", "Sport+", "GT-Line", "PHEV GT-Line"]],
    ["Carnival", 60000, 2006, ["S", "Si", "SLi", "Platinum", "GT-Line"]],
    ["Stonic", 28000, 2021, ["S", "Sport", "GT-Line"]],
    ["Picanto", 20000, 2004, ["S", "Sport", "GT-Line", "GT"]],
    ["EV5", 60000, 2024, ["Air", "Earth", "GT-Line"]],
    ["EV6", 78000, 2022, ["Air", "GT-Line", "GT"]],
    ["EV9", 110000, 2023, ["Air", "Earth", "GT-Line"]],
    ["Tasman", 60000, 2025, ["S", "SX", "SX+", "X-Line", "X-Pro"]],
    ["Stinger", 65000, 2017, ["200S", "GT-Line", "330S", "GT"]],
  ]),
  make("Ford", [
    ["Ranger", 62000, 2011, ["XL", "XLS", "XLT", "Sport", "Wildtrak", "Wildtrak X", "Platinum", "Raptor"]],
    ["Everest", 70000, 2015, ["Ambiente", "Trend", "Sport", "Platinum", "Tremor"]],
    ["Puma", 36000, 2020, ["Base", "ST-Line", "ST-Line V"]],
    ["Escape", 40000, 2001, ["Base", "ST-Line", "Vignale", "PHEV"]],
    ["Focus", 30000, 2002, ["Trend", "ST-Line", "Titanium", "ST", "RS"]],
    ["Mustang", 70000, 2015, ["EcoBoost", "GT", "Dark Horse", "Mach 1"]],
    ["Mustang Mach-E", 80000, 2023, ["Select", "Premium", "GT"]],
    ["Territory", 45000, 2004, ["TX", "TS", "Titanium"]],
    ["Falcon", 40000, 1990, ["XT", "G6", "G6E", "XR6", "XR6 Turbo", "XR8"]],
    ["Transit Custom", 58000, 2013, ["Trend", "Sport"]],
  ]),
  make("Volkswagen", [
    ["Golf", 42000, 1990, ["Life", "Style", "R-Line", "GTI", "R"]],
    ["Polo", 32000, 1996, ["Life", "Style", "GTI"]],
    ["Tiguan", 52000, 2008, ["Life", "Elegance", "R-Line", "R"]],
    ["Tiguan Allspace", 56000, 2018, ["Life", "Elegance", "R-Line"]],
    ["T-Roc", 45000, 2020, ["Style", "R-Line", "R"]],
    ["T-Cross", 36000, 2020, ["Life", "Style", "R-Line"]],
    ["Touareg", 95000, 2003, ["170TDI", "210TDI Elegance", "210TDI R-Line", "R"]],
    ["Passat", 55000, 1990, ["Business", "Elegance", "R-Line", "Alltrack"]],
    ["Amarok", 70000, 2011, ["Core", "Life", "Style", "PanAmericana", "Aventura"]],
    ["ID.4", 65000, 2024, ["Pro"]],
    ["ID.5", 72000, 2024, ["Pro", "GTX"]],
    ["Multivan", 80000, 2022, ["Life", "Style"]],
  ]),
  make("Honda", [
    ["CR-V", 48000, 1997, ["VTi", "VTi X", "VTi L", "VTi LX", "e:HEV RS"]],
    ["Civic", 48000, 1990, ["VTi LX", "e:HEV LX", "Type R"]],
    ["HR-V", 40000, 2015, ["Vi X", "e:HEV L", "e:HEV X"]],
    ["ZR-V", 45000, 2023, ["VTi X", "VTi L", "VTi LX", "e:HEV LX"]],
    ["Accord", 65000, 1990, ["VTi-LX", "e:HEV RS"]],
    ["Jazz", 24000, 2002, ["VTi", "VTi-S", "VTi-L"]],
    ["Odyssey", 50000, 1995, ["Vi L7", "Vi LX7"]],
  ]),
  make("Mitsubishi", [
    ["Outlander", 48000, 2003, ["ES", "LS", "Aspire", "Exceed", "Exceed Tourer", "PHEV ES", "PHEV Exceed"]],
    ["Triton", 55000, 1990, ["GLX", "GLX+", "GLS", "GSR"]],
    ["ASX", 32000, 2010, ["ES", "MR", "LS", "GSR", "Exceed"]],
    ["Eclipse Cross", 38000, 2018, ["ES", "LS", "Aspire", "Exceed", "PHEV"]],
    ["Pajero Sport", 58000, 2015, ["GLX", "GLS", "Exceed", "GSR"]],
    ["Pajero", 55000, 1990, ["GLX", "GLS", "Exceed"]],
    ["Lancer", 25000, 1990, ["ES", "LS", "VR", "VRX", "Ralliart", "Evolution"]],
  ]),
  make("Nissan", [
    ["X-Trail", 48000, 2001, ["ST", "ST-L", "Ti", "Ti-L", "e-Power ST-L", "e-Power Ti", "e-Power Ti-L"]],
    ["Qashqai", 42000, 2014, ["ST", "ST+", "ST-L", "Ti", "e-Power Ti"]],
    ["Navara", 56000, 1997, ["SL", "ST", "ST-X", "PRO-4X", "Warrior"]],
    ["Patrol", 95000, 1990, ["Ti", "Ti-L", "Warrior"]],
    ["Pathfinder", 70000, 2005, ["ST", "ST-L", "Ti", "Ti-L"]],
    ["Juke", 36000, 2020, ["ST", "ST+", "ST-L", "Ti"]],
    ["Leaf", 50000, 2019, ["Standard", "e+"]],
    ["370Z", 60000, 2009, ["Coupe", "Roadster", "Nismo"]],
    ["Z", 80000, 2022, ["Coupe", "Nismo"]],
  ]),
  make("Subaru", [
    ["Forester", 45000, 1997, ["2.5i", "2.5i-L", "2.5i Premium", "2.5i Sport", "2.5i-S", "Hybrid L", "Hybrid S", "XT", "tS"]],
    ["Outback", 48000, 1996, ["AWD", "AWD Sport", "AWD Touring", "AWD Sport XT", "AWD Touring XT"]],
    ["Impreza", 33000, 1993, ["2.0L", "2.0R", "2.0S", "2.0i", "2.0i-L", "2.0i Premium", "2.0i-S"]],
    ["Crosstrek", 38000, 2023, ["2.0L", "2.0R", "2.0S", "Hybrid L", "Hybrid S"]],
    ["XV", 36000, 2012, ["2.0i", "2.0i-L", "2.0i Premium", "2.0i-S", "Hybrid L", "Hybrid S"]],
    ["Liberty", 40000, 1990, ["2.5i", "2.5i Premium", "3.6R", "GT"]],
    ["Levorg", 45000, 2016, ["1.6 GT", "1.6 GT Premium", "2.0 GT-S", "2.0 STI Sport"]],
    ["WRX", 52000, 1994, ["AWD", "RS", "tS", "STI"]],
    ["BRZ", 44000, 2012, ["Coupe", "Coupe S", "tS"]],
    ["Solterra", 70000, 2024, ["AWD", "AWD Touring"]],
  ]),
  make("Lexus", [
    ["IS", 70000, 1999, ["IS 200", "IS 250", "IS 250 F Sport", "IS 300", "IS 300 Luxury", "IS 300 F Sport", "IS 300h", "IS 300h F Sport", "IS 300h Sports Luxury", "IS 350", "IS 350 Luxury", "IS 350 F Sport", "IS 350 Sports Luxury", "IS 500 F Sport Performance", "IS F"]],
    ["ES", 75000, 2002, ["ES 300h Luxury", "ES 300h F Sport", "ES 300h Sports Luxury", "ES 350"]],
    ["GS", 95000, 1993, ["GS 300", "GS 350", "GS 350 F Sport", "GS 450h", "GS F"]],
    ["LS", 200000, 1990, ["LS 500", "LS 500 F Sport", "LS 500h"]],
    ["RC", 85000, 2014, ["RC 300", "RC 350 F Sport", "RC 350 Luxury", "RC F"]],
    ["LC", 220000, 2017, ["LC 500", "LC 500h", "LC 500 Convertible"]],
    ["CT", 50000, 2011, ["CT 200h Luxury", "CT 200h F Sport", "CT 200h Sports Luxury"]],
    ["UX", 62000, 2019, ["UX 200", "UX 250h", "UX 250h F Sport", "UX 300e", "UX 300h"]],
    ["NX", 85000, 2014, ["NX 250", "NX 300", "NX 350", "NX 350h", "NX 350h F Sport", "NX 450h+"]],
    ["RX", 110000, 1998, ["RX 350", "RX 350h", "RX 350 F Sport", "RX 450h", "RX 500h F Sport Performance"]],
    ["GX", 130000, 2024, ["GX 550 Luxury", "GX 550 Overtrail", "GX 550 Sports Luxury"]],
    ["LX", 180000, 2008, ["LX 500d", "LX 600", "LX 600 F Sport", "LX 570"]],
    ["LBX", 55000, 2024, ["Luxury", "Sports Luxury"]],
  ]),
  make("BMW", [
    ["1 Series", 60000, 2004, ["118i", "120i", "128ti", "M135i", "M135"]],
    ["2 Series", 70000, 2014, ["218i Gran Coupe", "220i Coupe", "M235i", "M240i"]],
    ["3 Series", 85000, 1990, ["318i", "320i", "320d", "330i", "330e", "M340i", "M3"]],
    ["4 Series", 95000, 2013, ["420i", "430i", "M440i", "M4"]],
    ["5 Series", 120000, 1990, ["520i", "530i", "530e", "540i", "M550i", "M5"]],
    ["i4", 100000, 2022, ["eDrive35", "eDrive40", "M50"]],
    ["iX", 150000, 2021, ["xDrive40", "xDrive50", "M60"]],
    ["iX1", 80000, 2023, ["eDrive20", "xDrive30"]],
    ["iX3", 110000, 2021, ["M Sport"]],
    ["X1", 68000, 2010, ["sDrive18i", "sDrive18d", "xDrive20i", "xDrive23i", "xDrive25i", "M35i"]],
    ["X2", 75000, 2018, ["sDrive18i", "sDrive20i", "M35i"]],
    ["X3", 90000, 2004, ["xDrive20i", "xDrive20d", "xDrive30i", "xDrive30d", "M40i", "M50"]],
    ["X4", 100000, 2014, ["xDrive20i", "xDrive30i", "M40i"]],
    ["X5", 140000, 2000, ["xDrive30d", "xDrive40i", "xDrive50e", "M60i", "M"]],
    ["X6", 160000, 2008, ["xDrive30d", "xDrive40i", "M60i"]],
    ["X7", 180000, 2019, ["xDrive40i", "xDrive40d", "M60i"]],
    ["Z4", 110000, 2003, ["sDrive20i", "sDrive30i", "M40i"]],
  ]),
  make("Mercedes-Benz", [
    ["A-Class", 65000, 2013, ["A 180", "A 200", "A 250", "A 250 e", "A 35 AMG", "A 45 S AMG"]],
    ["B-Class", 60000, 2006, ["B 180", "B 200"]],
    ["CLA", 75000, 2013, ["CLA 200", "CLA 250", "CLA 35 AMG", "CLA 45 S AMG"]],
    ["C-Class", 95000, 1993, ["C 200", "C 220 d", "C 300", "C 43 AMG", "C 63 S AMG"]],
    ["E-Class", 140000, 1993, ["E 200", "E 300", "E 350", "E 450", "E 53 AMG", "E 63 S AMG"]],
    ["S-Class", 250000, 1991, ["S 450", "S 580", "S 63 AMG"]],
    ["GLA", 72000, 2014, ["GLA 200", "GLA 250", "GLA 35 AMG", "GLA 45 S AMG"]],
    ["GLB", 80000, 2020, ["GLB 200", "GLB 250", "GLB 35 AMG"]],
    ["GLC", 105000, 2015, ["GLC 200", "GLC 220 d", "GLC 250", "GLC 300", "GLC 43 AMG", "GLC 63 S AMG"]],
    ["GLE", 150000, 2015, ["GLE 300 d", "GLE 350", "GLE 400 d", "GLE 450", "GLE 53 AMG", "GLE 63 S AMG"]],
    ["GLS", 190000, 2016, ["GLS 400 d", "GLS 450", "GLS 580", "GLS 63 AMG"]],
    ["G-Class", 280000, 1990, ["G 400 d", "G 450 d", "G 500", "G 63 AMG"]],
    ["EQA", 85000, 2021, ["EQA 250", "EQA 250+", "EQA 350"]],
    ["EQB", 95000, 2022, ["EQB 250", "EQB 300", "EQB 350"]],
    ["EQC", 130000, 2019, ["EQC 400"]],
    ["EQE", 150000, 2023, ["EQE 300", "EQE 350", "EQE 53 AMG"]],
    ["V-Class", 110000, 2015, ["V 220 d", "V 250 d", "V 300 d"]],
  ]),
  make("Audi", [
    ["A1", 45000, 2011, ["30 TFSI", "35 TFSI", "40 TFSI S line"]],
    ["A3", 58000, 1997, ["35 TFSI", "40 TFSI", "S3", "RS 3"]],
    ["A4", 75000, 1995, ["35 TFSI", "40 TFSI", "45 TFSI", "S4", "RS 4 Avant"]],
    ["A5", 85000, 2007, ["40 TFSI", "45 TFSI", "S5", "RS 5"]],
    ["A6", 110000, 1997, ["45 TFSI", "55 TFSI", "S6", "RS 6 Avant"]],
    ["Q2", 52000, 2017, ["35 TFSI", "40 TFSI", "SQ2"]],
    ["Q3", 65000, 2012, ["35 TFSI", "40 TFSI", "45 TFSI", "RS Q3"]],
    ["Q5", 90000, 2009, ["35 TDI", "40 TDI", "45 TFSI", "SQ5"]],
    ["Q7", 130000, 2006, ["45 TDI", "50 TDI", "55 TFSI", "SQ7"]],
    ["Q8", 150000, 2019, ["50 TDI", "55 TFSI", "SQ8", "RS Q8"]],
    ["Q4 e-tron", 90000, 2024, ["45", "55 quattro"]],
    ["Q8 e-tron", 160000, 2023, ["50", "55", "SQ8"]],
    ["e-tron GT", 190000, 2021, ["quattro", "RS"]],
    ["TT", 90000, 1999, ["45 TFSI", "TTS", "TT RS"]],
  ]),
  make("Tesla", [
    ["Model 3", 62000, 2019, ["RWD", "Long Range", "Performance"]],
    ["Model Y", 68000, 2022, ["RWD", "Long Range", "Performance"]],
    ["Model S", 150000, 2014, ["Long Range", "Plaid"]],
    ["Model X", 170000, 2016, ["Long Range", "Plaid"]],
  ]),
  make("Isuzu", [
    ["D-MAX", 58000, 2008, ["SX", "LS-M", "LS-U", "LS-U+", "X-Terrain", "X-Rider", "Blade"]],
    ["MU-X", 62000, 2013, ["LS-M", "LS-U", "LS-T", "X-Terrain"]],
  ]),
  make("MG", [
    ["MG3", 24000, 2016, ["Core", "Excite", "Essence", "Hybrid+ Excite", "Hybrid+ Essence"]],
    ["ZS", 28000, 2018, ["Excite", "Essence", "Vibe", "EV Excite", "EV Essence", "Hybrid+ Essence"]],
    ["MG4", 42000, 2023, ["Excite 51", "Excite 64", "Essence 64", "Essence 77", "XPower"]],
    ["HS", 36000, 2020, ["Vibe", "Excite", "Essence", "PHEV Excite", "PHEV Essence"]],
    ["MG5", 28000, 2023, ["Vibe", "Essence"]],
    ["Cyberster", 115000, 2025, ["Trophy"]],
  ]),
  make("BYD", [
    ["Atto 3", 48000, 2022, ["Standard Range", "Extended Range", "Essential", "Premium"]],
    ["Dolphin", 38000, 2023, ["Dynamic", "Premium", "Essential"]],
    ["Seal", 58000, 2023, ["Dynamic", "Premium", "Performance"]],
    ["Sealion 6", 52000, 2024, ["Dynamic", "Premium"]],
    ["Sealion 7", 60000, 2025, ["Premium", "Performance"]],
    ["Shark 6", 60000, 2025, ["Premium"]],
  ]),
  make("GWM", [
    ["Haval Jolion", 30000, 2021, ["Premium", "Lux", "Ultra", "Hybrid Lux", "Hybrid Ultra"]],
    ["Haval H6", 38000, 2021, ["Premium", "Lux", "Ultra", "Hybrid Lux", "Hybrid Ultra", "GT Ultra"]],
    ["Cannon", 42000, 2021, ["Lux", "Ultra", "Vanta", "Alpha Ultra"]],
    ["Tank 300", 50000, 2023, ["Lux", "Ultra", "Hybrid Ultra"]],
    ["Tank 500", 70000, 2024, ["Lux Hybrid", "Ultra Hybrid"]],
    ["Ora", 40000, 2023, ["Standard Range", "Extended Range", "Ultra", "GT"]],
  ]),
  make("LDV", [
    ["T60", 42000, 2017, ["Pro", "Max Luxe", "Max Plus", "Max Pro"]],
    ["D90", 50000, 2017, ["Mode", "Executive"]],
    ["eT60", 90000, 2023, ["Base"]],
    ["Deliver 9", 55000, 2020, ["Van", "Cab Chassis"]],
    ["G10", 36000, 2015, ["Van", "People Mover"]],
  ]),
  make("Chery", [
    ["Omoda 5", 32000, 2023, ["BX", "EX"]],
    ["Tiggo 4 Pro", 25000, 2024, ["Urban", "Ultimate"]],
    ["Tiggo 7 Pro", 40000, 2023, ["Urban", "Elite", "Ultimate"]],
    ["Tiggo 8 Pro Max", 48000, 2024, ["Elite", "Ultimate"]],
  ]),
  make("Suzuki", [
    ["Swift", 26000, 2005, ["GL", "GL Navigator", "GLX Turbo", "Sport", "Hybrid"]],
    ["Vitara", 34000, 2015, ["GL+", "Turbo", "Turbo Allgrip"]],
    ["S-Cross", 38000, 2014, ["Base", "Plus", "Allgrip Prestige"]],
    ["Jimny", 32000, 1998, ["Lite", "GLX", "XL"]],
    ["Ignis", 24000, 2016, ["GL", "GLX"]],
    ["Baleno", 22000, 2016, ["GL", "GLX"]],
  ]),
  make("Volvo", [
    ["XC40", 60000, 2018, ["Plus B4", "Ultimate B4", "Ultimate B5", "Recharge Pure Electric", "Recharge Twin"]],
    ["XC60", 85000, 2008, ["Plus B5", "Ultimate B5", "Ultimate B6", "Recharge Plug-in Hybrid"]],
    ["XC90", 115000, 2003, ["Plus B5", "Ultimate B6", "Recharge Plug-in Hybrid"]],
    ["EX30", 65000, 2024, ["Single Motor Extended Range Plus", "Single Motor Extended Range Ultra", "Twin Motor Performance Ultra"]],
    ["EX90", 130000, 2025, ["Twin Motor Plus", "Twin Motor Performance Ultra"]],
    ["C40", 80000, 2022, ["Recharge Pure Electric", "Recharge Twin"]],
    ["S60", 65000, 2001, ["Plus B5", "Ultimate B5", "Recharge Plug-in Hybrid"]],
    ["V60", 70000, 2011, ["Cross Country Plus B5", "Cross Country Ultimate B5"]],
  ]),
  make("Land Rover", [
    ["Defender", 120000, 1990, ["90 S", "90 SE", "110 S", "110 SE", "110 HSE", "110 X", "130 SE", "V8"]],
    ["Discovery", 120000, 1991, ["S", "SE", "HSE", "Dynamic SE", "Dynamic HSE"]],
    ["Discovery Sport", 80000, 2015, ["S", "SE", "HSE", "Dynamic SE", "Dynamic HSE"]],
    ["Range Rover Evoque", 85000, 2011, ["S", "SE", "HSE", "Dynamic SE", "Dynamic HSE", "Autobiography"]],
    ["Range Rover Velar", 110000, 2017, ["S", "SE", "HSE", "Dynamic SE", "Dynamic HSE", "Autobiography"]],
    ["Range Rover Sport", 170000, 2005, ["S", "SE", "HSE", "Dynamic SE", "Dynamic HSE", "Autobiography", "SV"]],
    ["Range Rover", 260000, 1990, ["SE", "HSE", "Autobiography", "SV"]],
  ]),
  make("Jeep", [
    ["Grand Cherokee", 85000, 1996, ["Laredo", "Limited", "Overland", "Summit", "Summit Reserve", "Trailhawk", "SRT"]],
    ["Wrangler", 85000, 1996, ["Sport", "Sport S", "Overland", "Rubicon", "Rubicon Unlimited"]],
    ["Compass", 45000, 2007, ["Launch Edition", "Night Eagle", "Limited", "S-Limited", "Trailhawk"]],
    ["Gladiator", 85000, 2020, ["Night Eagle", "Overland", "Rubicon"]],
    ["Avenger", 50000, 2024, ["Longitude", "Limited", "Summit"]],
    ["Cherokee", 50000, 1994, ["Sport", "Longitude", "Limited", "Trailhawk"]],
  ]),
  make("Porsche", [
    ["Macan", 110000, 2014, ["Base", "T", "S", "GTS", "Turbo", "4 Electric", "4S Electric", "Turbo Electric"]],
    ["Cayenne", 160000, 2003, ["Base", "E-Hybrid", "S", "GTS", "Turbo", "Turbo GT", "Coupe"]],
    ["911", 300000, 1990, ["Carrera", "Carrera S", "Carrera 4S", "Carrera GTS", "Targa 4", "Turbo", "Turbo S", "GT3", "GT3 RS"]],
    ["Taycan", 200000, 2020, ["Base", "4S", "GTS", "Turbo", "Turbo S", "Cross Turismo"]],
    ["718", 150000, 2016, ["Cayman", "Cayman S", "Cayman GTS 4.0", "Boxster", "Boxster S", "Boxster GTS 4.0", "Cayman GT4"]],
    ["Panamera", 250000, 2010, ["Base", "4", "4S", "GTS", "Turbo S", "E-Hybrid"]],
  ]),
  make("MINI", [
    ["Cooper", 45000, 2002, ["Cooper", "Cooper S", "Cooper C", "Cooper SE", "John Cooper Works", "5 Door"]],
    ["Countryman", 60000, 2011, ["Cooper", "Cooper S", "Cooper SE ALL4", "John Cooper Works"]],
    ["Aceman", 55000, 2025, ["E", "SE", "John Cooper Works"]],
    ["Clubman", 50000, 2008, ["Cooper", "Cooper S", "John Cooper Works"]],
    ["Convertible", 55000, 2004, ["Cooper", "Cooper S", "John Cooper Works"]],
  ]),
  make("Skoda", [
    ["Octavia", 48000, 2007, ["Style", "Sportline", "RS"]],
    ["Superb", 65000, 2009, ["Style", "Sportline", "Scout"]],
    ["Kamiq", 38000, 2020, ["Select", "Signature", "Monte Carlo"]],
    ["Karoq", 45000, 2018, ["Select", "Style", "Sportline"]],
    ["Kodiaq", 60000, 2017, ["Style", "Sportline", "RS"]],
    ["Scala", 36000, 2020, ["Select", "Signature", "Monte Carlo"]],
    ["Fabia", 36000, 2008, ["Select", "Monte Carlo"]],
    ["Enyaq", 75000, 2025, ["Sportline", "RS"]],
  ]),
  make("Renault", [
    ["Koleos", 45000, 2008, ["Life", "Zen", "Intens", "Esprit Alpine"]],
    ["Arkana", 42000, 2021, ["Zen", "Intens", "R.S. Line", "Esprit Alpine"]],
    ["Captur", 38000, 2015, ["Zen", "Intens", "R.S. Line"]],
    ["Megane", 40000, 2001, ["Zen", "Intens", "GT", "R.S.", "E-Tech"]],
    ["Clio", 30000, 2001, ["Life", "Zen", "Intens", "R.S."]],
    ["Trafic", 50000, 2004, ["Pro", "Premium", "Lifestyle"]],
    ["Kangoo", 42000, 2005, ["Compact", "Maxi", "E-Tech"]],
  ]),
  make("Peugeot", [
    ["208", 40000, 2012, ["Allure", "GT", "e-208 GT"]],
    ["2008", 45000, 2013, ["Allure", "GT", "GT Sport", "e-2008 GT"]],
    ["308", 50000, 2008, ["Allure", "GT", "GT Premium", "GT Sport Plug-in Hybrid"]],
    ["3008", 60000, 2010, ["Allure", "GT", "GT Premium", "GT Sport Plug-in Hybrid"]],
    ["408", 65000, 2024, ["GT", "GT Plug-in Hybrid"]],
    ["5008", 65000, 2013, ["Allure", "GT", "GT Premium"]],
    ["Partner", 40000, 2009, ["Pro", "Premium", "e-Partner"]],
    ["Expert", 55000, 2018, ["Pro", "Premium"]],
  ]),
  make("Polestar", [
    ["Polestar 2", 72000, 2022, ["Standard Range Single Motor", "Long Range Single Motor", "Long Range Dual Motor", "Long Range Dual Motor Performance"]],
    ["Polestar 3", 130000, 2024, ["Long Range Dual Motor", "Long Range Dual Motor Performance"]],
    ["Polestar 4", 85000, 2024, ["Long Range Single Motor", "Long Range Dual Motor"]],
  ]),
  make("Genesis", [
    ["G70", 75000, 2019, ["2.0T", "2.0T Sport", "3.3T Sport", "2.5T", "3.3T"]],
    ["G80", 100000, 2020, ["2.5T", "3.5T Sport", "Electrified"]],
    ["GV60", 110000, 2022, ["Standard", "Performance"]],
    ["GV70", 90000, 2021, ["2.5T", "3.5T Sport", "Electrified"]],
    ["GV80", 120000, 2021, ["2.5T", "3.0D", "3.5T", "Coupe"]],
  ]),
  make("Cupra", [
    ["Formentor", 55000, 2022, ["V", "VZ", "VZe", "VZx"]],
    ["Leon", 48000, 2022, ["V", "VZ", "VZe", "VZx"]],
    ["Ateca", 58000, 2022, ["VZ", "VZx"]],
    ["Born", 60000, 2023, ["Base", "VZ"]],
    ["Tavascan", 75000, 2025, ["Endurance", "VZ"]],
  ]),
  make("Alfa Romeo", [
    ["Giulia", 75000, 2017, ["Base", "Sport", "Veloce", "Ti", "Quadrifoglio"]],
    ["Stelvio", 85000, 2018, ["Base", "Sport", "Veloce", "Ti", "Quadrifoglio"]],
    ["Tonale", 55000, 2023, ["Ti", "Veloce", "Plug-in Hybrid Veloce"]],
    ["Junior", 50000, 2025, ["Ibrida", "Elettrica", "Veloce"]],
  ]),
  make("Jaguar", [
    ["F-Pace", 100000, 2016, ["R-Dynamic S", "R-Dynamic SE", "R-Dynamic HSE", "SVR"]],
    ["E-Pace", 70000, 2018, ["R-Dynamic S", "R-Dynamic SE", "R-Dynamic HSE"]],
    ["I-Pace", 150000, 2019, ["S", "SE", "HSE"]],
    ["XE", 70000, 2015, ["R-Dynamic S", "R-Dynamic SE", "R-Dynamic HSE"]],
    ["XF", 85000, 2008, ["R-Dynamic SE", "R-Dynamic HSE"]],
    ["F-Type", 150000, 2013, ["P300", "P450 R-Dynamic", "R 75"]],
  ]),
  make("Ram", [
    ["1500", 120000, 2018, ["Express", "Big Horn", "Laramie", "Laramie Sport", "Limited", "TRX"]],
    ["2500", 160000, 2018, ["Laramie", "Limited"]],
  ]),
  make("Chevrolet", [
    ["Silverado 1500", 130000, 2018, ["LTZ Premium", "ZR2"]],
    ["Silverado HD", 160000, 2020, ["LTZ Premium"]],
    ["Corvette", 180000, 2021, ["Stingray", "Z06", "E-Ray"]],
    ["Camaro", 90000, 2018, ["2SS", "ZL1"]],
  ]),
  make("Holden", [
    ["Commodore", 38000, 1990, ["Evoke", "SV6", "SS", "SS V", "Calais", "Calais V", "LT", "RS", "RS-V", "VXR"]],
    ["Astra", 26000, 1996, ["R", "RS", "RS-V", "LS", "LT", "LTZ"]],
    ["Cruze", 24000, 2009, ["CD", "CDX", "Equipe", "SRi", "SRi-V"]],
    ["Colorado", 48000, 2008, ["LS", "LT", "LTZ", "Z71", "Storm"]],
    ["Trailblazer", 50000, 2016, ["LT", "LTZ", "Z71"]],
    ["Captiva", 35000, 2006, ["5 LS", "7 LS", "7 LT", "7 LTZ"]],
    ["Equinox", 40000, 2017, ["LS", "LS+", "LT", "LTZ", "LTZ-V"]],
    ["Acadia", 50000, 2018, ["LT", "LTZ", "LTZ-V"]],
    ["Barina", 18000, 1994, ["CD", "CDX", "RS"]],
    ["Trax", 28000, 2013, ["LS", "LT", "LTZ"]],
  ]),
  make("KGM SsangYong", [
    ["Musso", 45000, 2018, ["ELX", "Ultimate", "Adventure", "Ultimate Luxury"]],
    ["Rexton", 55000, 2018, ["ELX", "Ultimate", "Ultimate Sport Pack"]],
    ["Korando", 35000, 2019, ["EX", "ELX", "Ultimate"]],
    ["Torres", 45000, 2024, ["ELX", "Ultimate", "Adventure"]],
  ]),
  make("Fiat", [
    ["500", 28000, 2008, ["Pop", "Lounge", "Dolcevita", "Abarth 595", "Abarth 695", "500e La Prima"]],
    ["Ducato", 60000, 2007, ["Van", "Cab Chassis"]],
  ]),
  make("Citroen", [
    ["C3", 32000, 2002, ["Shine", "Aircross Shine"]],
    ["C4", 45000, 2005, ["Shine", "e-C4 Shine"]],
    ["C5 Aircross", 55000, 2019, ["Shine", "Shine Plug-in Hybrid"]],
    ["Berlingo", 40000, 2009, ["Van", "e-Berlingo"]],
  ]),
  make("Mahindra", [
    ["XUV700", 42000, 2023, ["AX7", "AX7L"]],
    ["Scorpio", 45000, 2023, ["Z8", "Z8L"]],
    ["XUV 3XO", 25000, 2025, ["AX5L", "AX7L"]],
    ["Pik-Up", 40000, 2007, ["S10", "S11"]],
  ]),
  make("Smart", [
    ["#1", 60000, 2024, ["Pro+", "Premium", "Brabus"]],
    ["#3", 65000, 2024, ["Pro+", "Premium", "Brabus"]],
  ]),
  make("Zeekr", [
    ["X", 60000, 2024, ["RWD", "AWD"]],
    ["009", 140000, 2025, ["Grand"]],
  ]),
  make("XPeng", [
    ["G6", 58000, 2024, ["Standard Range", "Long Range"]],
  ]),
  make("Leapmotor", [
    ["C10", 48000, 2024, ["Style", "Design", "REEV Style", "REEV Design"]],
  ]),
  make("Deepal", [
    ["S07", 55000, 2024, ["Base"]],
  ]),
  make("Maserati", [
    ["Grecale", 130000, 2023, ["GT", "Modena", "Trofeo", "Folgore"]],
    ["Levante", 180000, 2017, ["GT", "Modena", "Trofeo"]],
    ["Ghibli", 160000, 2014, ["GT", "Modena", "Trofeo"]],
    ["GranTurismo", 400000, 2008, ["Modena", "Trofeo", "Folgore"]],
  ]),
  make("Bentley", [
    ["Bentayga", 400000, 2016, ["V8", "S", "Azure", "Speed", "EWB"]],
    ["Continental GT", 450000, 2004, ["V8", "Speed", "Azure"]],
    ["Flying Spur", 450000, 2006, ["V8", "Speed", "Azure"]],
  ]),
];

export const MAKE_NAMES = VEHICLE_MAKES.map((m) => m.name).sort((a, b) => a.localeCompare(b));

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
  const factor = age === 0 ? 0.94 : Math.max(0.12, 0.94 * Math.pow(0.88, age));
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

export const DEFAULT_VARIANTS = GRADES;

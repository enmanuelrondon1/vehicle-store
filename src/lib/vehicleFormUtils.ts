// src/lib/vehicleFormUtils.ts
import { Vehicle, VehicleDataBackend } from "@/types/types";

export function parsePhoneNumber(phone: string | undefined) {
  if (!phone) return { phoneCode: "+58 412", phoneNumber: "" };
  
  const cleanPhone = phone.replace(/\s+/g, " ").trim();
  // console.log('📞 Teléfono original:', cleanPhone);
  
  // Caso 1: Formato internacional "+58 424 1234567"
  if (cleanPhone.startsWith("+58")) {
    const parts = cleanPhone.split(" ");
    if (parts.length === 3) {
      const phoneCode = `${parts[0]} ${parts[1]}`; // "+58 424"
      const phoneNumber = parts[2]; // "1234567"
      // console.log('✅ Formato internacional detectado:', { phoneCode, phoneNumber });
      return { phoneCode, phoneNumber };
    }
  }
  
  // Caso 2: Formato local "0424 1234567" o "04241234567"
  if (cleanPhone.startsWith("0")) {
    const withoutZero = cleanPhone.substring(1);
    const digitsOnly = withoutZero.replace(/\s/g, "");
    
    if (digitsOnly.length >= 10) {
      const areaCode = digitsOnly.substring(0, 3); // "424"
      const phoneNumber = digitsOnly.substring(3); // "1234567"
      const phoneCode = `+58 ${areaCode}`; // "+58 424"
      console.log('✅ Formato local detectado:', { phoneCode, phoneNumber });
      return { phoneCode, phoneNumber };
    }
  }
  
  // Caso 3: Fallback - intentar extraer los últimos 7 dígitos
  const digitsOnly = cleanPhone.replace(/\D/g, "");
  if (digitsOnly.length >= 7) {
    const phoneNumber = digitsOnly.slice(-7);
    const phoneCode = "+58 412"; // Default
    console.log('⚠️ Formato desconocido, usando fallback:', { phoneCode, phoneNumber });
    return { phoneCode, phoneNumber };
  }
  
  console.log('❌ No se pudo parsear el teléfono');
  return { phoneCode: "+58 412", phoneNumber: "" };
}

export function initializeFormData(vehicle: Vehicle): Partial<VehicleDataBackend> {
  // console.log('🚀 ========== INICIALIZANDO FORM DATA ==========');
  // console.log('📦 Vehicle prop recibido:', vehicle);
  
  const { phoneCode, phoneNumber } = parsePhoneNumber(vehicle.sellerContact?.phone);
  
  // Limpiar sellerContact - remover userId y otros campos que no están en el schema
  const cleanSellerContact = {
    name: vehicle.sellerContact?.name,
    email: vehicle.sellerContact?.email,
    phoneCode,
    phoneNumber,
  };

  const initialData = {
    ...vehicle,
    // Asegurar que campos opcionales null no rompan la validación
    subcategory: vehicle.subcategory || undefined,
    brandOther: (vehicle as any).brandOther || undefined,
    modelOther: (vehicle as any).modelOther || undefined,
    version: vehicle.version || undefined,
    engine: vehicle.engine || undefined,
    displacement: vehicle.displacement || undefined,
    loadCapacity: (vehicle as any).loadCapacity || undefined,
    vin: (vehicle as any).vin || undefined,
    videoUrl: (vehicle as any).videoUrl || undefined,
    armorLevel: (vehicle as any).armorLevel || undefined,
    tiresCondition: (vehicle as any).tiresCondition || undefined,
    referenceNumber: (vehicle as any).referenceNumber || undefined,
    paymentProof: (vehicle as any).paymentProof || undefined,
    sellerContact: cleanSellerContact,
  } as any;
  
  // console.log('✅ DATOS INICIALES DEL FORM DATA:', initialData);
  // console.log('🔍 ========== FIN INICIALIZACIÓN ==========');
  
  return initialData;
}
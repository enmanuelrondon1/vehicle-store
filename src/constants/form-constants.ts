export interface Bank {
  name: string
  url: string
}

export const banks: Bank[] = [
  { name: "Banesco", url: "https://www.banesco.com" },
  { name: "Banco de Venezuela", url: "https://www.bancodevenezuela.com" },
  { name: "Banco Mercantil", url: "https://www.mercantilbanco.com" },
  { name: "Banco Provincial", url: "https://www.provincial.com" },
  { name: "Bancaribe", url: "https://www.bancaribe.com.ve" },
  { name: "Banco Exterior", url: "https://www.bancoexterior.com" },
  {
    name: "Banco Occidental de Descuento (BOD)",
    url: "https://www.bod.com.ve",
  },
  { name: "Banco del Tesoro", url: "https://www.bt.gob.ve" },
  { name: "BFC Banco Fondo Común", url: "https://www.bfc.com.ve" },
  { name: "Bancamiga", url: "https://www.bancamiga.com" },
]

export const phoneCodes = ["0412", "0424", "0414", "0426", "0416"]

export const formSteps = [
  { label: "Información Básica", icon: "🚗" },
  { label: "Precio y Condición", icon: "💰" },
  { label: "Especificaciones", icon: "⚙️" },
  { label: "Contacto", icon: "👤" },
  { label: "Características", icon: "⭐" },
  { label: "Confirmación de Pago", icon: "💳" },
]

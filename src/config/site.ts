//src/config/site.ts
export const siteConfig = {
  name: "1AutoMarket",
  description:
    "Tu mercado de confianza para encontrar y vender vehículos de calidad.",
  paths: {
    home: "/",
    catalog: "/catalog",
    contact: "/contact",
    privacy: "/privacy",
    terms: "/terms",
    faq: "/faq",
    features: "/#features",
    testimonials: "/#testimonials",
    vehicleList: "/vehicleList",
    publishAd: "/publicar-anuncio",
    adminPanel: "/adminPanel",
    uploadPaymentProof: "/upload-payment-proof",
    profile: "/profile",
    myFavorites: "/my-favorites",
    compare: "/compare",
    vehicleDetail: (id: string) => `/vehicle/${id}`,
    login: "/login",
  },
  links: {
    twitter: "https://twitter.com/automarket",
    github: "https://github.com",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },
};
// // tailwind.config.ts
// import type { Config } from "tailwindcss";

// const config: Config = {
//   darkMode: "class",
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         border: "hsl(var(--border))",
//         input: "hsl(var(--input))",
//         ring: "hsl(var(--ring))",
//         background: "hsl(var(--background))",
//         foreground: "hsl(var(--foreground))",
//         primary: {
//           DEFAULT: "hsl(var(--primary))",
//           foreground: "hsl(var(--primary-foreground))",
//         },
//         secondary: {
//           DEFAULT: "hsl(var(--secondary))",
//           foreground: "hsl(var(--secondary-foreground))",
//         },
//         destructive: {
//           DEFAULT: "hsl(var(--destructive))",
//           foreground: "hsl(var(--destructive-foreground))",
//         },
//         muted: {
//           DEFAULT: "hsl(var(--muted))",
//           foreground: "hsl(var(--muted-foreground))",
//         },
//         accent: {
//           DEFAULT: "hsl(var(--accent))",
//           foreground: "hsl(var(--accent-foreground))",
//         },
//         popover: {
//           DEFAULT: "hsl(var(--popover))",
//           foreground: "hsl(var(--popover-foreground))",
//         },
//         card: {
//           DEFAULT: "hsl(var(--card))",
//           foreground: "hsl(var(--card-foreground))",
//         },
//         success: {
//           DEFAULT: "hsl(var(--success))",
//           foreground: "hsl(var(--success-foreground))",
//         },
//         warning: {
//           DEFAULT: "hsl(var(--warning))",
//           foreground: "hsl(var(--warning-foreground))",
//         },
//         premium: {
//           DEFAULT: "hsl(var(--premium))",
//           foreground: "hsl(var(--premium-foreground))",
//         },
//         // --- Nueva paleta de colores ---
//         // Azules para la marca (ej. un azul principal y sus variantes)
//         "brand-primary": {
//           50: "hsl(180 80% 98%)", // cian-50
//           100: "hsl(180 80% 96%)", // cian-100
//           200: "hsl(180 80% 90%)", // cian-200
//           300: "hsl(180 80% 80%)", // cian-300
//           400: "hsl(180 80% 65%)", // cian-400
//           500: "hsl(180 80% 50%)", // cian-500 (cian principal)
//           600: "hsl(180 80% 40%)", // cian-600
//           700: "hsl(180 80% 30%)", // cian-700
//           800: "hsl(180 80% 20%)", // cian-800
//           900: "hsl(180 80% 10%)", // cian-900
//           950: "hsl(180 80% 5%)",  // cian-950
//         },
//         // Grises neutros para texto, fondos secundarios, etc.
//         neutral: {
//           50: "hsl(210 20% 98%)", // gray-50
//           100: "hsl(210 20% 96%)", // gray-100
//           200: "hsl(210 20% 90%)", // gray-200
//           300: "hsl(210 20% 80%)", // gray-300
//           400: "hsl(210 20% 65%)", // gray-400
//           500: "hsl(210 20% 50%)", // gray-500
//           600: "hsl(210 20% 40%)", // gray-600
//           700: "hsl(210 20% 30%)", // gray-700
//           800: "hsl(210 20% 20%)", // gray-800
//           900: "hsl(210 20% 10%)", // gray-900
//           950: "hsl(210 20% 5%)",  // gray-950
//         },
//         // --- Fin de la nueva paleta de colores ---
//       },
//       borderRadius: {
//         "extra-large": "2rem",
//       },
//       spacing: {
//         128: "32rem",
//       },
//       // Animaciones personalizadas (se mantienen si no usan colores eliminados)
//       animation: {
//         "gradient-x": "gradient-x 3s ease infinite",
//         "gradient-y": "gradient-y 3s ease infinite",
//         "gradient-xy": "gradient-xy 3s ease infinite",
//         "float": "float 3s ease-in-out infinite",
//         "pulse-glow": "pulse-glow 2s ease-in-out infinite",
//         "spin-slow": "spin 3s linear infinite",
//         "bounce-slow": "bounce 3s infinite",
//       },
//       keyframes: {
//         "gradient-x": {
//           "0%, 100%": {
//             "background-size": "200% 200%",
//             "background-position": "left center",
//           },
//           "50%": {
//             "background-size": "200% 200%",
//             "background-position": "right center",
//           },
//         },
//         "gradient-y": {
//           "0%, 100%": {
//             "background-size": "200% 200%",
//             "background-position": "center top",
//           },
//           "50%": {
//             "background-size": "200% 200%",
//             "background-position": "center bottom",
//           },
//         },
//         "gradient-xy": {
//           "0%, 100%": {
//             "background-size": "400% 400%",
//             "background-position": "left center",
//           },
//           "50%": {
//             "background-size": "200% 200%",
//             "background-position": "right center",
//           },
//         },
//         float: {
//           "0%, 100%": { transform: "translateY(0px)" },
//           "50%": { transform: "translateY(-20px)" },
//         },
//         "pulse-glow": {
//           "0%, 100%": {
//             opacity: "1",
//             boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
//           },
//           "50%": {
//             opacity: "0.8",
//             boxShadow: "0 0 40px rgba(59, 130, 246, 0.8)",
//           },
//         },
//       },
//       // Fondos con gradientes (se eliminan los que usaban colores vibrantes)
//       backgroundImage: {
//         "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
//         "gradient-conic":
//           "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
//       },
//     },
//   },
//   plugins: [],
// };

// export default config;
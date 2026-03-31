// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {

  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // ✅ IMÁGENES — FIX CRÍTICO
  // ❌ ELIMINADO: unoptimized: true  (desactivaba toda optimización)
  // ❌ ELIMINADO: domains (deprecado)
  images: {
    formats: ["image/avif", "image/webp"],
  remotePatterns: [
  {
    protocol: "https",
    hostname: "res.cloudinary.com",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "*.cloudinary.com",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "lh3.googleusercontent.com",
    pathname: "/**",
  },
],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-accordion",
      "@radix-ui/react-popover",
      "@radix-ui/react-tooltip",
      "recharts",
    ],
  },

async headers() {
  return [
    // ✅ CORS — solo tu dominio puede llamar las APIs
    {
      source: "/api/:path*",
      headers: [
        {
          key: "Access-Control-Allow-Origin",
          value: "https://1auto.market",
        },
        {
          key: "Access-Control-Allow-Methods",
          value: "GET,POST,PUT,DELETE,OPTIONS",
        },
        {
          key: "Access-Control-Allow-Headers",
          value: "Content-Type, Authorization",
        },
      ],
    },

    // ✅ Cache para assets estáticos
    {
      source: "/_next/static/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/logo/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },

    // ✅ Headers de seguridad para todas las rutas
    {
      source: "/(.*)",
      headers: [
        // Evita que el browser adivine el tipo de archivo (MIME sniffing)
        { key: "X-Content-Type-Options", value: "nosniff" },

        // Tu página no puede mostrarse en iframes de otros sitios (anti-clickjacking)
        { key: "X-Frame-Options", value: "SAMEORIGIN" },

        // Protección XSS legacy (navegadores viejos)
        { key: "X-XSS-Protection", value: "1; mode=block" },

        // No envía la URL completa al hacer click en links externos
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

        // Bloquea acceso a cámara, micrófono y GPS
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },

        // 🔴 NUEVO — HSTS: fuerza HTTPS por 1 año, protege contra ataques man-in-the-middle
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },

        // 🔴 NUEVO — CSP: solo permite cargar recursos de tus dominios de confianza
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com https://images.unsplash.com https://lh3.googleusercontent.com",
            "connect-src 'self' https://api.cloudinary.com https://soketi.app wss: ws:",
            "media-src 'self' blob: https://res.cloudinary.com",
            "frame-src 'none'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join("; "),
        },
      ],
    },
  ];
},

  // ✅ Webpack — tus fixes originales completos + tree-shaking
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        child_process: false,
        dns: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
        events: false,
        util: false,
        path: false,
        url: false,
        querystring: false,
        timers: false,
        "timers/promises": false,
        assert: false,
        constants: false,
        zlib: false,
        http: false,
        https: false,
        "mongodb-client-encryption": false,
        aws4: false,
        snappy: false,
        "bson-ext": false,
        kerberos: false,
        "@mongodb-js/zstd": false,
      };

      config.externals = config.externals || [];
      config.externals.push({
        "utf-8-validate": "commonjs utf-8-validate",
        bufferutil: "commonjs bufferutil",
        "supports-color": "commonjs supports-color",
      });
    }

    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }

    return config;
  },

  ...(process.env.NODE_ENV === "development" && {
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
  }),
};

module.exports = nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    domains: ["res.cloudinary.com"],
  },
  
  // Paquetes externos del servidor - MOVIDO de experimental a nivel raíz
  serverExternalPackages: [
    'mongodb', 
    'mongoose',
    '@mongodb-js/zstd',
    'snappy',
    'bson-ext',
    'kerberos'
  ],
  
  // Configuración de webpack para resolver errores de módulos de servidor
  webpack: (config, { isServer, dev }) => {
    // Excluir módulos de Node.js del bundle del cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Módulos de red y sistema
        net: false,
        tls: false,
        fs: false,
        child_process: false,
        dns: false,
        os: false,
        
        // Módulos de criptografía y streams
        crypto: false,
        stream: false,
        buffer: false,
        events: false,
        
        // Módulos de utilidades
        util: false,
        path: false,
        url: false,
        querystring: false,
        timers: false,
        'timers/promises': false,  // ⭐ AÑADIDO - Este es el módulo que falta
        assert: false,
        constants: false,
        zlib: false,
        
        // Módulos HTTP
        http: false,
        https: false,
        
        // Módulos específicos de MongoDB que pueden causar problemas
        'mongodb-client-encryption': false,
        'aws4': false,
        'snappy': false,
        'bson-ext': false,
        'kerberos': false,
        '@mongodb-js/zstd': false,
      };
      
      // Configuración adicional para módulos problemáticos
      config.externals = config.externals || [];
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
        'supports-color': 'commonjs supports-color',
      });
    }
    
    // Optimizaciones para desarrollo
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    
    return config;
  },
  
  // Configuración experimental - LIMPIADA, ya no incluye serverComponentsExternalPackages
  experimental: {
    // Aquí puedes agregar otras configuraciones experimentales si las necesitas
    // Por ejemplo: turbo, ppr, etc.
  },
  
  // Headers para CORS si los necesitas
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
  
  // Configuración adicional para desarrollo
  ...(process.env.NODE_ENV === 'development' && {
    // Opciones específicas para desarrollo
    onDemandEntries: {
      // Período en ms para mantener las páginas en memoria
      maxInactiveAge: 25 * 1000,
      // Número de páginas que deben mantenerse simultáneamente sin ser descargadas
      pagesBufferLength: 2,
    },
  }),
};

export default nextConfig;
// "use client";
// import React, { useState, useEffect } from "react";
// import { VehicleDataBackend } from "@/types/types";

// const AdminPanel: React.FC = () => {
//   const [vehicles, setVehicles] = useState<VehicleDataBackend[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchVehicles = async () => {
//       try {
//         const response = await fetch("/api/admin/vehicles");
//         const data = await response.json();
//         if (data.success && data.data) {
//           setVehicles(data.data);
//         } else {
//           setError(data.error || "Error al cargar los vehículos");
//         }
//       } catch {
//         setError("Error de red al cargar los vehículos");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVehicles();
//   }, []);

//   if (loading) return <p>Cargando...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border p-2">ID</th>
//             <th className="border p-2">Marca</th>
//             <th className="border p-2">Modelo</th>
//             <th className="border p-2">Precio</th>
//             <th className="border p-2">Disponibilidad</th>
//             <th className="border p-2">Comprobante</th>
//             <th className="border p-2">Acciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {vehicles.map((vehicle) => (
//             <tr key={vehicle._id} className="hover:bg-gray-50">
//               <td className="border p-2">{vehicle._id}</td>
//               <td className="border p-2">{vehicle.brand}</td>
//               <td className="border p-2">{vehicle.model}</td>
//               <td className="border p-2">${vehicle.price}</td>
//               <td className="border p-2">{vehicle.availability}</td>
//               <td className="border p-2">
//                 {vehicle.paymentProof ? (
//                   <a
//                     href={vehicle.paymentProof}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-500 hover:underline"
//                   >
//                     Ver
//                   </a>
//                 ) : (
//                   "No subido"
//                 )}
//               </td>
//               <td className="border p-2">
//                 <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
//                   Aprobar
//                 </button>
//                 <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2">
//                   Rechazar
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminPanel;
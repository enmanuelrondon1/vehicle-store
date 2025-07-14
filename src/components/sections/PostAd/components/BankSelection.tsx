"use client";
import React from "react";
import { BsBank } from "react-icons/bs";
import { Button } from "@/components/ui/button";

const banks = [
  { name: "Banesco", url: "https://www.banesco.com" },
  { name: "Banco de Venezuela", url: "https://www.bancodevenezuela.com" },
  { name: "Banco Mercantil", url: "https://www.mercantilbanco.com" },
  { name: "Banco Provincial", url: "https://www.provincial.com" },
  { name: "Bancaribe", url: "https://www.bancaribe.com.ve" },
  { name: "Banco Exterior", url: "https://www.bancoexterior.com" },
  { name: "Banco Occidental de Descuento (BOD)", url: "https://www.bod.com.ve" },
  { name: "Banco del Tesoro", url: "https://www.bt.gob.ve" },
  { name: "BFC Banco Fondo Común", url: "https://www.bfc.com.ve" },
  { name: "Bancamiga", url: "https://www.bancamiga.com" },
];

const BankSelection: React.FC = () => {
  const handleBankClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <BsBank className="w-16 h-16 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Selecciona un Banco para el Pago
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Escoge el banco de tu preferencia para realizar el pago de tu anuncio.
          </p>
        </div>
        <div className="grid gap-4">
          {banks.map((bank) => (
            <Button
              key={bank.name}
              onClick={() => handleBankClick(bank.url)}
              className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 flex items-center justify-between py-3 px-4 rounded-xl"
            >
              <span>{bank.name}</span>
              <BsBank className="w-5 h-5 text-blue-500" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BankSelection;
import React from 'react';
import QRCode from 'react-qr-code';

const GeneradorQR = () => {
  // lee donde se esta corriendo la app
  const baseUrl = window.location.origin;
  const checkInUrl = `${baseUrl}/check-in`;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-blue-800 mb-2">Recepción Virtual</h2>
      <p className="text-gray-500 mb-6 text-center text-sm">
        Pídele al paciente que escanee este código desde su celular para confirmar su llegada.
      </p>
      
      {/* Marco para QR */}
      <div className="bg-white p-4 rounded-xl border-4 border-blue-100 shadow-sm">
        <QRCode value={checkInUrl} size={200} />
      </div>
      
      {/* URL dinamica */}
      <p className="mt-4 text-xs text-gray-400 font-mono text-center">
        URL dinámica:<br/> {checkInUrl}
      </p>
    </div>
  );
};

export default GeneradorQR;
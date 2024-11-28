"use client";

import React from "react";

interface ErrorPopupProps {
    mensaje: string;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ mensaje }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md text-center">
        <p className="text-black-600 mb-4">
            {mensaje}
        </p>
        <button
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "black",
            color: "white",
          }}
          onClick={() => { window.location.href = "/"; }}
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;
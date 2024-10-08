import React from 'react';

interface StepDireccionProps {
  setStep: (step: string) => void;
}

const StepDireccion: React.FC<StepDireccionProps> = ({ setStep }) => {
  return (
    <div>
      <h2>Step Dirección</h2>
      <button
        onClick={() => setStep("pago")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Next to Pago
      </button>
    </div>
  );
};

export default StepDireccion;
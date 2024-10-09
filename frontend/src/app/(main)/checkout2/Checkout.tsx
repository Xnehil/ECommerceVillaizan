"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { Pedido } from 'types/PaquetePedido';
import MetodoPagoClient from './MetodoPagoClient';
import StepDireccion from './StepDireccion';

// Example components for different steps
const StepConfirmacion = () => <div>Step Confirmación</div>;

interface CheckoutProps {
    pedido: Pedido;
    /*usuario?: any;
    direccion?: any;*/
  }
  
  const Checkout: React.FC<CheckoutProps> = ({ pedido /*, usuario, direccion*/ }) => {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(searchParams.get('step') || 'aaa');

  const renderStep = () => {
    switch (step) {
      case 'direccion':
        return <StepDireccion setStep={setStep} />;
      case 'pago':
        return <MetodoPagoClient pedido={pedido} setStep={setStep}/>
      default:
        return <div>Seleccione un paso válido</div>;
    }
  };

  return (
    <div>
      {renderStep()}
    </div>
  );
};

export default Checkout;
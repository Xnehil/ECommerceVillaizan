import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ButtonWhatsAppProps {
  nombreConsumidor: string | null;
  codigoSeguimiento: string | null;
}

const ButtonWhatsApp: React.FC<ButtonWhatsAppProps> = ({ nombreConsumidor, codigoSeguimiento }) => {
  const [nroTelefono, setNroTelefono] = useState<string>("");  // State to store phone number
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);  // Control the visibility of the confirmation popup
  const [message, setMessage] = useState<string>(""); // Store the dynamic message

  useEffect(() => {
    // Fetch phone number from API when component mounts
    const fetchPhoneNumber = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/ajuste/nro_telefono_contacto_reclamo`);
        const ajuste = response.data.ajuste;
        setNroTelefono(ajuste.valor);  // Set the fetched phone number
      } catch (error) {
        console.error("Error fetching phone number:", error);
      }
    };

    fetchPhoneNumber();
  }, []);

  // Constructing the message dynamically
  const mensajeBase = "Hola, tengo un reclamo acerca de mi orden.";

  const handleMessage = () => {
    let dynamicMessage = mensajeBase;

    if (nombreConsumidor) {
      dynamicMessage += ` Mi nombre es ${nombreConsumidor}.`;
    }

    if (codigoSeguimiento) {
      dynamicMessage += ` El código de seguimiento es ${codigoSeguimiento}.`;
    } else {
      dynamicMessage += " No tengo el código de seguimiento.";
    }

    setMessage(encodeURIComponent(dynamicMessage)); // Update message state
  };

  // Handle button click: Show confirmation popup
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent default action (redirect)

    if (nroTelefono) {
      handleMessage();
      setIsPopupVisible(true);  // Show the popup
    } else {
      alert("Phone number is not available yet.");
    }
  };

  // Handle confirmation action (open WhatsApp)
  const handleConfirm = () => {
    const whatsappUrl = `https://wa.me/${nroTelefono}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setIsPopupVisible(false); // Close the popup after confirmation
  };

  // Handle cancellation action (close popup)
  const handleCancel = () => {
    setIsPopupVisible(false); // Close the popup
  };

  return (
    <div>
      <button 
        onClick={handleClick} 
        className="flex items-center justify-center bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all shadow-md w-full md:w-auto"
      >
        {/* Image icon with a filter to turn black to white */}
        <img 
          src="/images/phone.png" 
          alt="WhatsApp Icon" 
          className="w-6 h-6 mr-2" 
          style={{ filter: 'invert(1)' }} // Inverts colors (black to white)
        />
        Contactar por WhatsApp
      </button>

      {/* Confirmation Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <p className="text-black-600 mb-4">
              Se le redirigirá a la página de WhatsApp, ¿está seguro de continuar?
            </p>
            <button
              style={styles.cancelButton}
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button
              style={styles.confirmButton}
              onClick={handleConfirm}
            >
              Sí, continuar
            </button>
            
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
    confirmButton: {
      padding: '10px 20px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      backgroundColor: 'black',
      color: 'white',
    },
    cancelButton: {
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      backgroundColor: 'white',
      color: 'red',
    },
  };

export default ButtonWhatsApp;

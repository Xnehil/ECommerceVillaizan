import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface LabelWhatsAppProps {
  nombreConsumidor: string | null;
  codigoSeguimiento: string | null;
}

const LabelWhatsApp: React.FC<LabelWhatsAppProps> = ({ nombreConsumidor, codigoSeguimiento }) => {
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

  // Constructing the message dynamically with the default message
  const mensajeBase = "Hola. Tengo una consulta.";

  const handleMessage = () => {
    let dynamicMessage = mensajeBase;

    if (nombreConsumidor) {
      dynamicMessage += ` Mi nombre es ${nombreConsumidor}.`;
    }

    if (codigoSeguimiento) {
      dynamicMessage += ` Mi código de seguimiento es ${codigoSeguimiento}.`;
    }

    setMessage(encodeURIComponent(dynamicMessage)); // Update message state
  };

  // Handle label click: Show confirmation popup
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
    <>
      {/* Add the anchor tag to make it visually a link */}
      <a 
        onClick={handleClick} 
        href="#"
        className="text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
      >
        Contáctanos
      </a>

      {/* Confirmation Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <p className="text-black-600 mb-4">
              Se abrirá una nueva pestaña de WhatsApp Web para que hables con nosotros, ¿estás seguro de continuar?
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
    </>
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

export default LabelWhatsApp;

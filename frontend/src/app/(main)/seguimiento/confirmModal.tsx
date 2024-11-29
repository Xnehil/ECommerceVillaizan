import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  message: React.ReactNode;
}

const styles = {
  confirmButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "black",
    color: "white",
  },
  cancelButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "white",
    color: "red",
  },
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onConfirm, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md text-center">
        <p className="text-black-600 mb-4">
          {/* Directly split and insert <br /> where needed */}
          {message}
        </p>
        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            style={styles.cancelButton}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={styles.confirmButton}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

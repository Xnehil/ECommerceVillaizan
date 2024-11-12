import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onConfirm, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}>
      <div style={{
        width: "400px",
        padding: "20px",
        backgroundColor: "#2f2f2f",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        color: "#fff",
        textAlign: "center",
      }}>
        <p style={{ fontSize: "18px", marginBottom: "20px" }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button
            onClick={onConfirm}
            style={{
              backgroundColor: "#00b4d8",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#0090a7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#00b4d8";
            }}
          >
            Aceptar
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#555",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#555";
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

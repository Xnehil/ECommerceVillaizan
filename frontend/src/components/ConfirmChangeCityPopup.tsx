import React from "react"

interface ConfirmChangeCityPopupProps {
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmChangeCityPopup: React.FC<ConfirmChangeCityPopupProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>¿Estás seguro de cambiar de ciudad?</h2>
        <h2>Se perderan todos tus pedidos 😪</h2>
        <div className="buttons">
          <button onClick={onConfirm} className="btn-confirm">
            Sí, cambiar
          </button>
          <button onClick={onCancel} className="btn-cancel">
            No, cancelar
          </button>
        </div>
      </div>
      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .popup-content {
          background: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
        }
        .buttons {
          display: flex;
          justify-content: space-around;
          margin-top: 20px;
        }
        .btn-confirm {
          background-color: green;
          color: white;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
        }
        .btn-cancel {
          background-color: red;
          color: white;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

export default ConfirmChangeCityPopup

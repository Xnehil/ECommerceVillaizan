import React from "react"
import { DetallePedido, PedidoXMetodoPago } from "types/PaquetePedido"

interface EntregaPopupProps {
  direccion: string
  nombre: string
  detalles: DetallePedido[]
  subtotal: number
  metodoPago: string
  onConfirm: () => void
  onClose: () => void
  selectedImageId: string | null
  paymentAmount: number | null
  metodosPago: PedidoXMetodoPago[]
}

const EntregaPopup: React.FC<EntregaPopupProps> = ({
  direccion,
  nombre,
  detalles,
  subtotal,
  metodoPago,
  onConfirm,
  onClose,
  selectedImageId,
  paymentAmount,
  metodosPago,
}) => {
  const metodoPagoImages: { [key: string]: { src: string; alt: string } } = {
    pagoEfec: { src: "/images/efectivo.png", alt: "Pago en Efectivo" },
    yape: { src: "/images/yape.png", alt: "Pago con Yape" },
    plin: { src: "/images/plin.png", alt: "Pago con Plin" },
  }

  const getMetodoPagoImageName = (metodoPago: string) => {
    switch (metodoPago) {
      case "Efectivo":
        return "pagoEfec"
      case "Yape":
        return "yape"
      case "Plin":
        return "plin"
      default:
        return null
    }
  }

  const calcularPagoTotal = () => {
    return metodosPago.reduce(
      (total, metodoPago) => total + metodoPago.monto,
      0
    )
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <p style={{ textAlign: "left" }}>Entregar en:</p>
        <p style={{ textAlign: "left" }}>
          <strong>{direccion}</strong>
        </p>
        <p style={{ textAlign: "left" }}>Para:</p>
        <p style={{ textAlign: "left" }}>
          <strong>{nombre}</strong>
        </p>
        <p style={{ textAlign: "left" }}>Pedido:</p>
        {detalles.map((detalle, index) => {
          return (
            <p style={{ textAlign: "left" }} key={index}>
              <strong>
                {detalle.producto.nombre} ({detalle.cantidad})
              </strong>
            </p>
          )
        })}
        <p style={{ textAlign: "left" }}>Subtotal:</p>
        <p style={{ textAlign: "left" }}>
          <strong>S/ {subtotal.toFixed(2)}</strong>
        </p>
        <p style={{ textAlign: "left" }}>Método(s) de pago:</p>
        <div
          style={{
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {metodosPago?.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {metodosPago.map((metodo, index) => {
                const metodoPagoImageName = getMetodoPagoImageName(
                  metodo.metodoPago.nombre
                )
                if (metodo.monto > 0) {
                  return (
                    <div
                      key={index}
                      style={{
                        marginBottom: "2px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {metodoPagoImageName &&
                        metodoPagoImages[metodoPagoImageName] && (
                          <img
                            src={metodoPagoImages[metodoPagoImageName].src}
                            alt={metodoPagoImages[metodoPagoImageName].alt}
                            style={{ marginRight: "5px", height: "35px" }}
                          />
                        )}
                      <span>{metodo.metodoPago.nombre}</span>
                      <strong style={{ marginLeft: "5px" }}>
                        S/{" "}
                        {isNaN(metodo.monto) ? "0.00" : metodo.monto.toFixed(2)}
                      </strong>
                    </div>
                  )
                }
              })}
            </div>
          )}
          {metodosPago?.length > 0 &&
            metodosPago.some(
              (metodo) =>
                metodo.metodoPago.nombre === "Efectivo" && metodo.monto > 0
            ) &&
            subtotal < calcularPagoTotal() && (
              <>
                <p style={{ textAlign: "left" }}>Vuelto</p>
                <p style={{ textAlign: "left" }}>
                  <strong>
                    S/ {(calcularPagoTotal() - subtotal).toFixed(2)}
                  </strong>
                </p>
              </>
            )}
          {/* <div
            style={{
              marginBottom: "2px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {selectedImageId && metodoPagoImages[selectedImageId] && (
              <img
                src={metodoPagoImages[selectedImageId].src}
                alt={metodoPagoImages[selectedImageId].alt}
                style={{ marginLeft: "5px", height: "35px" }}
              />
            )}
            {selectedImageId && (
              <strong style={{ marginLeft: "5px" }}>{metodoPago}</strong>
            )}
          </div> */}
        </div>
        {/* Mostrar monto y vuelto solo para pago en efectivo */}
        {/* {selectedImageId === "pagoEfec" && paymentAmount !== null && (
          <>
            <p style={{ textAlign: "left" }}>Monto a Pagar</p>
            <p style={{ textAlign: "left" }}>
              <strong>S/ {paymentAmount.toFixed(2)}</strong>
            </p>
            <p style={{ textAlign: "left" }}>Vuelto</p>
            <p style={{ textAlign: "left" }}>
              <strong>S/ {(paymentAmount - subtotal).toFixed(2)}</strong>
            </p>
          </>
        )} */}
        <div
          style={{
            ...styles.buttonContainer,
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <button onClick={onConfirm} style={styles.confirmButton}>
            Confirmar
          </button>
          <button onClick={onClose} style={styles.cancelButton}>
            Volver
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "20px",
    width: "350px", // Definimos la anchura aquí
    textAlign: "center" as "center",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
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
}

export default EntregaPopup

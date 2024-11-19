"use client"

import React, { useState, useEffect } from "react"
import { MetodoPago, PedidoXMetodoPago } from "types/PaquetePedido"

interface ImageData {
  id: string
  src: string
  hoverText: string
}

type PagosParcialesProps = {
  text: string
  images: ImageData[]
  width: string
  height?: string
  onImageClick: (id: string | null) => void // Permitir null
  metodosPago: PedidoXMetodoPago[] // Add metodosPago to props
  setMetodosPago: (metodos: PedidoXMetodoPago[]) => void // Add setMetodosPago to props
  selectedImageIds: string[]
  setPaymentAmount: (amount: number | null) => void // Add setPaymentAmount to props
  hideCircle?: boolean // Add hideCircle to props
  onAmountChange?: (id: string, amount: number) => void
}

const PagosParciales: React.FC<PagosParcialesProps> = ({
  text,
  images,
  width = "100%",
  height = "auto",
  onImageClick,
  metodosPago, // Destructure the metodosPago array from props
  setMetodosPago, // Destructure the setMetodosPago function from props
  setPaymentAmount, // Destructure the setPaymentAmount function from props
  selectedImageIds,
  hideCircle = false, // Destructure hideCircle with default value false
  onAmountChange,
}) => {
  const [isCircleSelected, setIsCircleSelected] = useState(false) // Estado para controlar la selección del círculo
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  // Estado para manejar la imagen seleccionada

  // Sincronizamos el estado del círculo si una imagen está seleccionada
  //   useEffect(() => {
  //     if (propSelectedImageId) {
  //       setSelectedImageId(propSelectedImageId)
  //       setIsCircleSelected(true)
  //     } else {
  //       setIsCircleSelected(false) // Aquí se asegurará de que el círculo se deseleccione
  //       setSelectedImageId(null) // Asegúrate de limpiar el ID seleccionado cuando no hay imagen seleccionada
  //     }
  //   }, [propSelectedImageId])

  // El rectángulo se oscurece si hay una imagen seleccionada o el círculo está seleccionado
  const isSelected = selectedImageIds.length > 0 || isCircleSelected

  const handleCircleClick = () => {
    if (isCircleSelected) {
      setIsCircleSelected(false) // Cambiamos el estado del círculo al hacer clic
      setPaymentAmount(null) // Aseguramos que se limpie el monto de pago
    } else {
      setIsCircleSelected(true) // Rellenar el círculo si no estaba seleccionado
    }
  }

  const handleMouseEnter = (index: number) => {
    setHoverIndex(index)
  }

  const handleMouseLeave = () => {
    setHoverIndex(null)
  }

  const getMetodoPagoId = (imageId: string) => {
    const idMetodo =
      imageId === "yape"
        ? "mp_01JBDQD78HBD6A0V1DVMEQAFKV"
        : imageId === "plin"
        ? "mp_01JBDQDH47XDE75XCGSS739E6G"
        : "mp_01J99CS1H128G2P7486ZB5YACH"

    return idMetodo
  }

  return (
    <div
      style={{
        ...styles.rectangle,
        backgroundColor: isSelected ? "rgba(0, 0, 0, 0.1)" : "white", // Oscurecer si hay selección
        width: width,
        height: height,
      }}
    >
      {!hideCircle && (
        <div
          style={{
            ...styles.circle,
            backgroundColor: isCircleSelected ? "black" : "white", // Rellenar el círculo si está seleccionado
          }}
          onClick={handleCircleClick}
        ></div>
      )}
      <span style={{ ...styles.text, marginLeft: "20px", marginRight: "20px" }}>
        {text}
      </span>
      <div style={{ ...styles.imagesContainer, justifyContent: "right" }}>
        {images.map((image, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "80px",
            }}
          >
            <div
              style={styles.imageWrapper}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                onImageClick(image.id)
              }}
            >
              <img
                src={image.src}
                alt={`image-${index}`}
                style={{
                  ...styles.image,
                  padding: image.src.endsWith(".png") ? "10px" : "0",
                }}
              />
              {/* Overlay if the image is selected */}
              {selectedImageIds.includes(image.id) && (
                <div style={styles.overlay}></div>
              )}
              {hoverIndex === index && (
                <span style={styles.hoverText}>{image.hoverText}</span>
              )}
            </div>
            {/* Render the input field outside the imageWrapper */}
            {selectedImageIds.includes(image.id) && (
              <input
                type="number"
                style={styles.input}
                placeholder="Monto"
                value={
                  metodosPago.find(
                    (metodo) =>
                      metodo.metodoPago.id === getMetodoPagoId(image.id)
                  )?.monto
                }
                onChange={(e) => {
                  const value = parseFloat(e.target.value)
                  onAmountChange && onAmountChange(image.id, value)
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  rectangle: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderRadius: "15px",
    border: "1px solid #ccc",
    boxSizing: "border-box" as "border-box",
    transition: "background-color 0.3s",
  },
  circle: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "1px solid #000",
    marginLeft: "20px",
    marginRight: "20px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  text: {
    marginRight: "auto",
    fontFamily: "Poppins, sans-serif",
    fontWeight: 600,
    fontSize: "20px",
  },
  imagesContainer: {
    display: "flex",
    alignItems: "top",
    flex: 1,
    gap: "10px",
    paddingTop: "10px",
    paddingBottom: "10px",
  },
  imageWrapper: {
    position: "relative" as "relative",
    display: "inline-block",
    cursor: "pointer",
    borderRadius: "10px",
    border: "1px solid black",
  },
  image: {
    borderRadius: "10px",
    width: "auto",
    height: "80px",
    objectFit: "cover" as "cover",
  },
  hoverText: {
    width: "120px",
    backgroundColor: "black",
    color: "#fff",
    textAlign: "center" as "center",
    borderRadius: "6px",
    padding: "5px 0",
    position: "absolute" as "absolute",
    zIndex: 10,
    bottom: "110%",
    left: "50%",
    marginLeft: "-60px",
    opacity: 1,
    transition: "opacity 0.3s",
  },
  // Capa superpuesta que oscurece la imagen seleccionada
  overlay: {
    position: "absolute" as "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "80px",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Oscurecimiento
    borderRadius: "10px",
  },
  input: {
    marginTop: "5px",
    width: "100%",
    padding: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
}

export default PagosParciales

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
  height: string
  onImageClick: (id: string | null) => void // Permitir null
  setMetodosPago: (metodos: PedidoXMetodoPago[]) => void // Add setMetodosPago to props
  setPaymentAmount: (amount: number | null) => void // Add setPaymentAmount to props
  hideCircle?: boolean // Add hideCircle to props
}

const PagosParciales: React.FC<PagosParcialesProps> = ({
  text,
  images,
  width = "100%",
  height = "auto",
  onImageClick,
  setMetodosPago, // Destructure the setMetodosPago function from props
  setPaymentAmount, // Destructure the setPaymentAmount function from props
  hideCircle = false, // Destructure hideCircle with default value false
}) => {
  const [isCircleSelected, setIsCircleSelected] = useState(false) // Estado para controlar la selección del círculo
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]) // Estado para manejar la imagen seleccionada

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
      setSelectedImageIds([]) // Desseleccionamos la imagen
      setPaymentAmount(null) // Aseguramos que se limpie el monto de pago
      onImageClick(null)
    } else {
      setIsCircleSelected(true) // Rellenar el círculo si no estaba seleccionado
    }
  }

  const handleImageClick = (imageId: string) => {
    if (selectedImageIds.includes(imageId)) {
      // If the image is already selected, deselect it
      const newSelectedImageIds = selectedImageIds.filter(
        (id) => id !== imageId
      )
      setSelectedImageIds(newSelectedImageIds)
      // onImageClick(newSelectedImageIds); // Notify parent component
    } else {
      // If the image is not selected, select it
      const newSelectedImageIds = [...selectedImageIds, imageId]
      setSelectedImageIds(newSelectedImageIds)
      // onImageClick(newSelectedImageIds); // Notify parent component
    }
  }

  const handleMouseEnter = (index: number) => {
    setHoverIndex(index)
  }

  const handleMouseLeave = () => {
    setHoverIndex(null)
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
      <span style={{ ...styles.text, marginRight: "20px" }}>{text}</span>
      <div
        style={{ ...styles.imagesContainer, justifyContent: "right"}}
      >
        {images.map((image, index) => (
          <div
            key={index}
            style={styles.imageWrapper}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              // add imageId to selectedImageIds
              const newSelectedImageIds = selectedImageIds.includes(image.id)
                ? selectedImageIds.filter((id) => id !== image.id)
                : [...selectedImageIds, image.id]
              setSelectedImageIds(newSelectedImageIds)
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
            {/* Capa oscura que se superpone solo si la imagen está seleccionada */}
            {selectedImageIds.includes(image.id) && (
              <div style={styles.overlay}></div>
            )}
            {hoverIndex === index && (
              <span style={styles.hoverText}>{image.hoverText}</span>
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
    fontSize: "24px",
  },
  imagesContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    width: "100px",
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
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Oscurecimiento
    borderRadius: "10px",
  },
}

export default PagosParciales

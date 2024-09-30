"use client";

import React, { useState } from 'react';

interface ImageData {
  src: string;
  hoverText: string;
}

interface CustomRectangleProps {
  text: string;
  images: ImageData[];
  width?: string;
  height?: string;
}

const CustomRectangle: React.FC<CustomRectangleProps> = ({ text, images, width = '100%', height = 'auto' }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleCircleClick = () => {
    setIsSelected(!isSelected);
    setSelectedImageIndex(null); // Al hacer click en el círculo, des-seleccionar todas las imágenes
  };

  const handleImageClick = (index: number) => {
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null); // Si la imagen ya está seleccionada, des-seleccionarla
    } else {
      setIsSelected(true);
      setSelectedImageIndex(index); // Seleccionar una nueva imagen
    }
  };

  const handleMouseEnter = (index: number) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div
      style={{
        ...styles.rectangle,
        backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.1)' : 'white',
        width: width,
        height: height,
      }}
    >
      <div
        style={{
          ...styles.circle,
          backgroundColor: isSelected ? 'black' : 'white',
        }}
        onClick={handleCircleClick}
      ></div>
      <span style={styles.text}>{text}</span>
      <div style={styles.imagesContainer}>
        {images.map((image, index) => (
          <div
            key={index}
            style={styles.imageWrapper}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleImageClick(index)}
          >
            <img
              src={image.src}
              alt={`image-${index}`}
              style={{
                ...styles.image,
                padding: image.src.endsWith('.png') ? '10px' : '0',
              }}
            />
            {/* Capa oscura que se superpone solo si la imagen está seleccionada */}
            {selectedImageIndex === index && (
              <div style={styles.overlay}></div>
            )}
            {hoverIndex === index && (
              <span style={styles.hoverText}>{image.hoverText}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  rectangle: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderRadius: '15px',
    border: '1px solid #ccc',
    boxSizing: 'border-box' as 'border-box',
    transition: 'background-color 0.3s',
  },
  circle: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '1px solid #000',
    marginLeft: '20px',
    marginRight: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  text: {
    marginRight: 'auto',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 600,
    fontSize: '24px',
  },
  imagesContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: '10px',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  imageWrapper: {
    position: 'relative' as 'relative',
    display: 'inline-block',
    cursor: 'pointer',
    borderRadius: '10px',
    border: '1px solid black',
  },
  image: {
    borderRadius: '10px',
    width: '100px',
    height: '80px',
    objectFit: 'cover' as 'cover',
  },
  hoverText: {
    width: '120px',
    backgroundColor: 'black',
    color: '#fff',
    textAlign: 'center' as 'center',
    borderRadius: '6px',
    padding: '5px 0',
    position: 'absolute' as 'absolute',
    zIndex: 10,
    bottom: '110%',
    left: '50%',
    marginLeft: '-60px',
    opacity: 1,
    transition: 'opacity 0.3s',
  },
  // Capa superpuesta que oscurece la imagen seleccionada
  overlay: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Oscurecimiento
    borderRadius: '10px',
  },
};

export default CustomRectangle;

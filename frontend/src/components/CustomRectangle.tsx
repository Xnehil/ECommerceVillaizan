"use client";

import React, { useState } from 'react';

interface CustomRectangleProps {
  text: string;
  images: string[];
  width?: string;
  height?: string;
}

const CustomRectangle: React.FC<CustomRectangleProps> = ({ text, images, width = '100%', height = 'auto' }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleCircleClick = () => {
    setIsSelected(!isSelected);
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
        {images.map((src, index) => (
          <img key={index} src={src} alt={`image-${index}`} style={styles.image} />
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
    marginRight: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  text: {
    marginRight: 'auto',
  },
  imagesContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: '10px',
  },
  image: {
    borderRadius: '10px',
    width: '50px',
    height: '50px',
    objectFit: 'cover' as 'cover',
    border: '1px solid black',
  },
};

export default CustomRectangle;
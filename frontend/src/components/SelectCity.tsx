import React from "react"
import { CityCookie } from "types/global"

interface SelectCityProps {
  setSelectCityPopup: () => void // Se ajusta para activar el popup de confirmación
  city: CityCookie
}

const SelectCity: React.FC<SelectCityProps> = ({ setSelectCityPopup, city }) => {
  return (
    <div style={styles.rectangulo} className="mt-2 mb-2 pl-4 pr-4">
      <p>Catálogo de zona: {city.nombre}</p>
      <button
        style={styles.optionButton}
        onClick={setSelectCityPopup} // Activar la confirmación del cambio de ciudad
      >
        Cambiar
      </button>
    </div>
  )
}

const styles = {
  rectangulo: {
    height: "61px",
    backgroundColor: "#FFFFFF",
    borderRadius: "15px",
    flexShrink: 0,
    border: "var(--spacing-px, 1px) solid #000",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionButton: {
    margin: "10px",
    backgroundColor: "#414040",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    width: "117px",
    height: "40px",
  },
}

export default SelectCity

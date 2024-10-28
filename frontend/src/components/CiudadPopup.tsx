import { useRouter } from "next/navigation"
import React from "react"
import { CityCookie } from "types/global"

interface CiudadPopupProps {
  setCity: (city: CityCookie) => void
  resetCarrito: () => void // Nuevo prop para resetear el carrito
}

const CiudadPopup: React.FC<CiudadPopupProps> = ({ setCity, resetCarrito }) => {
  const router = useRouter()

  const handleCityChange = (city: CityCookie) => {
    setCity(city)
    resetCarrito() // Reinicia el carrito al cambiar de ciudad
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2 style={{ textAlign: "center" }}>Selecciona tu ubicación</h2>
        <button
          style={styles.optionButton}
          onClick={() => handleCityChange({
            id: "ciud_01J9PMCXF25RK303Q3AH3MXJ66",
            nombre: "Tarapoto",
          })}
        >
          Tarapoto
        </button>
        <button
          style={styles.optionButton}
          onClick={() => handleCityChange({
            id: "ciud_01J9PMD3F020RD1H7XK5VJXFFR",
            nombre: "Jaén",
          })}
        >
          Jaén
        </button>
        <button
          style={styles.optionButton}
          onClick={() => handleCityChange({
            id: "ciud_01J9PMCMWRYNTSEA2PKGZFG6J2",
            nombre: "Moyobamba",
          })}
        >
          Moyobamba
        </button>
        <button
          style={styles.closeButton}
          onClick={() => {
            router.push("/")
          }}
        >
          Volver
        </button>
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
    padding: "40px",
    width: "400px",
    textAlign: "center" as "center",
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
  },
  cancelButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "white",
    color: "red",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
  },
  errorImage: {
    width: "100px",
    height: "100px",
    marginBottom: "10px",
  },
  errorMessage: {
    textAlign: "center" as "center",
    color: "black",
    fontSize: "16px",
    fontWeight: "bold" as "bold",
  },
  closeButton: {
    marginTop: "10px",
    padding: "16px 0px",
    color: "#D22626",
    border: "none",
    borderRadius: "var(--6, 48px)",
    cursor: "pointer",
    fontSize: "14px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    width: "279px",
    height: "var(--6, 48px)",
  },
  optionButton: {
    marginTop: "10px",
    padding: "16px 0px",
    backgroundColor: "#4C4747",
    color: "white",
    border: "none",
    borderRadius: "var(--6, 48px)",
    cursor: "pointer",
    fontSize: "14px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    width: "279px",
    height: "var(--6, 48px)",
  },
}

export default CiudadPopup

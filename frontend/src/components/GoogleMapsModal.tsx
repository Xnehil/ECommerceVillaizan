import React, { useState } from "react"
import { GoogleMap, Marker } from "@react-google-maps/api"

interface GoogleMapModalProps {
  onSelectLocation: (lat: number, lng: number) => void
  closeModal: () => void
}

const GoogleMapModal: React.FC<GoogleMapModalProps> = ({
  onSelectLocation,
  closeModal,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      setSelectedLocation({ lat, lng })
    }
  }

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation.lat, selectedLocation.lng)
      closeModal()
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          center={{ lat: -12.046374, lng: -77.042793 }} // Initial location (Lima, for example)
          zoom={12}
          onClick={handleMapClick}
        >
          {selectedLocation && <Marker position={selectedLocation} />}
        </GoogleMap>
        <div className="flex w-full">
          <button
            onClick={closeModal}
            className="w-1/2 p-2 mr-1"
            style={styles.closeButton}
          >
            Volver
          </button>
          <button
            onClick={handleConfirm}
            className="w-1/2 p-2 ml-1"
            style={styles.optionButton}
          >
            Confirmar
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
    padding: "40px",
    width: "800px",
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
    backgroundColor: "#BD181E",
    color: "white",
    border: "none",
    borderRadius: "var(--6, 48px)",
    cursor: "pointer",
    fontSize: "14px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
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
    height: "var(--6, 48px)",
  },
}

export default GoogleMapModal

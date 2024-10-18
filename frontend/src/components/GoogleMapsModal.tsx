"use client"

import React, { useRef, useState } from "react"
import { GoogleMap, Marker } from "@react-google-maps/api"
import { map } from "lodash"

interface GoogleMapModalProps {
  onSelectLocation: (lat: number, lng: number) => void
  city: string
  closeModal: () => void
  location?: { lat: number; lng: number }
}

const GoogleMapModal: React.FC<GoogleMapModalProps> = ({
  onSelectLocation,
  city,
  closeModal,
  location,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
  } | null>(location || null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    try {
      if (event.latLng) {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        const geocoder = new google.maps.Geocoder()

        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results) {
            if (results[0]) {
              const address = results[0].formatted_address
              console.log("Address:", address)
              if (address.includes(city)) {
                setSelectedLocation({ lat, lng })
                setErrorMessage(null)
                if (mapRef.current) {
                  mapRef.current.setCenter({ lat, lng })
                }
              } else {
                setErrorMessage(`La dirección seleccionada no está en ${city}.`)
                setSelectedLocation(null)
              }
            } else {
              console.error("No se encontraron resultados.")
            }
          } else {
            console.error("Geocoder falló debido a:", status)
          }
        })
      }
    } catch (error) {
      console.error(error)
      setErrorMessage(
        "Ha ocurrido un error con el mapa. Por favor, intenta de nuevo."
      )
    }
  }

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation.lat, selectedLocation.lng)
      closeModal()
    }
  }

  const getInitialCenter = () => {
    if (selectedLocation) {
      return selectedLocation
    } else {
      if (city === "Moyobamba") {
        return { lat: -6.04413, lng: -76.96719 }
      } else if (city === "Tarapoto") {
        return { lat: -6.482, lng: -76.365 }
      } else {
        return { lat: -12.046374, lng: -77.042793 } // Default to Lima
      }
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          center={getInitialCenter()}
          zoom={14}
          onClick={handleMapClick}
          onLoad={(map) => {
            mapRef.current = map
          }}
        >
          {selectedLocation && <Marker position={selectedLocation} />}
        </GoogleMap>
        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
        <div className="flex w-full">
          <button
            onClick={closeModal}
            className={`p-2 ${
              !(!!errorMessage || !selectedLocation) ? "w-1/2 mr-1" : "w-full"
            }`}
            style={styles.closeButton}
          >
            Volver
          </button>
          {!(!!errorMessage || !selectedLocation) && (
            <button
              onClick={handleConfirm}
              className="w-1/2 p-2 ml-1"
              style={styles.optionButton}
            >
              Confirmar
            </button>
          )}
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

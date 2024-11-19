"use client"

import React, { useRef, useState, useEffect } from "react"
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

  const [googleLoaded, setGoogleLoaded] = useState(false)

  useEffect(() => {
    const loadGoogleMapsScript = async () => {
      if (
        typeof google !== "undefined" &&
        google.maps &&
        (await google.maps.importLibrary("places"))
      ) {
        setGoogleLoaded(true)
        return
      }

      const script = document.createElement("script")
      script.innerHTML = `
        (g => {
          var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
          b = b[c] || (b[c] = {});
          var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => {
            await (a = m.createElement("script"));
            e.set("libraries", [...r] + "");
            for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
            e.set("callback", c + ".maps." + q);
            a.src = \`https://maps.\${c}apis.com/maps/api/js?\` + e;
            d[q] = f;
            a.onerror = () => h = n(Error(p + " could not load."));
            a.nonce = m.querySelector("script[nonce]")?.nonce || "";
            m.head.append(a);
          }));
          d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n));
        })({
          key: "${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}",
          v: "weekly",
        });
      `
      script.async = true
      script.defer = true
      script.onload = () => {
        setGoogleLoaded(true)
      }
      script.onerror = () => {
        console.error("Failed to load Google Maps script")
      }

      document.head.appendChild(script)
    }

    loadGoogleMapsScript()
  }, [])

  useEffect(() => {
    if (googleLoaded) {
      // Your code that depends on the google object
      console.log("Google Maps API loaded")
    }
  }, [googleLoaded])

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
      } else if (city === "Jaén"){
        return { lat: -5.69918, lng: -78.801 };
      } else {
        return { lat: -12.046374, lng: -77.042793 } // Default to Lima
      }
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        {googleLoaded ? (
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
        ) : (
          <div>Loading Google Maps API...</div>
        )}
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

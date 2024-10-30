import { Pedido } from "types/PaquetePedido"
import { enrichLineItems, getOrSetCart } from "@modules/cart/actions"
import React, { useEffect, useRef, useState } from "react"
import Summary2 from "@modules/cart/templates/summary2"
import axios from "axios"
import { getCityCookie } from "@modules/store/actions"
import GoogleMapModal from "@components/GoogleMapsModal"
import { set } from "lodash"

interface StepDireccionProps {
  setStep: (step: string) => void;
  googleMapsLoaded: boolean;
}

const StepDireccion: React.FC<StepDireccionProps> = ({ setStep, googleMapsLoaded }) => {
  const [carritoState, setCarritoState] = useState<Pedido | null>(null)
  const [calle, setCalle] = useState("")
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [numeroExterior, setNumeroExterior] = useState("")
  const [numeroInterior, setNumeroInterior] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [referencia, setReferencia] = useState("")
  const [distrito, setDistrito] = useState("")
  const [nombre, setNombre] = useState("") // Nuevo estado para nombre
  const [telefono, setTelefono] = useState("") // Nuevo estado para teléfono
  const [numeroDni, setNumeroDni] = useState("") // Nuevo estado para DNI
  const [error, setError] = useState("")
  const [locationError, setLocationError] = useState("")
  const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
  const [showMapModal, setShowMapModal] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [dniError, setDniError] = useState<string | null>(null)
  const [telefonoError, setTelefonoError] = useState<string | null>(null)
  const [showWarnings, setShowWarnings] = useState(false) // Estado para mostrar advertencias


  const handleMapSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setLocationError("");
    if (googleMapsLoaded) {
      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(lat, lng);
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results) {
          if (results[0]) {
            const address = results[0].formatted_address;
            setCalle(address);
          } else {
            console.error("No se encontraron resultados.");
          }
        } else {
          console.error("Geocoder falló debido a:", status);
        }
      });
    }
  };
  const fetchCart = async () => {
    try {
      const respuesta = await getOrSetCart()
      let cart: Pedido = respuesta?.cart

      const city = getCityCookie()
      setCiudad(city.nombre)

      if (!cart) {
        console.error("No se obtuvo un carrito válido.")
        return
      }
      console.log("Contenido del carrito:", cart)

      const enrichedItems = await enrichLineItems(cart.detalles)
      cart.detalles = enrichedItems

      setCarritoState(cart)
    } catch (error) {
      console.error("Error al obtener el carrito:", error)
    }
  }
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNombre(value);
    localStorage.setItem('nombre', value); // Save to localStorage
  }

  const handleNroInteriorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNumeroInterior(value);
    localStorage.setItem('nroInterior', value);
  }

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  
    // Ensure the value contains only digits before updating the state
    if (/^\d*$/.test(value)) {
      setTelefono(value);
      localStorage.setItem('telefono', value); // Save to localStorage
  
      // Check if the value exceeds 9 digits
      if (value.length > 9) {
        setTelefonoError("El teléfono no puede tener más de 9 dígitos");
      } else {
        setTelefonoError(null); // Clear error if it's valid
      }
    }
  }

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setNumeroDni(value);
      localStorage.setItem('dni', value); // Save to localStorage
      if (value.length > 8) {
        setDniError("El DNI no puede tener más de 8 dígitos");
      } else {
        setDniError(null);
      }
    }
  }

  const handleCalleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCalle(value);
    localStorage.setItem('calle', value); // Save to localStorage
  };

  const handleReferenciaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReferencia(value);
    localStorage.setItem('referencia', value); // Save to localStorage
  };
  
  const isFormValid = () => {
    return (
      nombre.trim() !== "" &&
      numeroDni.length === 8 &&
      telefono.length === 9 &&
      calle.trim() !== ""
    )
  }

  const handleSubmit = async () => {
    if  (!isFormValid()) {
      setShowWarnings(true);
      return;
    }
    setShowWarnings(false);
    const ciudadCookie = getCityCookie()
    const direccionData = {
      calle: calle,
      numeroExterior: numeroExterior,
      numeroInterior: numeroInterior,
      distrito: distrito,
      codigoPostal: null,
      referencia: referencia,
      ciudad: {
        // Get cookie city
        id: ciudadCookie.id,
      },
      ubicacion: {
        latitud: "null",
        longitud: "null",
        direcciones: [{ value: "null" }, { value: "null" }],
      },
    }

    const usuarioData = {
      nombre: nombre,
      apellido: "",
      contrasena: "contrasena",
      conCuenta: false,
      numeroTelefono: telefono,
      persona: {
        tipoDocumento: "DNI",
        numeroDocumento: numeroDni,
      },
      rol: {
        id: "rol-f84abb43"
      }
    }

    console.log("Datos de dirección:", direccionData)
    console.log("Datos de usuario:", usuarioData)

    try {
      // Realizar ambas solicitudes POST
      const [direccionResponse, usuarioResponse] = await Promise.all([
        axios.post(baseUrl+"/admin/direccion", direccionData, {
          headers: { "Content-Type": "application/json" },
        }),
        axios.post(baseUrl+"/admin/usuario", usuarioData, {
          headers: { "Content-Type": "application/json" },
        }),
      ])

      console.log("Respuesta de dirección:", direccionResponse.data)
      console.log("Respuesta de usuario:", usuarioResponse.data)
      // Obtener los IDs de la respuesta
      const direccionId = direccionResponse.data.direccion.id // Ajusta según la estructura de la respuesta
      const usuarioId = usuarioResponse.data.usuario.id // Ajusta según la estructura de la respuesta
      console.log("Pedido ID:", direccionId)
      console.log("Pedido ID:", usuarioId)
      // Realizar el PUT para actualizar el pedido con los IDs
      if (carritoState?.id) {
        const pedidoId = carritoState.id
        console.log("Pedido ID:", pedidoId)
        const pedidoUpdateData = {
          direccion: direccionId,
          usuario: usuarioId,
        }
        await axios.put(
          baseUrl+`/admin/pedido/${pedidoId}?enriquecido=true`,
          pedidoUpdateData,
          {
            headers: { "Content-Type": "application/json" },
          }
        )

        console.log("Pedido actualizado con dirección y usuario.")
        setStep("pago")
      } else {
        console.error("No se encontró el ID del pedido.")
      }
    } catch (error) {
      console.error("Error al enviar la dirección o el usuario:", error)
    }
  }

  useEffect(() => {
    const savedNombre = localStorage.getItem('nombre');
    const savedTelefono = localStorage.getItem('telefono');
    const savedDni = localStorage.getItem('dni');
    const savedCalle = localStorage.getItem('calle');
    const savedNroInterior= localStorage.getItem('nroInterior');
    const savedReferencia= localStorage.getItem('referencia');
  
    if (savedNombre) setNombre(savedNombre);
    if (savedTelefono) setTelefono(savedTelefono);
    if (savedDni) setNumeroDni(savedDni);
    if (savedNroInterior) setNumeroInterior(savedNroInterior);
    if (savedCalle) setCalle(savedCalle);
    if (savedReferencia) setReferencia(savedReferencia);
    fetchCart()
    if (inputRef.current && google.maps.places) {
      const city = getCityCookie()

      const sanMartinBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-7.0, -77.5), // Southwest corner of San Martin
        new google.maps.LatLng(-5.0, -75.5) // Northeast corner of San Martin
      )

      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "PE" },
          bounds: sanMartinBounds,
          strictBounds: true,
        }
      )

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace()
        if (
          place &&
          place.formatted_address &&
          place.formatted_address.includes(city.nombre)
        ) {
          setCalle(place.formatted_address)
        } else {
          // Handle case when place is outside the selected city
          console.log("Selected place is not within the desired city")
          setCalle("")
        }
      })
    }
  }, [])

  return (
    <div className="content-container mx-auto py-8">
      <button
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800"
        onClick={() => window.history.back() /*setStep('previous')*/}
      >
        <img src="/images/back.png" alt="Volver" className="h-8" /> Volver
      </button>
      <h1 className="text-3xl font-bold mb-6">Coloca tus Datos</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          className="grid grid-cols-1 gap-6 lg:col-span-2"
          onSubmit={(e) => {
            e.preventDefault()
            // handleSubmit()
          }}
        >
          <div className="flex items-center gap-3">
            <img
              src="/images/servicio-al-cliente.png"
              alt="Nombre completo"
              className="h-14"
            />
            <div className="w-full">
              <label
                htmlFor="nombre"
                className="block text-lg font-medium text-gray-700"
              >
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={handleNombreChange}
                className="mt-1 block w-full p-2 border rounded-md"
                placeholder="Juan Perez"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-full">
              <label
                htmlFor="dni"
                className="block text-lg font-medium text-gray-700"
              >
                DNI <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="dni"
                value={numeroDni}
                onChange={handleDniChange}
                className="mt-1 block w-full p-2 border rounded-md"
                placeholder="12345678"
              />
              {dniError && (
                <p className="text-red-500 mt-2">{dniError}</p>  // Render the error message if it's set
                )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <img src="/images/casa.png" alt="Ciudad" className="h-14" />
            <div className="w-full">
              <label
                htmlFor="ciudad"
                className="block text-lg font-medium text-gray-700"
              >
                Ciudad <span className="text-red-500">*</span>
              </label>
              {locationError && <p className="text-red-500">{locationError}</p>}
              <div className="flex gap-3">
                <input
                  type="text"
                  id="ciudad"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded-md"
                  placeholder="Lima"
                  disabled={true}
                />
                <button
                  className="px-4 py-2 bg-yellow-200 border border-gray-300 rounded-md flex items-center gap-2"
                  onClick={() => setShowMapModal(true)}
                >
                  <img src="/images/mapa.png" alt="Mapa" className="h-8" />
                  Selecciona en el mapa
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-full grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="direccion"
                  className="block text-lg font-medium text-gray-700"
                >
                  Dirección <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="direccion"
                  value={calle}
                  onChange={handleCalleChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                  placeholder="Calle Malvinas 123"
                  ref={inputRef}
                />
              </div>
              <div>
                <label
                  htmlFor="numero"
                  className="block text-lg font-medium text-gray-700"
                >
                  Número interior
                </label>
                <input
                  type="text"
                  id="numero"
                  value={numeroInterior}
                  onChange={handleNroInteriorChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                  placeholder="No rellenar si no aplica"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <img
              src="/images/referencia.png"
              alt="Referencia"
              className="h-14"
            />
            <div className="w-full">
              <label
                htmlFor="referencia"
                className="block text-lg font-medium text-gray-700"
              >
                Referencia
              </label>
              <input
                type="text"
                id="referencia"
                value={referencia}
                onChange={handleReferenciaChange}
                className="mt-1 block w-full p-2 border rounded-md"
                placeholder="Esquina del parque Tres Marías"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <img src="/images/telefono.png" alt="Teléfono" className="h-14" />
            <div className="w-full">
              <label
                htmlFor="telefono"
                className="block text-lg font-medium text-gray-700"
              >
                Teléfono <span className="text-red-500">*</span>
              </label>
              {error && <p className="text-red-500">{error}</p>}
              <input
                type="text"
                id="telefono"
                value={telefono}
                className="mt-1 block w-full p-2 border rounded-md"
                placeholder="987654321"
                onChange={handleTelefonoChange}
              />
              {telefonoError && (
                <p className="text-red-500 mt-2">{telefonoError}</p>  // Render the error message if it's set
              )}
            </div>
          </div>
        </form>

        {/* Map modal */}
        {showMapModal && (
          <GoogleMapModal
            onSelectLocation={handleMapSelect}
            city={ciudad}
            closeModal={() => setShowMapModal(false)}
            {...(selectedLocation && { location: selectedLocation })}
          />
        )}

        <div className="bg-white py-6">
          {carritoState ? (
            <Summary2
              carrito={carritoState}
              handleSubmit={handleSubmit}
              isFormValid={isFormValid()}
              showWarnings={showWarnings}
            />
          ) : (
            <p>Cargando carrito...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StepDireccion

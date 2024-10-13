import { Pedido } from "types/PaquetePedido"
import { enrichLineItems, getOrSetCart } from "@modules/cart/actions"
import React, { useEffect, useState } from "react"
import Summary2 from "@modules/cart/templates/summary2"
import axios from "axios"
import { getCityCookie } from "@modules/store/actions"
import GoogleMapModal from "@components/GoogleMapsModal"

interface StepDireccionProps {
  setStep: (step: string) => void
}

const StepDireccion: React.FC<StepDireccionProps> = ({ setStep }) => {
  const [carritoState, setCarritoState] = useState<Pedido | null>(null)
  const [calle, setCalle] = useState("")
  const [numeroExterior, setNumeroExterior] = useState("")
  const [numeroInterior, setNumeroInterior] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [referencia, setReferencia] = useState("")
  const [distrito, setDistrito] = useState("")
  const [nombre, setNombre] = useState("") // Nuevo estado para nombre
  const [telefono, setTelefono] = useState("") // Nuevo estado para teléfono
  const [numeroDni, setNumeroDni] = useState("") // Nuevo estado para DNI
  const [error, setError] = useState("")

  const [showMapModal, setShowMapModal] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState({ lat: "", lng: "" })

  const handleMapSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat: lat.toString(), lng: lng.toString() })
    console.log("Selected Location:", { lat, lng })
  }

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

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setTelefono(value)
    }
  }

  const handleSubmit = async () => {
    if (telefono.length !== 9) {
      setError("Debe ingresar un número de teléfono de 9 dígitos")
      return
    }
    setError("")
    const direccionData = {
      calle,
      numeroExterior,
      numeroInterior,
      distrito,
      codigoPostal: null,
      referencia,
      ciudad: {
        value: ciudad,
      },
      ubicacion: {
        latitud: "null",
        longitud: "null",
        direcciones: [{ value: "null" }, { value: "null" }],
      },
    }

    const usuarioData = {
      nombre: nombre,
      apellido: "No tiene cuenta",
      correo: null,
      contrasena: "contrasena",
      conCuenta: false,
      numeroTelefono: telefono,
      fechaUltimoLogin: null,
      persona: {
        tipoDocumento: "DNI",
        numeroDocumento: numeroDni,
        razonEliminacion: null,
        estado: null,
      },
    }

    try {
      // Realizar ambas solicitudes POST
      const [direccionResponse, usuarioResponse] = await Promise.all([
        axios.post("http://localhost:9000/admin/direccion", direccionData, {
          headers: { "Content-Type": "application/json" },
        }),
        axios.post("http://localhost:9000/admin/usuario", usuarioData, {
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
          `http://localhost:9000/admin/pedido/${pedidoId}?enriquecido=true`,
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
    fetchCart()
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
            handleSubmit()
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
                onChange={(e) => setNombre(e.target.value)}
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
                onChange={(e) => setNumeroDni(e.target.value)}
                className="mt-1 block w-full p-2 border rounded-md"
                placeholder="12345678"
              />
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
                  onChange={(e) => setCalle(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded-md"
                  placeholder="Calle Malvinas 123"
                />
              </div>
              <div>
                <label
                  htmlFor="numero"
                  className="block text-lg font-medium text-gray-700"
                >
                  Nro interior
                </label>
                <input
                  type="text"
                  id="numero"
                  value={numeroInterior}
                  onChange={(e) => setNumeroInterior(e.target.value)}
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
                onChange={(e) => setReferencia(e.target.value)}
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
            </div>
          </div>
        </form>

        {/* Map modal */}
        {showMapModal && (
            <GoogleMapModal
              onSelectLocation={handleMapSelect}
              closeModal={() => setShowMapModal(false)}
            />
        )}

        <div className="bg-white py-6">
          {carritoState ? (
            <Summary2 carrito={carritoState} handleSubmit={handleSubmit} />
          ) : (
            <p>Cargando carrito...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StepDireccion

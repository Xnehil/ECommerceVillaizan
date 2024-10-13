import { Pedido } from "types/PaquetePedido"
import { enrichLineItems, getOrSetCart } from "@modules/cart/actions"
import React, { useEffect, useState } from "react"
import Summary2 from "@modules/cart/templates/summary2"
import axios from "axios"
import { getCityCookie } from "@modules/store/actions"

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
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [numeroDni, setNumeroDni] = useState("")
  const [dniError, setDniError] = useState<string | null>(null)
  const [telefonoError, setTelefonoError] = useState<string | null>(null)
  const [showWarnings, setShowWarnings] = useState(false) // Estado para mostrar advertencias

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

      const enrichedItems = await enrichLineItems(cart.detalles)
      cart.detalles = enrichedItems

      setCarritoState(cart)
    } catch (error) {
      console.error("Error al obtener el carrito:", error)
    }
  }

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setNumeroDni(value)
      if (value.length > 8) {
        setDniError("El DNI no puede tener más de 8 dígitos")
      } else {
        setDniError(null)
      }
    }
  }

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setTelefono(value)
      if (value.length > 9) {
        setTelefonoError("El teléfono no puede tener más de 9 dígitos")
      } else {
        setTelefonoError(null)
      }
    }
  }

  const isFormValid = () => {
    return (
      nombre.trim() !== "" &&
      numeroDni.length === 8 &&
      telefono.length === 9 &&
      calle.trim() !== ""
    )
  }

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setShowWarnings(true) // Mostrar advertencia cuando se intenta enviar el formulario con campos vacíos
      return
    }

    // Resetear advertencia cuando se valida correctamente el formulario
    setShowWarnings(false)

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
      const [direccionResponse, usuarioResponse] = await Promise.all([
        axios.post("http://localhost:9000/admin/direccion", direccionData, {
          headers: { "Content-Type": "application/json" },
        }),
        axios.post("http://localhost:9000/admin/usuario", usuarioData, {
          headers: { "Content-Type": "application/json" },
        }),
      ])

      const direccionId = direccionResponse.data.direccion.id
      const usuarioId = usuarioResponse.data.usuario.id

      if (carritoState?.id) {
        const pedidoId = carritoState.id
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
        onClick={() => window.history.back()}
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
              <label htmlFor="nombre" className="block text-lg font-medium text-gray-700">
                Nombre  <span className="text-red-500">*</span>
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
              <label htmlFor="dni" className="block text-lg font-medium text-gray-700">
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
              {dniError && <p className="text-red-500">{dniError}</p>}
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
                  className="mt-1 block w-full p-2 border rounded-md"
                  placeholder="Lima"
                  disabled={true}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-full grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="direccion" className="block text-lg font-medium text-gray-700">
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
                  placeholder="Colocar el numero interno"
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
              <input
                type="text"
                id="telefono"
                value={telefono}
                onChange={handleTelefonoChange}
                className="mt-1 block w-full p-2 border rounded-md"
                placeholder="987654321"
              />
              {telefonoError && <p className="text-red-500">{telefonoError}</p>}
            </div>
          </div>

          <div className="mt-6 text-gray-600">
            <p>Los campos con <span className="text-red-500">*</span> son obligatorios.</p>
          </div>
        </form>

        <div className="bg-white py-6">
          {carritoState ? (
            <Summary2
              carrito={carritoState}
              handleSubmit={handleSubmit}
              isFormValid={isFormValid()}
              showWarnings={showWarnings} // Pasar advertencias
            />
          ) : (
            <p>Cargando carrito...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StepDireccion;

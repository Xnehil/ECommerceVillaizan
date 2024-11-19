import { useSession } from "next-auth/react"
import React, { useEffect, useRef, useState } from "react"
import { Button } from "@components/Button"
import { getCityCookie } from "@modules/store/actions"

interface AddressFormParentProps {
  nombre: string;
  numeroDni: string;
  numeroRuc: string; // Nuevo campo para el RUC
  ciudad: string;
  telefono: string;
  calle: string;
  setCalle: (calle: string) => void;
  numeroInterior: string;
  referencia: string;
  handleNombreChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDniChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRucChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Nueva función para el RUC
  handleTelefonoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCiudadChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCalleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNroInteriorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleReferenciaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClickMapa: () => void;
  status: string;
  handleSubmitPadre: () => void;
  dniError?: string | null;
  rucError?: string | null;
  locationError?: string | null;
  telefonoError?: string | null;
}

const AddressFormParent: React.FC<AddressFormParentProps> = ({
  nombre,
  numeroDni,
  numeroRuc,
  ciudad,
  telefono,
  calle,
  numeroInterior,
  referencia,
  handleNombreChange,
  handleDniChange,
  handleRucChange,
  handleTelefonoChange,
  handleCiudadChange,
  handleCalleChange,
  handleNroInteriorChange,
  handleReferenciaChange,
  handleClickMapa,
  status,
  handleSubmitPadre,
  dniError,
  rucError,
  locationError,
  telefonoError,
  setCalle,
}) => {
  const { data: session } = useSession() // Get session data
  const [comprobante, setComprobante] = useState<string>(""); 
  const [dniValidationError, setDniValidationError] = useState<string | null>(null)
  const [rucValidationError, setRucValidationError] = useState<string | null>(null);
  const [telefonoValidationError, setTelefonoValidationError] = useState<
    string | null
  >(null)
  const [nombreValidationError, setNombreValidationError] = useState<
    string | null
  >(null)
  const [direccionValidationError, setDireccionValidationError] = useState<
    string | null
  >(null)
  const [referenciaValidationError, setReferenciaValidationError] = useState<
    string | null
  >(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [googleLoaded, setGoogleLoaded] = useState(false)

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

  useEffect(() => {
    loadGoogleMapsScript()
    if (inputRef.current && googleLoaded && google.maps.places) {
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

  const handleComprobanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComprobante(e.target.value);
  };

  const handleDniBlur = () => {
    if (!numeroDni.trim()) {
      setDniValidationError("Por favor, complete el campo.")
    } else {
      setDniValidationError(null)
    }
  }

  const handleRucBlur = () => {
    if (!numeroRuc.trim()) {
      setRucValidationError("Por favor, complete el campo.");
    } else {
      setRucValidationError(null);
    }
  };

  const handleTelefonoBlur = () => {
    if (!telefono.trim()) {
      setTelefonoValidationError("Por favor, complete el campo.")
    } else {
      setTelefonoValidationError(null)
    }
  }

  const handleNombreBlur = () => {
    if (!nombre.trim()) {
      setNombreValidationError("Por favor, complete el campo.")
    } else {
      setNombreValidationError(null)
    }
  }

  const handleDireccionBlur = () => {
    if (!calle.trim()) {
      setDireccionValidationError("Por favor, complete el campo.")
    } else {
      setDireccionValidationError(null)
    }
  }

  const handleReferenciaBlur = () => {
    if (!referencia.trim()) {
      setReferenciaValidationError("Por favor, complete el campo.")
    } else {
      setReferenciaValidationError(null)
    }
  }

  return (
    <form
      className="grid grid-cols-1 gap-6 lg:col-span-2"
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmitPadre()
      }}
    >
      {/* Form fields */}
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
            onBlur={handleNombreBlur}
          />
          {nombreValidationError && (
            <p className="text-red-500 mt-2">{nombreValidationError}</p>
          )}
        </div>
      </div>

      {/* Selección de Comprobante */}
      <div className="flex items-center gap-3">
        <label className="block text-lg font-medium text-gray-700">
          Selecciona tu comprobante:
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="comprobante"
              value="boleta"
              checked={comprobante === "boleta"}
              onChange={handleComprobanteChange}
              className="mr-2"
            />
            Boleta
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="comprobante"
              value="factura"
              checked={comprobante === "factura"}
              onChange={handleComprobanteChange}
              className="mr-2"
            />
            Factura
          </label>
        </div>
      </div>

      {/* Mostrar campo de DNI o RUC basado en la selección */}
      {comprobante === "boleta" && (
        <div className="flex flex-col gap-1">
          <label htmlFor="dni" className="text-lg font-medium text-gray-700">
            DNI <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="dni"
            value={numeroDni}
            onChange={handleDniChange}
            onBlur={handleDniBlur}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="12345678"
          />
          {(dniError || dniValidationError) && (
            <p className="text-red-500 mt-2">{dniError || dniValidationError}</p>
          )}
        </div>
      )}

      {comprobante === "factura" && (
        <div className="flex flex-col gap-1">
          <label htmlFor="ruc" className="block text-lg font-medium text-gray-700">
            RUC <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="ruc"
            value={numeroRuc}
            onChange={handleRucChange}
            onBlur={handleRucBlur}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="10XXXXXXXXX"
          />
          {(rucError || rucValidationError) && (
            <p className="text-red-500 mt-2">{rucError || rucValidationError}</p>
          )}
        </div>
      )}

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
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="987654321"
            onChange={handleTelefonoChange}
            onBlur={handleTelefonoBlur}
          />
          {(telefonoError || telefonoValidationError) && (
            <p className="text-red-500 mt-2">
              {telefonoError || telefonoValidationError}
            </p>
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
              onChange={handleCiudadChange}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="Lima"
              disabled={true}
            />
            {!session?.user?.id && (
              <button
                type="button"
                className="px-4 py-2 bg-yellow-200 border border-gray-300 rounded-md flex items-center gap-2"
                onClick={handleClickMapa}
              >
                <img src="/images/mapa.png" alt="Mapa" className="h-8" />
                Selecciona en el mapa
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conditional button to select location on map */}
      {!session?.user?.id && (
        <>
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
                  onBlur={handleDireccionBlur}
                />
                {(locationError || direccionValidationError) && (
                  <p className="text-red-500 mt-2">
                    {locationError || direccionValidationError}
                  </p>
                )}
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
                Referencia <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="referencia"
                value={referencia}
                onChange={handleReferenciaChange}
                className="mt-1 block w-full p-2 border rounded-md"
                placeholder="Esquina del parque Tres Marías"
                onBlur={handleReferenciaBlur}
              />
              {referenciaValidationError && (
                <p className="text-red-500 mt-2">{referenciaValidationError}</p>
              )}
            </div>
          </div>
        </>
      )}

      {status === "loading" ? (
        <Button isLoading loaderClassname="w-6 h-6" variant="ghost"></Button>
      ) : null}
    </form>
  )
}

export default AddressFormParent

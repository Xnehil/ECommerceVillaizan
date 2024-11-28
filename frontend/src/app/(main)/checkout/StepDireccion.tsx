import { Pedido } from "types/PaquetePedido"
import { enrichLineItems, getOrSetCart } from "@modules/cart/actions"
import React, { useEffect, useRef, useState } from "react"
import Summary2 from "@modules/cart/templates/summary2"
import axios from "axios"
import { getCityCookie } from "@modules/store/actions"
import GoogleMapModal from "@components/GoogleMapsModal"
import { set } from "lodash"
import { useRouter } from "next/navigation"

import { useSession } from "next-auth/react"

import LoggedInAddresses from "./LoggedInAddresses"
import { Button } from "@components/Button"
import AddressFormParent from "./AddressFormParent"
import BackButton from "@components/BackButton"
import { Heading } from "@medusajs/ui"
import CryptoJS from "crypto-js";

interface StepDireccionProps {
  setStep: (step: string) => void
  googleMapsLoaded: boolean
}

const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default_key";

// Function to decrypt data
const decryptData = (data: string | null): string | null => {
  if (data) {
      try {
          return CryptoJS.AES.decrypt(data, encryptionKey).toString(CryptoJS.enc.Utf8);
      } catch (error) {
          console.error("Decryption failed:", error);
          return null;
      }
  }
  return null;
};

const StepDireccion: React.FC<StepDireccionProps> = ({
  setStep,
  googleMapsLoaded,
}) => {
  const [carritoState, setCarritoState] = useState<Pedido | null>(null)
  const [calle, setCalle] = useState("")
  const [numeroExterior, setNumeroExterior] = useState("")
  const [numeroInterior, setNumeroInterior] = useState("")
  const [ciudadNombre, setCiudadNombre] = useState("")
  const [ciudadId, setCiudadId] = useState("")
  const [referencia, setReferencia] = useState("")
  const [distrito, setDistrito] = useState("")
  const [nombre, setNombre] = useState("") // Nuevo estado para nombre
  const [telefono, setTelefono] = useState("") // Nuevo estado para teléfono
  const [numeroDni, setNumeroDni] = useState("") // Nuevo estado para DNI
  const [numeroRuc, setNumeroRuc] = useState(""); // Estado para RUC
  const [comprobante, setComprobante] = useState("");
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
  const { data: session, status } = useSession()
  const router = useRouter()

  const [userNombre, setUserNombre] = useState("")
  const [userApellido, setUserApellido] = useState("")
  const [userCorreo, setUserCorreo] = useState("")
  const [userTelefono, setUserTelefono] = useState("")
  const [userId, setUserId] = useState("")
  const [userConCuenta, setUserConCuenta] = useState(false)
  const [userNroDoc, setUserNroDoc] = useState("")
  const [userPersonaId, setUserPersonaId] = useState("")
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  )

  const [googleLoaded, setGoogleLoaded] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const hasRunOnceAuth = useRef(false)
  const [mensajeErrorValidacion, setMensajeErrorValidacion] = useState("")
  const [showErrorValidacion, setShowErrorValidacion] = useState(false)
  const [formValidity, setFormValidity] = useState<boolean>(false);

  useEffect(() => {
    const encryptedLocation = localStorage.getItem("selectedLocation");
    if (encryptedLocation) {
      try {
        const decryptedLocation = JSON.parse(
          CryptoJS.AES.decrypt(encryptedLocation, encryptionKey).toString(CryptoJS.enc.Utf8)
        );
        if (decryptedLocation && decryptedLocation.lat && decryptedLocation.lng) {
          setSelectedLocation(decryptedLocation);
        }
      } catch (error) {
        console.error("Failed to decrypt or parse the location:", error);
      }
    }
  }, []);

  useEffect(() => {
    setFormValidity(isFormValid()); // Compute once during render
  }, [nombre, numeroDni, telefono, calle, referencia, selectedLocation, numeroRuc, selectedAddressId, comprobante]); // Add dependencies as needed

  useEffect(() => {
    if (status !== "loading" && !hasRunOnceAuth.current) {
      hasRunOnceAuth.current = true
      if (session?.user?.id) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    }
  }, [session, status])

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

  const handleToggleAddress = (addressId: string | null) => {
    if(addressId){
      setSelectedAddressId(addressId)
    
      localStorage.setItem("selectedAddressId", CryptoJS.AES.encrypt(addressId, encryptionKey).toString());
      
      console.log("Selected Address ID:", addressId)
    }
    
  }

  const handleMapSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng })
    setLocationError("")

    const encryptedLocation = CryptoJS.AES.encrypt(
      JSON.stringify({ lat, lng }),
      encryptionKey
    ).toString();
    localStorage.setItem("selectedLocation", encryptedLocation);

    if (googleLoaded) {
      const geocoder = new google.maps.Geocoder()
      const latlng = new google.maps.LatLng(lat, lng)
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results) {
          if (results[0]) {
            const address = results[0].formatted_address
            console.log("Dirección seleccionada a cargar en calle:", address)
            setCalle(address)
            localStorage.setItem("calle", CryptoJS.AES.encrypt(address, encryptionKey).toString());
          } else {
            console.error("No se encontraron resultados.")
          }
        } else {
          console.error("Geocoder falló debido a:", status)
        }
      })
    }
    else{
      console.log("Google Maps no está cargado")
    }
  }
  
  const fetchCart = async () => {
    try {
      const respuesta = await getOrSetCart()
      let cart: Pedido = respuesta?.cart

      if(cart.estado !== "carrito"){
        throw new Error("El carrito no está en estado 'carrito'")
      }

      const city = getCityCookie()
      setCiudadNombre(city.nombre)
      setCiudadId(city.id)

      if (!cart) {
        console.error("No se obtuvo un carrito válido.")
        return
      }
      console.log("Contenido del carrito:", cart)

      const enrichedItems = await enrichLineItems(cart.detalles)
      cart.detalles = enrichedItems
      cart.detalles = cart.detalles.filter((item) => item.estaActivo); // Filtra los items inactivos

      setCarritoState(cart)
    } catch (error) {
      console.error("Error al obtener el carrito:", error)
    }
  }

  /*
  const handleComprobanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComprobante(e.target.value);
  };*/

  const handleComprobanteChange = (value: string) => {
    setComprobante(value); // Update parent state
    console.log("Comprobante value from child:", value);
    localStorage.setItem("comprobante", CryptoJS.AES.encrypt(value, encryptionKey).toString());
  };

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNombre(value)
    if(value.trim() !== "" && value.trim().length > 0 && value.trim().length < 100) {
      localStorage.setItem("nombre", CryptoJS.AES.encrypt(value, encryptionKey).toString());
    }
    
  }

  const handleNroInteriorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNumeroInterior(value)
    if(value.trim() !== "" && value.trim().length > 0 && value.trim().length < 100) {
      localStorage.setItem("nroInterior", CryptoJS.AES.encrypt(value, encryptionKey).toString());
    }
  }

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Ensure the value contains only digits before updating the state
    if (/^\d*$/.test(value)) {
      setTelefono(value)
      

      // Check if the value exceeds 9 digits
      if (value.length > 9) {
        setTelefonoError("El teléfono no puede tener más de 9 dígitos")
      } else {
        localStorage.setItem("telefono", CryptoJS.AES.encrypt(value, encryptionKey).toString());
        setTelefonoError(null) // Clear error if it's valid
      }
    }
  }

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setNumeroDni(value);
      
      if (value.length > 8) {
        setDniError("El DNI no puede tener más de 8 dígitos");
      } else {
        localStorage.setItem("dni", CryptoJS.AES.encrypt(value, encryptionKey).toString());
        setDniError(null);
      }
    }
  };

  const handleRucChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setNumeroRuc(value);
      localStorage.setItem("ruc", CryptoJS.AES.encrypt(value, encryptionKey).toString());
      if (value.length !== 11) {
        setDniError("El RUC debe tener 11 dígitos");
      } else {
        setDniError(null);
      }
    }
  };

  const handleCalleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCalle(value)
    if(value.trim() !== "" && value.trim().length > 0 && value.trim().length < 255) {
      localStorage.setItem("calle", CryptoJS.AES.encrypt(value, encryptionKey).toString());
    }
  }

  const handleCiudadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCiudadNombre(value)
    localStorage.setItem("ciudad", CryptoJS.AES.encrypt(value, encryptionKey).toString());
  }

  const handleReferenciaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setReferencia(value)
    if(value.trim() !== "" && value.trim().length > 0 && value.trim().length < 255) {
      localStorage.setItem("referencia", CryptoJS.AES.encrypt(value, encryptionKey).toString());
    }
  }


  const isFormValid = () => {
      
    try{
      let mensajesError: string[] = [];
      let checkNombre = nombre.trim() !== "" && nombre.trim().length > 0 && nombre.trim().length < 100
      if(!checkNombre) {
        mensajesError.push("Nombre inválido")
        console.log("Error nombre")
      }
      let checkDni = numeroDni.length === 8 || comprobante !== "boleta"
      if(!checkDni) {
        mensajesError.push("DNI inválido")
        console.log("Error dni")
      }
      let checkTelefono = telefono.length === 9
      if(!checkTelefono) {
        mensajesError.push("Teléfono inválido")
        console.log("Error telefono")
      }
      let checkCalle = (calle.trim() !== "" && calle.trim().length > 0 && calle.trim().length < 255) || isAuthenticated 
      if(!checkCalle) {
        mensajesError.push("Calle inválida")
        console.log("Error calle")
      }
      let checkReferencia = (referencia.trim() !== "" && referencia.trim().length > 0 && referencia.trim().length < 255) || isAuthenticated
      if(!checkReferencia) {
        mensajesError.push("Referencia inválida")
        console.log("Error referencia")
      }
      let checkSelectedLocation = selectedLocation || isAuthenticated
      if(!checkSelectedLocation) {
        mensajesError.push("Ubicación en el mapa inválida")
        console.log("Error ubicación")
      }
      let checkRuc = numeroRuc.length === 11 || comprobante !== "factura"
      if(!checkRuc) {
        mensajesError.push("RUC inválido")
        console.log("Error ruc")
      }
      let checkSelectedAddressId = selectedAddressId !== null || !isAuthenticated
      if(!checkSelectedAddressId) {
        mensajesError.push("Dirección inválida")
        console.log("Error dirección")
      }
      let checkComprobante = comprobante === "boleta" || comprobante === "factura" || comprobante === "boletaSimple"
      if(!checkComprobante) {
        mensajesError.push("Comprobante inválido")
        console.log("Error comprobante")
      }

      if(mensajesError.length > 0) {
        console.log("Mensajes de error:", mensajesError)
        setMensajeErrorValidacion(mensajesError.join(", "))
        setShowErrorValidacion(true)
        return false
      }
      else {
        setShowErrorValidacion(false)
        return true
      }
    }
    catch(error) {
      console.error("Error en validación de formulario:", error)
      return false
    }    

  }

  const handleSubmitPadre = async () => {
    //console.log("SUBMIT PADRE")
    const responseFormValid = isFormValid()
    //console.log("RESPONSE FORM VALID:", responseFormValid)

    if (!responseFormValid) {
      setShowWarnings(true)
      return
    }
    //console.log("PADRE FORM VALID")
    setShowWarnings(false)
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
        latitud: selectedLocation?.lat || "null",
        longitud: selectedLocation?.lng || "null",
        direcciones: [{ value: "null" }, { value: "null" }],
      },
    }
    direccionData.ubicacion.latitud = selectedLocation?.lat.toString() || "null"
    direccionData.ubicacion.longitud =
      selectedLocation?.lng.toString() || "null"

      const usuarioData = {
        nombre: nombre,
        apellido: "",
        contrasena: "",
        conCuenta: false,
        numeroTelefono: telefono,
        persona: {
          tipoDocumento: numeroRuc ? "RUC" : "DNI",
          numeroDocumento: numeroRuc || numeroDni,
        },
        rol: {
          id: "rol-f84abb43",
        },
      };

    console.log("Datos de dirección:", direccionData)
    console.log("Datos de usuario:", usuarioData)
    let usuarioIdAux = userId
    let direccionIdAux = selectedAddressId
    try {
      if (!session?.user?.id) {
        const usuarioResponse = await axios.post(
          baseUrl + "/admin/usuario",
          usuarioData,
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        const usuarioId = usuarioResponse.data.usuario.id
        usuarioIdAux = usuarioId

        const direccionResponse = await axios.post(
          baseUrl + "/admin/direccion",
          direccionData,
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        console.log("Respuesta de dirección:", direccionResponse.data)
        const direccionId = direccionResponse.data.direccion.id // Ajusta según la estructura de la respuesta
        console.log("Pedido ID:", direccionId)
        direccionIdAux = direccionId
      } else {
        const usuarioGuardar = {
          id: userId,
          nombre: nombre,
          numeroTelefono: telefono,
          persona: {
            id: userPersonaId,
            tipoDocumento: "DNI",
            numeroDocumento: numeroDni,
          },
        }
        const response = await axios.put(
          baseUrl + `/admin/usuario/${userId}`,
          usuarioGuardar
        )
        console.log("Usuario actualizado:", response.data)
      }

      // Realizar el PUT para actualizar el pedido con los IDs
      if (carritoState?.id) {
        const pedidoId = carritoState.id
        console.log("Pedido ID:", pedidoId)
        const pedidoUpdateData = {
          direccion: {
            id: direccionIdAux,
          },
          usuario: {
            id: usuarioIdAux,
          }
        }
        const respuestaAntesDePago=await axios.put(
          baseUrl + `/admin/pedido/${pedidoId}?enriquecido=true`,
          pedidoUpdateData,
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        console.log("Pedido actualizado con dirección y usuario:", respuestaAntesDePago.data)
        //setStep("pago")
        window.location.href = '/checkout?step=pago';
      } else {
        console.error("No se encontró el ID del pedido.")
      }
    } catch (error) {
      console.error("Error al enviar la dirección o el usuario:", error)
    }
  }

  useEffect(() => {
    async function fetchUserName() {
      if (status !== "loading") {
        if (session?.user?.id) {
          try {
            // Clear specific localStorage values if user is logged in
            localStorage.removeItem('calle');
            localStorage.removeItem('dni');
            localStorage.removeItem('nombre');
            localStorage.removeItem('nroInterior');
            localStorage.removeItem('referencia');
            localStorage.removeItem('telefono');
            //localStorage.removeItem('comprobante');
            localStorage.removeItem('ruc');
            //localStorage.removeItem('selectedAddressId');
            localStorage.removeItem('selectedLocation');

            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/usuario/${session.user.id}`
            )
            console.log("response", response)
            const user = response.data.usuario

            if (user) {
              setUserNombre(user.nombre)
              setUserApellido(user.apellido)
              setUserCorreo(user.correo)
              setUserTelefono(user.numeroTelefono)
              setUserId(user.id)
              setUserConCuenta(user.concuenta)
              if (user.persona && user.persona.id) {
                setUserPersonaId(user.persona.id)
              }
              if (user.persona && user.persona.numeroDocumento !== null && user.persona.tipoDocumento ==="DNI") {
                setNumeroDni(user.persona.numeroDocumento)
                localStorage.setItem("dni", CryptoJS.AES.encrypt(user.persona.numeroDocumento, encryptionKey).toString());
                //localStorage.setItem("comprobante", CryptoJS.AES.encrypt("boleta", encryptionKey).toString());
                //setComprobante("boleta")
              }
              else if(user.persona && user.persona.numeroDocumento !== null && user.persona.tipoDocumento ==="RUC") {
                setNumeroRuc(user.persona.numeroDocumento)
                localStorage.setItem("ruc", CryptoJS.AES.encrypt(user.persona.numeroDocumento, encryptionKey).toString());
                //localStorage.setItem("comprobante", CryptoJS.AES.encrypt("factura", encryptionKey).toString());
                //setComprobante("factura")
              }

              // Set localStorage with user data
              localStorage.setItem("nombre", CryptoJS.AES.encrypt(user.nombre, encryptionKey).toString());
              localStorage.setItem("telefono", CryptoJS.AES.encrypt(user.numeroTelefono, encryptionKey).toString());

              setNombre(user.nombre)
              setTelefono(user.numeroTelefono)
            } else {
              console.error("Failed to fetch user name")
            }

            const addressResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/direccion/usuario/${session.user.id}?guardada=true`
            )
            //setDirecciones(addressResponse.data.direcciones);
          } catch (error) {
            console.error("Error fetching user name:", error)
          }
        }
      }
    }

    fetchUserName()
  }, [session, status])

  useEffect(() => {
    try{
      const savedNombre = decryptData(localStorage.getItem("nombre"));
      const savedTelefono = decryptData(localStorage.getItem("telefono"));
      const savedDni = decryptData(localStorage.getItem("dni"));
      const savedCalle = decryptData(localStorage.getItem("calle"));
      const savedNroInterior = decryptData(localStorage.getItem("nroInterior"));
      const savedReferencia = decryptData(localStorage.getItem("referencia"));
      const savedComprobante = decryptData(localStorage.getItem("comprobante"));
      const savedAddressId = decryptData(localStorage.getItem("selectedAddressId"));
      const savedRuc = decryptData(localStorage.getItem("ruc"));

      if(savedRuc) setNumeroRuc(savedRuc)
      if (savedNombre) setNombre(savedNombre)
      if (savedTelefono) setTelefono(savedTelefono)
      if (savedDni) setNumeroDni(savedDni)
      if (savedNroInterior) setNumeroInterior(savedNroInterior)
      if (savedCalle) setCalle(savedCalle)
      if (savedReferencia) setReferencia(savedReferencia)
      if(savedComprobante) setComprobante(savedComprobante)
      if(savedAddressId) setSelectedAddressId(savedAddressId)
      fetchCart()
      loadGoogleMapsScript()
    }
    catch(error) {
      console.error("Error al cargar los datos:", error)
    }
    
  }, [])

  return (
    <>
      <div
        className="py-6"
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "20px",
          paddingLeft: "60px",
        }}
      >
        <BackButton onClick={() => window.location.href ="/carrito"} />
      </div>
      <div className="content-container mx-auto py-6">
        <Heading className="text-[2rem] leading-[2.75rem] mb-4">
          Coloca tus Datos
        </Heading>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AddressForm Component - Top Left */}
          { (
            <div className="lg:col-span-2 lg:max-h-[800px] overflow-auto">
              <AddressFormParent
                nombre={nombre}
                numeroDni={numeroDni}
                numeroRuc={numeroRuc} // Pasar el estado de RUC
                ciudad={ciudadNombre}
                telefono={telefono}
                calle={calle}
                setCalle={setCalle}
                numeroInterior={numeroInterior}
                referencia={referencia}
                handleNombreChange={handleNombreChange}
                handleDniChange={handleDniChange}
                handleRucChange={handleRucChange} // Pasar el manejador de RUC
                handleTelefonoChange={handleTelefonoChange}
                handleCiudadChange={handleCiudadChange}
                handleCalleChange={handleCalleChange}
                handleNroInteriorChange={handleNroInteriorChange}
                handleReferenciaChange={handleReferenciaChange}
                handleClickMapa={() => setShowMapModal(true)}
                status={status}
                handleSubmitPadre={handleSubmitPadre}
                dniError={dniError}
                locationError={locationError}
                telefonoError={telefonoError}
                onComprobanteChange={handleComprobanteChange}
                comprobantePassed={comprobante}
                
              />
            </div>
          )}

          {/* Summary2 Component - Top Right */}
          <div className="bg-white py-6 lg:col-span-1 lg:h-full">
            {carritoState ? (
              <Summary2
                carrito={carritoState}
                handleSubmit={handleSubmitPadre}
                isFormValid={formValidity}
                showWarnings={showWarnings}
                checkFormValidity={isFormValid}
                showErrorValidacion={showErrorValidacion}
                mensajeErrorValidacion={mensajeErrorValidacion}
              />
            ) : (
              <p>Cargando carrito...</p>
            )}
          </div>

          {/* Conditional rendering of LoggedInAddresses - Bottom Left */}
          {session?.user?.id && (
            <div className="lg:col-span-2 lg:max-h-[400px] overflow-auto">
              <LoggedInAddresses
                userId={session.user.id}
                ciudadId={ciudadId}
                ciudadNombre={ciudadNombre}
                toggleAllowed={true}
                onToggleAddress={handleToggleAddress}
                selectedAddressIdPassed={selectedAddressId}
              />
            </div>
          )}
        </div>

        {/* Map modal */}
        {showMapModal && (
          <GoogleMapModal
            onSelectLocation={handleMapSelect}
            city={ciudadNombre}
            closeModal={() => setShowMapModal(false)}
            {...(selectedLocation && { location: selectedLocation })}
          />
        )}
      </div>
    </>
  )
}

export default StepDireccion

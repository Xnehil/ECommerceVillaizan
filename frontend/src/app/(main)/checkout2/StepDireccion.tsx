import { Pedido } from "types/PaquetePedido"
import { enrichLineItems, getOrSetCart } from "@modules/cart/actions"
import React, { useEffect, useRef, useState } from "react"
import Summary2 from "@modules/cart/templates/summary2"
import axios from "axios"
import { getCityCookie } from "@modules/store/actions"
import GoogleMapModal from "@components/GoogleMapsModal"
import { set } from "lodash"
import { useRouter } from 'next/navigation';

import { useSession } from 'next-auth/react';

import LoggedInAddresses from "./LoggedInAddresses";
import { Button } from "@components/Button"
import AddressFormParent from "./AddressFormParent";
import BackButton from "@components/BackButton"
import { Heading } from "@medusajs/ui"


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
  const [ciudadNombre, setCiudadNombre] = useState("")
  const [ciudadId, setCiudadId] = useState("")
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
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userNombre, setUserNombre] = useState('');
  const [userApellido, setUserApellido] = useState('');
  const [userCorreo, setUserCorreo] = useState('');
  const [userTelefono, setUserTelefono] = useState('');
  const [userId, setUserId] = useState('');
  const [userConCuenta, setUserConCuenta] = useState(false);
  const [userNroDoc, setUserNroDoc] = useState('');
  const [userPersonaId, setUserPersonaId] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const handleToggleAddress = (addressId: string | null) => {
    setSelectedAddressId(addressId);
    console.log('Selected Address ID:', addressId);
  };

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
      setCiudadNombre(city.nombre)
      setCiudadId(city.id)

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

  const handleCiudadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCiudadNombre(value);
    localStorage.setItem('ciudad', value)
  }

  const handleReferenciaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReferencia(value);
    localStorage.setItem('referencia', value); // Save to localStorage
  };
  
  const isFormValid = () => {
    if(!session?.user?.id){
      return (
        nombre.trim() !== "" &&
        numeroDni.length === 8 &&
        telefono.length === 9 &&
        calle.trim() !== "" &&
        referencia.trim() !== "" &&
        selectedLocation !== null &&
        selectedLocation?.lat !== null &&
        selectedLocation?.lng !== null
      )
    }
    else{
      return (
        nombre.trim() !== "" &&
        numeroDni.length === 8 &&
        telefono.length === 9 &&
        selectedAddressId !== null
      )
    }
  }

  const handleSubmitPadre = async () => {
    console.log("SUBMIT PADRE")
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
        longitud: "null"
      },
    }
    direccionData.ubicacion.latitud = selectedLocation?.lat.toString() || "null"
    direccionData.ubicacion.longitud = selectedLocation?.lng.toString() || "null"

    const usuarioData = {
      nombre: nombre,
      apellido: "",
      contrasena: "",
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
    let usuarioIdAux = userId
    let direccionIdAux = selectedAddressId;
    try {
      if(!session?.user?.id) {
        const usuarioResponse = await axios.post(baseUrl + "/admin/usuario", usuarioData, {
          headers: { "Content-Type": "application/json" },
        });
        const usuarioId = usuarioResponse.data.usuario.id
        usuarioIdAux = usuarioId

        const direccionResponse = await axios.post(baseUrl + "/admin/direccion", direccionData, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("Respuesta de dirección:", direccionResponse.data)
        const direccionId = direccionResponse.data.direccion.id // Ajusta según la estructura de la respuesta
        console.log("Pedido ID:", direccionId)
        direccionIdAux = direccionId
      }
      else{
        const usuarioGuardar = {
          id: userId,
          nombre: nombre,
          numeroTelefono: telefono,
          persona: {
            id: userPersonaId,
            tipoDocumento: "DNI",
            numeroDocumento: numeroDni,
          }
        }
        const response = await axios.put(baseUrl+`/admin/usuario/${userId}`, usuarioGuardar)
        console.log("Usuario actualizado:", response.data)
      }
      

      // Realizar el PUT para actualizar el pedido con los IDs
      if (carritoState?.id) {
        const pedidoId = carritoState.id
        console.log("Pedido ID:", pedidoId)
        const pedidoUpdateData = {
          direccion: direccionIdAux,
          usuario: usuarioIdAux,
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
  
            const response = await axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/usuario/${session.user.id}`);
            console.log("response", response);
            const user = response.data.usuario;
  
            if (user) {
              setUserNombre(user.nombre);
              setUserApellido(user.apellido);
              setUserCorreo(user.correo);
              setUserTelefono(user.numeroTelefono);
              setUserId(user.id);
              setUserConCuenta(user.concuenta);
              if(user.persona && user.persona.id){
                setUserPersonaId(user.persona.id);
              }
              if(user.persona && user.persona.numeroDocumento !== null){
                setNumeroDni(user.persona.numeroDocumento);
                localStorage.setItem('dni', user.persona.numeroDocumento);
              }
  
              // Set localStorage with user data
              localStorage.setItem('nombre', user.nombre);
              localStorage.setItem('telefono', user.numeroTelefono);
              

              setNombre(user.nombre);
              setTelefono(user.numeroTelefono);              
            } else {
              console.error('Failed to fetch user name');
            }
  
          } catch (error) {
            console.error('Error fetching user name:', error);
          }
        }
      }
    }
  
    fetchUserName();
  }, [session, status]);

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
    <>
      <div className="py-6" style={{ display: "flex", alignItems: "center", marginTop: "20px", paddingLeft: "60px" }}>
            <BackButton onClick={() => window.history.back()}/>
        </div>
      <div className="content-container mx-auto py-6">
        <Heading className="text-[2rem] leading-[2.75rem] mb-4">Coloca tus Datos</Heading>
    
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AddressForm Component - Top Left */}
          <div className="lg:col-span-2 lg:max-h-[800px] overflow-auto">
            <AddressFormParent
              nombre={nombre}
              numeroDni={numeroDni}
              ciudad={ciudadNombre}
              telefono={telefono}
              calle={calle}
              numeroInterior={numeroInterior}
              referencia={referencia}
              handleNombreChange={handleNombreChange}
              handleDniChange={handleDniChange}
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
            />
          </div>
    
          {/* Summary2 Component - Top Right */}
          <div className="bg-white py-6 lg:col-span-1 lg:h-full">
            {carritoState ? (
              <Summary2
                carrito={carritoState}
                handleSubmit={handleSubmitPadre}
                isFormValid={isFormValid()}
                showWarnings={showWarnings}
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
                googleMapsLoaded={googleMapsLoaded}
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
  );
  
  
  
  
  
}

export default StepDireccion

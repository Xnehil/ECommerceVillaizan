"use client";
import ButtonWhatsApp from "@components/ButtonWhatsApp";
import React, { useState } from "react";

export default function LibrodeReclamaciones() {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [distrito, setDistrito] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [descripcion, setDescripcion] = useState("");
  

  const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
  const frontUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const confirmation = window.confirm("¿Estás seguro de esto?");
    if (confirmation) {
      const texto = `
      Nombre: ${nombre}
      Distrito: ${distrito}
      Domicilio: ${domicilio}
      DNI/C.E: ${dni}
      Teléfono: ${telefono}
      Descripción del reclamo: ${descripcion}
    `;
      try {
        // Primera solicitud para el correo ingresado por el usuario
        const response1 = await fetch(baseUrl+"/admin/correo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            para: `${email}`,
            asunto: "Libro de Reclamaciones",
            texto: texto
          }),
        });

        // Segunda solicitud para el correo fijo de villaizan123@gmail.com
        const response2 = await fetch(baseUrl+"/admin/correo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            para: `paletasvillaizan@gmail.com`,
            asunto: "Libro de Reclamaciones",
            texto: texto
          }),
        });

        // Verificamos si ambas solicitudes fueron exitosas
        if (response1.ok && response2.ok) {
          alert("Correos enviados correctamente.");
          window.location.href = frontUrl ?? "/";
        } else {
          alert("Hubo un error al enviar los correos.");
        }
      } catch (error) {
        console.error("Error al enviar los correos:", error);
        alert("Hubo un problema al conectar con el servidor.");
      }
    }
  };

  

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-red-900 text-center py-4 text-white font-bold text-lg">
        LIBRO DE RECLAMACIONES
      </div>
      <div className="text-center py-4">
        <h2 className="text-lg font-bold">HOJA DE RECLAMACIÓN VIL-WEB-001-0001</h2>
        <p className="text-gray-600">
          Conforme a lo establecido en el código de la Protección y Defensa del consumidor,
          este establecimiento cuenta con un Libro de Reclamaciones a tu disposición. Registra la queja o reclamo aquí.
        </p>
        <p className="text-blue-700 underline cursor-pointer">Al presentar tu reclamo autorizas el tratamiento de sus datos personales</p>
        <p className="text-gray-600">
          Como alternativa, puedes comunicarte con nosotros a través de nuestro número de WhatsApp.
        </p>
      </div>
      <div className="flex justify-center mb-4">
        <ButtonWhatsApp nombreConsumidor={null} codigoSeguimiento={null} />
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <p><strong>Fecha:</strong> 7/10/2024</p>
        <p><strong>Razón Social:</strong> VILLAIZAN E.I.R.L.</p>
        <p><strong>RUC:</strong> 20608493604</p>
        <p><strong>Dirección Fiscal:</strong> JR. ALFONSO UGARTE NRO. 2211 DPTO. 8B URB. HUAYCO</p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Sección 1: Identificación del Consumidor */}
        <div>
          <h3 className="font-bold text-red-600">1. Identificación del Consumidor Reclamante</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
            <label>Nombre <span className="text-red-600">*</span></label>
            <input type="text" className="border p-2 w-full" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <label>Distrito <span className="text-red-600">*</span></label>
            <input type="text" className="border p-2 w-full" value={distrito} onChange={(e) => setDistrito(e.target.value)} />
          </div>
            <div>
              <label>Domicilio <span className="text-red-600">*</span></label>
            <input type="text" className="border p-2 w-full" value={domicilio} onChange={(e) => setDomicilio(e.target.value)} />
          </div>
          <div className="flex space-x-4">
              <div className="w-1/2">
                  <label>DNI/C.E</label>
              <input type="text" className="border p-2 w-full" value={dni} onChange={(e) => setDni(e.target.value)} />
              </div>
              <div className="w-1/2">
                  <label>Teléfono <span className="text-red-600">*</span></label>
              <input type="text" className="border p-2 w-full" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              </div>
          </div>
          <div>
            <label>Email <span className="text-red-600">*</span></label>
              <input
                type="email"
                className="border p-2 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Sección 2: Identificación del Bien Contratado */}
        <div>
          <h3 className="font-bold text-red-600">2. Identificación del Bien Contratado</h3>
          <div className="flex items-center space-x-6 mt-2">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Producto:</label>
              <input type="radio" name="bien" />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Servicio:</label>
              <input type="radio" name="bien" defaultChecked />
            </div>
          </div>
          <div className="mt-2">
            <label>Monto reclamado <span className="text-red-600">*</span></label>
            <input type="text" className="border p-2 w-full" />
          </div>
          <div className="mt-2">
            <label>Descripción</label>
            <textarea className="border p-2 w-full" rows={4} value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
          </div>
        </div>

        {/* Sección 3: Detalle de Reclamo */}
        <div>
          <h3 className="font-bold text-red-600">3. Detalle de Reclamo y Pedido del Consumidor</h3>
          <div className="flex items-center space-x-6 mt-2">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Reclamo:</label>
              <input type="radio" name="reclamo" />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Queja:</label>
              <input type="radio" name="reclamo" />
            </div>
          </div>
          <div className="mt-2">
            <label className="text-sm font-medium">Detalle</label>
            <textarea className="border p-2 w-full" rows={4}></textarea>
          </div>
          <div className="mt-2">
            <label className="text-sm font-medium">Adjuntar comprobante de pago:</label>
            <input type="file" className="border p-2 w-full" />
          </div>
        </div>

        {/* Sección 4: Observaciones */}
        <div>
          <h3 className="font-bold text-red-600">4. Observaciones y Acciones Adoptadas por el Proveedor</h3>
          <textarea className="border p-2 w-full" rows={4}></textarea>
        </div>

        {/* Información adicional */}
        <div className="text-sm text-gray-600">
          <p>
            RECLAMO: Disconformidad relacionada con los productos o servicios. <br />
            QUEJA: Disconformidad no relacionada a los productos o servicios; o, malestar o descontento respecto a la atención al público.
          </p>
          <p className="mt-2">
            *La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.
            <br />
            *El proveedor debe dar respuesta al reclamo o queja en un plazo no mayor a quince (15) días hábiles, el cual es improrrogable.
          </p>
        </div>
        <button
          type="submit"
          className="bg-red-900 text-white font-bold px-4 py-2 rounded mt-4"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

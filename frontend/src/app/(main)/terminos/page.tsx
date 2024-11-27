const TerminoTemplate = () => {
  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        <h1 className="text-2xl font-bold mb-4">Términos y Condiciones del Servicio de E-commerce de Paletas Villaizan (VILLAIZAN EIRL)</h1>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Introducción</h2>
        <p>Bienvenido a nuestro servicio de venta por internet de paletas artesanales. Al realizar un pedido a través de nuestra plataforma, aceptas los presentes Términos y Condiciones. Te recomendamos leerlos detenidamente.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Alcance del Servicio</h2>
        <ul className="list-disc list-inside">
          <li>Operamos exclusivamente en las ciudades de Tarapoto y Moyobamba.</li>
          <li>Los pedidos se realizan a través de nuestra página web y son entregados en la dirección proporcionada por el cliente.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Devoluciones</h2>
        <ul className="list-disc list-inside">
          <li>Las devoluciones solo se aceptan en el momento de la entrega por parte del repartidor.</li>
          <li>Si el producto presenta algún fallo, se realizará el cambio inmediato por otra paleta del mismo tipo.</li>
          <li>Una vez aceptado el producto, no se admitirán devoluciones.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Cancelaciones</h2>
        <ul className="list-disc list-inside">
          <li>Los pedidos pueden cancelarse solo hasta antes de ser verificados por el administrador.</li>
          <li>Una vez confirmado, el pedido no podrá ser cancelado.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Métodos de Pago</h2>
        <ul className="list-disc list-inside">
          <li>Actualmente, aceptamos pagos contra entrega mediante:</li>
          <ul className="list-disc list-inside ml-6">
            <li>Efectivo.</li>
            <li>Aplicaciones móviles: Yape y Plin.</li>
          </ul>
          <li>No contamos con opciones de pago por internet.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Entrega</h2>
        <ul className="list-disc list-inside">
          <li>El costo de entrega es gratuito si el pedido supera el monto mínimo establecido, el cual será informado durante el proceso de compra.</li>
          <li>En caso de no alcanzar el monto mínimo, se aplicará un costo adicional de entrega.</li>
          <li>Nos reservamos el derecho de modificar las condiciones de entrega en cualquier momento.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Medidas de Seguridad Sanitaria</h2>
        <p>Para garantizar la seguridad de todos, las entregas se realizarán en la puerta principal de la vivienda o negocio. Nuestros repartidores no ingresarán a edificios ni subirán a departamentos.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Responsabilidades del Cliente</h2>
        <ul className="list-disc list-inside">
          <li>Es responsabilidad del cliente verificar el estado del producto al momento de la entrega.</li>
          <li>En caso de inconformidad, se deberá comunicar de inmediato al repartidor para proceder con el cambio.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Modificaciones al Servicio</h2>
        <p>VILLAIZAN EIRL se reserva el derecho de modificar estos Términos y Condiciones, así como las condiciones del servicio, en cualquier momento y sin previo aviso.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Horario de Atención</h2>
        <p>Nuestro servicio de delivery está disponible de lunes a domingo, de 11:00 a.m. a 7:00 p.m. Los horarios podrán variar por razones de fuerza mayor, como condiciones climáticas o disposiciones gubernamentales.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Contacto</h2>
        <p>Para consultas o reclamos, puedes contactarnos a través de:</p>
        <ul className="list-disc list-inside">
          <li>Correo electrónico: contacto@paletasvillazian.com</li>
          <li>Teléfono: +51 987 654 321</li>
          <li>Libro de reclamaciones virtual en nuestra página web.</li>
        </ul>
        
        <p className="mt-6">Gracias por elegir Paletas Villaizan. Estamos comprometidos en ofrecerte productos de calidad y un excelente servicio.</p>
      </div>
    </div>
  )
}

export default TerminoTemplate
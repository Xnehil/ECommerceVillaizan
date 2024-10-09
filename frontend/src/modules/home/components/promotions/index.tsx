import { Button } from "@medusajs/ui";
import Link from "next/link";  // Importa el componente Link

const Promotions = () => {
  return (
    <div className="py-12 text-center">
      <h2 className="text-3xl font-bold mb-8">Disfruta de nuestras promociones</h2>
      <div className="flex justify-center gap-x-6 relative">
        {/* Promoción 1 */}
        <div className="max-w-sm">
          <img src="/images/promo1.png" alt="Descuentos en Mafaletas Tropicales" className="w-full h-auto" />
          <h3 className="text-lg font-semibold mt-4">Descuentos en Mafaletas Tropicales</h3>
        </div>

        {/* Promoción 2 */}
        <div className="max-w-sm">
          <img src="/images/promo2.png" alt="3X1 en Paletas" className="w-full h-auto" />
          <h3 className="text-lg font-semibold mt-4">3X1 en Paletas</h3>
        </div>

        {/* Promoción 3 */}
        <div className="max-w-sm">
          <img src="/images/promo3.png" alt="50% solo por hoy" className="w-full h-auto" />
          <h3 className="text-lg font-semibold mt-4">50% solo por hoy</h3>
        </div>
      </div>

      {/* Botón de Catálogo de Helados */}
      <div className="mt-8">
        <Link href="/comprar" passHref>
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold">
            Catálogo de Helados
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Promotions;

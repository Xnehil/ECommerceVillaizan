import { Pedido, Coordinate } from "@/interfaces/interfaces";

// Calcula la distancia entre dos puntos usando la fórmula de Haversine
function haversineDistance(coord1: Coordinate, coord2: Coordinate): number {
  const R = 6371; // Radio de la Tierra en km
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLng = toRadians(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(coord1.lat)) *
      Math.cos(toRadians(coord2.lat)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distancia en km
}

// Genera todas las permutaciones posibles para calcular rutas
function getPermutations<T>(array: T[]): T[][] {
  if (array.length === 1) return [array];

  const permutations: T[][] = [];
  for (let i = 0; i < array.length; i++) {
    const currentElement = array[i];
    const remainingElements = [...array.slice(0, i), ...array.slice(i + 1)];
    const remainingPermutations = getPermutations(remainingElements);

    for (const perm of remainingPermutations) {
      permutations.push([currentElement, ...perm]);
    }
  }

  return permutations;
}

// Encuentra la ruta óptima utilizando fuerza bruta
function findOptimalRouteForPedidos(
  start: Coordinate,
  pedidos: Pedido[]
): { route: Pedido[]; totalDistance: number } {
  const permutations = getPermutations(pedidos);

  let optimalRoute: Pedido[] = [];
  let minDistance = Infinity;

  permutations.forEach((perm) => {
    let currentDistance = 0;
    let prevPoint = start;

    // Calcula la distancia total para esta permutación
    perm.forEach((pedido) => {
      const pedidoCoord = {
        lat: Number(pedido.direccion?.ubicacion?.latitud),
        lng: Number(pedido.direccion?.ubicacion?.longitud),
      };
      currentDistance += haversineDistance(prevPoint, pedidoCoord);
      prevPoint = pedidoCoord;
    });

    // Regresa al punto inicial
    currentDistance += haversineDistance(prevPoint, start);

    // Actualiza la ruta óptima
    if (currentDistance < minDistance) {
      minDistance = currentDistance;
      optimalRoute = perm;
    }
  });

  // Invierte el arreglo para regresar el pedido al origen
  optimalRoute = optimalRoute.reverse();

  return { route: optimalRoute, totalDistance: minDistance };
}

// Función principal para calcular la ruta óptima
function calculateOptimalRouteForPedidos(
  startLocation: Coordinate,
  pedidos: Pedido[]
): { orderedPedidos: Pedido[]; totalDistance: number } {
  const validPedidos = pedidos.filter(
    (pedido) =>
      pedido.direccion?.ubicacion?.latitud &&
      pedido.direccion?.ubicacion?.longitud
  );

  const result = findOptimalRouteForPedidos(startLocation, validPedidos);
  return {
    orderedPedidos: result.route,
    totalDistance: result.totalDistance,
  };
}

export { haversineDistance, getPermutations, findOptimalRouteForPedidos, calculateOptimalRouteForPedidos };

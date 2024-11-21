import { Coordinate, PedidoLoc } from "@/interfaces/interfaces";


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
function findOptimalRoute(
  start: Coordinate,
  pedidos: PedidoLoc[]
): { route: PedidoLoc[]; totalDistance: number } {
  const permutations = getPermutations(pedidos);

  let optimalRoute: PedidoLoc[] = [];
  let minDistance = Infinity;

  //console.log(`Número total de permutaciones a evaluar: ${permutations.length}`);

  permutations.forEach((perm, index) => {
    let currentDistance = 0;
    let prevPoint = start;

    //console.log(`Evaluando permutación ${index + 1}/${permutations.length}`);

    // Calcula la distancia total para esta permutación
    perm.forEach((pedido) => {
      const pedidoCoord = { lat: pedido.lat, lng: pedido.lng };
      currentDistance += haversineDistance(prevPoint, pedidoCoord);
      prevPoint = pedidoCoord;
    });

    // Regresa al punto inicial
    currentDistance += haversineDistance(prevPoint, start);

    //console.log(
    //  `Permutación ${index + 1}: Distancia total = ${currentDistance.toFixed(2)} km`
    //);

    // Actualiza la ruta óptima
    if (currentDistance < minDistance) {
      //console.log(
      //  `Nueva ruta óptima encontrada en permutación ${index + 1}: Distancia = ${currentDistance.toFixed(2)} km`
      //);
      minDistance = currentDistance;
      optimalRoute = perm;
    }
  });

  //console.log("Ruta óptima final:", optimalRoute.map((pedido) => pedido.id));
  //console.log("Distancia total mínima:", minDistance.toFixed(2), "km");
  //Invertir arreglo
  optimalRoute = optimalRoute.reverse();
  return { route: optimalRoute, totalDistance: minDistance };
}


// Función para llamar con pedidoLocations
function calculateOptimalRoute(
  startLocation: Coordinate,
  pedidoLocations: { id: string; nombre: string; activo: boolean; lat: number; lng: number }[]
): { orderedPedidos: { id: string; nombre: string; activo: boolean; lat: number; lng: number }[]; totalDistance: number } {
  const result = findOptimalRoute(startLocation, pedidoLocations);
  return {
    orderedPedidos: result.route,
    totalDistance: result.totalDistance,
  };
}

export { haversineDistance, getPermutations, findOptimalRoute, calculateOptimalRoute };

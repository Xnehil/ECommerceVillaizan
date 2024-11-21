import { crossover, mutate, selectParent, shuffleArray } from "./utilities";
import { Pedido } from "@/interfaces/interfaces";

// Tipos necesarios
type Coordinate = { lat: number; lng: number };

// Fitness basado en tiempo y distancia
type FitnessResult = {
  distance: number; // Distancia total de la ruta
  duration: number; // Tiempo total de la ruta
};

// Configuración del Algoritmo Genético
const POPULATION_SIZE = 50; // Número de soluciones en la población
const GENERATIONS = 100; // Número de generaciones
const MUTATION_RATE = 0.1; // Probabilidad de mutación
const ELITE_COUNT = 5; // Número de soluciones "élite" que pasan directamente

// Cálculo de distancia y tiempo usando Google Maps
const calculatePairwiseDistances = async (
  directionsService: google.maps.DirectionsService,
  points: Coordinate[]
): Promise<FitnessResult[][]> => {
  const distances: FitnessResult[][] = Array.from({ length: points.length }, () =>
    Array.from({ length: points.length }, () => ({
      distance: Infinity,
      duration: Infinity,
    }))
  );

  const MAX_RETRIES = 5; // Número máximo de reintentos
  const BACKOFF_TIME = 2000; // Tiempo base de espera entre reintentos en milisegundos

  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        let retries = 0;
        let success = false;

        while (retries < MAX_RETRIES && !success) {
          try {
            const response = await directionsService.route({
              origin: points[i],
              destination: points[j],
              travelMode: google.maps.TravelMode.DRIVING,
            });

            if (
              response &&
              response.routes.length > 0 &&
              response.routes[0].legs.length > 0
            ) {
              const leg = response.routes[0].legs[0];
              distances[i][j] = {
                distance: leg.distance?.value || 0, // Distancia en metros
                duration: leg.duration?.value || 0, // Duración en segundos
              };
              success = true; // Marca como éxito
            }
          } catch (error: any) {
            retries++;
            if (error.status === "OVER_QUERY_LIMIT") {
              console.warn(
                `Límite de consultas alcanzado entre ${i} y ${j}. Reintentando (${retries}/${MAX_RETRIES})...`
              );
              await new Promise((resolve) =>
                setTimeout(resolve, BACKOFF_TIME * retries)
              ); // Espera antes de reintentar
            } else {
              console.error(
                `Error calculando distancia entre ${i} y ${j}:`,
                error
              );
              break; // Si no es un error de límite de consultas, detén los reintentos
            }
          }
        }

        if (!success) {
          console.error(
            `No se pudo calcular la distancia entre ${i} y ${j} después de ${MAX_RETRIES} intentos.`
          );
        }
      }
    }
  }

  return distances;
};

// Cálculo de distancia total para una ruta
const calculateTotalFitness = (
  distances: FitnessResult[][],
  routeIndices: number[]
): FitnessResult => {
  let totalDistance = 0;
  let totalDuration = 0;

  for (let i = 0; i < routeIndices.length - 1; i++) {
    const from = routeIndices[i];
    const to = routeIndices[i + 1];
    totalDistance += distances[from][to].distance;
    totalDuration += distances[from][to].duration;
  }

  // Retorno al punto inicial
  const last = routeIndices[routeIndices.length - 1];
  const first = routeIndices[0];
  totalDistance += distances[last][first].distance;
  totalDuration += distances[last][first].duration;

  return { distance: totalDistance, duration: totalDuration };
};

// Algoritmo Genético
export const geneticAlgorithm = async (
  directionsService: google.maps.DirectionsService,
  start: Coordinate,
  pedidos: Pedido[]
): Promise<Pedido[]> => {
  const points: Coordinate[] = [start, ...pedidos.map((pedido) => {
    const lat = Number(pedido.direccion?.ubicacion?.latitud);
    const lng = Number(pedido.direccion?.ubicacion?.longitud);

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error(`Pedido con id ${pedido.id} tiene coordenadas inválidas.`);
    }

    return { lat, lng };
  })];

  const distances = await calculatePairwiseDistances(directionsService, points);
  console.log("Rutas calculadas:", distances);

  // Genera una población inicial aleatoria (índices de pedidos)
  let population: number[][] = Array.from({ length: POPULATION_SIZE }, () =>
    shuffleArray([...Array(pedidos.length).keys()])
  );

  for (let generation = 0; generation < GENERATIONS; generation++) {
    // Evalúa el fitness de cada individuo
    const fitnessResults = population.map((route) => ({
      route,
      fitness: calculateTotalFitness(distances, [0, ...route]),
    }));

    // Ordena por aptitud (menor tiempo y distancia)
    fitnessResults.sort(
      (a, b) =>
        a.fitness.distance + a.fitness.duration -
        (b.fitness.distance + b.fitness.duration)
    );

    // Selecciona los mejores individuos (elitismo)
    const newPopulation: number[][] = fitnessResults
      .slice(0, ELITE_COUNT)
      .map((result) => result.route);

    // Cruza y mutación
    while (newPopulation.length < POPULATION_SIZE) {
      const parent1 = selectParent(
        fitnessResults.map((result) => ({
          route: result.route.map((index) => pedidos[index]),
          fitness: result.fitness,
        }))
      );

      const parent2 = selectParent(
        fitnessResults.map((result) => ({
          route: result.route.map((index) => pedidos[index]),
          fitness: result.fitness,
        }))
      );

      const offspring: Pedido[] = crossover(parent1, parent2);
      const mutatedOffspring = mutate(offspring, MUTATION_RATE);
      const mutatedOffspringIndices = mutatedOffspring.map((pedido) =>
        pedidos.findIndex(
          (p) =>
            p.direccion?.ubicacion?.latitud ===
              pedido.direccion?.ubicacion?.latitud &&
            p.direccion?.ubicacion?.longitud ===
              pedido.direccion?.ubicacion?.longitud
        )
      );
      newPopulation.push(mutatedOffspringIndices);
    }

    // Actualiza la población
    population = newPopulation;

    console.log(
      `Generation ${generation + 1}: Best fitness (distance + duration) = ${
        fitnessResults[0].fitness.distance + fitnessResults[0].fitness.duration
      }`
    );
  }

  // Devuelve la mejor ruta encontrada
  const bestRouteIndices = population[0];
  return bestRouteIndices.map((index: number) => pedidos[index]); // Convierte índices en objetos Pedido
};

export default geneticAlgorithm;
  
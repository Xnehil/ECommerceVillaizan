import { Loader } from "@googlemaps/js-api-loader";
import { crossover, mutate, selectParent, shuffleArray } from "./utilities";
import { PedidoLoc } from "./tspAlg";

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

// Cargar Google Maps API
const loader = new Loader({
  apiKey: process.env.GOOGLE_MAPS_API_KEY!, // Asegúrate de definir tu API Key
  version: "weekly",
});

let directionsService: google.maps.DirectionsService;

// Inicializar Google Maps Directions Service
loader
  .importLibrary("maps")
  .then(() => {
    directionsService = new google.maps.DirectionsService();
    console.log("Google Maps DirectionsService cargado correctamente.");
  })
  .catch((error) => {
    console.error("Error al cargar Google Maps:", error);
  });

// Cálculo de distancia y tiempo usando Google Maps
const calculateDistanceAndTime = async (
  origin: Coordinate,
  destinations: PedidoLoc[]
): Promise<FitnessResult> => {
  try {
    let totalDistance = 0;
    let totalDuration = 0;
    let lastPoint = origin;

    for (const destination of destinations) {
      const response = await directionsService.route({
        origin: lastPoint,
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: google.maps.TravelMode.DRIVING,
      });

      if (
        response &&
        response.routes.length > 0 &&
        response.routes[0].legs.length > 0
      ) {
        const leg = response.routes[0].legs[0];
        totalDistance += leg.distance?.value || 0; // Distancia en metros
        totalDuration += leg.duration?.value || 0; // Duración en segundos
        lastPoint = { lat: destination.lat, lng: destination.lng };
      }
    }

    return {
      distance: totalDistance,
      duration: totalDuration,
    };
  } catch (error) {
    console.error("Error calculating distance and time:", error);
    throw error;
  }
};

// Algoritmo Genético
export const geneticAlgorithm = async (
  start: Coordinate,
  pedidos: PedidoLoc[]
): Promise<PedidoLoc[]> => {
  // Genera una población inicial aleatoria
  let population: PedidoLoc[][] = Array.from({ length: POPULATION_SIZE }, () =>
    shuffleArray([...pedidos])
  );

  for (let generation = 0; generation < GENERATIONS; generation++) {
    // Evalúa el fitness de cada individuo
    const fitnessResults = await Promise.all(
      population.map(async (route) => ({
        route,
        fitness: await calculateDistanceAndTime(start, route),
      }))
    );

    // Ordena por aptitud (menor tiempo y distancia)
    fitnessResults.sort(
      (a, b) =>
        a.fitness.duration +
        a.fitness.distance -
        (b.fitness.duration + b.fitness.distance)
    );

    // Selecciona los mejores individuos (elitismo)
    const newPopulation: PedidoLoc[][] = fitnessResults
      .slice(0, ELITE_COUNT)
      .map((result) => result.route);

    // Cruza y mutación
    while (newPopulation.length < POPULATION_SIZE) {
      const parent1 = selectParent(fitnessResults);
      const parent2 = selectParent(fitnessResults);
      const offspring = crossover(parent1, parent2);
      newPopulation.push(mutate(offspring, MUTATION_RATE));
    }

    // Actualiza la población
    population = newPopulation;

    console.log(
      `Generation ${generation + 1}: Best fitness = ${
        fitnessResults[0].fitness.duration + fitnessResults[0].fitness.distance
      }`
    );
  }

  // Devuelve la mejor ruta encontrada
  return population[0];
};

import { shuffleArray, selectParent, crossover, mutate } from "./utilities";
import { Pedido } from "@/interfaces/interfaces";

// Tipos necesarios
type Coordinate = { lat: number; lng: number };

// Fitness basado en tiempo y distancia
type FitnessResult = {
  distance: number; // Distancia total de la ruta
  duration: number; // Tiempo total de la ruta
  combined: number; // Suma de distancia y duración
};

// Configuración del Algoritmo Genético
const POPULATION_SIZE = 100; // Tamaño de la población
const GENERATIONS = 200; // Número de generaciones
const MUTATION_RATE = 0.05; // Probabilidad de mutación
const ELITE_COUNT = Math.floor(POPULATION_SIZE * 0.1); // Elitismo (10% de la población)

// Cálculo de distancia y tiempo usando Google Maps
const calculatePairwiseDistances = async (
  directionsService: google.maps.DirectionsService,
  points: Coordinate[]
): Promise<FitnessResult[][]> => {
  const distances: FitnessResult[][] = Array.from({ length: points.length }, () =>
    Array.from({ length: points.length }, () => ({
      distance: Infinity,
      duration: Infinity,
      combined: Infinity,
    }))
  );

  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
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
              combined: (leg.distance?.value || 0) + (leg.duration?.value || 0), // Suma de distancia y duración
            };
          }
        } catch (error) {
          console.error(`Error calculando distancia entre ${i} y ${j}:`, error);
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

  return { distance: totalDistance, duration: totalDuration, combined: totalDistance + totalDuration };
};

// Selección por torneo
const selectParentTournament = (fitnessResults: { route: number[]; fitness: FitnessResult }[]): number[] => {
  const tournamentSize = 5;
  const tournament = shuffleArray(fitnessResults).slice(0, tournamentSize);
  tournament.sort((a, b) => a.fitness.combined - b.fitness.combined);
  return tournament[0].route;
};

// Algoritmo Genético
export const geneticAlgorithm = async (
  directionsService: google.maps.DirectionsService,
  start: Coordinate,
  pedidos: Pedido[]
): Promise<Pedido[]> => {
  const points = [start, ...pedidos.map(p => {
    if (p.direccion && p.direccion.ubicacion) {
      return { lat: +p.direccion.ubicacion.latitud, lng: +p.direccion.ubicacion.longitud };
    }
    return { lat: 0, lng: 0 }; // Default value or handle the error as needed
  })];
  const distances = await calculatePairwiseDistances(directionsService, points);

  let population = Array.from({ length: POPULATION_SIZE }, () =>
    shuffleArray([...Array(pedidos.length).keys()])
  );

  for (let generation = 0; generation < GENERATIONS; generation++) {
    const fitnessResults = population.map(route => ({
      route,
      fitness: calculateTotalFitness(distances, [0, ...route]),
    }));
    fitnessResults.sort((a, b) => a.fitness.distance - b.fitness.distance);

    const newPopulation = fitnessResults.slice(0, ELITE_COUNT).map(r => r.route);

    while (newPopulation.length < POPULATION_SIZE) {
      const parent1 = selectParentTournament(fitnessResults);
      const parent2 = selectParentTournament(fitnessResults);

      const offspring = crossover(parent1.map(i => pedidos[i]), parent2.map(i => pedidos[i]));
      const mutatedOffspring = mutate(offspring, MUTATION_RATE);
      newPopulation.push(mutatedOffspring.map(p => pedidos.indexOf(p)));
    }

    population = newPopulation;

    console.log(`Generation ${generation + 1}: Best fitness = ${fitnessResults[0].fitness.combined}`);
  }

  const bestRouteIndices = population[0];
  return bestRouteIndices.map(i => pedidos[i]);
};

export default geneticAlgorithm;
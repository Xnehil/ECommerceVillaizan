import { Pedido } from "@/interfaces/interfaces";

type FitnessResult = {
  distance: number; // Distancia total de la ruta
  duration: number; // Tiempo total de la ruta
};

/**
 * Mezcla un arreglo aleatoriamente
 */
const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/**
 * Selecciona un padre para el algoritmo genético basado en fitness
 */
const selectParent = (
  fitnessResults: { route: Pedido[]; fitness: FitnessResult }[]
): Pedido[] => {
  const totalFitness = fitnessResults.reduce(
    (sum, result) =>
      sum + 1 / (result.fitness.duration + result.fitness.distance),
    0
  );

  let randomValue = Math.random() * totalFitness;

  for (const result of fitnessResults) {
    randomValue -=
      1 / (result.fitness.duration + result.fitness.distance);
    if (randomValue <= 0) {
      return result.route;
    }
  }

  return fitnessResults[0].route; // Retorna la mejor ruta como fallback
};

/**
 * Realiza el cruce entre dos padres para generar un hijo
 */
const crossover = (parent1: Pedido[], parent2: Pedido[]): Pedido[] => {
  const start = Math.floor(Math.random() * parent1.length);
  const end = Math.floor(Math.random() * (parent1.length - start) + start);
  const offspring = parent1.slice(start, end);

  parent2.forEach((pedido) => {
    if (!offspring.some((p) => p.id === pedido.id)) {
      offspring.push(pedido);
    }
  });

  return offspring;
};

/**
 * Realiza una mutación aleatoria en una ruta
 */
const mutate = (route: Pedido[], mutationRate: number): Pedido[] => {
  if (Math.random() > mutationRate) return route;

  const index1 = Math.floor(Math.random() * route.length);
  const index2 = Math.floor(Math.random() * route.length);
  [route[index1], route[index2]] = [route[index2], route[index1]];

  return route;
};

export { shuffleArray, selectParent, crossover, mutate };

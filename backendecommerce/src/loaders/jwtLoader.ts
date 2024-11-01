// src/loaders/my-loader.ts

import { AwilixContainer, asFunction } from 'awilix';
import { JwtService, JwtModuleOptions } from '@nestjs/jwt';

/**
 * Registers custom services in the container.
 *
 * @param container The container in which the registrations are made
 * @param config The options of the plugin or the entire config object
 */
export default (container: AwilixContainer, config: Record<string, unknown>): void => {
  // Define your JwtModuleOptions
  console.log("Registering jwtService in container");
  const jwtOptions: JwtModuleOptions = {
    secret: 'lñmk90123ngjnasd09', // Replace with your actual secret
    signOptions: {
      expiresIn: '1h', // Set token expiration time
      // You can add other jwt.SignOptions properties here
    },
  };

  // Register JwtService in the container with a factory function
  container.register({
    jwtService: asFunction(() => new JwtService(jwtOptions)).singleton(),
  });

  // You can add additional custom registrations here if needed
};

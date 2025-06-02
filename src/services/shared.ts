/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * Shared Services Module
 *
 * This module maintains singleton instances of services that should be shared
 * across the application to ensure consistent state.
 */

import { createReworkServices, ReworkServices } from './rework/index.js';
import config from '../config.js';
import { Logger } from '../logger.js';

const logger = new Logger('SharedServices');

// Singleton instances
let reworkServicesInstance: ReworkServices | null = null;

/**
 * Get or create the ClickUp services instance
 */
function getReworkServices(): ReworkServices {
  if (!reworkServicesInstance) {
    logger.info('Creating shared ClickUp services singleton');

    // Create the services instance
    reworkServicesInstance = createReworkServices({
      apiKey: config.reworkApiKey,
      password: config.reworkPassword,
    });

    // Log what services were initialized with more clarity
    logger.info('Services initialization complete', {
      services: Object.keys(reworkServicesInstance).join(', '),
      password: config.reworkPassword,
    });
  }
  return reworkServicesInstance;
}

// Create a single instance of ClickUp services to be shared
export const reworkServices = getReworkServices();

// Export individual services for convenience
export const {
  task: taskService,
} = reworkServices;

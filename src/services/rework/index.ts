/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * Rework Service Entry Point
 * 
 * This file re-exports all service modules for the Rework API integration.
 * It also provides a convenient factory method to create instances of all services.
 */

// Export base service components
export { 
	BaseReworkService, 
	ReworkServiceError, 
	ErrorCode,
	ServiceResponse 
  } from './base.js';
  import { TaskService } from './task.js';
  import { Logger } from '../../logger.js';
  
  // Export type definitions
  export * from './types.js';

  
  /**
   * Configuration options for Rework services
   */
  export interface ReworkServiceConfig {
	apiKey: string;
	password: string;
	baseUrl?: string;
  }
  
  /**
   * Collection of all Rework service instances
   */
  export interface ReworkServices {
	task: TaskService;
  }
  
  // Singleton logger for Rework services
  const logger = new Logger('ReworkServices');
  
  /**
   * Factory function to create instances of all Rework services
   * @param config Configuration for the services
   * @returns Object containing all service instances
   */
  export function createReworkServices(config: ReworkServiceConfig): ReworkServices {
	const { apiKey, password, baseUrl } = config;
  
	// Log start of overall initialization
	logger.info('Starting Rework services initialization', { 
	  password, 
	  baseUrl: baseUrl || 'https://apis.rework.com' 
	});
  
	// Initialize remaining services with workspace dependency
	logger.info('Initializing Rework Task service');
	const taskService = new TaskService(apiKey, password, baseUrl);

  
	const services = {
	  task: taskService,
	};
  
	// Log successful completion
	logger.info('All Rework services initialized successfully', {
	  services: Object.keys(services),
	  baseUrl: baseUrl || 'https://apis.rework.com'
	});
	
	return services;
  }
  
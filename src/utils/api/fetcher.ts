/**
 * Rework API Fetcher utility
 * 
 * A reusable utility for making API calls to the Rework API with shared credentials
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';
import config from '../../config.js';

export interface ReworkRequestOptions {
  endpoint: string;
  method?: 'get' | 'post' | 'put' | 'delete';
  params?: Record<string, any>;
  data?: Record<string, any>;
  headers?: Record<string, string>;
  includeAuth?: boolean;
}

export class ReworkFetcher {
  protected baseUrl: string = 'https://apis.rework.com';
  protected accessToken: string;
  protected password: string;

  constructor() {
    this.accessToken = config.reworkProjectAccessToken;
    this.password = config.reworkProjectPassword;
    
    if (!this.accessToken || !this.password) {
      throw new Error('Rework API credentials not found in configuration');
    }
  }

  /**
   * Make a request to the Rework API
   * 
   * @param options Request options
   * @returns Promise with the API response
   */
  public async request<T = any>(options: ReworkRequestOptions): Promise<T> {
    const {
      endpoint,
      method = 'post',
      params = {},
      data = {},
      headers = {},
      includeAuth = true
    } = options;

    // Add authentication to data if needed
    const requestData = { ...data };
    if (includeAuth) {
      requestData.access_token = this.accessToken;
      requestData.password = this.password;
    }

    const requestConfig: AxiosRequestConfig = {
      method,
      url: `${this.baseUrl}${endpoint}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...headers
      },
      params,
      data: qs.stringify(requestData),
      maxBodyLength: Infinity
    };

    try {
      const response: AxiosResponse<T> = await axios.request(requestConfig);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`Rework API Error (${error.response.status}): ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }

  /**
   * List tasks with optional filters
   * 
   * @param boardId Board ID
   * @param options Additional options like deadline_from, etc.
   * @returns Promise with the task list response
   */
  public async listTasks(boardId: string, options: Record<string, any> = {}): Promise<any> {
    return this.request({
      endpoint: '/projects/v1/task/list',
      data: {
        board_id: boardId,
        ...options
      }
    });
  }

  /**
   * Create a new task
   * 
   * @param taskData Task data including board_id and name
   * @returns Promise with the created task
   */
  public async createTask(taskData: Record<string, any>): Promise<any> {
    return this.request({
      endpoint: '/projects/v1/task/create',
      data: taskData
    });
  }

  /**
   * Update an existing task
   * 
   * @param taskId Task ID
   * @param taskData Task data to update
   * @returns Promise with the updated task
   */
  public async updateTask(taskId: string, taskData: Record<string, any>): Promise<any> {
    return this.request({
      endpoint: '/projects/v1/task/update',
      data: {
        task_id: taskId,
        ...taskData
      }
    });
  }

  /**
   * Get task details
   * 
   * @param taskId Task ID
   * @returns Promise with the task details
   */
  public async getTask(taskId: string): Promise<any> {
    return this.request({
      endpoint: '/projects/v1/task/get',
      data: {
        task_id: taskId
      }
    });
  }

  /**
   * Generic method to make any API call to Rework
   * 
   * @param endpoint API endpoint (e.g., '/projects/v1/task/list')
   * @param data Request data
   * @returns Promise with the API response
   */
  public async call<T = any>(endpoint: string, data: Record<string, any> = {}): Promise<T> {
    return this.request<T>({
      endpoint,
      data
    });
  }
}

/**
 * ReworkAccountFetcher utility
 * 
 * Similar to ReworkFetcher but uses account credentials instead of project credentials
 */
export class ReworkAccountFetcher extends ReworkFetcher {
  constructor() {
    super();
    this.accessToken = config.reworkAccountAccessToken;
    this.password = config.reworkAccountPassword;
    
    if (!this.accessToken || !this.password) {
      throw new Error('Rework Account API credentials not found in configuration');
    }
  }
}

// Export singleton instances for easy import and use
export const reworkProjectFetcher = new ReworkFetcher();
export const reworkAccountFetcher = new ReworkAccountFetcher();

// Export default for convenience
export default reworkProjectFetcher;

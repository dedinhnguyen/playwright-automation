import { APIRequestContext, APIResponse } from '@playwright/test';
import logger from '@utils/Logger';

export class BaseAPI {
  protected request: APIRequestContext;
  protected baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  async get(endpoint: string, headers?: { [key: string]: string }): Promise<APIResponse> {
    logger.info(`GET Request to: ${this.baseUrl}${endpoint}`);
    return await this.request.get(`${this.baseUrl}${endpoint}`, { headers });
  }

  async post(endpoint: string, data: any, headers?: { [key: string]: string }): Promise<APIResponse> {
    logger.info(`POST Request to: ${this.baseUrl}${endpoint} with data: ${JSON.stringify(data)}`);
    return await this.request.post(`${this.baseUrl}${endpoint}`, {
      data,
      headers,
    });
  }

  async put(endpoint: string, data: any, headers?: { [key: string]: string }): Promise<APIResponse> {
    logger.info(`PUT Request to: ${this.baseUrl}${endpoint} with data: ${JSON.stringify(data)}`);
    return await this.request.put(`${this.baseUrl}${endpoint}`, {
      data,
      headers,
    });
  }

  async delete(endpoint: string, headers?: { [key: string]: string }): Promise<APIResponse> {
    logger.info(`DELETE Request to: ${this.baseUrl}${endpoint}`);
    return await this.request.delete(`${this.baseUrl}${endpoint}`, { headers });
  }
}

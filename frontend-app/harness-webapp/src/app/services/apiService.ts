// src/app/services/apiService.ts
import axios from 'axios';
import { ConfigService } from '@/app/services/configService';

export class ApiService {
  private APIUrl: string;

  constructor() {
    const configService = new ConfigService();
    this.APIUrl = configService.getApiUrl();
  }

  // Fetch execution details (used for pod information)
  async getExecutionDetails() {
    const response = await axios.get(`${this.APIUrl}/deploy/execution`);
    return response.data;
  }

  // Fetch pod list with a query parameter
  async getPods(query: string = '') {
    const response = await axios.get(`${this.APIUrl}/deploy/pods`, {
      params: { query }
    });
    return response.data;
  }

  // Simulate pod data generation based on execution details
  async generateEntry(name: string) {
    const executionData = await this.getExecutionDetails();
    // Simulate a pod-like response using execution data
    return {
      name: executionData.deployment_type === 'canary' ? 'canary' : name,
      created_at: Math.floor(Date.now() / 1000), // Current timestamp in seconds
      service_name: executionData.service_name,
      last_execution_id: executionData.last_execution_id,
      application_version: executionData.application_version
    };
  }
}

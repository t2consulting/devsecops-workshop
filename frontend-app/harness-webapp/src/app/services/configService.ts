// src/app/services/configService.ts
export class ConfigService {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  private sdkKey = process.env.NEXT_PUBLIC_SDK_KEY || 'your-sdk-key';

  getApiUrl(): string {
    return this.apiUrl;
  }

  getSDKKey(): string {
    return this.sdkKey;
  }
}
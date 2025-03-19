// src/app/services/harnessFFService.ts
import { SplitFactory } from '@splitsoftware/splitio';
import { IBrowserClient } from '@splitsoftware/splitio/types/splitio';
import { ConfigService } from '@/app/services/configService';

export class HarnessFfService {
  private flagVariation: string = 'off';
  private sdkKey: string;
  private client: IBrowserClient | null = null;
  private userKey: string = 'webinar';

  constructor() {
    const configService = new ConfigService();
    this.sdkKey = configService.getSDKKey();
    this.initializeSDK();
  }

  async initializeSDK() {
    const factory = SplitFactory({
      core: {
        authorizationKey: this.sdkKey,
        key: this.userKey,
      },
      startup: {
        readyTimeout: 1.5,
      },
    });

    this.client = factory.client();

    if (this.client) {
      this.client.on(this.client.Event.SDK_READY, () => {
        if (this.client) {
          this.flagVariation = this.client.getTreatment('webinarff');
          console.log('Split SDK Ready, initial treatment:', this.flagVariation);
        }
      });

      this.client.on(this.client.Event.SDK_UPDATE, () => {
        if (this.client) {
          const newTreatment = this.client.getTreatment('webinarff');
          if (newTreatment !== this.flagVariation) {
            this.flagVariation = newTreatment;
            console.log('Feature flag updated:', this.flagVariation);
          }
        }
      });

      this.client.on(this.client.Event.SDK_READY_TIMED_OUT, () => {
        console.error('Split SDK failed to load within timeout');
      });
    }
  }

  variationFF(): string {
    return this.flagVariation;
  }

  destroy() {
    if (this.client) {
      this.client.destroy();
    }
  }
}

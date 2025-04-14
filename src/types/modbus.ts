
export interface ConnectionStatusOptions {
  host: string;
  port: number;
  timeout?: number;
  retries?: number;
}

export interface ConnectionStatusResult {
  connected: boolean;
  message: string;
  latency?: number;
}

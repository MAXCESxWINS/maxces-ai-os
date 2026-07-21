export type BrowserEngineStatus = 'Idle' | 'Navigating' | 'Inspecting' | 'Closed' | 'Error';

export interface BrowserConsoleLog {
  timestamp: string;
  type: 'log' | 'warn' | 'error' | 'info';
  text: string;
}

export interface NetworkLogItem {
  timestamp: string;
  url: string;
  method: string;
  status: number;
  responseSize?: number;
}

export interface DOMSnapshot {
  url: string;
  title: string;
  htmlContent: string;
  interactiveElementCount: number;
  headingTree: string[];
}

export interface ScreenshotCaptureResult {
  url: string;
  viewport: 'Desktop' | 'Tablet' | 'Mobile';
  base64DataUrl?: string;
  status: 'Architecture Ready' | 'Captured' | 'Failed';
  message: string;
}

export interface BrowserSession {
  sessionId: string;
  status: BrowserEngineStatus;
  currentUrl?: string;
  consoleLogs: BrowserConsoleLog[];
  networkLogs: NetworkLogItem[];
  playwrightBridgeAvailable: boolean;
}

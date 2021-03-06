declare global {
  interface Window {
      ipcRenderer: MyIpcRenderer,
  }
}

export interface MyIpcRenderer {
  invoke(channel: string, ...args: any[]): Promise<any>;
  send(channel: string, ...args: any[]): void;
  
  /** @return A function that removes this listener. */
  on(channel: string, listener: (...args: any[]) => void): () => void;
}
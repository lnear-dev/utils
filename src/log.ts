const KEY = Symbol.for('app-tools::log::1.x');

interface GlobalLogState {
  setDebug: (value: boolean) => void;
  debug: boolean;
}

(globalThis as unknown as Record<typeof KEY, GlobalLogState>)[KEY] = { 
  setDebug, 
  debug: new URL(window.location.href).searchParams.has('app-tools-debug')
};

/**
 * @param {boolean} value 
 */
export function setDebug(value: boolean) {
  (globalThis as unknown as Record<typeof KEY, GlobalLogState>)[KEY].debug = !!value;
}

/**
 * @returns {boolean}
 */
export function getDebug(): boolean {
  return (globalThis as unknown as Record<typeof KEY, GlobalLogState>)[KEY].debug;
}

/**
 * @param {string} action - describing the action
 * @param {*} [data] - any js value
 */
export function log(action: string, data?: unknown): void {
  if((globalThis as unknown as Record<typeof KEY, GlobalLogState>)[KEY].debug) {
    console.groupCollapsed(`[app-tools] ${action}`);
    if(data) {
      console.log(data);
    }
    console.groupEnd();
  }
}

/**
 * @param {string} title 
 * @returns {(action: string, data?: any) => void}
 */
export function createLogger(title: string): (action: string, data?: unknown) => void {
  return (action, data) => {
    log(`${title}: ${action}`, data);
  }
}

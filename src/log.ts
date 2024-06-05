const KEY = Symbol.for('lnear::log::1.x');
interface GlobalLogState {
  setDebug: (value: boolean) => void;
  debug: boolean;
}

export const setDebug = (value: boolean): void => {
  (globalThis as unknown as Record<typeof KEY, GlobalLogState>)[KEY].debug = !!value;
};
export const getDebug = (): boolean => (globalThis as unknown as Record<typeof KEY, GlobalLogState>)[KEY].debug;

(globalThis as unknown as Record<typeof KEY, GlobalLogState>)[KEY] = {
  setDebug,
  debug: new URL(window.location.href).searchParams.has('lnear-debug')
};

export function log(action: string, data?: unknown): void {
  if ((globalThis as unknown as Record<typeof KEY, GlobalLogState>)[KEY].debug) {
    console.groupCollapsed(`[lnear] ${action}`);
    if (data) console.log(data);
    console.groupEnd();
  }
}
export const createLogger = (title: string): (action: string, data?: unknown) => void => {
  return (action, data) => { log(`${title}::${action}`, data); }
}

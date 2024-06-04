export function debounce<T extends unknown[]>(
  f: (...args: T) => void,
  scheduleTask: (task: () => void) => any,
  cancelTask: (task: any) => void
) {
  let task: any;

  return (...args: T) => {
    cancelTask(task);
    task = scheduleTask(() => {
      task = null;
      f(...args);
    });
  };
}

export const debounceAtTimeout = <T extends unknown[]>(f: (...args: T) => void, ms: number) =>
  debounce(f, (task) => setTimeout(task, ms), clearTimeout);

export const debounceAtFrame = <T extends unknown[]>(f: (...args: T) => void) =>
  debounce(f, requestAnimationFrame, cancelAnimationFrame);

/**
 * @returns {Promise<number>}
 */
export const onePaint = (): Promise<number> => new Promise((r) => requestAnimationFrame(r));

/**
 * @param {HTMLElement} element
 * @returns {Promise<PromiseSettledResult<Animation>[]>}
 */
export const animationsComplete = (element: HTMLElement): Promise<PromiseSettledResult<Animation>[]> =>
  Promise.allSettled(element.getAnimations().map((animation) => animation.finished));

/**
 * @param {() => void} f
 * @param {number} ms
 * @param {{
 *  signal?: AbortSignal
 * }} options
 */
export function setAbortableTimeout(f: () => void, ms: number, { signal }: { signal?: AbortSignal }) {
  let t: ReturnType<typeof setTimeout>;
  if (!signal?.aborted) {
    t = setTimeout(f, ms);
  }
  signal?.addEventListener('abort', () => clearTimeout(t), { once: true });
}

/**
 * @param {() => boolean} predicate
 * @param {{
 *  timeout?: number,
 *  message?: string,
 *  interval?: number
 * }} options
 * @returns {Promise<void>}
 */
export function waitUntil(
  predicate: () => boolean | Promise<boolean>,
  options: { timeout?: number; message?: string; interval?: number } = {}
): Promise<void> {
  const { timeout = 1000, message = `waitUntil timed out after ${timeout}ms`, interval = 50 } = options;

  return new Promise((resolve, reject) => {
    let timeoutId: ReturnType<typeof setTimeout>;

    setTimeout(() => {
      clearTimeout(timeoutId);
      reject(new Error(message));
    }, timeout);

    async function nextInterval() {
      try {
        if (await predicate()) {
          resolve();
        } else {
          timeoutId = setTimeout(() => {
            nextInterval();
          }, interval);
        }
      } catch (error) {
        reject(error);
      }
    }
    nextInterval();
  });
}

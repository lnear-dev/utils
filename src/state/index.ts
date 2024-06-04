import { createLogger } from "../log.js";
const log = createLogger("state");

/**
 * `'state-changed'` event
 * @example this.dispatchEvent(new StateChangedEvent(data));
 */
export class StateChangedEvent extends Event {
  state: {};
  constructor(state = {}) {
    super("state-changed");
    this.state = state;
  }
}

export class State extends EventTarget {
  #state: any;

  constructor(initialState: {}) {
    super();
    this.#state = initialState;
  }

  setState(state: (arg0: any) => any) {
    log("Before: ", this.#state);
    this.#state = typeof state === "function" ? state?.(this.#state) : state;
    log("After: ", this.#state);
    this.dispatchEvent(new StateChangedEvent(this.#state));
  }

  getState() {
    return this.#state;
  }
}

export const state = new State({});

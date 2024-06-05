/**
 * Syntax sugar to conditionally render a template
 *
 * @param expression boolean expression to determine which value to return
 * @param trueValue function to invoke if expression is truthy
 * @param falseValue optional function to invoke if expression is falsy
 * @returns the result of invoking either trueValue or falseValue, or undefined if falseValue is not provided and the expression is falsy
 */
export function when(
  expression: boolean,
  trueValue: () => any,
  falseValue?: () => any
): any | undefined {
  return expression ? trueValue() : falseValue ? falseValue() : undefined;
}

export { waitUntil, debounce, setAbortableTimeout } from "./async";
export { media } from "./media";
export * from "./log";
export * from "./async";
export * from "./CONSTANTS";
export { createService } from "./Service";

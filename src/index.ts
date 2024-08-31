/**
 * Typewriter
 *
 * Provides typewriter effect for HTML elements.
 */

import parseOptions from "./parse";
import { Typewriter } from "./typewriter";

const TYPEWRITER_ATTRIBUTE = "data-typewriter";
const OPTIONS: Option[] = [
  {
    name: "truncateFromWordIndex",
    attribute: "data-typewriter-from",
    type: "number",
    default: 20,
  },
  {
    name: "delay",
    attribute: "data-typewriter-delay",
    type: "number",
    default: 100,
  },
  {
    name: "truncationText",
    attribute: "data-typewriter-button-text",
    type: "string",
    default: "... more",
  },
];

initializeTypewriters();

function initializeTypewriters() {
  document.querySelectorAll(`[${TYPEWRITER_ATTRIBUTE}]`).forEach((el) => {
    const options = parseOptions(el as HTMLElement, OPTIONS);
    new Typewriter(el as HTMLElement, options);
  });
}

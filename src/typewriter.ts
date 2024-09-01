import { tokenizeHTML, getTokensLength, typist } from "./tokens";

export class Typewriter {
  private options: TypewriterOptions;
  private el: HTMLElement;
  private actions: Generator<TypewriterAction>;
  private wordsUsed: number;
  private currentContainer: HTMLElement;

  constructor(el: HTMLElement, options: TypewriterOptions) {
    this.options = options;
    this.el = el;
    const tokens = tokenizeHTML(el);
    if (getTokensLength(tokens) <= this.options.truncateFromWordIndex) {
      return;
    }
    this.actions = typist(tokens);
    this.el.innerHTML = "";
    this.wordsUsed = 0;
    this.currentContainer = el;
    this.type(this.options.truncateFromWordIndex, 0, () => {
      const button = document.createElement("span");
      button.classList.add("typewriter-more-button");
      const trunc = document.createTextNode(this.options.truncationText);
      button.appendChild(trunc);
      button.addEventListener("click", () => {
        button.remove();
        this.type(Infinity, options.delay);
      });
      this.currentContainer.appendChild(button);
    });
  }

  async type(words: number, delay: number, finish: () => void = () => {}) {
    while (this.wordsUsed < words) {
      const action = this.actions.next().value;
      if (action === undefined) break;
      if (action.type === "append-word") {
        this.currentContainer.appendChild(
          document.createTextNode(action.value)
        );
        this.wordsUsed++;
      } else if (action.type === "append-element") {
        const newElement = document.createElement(action.value);
        newElement.className = action.className;
        this.currentContainer.appendChild(newElement);
        this.currentContainer = newElement;
      } else if (action.type === "end") {
        this.currentContainer = this.currentContainer
          .parentElement as HTMLElement;
      }
      await sleep(delay);
    }
    finish();
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

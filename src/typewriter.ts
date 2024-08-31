/**
<p data-typewriter='{"truncateFromWordIndex": "10"}' class="prose">
  Morbi fringilla <strong>convallis</strong> sapien, id pulvinar odio volutpat. Hi omnes lingua, <em>institutis</em>, legibus inter se differunt. Non equidem invideo, miror magis posuere velit aliquet. Quid securi etiam tamquam eu <code>fugiat</code> nulla pariatur. Inmensae subtilitatis, obscuris et malesuada fames. Fictum, deserunt mollit anim laborum astutumque!
</div>
*/

interface TypewriterWordNode {
  type: "word";
  value: string;
}

interface TypewriterSentenceNode {
  type: "sentence";
  children: TypewriterWordNode[];
}

interface TypewriterElementNode {
  type: "element";
  tagName: string;
  className: string;
  children: TypewriterNode[];
}

type TypewriterNode =
  | TypewriterWordNode
  | TypewriterElementNode
  | TypewriterSentenceNode;

interface TypewriterAction {
  type: "append-word" | "append-element" | "end";
  value: string;
  className?: string;
}

interface TypewriterOptions {
  truncateFromWordIndex?: number;
  speed?: number;
  truncationText?: string;
}

function typewriter() {
  const typewriterElements = document.querySelectorAll("[data-typewriter]");
  typewriterElements.forEach((el) => {
    const options = JSON.parse(el.getAttribute("data-typewriter"));
    new Typewriter(el, options);
  });
}

function tokenizeHTML(HTML: HTMLElement): TypewriterElementNode {
  // We return one single TypewriterElementNode which is essentially a
  // basic representation of a DOM element.
  return {
    type: "element",
    tagName: HTML.nodeName,
    className: HTML.className,
    children: Array.from(HTML.childNodes).map((node) => {
      // With all the children of the element...
      if (node.nodeType === 3) {
        // if it's a text node...
        return {
          type: "sentence",
          // ...we split the text into words...
          children: node.textContent
            ?.split(" ")
            .filter((word) => word !== "") // ...and filter out empty strings.
            .map((word) => {
              return { type: "word", value: word };
            }),
        };
      } else if (node.nodeType === 1) {
        // if it's an element node...
        return tokenizeHTML(node as HTMLElement); // ...we recursively tokenize it.
      }
    }),
  };
}

function getTokensLength(tokens: TypewriterElementNode): number {
  let count = 0;
  console.log(tokens, tokens.children);
  for (const node of tokens.children) {
    console.log(node);
    // if (node == undefined) continue;
    if (node.type === "sentence") {
      for (const word of node.children) {
        /*
        This is a hack, this should probably be dealt with when tokenizing as there will likely be an edge case where this won't work. However, this fix worked for one edge case I had where newlines at the end of a sentence caused the "more" option to appear, but clicking on it did nothing because all that was added were two newlines.
        */
        if (word.value.trim() !== "") count++;
      }
    } else if (node.type === "element") {
      count += getTokensLength(node);
    }
  }
  return count;
}

function* streamActions(
  tokens: TypewriterElementNode
): Generator<TypewriterAction> {
  // Create a stream of tokens by yielding actions to perform on the DOM.

  // We iterate over the children of the TypewriterElementNode.
  for (const node of tokens.children) {
    if (node == undefined) continue;
    if (node.type === "element") {
      yield {
        type: "append-element",
        value: node.tagName,
        className: node.className,
      };
      yield* streamActions(node);
    } else if (node.type === "sentence") {
      // If the token is a sentence, we iterate over its children.
      for (const word of node.children) {
        // For each word, we yield an action to append it to the DOM.
        yield {
          type: "append-word",
          value: word.value,
        };
      }
    }
  }
  // At the end of a node, we yield an action to end the current element.
  yield { type: "end", value: "" };
}

function defaultOptions(): TypewriterOptions {
  return {
    truncateFromWordIndex: 20,
    speed: 100,
    truncationText: "... more",
  };
}

class Typewriter {
  private options: TypewriterOptions;
  private el: HTMLElement;
  private actions: Generator<TypewriterAction>;
  private wordsUsed: number;
  private currentContainer: HTMLElement;

  constructor(el: HTMLElement, options: TypewriterOptions) {
    this.options = { ...defaultOptions(), ...options };
    this.el = el;
    const tokens = tokenizeHTML(el);
    if (getTokensLength(tokens) <= this.options.truncateFromWordIndex) {
      return;
    }
    this.actions = streamActions(tokens);
    this.el.innerHTML = "";
    this.wordsUsed = 0;
    this.currentContainer = el;
    this.type(this.options.truncateFromWordIndex, 0, () => {
      const button = document.createElement("span");
      button.classList.add("text-blue-500", "hover:cursor-pointer");
      const trunc = document.createTextNode(this.options.truncationText);
      button.appendChild(trunc);
      button.addEventListener("click", () => {
        button.remove();
        this.type(Infinity, options.speed);
      });
      this.currentContainer.appendChild(button);
    });
  }

  async type(
    words: number,
    delay: number = 100,
    finish: () => void = () => {}
  ) {
    while (this.wordsUsed < words) {
      const action = this.actions.next().value;
      if (action === undefined) break;
      if (action.type === "append-word") {
        this.currentContainer.appendChild(
          document.createTextNode(action.value + " ")
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

typewriter();

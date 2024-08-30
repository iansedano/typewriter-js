/**
<p data-typewriter='{"truncateFromWordIndex": "10"}' class="prose">
  Morbi fringilla <strong>convallis</strong> sapien, id pulvinar odio volutpat. Hi omnes lingua, <em>institutis</em>, legibus inter se differunt. Non equidem invideo, miror magis posuere velit aliquet. Quid securi etiam tamquam eu <code>fugiat</code> nulla pariatur. Inmensae subtilitatis, obscuris et malesuada fames. Fictum, deserunt mollit anim laborum astutumque!
</div>
*/

/**
 * @typedef {Object} TypewriterWordNode
 * @property {"word"} type
 * @property {string} value
 */

/**
 * @typedef {Object} TypewriterSentenceNode
 * @property {"sentence"} type
 * @property {TypewriterWordNode[]} children
 */

/**
 * @typedef {Object} TypewriterElementNode
 * @property {"element"} type
 * @property {string} tagName
 * @property {TypewriterNode[]} children
 */

/**
 * @typedef {TypewriterWordNode | TypewriterElementNode | TypewriterSentenceNode} TypewriterNode
 */

/**
 * @typedef {Object} TypewriterAction
 * @property {"append-word" | "append-element" | "end"} type
 * @property {string} value
 */

/**
 * @typedef {Object} TypewriterOptions
 * @property {number} [truncateFromWordIndex]
 * @property {number} [speed]
 * @property {string} [truncationText]
 */

export function typewriter() {
  const typewriterElements = document.querySelectorAll("[data-typewriter]");
  typewriterElements.forEach((el) => {
    const options = JSON.parse(el.getAttribute("data-typewriter"));
    new Typewriter(el, options);
  });
}

/**
 * @param {Node} HTML
 * @returns {TypewriterElementNode}
 */
function tokenizeHTML(HTML) {
  // We return one single TypewriterElementNode which is essentially a
  // basic representation of a DOM element.
  return {
    type: "element",
    tagName: HTML.nodeName,
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
        return tokenizeHTML(node); // ...we recursively tokenize it.
      }
    }),
  };
}

/**
 * @param {TypewriterElementNode} tokens
 * @returns {number}
 */
function getTokensLength(tokens) {
  let count = 0;
  for (const node of tokens.children) {
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

/**
 * @param {TypewriterElementNode} tokens
 * @returns {Generator<TypewriterAction>}
 */
function* streamActions(tokens) {
  // Create a stream of tokens by yielding actions to perform on the DOM.

  // We iterate over the children of the TypewriterElementNode.
  for (const node of tokens.children) {
    if (node.type === "element") {
      yield { type: "append-element", value: node.tagName };
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

function defaultOptions() {
  return {
    truncateFromWordIndex: 20,
    speed: 100,
    truncationText: "... more",
  };
}

export class Typewriter {
  /**
   * @param {HTMLElement} el
   * @param {TypewriterOptions} options
   */
  constructor(el, options) {
    this.options = { ...defaultOptions(), ...options };
    this.el = el;
    const tokens = tokenizeHTML(el);
    console.log(tokens, getTokensLength(tokens));
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

  /**
   * @param {number} words
   * @param {number} [delay=100]
   * @param {() => void} [finish=() => {}]
   */
  async type(words, delay = 100, finish = () => {}) {
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
        this.currentContainer.appendChild(newElement);
        this.currentContainer = newElement;
      } else if (action.type === "end") {
        this.currentContainer = this.currentContainer.parentElement;
      }
      await sleep(delay);
    }
    finish();
  }
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

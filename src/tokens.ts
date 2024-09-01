export function tokenizeHTML(HTML: HTMLElement): TypewriterElementNode {
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
          children: textToWords(node.textContent),
        };
      } else if (node.nodeType === 1) {
        // if it's an element node...
        return tokenizeHTML(node as HTMLElement); // ...we recursively tokenize it.
      }
    }),
  };
}

function textToWords(text: string): TypewriterWordNode[] {
  return text.match(/\s*\S+\s*/g).map((word) => {
    return { type: "word", value: word };
  });
}

export function getTokensLength(tokens: TypewriterElementNode): number {
  let count = 0;
  for (const node of tokens.children) {
    if (node == undefined) continue;
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

export function* typist(
  root: TypewriterElementNode
): Generator<TypewriterAction> {
  // Create a stream of tokens by yielding actions to perform on the DOM.

  // We iterate over the children of the TypewriterElementNode.
  for (const node of root.children) {
    if (node == undefined) continue;
    if (node.type === "element") {
      yield {
        type: "append-element",
        value: node.tagName,
        className: node.className,
      };
      yield* typist(node);
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

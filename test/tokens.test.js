import { tokenizeHTML } from "../src/tokens";
import { expect, test } from "vitest";

test("tokenizeHTML", () => {
  const html = '<div class="foo">Hello <span>world</span></div>';
  const dom = new DOMParser().parseFromString(html, "text/html");

  const tokens = tokenizeHTML(dom.body.firstChild);
  expect(tokens).toEqual({
    type: "element",
    tagName: "DIV",
    className: "foo",
    children: [
      { type: "sentence", children: [{ type: "word", value: "Hello" }] },
      {
        type: "element",
        tagName: "SPAN",
        className: "",
        children: [
          { type: "sentence", children: [{ type: "word", value: "world" }] },
        ],
      },
    ],
  });
});

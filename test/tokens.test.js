import { tokenizeHTML } from "../src/tokens";
import { expect, test } from "vitest";

test("Tokenize basic HTML string with nested span", () => {
  const html = '<div class="foo">Hello <span>world</span></div>';
  const dom = new DOMParser().parseFromString(html, "text/html");

  const tokens = tokenizeHTML(dom.body.firstChild);
  expect(tokens).toEqual({
    type: "element",
    tagName: "DIV",
    className: "foo",
    children: [
      { type: "sentence", children: [{ type: "word", value: "Hello " }] },
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

test("Tokenize P element with nested EM element, followed immediately by comma", () => {
  const html = '<p class="foo">lingua, <em>institutis</em>, legibus</p>';
  const dom = new DOMParser().parseFromString(html, "text/html");

  const tokens = tokenizeHTML(dom.body.firstChild);
  expect(tokens).toEqual({
    type: "element",
    tagName: "P",
    className: "foo",
    children: [
      { type: "sentence", children: [{ type: "word", value: "lingua, " }] },
      {
        type: "element",
        tagName: "EM",
        className: "",
        children: [
          {
            type: "sentence",
            children: [{ type: "word", value: "institutis" }],
          },
        ],
      },
      {
        type: "sentence",
        children: [
          { type: "word", value: ", " },
          { type: "word", value: "legibus" },
        ],
      },
    ],
  });
});

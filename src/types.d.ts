declare type TypewriterWordNode = {
  type: "word";
  value: string;
};

declare type TypewriterSentenceNode = {
  type: "sentence";
  children: TypewriterWordNode[];
};

declare type TypewriterElementNode = {
  type: "element";
  tagName: string;
  className: string;
  children: TypewriterNode[];
};

declare type TypewriterNode =
  | TypewriterWordNode
  | TypewriterElementNode
  | TypewriterSentenceNode;

declare type TypewriterAction = {
  type: "append-word" | "append-element" | "end";
  value: string;
  className?: string;
};

declare type TypewriterOptions = {
  truncateFromWordIndex: number;
  delay: number;
  truncationText: string;
};

declare type Option = {
  name: string;
  attribute: string;
  type: "number" | "string";
  default: any;
};

declare type Parser = {
  [key: string]: (value: string, defaultValue: any) => string | number;
};

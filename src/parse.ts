export default function parseOptions(
  el: HTMLElement,
  options: Option[]
): TypewriterOptions {
  return options.reduce((typewriterOptions, option, i) => {
    typewriterOptions[option.name] = parser[option.type](
      el.getAttribute(option.attribute),
      option.default
    );
    return typewriterOptions;
  }, fallbackDefaultOptions);
}

const fallbackDefaultOptions: TypewriterOptions = {
  truncateFromWordIndex: 50,
  delay: 100,
  truncationText: "...more",
};

const parser: Parser = {
  number: parseNumber,
  string: parseString,
};

function parseNumber(num: string, defaultValue: number): number {
  const result = parseFloat(num);
  if (isNaN(result)) {
    return defaultValue;
  }
  return result;
}

function parseString(str: string, defaultValue: string): string {
  return str || defaultValue;
}

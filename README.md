# Typewriter effect

![Peek 2024-09-01 15-18](https://github.com/user-attachments/assets/34187f4b-58e3-4a9f-9a43-79ad436bbc87)

```html
<p
  class="card"
  data-typewriter
  data-typewriter-from="10"
  data-typewriter-delay="100"
  data-typewriter-button-text="...more"
>
  Morbi fringilla <strong>convallis</strong> sapien, id pulvinar odio volutpat.
  Hi omnes lingua, <em class="green">institutis</em>, legibus inter se
  differunt. Non equidem invideo, miror magis posuere velit aliquet. Quid securi
  etiam tamquam eu <code class="blue">fugiat</code> nulla pariatur. Inmensae
  subtilitatis, obscuris et malesuada fames. Fictum, deserunt mollit anim
  laborum astutumque!
</p>

<!-- See demo/index.html for full demo -->
```

Using HTML data attributes, you can create a typewriter effect on text based elements.

- `data-typewriter`: The element that will be animated.
- `data-typewriter-from`: The starting word of the text (if text is not long enough then nothing will happen).
- `data-typewriter-delay`: The delay between each token in `ms`.
- `data-typewriter-button-text`: The text of the button that will reveal the rest of the text (this button gets assigned the class `typewriter-more-button` which you can then style as you wish). After being clicked, it dissapears.

## Building and Development

```shell
$ npm install
$ npm run dev # for development
$ npm run build # for production
```

You'll end up with various output formats in the `dist` directory:

- [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)
- [ES module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- IIFE with [Babel](https://babeljs.io/) [preset env](https://babeljs.io/docs/babel-preset-env/)
- ES module with Babel preset env

Each type will also have gzipped versions and their corresponding source maps.

The smallest version is the `typewriter.mjs.gz` file representing the ES module with gzip compression, which is currently at 1KB.

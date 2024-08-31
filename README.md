# Typewriter effect

![Peek 2024-08-31 18-05](https://github.com/user-attachments/assets/644a4f36-556c-4baa-a3c9-56b1d17d0199)

```html
<p
  data-typewriter
  data-typewriter-from="10"
  data-typewriter-delay="100"
  data-typewriter-button-text="...more"
>
  Morbi fringilla <strong>convallis</strong> sapien, id pulvinar odio volutpat.
  Hi omnes lingua, <em>institutis</em>, legibus inter se differunt. Non equidem
  invideo, miror magis posuere velit aliquet. Quid securi etiam tamquam eu
  <code>fugiat</code> nulla pariatur. Inmensae subtilitatis, obscuris et
  malesuada fames. Fictum, deserunt mollit anim laborum astutumque!
</p>
```

Using HTML data attributes, you can create a typewriter effect on text based elements.

- `data-typewriter`: The element that will be animated.
- `data-typewriter-from`: The starting index of the text.
- `data-typewriter-delay`: The delay between each token in `ms`.
- `data-typewriter-button-text`: The text of the button that will reveal the rest of the text.

## Building and Development

```shell
$ npm install
$ npm run dev # for development
$ npm run build # for production
```

You'll end up with various output files in the `dist` directory:

- `typewriter-iife.js`: IIFE format.
- `typewriter-mjs.js`: ES module format.
- `typewriter-babel-iife.js`: IIFE format with Babel.
- `typewriter-babel-mjs.js`: ES module format with Babel.

Each type will also have gzipped versions and their corresponding source maps.

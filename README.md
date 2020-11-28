# vtjeng.github.io

## Contents

### Theme

This site uses a lightly-modified version of [`minima==2.5.1`](https://github.com/jekyll/minima/tree/v2.5.1).

The key differences are:

- Three vendored files in `_includes` from commit `a98a8fed7203738991b98d4f90a80dec3ebcf4f7`:
  - `head.html` is modified to allow for custom titles.
  - `footer.html` is modified to include only the social links, removing descriptions and contact details.
  - `custom-head.html` adds a favicon and `MathJax` processing.

> :pencil: Note that custom CSS is specified `assets/css/style.scss` (as referenced in the vendored version of `_includes/head.html`), rather than in `assets/main.css`.

### Favicon

I used [RealFaviconGenerator](https://realfavicongenerator.net/) to generate the favicon.

## Local Development

To view a copy of this site locally, install the [prerequisites](https://jekyllrb.com/docs/installation/), and run

```sh
gem install jekyll bundler
```

You can now build the site and make it available on a local server.

```sh
bundle exec jekyll serve
```

Above instructions are from [the official Jekyll site](https://jekyllrb.com/docs/#instructions).

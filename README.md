# vtjeng.github.io

## Contents

### Theme

This site uses a lightly-modified version of [`minima@296bf6b`](https://github.com/jekyll/minima/tree/296bf6b).

The key differences are:

- Three vendored files in `_includes`:
  - `head.html` is modified to allow for custom titles.
  - `footer.html` is modified to include only the social links, removing descriptions and contact details.
  - `custom-head.html` adds a favicon and `MathJax` processing.

> :pencil: Note that custom CSS is specified `assets/css/style.scss` (as referenced in the vendored version of `_includes/head.html`), rather than in `assets/main.css`.

### Favicon

I used [RealFaviconGenerator](https://realfavicongenerator.net/) to generate the favicon, adding the following assets in the root folder:

```sh
android-chrome-192x192.png
android-chrome-512x512.png
apple-touch-icon.png
browserconfig.xml
favicon-16x16.png
favicon-32x32.png
favicon.ico
mstile-150x150.png
safari-pinned-tab.svg
site.webmanifest
```

### Configuring a Custom Domain

To link a domain to GitHub Pages, I added the `CNAME` file and changed the DNS settings with my domain registrar following [these instructions](https://gist.github.com/mapsam/ce60b87eea561ea6bdbf).

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

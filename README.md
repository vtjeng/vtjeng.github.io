# vtjeng.github.io

## Contents

### Theme

This site uses a lightly-modified version of
[`minima@296bf6b`](https://github.com/jekyll/minima/tree/296bf6b).

The key differences are:

- Three vendored files in `_includes`:
  - `head.html` is modified to allow for custom titles.
  - `footer.html` is modified to include only the social links, removing descriptions and contact
    details.
  - `custom-head.html` adds a favicon, the Cairo webfont, and Font Awesome.

> :pencil: Note that custom CSS is specified `assets/css/style.scss` (as referenced in the vendored
> version of `_includes/head.html`), rather than in `assets/main.css`.

### Favicon

I used [RealFaviconGenerator](https://realfavicongenerator.net/) to generate the favicon. The
favicon assets are stored in the `assets/favicon` directory and include:

```sh
assets/favicon/
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── apple-touch-icon.png
├── browserconfig.xml
├── favicon-16x16.png
├── favicon-32x32.png
├── favicon.ico
├── mstile-150x150.png
├── safari-pinned-tab.svg
└── site.webmanifest
```

### Hosting and project-site proxies

Cloudflare Pages builds this repository and serves it at `vtjeng.com`. GitHub Pages also builds the
repository at `vtjeng.github.io`.

The route files under `functions/` expose selected GitHub Pages project sites at their former
`vtjeng.com/<repository>/` URLs. Each route calls the shared proxy in
`_cloudflare/github-pages-proxy.js`; the explicit directory names form the allowlist and prevent a
repository from colliding with an unrelated personal-site path.

To expose another project, first confirm that `https://vtjeng.github.io/<repository>/` works. Then
add `functions/<repository>/[[path]].js` with the same wrapper used by the existing routes, passing
`/<repository>` as the project path.

## Local Development

To view a copy of this site locally, install the
[prerequisites](https://jekyllrb.com/docs/installation/), and run

```sh
gem install jekyll bundler
```

You can now build the site and make it available on a local server.

```sh
bundle exec jekyll serve
```

Above instructions are from [the official Jekyll site](https://jekyllrb.com/docs/#instructions).

### Updating

```sh
bundle update
```

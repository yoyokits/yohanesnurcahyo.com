# yohanesnurcahyo.com

Personal website of **Yohanes Wahyu Nurcahyo** — software engineer for sensor data analysis,
signal/image processing and 2D/3D data visualization, and founder of the indie app studio
[Cekli](https://www.cekli.com).

Static site, no build step, no dependencies. Plain HTML, CSS and a small amount of vanilla
JavaScript used only for progressive enhancement — the page is fully readable with JS disabled.

## Structure

```
index.html            single-page site (hero, about, expertise, experience, products, projects, contact)
styles.css            design tokens + all styling
main.js               nav, scroll spy, reveal-on-scroll, current year
favicon.svg           YN monogram favicon
404.html              styled not-found page
robots.txt            crawler policy
sitemap.xml           sitemap for search engines
```

## Local preview

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deployment (GitHub Pages)

1. **Settings → Pages → Build and deployment**: source `Deploy from a branch`,
   branch `main`, folder `/ (root)`.
2. **Settings → Pages → Custom domain**: enter `yohanesnurcahyo.com` and save.
   GitHub commits a `CNAME` file for you — that is why one is not checked in here.
3. At the DNS provider for `yohanesnurcahyo.com`:
   - `A` records for the apex domain → `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `yoyokits.github.io`
4. Once DNS resolves, tick **Enforce HTTPS**.

Until the custom domain is configured the site is served at
`https://yoyokits.github.io/yohanesnurcahyo.com/` — all asset paths in `index.html` are
relative, so it works at either address.

## Editing

Colours, spacing and radii are CSS custom properties at the top of `styles.css`
(`--accent` is the Cekli orange `#ff6b2c`). Content is plain HTML in `index.html`; sections are
marked with comment banners.

## Licence

Source code is free to reuse. Content, copy and branding are © Yohanes Wahyu Nurcahyo.

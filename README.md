# HKUST GZ Times

The alternate magazine page is split into:

- `index_alt.html` for the page content.
- `styles/index_alt.css` for layout and visual styling.
- `scripts/index_alt.js` for the table of contents, progress bar, and quiz.
- `img/` for local image files.

## Side Notes

Add a sidenote inside the article where it belongs:

```html
<aside class="side-note" style="--note-top: 12rem;">
  <strong>Side note</strong>
  Write the note text here.
</aside>
```

To put the note on the left side, add `side-note-left`:

```html
<aside class="side-note side-note-left" style="--note-top: 12rem;">
  <strong>Side note</strong>
  Write the note text here.
</aside>
```

Use `--note-top` to move one note up or down inside its article. Increase the value to move it lower. Decrease the value to move it higher.

The general sidenote size and distance from the article are controlled in `styles/index_alt.css`:

```css
--sidenote-width: 220px;
--sidenote-gap: 42px;
```

These values affect the wide desktop layout, where notes sit outside the centered article column. On smaller screens, notes stack normally inside the article flow.

## Images

Put image files in `img/`, then reference them from `index_alt.html` like this:

```html
<figure class="article-hero-image">
  <div class="article-hero-frame">
    <img src="img/example.jpg" alt="Describe the image">
    <div class="hero-overlay">
      <h2 class="article-hero-title">Article Title</h2>
      <p class="article-meta">By Name Surname</p>
    </div>
  </div>
  <figcaption>Image citation: img/example.jpg</figcaption>
</figure>
```

You can also paste an image inside a sidenote:

```html
<aside class="side-note" style="--note-top: 12rem;">
  <strong>Image note</strong>
  <img src="img/example.jpg" alt="Describe the image">
  Short caption or explanation.
</aside>
```

Keep filenames lowercase with hyphens, for example `article-surveillance.jpg`.

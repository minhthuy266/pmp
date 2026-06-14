# PMP Cheat Sheet 2026

Static HTML/CSS/JavaScript cheat sheet. Content is loaded on demand by tab.

## Run

```bash
python3 -m http.server 8080
```

Open <http://localhost:8080>.

Direct `file://` access is not supported because sections are loaded with `fetch()`.

## Structure

```text
index.html              App shell only
assets/styles.css       Shared styles
js/sections.js          Tab and section manifest
js/app.js               Loading, routing, caching, and search
sections/*.html         One file per main topic
sections/processes/     Process reference split by knowledge area
```

## Add A Topic

1. Create `sections/topic-name.html`.
2. Add one entry to `js/sections.js`.
3. Reload the page. Tabs and global search use the manifest automatically.

Keep exam format and numerical claims aligned with the current PMI Examination Content Outline.

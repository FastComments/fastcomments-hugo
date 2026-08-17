# fastcomments-hugo

Live commenting, chat, reviews, and comment-count widgets for [Hugo](https://gohugo.io), powered by [FastComments](https://fastcomments.com).

Ships as a Hugo theme component (also importable as a Hugo Module). It adds a `fastcomments/comments.html` partial for theme authors and a shortcode for every FastComments widget, with no build-time JavaScript and no external dependencies.

## Live Demo

Try every widget live at <https://fastcomments.com/commenting-system-for-hugo/>.

## Live Showcase

To see every shortcode and the theme partial running locally against the public `demo` tenant, clone the repo and run the bundled `exampleSite`:

```bash
git clone https://github.com/FastComments/fastcomments-hugo.git
cd fastcomments-hugo/exampleSite
hugo server
```

Each widget has its own page under `exampleSite/content/` that you can copy straight into your own site.

## Install

Pick one of the two standard ways to add a Hugo theme component.

### Option A: Hugo Module (recommended)

From your site root:

```bash
hugo mod init github.com/you/your-site   # only if your site is not already a module
hugo mod get github.com/FastComments/fastcomments-hugo
```

Then add the import to your `hugo.toml`:

```toml
[module]
  [[module.imports]]
    path = "github.com/FastComments/fastcomments-hugo"
```

### Option B: Theme component (Git submodule)

```bash
git submodule add https://github.com/FastComments/fastcomments-hugo.git themes/fastcomments-hugo
```

Then reference it from your `hugo.toml`. List it alongside your own theme; later entries win, so keep your theme first:

```toml
theme = ["your-theme", "fastcomments-hugo"]
```

## Quick Start

Set your tenant ID once in `hugo.toml`:

```toml
[params.fastcomments]
  tenantId = "demo"   # replace "demo" with your FastComments tenant ID
```

Then either wire the comments widget into your theme (see [Theme Integration](#theme-integration)), or drop a shortcode into any page's Markdown:

```text
{{< fastcomments >}}
```

## Shortcodes

| Shortcode | Description |
| --- | --- |
| `fastcomments` | Threaded comments with replies, voting, and @mentions |
| `fastcomments-comment-count` | Comment count for a single page |
| `fastcomments-comment-count-bulk` | Comment counts for many pages in one request (see [Bulk comment counts](#bulk-comment-counts)) |
| `fastcomments-live-chat` | Live chat widget |
| `fastcomments-collab-chat` | Collaborative inline commenting (requires `target`) |
| `fastcomments-image-chat` | Image annotation comments (requires `target`) |
| `fastcomments-recent-comments` | Recent comments across the site |
| `fastcomments-recent-discussions` | Recently active discussion threads |
| `fastcomments-reviews-summary` | Star-rating reviews summary |
| `fastcomments-top-pages` | Most-discussed pages |
| `fastcomments-user-activity-feed` | Per-user activity feed (requires `userId`) |

### Examples

Comment count inline with text:

```text
This page has {{< fastcomments-comment-count >}} comments.
```

Live chat:

```text
{{< fastcomments-live-chat >}}
```

Collab chat, targeting a content element by CSS selector:

```text
<article id="post-body">
  <p>Highlight me to leave a comment.</p>
</article>

{{< fastcomments-collab-chat target="#post-body" >}}
```

Image chat, targeting an image element by CSS selector:

```text
<img id="hero" src="/hero.jpg" alt="Hero image" />

{{< fastcomments-image-chat target="#hero" >}}
```

Reviews summary:

```text
{{< fastcomments-reviews-summary >}}
```

User activity feed:

```text
{{< fastcomments-user-activity-feed userId="demo:demo-user" >}}
```

## Theme Integration

To attach comments to every post the way Hugo's built-in Disqus support does, add one line to your theme's single template (`layouts/_default/single.html`):

```go-html-template
{{ partial "fastcomments/comments.html" . }}
```

The partial renders only when a `tenantId` is configured. Disable comments on an individual page with front matter:

```toml
+++
title = "A page with no comments"
comments = false
+++
```

## Bulk comment counts

To show a comment count next to many pages at once (a blog index, a section list), use the bulk count widget. It fetches every count on the page in a single request. There are two pieces: a marker next to each item, and one init call after the list.

In a list template (`layouts/_default/list.html`):

```go-html-template
<ul>
  {{ range .Pages }}
    <li>
      <a href="{{ .RelPermalink }}">{{ .Title }}</a>
      {{ partial "fastcomments/count-marker.html" . }}
    </li>
  {{ end }}
</ul>
{{ partial "fastcomments/bulk-count.html" (dict "page" .) }}
```

`count-marker.html` renders `<span class="fast-comments-count" data-fast-comments-url-id="..."></span>`, using the same identifier the comments widget uses for that page (its `urlId`, or its permalink when no `urlId` is set), so the counts line up with the real threads. `bulk-count.html` emits the single request that fills them in.

If you write the markers yourself (for example in a page's Markdown), use the shortcode to emit the init call instead:

```text
<span class="fast-comments-count" data-fast-comments-url-id="article-1"></span>
<span class="fast-comments-count" data-fast-comments-url-id="article-2"></span>

{{< fastcomments-comment-count-bulk >}}
```

## Configuration

All FastComments widget options are set under `[params.fastcomments]` in `hugo.toml`, and can be overridden per page in front matter under `[fastcomments]`. Precedence, lowest to highest: site params, page front matter, shortcode parameters.

```toml
# hugo.toml
[params.fastcomments]
  tenantId = "your-tenant-id"
  hasDarkBackground = true
  voteStyle = 1
  enableSearch = true
```

```toml
# a page's front matter
+++
title = "Article"
[fastcomments]
  urlId = "article-42"
  collapseReplies = true
+++
```

When neither `url` nor `urlId` is provided, `url` defaults to the page's permalink so comment threads stay tied to a stable URL.

### EU data residency

EU customers set `region = "eu"` to route the widget to `cdn-eu.fastcomments.com`:

```toml
[params.fastcomments]
  tenantId = "your-tenant-id"
  region = "eu"
```

### Note on key casing

Hugo lowercases every key in `hugo.toml` and front matter, but the FastComments widgets require camelCase keys (`tenantId`, `hasDarkBackground`). This component restores the correct casing for every known top-level option automatically, so write options in their normal camelCase form. Keys nested inside an object value (for example the keys of a `translations` map, or fields of `pageReactConfig`) are not restored. Configure those through the FastComments dashboard customization UI instead.

## Widget configuration reference

For the full list of widget options, see the [FastComments customization documentation](https://docs.fastcomments.com/guide-customizations-and-configuration.html). Two widgets take a required option that has no default:

- `fastcomments-collab-chat` and `fastcomments-image-chat` require `target`, a CSS selector for the element to attach to.
- `fastcomments-user-activity-feed` requires `userId`.

## Links

- [FastComments Documentation](https://docs.fastcomments.com)
- [Customization & Configuration](https://docs.fastcomments.com/guide-customizations-and-configuration.html)
- [Hugo Documentation](https://gohugo.io/documentation/)

## License

MIT

## Maintenance Status

These components are thin wrappers around our core VanillaJS widgets. We can update those widgets (fix bugs, add features) without publishing this repository, so a quiet release history does not mean FastComments is inactive. Check [our blog](https://blog.fastcomments.com/) for updates. Breaking changes to the underlying widgets ship with a version bump here.

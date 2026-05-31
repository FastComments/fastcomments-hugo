+++
title = "Live Comments"
description = "The main threaded commenting widget"
+++

The widget below is injected by the theme partial wired into `single.html`:

```go-html-template
{{ partial "fastcomments/comments.html" . }}
```

That is the recommended setup. You can also drop the shortcode directly into any
page's Markdown instead:

```text
{{</* fastcomments */>}}
```

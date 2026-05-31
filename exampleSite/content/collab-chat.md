+++
title = "Collab Chat"
description = "Inline collaborative commenting on a content element"
comments = false
+++

<div id="post-body">
<p>Highlight any sentence in this paragraph to attach an inline comment to it.
Collab chat anchors threads to the text your readers select, so feedback lives
right next to the words it is about.</p>
</div>

The shortcode targets the element above by CSS selector:

```text
{{</* fastcomments-collab-chat target="#post-body" */>}}
```

{{< fastcomments-collab-chat target="#post-body" >}}

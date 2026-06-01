+++
title = "Live Comments"
category = "Widgets"
description = "The flagship widget: threaded replies, voting, moderation, media, and realtime sync, on by default."
usePartial = true
code = """# Recommended: wire it into your theme's single template.
# layouts/_default/single.html
{{ partial "fastcomments/comments.html" . }}

# Or drop the shortcode into any page's Markdown:
{{< fastcomments >}}"""
+++

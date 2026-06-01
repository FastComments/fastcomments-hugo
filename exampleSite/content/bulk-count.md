+++
title = "Bulk Comment Count"
category = "Counts & configuration"
description = "Fill in counts for many pages with a single request. Mark each element, then init once."
code = """<span class=\"fast-comments-count\" data-fast-comments-url-id=\"/comments/\"></span>

{{< fastcomments-comment-count-bulk >}}

In a list template, use the partials instead:
{{ partial \"fastcomments/count-marker.html\" . }}
{{ partial \"fastcomments/bulk-count.html\" (dict \"page\" .) }}"""
+++

<ul style="line-height:2.2">
  <li>Live Comments <span class="fast-comments-count" data-fast-comments-url-id="/comments/"></span></li>
  <li>Live Chat <span class="fast-comments-count" data-fast-comments-url-id="/live-chat/"></span></li>
  <li>Recent Comments <span class="fast-comments-count" data-fast-comments-url-id="/recent-comments/"></span></li>
</ul>

{{< fastcomments-comment-count-bulk >}}

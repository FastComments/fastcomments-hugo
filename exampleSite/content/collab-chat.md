+++
title = "Collab Chat"
category = "Widgets"
description = "Anchor comment threads to text selections inside your content."
requires = "Requires target"
code = """<div id=\"post-body\">
  <p>Highlight any sentence to attach a comment to it.</p>
</div>

{{< fastcomments-collab-chat target=\"#post-body\" >}}"""
+++

<div id="post-body">
<p>Highlight any sentence in this paragraph to attach an inline comment to it. Collab chat anchors threads to the text your readers select, so feedback lives right next to the words it is about.</p>
</div>

{{< fastcomments-collab-chat target="#post-body" >}}

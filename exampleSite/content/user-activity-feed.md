+++
title = "Activity Feed"
category = "Widgets"
description = "A single user's chronological activity stream."
requires = "Requires userId"
code = """# in the page's front matter:
[fastcomments]
  userId = \"demo:demo-user\"

{{< fastcomments-user-activity-feed >}}"""
[fastcomments]
userId = "demo:demo-user"
+++

{{< fastcomments-user-activity-feed >}}

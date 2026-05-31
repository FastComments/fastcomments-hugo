+++
title = "EU Region"
description = "Comments served from the EU CDN and data center"
comments = false
[fastcomments]
region = "eu"
+++

Setting `region = "eu"` (here in front matter, but usually site-wide) routes the
widget to `cdn-eu.fastcomments.com` for EU data residency:

```toml
[params.fastcomments]
  tenantId = "your-tenant-id"
  region = "eu"
```

{{< fastcomments >}}

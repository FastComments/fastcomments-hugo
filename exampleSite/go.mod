module github.com/FastComments/fastcomments-hugo/exampleSite

go 1.19

require github.com/FastComments/fastcomments-hugo v0.0.0

// Build against the theme in this checkout (the repo root), so the demo and the
// aggregator exercise the local code rather than a published version.
replace github.com/FastComments/fastcomments-hugo => ../

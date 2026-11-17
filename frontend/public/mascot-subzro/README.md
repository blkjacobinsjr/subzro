Subzro mascot assets

All 22 WebP frames keep their existing URLs, dimensions and original drawing and colors. Their former white background was removed once at asset-preparation time. There is no browser background-removal filter or per-frame processing.

Bare mascot artwork has transparent pixels. A background belongs to an explicit rounded UI container, never to the source drawing. The primary subzero_logo_icon.png already has transparency and is unchanged.

The open white chest on the eight bust drawings is retained within the lower torso silhouette. Original source frames are retained in the pre-change production source and in the local asset-preparation backup. The local preparation script and per-frame alpha/RGB evidence are in .agent-local/mascot-transparency/.

Verification: each frame remains 204 x 204, has both transparent and opaque pixels, preserves the exact prepared alpha mask, and keeps average visible-color compression error below 5 levels out of 255 per channel. Lossless preparation copies and the final compression measurements remain in the local evidence folder. Inspect the full set on both pale and dark backgrounds before replacing these assets again.

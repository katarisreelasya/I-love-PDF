# FileFlow

A lightweight, privacy-first file utility app. The current MVP is a static website with browser-side processing, so uploaded documents are never sent to a FileFlow server.

## Run it

Open this folder in VS Code and use Live Server on `index.html`, or serve the folder with any static web server. The PDF manipulation, rendering, compression, and archive libraries are bundled under `vendor/`; image tools use the browser Canvas API. OCR loads Tesseract.js and its English language model online, so OCR needs an internet connection.

## Included tools

- Convert images to PNG, JPG, or WEBP
- Resize, compress, and rotate images
- Merge PDFs, extract selected pages, and reorder/remove/duplicate pages
- Compress PDFs as image-based copies with adjustable quality
- Rotate pages, crop margins, add text or typed signatures, and add watermarks/page numbers
- Create basic fillable text fields and compare extracted text from two PDFs
- Convert multiple images into one PDF, render pages as PNG or JPG, extract selectable PDF text, and run English OCR on scanned pages
- Convert the text content of pasted HTML to PDF
- Browse conversion, security, and intelligence tools in the catalog; specialist features are labeled when they need external processing services

## Storage choice

FileFlow uses **no persistent file storage**. File bytes remain in browser memory while a tool runs, then the browser downloads the result. The app does not use localStorage, IndexedDB, a backend upload, or a cloud bucket. This keeps the MVP free to host as static files and makes result access immediate. Closing or refreshing the tab discards the in-progress files. Core PDF libraries are local; OCR loads Tesseract.js and its English language data from public CDNs. Documents themselves stay in the browser.

The UI and feature list can grow without changing this choice. If later tools require server-side processing, temporary server storage can be added behind an explicit job workflow, with short expiration and automatic deletion. Avoid presenting server-processed files as browser-only.

## Processing limits

Advanced PDF-to-Office conversion, secure redaction, PDF/A validation, layout-preserving translation, and AI summaries are listed but require specialist processing services and are not implemented in this static MVP. Compress, protect, and unlock rebuild pages as images; text becomes non-selectable and output quality/layout may change. The Protect PDF tool applies an opening password locally. PDF-to-Word exports selectable text into a simple editable `.doc` file and does not preserve layout, tables, or images. OCR produces an extracted English text file, rather than adding a searchable text layer to the original PDF. PDF-to-PowerPoint/Excel and Office-to-PDF need a document conversion engine.

## Bundled libraries

The `vendor/` folder contains PDF-Lib 1.17.1 (MIT), PDF.js 3.11.174 (Apache-2.0), JSZip 3.10.1 (MIT), and pdfmake 0.2.12 (MIT). Their project and license links are in [vendor/ATTRIBUTIONS.md](vendor/ATTRIBUTIONS.md).

## Project files

- `index.html` – landing page and tool dialog
- `styles.css` – responsive visual design
- `app.js` – tool selection, browser processing, and downloads

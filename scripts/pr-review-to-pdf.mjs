#!/usr/bin/env node
/**
 * Convert a PR-review markdown report to PDF (embeds local screenshot images).
 * Usage: node scripts/pr-review-to-pdf.mjs reports/pr-review/PR-1-Initial-setup.md
 */
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { chromium } from 'playwright';

const mdPath = process.argv[2];
if (!mdPath) {
  console.error('Usage: node scripts/pr-review-to-pdf.mjs <report.md>');
  process.exit(1);
}

const absMd = path.resolve(mdPath);
if (!fs.existsSync(absMd)) {
  console.error(`File not found: ${absMd}`);
  process.exit(1);
}

const mdDir = path.dirname(absMd);
const stem = path.basename(absMd, path.extname(absMd));
const pdfPath = path.join(mdDir, `${stem}.pdf`);
const md = fs.readFileSync(absMd, 'utf8');

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Minimal markdown → HTML (headings, lists, bold, code, images, paragraphs). */
function mdToHtml(src) {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let inUl = false;
  let inOl = false;
  let inCode = false;
  let codeBuf = [];

  const closeLists = () => {
    if (inUl) {
      out.push('</ul>');
      inUl = false;
    }
    if (inOl) {
      out.push('</ol>');
      inOl = false;
    }
  };

  const inline = (text) => {
    let t = escapeHtml(text);
    t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, srcPath) => {
      const resolved = path.isAbsolute(srcPath)
        ? srcPath
        : path.resolve(mdDir, srcPath);
      if (!fs.existsSync(resolved)) {
        return `<em>[missing image: ${escapeHtml(srcPath)}]</em>`;
      }
      const url = pathToFileURL(resolved).href;
      return `<figure><img src="${url}" alt="${escapeHtml(alt)}" /><figcaption>${escapeHtml(alt || srcPath)}</figcaption></figure>`;
    });
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
    return t;
  };

  for (const raw of lines) {
    const line = raw;

    if (line.startsWith('```')) {
      if (inCode) {
        out.push(`<pre><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>`);
        codeBuf = [];
        inCode = false;
      } else {
        closeLists();
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }

    if (/^#{1,3} /.test(line)) {
      closeLists();
      const level = line.match(/^#+/)[0].length;
      out.push(`<h${level}>${inline(line.replace(/^#{1,3} /, ''))}</h${level}>`);
      continue;
    }

    const ul = line.match(/^[-*] (.+)$/);
    if (ul) {
      if (inOl) {
        out.push('</ol>');
        inOl = false;
      }
      if (!inUl) {
        out.push('<ul>');
        inUl = true;
      }
      out.push(`<li>${inline(ul[1])}</li>`);
      continue;
    }

    const ol = line.match(/^\d+\. (.+)$/);
    if (ol) {
      if (inUl) {
        out.push('</ul>');
        inUl = false;
      }
      if (!inOl) {
        out.push('<ol>');
        inOl = true;
      }
      out.push(`<li>${inline(ol[1])}</li>`);
      continue;
    }

    if (/^\|/.test(line)) {
      // skip raw tables for simplicity — render as pre line
      closeLists();
      out.push(`<p>${inline(line)}</p>`);
      continue;
    }

    if (line.trim() === '') {
      closeLists();
      continue;
    }

    // Autolink bare screenshot paths ending in .png
    const imgPathMatch = line.match(
      /`?((?:reports\/pr-review\/|\.\/)?[^\s`]+\.png)`?/,
    );
    if (imgPathMatch) {
      closeLists();
      const rel = imgPathMatch[1];
      const candidates = [
        path.resolve(mdDir, rel),
        path.resolve(process.cwd(), rel),
        path.resolve(mdDir, 'screenshots', path.basename(rel)),
        path.resolve(mdDir, stem, 'screenshots', path.basename(rel)),
      ];
      const found = candidates.find((p) => fs.existsSync(p));
      const rest = line.replace(imgPathMatch[0], '').replace(/^\s*—\s*/, '').trim();
      if (found) {
        const url = pathToFileURL(found).href;
        out.push(
          `<figure><img src="${url}" alt="${escapeHtml(path.basename(found))}" /><figcaption>${inline(rest || path.basename(found))}</figcaption></figure>`,
        );
      } else {
        out.push(`<p>${inline(line)}</p>`);
      }
      continue;
    }

    closeLists();
    out.push(`<p>${inline(line)}</p>`);
  }
  closeLists();
  if (inCode) {
    out.push(`<pre><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>`);
  }
  return out.join('\n');
}

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(stem)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
           font-size: 11pt; line-height: 1.45; color: #111; margin: 0; padding: 24px; }
    h1 { font-size: 20pt; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
    h2 { font-size: 14pt; margin-top: 1.4em; }
    h3 { font-size: 12pt; margin-top: 1.1em; }
    code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 9.5pt; }
    pre { background: #f6f8fa; padding: 10px; border-radius: 6px; overflow: hidden; }
    code { background: #f6f8fa; padding: 1px 4px; border-radius: 4px; }
    figure { margin: 16px 0; page-break-inside: avoid; }
    img { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; }
    figcaption { font-size: 9pt; color: #555; margin-top: 6px; }
    a { color: #0969da; }
    ul, ol { padding-left: 1.3em; }
  </style>
</head>
<body>
${mdToHtml(md)}
</body>
</html>`;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' },
});
await browser.close();
console.log(`Wrote ${pdfPath}`);

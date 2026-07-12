// Export: PNG (jeden / všechny do ZIP) + JSON
import { renderSlideElement } from './render.js';
import { download, toast } from './util.js';

const W = 1080, H = 1350;

function slug(s) {
  return (s || 'carousel').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'carousel';
}

async function renderToStage(project, index) {
  const stage = document.getElementById('exportStage');
  stage.innerHTML = '';
  const node = renderSlideElement(project, index);
  node.style.width = W + 'px'; node.style.height = H + 'px';
  stage.append(node);
  await document.fonts.ready;
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  return node;
}

async function toBlob(node, scale) {
  return window.htmlToImage.toBlob(node, {
    width: W, height: H, pixelRatio: scale, cacheBust: true,
    style: { transform: 'none', margin: '0' },
  });
}

export async function exportSlide(project, index, scale = 2) {
  const node = await renderToStage(project, index);
  const blob = await toBlob(node, scale);
  document.getElementById('exportStage').innerHTML = '';
  download(`${slug(project.title)}-${String(index + 1).padStart(2, '0')}.png`, blob);
  toast(`Slajd ${index + 1} exportován`);
}

export async function exportAll(project, scale = 2, onProgress) {
  if (!window.JSZip) { toast('JSZip se nenačetl'); return; }
  const zip = new window.JSZip();
  for (let i = 0; i < project.slides.length; i++) {
    onProgress?.(i + 1, project.slides.length);
    const node = await renderToStage(project, i);
    const blob = await toBlob(node, scale);
    zip.file(`${slug(project.title)}-${String(i + 1).padStart(2, '0')}.png`, blob);
  }
  document.getElementById('exportStage').innerHTML = '';
  const out = await zip.generateAsync({ type: 'blob' });
  download(`${slug(project.title)}.zip`, out);
  toast('Vše exportováno do ZIP');
}

export function exportJSON(project) {
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
  download(`${slug(project.title)}.json`, blob);
  toast('Projekt uložen (JSON)');
}

export function importJSON(file, cb) {
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const p = JSON.parse(rd.result);
      if (!p || !Array.isArray(p.slides)) throw new Error('bad');
      cb(p); toast('Projekt načten');
    } catch { toast('Neplatný JSON'); }
  };
  rd.readAsText(file);
}

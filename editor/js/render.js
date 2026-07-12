// Vykreslení jednoho slajdu do skutečného DOM elementu (1080×1350)
import { TYPES } from './templates.js';

export function computeCtx(project, index) {
  const slides = project.slides;
  const s = slides[index];
  const glossIdxs = slides.map((x, i) => (x.type === 'gloss' ? i : -1)).filter(i => i >= 0);
  const groupTotal = glossIdxs.length;
  const group = glossIdxs.indexOf(index) + 1;
  const themed = TYPES[s.type].themed;
  const theme = themed ? (s.theme || 'chalk') : (s.type === 'cover' ? 'cover' : 'dark');
  return { page: index + 1, total: slides.length, group, groupTotal, logo: project.logo || 'FA', theme };
}

export function renderSlideElement(project, index) {
  const s = project.slides[index];
  const ctx = computeCtx(project, index);
  const { cls, html } = TYPES[s.type].render(s, ctx);
  const div = document.createElement('div');
  div.className = 'slide grain ' + cls;
  div.innerHTML = html;
  return div;
}

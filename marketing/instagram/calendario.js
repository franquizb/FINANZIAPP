// Calendario y textos de una semana de consejos, en HTML para importarlo como
// Google Doc (los emojis van como entidades numéricas: así no se estropean).
// Uso: node calendario.js <semana> <AAAA-MM-DD del primer día>  > salida.html
const { rellenar } = require('./consejos');
const semana = process.argv[2] || '1';
const inicio = new Date((process.argv[3] || '2026-11-09') + 'T12:00:00Z');
const consejos = require(`./consejos-semana-${semana}.js`);

const ent = (s) => [...s].map(ch => { const c = ch.codePointAt(0); return c > 127 ? `&#${c};` : ch; }).join('');
const esc = (s) => ent(String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
const parrafos = (txt) => txt.split('\n\n').map(p => `<p>${p.split('\n').map(esc).join('<br>')}</p>`).join('');
const fecha = (d) => d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

let html = `<html><head><meta charset="utf-8"></head><body>
<h1>${esc(`Calendario y textos — Semana ${semana}`)}</h1>
<p>${esc('Un consejo al día en TikTok (@finanziapp en inglés y @finanziapp.es en español) y como Reel en Instagram. Archivos de cada día en la carpeta')} <b>${esc(`Semana ${semana}`)}</b> ${esc('(subcarpetas EN y ES): el vídeo .mp4, la portada -portada.jpg y la imagen del feed -feed.jpg.')}</p>
<p><b>${esc('Horas:')}</b> ${esc('inglés hacia las 12:00 o 19:00 de Nueva York · español entre las 19:00 y las 21:00 de España. Añade un sonido de la biblioteca comercial a volumen bajo.')}</p>`;
consejos.forEach((c, i) => {
  const d = new Date(inicio.getTime() + i * 86400000);
  const en = rellenar(c, 'en'), es = rellenar(c, 'es');
  const nombre = `dia-${String(i + 1).padStart(2, '0')}-${c.slug}`;
  const titulo = (t) => t.gancho.join(' ').replace(/<\/?em>/g, '');
  html += `<hr><h2>${esc(`${fecha(d)} · Día ${i + 1}`)}</h2>
<p><b>${esc('Archivos:')}</b> ${esc(`${nombre}.mp4 · ${nombre}-portada.jpg · ${nombre}-feed.jpg`)}</p>
<h3>${esc(`🇺🇸 English — ${titulo(en)}`)}</h3>${parrafos(en.texto)}<p>${esc(en.hashtags.join(' '))}</p>
<h3>${esc(`🇪🇸 Español — ${titulo(es)}`)}</h3>${parrafos(es.texto)}<p>${esc(es.hashtags.join(' '))}</p>`;
});
html += '</body></html>';
process.stdout.write(html);

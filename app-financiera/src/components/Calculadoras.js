// ─── CALCULADORAS FINANCIERAS ────────────────────────────────────────────────
// Panel de calculadoras de la sección "Análisis". Son simulaciones: no leen ni
// escriben los datos del usuario. Cada calculadora es un componente propio y el
// panel (Calculadoras) decide cuál se muestra.
import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Line, BarChart, Bar, Cell, ReferenceLine
} from 'recharts';
import { useApp, getLocale, getMoneda } from '../context/AppContext';

// ─── Formato ─────────────────────────────────────────────────────────────────
const fin = (v) => (Number.isFinite(v) ? v : 0);
const fmt = (v, dec = 2) => fin(v).toLocaleString(getLocale(), { style: 'currency', currency: getMoneda(), minimumFractionDigits: dec, maximumFractionDigits: dec });
const pct = (v, dec = 1) => `${fin(v).toFixed(dec)} %`;
const num = (v, dec = 2) => fin(v).toLocaleString(getLocale(), { maximumFractionDigits: dec });
const compacto = (v) => new Intl.NumberFormat(getLocale(), { notation: 'compact', maximumFractionDigits: 1 }).format(fin(v));

// ─── Piezas de interfaz ──────────────────────────────────────────────────────
const Icono = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {String(d).split('|').map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const Campo = ({ label, ayuda, children, span }) => (
  <div style={{ gridColumn: span ? '1 / -1' : 'auto' }}>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</label>
    {children}
    {ayuda && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{ayuda}</div>}
  </div>
);

// Entrada numérica con botones − / +.
const Stepper = ({ value, onChange, min = 0, max = Infinity, step = 1, decimales = 2 }) => {
  const fija = (v) => Math.max(min, Math.min(max, Number.isFinite(v) ? v : min));
  const redondea = (v) => parseFloat(v.toFixed(decimales));
  const btn = { width: 40, flexShrink: 0, border: 'none', background: 'transparent', color: 'var(--text-secondary)', fontSize: 18, cursor: 'pointer' };
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-input)', height: 44 }}>
      <button type="button" style={btn} onClick={() => onChange(redondea(fija(value - step)))} aria-label="−">−</button>
      <input type="number" step={step} value={value} onChange={e => onChange(fija(parseFloat(e.target.value)))}
        style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', color: 'var(--text-primary)', textAlign: 'center', fontSize: 15, fontWeight: 700, outline: 'none' }} />
      <button type="button" style={btn} onClick={() => onChange(redondea(fija(value + step)))} aria-label="+">+</button>
    </div>
  );
};

const Selector = ({ value, onChange, opciones }) => (
  <select className="select-input" value={value} onChange={e => onChange(e.target.value)} style={{ height: 44 }}>
    {opciones.map(([v, etiqueta]) => <option key={v} value={v}>{etiqueta}</option>)}
  </select>
);

const Interruptor = ({ activo, onChange, label }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)', userSelect: 'none' }}>
    <span onClick={() => onChange(!activo)} style={{ width: 42, height: 24, borderRadius: 12, background: activo ? 'var(--accent)' : 'var(--bg-input)', border: '1px solid var(--border)', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 2, left: activo ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.3)' }} />
    </span>
    <span onClick={() => onChange(!activo)}>{label}</span>
  </label>
);

// Fila del panel de resultados.
const Resultado = ({ label, valor, color, sub, grande, atenuado }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border)', opacity: atenuado ? 0.7 : 1 }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
    </div>
    <div style={{ fontSize: grande ? 26 : 18, fontWeight: 900, color: color || 'var(--text-primary)', whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}>{valor}</div>
  </div>
);

const Nota = ({ children }) => <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.5 }}>{children}</div>;

const useTema = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  return {
    isDark,
    tooltip: { backgroundColor: isDark ? '#1e2130' : '#fff', border: `1px solid ${isDark ? '#2d3148' : '#e2e5f0'}`, borderRadius: 8, fontSize: 12 },
    eje: isDark ? '#565d80' : '#9098b8',
    rejilla: isDark ? '#2d3148' : '#e2e5f0'
  };
};

// Disposición común: formulario a la izquierda, resultados a la derecha, y debajo lo que cada calculadora añada.
const Disposicion = ({ formulario, resultados, children }) => (
  <div className="section-gap">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
      <div className="card">{formulario}</div>
      <div className="card" style={{ background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-secondary) 100%)' }}>{resultados}</div>
    </div>
    {children}
  </div>
);

const Formulario = ({ children }) => <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>{children}</div>;

// ─── Numérica ────────────────────────────────────────────────────────────────
// Generador determinista (mulberry32): "otra trayectoria" cambia la semilla y
// la misma semilla reproduce siempre la misma simulación.
const generador = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const normalEstandar = (r) => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());

// TIR mensual por bisección sobre una lista de flujos (negativo = aportar).
const tirMensual = (flujos) => {
  if (!flujos.some(f => f < 0) || !flujos.some(f => f > 0)) return null;
  const van = (i) => flujos.reduce((s, f, k) => s + f / Math.pow(1 + i, k), 0);
  let lo = -0.5, hi = 0.5;
  if (van(lo) * van(hi) > 0) return null;
  for (let k = 0; k < 100; k++) { const mid = (lo + hi) / 2; if (van(lo) * van(mid) <= 0) hi = mid; else lo = mid; }
  return (lo + hi) / 2;
};

// Frecuencia de las aportaciones: cada cuántos meses se aporta y cuántas
// aportaciones entran en ese mes. Las más frecuentes que el mes (diaria,
// semanal, quincenal) se agrupan por mes: 365, 52 y 26 aportaciones al año.
const FRECUENCIAS = {
  diaria: { cadaMeses: 1, porMes: 365 / 12 },
  semanal: { cadaMeses: 1, porMes: 52 / 12 },
  quincenal: { cadaMeses: 1, porMes: 26 / 12 },
  mensual: { cadaMeses: 1, porMes: 1 },
  trimestral: { cadaMeses: 3, porMes: 1 },
  anual: { cadaMeses: 12, porMes: 1 }
};
const frecuenciaDe = (f) => FRECUENCIAS[f] || { cadaMeses: parseInt(f) || 1, porMes: 1 };

// Simulación mes a mes del interés compuesto con aportaciones, retiradas e
// (opcionalmente) rentabilidad aleatoria de media la esperada.
const simularCompuesto = (p, seed) => {
  const meses = Math.max(1, Math.round(p.anios * 12));
  const r = p.rentabilidad / 100;
  const factorMes = p.capitalizacion === 'mensual' ? 1 + r / 12 : Math.pow(1 + r, 1 / 12);
  const sigmaMes = (p.volatilidad / 100) / Math.sqrt(12);
  const muMes = Math.log(factorMes) - sigmaMes * sigmaMes / 2;
  const azar = p.modelo === 'volatil' ? generador(seed) : null;
  const { cadaMeses: cadaN, porMes } = frecuenciaDe(p.frecuencia);
  const inflacion = (p.inflacion || 0) / 100;

  let balance = p.inicial, aportado = p.inicial, retirado = 0, rendimientoAcum = 0;
  let aportadoAnio = 0, rendAnio = 0, retiradoAnio = 0;
  let agotadoEn = null, cruceEn = null;
  const flujos = [-p.inicial];
  const filas = [{ anio: 0, aportadoAnio: p.inicial, aportadoAcum: p.inicial, rendAnio: 0, rendAcum: 0, retiradasAnio: 0, balance: p.inicial }];

  for (let m = 1; m <= meses; m++) {
    const anio = Math.ceil(m / 12);
    const factor = azar ? Math.exp(muMes + sigmaMes * normalEstandar(azar)) : factorMes;
    const rend = balance * (factor - 1);
    balance += rend; rendimientoAcum += rend; rendAnio += rend;

    let ap = 0;
    const aportando = p.detenerTras <= 0 || anio <= p.detenerTras;
    if (aportando && p.aportacion > 0 && m % cadaN === 0) {
      ap = p.aportacion * porMes * (p.aportaciones === 'crecientes' ? Math.pow(1 + (p.crecimientoAportacion || 0) / 100, anio - 1) : 1);
    }
    let ret = 0;
    if (p.retiradaDesde > 0 && anio >= p.retiradaDesde && p.retiradaMensual > 0) {
      ret = Math.min(p.retiradaMensual * Math.pow(1 + inflacion, anio - 1), Math.max(0, balance + ap));
    }
    balance += ap - ret; aportado += ap; retirado += ret; aportadoAnio += ap; retiradoAnio += ret;
    flujos.push(-ap + ret);
    if (agotadoEn === null && p.retiradaDesde > 0 && balance <= 0.005) agotadoEn = anio;
    if (cruceEn === null && rendimientoAcum > aportado && aportado > 0) cruceEn = anio;
    if (m % 12 === 0 || m === meses) {
      filas.push({ anio, aportadoAnio, aportadoAcum: aportado, rendAnio, rendAcum: rendimientoAcum, retiradasAnio: retiradoAnio, balance: Math.max(0, balance) });
      aportadoAnio = 0; rendAnio = 0; retiradoAnio = 0;
    }
  }
  flujos[flujos.length - 1] += Math.max(0, balance);
  const tirM = tirMensual(flujos);
  return {
    filas, final: Math.max(0, balance), aportado, retirado, rendimiento: rendimientoAcum,
    ganancia: Math.max(0, balance) + retirado - aportado,
    agotadoEn, cruceEn,
    tirAnual: tirM === null ? null : (Math.pow(1 + tirM, 12) - 1) * 100,
    finalReal: Math.max(0, balance) / Math.pow(1 + inflacion, p.anios)
  };
};

// Sistema francés con pagos extra (mensual recurrente y/o único en un mes).
const cuadroPrestamo = (importe, interes, meses, extraMensual = 0, extraUnico = 0, extraUnicoMes = 0) => {
  const i = interes / 100 / 12;
  const cuota = i > 0 ? importe * i / (1 - Math.pow(1 + i, -meses)) : importe / meses;
  let pendiente = importe, totalInt = 0;
  const filas = [];
  for (let n = 1; n <= meses && pendiente > 0.005; n++) {
    const int = pendiente * i;
    const cap = Math.min(Math.max(cuota - int, 0), pendiente);
    pendiente -= cap; totalInt += int;
    let extra = 0;
    if (extraMensual > 0) { const e = Math.min(extraMensual, pendiente); extra += e; pendiente -= e; }
    if (extraUnico > 0 && n === extraUnicoMes) { const e = Math.min(extraUnico, pendiente); extra += e; pendiente -= e; }
    filas.push({ n, int, cap, extra, pendiente });
  }
  return { cuota, totalInt, meses: filas.length, totalPagado: importe + totalInt, filas };
};

// ─── 1. Interés compuesto ────────────────────────────────────────────────────
function InteresCompuesto() {
  const { t, tf } = useApp();
  const tema = useTema();
  const [p, setP] = useState({
    inicial: 10000, aportacion: 300, frecuencia: 'mensual', rentabilidad: 7, capitalizacion: 'anual', anios: 20,
    modelo: 'fijo', volatilidad: 15, aportaciones: 'constantes', crecimientoAportacion: 2, detenerTras: 0,
    retiradas: false, retiradaDesde: 15, retiradaMensual: 1000, inflacion: 2
  });
  const [seed, setSeed] = useState(12345);
  const [modoTabla, setModoTabla] = useState('anual');
  const set = (k) => (v) => setP(prev => ({ ...prev, [k]: v }));
  const params = useMemo(() => ({ ...p, retiradaDesde: p.retiradas ? p.retiradaDesde : 0 }), [p]);

  // Trayectoria mostrada en el gráfico (en el modelo fijo es la única).
  const mostrada = useMemo(() => simularCompuesto(params, seed), [params, seed]);
  // Con rentabilidad volátil, 200 simulaciones para dar un rango (10 %, mediana,
  // 90 %) y una trayectoria representativa: la que termina más cerca de la
  // mediana. El panel de resultados usa esa, no la aleatoria del gráfico, para
  // que una trayectoria con suerte (o sin ella) no se lea como "el" resultado.
  const bandas = useMemo(() => {
    if (params.modelo !== 'volatil') return null;
    const N = 200;
    const sims = [];
    const porAnio = Array.from({ length: Math.ceil(params.anios) + 1 }, () => []);
    for (let k = 0; k < N; k++) {
      const s = simularCompuesto(params, 1000 + k * 7919);
      sims.push(s);
      s.filas.forEach(f => { if (porAnio[f.anio]) porAnio[f.anio].push(f.balance); });
    }
    const q = (arr, c) => { const a = [...arr].sort((x, y) => x - y); return a.length ? a[Math.min(a.length - 1, Math.floor(c * a.length))] : 0; };
    const finales = sims.map(s => s.final);
    const finalP50 = q(finales, 0.50);
    const representativa = sims.reduce((mejor, s) => Math.abs(s.final - finalP50) < Math.abs(mejor.final - finalP50) ? s : mejor, sims[0]);
    return {
      p10: porAnio.map(a => q(a, 0.10)), p50: porAnio.map(a => q(a, 0.50)), p90: porAnio.map(a => q(a, 0.90)),
      finalP10: q(finales, 0.10), finalP50, finalP90: q(finales, 0.90), N, representativa,
      agotadas: sims.filter(s => s.agotadoEn !== null).length
    };
  }, [params]);
  const r = bandas ? bandas.representativa : mostrada;

  const datosGrafico = mostrada.filas.map((f, i) => ({
    anio: f.anio, balance: Math.round(f.balance), aportado: Math.round(f.aportadoAcum),
    ...(bandas ? { p10: Math.round(bandas.p10[i] || 0), p50: Math.round(bandas.p50[i] || 0), p90: Math.round(bandas.p90[i] || 0) } : {})
  }));
  const pctInicial = r.final > 0 ? (p.inicial / r.final) * 100 : 0;
  const gananciaPct = r.aportado > 0 ? (r.ganancia / r.aportado) * 100 : 0;

  const formulario = (
    <Formulario>
      <Campo label={t.ciInversionInicial} span><Stepper value={p.inicial} onChange={set('inicial')} step={500} decimales={2} /></Campo>
      <Campo label={t.ciAportacion}><Stepper value={p.aportacion} onChange={set('aportacion')} step={50} /></Campo>
      <Campo label={t.ciFrecuencia} ayuda={['diaria', 'semanal', 'quincenal'].includes(p.frecuencia) ? t.ciFrecuenciaAyuda : null}>
        <Selector value={p.frecuencia} onChange={set('frecuencia')} opciones={[['diaria', t.ciDiaria], ['semanal', t.ciSemanal], ['quincenal', t.ciQuincenal], ['mensual', t.ciMensual], ['trimestral', t.ciTrimestral], ['anual', t.ciAnual]]} />
      </Campo>
      <Campo label={t.ciRentabilidad}><Stepper value={p.rentabilidad} onChange={set('rentabilidad')} min={-50} max={100} step={0.5} decimales={2} /></Campo>
      <Campo label={t.ciCapitalizacion}><Selector value={p.capitalizacion} onChange={set('capitalizacion')} opciones={[['anual', t.ciAnual], ['mensual', t.ciMensual]]} /></Campo>
      <Campo label={t.ciAnios}><Stepper value={p.anios} onChange={set('anios')} min={1} max={60} step={1} decimales={0} /></Campo>
      <Campo label={t.ciInflacion} ayuda={t.ciInflacionAyuda}><Stepper value={p.inflacion} onChange={set('inflacion')} min={0} max={30} step={0.5} decimales={2} /></Campo>
      <Campo label={t.ciModelo}><Selector value={p.modelo} onChange={set('modelo')} opciones={[['fijo', t.ciFijo], ['volatil', t.ciVolatil]]} /></Campo>
      {p.modelo === 'volatil' && (
        <>
          <Campo label={t.ciVolatilidad}><Stepper value={p.volatilidad} onChange={set('volatilidad')} min={0} max={80} step={1} decimales={1} /></Campo>
          <Campo label={t.ciTrayectoria}>
            <button type="button" className="btn btn-ghost" style={{ height: 44, width: '100%' }} onClick={() => setSeed(Math.floor(Math.random() * 1e9))}>🎲 {t.ciAleatorizar}</button>
          </Campo>
        </>
      )}
      <Campo label={t.ciAportaciones}><Selector value={p.aportaciones} onChange={set('aportaciones')} opciones={[['constantes', t.ciConstantes], ['crecientes', t.ciCrecientes]]} /></Campo>
      {p.aportaciones === 'crecientes' && <Campo label={t.ciCrecimientoAportacion}><Stepper value={p.crecimientoAportacion} onChange={set('crecimientoAportacion')} min={0} max={50} step={0.5} decimales={2} /></Campo>}
      <Campo label={t.ciDetener} ayuda={t.ciDetenerAyuda}><Stepper value={p.detenerTras} onChange={set('detenerTras')} min={0} max={60} step={1} decimales={0} /></Campo>
      <div style={{ gridColumn: '1 / -1', paddingTop: 6 }}>
        <Interruptor activo={p.retiradas} onChange={set('retiradas')} label={t.ciRetiradas} />
      </div>
      {p.retiradas && (
        <>
          <Campo label={t.ciRetiradaDesde}><Stepper value={p.retiradaDesde} onChange={set('retiradaDesde')} min={1} max={60} step={1} decimales={0} /></Campo>
          <Campo label={t.ciRetiradaMensual} ayuda={t.ciRetiradaAyuda}><Stepper value={p.retiradaMensual} onChange={set('retiradaMensual')} step={100} /></Campo>
        </>
      )}
    </Formulario>
  );

  const resultados = (
    <div>
      <Resultado label={bandas ? tf('ciValorFinalMediana', { n: bandas.N }) : t.ciValorFinal} valor={fmt(r.final, 0)} color="var(--accent)" grande
        sub={bandas ? `${t.ciPesimista}: ${fmt(bandas.finalP10, 0)} · ${t.ciOptimista}: ${fmt(bandas.finalP90, 0)}` : (p.inflacion > 0 ? `${t.ciValorFinalReal}: ${fmt(r.finalReal, 0)}` : null)} />
      {bandas && <Resultado label={t.ciTrayectoriaMostrada} valor={fmt(mostrada.final, 0)} atenuado sub={p.inflacion > 0 ? `${t.ciValorFinalReal} (${t.ciMedianaCorta}): ${fmt(r.finalReal, 0)}` : null} />}
      {bandas && p.retiradas && bandas.agotadas > 0 && <Resultado label={t.ciProbAgotar} valor={pct(bandas.agotadas / bandas.N * 100, 0)} color="var(--red)" atenuado />}
      <Resultado label={t.ciTotalInvertido} valor={fmt(r.aportado, 0)} sub={`${t.ciInversionInicial.replace(/\s*\([^)]*\)\s*$/, '')}: ${fmt(p.inicial, 0)} · ${t.ciAportadoTotal}: ${fmt(r.aportado - p.inicial, 0)}`} />
      <Resultado label={t.ciInicialPct} valor={pct(pctInicial)} atenuado />
      <Resultado label={t.ciGananciaTotal} valor={fmt(r.ganancia, 0)} color={r.ganancia >= 0 ? 'var(--green)' : 'var(--red)'} />
      <Resultado label={t.ciGananciaPct} valor={pct(gananciaPct)} atenuado />
      <Resultado label={t.ciTirInversion} valor={r.tirAnual === null ? '—' : pct(r.tirAnual, 2)} atenuado />
      {p.retiradas && <Resultado label={t.ciRetiradasTotal} valor={fmt(r.retirado, 0)} color="var(--blue)" />}
      <Resultado label={t.ciCruce} valor={r.cruceEn ? tf('ciCruceAnio', { n: r.cruceEn }) : t.ciCruceNunca} atenuado />
      {r.agotadoEn !== null && <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 10, background: 'rgba(220,38,38,.10)', border: '1px solid rgba(220,38,38,.45)', fontSize: 12 }}>⚠️ {tf('ciAgotado', { n: r.agotadoEn })}</div>}
      <Nota>{t.ciNota}</Nota>
    </div>
  );

  const filasTabla = r.filas;

  return (
    <Disposicion formulario={formulario} resultados={resultados}>
      <div className="chart-card" style={{ height: 380 }}>
        <div className="chart-card-title">{t.ciGrafico}</div>
        <ResponsiveContainer width="100%" height="88%">
          <ComposedChart data={datosGrafico}>
            <defs>
              <linearGradient id="ciBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={tema.rejilla} strokeOpacity={0.5} vertical={false} />
            <XAxis dataKey="anio" stroke={tema.eje} tick={{ fontSize: 11 }} />
            <YAxis stroke={tema.eje} tick={{ fontSize: 11 }} tickFormatter={compacto} />
            <Tooltip contentStyle={tema.tooltip} formatter={v => fmt(v, 0)} labelFormatter={a => `${t.ciAnios} ${a}`} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {bandas && <Line type="monotone" dataKey="p90" name={t.ciLeyendaP90} stroke="var(--green)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />}
            {bandas && <Line type="monotone" dataKey="p50" name={t.ciLeyendaMediana} stroke="var(--text-secondary)" strokeWidth={1.5} strokeDasharray="6 3" dot={false} />}
            {bandas && <Line type="monotone" dataKey="p10" name={t.ciLeyendaP10} stroke="var(--red)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />}
            <Area type="monotone" dataKey="balance" name={bandas ? t.ciLeyendaTrayectoria : t.ciLeyendaTotal} stroke="var(--accent)" strokeWidth={3} fill="url(#ciBalance)" />
            <Line type="monotone" dataKey="aportado" name={t.ciLeyendaAportado} stroke="var(--text-muted)" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
          <div className="chart-card-title" style={{ marginBottom: 0 }}>{t.ciTabla}</div>
          <div className="settings-toggle">
            <button className={`settings-toggle-btn ${modoTabla === 'anual' ? 'active' : ''}`} onClick={() => setModoTabla('anual')}>{t.annual}</button>
            <button className={`settings-toggle-btn ${modoTabla === 'resumen' ? 'active' : ''}`} onClick={() => setModoTabla('resumen')}>{t.ciCadaCinco}</button>
          </div>
        </div>
        <div className="table-wrap" style={{ maxHeight: 420, overflowY: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>{t.ciColAnio}</th>
                <th className="text-right">{t.ciColAportado}</th>
                <th className="text-right">{t.ciColAportadoAcum}</th>
                <th className="text-right">{t.ciColInteresAnio}</th>
                <th className="text-right">{t.ciColInteresAcum}</th>
                {p.retiradas && <th className="text-right">{t.ciColRetiradas}</th>}
                <th className="text-right">{t.ciColBalance}</th>
              </tr>
            </thead>
            <tbody>
              {filasTabla.filter(f => modoTabla === 'anual' || f.anio % 5 === 0 || f.anio === r.filas.length - 1).map(f => (
                <tr key={f.anio}>
                  <td style={{ fontWeight: 700 }}>{f.anio === 0 ? t.initialStart : f.anio}</td>
                  <td className="text-right">{fmt(f.aportadoAnio, 0)}</td>
                  <td className="text-right">{fmt(f.aportadoAcum, 0)}</td>
                  <td className="text-right" style={{ color: f.rendAnio >= 0 ? 'var(--green)' : 'var(--red)' }}>{fmt(f.rendAnio, 0)}</td>
                  <td className="text-right" style={{ color: f.rendAcum >= 0 ? 'var(--green)' : 'var(--red)' }}>{fmt(f.rendAcum, 0)}</td>
                  {p.retiradas && <td className="text-right" style={{ color: 'var(--blue)' }}>{fmt(f.retiradasAnio, 0)}</td>}
                  <td className="text-right" style={{ fontWeight: 800, color: 'var(--accent)' }}>{fmt(f.balance, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Disposicion>
  );
}

// ─── 2. Hipoteca y préstamos ─────────────────────────────────────────────────
function Hipoteca() {
  const { t, tf } = useApp();
  const tema = useTema();
  const [p, setP] = useState({ importe: 180000, interes: 3.2, plazo: 25, extraMensual: 0, extraUnico: 0, extraUnicoMes: 12 });
  const set = (k) => (v) => setP(prev => ({ ...prev, [k]: v }));
  const meses = Math.max(1, Math.round(p.plazo * 12));
  const base = useMemo(() => cuadroPrestamo(p.importe, p.interes, meses), [p.importe, p.interes, meses]);
  const conExtras = useMemo(() => cuadroPrestamo(p.importe, p.interes, meses, p.extraMensual, p.extraUnico, p.extraUnicoMes), [p, meses]);
  const hayExtras = p.extraMensual > 0 || p.extraUnico > 0;
  const duracion = (n) => tf('hiAniosMeses', { a: Math.floor(n / 12), m: n % 12 });

  const datos = Array.from({ length: Math.ceil(meses / 12) + 1 }, (_, a) => {
    const idx = a * 12 - 1;
    return { anio: a, base: a === 0 ? p.importe : Math.round(base.filas[idx]?.pendiente ?? 0), extras: a === 0 ? p.importe : Math.round(conExtras.filas[idx]?.pendiente ?? 0) };
  });
  const primerAnio = base.filas.slice(0, 12).reduce((s, f) => ({ int: s.int + f.int, cap: s.cap + f.cap }), { int: 0, cap: 0 });

  const formulario = (
    <Formulario>
      <Campo label={t.hiImporte} span><Stepper value={p.importe} onChange={set('importe')} step={5000} decimales={0} /></Campo>
      <Campo label={t.hiInteres}><Stepper value={p.interes} onChange={set('interes')} min={0} max={30} step={0.1} decimales={2} /></Campo>
      <Campo label={t.hiPlazo}><Stepper value={p.plazo} onChange={set('plazo')} min={1} max={50} step={1} decimales={0} /></Campo>
      <div style={{ gridColumn: '1 / -1', fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginTop: 6 }}>{t.hiAmortizarAntes}</div>
      <Campo label={t.hiExtraMensual} span><Stepper value={p.extraMensual} onChange={set('extraMensual')} step={50} decimales={0} /></Campo>
      <Campo label={t.hiExtraUnico}><Stepper value={p.extraUnico} onChange={set('extraUnico')} step={1000} decimales={0} /></Campo>
      <Campo label={t.hiExtraUnicoMes}><Stepper value={p.extraUnicoMes} onChange={set('extraUnicoMes')} min={1} max={meses} step={1} decimales={0} /></Campo>
    </Formulario>
  );
  const resultados = (
    <div>
      <Resultado label={t.hiCuota} valor={fmt(base.cuota)} color="var(--accent)" grande />
      <Resultado label={t.hiTotalIntereses} valor={fmt(base.totalInt, 0)} color="var(--red)" sub={`${t.hiTotalPagado}: ${fmt(base.totalPagado, 0)}`} />
      <Resultado label={t.hiDuracion} valor={duracion(base.meses)} atenuado />
      {hayExtras && (
        <>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--green)', marginTop: 16, textTransform: 'uppercase', letterSpacing: '.05em' }}>{t.hiConExtras}</div>
          <Resultado label={t.hiTotalIntereses} valor={fmt(conExtras.totalInt, 0)} sub={`${t.hiTotalPagado}: ${fmt(conExtras.totalPagado, 0)}`} />
          <Resultado label={t.hiAhorroIntereses} valor={fmt(base.totalInt - conExtras.totalInt, 0)} color="var(--green)" />
          <Resultado label={t.hiDuracion} valor={duracion(conExtras.meses)} sub={tf('hiMesesMenos', { n: base.meses - conExtras.meses })} />
        </>
      )}
      <Nota>{t.hiNota}</Nota>
    </div>
  );
  return (
    <Disposicion formulario={formulario} resultados={resultados}>
      <div className="grid-2">
        <div className="chart-card" style={{ height: 320 }}>
          <div className="chart-card-title">{t.hiGrafico}</div>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={datos}>
              <CartesianGrid stroke={tema.rejilla} strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="anio" stroke={tema.eje} tick={{ fontSize: 11 }} />
              <YAxis stroke={tema.eje} tick={{ fontSize: 11 }} tickFormatter={compacto} />
              <Tooltip contentStyle={tema.tooltip} formatter={v => fmt(v, 0)} labelFormatter={a => `${t.ciAnios} ${a}`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="base" name={t.hiLeyendaBase} stroke="var(--red)" fill="var(--red)" fillOpacity={0.08} strokeWidth={2} />
              {hayExtras && <Area type="monotone" dataKey="extras" name={t.hiLeyendaExtras} stroke="var(--green)" fill="var(--green)" fillOpacity={0.12} strokeWidth={2} />}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card" style={{ height: 320 }}>
          <div className="chart-card-title">{t.hiReparto}</div>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={[{ name: t.hiInteresParte, valor: Math.round(primerAnio.int) }, { name: t.hiCapitalParte, valor: Math.round(primerAnio.cap) }]} layout="vertical" barSize={28}>
              <CartesianGrid stroke={tema.rejilla} strokeOpacity={0.5} horizontal={false} />
              <XAxis type="number" stroke={tema.eje} tick={{ fontSize: 11 }} tickFormatter={compacto} />
              <YAxis type="category" dataKey="name" width={90} stroke={tema.eje} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tema.tooltip} formatter={v => fmt(v, 0)} />
              <Bar dataKey="valor" radius={[0, 6, 6, 0]}>
                <Cell fill="var(--red)" /><Cell fill="var(--green)" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Disposicion>
  );
}

// ─── 3. VPN / TIR ────────────────────────────────────────────────────────────
function VpnTir() {
  const { t, tf } = useApp();
  const [inicial, setInicial] = useState(10000);
  const [descuento, setDescuento] = useState(10);
  const [flujos, setFlujos] = useState([2000, 3000, 4000, 4000, 5000]);
  const cambiarPeriodos = (n) => { n = Math.max(1, Math.min(30, Math.round(n))); const nf = [...flujos]; while (nf.length < n) nf.push(0); setFlujos(nf.slice(0, n)); };
  const vanDe = (tasa) => flujos.reduce((s, f, i) => s + f / Math.pow(1 + tasa / 100, i + 1), -inicial);
  const vpn = vanDe(descuento);
  const tir = (() => { let lo = -99, hi = 500; for (let k = 0; k < 100; k++) { const mid = (lo + hi) / 2; if (vanDe(mid) > 0) lo = mid; else hi = mid; } return (lo + hi) / 2; })();
  const estado = vpn > 0.01 ? { color: 'var(--green)', icono: '🟢', msg: t.proyectoRentable } : vpn < -0.01 ? { color: 'var(--red)', icono: '🔴', msg: t.destruccionValor } : { color: 'var(--accent)', icono: '🟡', msg: t.neutro };

  const formulario = (
    <Formulario>
      <Campo label={t.inversionInicial} span><Stepper value={inicial} onChange={setInicial} step={500} decimales={0} /></Campo>
      <Campo label={t.tasaDescuento}><Stepper value={descuento} onChange={setDescuento} min={0} max={100} step={0.5} decimales={2} /></Campo>
      <Campo label={t.aniosPeriodos}><Stepper value={flujos.length} onChange={cambiarPeriodos} min={1} max={30} step={1} decimales={0} /></Campo>
      <div style={{ gridColumn: '1 / -1', fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginTop: 6 }}>{t.flujosCaja}</div>
      {flujos.map((f, i) => (
        <Campo key={i} label={tf('anioN', { n: i + 1 })}>
          <input type="number" className="text-input" value={f} onChange={e => { const nf = [...flujos]; nf[i] = parseFloat(e.target.value) || 0; setFlujos(nf); }} />
        </Campo>
      ))}
    </Formulario>
  );
  const resultados = (
    <div>
      <Resultado label={t.vpnLargo} valor={fmt(vpn)} color={estado.color} grande />
      <Resultado label={t.tirLargo} valor={pct(tir, 2)} />
      <div style={{ marginTop: 16, padding: '12px 16px', background: `${estado.color}15`, borderRadius: 12, border: `1px solid ${estado.color}30` }}>
        <span style={{ fontSize: 20, marginRight: 8 }}>{estado.icono}</span>
        <span style={{ fontWeight: 600, color: estado.color }}>{estado.msg}</span>
      </div>
      <div style={{ marginTop: 20, fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.queEsVpn}</div>
        <p style={{ margin: '4px 0 10px' }}>{String(t.vpnExplica).replace(/\*\*/g, '')}</p>
        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.queEsTir}</div>
        <p style={{ margin: '4px 0 0' }}>{t.tirExplica} {String(tf('tirComparacion', { tirVal: tir.toFixed(1), tdVal: descuento })).replace(/\*\*/g, '')}</p>
      </div>
    </div>
  );
  return <Disposicion formulario={formulario} resultados={resultados} />;
}

// ─── 4. Independencia financiera (FIRE) ──────────────────────────────────────
function Fire() {
  const { t, tf } = useApp();
  const tema = useTema();
  const [p, setP] = useState({ gastoAnual: 24000, tasa: 4, patrimonio: 60000, aportacionAnual: 12000, rentabilidad: 5, edad: 30, edadObjetivo: 60 });
  const set = (k) => (v) => setP(prev => ({ ...prev, [k]: v }));
  const numero = p.tasa > 0 ? p.gastoAnual / (p.tasa / 100) : Infinity;
  const r = p.rentabilidad / 100;
  const proyeccion = useMemo(() => {
    const filas = [{ anio: 0, edad: p.edad, patrimonio: p.patrimonio }];
    let v = p.patrimonio, aniosHasta = v >= numero ? 0 : null;
    for (let a = 1; a <= 60; a++) {
      v = v * (1 + r) + p.aportacionAnual;
      filas.push({ anio: a, edad: p.edad + a, patrimonio: v });
      if (aniosHasta === null && v >= numero) aniosHasta = a;
    }
    return { filas, aniosHasta };
  }, [p, numero, r]);
  const aniosObjetivo = Math.max(0, p.edadObjetivo - p.edad);
  const coast = numero / Math.pow(1 + r, aniosObjetivo);
  const progreso = Number.isFinite(numero) && numero > 0 ? Math.min(100, (p.patrimonio / numero) * 100) : 0;
  const horizonte = Math.min(60, Math.max(10, (proyeccion.aniosHasta ?? 30) + 5));
  const datos = proyeccion.filas.slice(0, horizonte + 1).map(f => ({ ...f, patrimonio: Math.round(f.patrimonio), objetivo: Math.round(numero) }));

  const formulario = (
    <Formulario>
      <Campo label={t.fiGastoAnual} span><Stepper value={p.gastoAnual} onChange={set('gastoAnual')} step={1000} decimales={0} /></Campo>
      <Campo label={t.fiTasaRetirada}><Stepper value={p.tasa} onChange={set('tasa')} min={0.5} max={15} step={0.25} decimales={2} /></Campo>
      <Campo label={t.fiRentabilidad}><Stepper value={p.rentabilidad} onChange={set('rentabilidad')} min={-20} max={30} step={0.5} decimales={2} /></Campo>
      <Campo label={t.fiPatrimonio}><Stepper value={p.patrimonio} onChange={set('patrimonio')} step={5000} decimales={0} /></Campo>
      <Campo label={t.fiAportacionAnual}><Stepper value={p.aportacionAnual} onChange={set('aportacionAnual')} step={1000} decimales={0} /></Campo>
      <Campo label={t.fiEdad}><Stepper value={p.edad} onChange={set('edad')} min={16} max={99} step={1} decimales={0} /></Campo>
      <Campo label={t.fiEdadObjetivo}><Stepper value={p.edadObjetivo} onChange={set('edadObjetivo')} min={p.edad} max={100} step={1} decimales={0} /></Campo>
    </Formulario>
  );
  const resultados = (
    <div>
      <Resultado label={t.fiNumero} valor={fmt(numero, 0)} color="var(--accent)" grande sub={tf('fiNumeroDesc', { tasa: p.tasa })} />
      <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}><span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{t.fiProgreso}</span><b>{pct(progreso)}</b></div>
        <div style={{ height: 10, background: 'var(--bg-input)', borderRadius: 5, overflow: 'hidden' }}><div style={{ width: `${progreso}%`, height: '100%', background: progreso >= 100 ? 'var(--green)' : 'var(--accent)', borderRadius: 5, transition: 'width .4s' }} /></div>
      </div>
      <Resultado label={t.fiAniosHasta} valor={proyeccion.aniosHasta === null ? '—' : proyeccion.aniosHasta === 0 ? t.fiYaAlcanzado : `${proyeccion.aniosHasta}`}
        color={proyeccion.aniosHasta === 0 ? 'var(--green)' : undefined}
        sub={proyeccion.aniosHasta === null ? t.fiNoAlcanzado : proyeccion.aniosHasta > 0 ? tf('fiEdadFire', { edad: p.edad + proyeccion.aniosHasta }) : null} />
      <Resultado label={t.fiCoast} valor={fmt(coast, 0)} sub={tf('fiCoastDesc', { edad: p.edadObjetivo })} />
      <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 10, fontSize: 12, background: p.patrimonio >= coast ? 'rgba(16,185,129,.10)' : 'var(--bg-secondary)', border: `1px solid ${p.patrimonio >= coast ? 'rgba(16,185,129,.45)' : 'var(--border)'}` }}>
        {p.patrimonio >= coast ? `✅ ${t.fiCoastAlcanzado}` : tf('fiCoastFalta', { x: fmt(coast - p.patrimonio, 0) })}
      </div>
      <Nota>{t.fiNota}</Nota>
    </div>
  );
  return (
    <Disposicion formulario={formulario} resultados={resultados}>
      <div className="chart-card" style={{ height: 340 }}>
        <div className="chart-card-title">{t.fiGrafico}</div>
        <ResponsiveContainer width="100%" height="86%">
          <ComposedChart data={datos}>
            <defs>
              <linearGradient id="fiPat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={tema.rejilla} strokeOpacity={0.5} vertical={false} />
            <XAxis dataKey="edad" stroke={tema.eje} tick={{ fontSize: 11 }} />
            <YAxis stroke={tema.eje} tick={{ fontSize: 11 }} tickFormatter={compacto} />
            <Tooltip contentStyle={tema.tooltip} formatter={v => fmt(v, 0)} labelFormatter={e => `${t.fiEdad}: ${e}`} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="patrimonio" name={t.fiLeyendaPatrimonio} stroke="var(--accent)" strokeWidth={3} fill="url(#fiPat)" />
            <Line type="monotone" dataKey="objetivo" name={t.fiLeyendaObjetivo} stroke="var(--green)" strokeWidth={2} strokeDasharray="6 4" dot={false} />
            {proyeccion.aniosHasta > 0 && <ReferenceLine x={p.edad + proyeccion.aniosHasta} stroke="var(--green)" strokeDasharray="3 3" />}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Disposicion>
  );
}

// ─── 5. Precio medio (DCA) ───────────────────────────────────────────────────
function Dca() {
  const { t } = useApp();
  const [p, setP] = useState({ unidades: 10, precioMedio: 100, aportacion: 500, precioActual: 80, comision: 1 });
  const set = (k) => (v) => setP(prev => ({ ...prev, [k]: v }));
  const calcula = (precio) => {
    const nuevas = precio > 0 ? Math.max(0, p.aportacion - p.comision) / precio : 0;
    const total = p.unidades + nuevas;
    const coste = p.unidades * p.precioMedio + p.aportacion;
    return { nuevas, total, coste, nuevoPM: total > 0 ? coste / total : 0 };
  };
  const r = calcula(p.precioActual);
  const valorActual = r.total * p.precioActual;
  const escenarios = [-20, -10, 0, 10, 20].map(d => { const precio = p.precioActual * (1 + d / 100); return { d, precio, ...calcula(precio) }; });

  const formulario = (
    <Formulario>
      <Campo label={t.dcUnidades}><Stepper value={p.unidades} onChange={set('unidades')} step={1} decimales={4} /></Campo>
      <Campo label={t.dcPrecioMedio}><Stepper value={p.precioMedio} onChange={set('precioMedio')} step={1} decimales={2} /></Campo>
      <Campo label={t.dcNuevaAportacion}><Stepper value={p.aportacion} onChange={set('aportacion')} step={50} decimales={2} /></Campo>
      <Campo label={t.dcPrecioActual}><Stepper value={p.precioActual} onChange={set('precioActual')} step={1} decimales={2} /></Campo>
      <Campo label={t.dcComision}><Stepper value={p.comision} onChange={set('comision')} step={0.5} decimales={2} /></Campo>
    </Formulario>
  );
  const variacion = r.nuevoPM - p.precioMedio;
  const resultados = (
    <div>
      <Resultado label={t.dcNuevoPrecioMedio} valor={fmt(r.nuevoPM)} color="var(--accent)" grande sub={`${t.dcVariacion}: ${variacion >= 0 ? '+' : ''}${fmt(variacion)} (${pct(p.precioMedio > 0 ? variacion / p.precioMedio * 100 : 0)})`} />
      <Resultado label={t.dcNuevasUnidades} valor={num(r.nuevas, 4)} sub={`${t.dcUnidadesTotal}: ${num(r.total, 4)}`} />
      <Resultado label={t.dcCosteTotal} valor={fmt(r.coste)} atenuado />
      <Resultado label={t.dcValorActual} valor={fmt(valorActual)} />
      <Resultado label={t.dcResultado} valor={fmt(valorActual - r.coste)} color={valorActual - r.coste >= 0 ? 'var(--green)' : 'var(--red)'} sub={pct(r.coste > 0 ? (valorActual - r.coste) / r.coste * 100 : 0)} />
      <Nota>{t.dcNota}</Nota>
    </div>
  );
  return (
    <Disposicion formulario={formulario} resultados={resultados}>
      <div className="card">
        <div className="chart-card-title">{t.dcEscenarios}</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>{t.dcPrecioCompra}</th><th className="text-right">{t.dcNuevasUnidades}</th><th className="text-right">{t.dcNuevoPrecioMedio}</th><th className="text-right">{t.dcVariacion}</th></tr></thead>
            <tbody>
              {escenarios.map(e => (
                <tr key={e.d} style={{ fontWeight: e.d === 0 ? 800 : 400 }}>
                  <td>{fmt(e.precio)} <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>({e.d >= 0 ? '+' : ''}{e.d} %)</span></td>
                  <td className="text-right">{num(e.nuevas, 4)}</td>
                  <td className="text-right">{fmt(e.nuevoPM)}</td>
                  <td className="text-right" style={{ color: e.nuevoPM <= p.precioMedio ? 'var(--green)' : 'var(--red)' }}>{e.nuevoPM - p.precioMedio >= 0 ? '+' : ''}{fmt(e.nuevoPM - p.precioMedio)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Disposicion>
  );
}

// ─── 6. Valor intrínseco (DCF) ───────────────────────────────────────────────
const dcfPorAccion = (fcf, g1, g2, gT, d, caja) => {
  const dd = d / 100, tT = gT / 100;
  if (dd <= tT) return null;
  let flujo = fcf, pv = 0;
  for (let a = 1; a <= 10; a++) {
    flujo *= 1 + (a <= 5 ? g1 : g2) / 100;
    pv += flujo / Math.pow(1 + dd, a);
  }
  const terminal = flujo * (1 + tT) / (dd - tT) / Math.pow(1 + dd, 10);
  return { pv, terminal, valor: pv + terminal + caja };
};

function ValorIntrinseco() {
  const { t, tf } = useApp();
  const [p, setP] = useState({ fcf: 5, g1: 10, g2: 5, gT: 2.5, d: 9, caja: 0, precio: 80 });
  const set = (k) => (v) => setP(prev => ({ ...prev, [k]: v }));
  const r = dcfPorAccion(p.fcf, p.g1, p.g2, p.gT, p.d, p.caja);
  const margen = r && r.valor > 0 ? (r.valor - p.precio) / r.valor * 100 : null;
  const implicito = useMemo(() => {
    if (!r || p.precio <= 0) return null;
    let lo = -30, hi = 60;
    const f = (g) => { const x = dcfPorAccion(p.fcf, g, g, p.gT, p.d, p.caja); return x ? x.valor - p.precio : 0; };
    if (f(lo) > 0 || f(hi) < 0) return null;
    for (let k = 0; k < 80; k++) { const mid = (lo + hi) / 2; if (f(mid) < 0) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }, [p, r]);
  const descuentos = [-2, -1, 0, 1, 2].map(x => p.d + x);
  const crecimientos = [-4, -2, 0, 2, 4].map(x => p.g1 + x);

  const formulario = (
    <Formulario>
      <Campo label={t.viFcf} ayuda={t.viFcfAyuda} span><Stepper value={p.fcf} onChange={set('fcf')} min={-1000} step={0.5} decimales={2} /></Campo>
      <Campo label={t.viCrecimiento1}><Stepper value={p.g1} onChange={set('g1')} min={-50} max={100} step={1} decimales={1} /></Campo>
      <Campo label={t.viCrecimiento2}><Stepper value={p.g2} onChange={set('g2')} min={-50} max={100} step={1} decimales={1} /></Campo>
      <Campo label={t.viTerminal}><Stepper value={p.gT} onChange={set('gT')} min={-5} max={10} step={0.5} decimales={2} /></Campo>
      <Campo label={t.viDescuento}><Stepper value={p.d} onChange={set('d')} min={1} max={30} step={0.5} decimales={2} /></Campo>
      <Campo label={t.viCajaNeta} ayuda={t.viCajaAyuda}><Stepper value={p.caja} onChange={set('caja')} min={-10000} step={1} decimales={2} /></Campo>
      <Campo label={t.viPrecio}><Stepper value={p.precio} onChange={set('precio')} step={1} decimales={2} /></Campo>
    </Formulario>
  );
  const resultados = (
    <div>
      {!r ? <div style={{ color: 'var(--red)', fontSize: 13 }}>{t.viInvalido}</div> : (
        <>
          <Resultado label={t.viValor} valor={fmt(r.valor)} color="var(--accent)" grande />
          <Resultado label={t.viMargen} valor={margen === null ? '—' : pct(margen)} color={margen === null ? undefined : margen >= 0 ? 'var(--green)' : 'var(--red)'}
            sub={margen === null ? null : margen >= 0 ? tf('viInfravalorada', { x: Math.abs(margen).toFixed(1) }) : tf('viSobrevalorada', { x: Math.abs(margen).toFixed(1) })} />
          <Resultado label={t.viValorFlujos} valor={fmt(r.pv)} atenuado />
          <Resultado label={t.viValorTerminal} valor={fmt(r.terminal)} atenuado sub={pct(r.valor !== 0 ? r.terminal / r.valor * 100 : 0) + ' ' + t.viDelValor} />
          <Resultado label={t.viCrecimientoImplicito} valor={implicito === null ? '—' : pct(implicito)} sub={t.viCrecimientoImplicitoDesc} />
        </>
      )}
      <Nota>{t.viNota}</Nota>
    </div>
  );
  return (
    <Disposicion formulario={formulario} resultados={resultados}>
      {r && (
        <div className="card">
          <div className="chart-card-title">{t.viMatriz}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{t.viMatrizDesc}</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>{t.viDescuentoCorto} \ {t.viCrecimientoCorto}</th>{crecimientos.map(g => <th key={g} className="text-right">{g.toFixed(1)} %</th>)}</tr></thead>
              <tbody>
                {descuentos.map(d => (
                  <tr key={d}>
                    <td style={{ fontWeight: 700 }}>{d.toFixed(1)} %</td>
                    {crecimientos.map(g => {
                      const x = dcfPorAccion(p.fcf, g, p.g2, p.gT, d, p.caja);
                      const v = x ? x.valor : null;
                      const esBase = d === p.d && g === p.g1;
                      return <td key={g} className="text-right" style={{ fontWeight: esBase ? 900 : 500, color: v === null ? 'var(--text-muted)' : v >= p.precio ? 'var(--green)' : 'var(--red)', background: esBase ? 'var(--accent-light)' : 'transparent' }}>{v === null ? '—' : fmt(v)}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Disposicion>
  );
}

// ─── Panel ───────────────────────────────────────────────────────────────────
const CALCULADORAS = [
  { id: 'compuesto', titulo: 'calcCompuestoTitulo', desc: 'calcCompuestoDesc', Comp: InteresCompuesto, icono: 'M23 6l-9.5 9.5-5-5L1 18|M17 6h6v6' },
  { id: 'hipoteca', titulo: 'calcHipotecaTitulo', desc: 'calcHipotecaDesc', Comp: Hipoteca, icono: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z|M9 22V12h6v10' },
  { id: 'fire', titulo: 'calcFireTitulo', desc: 'calcFireDesc', Comp: Fire, icono: 'M12 2a10 10 0 100 20 10 10 0 000-20z|M12 6a6 6 0 100 12 6 6 0 000-12z|M12 10a2 2 0 100 4 2 2 0 000-4z' },
  { id: 'vpn', titulo: 'calcVpnTitulo', desc: 'calcVpnDesc', Comp: VpnTir, icono: 'M22 12h-4l-3 9L9 3l-3 9H2' },
  { id: 'dca', titulo: 'calcDcaTitulo', desc: 'calcDcaDesc', Comp: Dca, icono: 'M12 2L2 7l10 5 10-5-10-5z|M2 17l10 5 10-5|M2 12l10 5 10-5' },
  { id: 'intrinseco', titulo: 'calcIntrinsecoTitulo', desc: 'calcIntrinsecoDesc', Comp: ValorIntrinseco, icono: 'M21 21H3V3|M7 14l3-3 5 5 6-6|M16 10h5v5' }
];

export default function Calculadoras() {
  const { t } = useApp();
  const [activa, setActiva] = useState(null);
  const def = CALCULADORAS.find(c => c.id === activa);

  if (def) {
    const { Comp } = def;
    return (
      <div className="fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={() => setActiva(null)}>{t.calcVolver}</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-light)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icono d={def.icono} size={18} /></span>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{t[def.titulo]}</h2>
          </div>
        </div>
        <Comp />
      </div>
    );
  }

  return (
    <div className="section-gap fade-in">
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>{t.calcTitulo}</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '6px 0 0' }}>{t.calcIntro}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {CALCULADORAS.map(c => (
          <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer', transition: 'transform .15s, box-shadow .15s' }}
            onClick={() => setActiva(c.id)} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
            <span style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-light)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icono d={c.icono} size={22} /></span>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.01em' }}>{t[c.titulo]}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55, flex: 1 }}>{t[c.desc]}</div>
            <button className="btn btn-ghost" style={{ justifyContent: 'center', marginTop: 4 }} onClick={(e) => { e.stopPropagation(); setActiva(c.id); }}>{t.calcAbrir} →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

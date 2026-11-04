// ─── DATOS DE EJEMPLO PARA CAPTURAS (solo modo demo local) ──────────────────
// Dos perfiles ficticios con cuentas verosímiles para enseñar la interfaz real
// en anuncios y en la web: "Alex" (inglés, USD) y "Lucía" (español, EUR).
// No se usa en producción: DemoApp solo se carga con REACT_APP_DEMO=1.

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const clave = (mk, sub) => `${mk}|${sub}`;

// Generador determinista: las capturas salen siempre iguales.
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
const redondea = (v) => Math.round(v * 100) / 100;

const cuotaFrancesa = (importe, interesAnual, meses) => {
  const i = interesAnual / 100 / 12;
  return i > 0 ? importe * i / (1 - Math.pow(1 + i, -meses)) : importe / meses;
};

// Cada partida: [sección, subcategoría, presupuesto mensual, nº de movimientos al
// mes, notas posibles, variación (0,15 = ±15 %), meses con gasto (null = todos)]
const PERFILES = {
  en: {
    nombre: 'Alex Morgan', email: 'alex@example.com', avatar: '🦊', moneda: 'USD',
    partidas: [
      ['Ingresos', 'Salary', 6750, 1, ['Payroll'], 0],
      ['Ingresos', 'Freelance', 750, 1, ['Design project', 'Consulting', 'Website build'], 0.6],
      ['Ingresos', 'Dividends', 100, 1, ['Quarterly dividends'], 0.1, [2, 5, 8, 11], 300],
      ['Gastos Esenciales', 'Groceries', 650, 4, ['Whole Foods', "Trader Joe's", 'Costco', 'Safeway'], 0.12],
      ['Gastos Esenciales', 'Utilities', 220, 2, ['Electricity', 'Water & gas'], 0.18],
      ['Gastos Esenciales', 'Transportation', 180, 3, ['Gas', 'Parking', 'Car wash'], 0.2],
      ['Gastos Esenciales', 'Insurance', 160, 1, ['Car & home insurance'], 0],
      ['Gastos Esenciales', 'Health', 90, 1, ['Pharmacy', 'Dentist'], 0.4],
      ['Gastos Esenciales', 'Phone & Internet', 110, 1, ['Phone + fiber'], 0],
      ['Gastos Discrecionales', 'Dining Out', 280, 4, ['Sushi night', 'Brunch', 'Pizza', 'Tacos'], 0.25],
      ['Gastos Discrecionales', 'Entertainment', 120, 2, ['Concert', 'Cinema', 'Bowling'], 0.35],
      ['Gastos Discrecionales', 'Shopping', 200, 2, ['Amazon', 'Clothes', 'Home decor'], 0.35],
      ['Gastos Discrecionales', 'Travel', 250, 1, ['Weekend trip', 'Flights', 'Hotel'], 0.2, [3, 6, 7, 11], 750],
      ['Gastos Discrecionales', 'Subscriptions', 45, 3, ['Streaming', 'Music', 'Cloud storage'], 0],
      ['Gastos Discrecionales', 'Gym', 40, 1, ['Gym membership'], 0],
      ['Ahorro e Inversión', 'Emergency Fund', 300, 1, ['Transfer to savings'], 0],
      ['Ahorro e Inversión', 'Index Funds', 600, 1, ['S&P 500 ETF'], 0],
      ['Ahorro e Inversión', 'Retirement (401k)', 500, 1, ['401(k) contribution'], 0]
    ],
    prestamos: [
      { name: 'Mortgage', totalAmount: 260000, interestRate: 5.9, installmentsCount: 360, startDate: '2022-06-01' },
      { name: 'Car Loan', totalAmount: 28000, interestRate: 5.4, installmentsCount: 60, startDate: '2024-03-01' }
    ],
    // Saldo en enero y en diciembre de 2026 (se interpola con algo de ruido).
    activos: { 'Checking': [4300, 5600], 'High-Yield Savings': [21000, 28500], 'Brokerage': [38000, 52500], '401(k)': [61000, 75000], 'Home': [412000, 423000], 'Crypto': [3200, 6100] },
    pasivosManuales: { 'Credit Card': [1450, 620] },
    puntuales: [['Gastos Esenciales', 'Property tax', 1800, ['abril', 'octubre']], ['Gastos Discrecionales', 'Holiday gifts', 600, ['diciembre']]],
    trades: [
      ['2026-01-20', 'AAPL', 'COMPRA', 'Long', 189.5, 15, 1], ['2026-02-12', 'NVDA', 'COMPRA', 'Long', 118.2, 20, 1],
      ['2026-03-10', 'BTC', 'COMPRA', 'Long', 61200, 0.05, 2], ['2026-06-03', 'NVDA', 'VENTA', 'Long', 142.6, 20, 1],
      ['2026-08-14', 'AAPL', 'VENTA', 'Long', 214.8, 5, 1], ['2026-09-22', 'TSLA', 'VENTA', 'Short', 262.0, 8, 1],
      ['2026-10-30', 'TSLA', 'COMPRA', 'Short', 231.5, 8, 1]
    ],
    objetivoAhorro: 15000, catEvolucion: 'Gastos Discrecionales|Dining Out'
  },
  es: {
    nombre: 'Lucía Romero', email: 'lucia@ejemplo.com', avatar: '🦋', moneda: 'EUR',
    partidas: [
      ['Ingresos', 'Nómina', 3150, 1, ['Nómina'], 0],
      ['Ingresos', 'Freelance', 350, 1, ['Proyecto de diseño', 'Consultoría', 'Traducción'], 0.6],
      ['Ingresos', 'Dividendos', 50, 1, ['Dividendos trimestrales'], 0.1, [2, 5, 8, 11], 150],
      ['Gastos Esenciales', 'Supermercado', 380, 4, ['Mercadona', 'Lidl', 'Carrefour', 'Fruteria'], 0.12],
      ['Gastos Esenciales', 'Suministros', 140, 2, ['Luz', 'Agua y gas'], 0.18],
      ['Gastos Esenciales', 'Transporte', 90, 3, ['Gasolina', 'Abono transporte', 'Parking'], 0.2],
      ['Gastos Esenciales', 'Seguros', 70, 1, ['Seguro hogar y coche'], 0],
      ['Gastos Esenciales', 'Salud', 40, 1, ['Farmacia', 'Dentista'], 0.4],
      ['Gastos Esenciales', 'Teléfono e Internet', 45, 1, ['Fibra + móvil'], 0],
      ['Gastos Discrecionales', 'Restaurantes', 160, 4, ['Cena con amigos', 'Brunch', 'Pizzería', 'Tapas'], 0.25],
      ['Gastos Discrecionales', 'Ocio', 70, 2, ['Concierto', 'Cine', 'Teatro'], 0.35],
      ['Gastos Discrecionales', 'Compras', 110, 2, ['Ropa', 'Amazon', 'Decoración'], 0.35],
      ['Gastos Discrecionales', 'Viajes', 140, 1, ['Escapada', 'Vuelos', 'Hotel'], 0.2, [3, 6, 7, 11], 420],
      ['Gastos Discrecionales', 'Suscripciones', 30, 3, ['Streaming', 'Música', 'Nube'], 0],
      ['Gastos Discrecionales', 'Gimnasio', 35, 1, ['Cuota gimnasio'], 0],
      ['Ahorro e Inversión', 'Fondo de emergencia', 150, 1, ['Traspaso a cuenta remunerada'], 0],
      ['Ahorro e Inversión', 'Fondos indexados', 300, 1, ['Fondo MSCI World'], 0],
      ['Ahorro e Inversión', 'Plan de pensiones', 100, 1, ['Aportación plan'], 0]
    ],
    prestamos: [
      { name: 'Hipoteca', totalAmount: 150000, interestRate: 2.9, installmentsCount: 360, startDate: '2021-09-01' },
      { name: 'Préstamo coche', totalAmount: 14000, interestRate: 6.5, installmentsCount: 60, startDate: '2024-05-01' }
    ],
    activos: { 'Cuenta corriente': [2400, 3200], 'Cuenta remunerada': [9500, 14200], 'Bróker': [18000, 26500], 'Plan de pensiones': [21000, 24300], 'Vivienda': [235000, 239500], 'Cripto': [1200, 2450] },
    pasivosManuales: { 'Tarjeta de crédito': [640, 290] },
    puntuales: [['Gastos Esenciales', 'IBI', 420, ['junio']], ['Gastos Discrecionales', 'Regalos de Navidad', 350, ['diciembre']]],
    trades: [
      ['2026-01-20', 'AAPL', 'COMPRA', 'Long', 189.5, 8, 1], ['2026-02-12', 'NVDA', 'COMPRA', 'Long', 118.2, 10, 1],
      ['2026-03-10', 'BTC', 'COMPRA', 'Long', 61200, 0.02, 2], ['2026-06-03', 'NVDA', 'VENTA', 'Long', 142.6, 10, 1],
      ['2026-08-14', 'AAPL', 'VENTA', 'Long', 214.8, 3, 1], ['2026-09-22', 'TSLA', 'VENTA', 'Short', 262.0, 4, 1],
      ['2026-10-30', 'TSLA', 'COMPRA', 'Short', 231.5, 4, 1]
    ],
    objetivoAhorro: 7500, catEvolucion: 'Gastos Discrecionales|Restaurantes'
  }
};

// Reparte un total en n importes con algo de ruido.
const repartir = (total, n, azar) => {
  const pesos = Array.from({ length: n }, () => 0.6 + azar() * 0.8);
  const suma = pesos.reduce((s, p) => s + p, 0);
  return pesos.map(p => redondea(total * p / suma));
};

// Crea los datos de un año a partir del perfil. `escala` reduce los importes
// (el año anterior era algo más modesto) y `hastaMes` corta los movimientos.
const datosAnio = (perfil, year, { escala = 1, hastaMes = 11, semilla = 1 }, generateInitialYearData, categories) => {
  const azar = generador(semilla);
  const d = generateInitialYearData(year, categories);
  perfil.partidas.forEach(([mk, sub, presupuesto]) => {
    const c = clave(mk, sub);
    d.budget[c] = redondea(presupuesto * escala);
    MESES.forEach(m => { d.monthly[m][c].budgeted = d.budget[c]; });
  });
  MESES.forEach((m, mi) => {
    if (mi > hastaMes) return;
    perfil.partidas.forEach(([mk, sub, presupuesto, n, notas, variacion, mesesConGasto, importeEsos]) => {
      if (mesesConGasto && !mesesConGasto.includes(mi)) return;
      const base = (mesesConGasto ? (importeEsos || presupuesto) : presupuesto) * escala;
      const total = base * (1 + (azar() * 2 - 1) * variacion);
      const importes = n > 1 ? repartir(total, n, azar) : [redondea(total)];
      importes.forEach((amount, k) => {
        const dia = n > 1 ? Math.min(28, 2 + Math.floor((k + azar() * 0.8) * 26 / n)) : (mk === 'Ingresos' ? 1 : 3 + Math.floor(azar() * 6));
        d.monthly[m][clave(mk, sub)].actual.push({
          id: `demo-${year}-${mi}-${sub}-${k}`,
          amount,
          date: `${year}-${String(mi + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`,
          nota: notas[(k + mi) % notas.length]
        });
      });
    });
  });
  // Patrimonio: interpolación lineal entre el saldo de enero y el de diciembre.
  const interp = ([ini, fin], mi, ruido) => redondea((ini + (fin - ini) * mi / 11) * escala * (1 + (azar() * 2 - 1) * ruido));
  Object.entries(perfil.activos).forEach(([cat, rango]) => {
    MESES.forEach((m, mi) => { d.netWorth.assets[cat][m] = interp(rango, mi, /crypto|cripto/i.test(cat) ? 0.12 : 0.01); });
  });
  Object.entries(perfil.pasivosManuales).forEach(([cat, rango]) => {
    MESES.forEach((m, mi) => { d.netWorth.liabilities[cat][m] = interp(rango, mi, 0.08); });
  });
  // Gastos puntuales planificados.
  perfil.puntuales.forEach(([cat, sub, amount, meses], k) => {
    meses.forEach(m => { d.oneTime[m].push({ id: `demo-ot-${year}-${k}-${m}`, grupo: `demo-${k}`, cat, sub, amount: redondea(amount * escala) }); });
  });
  return d;
};

export const crearDemo = (lang, { generateInitialYearData, normalizarConfig, VERSION_DATOS }) => {
  const perfil = PERFILES[lang] || PERFILES.en;
  const categories = {
    'Ingresos': [], 'Gastos Esenciales': [], 'Gastos Discrecionales': [], 'Pago de Deudas': [], 'Ahorro e Inversión': [],
    'Activos': Object.keys(perfil.activos),
    'Pasivos': [...perfil.prestamos.map(p => p.name), ...Object.keys(perfil.pasivosManuales)]
  };
  perfil.partidas.forEach(([mk, sub]) => categories[mk].push(sub));
  categories['Pago de Deudas'] = perfil.prestamos.map(p => p.name);

  const loans = perfil.prestamos.map((p, i) => ({
    id: `demo-loan-${i}`, ...p, amount: cuotaFrancesa(p.totalAmount, p.interestRate, p.installmentsCount)
  }));
  const trading = perfil.trades.map(([date, asset, action, type, price, amount, fees], i) => ({
    id: `demo-trade-${i}`, ts: i + 1, date, asset, action, type, price, amount, fees
  })).reverse();

  const financialData = {
    version: VERSION_DATOS,
    2025: datosAnio(perfil, 2025, { escala: 0.92, semilla: 7 }, generateInitialYearData, categories),
    2026: datosAnio(perfil, 2026, { escala: 1, semilla: 11 }, generateInitialYearData, categories),
    loans,
    trading
  };

  const config = normalizarConfig({
    tutorialCompleted: true,
    revisionAnio: 2026,
    categories,
    moneda: perfil.moneda,
    dashboard: {
      widgets: [
        { id: 'kpis', visible: true, size: 'full' },
        { id: 'salud', visible: true, size: 'full' },
        { id: 'flujo', visible: true, size: 'half' },
        { id: 'distribucion', visible: true, size: 'half' },
        { id: 'ahorro-acumulado', visible: true, size: 'half' },
        { id: 'objetivo', visible: true, size: 'half', opciones: { objetivo: perfil.objetivoAhorro } },
        { id: 'patrimonio', visible: true, size: 'half' },
        { id: 'top-gastos', visible: true, size: 'half' },
        { id: 'comparativa', visible: true, size: 'full' },
        { id: 'categoria', visible: true, size: 'half', opciones: { cat: perfil.catEvolucion } },
        { id: 'prestamos', visible: true, size: 'half' },
        { id: 'ahorro-mensual', visible: true, size: 'full' }
      ]
    }
  });

  const user = {
    uid: 'demo', displayName: perfil.nombre, email: perfil.email, avatar: perfil.avatar,
    isAdmin: false, plan: 'pago', paidUntil: Date.UTC(2030, 0, 1), trialEndsAt: 0,
    permissions: ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis', 'settings'],
    stripeStatus: 'active', stripeSubscriptionId: 'demo', cancelAtPeriodEnd: false, emailVerified: true
  };
  return { financialData, config, user };
};

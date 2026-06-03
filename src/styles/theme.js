// =============================================
// DESIGN SYSTEM — Canchas Pro v2 Native
// Equivalente a las CSS variables del proyecto web
// =============================================

export const colors = {
  // Fondos
  bgBase: '#0f172a',
  bgCard: '#1e293b',
  bgCardHover: '#243447',
  bgBtnHora: '#334155',

  // Verde — color primario
  verdePrimario: '#22c55e',
  verdeOscuro: '#15803d',
  verdeTitulo: '#4ade80',
  verdeHover: '#16a34a',
  verdeGlow: 'rgba(34,197,94,0.15)',

  // Texto
  textoPrimario: '#f1f5f9',
  textoSecundario: '#cbd5e1',
  textoMuted: '#94a3b8',
  textoSobreVerde: '#052e16',

  // Bordes
  bordeSutil: 'rgba(255,255,255,0.06)',
  bordeVerde: 'rgba(34,197,94,0.3)',

  // Estados
  error: '#f87171',
  errorBg: 'rgba(239,68,68,0.08)',
  errorBorde: 'rgba(239,68,68,0.2)',

  // WhatsApp
  whatsapp: '#25d366',
  whatsappBorde: 'rgba(37,211,102,0.3)',

  // Badges cancha
  f5Color: '#4ade80',
  f5Bg: 'rgba(74,222,128,0.1)',
  f5Borde: 'rgba(74,222,128,0.3)',
  f8Color: '#93c5fd',
  f8Bg: 'rgba(147,197,253,0.1)',
  f8Borde: 'rgba(147,197,253,0.3)',

  // Disponibilidad
  libre: '#22c55e',
  casiLleno: '#f59e0b',
  ocupado: '#ef4444',
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
}

export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 100,
}

export const typography = {
  fontFamily: undefined, // usa la fuente del sistema — equivalente a 'Inter', Arial
  sizes: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
}

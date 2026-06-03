// =============================================
// CANCHAS SVG — Canchas Pro v2 Native
// SVG inline → react-native-svg
// =============================================
import { View, Text, StyleSheet } from 'react-native'
import Svg, {
  Rect,
  Circle,
  Line,
  Text as SvgText,
  G,
  Ellipse,
  Path,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg'
import { colors, spacing, radius } from '../styles/theme'

// ─────────────────────────────────────────────
// JUGADOR — silueta minimalista
// ─────────────────────────────────────────────
function Jugador({ x, y, equipo, index }) {
  const esLocal = equipo === 'local'
  const colorCuerpo = esLocal ? 'rgba(74,222,128,0.9)' : 'rgba(147,197,253,0.85)'
  const colorGlow = esLocal ? '#4ade80' : '#93c5fd'

  return (
    <G transform={`translate(${x},${y})`}>
      <Ellipse cx="0" cy="16" rx="6" ry="2" fill="rgba(0,0,0,0.4)" />
      <Rect x="-4.5" y="11" width="3.5" height="6" rx="1.5" fill={colorCuerpo} opacity="0.9" />
      <Rect x="1" y="11" width="3.5" height="6" rx="1.5" fill={colorCuerpo} opacity="0.9" />
      <Rect x="-5" y="3" width="10" height="9" rx="2.5" fill={colorCuerpo} />
      <Circle cx="0" cy="0" r="4.5" fill={colorCuerpo} />
      <SvgText x="0" y="9" textAnchor="middle" fontSize="4" fill="rgba(0,0,0,0.5)" fontWeight="700">
        {index + 1}
      </SvgText>
      <Circle cx="0" cy="0" r="7" fill="none" stroke={colorGlow} strokeWidth="1.2" opacity="0.35" />
    </G>
  )
}

// ─────────────────────────────────────────────
// CANCHA FÚTBOL 5
// ─────────────────────────────────────────────
export function CanchaFutbol5() {
  const local = [
    { x: 28, y: 100 }, { x: 82, y: 62 }, { x: 82, y: 138 },
    { x: 148, y: 70 }, { x: 148, y: 130 },
  ]
  const visita = [
    { x: 292, y: 100 }, { x: 238, y: 62 }, { x: 238, y: 138 },
    { x: 172, y: 70 }, { x: 172, y: 130 },
  ]

  return (
    <Svg viewBox="0 0 320 200" width="100%" style={{ aspectRatio: 1.6 }}>
      <Defs>
        <RadialGradient id="bgf5" cx="50%" cy="50%" r="60%">
          <Stop offset="0%" stopColor="#1a5c35" />
          <Stop offset="70%" stopColor="#0f3d20" />
          <Stop offset="100%" stopColor="#071a0e" />
        </RadialGradient>
      </Defs>
      <Rect width="320" height="200" fill="url(#bgf5)" />
      {[0,1,2,3,4,5].map(i => (
        <Rect key={i} x="0" y={i*34} width="320" height="17"
          fill={i%2===0 ? 'rgba(255,255,255,0.028)' : 'transparent'} />
      ))}
      <G stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" fill="none">
        <Rect x="10" y="12" width="300" height="176" rx="3" />
        <Line x1="160" y1="12" x2="160" y2="188" />
        <Circle cx="160" cy="100" r="30" />
        <Circle cx="160" cy="100" r="2.5" fill="rgba(255,255,255,0.8)" stroke="none" />
        <Rect x="10" y="60" width="44" height="80" />
        <Rect x="266" y="60" width="44" height="80" />
        <Rect x="10" y="80" width="10" height="40" stroke="rgba(255,255,255,0.8)" />
        <Rect x="300" y="80" width="10" height="40" stroke="rgba(255,255,255,0.8)" />
      </G>
      {local.map((p,i) => <Jugador key={`l${i}`} x={p.x} y={p.y} equipo="local" index={i} />)}
      {visita.map((p,i) => <Jugador key={`v${i}`} x={p.x} y={p.y} equipo="visitante" index={i} />)}
      <Circle cx="160" cy="100" r="5.5" fill="white" opacity="0.95" />
      <Circle cx="160" cy="100" r="3" fill="#1a1a1a" opacity="0.4" />
      <Rect x="10" y="12" width="58" height="18" rx="4" fill="rgba(0,0,0,0.55)" />
      <SvgText x="39" y="24.5" textAnchor="middle" fill="#4ade80" fontSize="8.5" fontWeight="800">FÚTBOL 5</SvgText>
    </Svg>
  )
}

// ─────────────────────────────────────────────
// CANCHA FÚTBOL 8
// ─────────────────────────────────────────────
export function CanchaFutbol8() {
  const local = [
    { x: 24, y: 110 }, { x: 72, y: 52 }, { x: 72, y: 110 }, { x: 72, y: 168 },
    { x: 128, y: 72 }, { x: 128, y: 148 }, { x: 182, y: 82 }, { x: 182, y: 138 },
  ]
  const visita = [
    { x: 356, y: 110 }, { x: 308, y: 52 }, { x: 308, y: 110 }, { x: 308, y: 168 },
    { x: 252, y: 72 }, { x: 252, y: 148 }, { x: 198, y: 82 }, { x: 198, y: 138 },
  ]

  return (
    <Svg viewBox="0 0 380 220" width="100%" style={{ aspectRatio: 380/220 }}>
      <Defs>
        <RadialGradient id="bgf8" cx="50%" cy="50%" r="60%">
          <Stop offset="0%" stopColor="#1e3a5f" />
          <Stop offset="50%" stopColor="#0f2a45" />
          <Stop offset="100%" stopColor="#050f1a" />
        </RadialGradient>
      </Defs>
      <Rect width="380" height="220" fill="url(#bgf8)" />
      {[0,1,2,3,4,5,6].map(i => (
        <Rect key={i} x="0" y={i*32} width="380" height="16"
          fill={i%2===0 ? 'rgba(147,197,253,0.025)' : 'transparent'} />
      ))}
      <G stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" fill="none">
        <Rect x="10" y="12" width="360" height="196" rx="3" />
        <Line x1="190" y1="12" x2="190" y2="208" />
        <Circle cx="190" cy="110" r="34" />
        <Circle cx="190" cy="110" r="2.5" fill="rgba(255,255,255,0.8)" stroke="none" />
        <Rect x="10" y="56" width="56" height="108" />
        <Rect x="314" y="56" width="56" height="108" />
        <Rect x="10" y="80" width="24" height="60" />
        <Rect x="346" y="80" width="24" height="60" />
        <Rect x="10" y="92" width="10" height="36" stroke="rgba(255,255,255,0.85)" />
        <Rect x="360" y="92" width="10" height="36" stroke="rgba(255,255,255,0.85)" />
        <Circle cx="46" cy="110" r="2" fill="rgba(255,255,255,0.6)" stroke="none" />
        <Circle cx="334" cy="110" r="2" fill="rgba(255,255,255,0.6)" stroke="none" />
      </G>
      {local.map((p,i) => <Jugador key={`l${i}`} x={p.x} y={p.y} equipo="local" index={i} />)}
      {visita.map((p,i) => <Jugador key={`v${i}`} x={p.x} y={p.y} equipo="visitante" index={i} />)}
      <Circle cx="190" cy="110" r="5.5" fill="white" opacity="0.95" />
      <Circle cx="190" cy="110" r="3" fill="#1a1a1a" opacity="0.4" />
      <Rect x="10" y="12" width="58" height="18" rx="4" fill="rgba(0,0,0,0.55)" />
      <SvgText x="39" y="24.5" textAnchor="middle" fill="#93c5fd" fontSize="8.5" fontWeight="800">FÚTBOL 8</SvgText>
    </Svg>
  )
}

// ─────────────────────────────────────────────
// ÍCONO PERSONA — usando SVG
// ─────────────────────────────────────────────
function IconoPersona({ variante }) {
  const color = variante === 'local' ? '#22c55e' : '#f87171'
  return (
    <Svg viewBox="0 0 14 18" width={12} height={16}>
      <Circle cx="7" cy="4.5" r="3.5" fill={color} />
      <Path d="M1 17.5c0-3.314 2.686-6 6-6s6 2.686 6 6" fill={color} />
    </Svg>
  )
}

// ─────────────────────────────────────────────
// CAPACIDAD VISUAL
// ─────────────────────────────────────────────
export function CapacidadVisual({ tipo }) {
  const esF5 = tipo.includes('5')
  const porEquipo = esF5 ? 5 : 8
  const label = esF5 ? '10 jugadores' : '16 jugadores'

  return (
    <View style={styles.capacidadWrapper}>
      <Text style={styles.capacidadLabel}>{label}</Text>
      <View style={styles.capacidadEquipos}>
        <View style={styles.capacidadGrupo}>
          {Array.from({ length: porEquipo }).map((_, i) => (
            <IconoPersona key={i} variante="local" />
          ))}
        </View>
        <Text style={styles.capacidadVs}>VS</Text>
        <View style={styles.capacidadGrupo}>
          {Array.from({ length: porEquipo }).map((_, i) => (
            <IconoPersona key={i} variante="visita" />
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  capacidadWrapper: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.md,
  },
  capacidadLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textoMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: spacing.sm,
  },
  capacidadEquipos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    width: '100%',
  },
  capacidadGrupo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  capacidadVs: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(148,163,184,0.7)',
    letterSpacing: 0.6,
    paddingHorizontal: 4,
  },
})

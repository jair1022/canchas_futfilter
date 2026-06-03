// =============================================
// DASHBOARD — Canchas Pro v2 Native
// div.grid → View con map() (dentro de ScrollView padre)
// div.card → Pressable + View
// window.open → Linking.openURL
// =============================================
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Linking,
  useWindowDimensions,
} from 'react-native'
import { generarURLConsulta } from '../utils/whatsapp'
import { WHATSAPP_NUMERO } from '../data/config'
import { colors, spacing, radius, typography } from '../styles/theme'

// ─────────────────────────────────────────────
// ILUSTRACIÓN CAMPO — View puro (sin SVG)
// ─────────────────────────────────────────────
function FieldIlustracion() {
  return (
    <View style={styles.field}>
      <View style={styles.fieldLine} />
      <View style={styles.fieldCircle} />
      <View style={[styles.fieldArea, styles.fieldAreaIzq]} />
      <View style={[styles.fieldArea, styles.fieldAreaDer]} />
      <View style={styles.fieldBadge}>
        <Text style={styles.fieldBadgeText}>2 canchas</Text>
      </View>
    </View>
  )
}

// ─────────────────────────────────────────────
// CARD DE SEDE
// ─────────────────────────────────────────────
function SedeCard({ sede, onPress }) {
  async function handleWhatsApp() {
    const mensaje = `Hola, quiero información sobre *${sede.nombre}* (${sede.direccionCompleta}). ¿Tienen canchas disponibles?`
    const url = generarURLConsulta(WHATSAPP_NUMERO, mensaje)
    const canOpen = await Linking.canOpenURL(url)
    if (canOpen) Linking.openURL(url)
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Ver canchas de ${sede.nombre}`}
    >
      <FieldIlustracion />

      <View style={styles.info}>
        <Text style={styles.infoNombre}>{sede.nombre}</Text>
        <Text style={styles.infoDireccion} numberOfLines={2}>
          📍 {sede.direccionCompleta}
        </Text>

        <View style={styles.prices}>
          <View style={styles.precioBadge}>
            <Text style={styles.precioTipo}>F5</Text>
            <Text style={styles.precioMonto}>{sede.cancha1.precio}</Text>
          </View>
          <View style={styles.precioBadge}>
            <Text style={styles.precioTipo}>F8</Text>
            <Text style={styles.precioMonto}>{sede.cancha2.precio}</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.btnVerCanchas, pressed && styles.btnVerCanchasPressed]}
          onPress={onPress}
          accessible
          accessibilityRole="button"
        >
          <Text style={styles.btnVerCanchasTexto}>Ver Canchas →</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.btnWhatsapp, pressed && styles.btnWhatsappPressed]}
          onPress={handleWhatsApp}
          accessible
          accessibilityRole="button"
          accessibilityLabel={`Consultar por WhatsApp sobre ${sede.nombre}`}
        >
          <Text style={styles.btnWhatsappTexto}>💬 Consultar por WhatsApp</Text>
        </Pressable>
      </View>
    </Pressable>
  )
}

// ─────────────────────────────────────────────
// DASHBOARD — grid de sedes
// Renderizado como View (scroll lo maneja el padre ScrollView en App)
// ─────────────────────────────────────────────
export default function Dashboard({ sedes, seleccionar }) {
  const { width } = useWindowDimensions()
  // 2 columnas en tablets (>= 640), 1 en móvil
  const dosColumnas = width >= 640

  if (dosColumnas) {
    // Agrupamos en pares para renderizar en filas de 2
    const filas = []
    for (let i = 0; i < sedes.length; i += 2) {
      filas.push(sedes.slice(i, i + 2))
    }
    return (
      <View style={styles.grid}>
        {filas.map((fila, fi) => (
          <View key={fi} style={styles.fila}>
            {fila.map((sede) => (
              <View key={sede.id} style={styles.cardCol2}>
                <SedeCard sede={sede} onPress={() => seleccionar(sede)} />
              </View>
            ))}
          </View>
        ))}
      </View>
    )
  }

  return (
    <View style={styles.grid}>
      {sedes.map((sede) => (
        <SedeCard key={sede.id} sede={sede} onPress={() => seleccionar(sede)} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.xxl,
  },
  fila: {
    flexDirection: 'row',
    gap: spacing.xxl,
  },
  cardCol2: {
    flex: 1,
  },

  // ── Card ──
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.bordeSutil,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },

  // ── Campo ilustración ──
  field: {
    height: 160,
    backgroundColor: '#15803d',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fieldLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  fieldCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'transparent',
  },
  fieldArea: {
    position: 'absolute',
    width: 50,
    height: 80,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'transparent',
    top: '50%',
    marginTop: -40,
  },
  fieldAreaIzq: {
    left: 12,
    borderLeftWidth: 0,
  },
  fieldAreaDer: {
    right: 12,
    borderRightWidth: 0,
  },
  fieldBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  fieldBadgeText: {
    color: 'white',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },

  // ── Info ──
  info: {
    padding: spacing.xxl,
  },
  infoNombre: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textoPrimario,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  infoDireccion: {
    fontSize: typography.sizes.sm,
    color: colors.textoMuted,
    marginBottom: spacing.lg,
    lineHeight: 18,
  },

  // ── Precios ──
  prices: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  precioBadge: {
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderWidth: 1,
    borderColor: colors.bordeVerde,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 68,
  },
  precioTipo: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.verdePrimario,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  precioMonto: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.textoPrimario,
  },

  // ── Botones ──
  btnVerCanchas: {
    backgroundColor: colors.verdePrimario,
    borderRadius: radius.lg,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: colors.verdePrimario,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  btnVerCanchasPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  btnVerCanchasTexto: {
    color: colors.textoSobreVerde,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.base,
    letterSpacing: 0.2,
  },
  btnWhatsapp: {
    borderWidth: 1,
    borderColor: colors.whatsappBorde,
    borderRadius: radius.lg,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWhatsappPressed: {
    backgroundColor: 'rgba(37,211,102,0.08)',
  },
  btnWhatsappTexto: {
    color: colors.whatsapp,
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.sm,
  },
})

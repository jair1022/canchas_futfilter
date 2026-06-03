// =============================================
// APP ROOT — Canchas Pro v2 Native
// div → View/ScrollView
// header → View con SafeAreaView
// navegación → state local (igual que web)
// =============================================
import { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from 'react-native'
import Dashboard from './components/Dashboard'
import Detail from './components/Detail'
import { sedes } from './data/sedes'
import { colors, spacing, radius, typography } from './styles/theme'

function HeroHeader() {
  return (
    <View style={styles.hero}>
      {/* Badge ubicación */}
      <View style={styles.heroBadge}>
        <Text style={styles.heroBadgeTexto}>📍 Cúcuta, Colombia</Text>
      </View>

      {/* Título */}
      <Text style={styles.heroTitulo}>
        Canchas Sintéticas{' '}
        <Text style={styles.heroTituloSpan}>Cúcuta</Text>
      </Text>

      <Text style={styles.heroSubtitulo}>
        Reserva tu cancha favorita desde cualquier dispositivo
      </Text>

      {/* Stats */}
      <View style={styles.heroStats}>
        <View style={styles.heroStat}>
          <Text style={styles.heroStatNumero}>{sedes.length}</Text>
          <Text style={styles.heroStatLabel}>Sedes</Text>
        </View>
        <View style={styles.heroStatDivider} />
        <View style={styles.heroStat}>
          <Text style={styles.heroStatNumero}>{sedes.length * 2}</Text>
          <Text style={styles.heroStatLabel}>Canchas</Text>
        </View>
        <View style={styles.heroStatDivider} />
        <View style={styles.heroStat}>
          <Text style={styles.heroStatNumero}>10</Text>
          <Text style={styles.heroStatLabel}>Horarios</Text>
        </View>
      </View>
    </View>
  )
}

export default function App() {
  const [seleccion, setSeleccion] = useState(null)

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgBase} />

      {!seleccion ? (
        // Vista Dashboard — ScrollView con header hero integrado
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[]} // sin sticky
        >
          <HeroHeader />
          <Dashboard sedes={sedes} seleccionar={setSeleccion} />
        </ScrollView>
      ) : (
        // Vista Detail — gestiona su propio ScrollView
        <Detail sede={seleccion} volver={() => setSeleccion(null)} />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  heroBadge: {
    backgroundColor: colors.verdeGlow,
    borderWidth: 1,
    borderColor: colors.bordeVerde,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: spacing.lg,
  },
  heroBadgeTexto: {
    color: colors.verdePrimario,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroTitulo: {
    fontSize: 28,
    fontWeight: typography.weights.extrabold,
    color: colors.textoPrimario,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: spacing.md,
    lineHeight: 34,
  },
  heroTituloSpan: {
    color: colors.verdeTitulo,
  },
  heroSubtitulo: {
    color: colors.textoMuted,
    fontSize: typography.sizes.base,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: spacing.xxxl,
    lineHeight: 22,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.bordeSutil,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    gap: spacing.xxl,
  },
  heroStat: {
    alignItems: 'center',
  },
  heroStatNumero: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.verdePrimario,
  },
  heroStatLabel: {
    fontSize: 10,
    color: colors.textoMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.bordeSutil,
  },
})

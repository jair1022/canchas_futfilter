// =============================================
// DETAIL — Canchas Pro v2 Native
// iframe → WebView (mapa Google Maps)
// div/button → View/Pressable/ScrollView
// window.open → Linking.openURL
// =============================================
import { useState, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Linking,
} from 'react-native'
import ModalReserva from './ModalReserva'
import ToastContainer from './ToastContainer'
import { CanchaFutbol5, CanchaFutbol8, CapacidadVisual } from './CanchasSVG'
import { generarMensajeReserva, abrirWhatsApp } from '../utils/whatsapp'
import { WHATSAPP_NUMERO } from '../data/config'
import { colors, spacing, radius, typography } from '../styles/theme'

const horarios = [
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM',
  '10:00 PM', '11:00 PM',
]

let toastIdCounter = 0

function getDisponibilidad(cancha, hora, reservas) {
  if (reservas[`${cancha.tipo}-${hora}`]) return 'ocupado'
  const casiLlenas = ['6:00 PM', '7:00 PM', '8:00 PM']
  if (casiLlenas.includes(hora)) return 'casiLleno'
  return 'libre'
}

// ─────────────────────────────────────────────
// CARD DE CANCHA
// ─────────────────────────────────────────────
function CourtCard({ cancha, sede, horasSeleccionadas, reservas, errorHora, onSeleccionarHora, onApartar }) {
  const esF5 = cancha.tipo.includes('5')

  function getClaseHora(hora) {
    if (reservas[`${cancha.tipo}-${hora}`]) return 'reservado'
    if (horasSeleccionadas[cancha.tipo] === hora) return 'seleccionado'
    return 'libre'
  }

  function getCanchaApartada() {
    return horarios.every((h) => reservas[`${cancha.tipo}-${h}`])
  }

  function getTextoBotonApartar() {
    if (getCanchaApartada()) return 'Sin horarios disponibles'
    const hora = horasSeleccionadas[cancha.tipo]
    if (hora) return `Apartar ${hora}`
    return 'Apartar Cancha'
  }

  return (
    <View style={[styles.courtCard, esF5 ? styles.courtCardF5 : styles.courtCardF8]}>
      {/* Ilustración táctica */}
      <View style={styles.canchaTactica}>
        {esF5 ? <CanchaFutbol5 /> : <CanchaFutbol8 />}
        <View style={[styles.canchaFade, esF5 ? styles.canchaFadeF5 : styles.canchaFadeF8]} />
      </View>

      {/* Cuerpo */}
      <View style={styles.courtCardBody}>
        {/* Header: título + precio */}
        <View style={styles.courtHeader}>
          <View style={styles.courtTituloGrupo}>
            <Text style={styles.courtTitulo}>{cancha.tipo}</Text>
            <View style={[styles.courtTipoBadge, esF5 ? styles.badgeF5 : styles.badgeF8]}>
              <Text style={[styles.courtTipoBadgeTexto, esF5 ? styles.badgeF5Texto : styles.badgeF8Texto]}>
                {esF5 ? '⚡ Rápida · Urbana' : '🏆 Profesional · Competitiva'}
              </Text>
            </View>
          </View>
          <View style={styles.priceTag}>
            <Text style={styles.priceTagTexto}>{cancha.precio}</Text>
          </View>
        </View>

        <CapacidadVisual tipo={cancha.tipo} />

        <Text style={styles.scheduleTitulo}>Selecciona un horario</Text>

        {/* Grid de horarios — 2 columnas */}
        <View style={styles.schedule}>
          {horarios.map((hora) => {
            const estado = getClaseHora(hora)
            const disp = getDisponibilidad(cancha, hora, reservas)
            const estaReservado = estado === 'reservado'
            const estaSeleccionado = estado === 'seleccionado'

            return (
              <Pressable
                key={hora}
                style={[
                  styles.hour,
                  estaSeleccionado && styles.hourSeleccionado,
                  estaReservado && styles.hourReservado,
                  !estaReservado && !estaSeleccionado && disp === 'libre' && styles.hourLibreHover,
                ]}
                onPress={() => !estaReservado && onSeleccionarHora(cancha, hora)}
                disabled={estaReservado}
                accessible
                accessibilityLabel={
                  estaReservado
                    ? `${hora} — ya reservado`
                    : `Seleccionar ${hora} para ${cancha.tipo}`
                }
              >
                <Text
                  style={[
                    styles.horaTexto,
                    estaSeleccionado && styles.horaTextoSeleccionado,
                    estaReservado && styles.horaTextoReservado,
                  ]}
                >
                  {estaReservado ? `${hora} ✓` : hora}
                </Text>
                {!estaReservado && (
                  <View
                    style={[
                      styles.horaDot,
                      disp === 'libre' && styles.horaDotLibre,
                      disp === 'casiLleno' && styles.horaDotCasiLleno,
                      disp === 'ocupado' && styles.horaDotOcupado,
                    ]}
                  />
                )}
              </Pressable>
            )
          })}
        </View>

        {errorHora[cancha.tipo] && (
          <View style={styles.errorHoraBox}>
            <Text style={styles.errorHoraTexto}>⚠ Selecciona un horario primero</Text>
          </View>
        )}

        <Pressable
          style={[
            styles.btnApartar,
            getCanchaApartada() && styles.btnApartadoDisabled,
          ]}
          onPress={() => onApartar(cancha)}
          disabled={getCanchaApartada()}
          accessible
          accessibilityRole="button"
          accessibilityLabel={getTextoBotonApartar()}
        >
          <Text style={styles.btnApartarTexto}>{getTextoBotonApartar()}</Text>
        </Pressable>
      </View>
    </View>
  )
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────
export default function Detail({ sede, volver }) {
  const [horasSeleccionadas, setHorasSeleccionadas] = useState({})
  const [reservas, setReservas] = useState({})
  const [modal, setModal] = useState(null)
  const [errorHora, setErrorHora] = useState({})
  const [toasts, setToasts] = useState([])

  function agregarToast(tipo, titulo, detalle) {
    const id = ++toastIdCounter
    setToasts((prev) => [...prev.slice(-2), { id, tipo, titulo, detalle }])
  }

  const cerrarToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  function seleccionarHora(cancha, hora) {
    if (reservas[`${cancha.tipo}-${hora}`]) return
    setHorasSeleccionadas((prev) => ({ ...prev, [cancha.tipo]: hora }))
    setErrorHora((prev) => ({ ...prev, [cancha.tipo]: false }))
  }

  function handleApartar(cancha) {
    const hora = horasSeleccionadas[cancha.tipo]
    if (!hora) {
      setErrorHora((prev) => ({ ...prev, [cancha.tipo]: true }))
      setTimeout(
        () => setErrorHora((prev) => ({ ...prev, [cancha.tipo]: false })),
        3000,
      )
      return
    }
    setModal({ cancha, hora, sede: sede.nombre })
  }

  function handleConfirmar(form) {
    const { cancha, hora } = modal
    const key = `${cancha.tipo}-${hora}`
    setReservas((prev) => ({ ...prev, [key]: form }))
    setHorasSeleccionadas((prev) => ({ ...prev, [cancha.tipo]: null }))
    setModal(null)
    const mensaje = generarMensajeReserva({ sede, cancha, hora, form })
    abrirWhatsApp(mensaje, WHATSAPP_NUMERO)
    agregarToast(
      'exito',
      '¡Reserva enviada por WhatsApp! 💬',
      `${cancha.tipo} · ${hora} · ${form.nombre} ${form.apellidos}`,
    )
  }

  // mapaUrl no se usa tras quitar el WebView embebido

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Botón volver */}
        <Pressable style={styles.btnVolver} onPress={volver} accessible accessibilityRole="button">
          <Text style={styles.btnVolverTexto}>← Volver</Text>
        </Pressable>

        {/* Header sede */}
        <View style={styles.detailHeader}>
          <Text style={styles.detailTitulo}>{sede.nombre}</Text>
          <Text style={styles.detailDireccion}>📍 {sede.direccionCompleta}</Text>
          <Pressable
            onPress={() => Linking.openURL(sede.mapsLink)}
            style={styles.btnVerMapa}
            accessible
            accessibilityRole="link"
            accessibilityLabel={`Ver ${sede.nombre} en Google Maps`}
          >
            <Text style={styles.btnVerMapaIcono}>🗺️</Text>
            <View style={styles.btnVerMapaTextoGrupo}>
              <Text style={styles.btnVerMapaTitulo}>Ver en Google Maps</Text>
              <Text style={styles.btnVerMapaSubtitulo}>{sede.direccionCompleta}</Text>
            </View>
            <Text style={styles.btnVerMapaFlecha}>→</Text>
          </Pressable>
        </View>

        {/* Canchas */}
        <View style={styles.courts}>
          {[sede.cancha1, sede.cancha2].map((cancha) => (
            <CourtCard
              key={cancha.tipo}
              cancha={cancha}
              sede={sede}
              horasSeleccionadas={horasSeleccionadas}
              reservas={reservas}
              errorHora={errorHora}
              onSeleccionarHora={seleccionarHora}
              onApartar={handleApartar}
            />
          ))}
        </View>
      </ScrollView>

      {/* Modal reserva */}
      {modal && (
        <ModalReserva
          datos={modal}
          onConfirmar={handleConfirmar}
          onCancelar={() => setModal(null)}
        />
      )}

      {/* Toasts — posición absoluta sobre todo */}
      <ToastContainer toasts={toasts} onCerrar={cerrarToast} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 60,
  },
  btnVolver: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.bordeSutil,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.xxl,
  },
  btnVolverTexto: {
    color: colors.textoSecundario,
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.sm,
  },
  detailHeader: {
    marginBottom: spacing.xxl,
    paddingBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.bordeSutil,
  },
  detailTitulo: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.extrabold,
    color: colors.textoPrimario,
    letterSpacing: -0.4,
    marginBottom: spacing.xs,
  },
  detailDireccion: {
    fontSize: typography.sizes.base,
    color: colors.textoMuted,
    marginBottom: spacing.sm,
  },
  btnVerMapa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(74,222,128,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.25)',
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
  },
  btnVerMapaIcono: {
    fontSize: 28,
  },
  btnVerMapaTextoGrupo: {
    flex: 1,
    gap: 2,
  },
  btnVerMapaTitulo: {
    color: colors.textoPrimario,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
  },
  btnVerMapaSubtitulo: {
    color: colors.textoMuted,
    fontSize: typography.sizes.xs,
  },
  btnVerMapaFlecha: {
    color: colors.verdePrimario,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  courts: {
    gap: spacing.xl,
  },

  // Court card
  courtCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.bordeSutil,
  },
  courtCardF5: {
    borderTopWidth: 2,
    borderTopColor: 'rgba(74,222,128,0.4)',
  },
  courtCardF8: {
    borderTopWidth: 2,
    borderTopColor: 'rgba(147,197,253,0.4)',
  },
  canchaTactica: {
    position: 'relative',
  },
  canchaFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
  },
  canchaFadeF5: {
    backgroundColor: 'transparent',
    // LinearGradient real requeriría expo-linear-gradient;
    // usamos un degradado simple oscureciendo el borde
  },
  canchaFadeF8: {
    backgroundColor: 'transparent',
  },
  courtCardBody: {
    padding: spacing.xxl,
  },
  courtHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  courtTituloGrupo: {
    flex: 1,
    gap: spacing.xs,
  },
  courtTitulo: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.textoPrimario,
    letterSpacing: -0.2,
  },
  courtTipoBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  badgeF5: {
    backgroundColor: 'rgba(74,222,128,0.1)',
    borderColor: 'rgba(74,222,128,0.3)',
  },
  badgeF8: {
    backgroundColor: 'rgba(147,197,253,0.1)',
    borderColor: 'rgba(147,197,253,0.3)',
  },
  courtTipoBadgeTexto: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  badgeF5Texto: { color: '#4ade80' },
  badgeF8Texto: { color: '#93c5fd' },
  priceTag: {
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderWidth: 1,
    borderColor: colors.bordeVerde,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  priceTagTexto: {
    color: colors.verdePrimario,
    fontWeight: typography.weights.extrabold,
    fontSize: typography.sizes.md,
  },
  scheduleTitulo: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.textoMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  schedule: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  hour: {
    width: '47%',
    backgroundColor: colors.bgBtnHora,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hourSeleccionado: {
    backgroundColor: colors.verdePrimario,
    borderColor: colors.verdePrimario,
  },
  hourReservado: {
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderColor: colors.bordeVerde,
    opacity: 0.6,
  },
  hourLibreHover: {},
  horaTexto: {
    color: colors.textoSecundario,
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.sm,
  },
  horaTextoSeleccionado: {
    color: colors.textoSobreVerde,
  },
  horaTextoReservado: {
    color: colors.verdePrimario,
    fontSize: 11,
  },
  horaDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  horaDotLibre: {
    backgroundColor: '#22c55e',
  },
  horaDotCasiLleno: {
    backgroundColor: '#f59e0b',
  },
  horaDotOcupado: {
    backgroundColor: '#ef4444',
  },
  errorHoraBox: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    borderRadius: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  errorHoraTexto: {
    fontSize: typography.sizes.xs,
    color: '#f87171',
    textAlign: 'center',
  },
  btnApartar: {
    backgroundColor: colors.verdePrimario,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.verdePrimario,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  btnApartadoDisabled: {
    backgroundColor: colors.bgBtnHora,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnApartarTexto: {
    color: colors.textoSobreVerde,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.base,
  },
})

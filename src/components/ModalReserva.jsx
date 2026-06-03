// =============================================
// MODAL RESERVA — Canchas Pro v2 Native
// <dialog> → Modal nativo de React Native
// <form> → View + TextInput + validaciones
// =============================================
import { useState } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { colors, spacing, radius, typography } from '../styles/theme'

const camposIniciales = {
  nombre: '',
  apellidos: '',
  telefono: '',
  correo: '',
  observaciones: '',
}

function validar(campos) {
  const errores = {}
  if (!campos.nombre.trim())
    errores.nombre = 'El nombre es obligatorio'
  if (!campos.apellidos.trim())
    errores.apellidos = 'Los apellidos son obligatorios'
  if (!campos.telefono.trim())
    errores.telefono = 'El teléfono es obligatorio'
  else if (!/^\d{7,15}$/.test(campos.telefono.replace(/[\s\-\+]/g, '')))
    errores.telefono = 'Ingresa un teléfono válido (7-15 dígitos)'
  if (!campos.correo.trim())
    errores.correo = 'El correo es obligatorio'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.correo))
    errores.correo = 'Ingresa un correo válido'
  return errores
}

function CampoTexto({ label, requerido, error, tocado, ...inputProps }) {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.formLabel}>
        {label}
        {requerido && <Text style={styles.requerido}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.formInput,
          error && tocado ? styles.inputError : null,
        ]}
        placeholderTextColor={colors.textoMuted}
        {...inputProps}
      />
      {error && tocado && (
        <Text style={styles.formErrorMsg}>⚠ {error}</Text>
      )}
    </View>
  )
}

export default function ModalReserva({ datos, onConfirmar, onCancelar }) {
  const [campos, setCampos] = useState(camposIniciales)
  const [errores, setErrores] = useState({})
  const [tocados, setTocados] = useState({})
  const [loading, setLoading] = useState(false)

  function handleChange(name, value) {
    setCampos((prev) => ({ ...prev, [name]: value }))
    if (tocados[name]) {
      const nuevosErrores = validar({ ...campos, [name]: value })
      setErrores((prev) => ({ ...prev, [name]: nuevosErrores[name] }))
    }
  }

  function handleBlur(name) {
    setTocados((prev) => ({ ...prev, [name]: true }))
    const nuevosErrores = validar(campos)
    setErrores((prev) => ({ ...prev, [name]: nuevosErrores[name] }))
  }

  async function handleSubmit() {
    const todosLosCampos = { nombre: true, apellidos: true, telefono: true, correo: true }
    setTocados(todosLosCampos)
    const nuevosErrores = validar(campos)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    onConfirmar({ ...campos })
  }

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onCancelar}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancelar} />

        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitulo}>Reservar Cancha</Text>
            <Pressable onPress={onCancelar} style={styles.modalClose}>
              <Text style={styles.modalCloseTexto}>✕</Text>
            </Pressable>
          </View>

          <Text style={styles.modalSubtitulo}>
            <Text style={styles.modalSubtituloNegrita}>{datos.cancha.tipo}</Text>
            {` · ${datos.hora} · ${datos.sede}`}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Nombre + Apellidos en fila */}
            <View style={styles.formFila}>
              <View style={styles.formFilaItem}>
                <CampoTexto
                  label="Nombre"
                  requerido
                  placeholder="Tu nombre"
                  value={campos.nombre}
                  onChangeText={(v) => handleChange('nombre', v)}
                  onBlur={() => handleBlur('nombre')}
                  error={errores.nombre}
                  tocado={tocados.nombre}
                  autoComplete="given-name"
                  returnKeyType="next"
                />
              </View>
              <View style={styles.formFilaItem}>
                <CampoTexto
                  label="Apellidos"
                  requerido
                  placeholder="Tus apellidos"
                  value={campos.apellidos}
                  onChangeText={(v) => handleChange('apellidos', v)}
                  onBlur={() => handleBlur('apellidos')}
                  error={errores.apellidos}
                  tocado={tocados.apellidos}
                  autoComplete="family-name"
                  returnKeyType="next"
                />
              </View>
            </View>

            <CampoTexto
              label="Teléfono"
              requerido
              placeholder="Ej: 3001234567"
              value={campos.telefono}
              onChangeText={(v) => handleChange('telefono', v)}
              onBlur={() => handleBlur('telefono')}
              error={errores.telefono}
              tocado={tocados.telefono}
              keyboardType="phone-pad"
              autoComplete="tel"
              returnKeyType="next"
            />

            <CampoTexto
              label="Correo electrónico"
              requerido
              placeholder="tu@correo.com"
              value={campos.correo}
              onChangeText={(v) => handleChange('correo', v)}
              onBlur={() => handleBlur('correo')}
              error={errores.correo}
              tocado={tocados.correo}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
            />

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Observaciones{' '}
                <Text style={styles.opcional}>(opcional)</Text>
              </Text>
              <TextInput
                style={[styles.formInput, styles.formTextarea]}
                placeholder="Alguna nota adicional..."
                placeholderTextColor={colors.textoMuted}
                value={campos.observaciones}
                onChangeText={(v) => handleChange('observaciones', v)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Footer botones */}
            <View style={styles.modalFooter}>
              <Pressable
                style={[styles.btnCancelar, loading && styles.btnDisabled]}
                onPress={onCancelar}
                disabled={loading}
              >
                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.btnConfirmar, loading && styles.btnDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color={colors.textoSobreVerde} />
                    <Text style={[styles.btnConfirmarTexto, { marginLeft: 8 }]}>
                      Reservando...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.btnConfirmarTexto}>Confirmar Reserva →</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modal: {
    backgroundColor: colors.bgCard,
    borderRadius: 24,
    padding: spacing.xxxl,
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: colors.bordeSutil,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.6,
    shadowRadius: 32,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  modalTitulo: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.textoPrimario,
    letterSpacing: -0.3,
  },
  modalClose: {
    padding: spacing.xs,
    borderRadius: radius.sm,
  },
  modalCloseTexto: {
    fontSize: 18,
    color: colors.textoMuted,
  },
  modalSubtitulo: {
    fontSize: typography.sizes.base,
    color: colors.textoMuted,
    marginBottom: spacing.xxl,
    paddingBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.bordeSutil,
  },
  modalSubtituloNegrita: {
    color: colors.verdePrimario,
    fontWeight: typography.weights.bold,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  formFila: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  formFilaItem: {
    flex: 1,
  },
  formLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textoMuted,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  requerido: {
    color: colors.error,
  },
  opcional: {
    color: colors.textoMuted,
    fontWeight: typography.weights.regular,
    textTransform: 'none',
  },
  formInput: {
    backgroundColor: colors.bgBase,
    borderWidth: 1,
    borderColor: colors.bordeSutil,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textoPrimario,
    fontSize: typography.sizes.base,
  },
  formTextarea: {
    minHeight: 80,
    paddingTop: spacing.md,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  formErrorMsg: {
    fontSize: typography.sizes.xs,
    color: colors.error,
    marginTop: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xxl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.bordeSutil,
    marginBottom: spacing.sm,
  },
  btnCancelar: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.bordeSutil,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelarTexto: {
    color: colors.textoSecundario,
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.base,
  },
  btnConfirmar: {
    flex: 2,
    backgroundColor: colors.verdePrimario,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnConfirmarTexto: {
    color: colors.textoSobreVerde,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.base,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.5,
  },
})

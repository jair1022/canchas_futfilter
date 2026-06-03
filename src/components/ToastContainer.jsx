// =============================================
// TOAST CONTAINER — Canchas Pro v2 Native
// position:fixed → Animated + Modal overlay nativo
// =============================================
import { useEffect, useRef } from 'react'
import {
  View,
  Text,
  Animated,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'
import { colors, spacing, radius, typography } from '../styles/theme'

function Toast({ toast, onCerrar }) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateX = useRef(new Animated.Value(40)).current

  useEffect(() => {
    // Entrada
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()

    // Auto-cierre después de 4s
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 40,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => onCerrar(toast.id))
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  const esExito = toast.tipo === 'exito'

  return (
    <Animated.View
      style={[
        styles.toast,
        esExito ? styles.toastExito : styles.toastError,
        { opacity, transform: [{ translateX }] },
      ]}
    >
      <Text style={styles.toastIcono}>{esExito ? '✅' : '❌'}</Text>
      <View style={styles.toastBody}>
        <Text style={styles.toastTitulo}>{toast.titulo}</Text>
        {!!toast.detalle && (
          <Text style={styles.toastDetalle}>{toast.detalle}</Text>
        )}
      </View>
      <Pressable onPress={() => onCerrar(toast.id)} style={styles.toastCerrar}>
        <Text style={styles.toastCerrarTexto}>✕</Text>
      </Pressable>
    </Animated.View>
  )
}

export default function ToastContainer({ toasts, onCerrar }) {
  const { width } = useWindowDimensions()

  if (!toasts.length) return null

  return (
    <View style={[styles.container, { width: width - spacing.xxl * 2 }]}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onCerrar={onCerrar} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    right: spacing.lg,
    zIndex: 200,
  },
  toast: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: colors.bordeSutil,
    marginBottom: spacing.sm,
  },
  toastExito: {
    borderLeftWidth: 3,
    borderLeftColor: colors.verdePrimario,
  },
  toastError: {
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  toastIcono: {
    fontSize: 16,
    marginTop: 1,
  },
  toastBody: {
    flex: 1,
  },
  toastTitulo: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textoPrimario,
    marginBottom: 3,
  },
  toastDetalle: {
    fontSize: typography.sizes.xs,
    color: colors.textoMuted,
    lineHeight: 18,
  },
  toastCerrar: {
    paddingLeft: spacing.sm,
  },
  toastCerrarTexto: {
    fontSize: 16,
    color: colors.textoMuted,
  },
})

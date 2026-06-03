// =============================================
// UTILIDADES WHATSAPP — Canchas Pro v2 Native
// window.open → Linking.openURL (React Native)
// =============================================
import { Linking } from 'react-native'

/**
 * Calcula la hora de fin sumando 1 hora al slot seleccionado.
 * "4:00 PM" → "5:00 PM", "11:00 PM" → "12:00 AM"
 */
export function calcularHoraFin(hora) {
  const [tiempo, periodo] = hora.split(' ')
  const [h] = tiempo.split(':')
  let horaNum = parseInt(h, 10)

  if (horaNum === 11 && periodo === 'PM') return '12:00 AM'
  if (horaNum === 12 && periodo === 'AM') return '1:00 PM'

  horaNum += 1
  const nuevoPeriodo = horaNum >= 12 && horaNum < 24 ? 'PM' : periodo
  const horaFinal = horaNum > 12 ? horaNum - 12 : horaNum
  return `${horaFinal}:00 ${nuevoPeriodo}`
}

function formatearFecha(fecha) {
  const d = fecha.getDate().toString().padStart(2, '0')
  const m = (fecha.getMonth() + 1).toString().padStart(2, '0')
  const y = fecha.getFullYear()
  return `${d}/${m}/${y}`
}

function formatearHora(fecha) {
  let h = fecha.getHours()
  const min = fecha.getMinutes().toString().padStart(2, '0')
  const periodo = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${min} ${periodo}`
}

/**
 * Genera el mensaje de WhatsApp formateado.
 */
export function generarMensajeReserva({ sede, cancha, hora, form }) {
  const ahora = new Date()
  const fecha = formatearFecha(ahora)
  const horaReserva = formatearHora(ahora)
  const horaFin = calcularHoraFin(hora)

  const lineas = [
    '⚽ *NUEVA RESERVA — Canchas Pro*',
    '',
    `📍 *Sede:* ${sede.nombre}`,
    `🗺️ *Ubicación:* ${sede.direccionCompleta}`,
    `🏟️ *Cancha:* ${cancha.tipo}`,
    `💰 *Precio:* COP ${cancha.precio}`,
    `🕒 *Horario:* ${hora} - ${horaFin}`,
    `📅 *Fecha:* ${fecha}`,
    `⏰ *Reservado a las:* ${horaReserva}`,
    '',
    '👤 *Cliente*',
    `Nombre: ${form.nombre} ${form.apellidos}`,
    `Teléfono: ${form.telefono}`,
    `Correo: ${form.correo}`,
  ]

  if (form.observaciones && form.observaciones.trim()) {
    lineas.push(`📝 Observaciones: ${form.observaciones.trim()}`)
  }

  lineas.push('')
  lineas.push('✅ _Reserva generada desde Canchas Pro_')

  return lineas.join('\n')
}

/**
 * Genera la URL de WhatsApp con el mensaje codificado.
 */
export function generarURLWhatsApp(mensaje, numero) {
  const texto = encodeURIComponent(mensaje)
  return `https://wa.me/${numero}?text=${texto}`
}

/**
 * Abre WhatsApp usando Linking de React Native.
 * Reemplaza window.open() de la versión web.
 */
export async function abrirWhatsApp(mensaje, numero) {
  const url = generarURLWhatsApp(mensaje, numero)
  const canOpen = await Linking.canOpenURL(url)
  if (canOpen) {
    await Linking.openURL(url)
  }
}

/**
 * Genera URL de consulta general.
 */
export function generarURLConsulta(numero, mensajeConsulta) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensajeConsulta)}`
}

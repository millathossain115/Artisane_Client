import type { Order } from '../features/orders/orderApi'
import {
  formatOrderDate,
  formatOrderId,
  formatOrderStatus,
  getOrderCustomer,
  getOrderCustomerEmail,
  getOrderItemName,
} from './orderDisplay'
import { formatPrice } from './productDisplay'

type PdfTextLine = {
  size?: number
  text: string
  x: number
  y: number
}

function sanitizePdfText(value: string) {
  return value
    .replace(/[^\x20-\x7E]/g, '-')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}

function drawText({ size = 10, text, x, y }: PdfTextLine) {
  return `BT /F1 ${size} Tf ${x} ${y} Td (${sanitizePdfText(text)}) Tj ET`
}

function drawRule(y: number) {
  return `0.82 0.78 0.72 RG 48 ${y} m 547 ${y} l S`
}

function getInvoiceFileName(order: Order) {
  return `artisane-invoice-${formatOrderId(order._id).replace('#', '')}.pdf`
}

function getInvoiceLines(order: Order) {
  const items = order.items ?? []
  const subtotal =
    order.subtotal ??
    items.reduce((total, item) => total + (item.subtotal ?? 0), 0)

  return {
    customer: [
      `Customer: ${getOrderCustomer(order)}`,
      `Email: ${getOrderCustomerEmail(order) || 'Not set'}`,
      `Phone: ${order.contactPhone ?? order.customerInfo?.phone ?? 'Not set'}`,
      `Address: ${order.shippingAddress ?? 'Not set'}`,
    ],
    items,
    summary: [
      `Subtotal: ${formatPrice(subtotal)}`,
      `Shipping: ${formatPrice(order.shippingCharge ?? 0)}`,
      `Discount: ${formatPrice(order.discount ?? 0)}`,
      `Total: ${formatPrice(order.totalPrice ?? subtotal)}`,
    ],
  }
}

function buildPageContent(order: Order) {
  const invoice = getInvoiceLines(order)
  const lines: string[] = [
    drawText({ size: 24, text: 'Artisane', x: 48, y: 792 }),
    drawText({ size: 18, text: 'Invoice', x: 48, y: 762 }),
    drawText({
      size: 11,
      text: `Invoice for ${formatOrderId(order._id)}`,
      x: 48,
      y: 738,
    }),
    drawText({
      size: 10,
      text: `Date: ${formatOrderDate(order.createdAt)}`,
      x: 390,
      y: 762,
    }),
    drawText({
      size: 10,
      text: `Order status: ${formatOrderStatus(order.orderStatus)}`,
      x: 390,
      y: 744,
    }),
    drawText({
      size: 10,
      text: `Payment: ${formatOrderStatus(order.paymentStatus)}`,
      x: 390,
      y: 726,
    }),
    drawRule(710),
  ]

  let y = 684
  invoice.customer.forEach((line) => {
    lines.push(drawText({ text: line.slice(0, 86), x: 48, y }))
    y -= 16
  })

  y -= 12
  lines.push(drawRule(y + 8))
  lines.push(drawText({ size: 12, text: 'Items', x: 48, y }))
  y -= 24
  lines.push(drawText({ size: 9, text: 'Item', x: 48, y }))
  lines.push(drawText({ size: 9, text: 'Qty', x: 338, y }))
  lines.push(drawText({ size: 9, text: 'Price', x: 390, y }))
  lines.push(drawText({ size: 9, text: 'Subtotal', x: 470, y }))
  y -= 10
  lines.push(drawRule(y))
  y -= 18

  invoice.items.slice(0, 18).forEach((item) => {
    const quantity = item.quantity ?? 1
    const subtotal = item.subtotal ?? (item.price ?? 0) * quantity

    lines.push(
      drawText({
        text: getOrderItemName(item).slice(0, 48),
        x: 48,
        y,
      }),
    )
    lines.push(drawText({ text: String(quantity), x: 338, y }))
    lines.push(drawText({ text: formatPrice(item.price ?? 0), x: 390, y }))
    lines.push(drawText({ text: formatPrice(subtotal), x: 470, y }))
    y -= 18
  })

  if (invoice.items.length > 18) {
    lines.push(
      drawText({
        text: `${invoice.items.length - 18} more item(s) omitted from compact invoice.`,
        x: 48,
        y,
      }),
    )
    y -= 18
  }

  y -= 8
  lines.push(drawRule(y + 8))

  invoice.summary.forEach((line, index) => {
    lines.push(
      drawText({
        size: index === invoice.summary.length - 1 ? 12 : 10,
        text: line,
        x: 390,
        y,
      }),
    )
    y -= 18
  })

  lines.push(drawRule(96))
  lines.push(
    drawText({
      size: 9,
      text: 'Thank you for shopping with Artisane.',
      x: 48,
      y: 76,
    }),
  )

  return lines.join('\n')
}

function buildPdf(content: string) {
  const contentObject = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    contentObject,
  ]

  let pdf = '%PDF-1.4\n'
  const offsets = [0]

  objects.forEach((object, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })

  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`
  pdf += `startxref\n${xrefOffset}\n%%EOF`

  return pdf
}

export function downloadOrderInvoice(order: Order) {
  const pdf = buildPdf(buildPageContent(order))
  const blob = new Blob([pdf], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = getInvoiceFileName(order)
  document.body.appendChild(link)
  link.click()
  link.remove()

  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

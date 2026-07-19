import { CheckCircle2, Star, Truck } from 'lucide-react'

export const sampleOrders = [
  {
    id: '#AR-1048',
    customer: 'Nadia Rahman',
    item: 'Signed Figure Study Print',
    status: 'Paid',
    total: '$58',
    time: '12 min ago',
  },
  {
    id: '#AR-1047',
    customer: 'Farhan Ahmed',
    item: 'Studio Brush Set',
    status: 'Packing',
    total: '$48',
    time: '34 min ago',
  },
  {
    id: '#AR-1046',
    customer: 'Mina Chowdhury',
    item: 'Oil Color Starter Kit',
    status: 'Needs review',
    total: '$36',
    time: '1 hr ago',
  },
]

export const inventory = [
  'Handmade Color Palette: 4 left',
  'Studio Brush Set: 7 left',
  'Ceramic glaze samples: 2 left',
]

export const activity = [
  {
    title: 'New review received',
    detail: '5 stars for Studio Brush Set',
    icon: Star,
  },
  {
    title: 'Shipment prepared',
    detail: 'Order #AR-1044 marked ready',
    icon: Truck,
  },
  {
    title: 'Product approved',
    detail: 'Art Prints collection updated',
    icon: CheckCircle2,
  },
]

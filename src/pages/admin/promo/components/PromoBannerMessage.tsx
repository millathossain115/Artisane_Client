import type { PromoBannerMessage as PromoBannerMessageType } from '../promoBannerUtils'

type PromoBannerMessageProps = {
  message: PromoBannerMessageType
}

function PromoBannerMessage({ message }: PromoBannerMessageProps) {
  return (
    <div
      className={`mt-4 border p-3.5 text-sm font-medium ${
        message.type === 'success'
          ? 'border-green-200 bg-green-50 text-green-700'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}
    >
      {message.text}
    </div>
  )
}

export default PromoBannerMessage

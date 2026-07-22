import { ShieldCheck, Truck, CreditCard, RotateCcw } from 'lucide-react'

function WhyChooseUs() {
  const features = [
    {
      icon: Truck,
      title: 'Express Delivery across BD',
      description: 'Fast & reliable doorstep delivery to all 64 districts',
    },
    {
      icon: ShieldCheck,
      title: '100% Authentic Handcraft',
      description: 'Directly sourced genuine artisanal supplies',
    },
    {
      icon: CreditCard,
      title: 'Secure Payment Options',
      description: 'bKash, Nagad, Cards & Cash on Delivery',
    },
    {
      icon: RotateCcw,
      title: 'Easy & Fast Returns',
      description: 'Hassle-free return policy on damaged items',
    },
  ]

  return (
    <section className="border-y border-black/10 bg-[#f8f3ea] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.title}
                className="flex items-start gap-4 p-4 transition hover:bg-white/60"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center bg-[#8f3f1d] text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#181512]">{item.title}</h3>
                  <p className="mt-1 text-xs text-[#6b5f53]">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs

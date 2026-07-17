function Footer() {
  return (
    <footer className="bg-[#f8f3ea] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 border-t border-black/10 pt-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center bg-[#181512] text-base font-bold text-white">
              A
            </span>
            <span className="font-display text-2xl font-bold">Artisane</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#6b5f53]">
            A curated marketplace for useful, beautiful craft made by small
            studios.
          </p>
        </div>

        <div>
          <h2 className="font-bold">Shop</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#6b5f53]">
            <li>
              <a className="hover:text-[#181512]" href="#">
                New arrivals
              </a>
            </li>
            <li>
              <a className="hover:text-[#181512]" href="#">
                Best sellers
              </a>
            </li>
            <li>
              <a className="hover:text-[#181512]" href="#">
                Gift cards
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold">Support</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#6b5f53]">
            <li>
              <a className="hover:text-[#181512]" href="#">
                Shipping
              </a>
            </li>
            <li>
              <a className="hover:text-[#181512]" href="#">
                Returns
              </a>
            </li>
            <li>
              <a className="hover:text-[#181512]" href="#">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold">Visit</h2>
          <p className="mt-4 text-sm leading-6 text-[#6b5f53]">
            18 Craft Lane
            <br />
            Dhaka, Bangladesh
          </p>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-7xl flex-col justify-between gap-3 border-t border-black/10 pt-5 text-sm text-[#6b5f53] sm:flex-row">
        <p>© 2026 Artisane. All rights reserved.</p>
        <div className="flex gap-5">
          <a className="hover:text-[#181512]" href="#">
            Privacy
          </a>
          <a className="hover:text-[#181512]" href="#">
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer

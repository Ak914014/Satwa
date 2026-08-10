import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import React, { useState } from "react";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/*  Brand tokens — "ration ledger" system                                 */
/*  ink #1D1712 · stone #E8E0CB · stone-deep #DCD0AE                      */
/*  brass #AD7A2C · brick #7C2B22 · olive #3E4A2F · paper #F5EFDD         */
/* ---------------------------------------------------------------------- */

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600;700;800&family=Noto+Serif+Devanagari:wght@500;600&display=swap');
    .sw-display { font-family: 'Instrument Serif', serif; }
    .sw-body { font-family: 'Work Sans', sans-serif; }
    .sw-dev { font-family: 'Noto Serif Devanagari', serif; }
    .cut-tr { clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%); }
    .cut-tr-sm { clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%); }
    .cut-bl { clip-path: polygon(0 0, 100% 0, 100% 100%, 22px 100%, 0 calc(100% - 22px)); }
  `}</style>
);

const products = [
  { name: "Dry Fruit Laddus", image: "/laddu.png", sizes: [["500g", "₹899"], ["1kg", "₹1699"]] },
  { name: "Desi Cow Ghee", image: "/ghee.png", sizes: [["500g", "₹1199"], ["1kg", "₹2299"]] },
  { name: "Buffalo Ghee", image: "/buff%20ghee.png", sizes: [["500g", "₹1049"], ["1kg", "₹1999"]] },
  { name: "Natural Jaggery", image: "/jaggery.png", sizes: [["500g", "₹449"], ["1kg", "₹849"]] },
  { name: "Jaggery Powder", subtitle: "Natural Sweetener", image: "/jaggery%20powder.png", sizes: [["500g", "₹449"], ["1kg", "₹849"]] },
  { name: "Cold-Pressed Mustard Oil", image: "/oil.png", sizes: [["500ml", "₹349"], ["1L", "₹649"]] },
];

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/* ---------------------------- Custom marks ----------------------------- */

function StampMark({ className = "h-16 w-16", label = "शुद्ध", sub = "PURE & HOMEMADE" }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <rect x="4" y="4" width="92" height="92" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="12" y="12" width="76" height="76" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
      <text x="50" y="47" textAnchor="middle" fontSize="18" fill="currentColor" className="sw-dev">
        {label}
      </text>
      {sub && (
        <text x="50" y="66" textAnchor="middle" fontSize="5.6" letterSpacing="1.5" fill="currentColor" className="sw-body" fontWeight="700">
          {sub}
        </text>
      )}
    </svg>
  );
}

function DiyaIcon({ className = "h-7 w-7" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 14.5c1.7 2.6 5.4 4.2 9.5 4.2s7.8-1.6 9.5-4.2" />
      <path d="M2.5 14.5c0-1.7 2.4-2.8 9.5-2.8s9.5 1.1 9.5 2.8" />
      <path d="M12 11.7V8.6" />
      <path
        d="M12 8.6c-1.3-.9-1.7-2.4-.7-3.9C12.2 3.4 12 2 12 2s2.4 1.3 2.1 3.4c-.2 1.3-.9 2.2-2.1 3.2z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function MortarPestleIcon({ className = "h-7 w-7" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 12.2c0 4 3.2 6.8 7.5 6.8s7.5-2.8 7.5-6.8" />
      <path d="M3.5 12.2h17" />
      <path d="M9.3 6.4l7.4-3.6" />
      <circle cx="17.3" cy="2.4" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SproutIcon({ className = "h-7 w-7" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21V11" />
      <path d="M12 12C12 8 9 6 4.5 6c0 4.5 2.5 7 7.5 7" />
      <path d="M12 9c0-3.5 2.5-5.5 7-5.5C19 7.3 16.5 9.7 12 9.7" />
    </svg>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center border-2 border-[#AD7A2C] bg-[#1D1712] text-[#F5EFDD]">
        <StampMark className="h-9 w-9" label="स" sub="" />
      </div>
      <div>
        <p className="sw-display text-2xl tracking-wide text-[#1D1712]">SATWA</p>
        <p className="sw-dev text-xs text-[#7C2B22]">सत्त्व · essence of purity</p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    product: products[0].name,
    quantity: "",
    note: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setFormData((current) => ({ ...current, product: product.name }));
    setSubmitted(false);
    setStatus(null);
  };

  const handleChange = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const validateForm = () => {
    const formErrors = {};
    if (!formData.name.trim()) formErrors.name = "Name is required.";
    if (!formData.phone.trim()) formErrors.phone = "Phone number is required.";
    if (!formData.address.trim()) formErrors.address = "Delivery address is required.";
    if (!formData.city.trim()) formErrors.city = "City or town is required.";
    if (!formData.quantity.trim()) formErrors.quantity = "Quantity is required.";
    return formErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateForm();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      setSubmitted(false);
      setStatus(null);
      return;
    }

    setErrors({});
    setLoading(true);
    setStatus(null);

    try {
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        throw new Error("EmailJS is not configured yet. Add your service ID, template ID, and public key to the client environment variables.");
      }

      const templateParams = {
        from_name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        product: formData.product,
        quantity: formData.quantity,
        note: formData.note || "No additional notes.",
      };

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);

      setSubmitted(true);
      setStatus({ type: "success", message: "Inquiry sent successfully. We'll reach out soon." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Could not send inquiry." });
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  const promises = [
    { Icon: DiyaIcon, title: "Homemade", text: "Lit and made in a family kitchen — no factory line, just batches small enough to watch." },
    { Icon: ShieldCheck, title: "No Preservatives", text: "Nothing added to extend shelf life. What shortens it is exactly what you're buying." },
    { Icon: MortarPestleIcon, title: "Traditionally Made", text: "Slow methods passed down at home — ground, pressed, and set the old way." },
    { Icon: SproutIcon, title: "Honest Ingredients", text: "Everyday staples your grandmother would recognize, nothing your body has to decode." },
  ];

  return (
    <main className="min-h-screen bg-[#E8E0CB] sw-body text-[#1D1712]">
      {FONTS}

      <nav className="fixed inset-x-0 top-0 z-40 border-b-2 border-[#1D1712] bg-[#E8E0CB]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Logo />
          <div className="hidden items-center gap-8 text-sm font-bold uppercase tracking-wide text-[#1D1712] md:flex">
            <a href="#products" className="transition hover:text-[#7C2B22]">Products</a>
            <a href="#prices" className="transition hover:text-[#7C2B22]">Prices</a>
            <a href="#contact" className="transition hover:text-[#7C2B22]">Contact</a>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border-2 border-[#1D1712] bg-[#1D1712] px-4 py-2 text-sm font-bold uppercase tracking-wide text-[#F5EFDD] transition hover:bg-[#7C2B22] hover:border-[#7C2B22]"
          >
            <ShoppingBag className="h-4 w-4" />
            Order
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden border-b-2 border-[#1D1712] pt-24">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,transparent_60%,rgba(173,122,44,0.10)_60%,rgba(173,122,44,0.10)_100%)]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div {...fadeUp} className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 border-2 border-[#1D1712] bg-[#F5EFDD] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1D1712]">
              <span className="h-2 w-2 bg-[#7C2B22]" />
              Homemade · No Preservatives
            </div>
            <h1 className="sw-display text-6xl leading-[0.98] text-[#1D1712] sm:text-7xl lg:text-[5.2rem]">
              Satwa
              <span className="mt-4 block text-2xl not-italic text-[#7C2B22] sm:text-3xl">
                <em className="sw-display italic">what your kitchen tasted like</em> before shortcuts
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#1D1712]/75">
              Ghee, jaggery, mustard oil, and laddus — made in small batches, the way a household
              would make them for itself, then sent straight to your door.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#prices" className="cut-tr-sm border-2 border-[#1D1712] bg-[#7C2B22] px-7 py-3 font-bold uppercase tracking-wide text-[#F5EFDD] transition hover:bg-[#1D1712]">
                View Prices
              </a>
              <a href="#contact" className="cut-tr-sm border-2 border-[#1D1712] px-7 py-3 font-bold uppercase tracking-wide text-[#1D1712] transition hover:bg-[#1D1712] hover:text-[#F5EFDD]">
                Place an Order
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="relative"
          >
            <div className="cut-tr overflow-hidden border-4 border-[#1D1712]">
              <img
                src="/satwa-hero.jpeg"
                alt="Satwa mustard oil bottle with traditional ingredients"
                className="h-[430px] w-full object-cover object-center sm:h-[560px] lg:h-[640px]"
              />
            </div>
            <div className="absolute -bottom-7 -left-7 grid h-28 w-28 place-items-center border-2 border-[#1D1712] bg-[#AD7A2C] text-[#1D1712] sm:h-32 sm:w-32">
              <StampMark className="h-24 w-24 sm:h-28 sm:w-28" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="border-b-2 border-[#1D1712] bg-[#E8E0CB] py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div {...fadeUp} className="flex flex-col gap-3 border-b-2 border-[#1D1712]/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C2B22]">The Range</p>
              <h2 className="mt-3 sw-display text-4xl text-[#1D1712] sm:text-5xl">Six staples, made the slow way</h2>
            </div>
            <p className="max-w-sm text-sm text-[#1D1712]/60">Tap a product to select it — your choice carries through to the order form below.</p>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => {
              const isSelected = selectedProduct.name === product.name;
              return (
                <motion.button
                  key={product.name}
                  type="button"
                  onClick={() => handleSelectProduct(product)}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.04 }}
                  className={`cut-tr-sm border-2 p-6 text-left transition hover:-translate-y-0.5 ${
                    isSelected
                      ? "border-[#1D1712] bg-[#1D1712] text-[#F5EFDD]"
                      : "border-[#1D1712]/25 bg-[#F5EFDD] text-[#1D1712] hover:border-[#1D1712]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`h-12 w-12 rounded-2xl border-2 object-cover ${isSelected ? "border-[#AD7A2C] bg-[#1D1712]" : "border-[#1D1712]/20 bg-[#E8E0CB]"}`}
                    />
                    {isSelected && (
                      <span className="border border-[#AD7A2C] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#AD7A2C]">
                        Selected
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 sw-display text-2xl">{product.name}</h3>
                  {product.subtitle && (
                    <p className={`mt-1 text-xs font-bold uppercase tracking-wide ${isSelected ? "text-[#AD7A2C]" : "text-[#7C2B22]"}`}>{product.subtitle}</p>
                  )}
                  <div className={`mt-6 divide-y ${isSelected ? "divide-[#F5EFDD]/15" : "divide-[#1D1712]/10"}`}>
                    {product.sizes.map(([size, price]) => (
                      <div key={size} className="flex items-center justify-between py-2.5">
                        <span className={`text-sm font-semibold ${isSelected ? "text-[#F5EFDD]/65" : "text-[#1D1712]/55"}`}>{size}</span>
                        <span className="sw-display text-lg">{price}</span>
                      </div>
                    ))}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROMISES */}
      <section className="relative overflow-hidden border-b-2 border-[#1D1712] bg-[#1D1712] py-20 text-[#F5EFDD]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(#F5EFDD 1px, transparent 1px), linear-gradient(90deg, #F5EFDD 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div {...fadeUp} className="max-w-xl border-l-2 border-[#AD7A2C] pl-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#AD7A2C]">Our Promise</p>
            <h2 className="mt-3 sw-display text-4xl sm:text-5xl">Four things we won't shortcut</h2>
          </motion.div>
          <div className="mt-12 grid gap-px overflow-hidden border-2 border-[#F5EFDD]/15 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((item, index) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: index * 0.05 }}
                className="bg-[#1D1712] p-6 outline outline-1 outline-[#F5EFDD]/10"
              >
                <item.Icon className="h-8 w-8 text-[#AD7A2C]" />
                <h3 className="mt-5 sw-display text-2xl">{item.title}</h3>
                <p className="mt-3 leading-7 text-[#F5EFDD]/65">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICES */}
      <section id="prices" className="border-b-2 border-[#1D1712] bg-[#DCD0AE] py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div {...fadeUp} className="border-2 border-[#1D1712] bg-[#F5EFDD]">
            <div className="flex flex-col justify-between gap-5 border-b-2 border-[#1D1712] p-6 md:flex-row md:items-end sm:p-9">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C2B22]">Price List</p>
                <h2 className="mt-3 sw-display text-4xl text-[#1D1712]">Every jar, every batch, one price</h2>
              </div>
              <p className="max-w-md text-sm text-[#1D1712]/60">For bulk orders or custom packing, mention it in the notes field below and we'll follow up directly.</p>
            </div>
            <div>
              {products.map((product, i) => (
                <div key={product.name} className={`grid gap-3 px-6 py-5 sm:px-9 md:grid-cols-[1fr_1.3fr] md:items-center ${i !== products.length - 1 ? "border-b-2 border-[#1D1712]/10" : ""}`}>
                  <div className="flex items-center gap-3 sw-display text-xl text-[#1D1712]">
                    <img src={product.image} alt={product.name} className="h-9 w-9 rounded-xl border border-[#1D1712]/20 bg-[#E8E0CB] object-cover" aria-hidden="true" />
                    <span>{product.name}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {product.sizes.map(([size, price]) => (
                      <div key={size} className="flex items-center justify-between border border-[#1D1712]/15 bg-[#E8E0CB] px-4 py-2.5">
                        <span className="text-sm font-medium text-[#1D1712]/60">{size}</span>
                        <span className="font-bold text-[#7C2B22]">{price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-[#E8E0CB] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C2B22]">Order Inquiry</p>
            <h2 className="mt-3 sw-display text-4xl text-[#1D1712] sm:text-5xl">Tell us what you want to buy</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#1D1712]/70">
              Pick a product above, fill in your delivery details, and we'll confirm the order with
              you by phone before it's packed.
            </p>
            <div className="mt-8 cut-bl border-2 border-[#1D1712] bg-[#3E4A2F] p-6 text-[#F5EFDD]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AD7A2C]">Selected product</p>
              <div className="mt-4 flex flex-col gap-2 border-2 border-[#F5EFDD]/20 bg-[#1D1712] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="h-11 w-11 rounded-2xl border border-[#F5EFDD]/20 bg-[#3E4A2F] object-cover" />
                  <div>
                    <p className="sw-display text-xl">{selectedProduct.name}</p>
                    <p className="mt-0.5 text-sm text-[#F5EFDD]/55">{selectedProduct.sizes[0][0]} · {selectedProduct.sizes[0][1]}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 border border-[#AD7A2C] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#AD7A2C]">
                  <ArrowUpRight className="h-3.5 w-3.5" /> In cart
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="cut-tr border-2 border-[#1D1712] bg-[#F5EFDD] p-6 sm:p-8">
            <form className="mt-2 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-wide text-[#1D1712]">
                Name
                <input
                  value={formData.name}
                  onChange={handleChange("name")}
                  className="border-2 border-[#1D1712]/20 bg-[#E8E0CB] px-4 py-3 font-normal normal-case tracking-normal outline-none transition focus:border-[#7C2B22]"
                  placeholder="Your name"
                />
                {errors.name && <span className="text-xs font-semibold normal-case tracking-normal text-[#7C2B22]">{errors.name}</span>}
              </label>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-wide text-[#1D1712]">
                Phone
                <input
                  value={formData.phone}
                  onChange={handleChange("phone")}
                  className="border-2 border-[#1D1712]/20 bg-[#E8E0CB] px-4 py-3 font-normal normal-case tracking-normal outline-none transition focus:border-[#7C2B22]"
                  placeholder="Phone number"
                />
                {errors.phone && <span className="text-xs font-semibold normal-case tracking-normal text-[#7C2B22]">{errors.phone}</span>}
              </label>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-wide text-[#1D1712]">
                Delivery address
                <input
                  value={formData.address}
                  onChange={handleChange("address")}
                  className={`border-2 px-4 py-3 font-normal normal-case tracking-normal outline-none transition focus:border-[#7C2B22] ${
                    errors.address ? "border-[#7C2B22] bg-[#7C2B22]/[0.05]" : "border-[#1D1712]/20 bg-[#E8E0CB]"
                  }`}
                  placeholder="Street, building, area"
                />
                {errors.address && <span className="text-xs font-semibold normal-case tracking-normal text-[#7C2B22]">{errors.address}</span>}
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold uppercase tracking-wide text-[#1D1712]">
                  City / Town
                  <input
                    value={formData.city}
                    onChange={handleChange("city")}
                    className={`border-2 px-4 py-3 font-normal normal-case tracking-normal outline-none transition focus:border-[#7C2B22] ${
                      errors.city ? "border-[#7C2B22] bg-[#7C2B22]/[0.05]" : "border-[#1D1712]/20 bg-[#E8E0CB]"
                    }`}
                    placeholder="City or town"
                  />
                  {errors.city && <span className="text-xs font-semibold normal-case tracking-normal text-[#7C2B22]">{errors.city}</span>}
                </label>
                <label className="grid gap-2 text-sm font-bold uppercase tracking-wide text-[#1D1712]">
                  Quantity
                  <input
                    value={formData.quantity}
                    onChange={handleChange("quantity")}
                    className={`border-2 px-4 py-3 font-normal normal-case tracking-normal outline-none transition focus:border-[#7C2B22] ${
                      errors.quantity ? "border-[#7C2B22] bg-[#7C2B22]/[0.05]" : "border-[#1D1712]/20 bg-[#E8E0CB]"
                    }`}
                    placeholder="e.g. 2 kg or 1 bottle"
                  />
                  {errors.quantity && <span className="text-xs font-semibold normal-case tracking-normal text-[#7C2B22]">{errors.quantity}</span>}
                </label>
              </div>


              
              <label className="grid gap-2 text-sm font-bold uppercase tracking-wide text-[#1D1712]">
                Notes
                <textarea
                  value={formData.note}
                  onChange={handleChange("note")}
                  className="min-h-32 border-2 border-[#1D1712]/20 bg-[#E8E0CB] px-4 py-3 font-normal normal-case tracking-normal outline-none transition focus:border-[#7C2B22]"
                  placeholder="Additional details or special request"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="cut-tr-sm inline-flex items-center justify-center gap-2 border-2 border-[#1D1712] bg-[#7C2B22] px-7 py-3 font-bold uppercase tracking-wide text-[#F5EFDD] transition hover:bg-[#1D1712] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingBag className="h-5 w-5" />
                {loading ? "Sending..." : "Send Inquiry"}
              </button>
              {status && (
                <div className={`border-2 p-5 text-sm font-medium ${status.type === "success" ? "border-[#3E4A2F] bg-[#3E4A2F]/10 text-[#3E4A2F]" : "border-[#7C2B22] bg-[#7C2B22]/5 text-[#7C2B22]"}`}>
                  {status.message}
                </div>
              )}
            </form>
            {submitted && (
              <div className="mt-6 flex items-start gap-3 border-2 border-[#3E4A2F] bg-[#3E4A2F]/[0.06] p-5">
                <StampMark className="h-12 w-12 shrink-0 text-[#3E4A2F]" label="✓" sub="" />
                <div>
                  <p className="sw-display text-lg text-[#3E4A2F]">Inquiry sent!</p>
                  <p className="mt-1 text-sm text-[#1D1712]/65">
                    Thank you, {formData.name || "customer"}. We'll call to confirm delivery for{" "}
                    <strong>{formData.product}</strong>.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-2 border-[#1D1712] bg-[#1D1712] text-[#F5EFDD]">
        <div className="mx-auto max-w-7xl space-y-8 px-5 py-14 sm:px-8 lg:flex lg:items-start lg:justify-between lg:space-y-0">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center border-2 border-[#AD7A2C] bg-[#F5EFDD]/5">
                <StampMark className="h-9 w-9" label="स" sub="" />
              </div>
              <div>
                <p className="sw-display text-xl">SATWA</p>
                <p className="sw-dev text-sm text-[#AD7A2C]">सत्त्व · essence of purity</p>
              </div>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#F5EFDD]/60">
              Named for sattva — the idea, in Ayurvedic thought, of purity and balance. We try to
              earn that name one batch at a time, sold direct, no middle layer between our kitchen
              and yours.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-10 lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AD7A2C]">Contact</p>
              <p className="mt-4 flex items-center gap-2 text-sm leading-7 text-[#F5EFDD]/75"><Phone className="h-4 w-4" /> +91 98765 43210</p>
              <p className="flex items-center gap-2 text-sm leading-7 text-[#F5EFDD]/75"><Mail className="h-4 w-4" /> hello@satwa.example</p>
              <p className="flex items-center gap-2 text-sm leading-7 text-[#F5EFDD]/75"><MapPin className="h-4 w-4" /> Ahmedabad, Gujarat</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AD7A2C]">Quick links</p>
              <div className="mt-4 space-y-3 text-sm">
                <a href="#products" className="block transition hover:text-[#AD7A2C]">Products</a>
                <a href="#prices" className="block transition hover:text-[#AD7A2C]">Prices</a>
                <a href="#contact" className="block transition hover:text-[#AD7A2C]">Send inquiry</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useScroll,
  useInView,
  animate,
} from "framer-motion";
import emailjs from "emailjs-com";
import React, { useState, useRef, useEffect } from "react";
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
/*  ink #1D1712 · stone #ECE3CC · stone-deep #DCD0AE                      */
/*  brass #B8863A · brick #8C3324 · olive #46512F · paper #FBF6E9         */
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

    @keyframes sw-marquee {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    .sw-marquee-track { animation: sw-marquee 26s linear infinite; }

    @keyframes sw-sheen {
      0% { transform: translateX(-130%) rotate(8deg); opacity: 0; }
      12% { opacity: .55; }
      55% { opacity: .2; }
      100% { transform: translateX(130%) rotate(8deg); opacity: 0; }
    }
    .sw-sheen { animation: sw-sheen 2.6s cubic-bezier(.65,0,.35,1) 1s 1 both; }

    @media (prefers-reduced-motion: reduce) {
      .sw-marquee-track { animation: none; }
      .sw-sheen { animation: none; opacity: 0; }
    }
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

function DiyaIcon({ className = "h-7 w-7", animated = false }) {
  const prefersReducedMotion = useReducedMotion();
  const flame = animated && !prefersReducedMotion;
  const FlameTag = flame ? motion.path : "path";
  const flameProps = flame
    ? {
        animate: { opacity: [1, 0.75, 1], y: [0, -0.7, 0] },
        transition: { duration: 2.3, repeat: Infinity, ease: "easeInOut" },
      }
    : {};
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 14.5c1.7 2.6 5.4 4.2 9.5 4.2s7.8-1.6 9.5-4.2" />
      <path d="M2.5 14.5c0-1.7 2.4-2.8 9.5-2.8s9.5 1.1 9.5 2.8" />
      <path d="M12 11.7V8.6" />
      <FlameTag
        d="M12 8.6c-1.3-.9-1.7-2.4-.7-3.9C12.2 3.4 12 2 12 2s2.4 1.3 2.1 3.4c-.2 1.3-.9 2.2-2.1 3.2z"
        fill="currentColor"
        stroke="none"
        {...flameProps}
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

function CheckMark({ className = "h-7 w-7" }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <motion.circle
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="1.6"
        initial={prefersReducedMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.path
        d="M7.5 12.5l3 3 6-6.5"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        initial={prefersReducedMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.45 }}
      />
    </svg>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center border-2 border-[#B8863A] bg-[#ECE3CC] text-[#FBF6E9]">
        <img src="/logo.png" alt="Satwa logo" className="h-9 w-9 object-contain" />
      </div>
      <div>
        <p className="sw-display text-2xl tracking-wide text-[#1D1712]">SATWA</p>
        <p className="sw-dev text-xs text-[#8C3324]">सत्त्व · essence of purity</p>
      </div>
    </div>
  );
}

/* ------------------------------ Motion bits ----------------------------- */

function AnimatedCounter({ value, suffix = "", duration = 1.3 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value, duration, prefersReducedMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

function TiltCard({ className, onClick, children }) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 220, damping: 22 });
  const springY = useSpring(rotateY, { stiffness: 220, damping: 22 });

  const handleMouseMove = (event) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 9);
    rotateX.set(py * -9);
  };
  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 900 }}
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

const INGREDIENT_WORDS = [
  "Desi Cow Ghee", "Natural Jaggery", "Cold-Pressed Mustard Oil",
  "Dry Fruit Laddus", "Buffalo Ghee", "Jaggery Powder",
];

function IngredientMarquee() {
  const items = [...INGREDIENT_WORDS, ...INGREDIENT_WORDS];
  return (
    <div className="overflow-hidden border-y-2 border-[#1D1712] bg-[#1D1712] py-3">
      <div className="sw-marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {items.map((word, i) => (
          <span key={`${word}-${i}`} className="flex items-center gap-10 text-sm font-bold uppercase tracking-[0.14em] text-[#FBF6E9]/70">
            {word}
            <span className="text-[#B8863A]">✦</span>
          </span>
        ))}
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
  const [scrolled, setScrolled] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fadeUp = prefersReducedMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 22 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.6, ease: "easeOut" },
      };

  const letterContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.045 } },
  };
  const letterVariant = {
    hidden: { opacity: 0, y: 40, rotateX: -80 },
    show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };
  const wordContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } },
  };
  const wordVariant = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

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
    { Icon: DiyaIcon, title: "Homemade", stat: 1, suffix: " kitchen", text: "Lit and made in a family kitchen — no factory line, just batches small enough to watch.", animated: true },
    { Icon: ShieldCheck, title: "No Preservatives", stat: 0, suffix: " additives", text: "Nothing added to extend shelf life. What shortens it is exactly what you're buying." },
    { Icon: MortarPestleIcon, title: "Traditionally Made", stat: 3, suffix: " generations", text: "Slow methods passed down at home — ground, pressed, and set the old way." },
    { Icon: SproutIcon, title: "Honest Ingredients", stat: 6, suffix: " staples", text: "Everyday staples your grandmother would recognize, nothing your body has to decode." },
  ];

  return (
    <main className="min-h-screen bg-[#ECE3CC] sw-body text-[#1D1712]">
      {FONTS}

      <motion.div
        className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-[#B8863A]"
        style={{ scaleX: scrollYProgress }}
      />

      <nav className={`fixed inset-x-0 top-0 z-40 border-b-2 border-[#1D1712] bg-[#ECE3CC]/95 backdrop-blur-xl transition-shadow ${scrolled ? "shadow-[0_8px_24px_-16px_rgba(29,23,18,0.5)]" : ""}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Logo />
          <div className="hidden items-center gap-8 text-sm font-bold uppercase tracking-wide text-[#1D1712] md:flex">
            <a href="#products" className="relative py-1 transition hover:text-[#8C3324] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#8C3324] after:transition-all after:duration-300 hover:after:w-full">Products</a>
            <a href="#prices" className="relative py-1 transition hover:text-[#8C3324] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#8C3324] after:transition-all after:duration-300 hover:after:w-full">Prices</a>
            <a href="#contact" className="relative py-1 transition hover:text-[#8C3324] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#8C3324] after:transition-all after:duration-300 hover:after:w-full">Contact</a>
          </div>
          <motion.a
            href="#contact"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 border-2 border-[#1D1712] bg-[#1D1712] px-4 py-2 text-sm font-bold uppercase tracking-wide text-[#FBF6E9] transition-colors hover:bg-[#8C3324] hover:border-[#8C3324]"
          >
            <ShoppingBag className="h-4 w-4" />
            Order
          </motion.a>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="relative isolate overflow-hidden border-b-2 border-[#1D1712] bg-[#ECE3CC]"
        style={{
          // Change this one value to use any background color you want.
          backgroundColor: "#ECE3CC",
        }}
      >
        {/* Generated transparent product composition */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-y-0 right-0 w-full lg:w-[68%]">
            <img
              src="/satwa-products.png"
              alt=""
              aria-hidden="true"
              className="h-full w-full -translate-y-10 object-contain object-right-bottom"
            />
          </div>
        </div>

        <div className="relative mx-auto flex min-h-[760px] max-w-7xl items-center px-5 py-24 sm:px-8 lg:min-h-[780px]">
          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-7 inline-flex items-center gap-2 border-2 border-[#1D1712] bg-[#FBF6E9]/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1D1712] backdrop-blur-sm"
            >
              <span className="h-2 w-2 bg-[#8C3324]" />
              Homemade · No Preservatives
            </motion.div>

            <h1 className="sw-display text-6xl leading-[0.98] text-[#1D1712] sm:text-7xl lg:text-[5.4rem]" style={{ perspective: 600 }}>
              <motion.span
                variants={letterContainer}
                initial={prefersReducedMotion ? "show" : "hidden"}
                animate="show"
                className="inline-block"
              >
                {"Satwa".split("").map((letter, i) => (
                  <motion.span key={i} variants={letterVariant} className="inline-block">
                    {letter}
                  </motion.span>
                ))}
              </motion.span>

              <motion.span
                variants={wordContainer}
                initial={prefersReducedMotion ? "show" : "hidden"}
                animate="show"
                className="mt-4 block text-2xl not-italic text-[#8C3324] sm:text-3xl"
              >
                {"what your kitchen tasted like before shortcuts".split(" ").map((word, i) => (
                  <motion.span key={i} variants={wordVariant} className="sw-display italic mr-[0.28em] inline-block">
                    {word}
                  </motion.span>
                ))}
              </motion.span>
            </h1>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-6 max-w-xl text-lg leading-8 text-[#1D1712]/75"
            >
              Ghee, jaggery, mustard oil, and laddus — made in small batches, the way a household
              would make them for itself, then sent straight to your door.
            </motion.p>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.05 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <motion.a
                href="#prices"
                whileHover={prefersReducedMotion ? undefined : { scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="cut-tr-sm border-2 border-[#1D1712] bg-[#8C3324] px-7 py-3 font-bold uppercase tracking-wide text-[#FBF6E9] transition-colors hover:bg-[#1D1712]"
              >
                View Prices
              </motion.a>

              <motion.a
                href="#contact"
                whileHover={prefersReducedMotion ? undefined : { scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="cut-tr-sm border-2 border-[#1D1712] bg-[#FBF6E9]/70 px-7 py-3 font-bold uppercase tracking-wide text-[#1D1712] backdrop-blur-sm transition-colors hover:bg-[#1D1712] hover:text-[#FBF6E9]"
              >
                Place an Order
              </motion.a>
            </motion.div>
          </div>
        </div>

        <IngredientMarquee />
      </section>

      {/* PRODUCTS */}
      <section id="products" className="border-b-2 border-[#1D1712] bg-[#ECE3CC] py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div {...fadeUp} className="flex flex-col gap-3 border-b-2 border-[#1D1712]/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8C3324]">The Range</p>
              <h2 className="mt-3 sw-display text-4xl text-[#1D1712] sm:text-5xl">Six staples, made the slow way</h2>
            </div>
            <p className="max-w-sm text-sm text-[#1D1712]/60">Tap a product to select it — your choice carries through to the order form below.</p>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: 1200 }}>
            {products.map((product, index) => {
              const isSelected = selectedProduct.name === product.name;
              return (
                <motion.div
                  key={product.name}
                  {...fadeUp}
                  transition={{ ...(fadeUp.transition || {}), delay: prefersReducedMotion ? 0 : index * 0.04 }}
                >
                  <TiltCard
                    onClick={() => handleSelectProduct(product)}
                    className={`group w-full cut-tr-sm border-2 p-6 text-left transition-colors ${
                      isSelected
                        ? "border-[#1D1712] bg-[#1D1712] text-[#FBF6E9]"
                        : "border-[#1D1712]/25 bg-[#FBF6E9] text-[#1D1712] hover:border-[#1D1712]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className={`h-12 w-12 overflow-hidden rounded-2xl border-2 ${isSelected ? "border-[#B8863A] bg-[#1D1712]" : "border-[#1D1712]/20 bg-[#ECE3CC]"}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            className="border border-[#B8863A] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#B8863A]"
                          >
                            Selected
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <h3 className="mt-4 sw-display text-2xl">{product.name}</h3>
                    {product.subtitle && (
                      <p className={`mt-1 text-xs font-bold uppercase tracking-wide ${isSelected ? "text-[#B8863A]" : "text-[#8C3324]"}`}>{product.subtitle}</p>
                    )}
                    <div className={`mt-6 divide-y ${isSelected ? "divide-[#FBF6E9]/15" : "divide-[#1D1712]/10"}`}>
                      {product.sizes.map(([size, price]) => (
                        <div key={size} className="flex items-center justify-between py-2.5">
                          <span className={`text-sm font-semibold ${isSelected ? "text-[#FBF6E9]/65" : "text-[#1D1712]/55"}`}>{size}</span>
                          <span className="sw-display text-lg">{price}</span>
                        </div>
                      ))}
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROMISES */}
      <section className="relative overflow-hidden border-b-2 border-[#1D1712] bg-[#1D1712] py-20 text-[#FBF6E9]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(#FBF6E9 1px, transparent 1px), linear-gradient(90deg, #FBF6E9 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div {...fadeUp} className="max-w-xl border-l-2 border-[#B8863A] pl-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#B8863A]">Our Promise</p>
            <h2 className="mt-3 sw-display text-4xl sm:text-5xl">Four things we won't shortcut</h2>
          </motion.div>
          <div className="mt-12 grid gap-px overflow-hidden border-2 border-[#FBF6E9]/15 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((item, index) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ ...(fadeUp.transition || {}), delay: prefersReducedMotion ? 0 : index * 0.05 }}
                className="bg-[#1D1712] p-6 outline outline-1 outline-[#FBF6E9]/10"
              >
                <item.Icon className="h-8 w-8 text-[#B8863A]" animated={item.animated} />
                <p className="mt-5 sw-display text-4xl text-[#B8863A]">
                  <AnimatedCounter value={item.stat} suffix={item.suffix} />
                </p>
                <h3 className="mt-1 sw-display text-2xl">{item.title}</h3>
                <p className="mt-3 leading-7 text-[#FBF6E9]/65">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICES */}
      <section id="prices" className="border-b-2 border-[#1D1712] bg-[#DCD0AE] py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div {...fadeUp} className="border-2 border-[#1D1712] bg-[#FBF6E9]">
            <div className="flex flex-col justify-between gap-5 border-b-2 border-[#1D1712] p-6 md:flex-row md:items-end sm:p-9">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8C3324]">Price List</p>
                <h2 className="mt-3 sw-display text-4xl text-[#1D1712]">Every jar, every batch, one price</h2>
              </div>
              <p className="max-w-md text-sm text-[#1D1712]/60">For bulk orders or custom packing, mention it in the notes field below and we'll follow up directly.</p>
            </div>
            <div>
              {products.map((product, i) => (
                <div
                  key={product.name}
                  className={`group grid gap-3 px-6 py-5 transition-colors hover:bg-[#ECE3CC]/60 sm:px-9 md:grid-cols-[1fr_1.3fr] md:items-center ${i !== products.length - 1 ? "border-b-2 border-[#1D1712]/10" : ""}`}
                >
                  <div className="flex items-center gap-3 sw-display text-xl text-[#1D1712]">
                    <img src={product.image} alt={product.name} className="h-9 w-9 rounded-xl border border-[#1D1712]/20 bg-[#ECE3CC] object-cover transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                    <span>{product.name}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {product.sizes.map(([size, price]) => (
                      <div key={size} className="flex items-center justify-between border border-[#1D1712]/15 bg-[#ECE3CC] px-4 py-2.5">
                        <span className="text-sm font-medium text-[#1D1712]/60">{size}</span>
                        <span className="font-bold text-[#8C3324]">{price}</span>
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
      <section id="contact" className="bg-[#ECE3CC] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8C3324]">Order Inquiry</p>
            <h2 className="mt-3 sw-display text-4xl text-[#1D1712] sm:text-5xl">Tell us what you want to buy</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#1D1712]/70">
              Pick a product above, fill in your delivery details, and we'll confirm the order with
              you by phone before it's packed.
            </p>
            <div className="mt-8 cut-bl border-2 border-[#1D1712] bg-[#46512F] p-6 text-[#FBF6E9]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B8863A]">Selected product</p>
              <div className="relative mt-4 min-h-[76px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedProduct.name}
                    initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex flex-col gap-2 border-2 border-[#FBF6E9]/20 bg-[#1D1712] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img src={selectedProduct.image} alt={selectedProduct.name} className="h-11 w-11 rounded-2xl border border-[#FBF6E9]/20 bg-[#46512F] object-cover" />
                      <div>
                        <p className="sw-display text-xl">{selectedProduct.name}</p>
                        <p className="mt-0.5 text-sm text-[#FBF6E9]/55">{selectedProduct.sizes[0][0]} · {selectedProduct.sizes[0][1]}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 border border-[#B8863A] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#B8863A]">
                      <ArrowUpRight className="h-3.5 w-3.5" /> In cart
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="cut-tr border-2 border-[#1D1712] bg-[#FBF6E9] p-6 sm:p-8">
            <form className="mt-2 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-wide text-[#1D1712]">
                Name
                <input
                  value={formData.name}
                  onChange={handleChange("name")}
                  className="border-2 border-[#1D1712]/20 bg-[#ECE3CC] px-4 py-3 font-normal normal-case tracking-normal outline-none transition-colors focus:border-[#8C3324]"
                  placeholder="Your name"
                />
                {errors.name && <span className="text-xs font-semibold normal-case tracking-normal text-[#8C3324]">{errors.name}</span>}
              </label>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-wide text-[#1D1712]">
                Phone
                <input
                  value={formData.phone}
                  onChange={handleChange("phone")}
                  className="border-2 border-[#1D1712]/20 bg-[#ECE3CC] px-4 py-3 font-normal normal-case tracking-normal outline-none transition-colors focus:border-[#8C3324]"
                  placeholder="Phone number"
                />
                {errors.phone && <span className="text-xs font-semibold normal-case tracking-normal text-[#8C3324]">{errors.phone}</span>}
              </label>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-wide text-[#1D1712]">
                Delivery address
                <input
                  value={formData.address}
                  onChange={handleChange("address")}
                  className={`border-2 px-4 py-3 font-normal normal-case tracking-normal outline-none transition-colors focus:border-[#8C3324] ${
                    errors.address ? "border-[#8C3324] bg-[#8C3324]/[0.05]" : "border-[#1D1712]/20 bg-[#ECE3CC]"
                  }`}
                  placeholder="Street, building, area"
                />
                {errors.address && <span className="text-xs font-semibold normal-case tracking-normal text-[#8C3324]">{errors.address}</span>}
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold uppercase tracking-wide text-[#1D1712]">
                  City / Town
                  <input
                    value={formData.city}
                    onChange={handleChange("city")}
                    className={`border-2 px-4 py-3 font-normal normal-case tracking-normal outline-none transition-colors focus:border-[#8C3324] ${
                      errors.city ? "border-[#8C3324] bg-[#8C3324]/[0.05]" : "border-[#1D1712]/20 bg-[#ECE3CC]"
                    }`}
                    placeholder="City or town"
                  />
                  {errors.city && <span className="text-xs font-semibold normal-case tracking-normal text-[#8C3324]">{errors.city}</span>}
                </label>
                <label className="grid gap-2 text-sm font-bold uppercase tracking-wide text-[#1D1712]">
                  Quantity
                  <input
                    value={formData.quantity}
                    onChange={handleChange("quantity")}
                    className={`border-2 px-4 py-3 font-normal normal-case tracking-normal outline-none transition-colors focus:border-[#8C3324] ${
                      errors.quantity ? "border-[#8C3324] bg-[#8C3324]/[0.05]" : "border-[#1D1712]/20 bg-[#ECE3CC]"
                    }`}
                    placeholder="e.g. 2 kg or 1 bottle"
                  />
                  {errors.quantity && <span className="text-xs font-semibold normal-case tracking-normal text-[#8C3324]">{errors.quantity}</span>}
                </label>
              </div>

              <label className="grid gap-2 text-sm font-bold uppercase tracking-wide text-[#1D1712]">
                Notes
                <textarea
                  value={formData.note}
                  onChange={handleChange("note")}
                  className="min-h-32 border-2 border-[#1D1712]/20 bg-[#ECE3CC] px-4 py-3 font-normal normal-case tracking-normal outline-none transition-colors focus:border-[#8C3324]"
                  placeholder="Additional details or special request"
                />
              </label>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={prefersReducedMotion || loading ? undefined : { scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cut-tr-sm inline-flex items-center justify-center gap-2 border-2 border-[#1D1712] bg-[#8C3324] px-7 py-3 font-bold uppercase tracking-wide text-[#FBF6E9] transition-colors hover:bg-[#1D1712] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <motion.span
                  animate={loading && !prefersReducedMotion ? { rotate: 360 } : { rotate: 0 }}
                  transition={loading && !prefersReducedMotion ? { duration: 0.8, repeat: Infinity, ease: "linear" } : {}}
                >
                  <ShoppingBag className="h-5 w-5" />
                </motion.span>
                {loading ? "Sending..." : "Send Inquiry"}
              </motion.button>
              <AnimatePresence>
                {status && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`overflow-hidden border-2 p-5 text-sm font-medium ${status.type === "success" ? "border-[#46512F] bg-[#46512F]/10 text-[#46512F]" : "border-[#8C3324] bg-[#8C3324]/5 text-[#8C3324]"}`}
                  >
                    {status.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="mt-6 flex items-start gap-3 border-2 border-[#46512F] bg-[#46512F]/[0.06] p-5"
                >
                  <CheckMark className="h-10 w-10 shrink-0 text-[#46512F]" />
                  <div>
                    <p className="sw-display text-lg text-[#46512F]">Inquiry sent!</p>
                    <p className="mt-1 text-sm text-[#1D1712]/65">
                      Thank you, {formData.name || "customer"}. We'll call to confirm delivery for{" "}
                      <strong>{formData.product}</strong>.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-2 border-[#1D1712] bg-[#1D1712] text-[#FBF6E9]">
        <div className="mx-auto max-w-7xl space-y-8 px-5 py-14 sm:px-8 lg:flex lg:items-start lg:justify-between lg:space-y-0">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center border-2 border-[#B8863A] bg-[#ECE3CC]">
                <img src="/logo.png" alt="Satwa logo" className="h-9 w-9 object-contain" />
              </div>
              <div>
                <p className="sw-display text-xl">SATWA</p>
                <p className="sw-dev text-sm text-[#B8863A]">सत्त्व · essence of purity</p>
              </div>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#FBF6E9]/60">
              Named for sattva — the idea, in Ayurvedic thought, of purity and balance. We try to
              earn that name one batch at a time, sold direct, no middle layer between our kitchen
              and yours.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-10 lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B8863A]">Contact</p>
              <p className="mt-4 flex items-center gap-2 text-sm leading-7 text-[#FBF6E9]/75"><Phone className="h-4 w-4" /> +91 98765 43210</p>
              <p className="flex items-center gap-2 text-sm leading-7 text-[#FBF6E9]/75"><Mail className="h-4 w-4" /> hello@satwa.example</p>
              <p className="flex items-center gap-2 text-sm leading-7 text-[#FBF6E9]/75"><MapPin className="h-4 w-4" /> Ahmedabad, Gujarat</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B8863A]">Quick links</p>
              <div className="mt-4 space-y-3 text-sm">
                <a href="#products" className="block transition hover:text-[#B8863A]">Products</a>
                <a href="#prices" className="block transition hover:text-[#B8863A]">Prices</a>
                <a href="#contact" className="block transition hover:text-[#B8863A]">Send inquiry</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
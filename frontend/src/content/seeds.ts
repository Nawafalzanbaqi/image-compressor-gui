/**
 * Seed content that MIRRORS the Payload CMS collection schemas
 * (see payload.config.ts + src/payload/collections/*). These seeds are the
 * offline/fallback content source: when Payload/DB or the backend content API
 * is unavailable, feature `api/` functions read from here so the storefront
 * always renders real content instead of hardcoded JSX.
 *
 * IMPORTANT: components must NOT hardcode marketing copy. All editable copy,
 * images, order, and visibility flow through these typed structures, which are
 * the exact shape Payload authors would edit.
 */
import type { ProductDto, CategoryDto } from "@/lib/api/types";

export interface LocalizedText {
  en: string;
  ar: string;
}

export interface HeroSlide {
  id: string;
  order: number;
  visible: boolean;
  eyebrow: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  ctaLabel: LocalizedText;
  ctaHref: string;
  imageUrl: string;
}

export interface Banner {
  id: string;
  order: number;
  visible: boolean;
  title: LocalizedText;
  subtitle: LocalizedText;
  href: string;
  imageUrl: string;
}

export interface FaqItem {
  id: string;
  order: number;
  visible: boolean;
  question: LocalizedText;
  answer: LocalizedText;
}

export interface PageContent {
  slug: "about" | "contact";
  title: LocalizedText;
  body: LocalizedText;
}

export interface FooterColumn {
  heading: LocalizedText;
  links: { label: LocalizedText; href: string }[];
}

const IMG = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1200&q=70`;

export const heroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    order: 0,
    visible: true,
    eyebrow: { en: "New season", ar: "موسم جديد" },
    title: {
      en: "Refined essentials, crafted to last",
      ar: "أساسيات راقية، صُنعت لتدوم",
    },
    subtitle: {
      en: "A curated collection of premium goods, delivered across the Kingdom.",
      ar: "مجموعة مختارة من المنتجات الفاخرة، تُوصَّل إلى جميع أنحاء المملكة.",
    },
    ctaLabel: { en: "Shop the collection", ar: "تسوّق المجموعة" },
    ctaHref: "/products",
    imageUrl: IMG("photo-1441986300917-64674bd600d8"),
  },
];

export const banners: Banner[] = [
  {
    id: "banner-1",
    order: 0,
    visible: true,
    title: { en: "Free delivery over 200 SAR", ar: "توصيل مجاني فوق ٢٠٠ ر.س" },
    subtitle: { en: "Across all cities", ar: "في جميع المدن" },
    href: "/products",
    imageUrl: IMG("photo-1483985988355-763728e1935b"),
  },
  {
    id: "banner-2",
    order: 1,
    visible: true,
    title: { en: "Pay later with Tamara", ar: "ادفع لاحقًا مع تمارا" },
    subtitle: { en: "Split into installments", ar: "قسّمها على دفعات" },
    href: "/products",
    imageUrl: IMG("photo-1523275335684-37898b6baf30"),
  },
];

export const categories: CategoryDto[] = [
  { id: "c1", slug: "apparel", name: "Apparel", displayOrder: 0 },
  { id: "c2", slug: "accessories", name: "Accessories", displayOrder: 1 },
  { id: "c3", slug: "home", name: "Home", displayOrder: 2 },
  { id: "c4", slug: "beauty", name: "Beauty", displayOrder: 3 },
];

export const categoryImages: Record<string, string> = {
  apparel: IMG("photo-1441984904996-e0b6ba687e04"),
  accessories: IMG("photo-1523293182086-7651a899d37f"),
  home: IMG("photo-1556228453-efd6c1ff04f6"),
  beauty: IMG("photo-1596462502278-27bfdc403348"),
};

export const products: ProductDto[] = [
  {
    id: "p1",
    slug: "merino-wool-sweater",
    name: "Merino Wool Sweater",
    description:
      "A featherweight merino knit that regulates temperature season to season. Ethically sourced, machine washable.",
    price: { amount: 349, currency: "SAR" },
    categorySlug: "apparel",
    imageUrls: [IMG("photo-1576566588028-4147f3842f27")],
    inStock: true,
    isActive: true,
  },
  {
    id: "p2",
    slug: "leather-weekender-bag",
    name: "Leather Weekender Bag",
    description:
      "Full-grain leather holdall with brass hardware and a cotton-twill lining. Ages beautifully with use.",
    price: { amount: 899, currency: "SAR" },
    categorySlug: "accessories",
    imageUrls: [IMG("photo-1553062407-98eeb64c6a62")],
    inStock: true,
    isActive: true,
  },
  {
    id: "p3",
    slug: "ceramic-pour-over-set",
    name: "Ceramic Pour-Over Set",
    description:
      "Hand-glazed stoneware dripper and carafe for a clean, bright cup every morning.",
    price: { amount: 219, currency: "SAR" },
    categorySlug: "home",
    imageUrls: [IMG("photo-1495474472287-4d71bcdd2085")],
    inStock: true,
    isActive: true,
  },
  {
    id: "p4",
    slug: "silk-scarf",
    name: "Printed Silk Scarf",
    description:
      "100% mulberry silk with hand-rolled edges and an exclusive seasonal print.",
    price: { amount: 159, currency: "SAR" },
    categorySlug: "accessories",
    imageUrls: [IMG("photo-1601924994987-69e26d50dc26")],
    inStock: false,
    isActive: true,
  },
  {
    id: "p5",
    slug: "linen-shirt",
    name: "Garment-Dyed Linen Shirt",
    description:
      "Breathable European linen in a relaxed cut, garment-dyed for a lived-in softness.",
    price: { amount: 279, currency: "SAR" },
    categorySlug: "apparel",
    imageUrls: [IMG("photo-1602810318383-e386cc2a3ccf")],
    inStock: true,
    isActive: true,
  },
  {
    id: "p6",
    slug: "botanical-candle",
    name: "Botanical Soy Candle",
    description:
      "Hand-poured soy wax with cedar and bergamot. A 50-hour clean burn.",
    price: { amount: 129, currency: "SAR" },
    categorySlug: "home",
    imageUrls: [IMG("photo-1602874801006-e26e5f8bc03e")],
    inStock: true,
    isActive: true,
  },
];

export const faqs: FaqItem[] = [
  {
    id: "f1",
    order: 0,
    visible: true,
    question: {
      en: "How long does delivery take?",
      ar: "كم يستغرق التوصيل؟",
    },
    answer: {
      en: "Orders are delivered within 2–5 business days across the Kingdom.",
      ar: "تُوصَّل الطلبات خلال ٢-٥ أيام عمل في جميع أنحاء المملكة.",
    },
  },
  {
    id: "f2",
    order: 1,
    visible: true,
    question: {
      en: "What payment methods do you accept?",
      ar: "ما طرق الدفع المتاحة؟",
    },
    answer: {
      en: "We accept Tamara and Tabi installment plans, plus major cards.",
      ar: "نقبل خطط التقسيط عبر تمارا وتابي، بالإضافة إلى البطاقات الرئيسية.",
    },
  },
  {
    id: "f3",
    order: 2,
    visible: true,
    question: { en: "Can I return an item?", ar: "هل يمكنني إرجاع منتج؟" },
    answer: {
      en: "Yes — unworn items can be returned within 14 days for a full refund.",
      ar: "نعم — يمكن إرجاع المنتجات غير المستخدمة خلال ١٤ يومًا لاسترداد كامل.",
    },
  },
];

export const pages: PageContent[] = [
  {
    slug: "about",
    title: { en: "About us", ar: "من نحن" },
    body: {
      en: "Souq Atelier curates premium, long-lasting goods for the modern Saudi home and wardrobe. We work directly with makers and stand behind every piece we sell.",
      ar: "يختار سوق أتيليه منتجات فاخرة تدوم طويلًا للمنزل والخزانة السعودية العصرية. نعمل مباشرةً مع الصنّاع ونضمن كل قطعة نبيعها.",
    },
  },
  {
    slug: "contact",
    title: { en: "Contact us", ar: "تواصل معنا" },
    body: {
      en: "Have a question? Reach our team any day of the week and we'll get back to you within one business day.",
      ar: "لديك سؤال؟ تواصل مع فريقنا في أي يوم من الأسبوع وسنرد عليك خلال يوم عمل واحد.",
    },
  },
];

export const footerColumns: FooterColumn[] = [
  {
    heading: { en: "Shop", ar: "المتجر" },
    links: [
      { label: { en: "All products", ar: "جميع المنتجات" }, href: "/products" },
      { label: { en: "Categories", ar: "الفئات" }, href: "/products" },
    ],
  },
  {
    heading: { en: "Company", ar: "الشركة" },
    links: [
      { label: { en: "About", ar: "من نحن" }, href: "/about" },
      { label: { en: "Contact", ar: "تواصل معنا" }, href: "/contact" },
    ],
  },
  {
    heading: { en: "Support", ar: "الدعم" },
    links: [{ label: { en: "FAQ", ar: "الأسئلة الشائعة" }, href: "/faq" }],
  },
];

/** Pick the localized value for the active locale. */
export function pick(text: LocalizedText, locale: string): string {
  return locale === "ar" ? text.ar : text.en;
}

// ─────────────────────────────────────────────────────────────────────────────
// RESTAURANT vertical seeds (mirror the restaurant Payload collections + the
// backend Menu/Branch DTOs). Used as offline fallback by the restaurant features.
// ─────────────────────────────────────────────────────────────────────────────

export interface MenuItemSeed {
  id: string;
  slug: string;
  name: string;
  description?: string;
  price: { amount: number; currency: string };
  menuCategorySlug: string;
  imageUrls: string[];
  isVegetarian: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
}

export interface MenuCategorySeed {
  id: string;
  slug: string;
  name: string;
  displayOrder: number;
  items: MenuItemSeed[];
}

export interface BranchSeed {
  id: string;
  slug: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone?: string;
  openingHours?: string;
}

export interface PromotionSeed {
  id: string;
  order: number;
  visible: boolean;
  title: LocalizedText;
  description: LocalizedText;
  imageUrl: string;
  href: string;
}

export interface GalleryImageSeed {
  id: string;
  order: number;
  alt: LocalizedText;
  imageUrl: string;
}

export const restaurantHeroSlides: HeroSlide[] = [
  {
    id: "r-hero-1",
    order: 0,
    visible: true,
    eyebrow: { en: "Since 1998", ar: "منذ ١٩٩٨" },
    title: {
      en: "Authentic flavors, made fresh",
      ar: "نكهات أصيلة، طازجة دائماً",
    },
    subtitle: {
      en: "Regional classics cooked to order, dine in or delivered to your door.",
      ar: "أطباق كلاسيكية تُطهى عند الطلب، تناول لدينا أو توصيل إلى بابك.",
    },
    ctaLabel: { en: "View the menu", ar: "استعرض القائمة" },
    ctaHref: "/menu",
    imageUrl: IMG("photo-1517248135467-4c7edcad34c4"),
  },
];

export const menuCategories: MenuCategorySeed[] = [
  {
    id: "mc1",
    slug: "starters",
    name: "Starters",
    displayOrder: 1,
    items: [
      {
        id: "mi1",
        slug: "hummus",
        name: "Hummus",
        description: "Creamy chickpea dip with olive oil and warm bread.",
        price: { amount: 22, currency: "SAR" },
        menuCategorySlug: "starters",
        imageUrls: [IMG("photo-1637949385162-e416cd97a89f")],
        isVegetarian: true,
        isSpicy: false,
        isAvailable: true,
      },
      {
        id: "mi2",
        slug: "fattoush",
        name: "Fattoush Salad",
        description: "Crisp greens, sumac, and toasted pita.",
        price: { amount: 26, currency: "SAR" },
        menuCategorySlug: "starters",
        imageUrls: [IMG("photo-1512621776951-a57141f2eefd")],
        isVegetarian: true,
        isSpicy: false,
        isAvailable: true,
      },
    ],
  },
  {
    id: "mc2",
    slug: "mains",
    name: "Mains",
    displayOrder: 2,
    items: [
      {
        id: "mi3",
        slug: "grilled-kofta",
        name: "Grilled Kofta",
        description: "Char-grilled spiced minced meat skewers with rice.",
        price: { amount: 48, currency: "SAR" },
        menuCategorySlug: "mains",
        imageUrls: [IMG("photo-1529193591184-b1d58069ecdd")],
        isVegetarian: false,
        isSpicy: true,
        isAvailable: true,
      },
      {
        id: "mi4",
        slug: "chicken-shawarma-plate",
        name: "Chicken Shawarma Plate",
        description: "Marinated chicken, garlic sauce, and fries.",
        price: { amount: 39, currency: "SAR" },
        menuCategorySlug: "mains",
        imageUrls: [IMG("photo-1561651823-34feb02250e4")],
        isVegetarian: false,
        isSpicy: false,
        isAvailable: true,
      },
    ],
  },
  {
    id: "mc3",
    slug: "desserts",
    name: "Desserts",
    displayOrder: 3,
    items: [
      {
        id: "mi5",
        slug: "kunafa",
        name: "Kunafa",
        description: "Sweet cheese pastry soaked in syrup.",
        price: { amount: 28, currency: "SAR" },
        menuCategorySlug: "desserts",
        imageUrls: [IMG("photo-1583350701972-5b5c2e0e8a8b")],
        isVegetarian: true,
        isSpicy: false,
        isAvailable: true,
      },
    ],
  },
];

export const branches: BranchSeed[] = [
  {
    id: "b1",
    slug: "riyadh-olaya",
    name: "Riyadh — Olaya",
    address: "Olaya St, Al Olaya",
    city: "Riyadh",
    latitude: 24.6908,
    longitude: 46.6853,
    phone: "+966 11 000 0000",
    openingHours: "12:00–00:00 daily",
  },
  {
    id: "b2",
    slug: "jeddah-corniche",
    name: "Jeddah — Corniche",
    address: "Corniche Rd",
    city: "Jeddah",
    latitude: 21.581,
    longitude: 39.136,
    phone: "+966 12 000 0000",
    openingHours: "13:00–01:00 daily",
  },
];

export const promotions: PromotionSeed[] = [
  {
    id: "promo-1",
    order: 0,
    visible: true,
    title: { en: "Family feast for 4", ar: "وليمة العائلة لأربعة" },
    description: {
      en: "A generous spread of mains, sides, and dessert.",
      ar: "تشكيلة سخية من الأطباق الرئيسية والمقبلات والحلوى.",
    },
    imageUrl: IMG("photo-1555939594-58d7cb561ad1"),
    href: "/menu",
  },
  {
    id: "promo-2",
    order: 1,
    visible: true,
    title: { en: "Weekday lunch deal", ar: "عرض غداء أيام الأسبوع" },
    description: {
      en: "Any main plus a drink at a special price.",
      ar: "أي طبق رئيسي مع مشروب بسعر خاص.",
    },
    imageUrl: IMG("photo-1414235077428-338989a2e8c0"),
    href: "/menu",
  },
];

export const galleryImages: GalleryImageSeed[] = [
  { id: "g1", order: 0, alt: { en: "Grilled platter", ar: "طبق مشاوي" }, imageUrl: IMG("photo-1544025162-d76694265947") },
  { id: "g2", order: 1, alt: { en: "Fresh mezze", ar: "مقبلات طازجة" }, imageUrl: IMG("photo-1540189549336-e6e99c3679fe") },
  { id: "g3", order: 2, alt: { en: "Dining room", ar: "قاعة الطعام" }, imageUrl: IMG("photo-1517248135467-4c7edcad34c4") },
  { id: "g4", order: 3, alt: { en: "Dessert", ar: "حلوى" }, imageUrl: IMG("photo-1551024506-0bccd828d307") },
];

export const restaurantFaqs: FaqItem[] = [
  {
    id: "rf1",
    order: 0,
    visible: true,
    question: { en: "Do you take reservations?", ar: "هل تقبلون الحجوزات؟" },
    answer: {
      en: "Yes — book a table online and we'll confirm by phone.",
      ar: "نعم — احجز طاولة أونلاين وسنؤكد عبر الهاتف.",
    },
  },
  {
    id: "rf2",
    order: 1,
    visible: true,
    question: { en: "Do you offer delivery?", ar: "هل يوجد توصيل؟" },
    answer: {
      en: "We deliver from every branch during opening hours.",
      ar: "نوصّل من جميع الفروع خلال ساعات العمل.",
    },
  },
];

/** Restaurant profile for LocalBusiness JSON-LD (primary branch). */
export const restaurantProfile = {
  name: { en: "Bayt Al Nakha", ar: "بيت النكهة" },
  cuisine: "Middle Eastern",
  priceRange: "$$",
};

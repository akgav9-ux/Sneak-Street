import type { ProductDTO } from "@/db/queries";

export const CATEGORIES = [
  { slug: "sneakers", label: "Кроссовки" },
  { slug: "hoodies", label: "Худи и свитшоты" },
  { slug: "tshirts", label: "Футболки" },
  { slug: "jeans", label: "Джинсы и брюки" },
  { slug: "jackets", label: "Куртки" },
  { slug: "accessories", label: "Аксессуары" },
] as const;

export const GENDERS = [
  { value: "men", label: "Мужское" },
  { value: "women", label: "Женское" },
  { value: "unisex", label: "Унисекс" },
];

export const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const SHOE_SIZES = ["39", "40", "41", "42", "43", "44", "45", "46"];

export const COLOR_OPTIONS = [
  { name: "Чёрный", hex: "#111111" },
  { name: "Белый", hex: "#F5F5F5" },
  { name: "Серый", hex: "#9A9A9E" },
  { name: "Кремовый", hex: "#E8DFCF" },
  { name: "Красный", hex: "#E50000" },
  { name: "Синий", hex: "#3B5BA5" },
  { name: "Тёмно-синий", hex: "#1B2440" },
  { name: "Хаки", hex: "#5A5F42" },
];

export const LIGHT_HEX = ["#F5F5F5", "#E8DFCF", "#9A9A9E"];

export const BRANDS = [
  "Nike",
  "Adidas",
  "Puma",
  "New Balance",
  "Vans",
  "Converse",
  "Carhartt WIP",
  "Stüssy",
  "The North Face",
  "Essentials",
  "Levi's",
  "Sneak&Street",
];

export const SORT_OPTIONS = [
  { value: "popular", label: "Популярные" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
  { value: "newest", label: "Новинки" },
  { value: "rating", label: "Высокий рейтинг" },
];

export const categoryLabel = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

export const genderLabel = (value: string) =>
  GENDERS.find((g) => g.value === value)?.label ?? value;

export type CatalogFilters = {
  q?: string;
  category?: string[];
  gender?: string;
  brand?: string[];
  color?: string[];
  size?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  onSale?: boolean;
  isNew?: boolean;
  sort?: string;
};

export function filterProducts(
  items: ProductDTO[],
  f: CatalogFilters,
): ProductDTO[] {
  let out = items.slice();

  if (f.q) {
    const q = f.q.toLowerCase().trim();
    out = out.filter((p) =>
      `${p.name} ${p.brand} ${p.category} ${p.shortDescription}`
        .toLowerCase()
        .includes(q),
    );
  }
  if (f.category?.length) {
    out = out.filter((p) => f.category!.includes(p.category));
  }
  if (f.gender && f.gender !== "all") {
    out = out.filter((p) => p.gender === f.gender || p.gender === "unisex");
  }
  if (f.brand?.length) {
    out = out.filter((p) => f.brand!.includes(p.brand));
  }
  if (f.color?.length) {
    out = out.filter((p) => p.colors.some((c) => f.color!.includes(c.name)));
  }
  if (f.size?.length) {
    out = out.filter((p) =>
      p.sizes.some((s) => f.size!.includes(s.label) && s.stock > 0),
    );
  }
  if (typeof f.minPrice === "number") {
    out = out.filter((p) => p.price >= f.minPrice!);
  }
  if (typeof f.maxPrice === "number") {
    out = out.filter((p) => p.price <= f.maxPrice!);
  }
  if (f.minRating) {
    out = out.filter((p) => p.rating >= f.minRating! * 10);
  }
  if (f.onSale) {
    out = out.filter((p) => p.oldPrice && p.oldPrice > p.price);
  }
  if (f.isNew) {
    out = out.filter((p) => p.isNew);
  }

  switch (f.sort) {
    case "price-asc":
      out.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      out.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      out.sort((a, b) => Number(b.isNew) - Number(a.isNew) || a.id - b.id);
      break;
    case "rating":
      out.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    default:
      out.sort(
        (a, b) =>
          Number(b.isBestseller) - Number(a.isBestseller) ||
          b.reviewCount - a.reviewCount,
      );
  }
  return out;
}

export function parseFilters(sp: URLSearchParams): CatalogFilters {
  const list = (key: string) =>
    sp.getAll(key).flatMap((v) => v.split(",")).filter(Boolean);
  const num = (key: string) => {
    const v = sp.get(key);
    return v === null || v === "" ? undefined : Number(v);
  };
  return {
    q: sp.get("q") ?? undefined,
    category: list("category"),
    gender: sp.get("gender") ?? undefined,
    brand: list("brand"),
    color: list("color"),
    size: list("size"),
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    minRating: num("minRating"),
    onSale: sp.get("sale") === "1",
    isNew: sp.get("new") === "1",
    sort: sp.get("sort") ?? "popular",
  };
}
